
// Ultrawide Collections
import { DesignComponents }         from '../../collections/design/design_components.js';
import { WorkPackages }             from '../../collections/work/work_packages.js';
import { WorkPackageComponents }    from '../../collections/work/work_package_components.js';
import { UserIntTestMashData }      from '../../collections/dev/user_int_test_mash_data.js';

// Ultrawide Services
import { TestType, TestRunner, ComponentType, WorkPackageStatus, WorkPackageType, LogLevel } from '../../constants/constants.js';

import  DesignComponentServices     from '../../servicers/design/design_component_services.js';
import ClientIdentityServices       from '../../apiClient/apiIdentity.js';
import ChimpMochaTestServices       from '../../service_modules/dev/test_results_processor_chimp_mocha.js';

//======================================================================================================================
//
// Server Modules for Mash Data Services.
//
// Methods called from within main API methods
//
//======================================================================================================================

class MashDataModules{

    getAcceptanceTestResults(testType, userContext){

    };

    getIntegrationTestResults(testType, userContext){

        // Don't bother if not actual Ultrawide instance.  Don't want test instance trying to read its own test data
        if (ClientIdentityServices.getApplicationName() != 'ULTRAWIDE') {
            return;
        }

        let resultsData = [];

        // Call the correct results service to get the test data

        switch (testType) {
            case TestRunner.CHIMP_MOCHA:
                log((msg) => console.log(msg), LogLevel.DEBUG, "Getting CHIMP_MOCHA Results Data");
                let testFile = userContext.integrationTestResultsLocation;

                ChimpMochaTestServices.getJsonTestResults(testFile, userContext.userId, TestType.INTEGRATION);
                break;

        }



    };

    getModuleTestResults(testType, userContext){

    };

    calculateDesignMash(viewOptions, userContext){

        if(viewOptions.devIntTestsVisible) {

            // Clear Integration data for this user
            UserIntTestMashData.remove({userId: userContext.userId});

            // Get relevant WP Design Data to display in the Mash: Features, Feature Aspects and Scenarios
            // But needs to be maintained in the order of the design.  This is a problem for Features when selecting the
            // whole design or a parent Design Section of other Design Sections so we need to start by compiling an ordered list
            // of Features and then adding in their children

            // Get all Applications active in WP Design in order.  Must always be at least one as the parent of whatever is in the WP
            let wpApplications = [];

            if (userContext.workPackageId != 'NONE') {
                wpApplications = WorkPackageComponents.find(
                    {
                        designVersionId: userContext.designVersionId,
                        workPackageId: userContext.workPackageId,
                        componentType: ComponentType.APPLICATION,
                        $or: [{componentActive: true}, {componentParent: true}]
                    },
                    {sort: {componentIndex: 1}}).fetch();
            }

            if (wpApplications.length > 0) {

                // Each feature, in order, will be given an index
                let featureIndex = 0;

                // Get the Design Sections in order for each Application
                wpApplications.forEach((application) => {

                    log((msg) => console.log(msg), LogLevel.DEBUG, "Getting Integration Mash Data for application {}", application.componentReferenceId);

                    // Recursively look for features in design sections under this Application
                    featureIndex = this.getDesignSubSectionFeatures(userContext, application, featureIndex);

                });

                // And update the mash data from the actual test results
                this.updateMashResults(userContext);

            }
        }
    }

    getDesignSubSectionFeatures(userContext, parentComponent, featureIndex){

        log((msg) => console.log(msg), LogLevel.DEBUG, "GET DESIGN SUB SECTION FEATURES.  Index {}", featureIndex);

        let currentFeatureIndex = featureIndex;
        let subsections = [];
        let features = [];

        subsections = WorkPackageComponents.find(
            {
                designVersionId:            userContext.designVersionId,
                workPackageId:              userContext.workPackageId,
                componentType:              ComponentType.DESIGN_SECTION,
                componentParentReferenceId: parentComponent.componentReferenceId,
                $or: [{componentActive: true}, {componentParent: true}]
            },
            {sort:{componentIndex: 1}}).fetch();

        log((msg) => console.log(msg), LogLevel.TRACE, "Check feature index is {}", featureIndex);

        // While there are subsections, get features and look deeper
        if(subsections.length > 0){

            subsections.forEach((subsection) => {
                // Get the Features
                log((msg) => console.log(msg), LogLevel.DEBUG, "Getting Integration Mash Data Features for section {}", subsection.componentReferenceId);

                features = WorkPackageComponents.find(
                    {
                        designVersionId:            userContext.designVersionId,
                        workPackageId:              userContext.workPackageId,
                        componentType:              ComponentType.FEATURE,
                        componentParentReferenceId: subsection.componentReferenceId,
                        $or: [{componentActive: true}, {componentParent: true}]
                    },
                    {sort:{componentIndex: 1}}).fetch();

                // Add Mash Data for these Features
                log((msg) => console.log(msg), LogLevel.TRACE, "Before processing features index is {}", currentFeatureIndex);
                currentFeatureIndex = this.processFeatures(userContext, features, currentFeatureIndex);
                log((msg) => console.log(msg), LogLevel.TRACE, "After processing features index is {}", currentFeatureIndex);

                // Recursively look for deeper features
                currentFeatureIndex = this.getDesignSubSectionFeatures(userContext, subsection, currentFeatureIndex);

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

            log((msg) => console.log(msg), LogLevel.DEBUG, "Processing Mash Data for Feature {} with index {}", feature.componentReferenceId, currentFeatureIndex);

            // Get Aspects and Scenarios in the Feature
            let wpDesignItems = WorkPackageComponents.find({
                designVersionId:                userContext.designVersionId,
                workPackageId:                  userContext.workPackageId,
                componentFeatureReferenceId:    feature.componentReferenceId,
                componentType:      { $in:[ComponentType.FEATURE_ASPECT, ComponentType.SCENARIO]},
                $or: [{componentActive: true}, {componentParent: true}]
            }).fetch();

            log((msg) => console.log(msg), LogLevel.DEBUG, "Got {} design items", wpDesignItems.length);

            let designItemList = [];

            // Get a uniform list
            wpDesignItems.forEach((designItem) => {

                log((msg) => console.log(msg), LogLevel.TRACE, "Processing item {}", designItem.componentReferenceId);

                let aspectRef = 'NONE';
                let scenarioRef = 'NONE';
                let hasChildren = false;


                if(designItem.componentType === ComponentType.FEATURE_ASPECT){
                    aspectRef = designItem.componentReferenceId;
                }

                if(designItem.componentType === ComponentType.SCENARIO){
                    aspectRef = designItem.componentParentReferenceId;
                    scenarioRef = designItem.componentReferenceId;
                }

                hasChildren = WorkPackageComponents.find(
                        {
                            designVersionId:            userContext.designVersionId,
                            workPackageId:              userContext.workPackageId,
                            componentParentReferenceId: designItem.componentReferenceId
                        }).count() > 0;

                // Get the actual component name from the actual Design Component.
                // Note we don't denormalise this to avoid headache of name changes having to be propagated manually
                let designComponentName = '';
                if(userContext.designUpdateId === 'NONE'){

                    designComponentName = DesignComponents.findOne({
                        _id: designItem.componentId
                    }).componentName;

                } else {

                    designComponentName = DesignUpdateComponents.findOne({
                        _id: designItem.componentId
                    }).componentNameNew;
                }

                designItemList.push({
                    itemId:         designItem.componentId,
                    itemName:       designComponentName,
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

            });


            // Insert the Feature into the mash as the testing baseline
            let featureName = '';
            let itemIndex = feature.componentIndex;

            // Get the actual Feature name from the actual Design Component.
            // Note we don't denormalise this to avoid headache of name changes having to be propagated manually
            if(userContext.designUpdateId === 'NONE'){

                featureName = DesignComponents.findOne({
                    _id: feature.componentId
                }).componentName;

            } else {

                featureName = DesignUpdateComponents.findOne({
                    _id: feature.componentId
                }).componentNameNew;

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
                    designComponentId:              feature.componentId,
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

            // Insert all Feature children into the mash as the testing baseline
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
        if(resultsData.length > 0) {
            resultsData.forEach((testResult) => {

                // See if the test relates to a Scenario.  The tests should be structured so that the test names are Scenarios
                // For integration tests the Scenario should be the lowest level of test so the name should be unique
                // (Module tests should be used to test within a Scenario)

                let designScenario = UserIntTestMashData.findOne({
                    userId: userContext.userId,
                    designVersionId: userContext.designVersionId,
                    designUpdateId: userContext.designUpdateId,
                    workPackageId: userContext.workPackageId,
                    mashComponentType: ComponentType.SCENARIO,
                    designComponentName: testResult.testName
                });

                if (designScenario) {
                    log((msg) => console.log(msg), LogLevel.TRACE, "Found test {}", testResult.testName);
                    // Update to a linked record
                    UserIntTestMashData.update(
                        {_id: designScenario._id},
                        {
                            $set: {
                                suiteName: testResult.testFullName,
                                testName: testResult.testName,
                                // Status
                                mashStatus: MashStatus.MASH_LINKED,
                                mashTestStatus: testResult.testResult
                            }
                        }
                    );

                    // } else {
                    //     log((msg) => console.log(msg), LogLevel.TRACE, "Inserting unknown test scenario {} + {}", testResult.testName, testResult.fullName);
                    //     // This result matched no Design scenario so insert it as Dev only
                    //     UserIntTestMashData.insert(
                    //         {
                    //             // Design Identity
                    //             userId: userContext.userId,
                    //             designVersionId: userContext.designVersionId,
                    //             designUpdateId: userContext.designUpdateId,
                    //             workPackageId: userContext.workPackageId,
                    //             mashComponentType: ComponentType.SCENARIO,
                    //             designComponentName: 'NONE',
                    //             designComponentReferenceId: 'NONE',
                    //             designFeatureReferenceId: 'NONE',
                    //             designFeatureAspectReferenceId: 'NONE',
                    //             designScenarioReferenceId: 'NONE',
                    //             mashItemIndex: 0,
                    //             mashItemFeatureIndex: 0,
                    //             // Actual Dev Tests
                    //             suiteName: testResult.testFullName,
                    //             testName: testResult.testName,
                    //             // Status
                    //             mashStatus: MashStatus.MASH_NOT_DESIGNED,
                    //             mashTestStatus: testResult.testResult
                    //         }
                    //     );
                }

            });
        } else {
            log((msg) => console.log(msg), LogLevel.DEBUG, "No integration test results data");
        }
    }

}

export default new MashDataModules();