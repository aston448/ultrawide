
// Ultrawide Collections
import { UserIntTestMashData }      from '../../collections/dev/user_int_test_mash_data.js';
import { DesignComponents }         from '../../collections/design/design_components.js';
import { DesignUpdateComponents }   from '../../collections/design_update/design_update_components.js';

// Ultrawide services
import { ComponentType, MashStatus, MashTestStatus, LogLevel }   from '../../constants/constants.js';
import {log}        from '../../common/utils.js'

import ClientIdentityServices       from '../../apiClient/apiIdentity.js';
import ChimpMochaTestServices       from '../../service_modules/dev/test_results_processor_chimp_mocha.js';

//======================================================================================================================
//
// Server Code for Integration Test Processing.
//
// Methods called directly by Server API
//
//======================================================================================================================

class IntegrationTestServices {

    getIntegrationTestResults(testType, userContext){

        if(Meteor.isServer) {

            // Don't bother if not actual Ultrawide instance.  Don't want test instance trying to read its own test data
            if (ClientIdentityServices.getApplicationName() != 'ULTRAWIDE') {
                return;
            }

            let resultsData = [];

            // Call the correct results service to get the test data - if not TEST instance

            switch (testType) {
                case 'CHIMP_MOCHA':
                    let testFile = userContext.integrationTestResultsLocation;

                    resultsData = ChimpMochaTestServices.getJsonTestResults(testFile);
                    break;

            }

            // Now take that standard data and construct the integration mash from it

            // Clear data for this user
            UserIntTestMashData.remove({userId: userContext.userId});


            // Get relevant Design Data to display in the Mash: Features, Feature Aspects and Scenarios
            // But needs to be maintained in the order of the design.  This is a problem for Features when selecting the
            // whole design or a parent Design Section of other Design Sections so we need to start by compiling an ordered list
            // of Features and then adding in their children

            // Get all Applications in Design in order
            let designApplications = [];
            if (userContext.designUpdateId === 'NONE') {
                designApplications = DesignComponents.find(
                    {
                        designVersionId: userContext.designVersionId,
                        componentType: ComponentType.APPLICATION
                    },
                    {sort: {componentIndex: 1}}).fetch();
            } else {
                designApplications = DesignUpdateComponents.find(
                    {
                        designVersionId: userContext.designVersionId,
                        componentType: ComponentType.APPLICATION
                    },
                    {sort: {componentIndexNew: 1}}).fetch();
            }

            if (designApplications.length > 0) {

                // Each feature, in order, will be given an index
                let featureIndex = 0;

                // Get the Design Sections in order for each Application
                designApplications.forEach((application) => {

                    log((msg) => console.log(msg), LogLevel.DEBUG, "Getting Integration Mash Data for application {}", application.componentName);

                    // Recursively look for features in design sections under this Application
                    featureIndex = this.getDesignSubSectionFeatures(userContext, application, featureIndex);

                });

                // And update the mash data from the actual test results
                this.updateMashResults(resultsData, userContext);

            } else {
                // No point continuing
                return;
            }

        }
    };

    getDesignSubSectionFeatures(userContext, parentComponent, featureIndex){

        log((msg) => console.log(msg), LogLevel.DEBUG, "GET DESIGN SUB SECTION FEATURES.  Index {}", featureIndex);

        let currentFeatureIndex = featureIndex;
        let subsections = [];
        let features = [];

        if(userContext.designUpdateId === 'NONE'){
            subsections = DesignComponents.find(
                {
                    designVersionId:    userContext.designVersionId,
                    componentType:      ComponentType.DESIGN_SECTION,
                    componentParentId:  parentComponent._id
                },
                {sort:{componentIndex: 1}}).fetch();
        } else {
            subsections = DesignUpdateComponents.find(
                {
                    designVersionId:    userContext.designVersionId,
                    componentType:      ComponentType.DESIGN_SECTION,
                    componentParentIdNew:  parentComponent._id
                },
                {sort:{componentIndexNew: 1}}).fetch();
        }

        log((msg) => console.log(msg), LogLevel.DEBUG, "Check feature index is {}", featureIndex);

        // While there are subsections, get features and look deeper
        if(subsections.length > 0){
            //let newFeatureIndex = featureIndex;
            subsections.forEach((subsection) => {
                // Get the Features
                log((msg) => console.log(msg), LogLevel.DEBUG, "Getting Integration Mash Data Features for section {}", subsection.componentName);

                if(userContext.designUpdateId === 'NONE'){
                    features = DesignComponents.find(
                        {
                            designVersionId:    userContext.designVersionId,
                            componentType:      ComponentType.FEATURE,
                            componentParentId:  subsection._id
                        },
                        {sort:{componentIndex: 1}}).fetch();
                } else {
                    features = DesignUpdateComponents.find(
                        {
                            designVersionId:    userContext.designVersionId,
                            componentType:      ComponentType.FEATURE,
                            componentParentIdNew:  subsection._id
                        },
                        {sort:{componentIndexNew: 1}}).fetch();
                }

                // Add Mash Data for these Features
                log((msg) => console.log(msg), LogLevel.DEBUG, "Before processing features index is {}", currentFeatureIndex);
                currentFeatureIndex = this.processFeatures(userContext, features, currentFeatureIndex);
                //currentFeatureIndex = newFeatureIndex;
                log((msg) => console.log(msg), LogLevel.DEBUG, "After processing features index is {}", currentFeatureIndex);

                // Recursively look for deeper features
                currentFeatureIndex = this.getDesignSubSectionFeatures(userContext, subsection, currentFeatureIndex);
                //currentFeatureIndex = newFeatureIndex;
            });
            return currentFeatureIndex;
        } else{
            log((msg) => console.log(msg), LogLevel.DEBUG, "No subsections");
            return currentFeatureIndex;
        }

    };

    processFeatures(userContext, features, featureIndex){

        let currentFeatureIndex = featureIndex;

        features.forEach((feature) => {

            let designItems = [];

            log((msg) => console.log(msg), LogLevel.DEBUG, "Processing Mash Data for Feature {} with index {}", feature.componentName, currentFeatureIndex);

            // Get Aspects and Scenarios in the Feature
            if(userContext.designUpdateId === 'NONE'){
                designItems = DesignComponents.find({
                    designVersionId:                userContext.designVersionId,
                    componentFeatureReferenceId:    feature.componentReferenceId,
                    componentType:      { $in:[ComponentType.FEATURE_ASPECT, ComponentType.SCENARIO]}
                }).fetch();
            } else {
                designItems = DesignUpdateComponents.find({
                    designVersionId:                    userContext.designVersionId,
                    designUpdateId:                     userContext.designUpdateId,
                    componentFeatureReferenceIdNew:     feature.componentReferenceId,
                    componentType:                      { $in:[ComponentType.FEATURE_ASPECT, ComponentType.SCENARIO]}
                }).fetch();
            }

            log((msg) => console.log(msg), LogLevel.DEBUG, "Got {} design items", designItems.length);

            let designItemList = [];

            // Get a uniform list

            designItems.forEach((designItem) => {

                log((msg) => console.log(msg), LogLevel.TRACE, "Processing item {}", designItem.componentName);

                let aspectRef = 'NONE';
                let scenarioRef = 'NONE';
                let hasChildren = false;

                if(userContext.designUpdateId === 'NONE'){

                    if(designItem.componentType === ComponentType.FEATURE_ASPECT){
                        aspectRef = designItem.componentReferenceId;
                    }

                    if(designItem.componentType === ComponentType.SCENARIO){
                        aspectRef = designItem.componentParentReferenceId;
                        scenarioRef = designItem.componentReferenceId;
                    }

                    hasChildren = DesignComponents.find({componentParentId: designItem._id}).count() > 0;

                    designItemList.push({
                        itemId:         designItem._id,
                        itemName:       designItem.componentName,
                        itemType:       designItem.componentType,
                        itemRef:        designItem.componentReferenceId,
                        itemParentRef:  designItem.componentParentReferenceId,
                        featureRef:     designItem.componentFeatureReferenceId,
                        aspectRef:      aspectRef,
                        scenarioRef:    scenarioRef,
                        index:          designItem.componentIndex,
                        featureIndex:   currentFeatureIndex,
                        hasChildren:    hasChildren
                    });
                } else {

                    if(designItem.componentType === ComponentType.FEATURE_ASPECT){
                        aspectRef = designItem.componentReferenceId;
                    }

                    if(designItem.componentType === ComponentType.SCENARIO){
                        aspectRef = designItem.componentParentReferenceIdNew;
                        scenarioRef = designItem.componentReferenceId;
                    }

                    hasChildren = DesignUpdateComponents.find({componentParentIdNew: designItem._id}).count() > 0;

                    designItemList.push({
                        itemId:         designItem._id,
                        itemName:       designItem.componentNameNew,
                        itemType:       designItem.componentType,
                        itemRef:        designItem.componentReferenceId,
                        itemParentRef:  designItem.componentParentReferenceIdNew,
                        featureRef:     designItem.componentFeatureReferenceIdNew,
                        aspectRef:      aspectRef,
                        scenarioRef:    scenarioRef,
                        index:          designItem.componentIndex,
                        featureIndex:   currentFeatureIndex,
                        hasChildren:    hasChildren
                    });
                }
            });


            // Insert the Feature into the mash as the testing baseline
            let featureName = '';
            let itemIndex = 0;

            if(userContext.designUpdateId === 'NONE'){
                featureName = feature.componentName;
                itemIndex = feature.componentIndex;
            } else {
                featureName = feature.componentNameNew;
                itemIndex = feature.componentIndexNew;
            }
            UserIntTestMashData.insert(
                {
                    // Design Identity
                    userId:                         userContext.userId,
                    designVersionId:                userContext.designVersionId,
                    designUpdateId:                 userContext.designUpdateId,
                    workPackageId:                  userContext.workPackageId,
                    mashComponentType:              ComponentType.FEATURE,
                    designComponentName:            featureName,
                    designComponentId:              feature._id,
                    designComponentReferenceId:     feature.componentReferenceId,
                    designFeatureReferenceId:       feature.componentReferenceId,
                    designFeatureAspectReferenceId: 'NONE',
                    designScenarioReferenceId:      'NONE',
                    mashItemIndex:                  itemIndex,
                    mashItemFeatureIndex:           currentFeatureIndex,
                    // Actual Dev Tests
                    suiteName:                      'NONE',
                    testName:                       'NONE',
                    // Status
                    hasChildren:                    (designItemList.length > 0),
                    mashStatus:                     MashStatus.MASH_NOT_IMPLEMENTED,    // Assume no test until we find one
                    mashTestStatus:                 MashTestStatus.MASH_NOT_LINKED
                }
            );

            log((msg) => console.log(msg), LogLevel.DEBUG, "Inserted FEATURE {} with index {}", featureName, currentFeatureIndex);

            // Increment the feature index
            currentFeatureIndex++;

            // Insert all Feature child into the mash as the testing baseline
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
                        mashItemFeatureIndex:           designItem.featureIndex,
                        // Actual Dev Tests
                        suiteName:                      'NONE',
                        testName:                       'NONE',
                        // Status
                        hasChildren:                    designItem.hasChildren,
                        mashStatus:                     MashStatus.MASH_NOT_IMPLEMENTED,    // Assume no test until we find one
                        mashTestStatus:                 MashTestStatus.MASH_NOT_LINKED
                    }
                );
            });

            log((msg) => console.log(msg), LogLevel.DEBUG, "Mash data inserted");

        });

        // Return the current index so the next batch of features can start from there
        return currentFeatureIndex;
    }

    updateMashResults(resultsData, userContext){

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
                log((msg) => console.log(msg), LogLevel.TRACE, "Found test {}", testResult.testName);
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
                        mashItemFeatureIndex:           0,
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
    }

}

export default new IntegrationTestServices();
