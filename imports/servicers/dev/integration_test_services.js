
// Collections
import { UserIntTestMashData }      from '../../collections/dev/user_int_test_mash_data.js';
import { DesignComponents }         from '../../collections/design/design_components.js';
import { DesignUpdateComponents }   from '../../collections/design_update/design_update_components.js';

// Ultrawide services
import { ComponentType, MashStatus, MashTestStatus, LogLevel }   from '../../constants/constants.js';
import {log}        from '../../common/utils.js'

import ChimpMochaTestServices from '../../service_modules/dev/test_results_processor_chimp_mocha.js';


class IntegrationTestServices {

    getIntegrationTestResults(testType, userContext){

        let resultsData = [];

        // Call the correct results service to get the test data
        switch(testType){
            case 'CHIMP_MOCHA':
                let testFile = userContext.integrationTestResultsLocation;

                resultsData = ChimpMochaTestServices.getJsonTestResults(testFile);
                break;

        }

        // Now take that standard data and construct the integration mash from it

        // Clear data for this user
        UserIntTestMashData.remove({userId: userContext.userId});

        let designItems = [];

        // Get relevant Design Data to display in the Mash: Features, Feature Aspects and Scenarios
        if(userContext.designUpdateId === 'NONE'){
            designItems = DesignComponents.find({
                designVersionId:    userContext.designVersionId,
                componentType:      { $in:[ComponentType.FEATURE, ComponentType.FEATURE_ASPECT, ComponentType.SCENARIO]}
            }).fetch();
        } else {
            designItems = DesignUpdateComponents.find({
                designVersionId:    userContext.designVersionId,
                designUpdateId:     userContext.designUpdateId,
                componentType:      { $in:[ComponentType.FEATURE, ComponentType.FEATURE_ASPECT, ComponentType.SCENARIO]}
            }).fetch();
        }

        let designItemList = [];

        // Get a uniform list

        designItems.forEach((designItem) => {

            let aspectRef = 'NONE';
            let scenarioRef = 'NONE';

            if(userContext.designUpdateId === 'NONE'){

                if(designItem.componentType === ComponentType.FEATURE_ASPECT){
                    aspectRef = designItem.componentReferenceId;
                }

                if(designItem.componentType === ComponentType.SCENARIO){
                    aspectRef = designItem.componentParentReferenceId;
                    scenarioRef = designItem.componentReferenceId;
                }

                designItemList.push({
                    itemId:         designItem._id,
                    itemName:       designItem.componentName,
                    itemType:       designItem.componentType,
                    itemRef:        designItem.componentReferenceId,
                    itemParentRef:  designItem.componentParentReferenceId,
                    featureRef:     designItem.componentFeatureReferenceId,
                    aspectRef:      aspectRef,
                    scenarioRef:    scenarioRef,
                    index:          designItem.componentIndex
                });
            } else {

                if(designItem.componentType === ComponentType.FEATURE_ASPECT){
                    aspectRef = designItem.componentReferenceId;
                }

                if(designItem.componentType === ComponentType.SCENARIO){
                    aspectRef = designItem.componentParentReferenceIdNew;
                    scenarioRef = designItem.componentReferenceId;
                }

                designItemList.push({
                    itemId:         designItem._id,
                    itemName:       designItem.componentNameNew,
                    itemType:       designItem.componentType,
                    itemRef:        designItem.componentReferenceId,
                    itemParentRef:  designItem.componentParentReferenceIdNew,
                    featureRef:     designItem.componentFeatureReferenceIdNew,
                    aspectRef:      aspectRef,
                    scenarioRef:    scenarioRef,
                    index:          designItem.componentIndex
                });
            }
        });

        // Insert all Design items into the mash as the testing baseline
        designItemList.forEach((designItem) => {
            UserIntTestMashData.insert(
                {
                    // Design Identity
                    userId:                         userContext.userId,
                    designVersionId:                userContext.designVersionId,
                    designUpdateId:                 userContext.designUpdateId,
                    workPackageId:                  userContext.workPackageId,
                    mashComponentType:              designItem.itemType,
                    designComponentName:            designItem.itemName,
                    designComponentId:              designItem.itemId,
                    designComponentReferenceId:     designItem.itemRef,
                    designFeatureReferenceId:       designItem.featureRef,
                    designFeatureAspectReferenceId: designItem.aspectRef,
                    designScenarioReferenceId:      designItem.scenarioRef,
                    mashItemIndex:                  designItem.index,
                    // Actual Dev Tests
                    suiteName:                      'NONE',
                    testName:                       'NONE',
                    // Status
                    mashStatus:                     MashStatus.MASH_NOT_IMPLEMENTED,    // Assume no test until we find one
                    mashTestStatus:                 MashTestStatus.MASH_NOT_LINKED
                }
            );
        });


        // Run through the test results and update Mash where tests are found
        resultsData.forEach((testResult) => {

            // See if the test relates to a Scenario.  The tests should be structured so that the test names are Scenarios
            // For integration tests the Scenario should be the lowest level of test so the name should be unique
            // (Module tests should be used to test within a Scenario)

            let designScenario = UserIntTestMashData.findOne({
                userId:                         userContext.userId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                workPackageId:                  userContext.workPackageId,
                mashComponentType:              ComponentType.SCENARIO,
                designComponentName:            testResult.testName
            });

            if(designScenario) {

                // Update to a linked record
                UserIntTestMashData.update(
                    {_id: designScenario._id},
                    {
                        $set:{
                            suiteName: testResult.testFullName,
                            testName: testResult.testName,
                            // Status
                            mashStatus: MashStatus.MASH_LINKED,
                            mashTestStatus: testResult.testResult
                        }
                    }
                );

            } else {
                log((msg) => console.log(msg), LogLevel.TRACE, "Inserting unknown test scenario {} + {}", testResult.testName, testResult.fullName);
                // This result matched no Design scenario so insert it as Dev only
                UserIntTestMashData.insert(
                    {
                        // Design Identity
                        userId:                         userContext.userId,
                        designVersionId:                userContext.designVersionId,
                        designUpdateId:                 userContext.designUpdateId,
                        workPackageId:                  userContext.workPackageId,
                        mashComponentType:              ComponentType.SCENARIO,
                        designComponentName:            'NONE',
                        designComponentReferenceId:     'NONE',
                        designFeatureReferenceId:       'NONE',
                        designFeatureAspectReferenceId: 'NONE',
                        designScenarioReferenceId:      'NONE',
                        mashItemIndex:                  0,
                        // Actual Dev Tests
                        suiteName:                      testResult.testFullName,
                        testName:                       testResult.testName,
                        // Status
                        mashStatus:                     MashStatus.MASH_NOT_DESIGNED,
                        mashTestStatus:                 testResult.testResult
                    }
                );
            }

        });
    };


}

export default new IntegrationTestServices();
