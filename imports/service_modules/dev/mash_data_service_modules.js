
// Ultrawide Collections
import { DesignComponents }                 from '../../collections/design/design_components.js';
import { DesignUpdateComponents }           from '../../collections/design_update/design_update_components.js';
import { FeatureBackgroundSteps }           from '../../collections/design/feature_background_steps.js';
import { ScenarioSteps }                    from '../../collections/design/scenario_steps.js';
import { WorkPackages }                     from '../../collections/work/work_packages.js';
import { WorkPackageComponents }            from '../../collections/work/work_package_components.js';
import { UserWorkPackageMashData }          from '../../collections/dev/user_work_package_mash_data.js';
import { UserWorkPackageFeatureStepData }   from '../../collections/dev/user_work_package_feature_step_data.js';
import { UserAccTestResults }               from '../../collections/dev/user_acc_test_results.js';
import { UserIntTestResults }               from '../../collections/dev/user_int_test_results.js';
import { UserModTestResults }               from '../../collections/dev/user_mod_test_results.js';
import { UserDevFeatures }                  from '../../collections/dev/user_dev_features.js';
import { UserDevFeatureScenarios }          from '../../collections/dev/user_dev_feature_scenarios.js';
import { UserDevFeatureScenarioSteps }      from '../../collections/dev/user_dev_feature_scenario_steps.js';

// Ultrawide Services
import { TestType, TestRunner, ComponentType, MashStatus, MashTestStatus, DevTestTag, StepContext, ScenarioStepStatus, ScenarioStepType, LogLevel } from '../../constants/constants.js';
import { log } from '../../common/utils.js';

import  DesignComponentModules     from '../../service_modules/design/design_component_service_modules.js';
import ClientIdentityServices       from '../../apiClient/apiIdentity.js';
import ChimpMochaTestServices       from '../../service_modules/dev/test_results_processor_chimp_mocha.js';
import ChimpCucumberTestServices    from '../../service_modules/dev/test_results_processor_chimp_cucumber.js';

//======================================================================================================================
//
// Server Modules for Mash Data Services.
//
// Methods called from within main API methods
//
//======================================================================================================================

class MashDataModules{

    linkAcceptanceFilesToDesign(userContext){

        // Run through the Design data and link anything that is present in a file
        const wpMash = UserWorkPackageMashData.find({
            userId:                 userContext.userId,
            designVersionId:        userContext.designVersionId,
            designUpdateId:         userContext.designUpdateId,
            workPackageId:          userContext.workPackageId
        }).fetch();

        wpMash.forEach((wpItem) => {

            switch(wpItem.mashComponentType){
                case ComponentType.FEATURE:

                    // Link the Feature if found in a Feature file

                    let fileFeature = UserDevFeatures.findOne({
                        userId: userContext.userId,
                        featureReferenceId: wpItem.designComponentReferenceId,
                    });

                    if(fileFeature){
                        UserWorkPackageMashData.update(
                            {_id: wpItem._id},
                            {
                                $set:{
                                    accMashStatus: MashStatus.MASH_LINKED
                                }
                            }
                        );
                    }
                    break;

                case ComponentType.SCENARIO:

                    // Link the Scenario if found in a linked Feature
                    let fileScenario = UserDevFeatureScenarios.findOne({
                        userId: userContext.userId,
                        featureReferenceId: wpItem.designFeatureReferenceId,
                        scenarioReferenceId: wpItem.designComponentReferenceId
                    });

                    if(fileScenario){
                        UserWorkPackageMashData.update(
                            {_id: wpItem._id},
                            {
                                $set:{
                                    accMashStatus: MashStatus.MASH_LINKED
                                }
                            }
                        );

                        // And now check the steps for this Scenario
                        let designSteps = UserWorkPackageFeatureStepData.find({
                            userId:                     userContext.userId,
                            designVersionId:            userContext.designVersionId,
                            designUpdateId:             userContext.designUpdateId,
                            workPackageId:              userContext.workPackageId,
                            designScenarioReferenceId:  wpItem.designComponentReferenceId
                        }).fetch();

                        designSteps.forEach((step) => {

                            // Link the Scenario Step if found in a linked Scenario
                            let fileScenarioStep = UserDevFeatureScenarioSteps.findOne({
                                userId: userContext.userId,
                                featureReferenceId: wpItem.designFeatureReferenceId,
                                scenarioReferenceId: step.designScenarioReferenceId,
                                scenarioStepReferenceId: step.designComponentReferenceId
                            });

                            if(fileScenarioStep){
                                UserWorkPackageFeatureStepData.update(
                                    {_id: step._id},
                                    {
                                        $set:{
                                            accMashStatus: MashStatus.MASH_LINKED
                                        }
                                    }
                                );
                            }
                        });
                    }

                    break;

            }
        });

        // And Run through the file data and add in any scenarios that are DEV only for Design Features
        const devScenarios = UserDevFeatureScenarios.find({
            userId: userContext.userId,
            featureReferenceId: {$ne: 'NONE'},
            scenarioReferenceId: 'NONE'
        }).fetch();

        devScenarios.forEach((scenario) => {

            UserWorkPackageMashData.insert(
                {
                    // Design Identity
                    userId: userContext.userId,
                    designVersionId: userContext.designVersionId,
                    designUpdateId: userContext.designUpdateId,
                    workPackageId: userContext.workPackageId,
                    mashComponentType: ComponentType.SCENARIO,
                    designComponentName: 'NONE',
                    designComponentId: 'NONE',
                    designComponentReferenceId: 'NONE',
                    designFeatureReferenceId: scenario.featureReferenceId,
                    designFeatureAspectReferenceId: 'NONE',
                    designScenarioReferenceId: 'NONE',
                    // Status
                    hasChildren: false,
                    // Test Data
                    mashItemName:                   scenario.scenarioName,
                    mashItemTag:                    scenario.scenarioTag,
                    // Test Results
                    accMashStatus:                  MashStatus.MASH_NOT_DESIGNED,
                    accMashTestStatus:              MashTestStatus.MASH_NOT_LINKED
                }
            );
        });

        // And also add in any DEV only Scenario Steps for Design Scenarios
        const devSteps = UserDevFeatureScenarioSteps.find({
            userId: userContext.userId,
            featureReferenceId: {$ne: 'NONE'},
            scenarioReferenceId: {$ne: 'NONE'},
            scenarioStepReferenceId: 'NONE'
        }).fetch();

        devSteps.forEach((step) => {

            UserWorkPackageFeatureStepData.insert(
                {
                    userId:                         userContext.userId,
                    designVersionId:                userContext.designVersionId,
                    designUpdateId:                 userContext.designUpdateId,
                    workPackageId:                  userContext.workPackageId,
                    designComponentId:              'NONE',
                    mashComponentType:              ComponentType.SCENARIO_STEP,
                    designComponentName:            'NONE',
                    designComponentReferenceId:     'NONE',
                    designFeatureReferenceId:       step.featureReferenceId,
                    designScenarioReferenceId:      step.scenarioReferenceId,
                    // Step Data
                    stepContext:                    StepContext.STEP_SCENARIO,
                    stepType:                       step.stepType,
                    stepText:                       step.stepText,
                    stepTextRaw:                    step.stepTextRaw,
                    // Test Data
                    mashItemName:                   step.stepFullName,
                    // Test Results
                    accMashStatus:                  MashStatus.MASH_NOT_DESIGNED,
                    accMashTestStatus:              MashTestStatus.MASH_NOT_LINKED
                }
            );
        });
    }

    getAcceptanceTestResults(testRunner, userContext){

        // Don't bother if not actual Ultrawide instance.  Don't want test instance trying to read its own test data
        if (ClientIdentityServices.getApplicationName() != 'ULTRAWIDE') {
            return;
        }

        // Call the correct results service to get the test data

        switch (testRunner) {
            case TestRunner.CHIMP_CUCUMBER:
                log((msg) => console.log(msg), LogLevel.DEBUG, "Getting CHIMP_CUCUMBER Results Data");
                let testFile = userContext.acceptanceTestResultsLocation;

                ChimpCucumberTestServices.getJsonTestResults(testFile, userContext.userId, TestType.ACCEPTANCE);
                break;

        }
    };

    getIntegrationTestResults(testRunner, userContext){

        // Don't bother if not actual Ultrawide instance.  Don't want test instance trying to read its own test data
        if (ClientIdentityServices.getApplicationName() != 'ULTRAWIDE') {
            return;
        }

        // Call the correct results service to get the test data

        switch (testRunner) {
            case TestRunner.CHIMP_MOCHA:
                log((msg) => console.log(msg), LogLevel.DEBUG, "Getting CHIMP_MOCHA Results Data");
                let testFile = userContext.integrationTestResultsLocation;

                ChimpMochaTestServices.getJsonTestResults(testFile, userContext.userId, TestType.INTEGRATION);
                break;

        }



    };

    getModuleTestResults(testRunner, userContext){

    };

    calculateWorkPackageMash(userContext){

        // Clear the data we are refreshing

        // Clear Work Package Mash data for this user
        UserWorkPackageMashData.remove({userId: userContext.userId});
        UserWorkPackageFeatureStepData.remove({userId: userContext.userId});

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

            UserWorkPackageMashData.insert(
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
                    // Status
                    hasChildren:                    (designItemList.length > 0),
                    // Test Data
                    mashItemName:                   featureName,
                    mashItemTag:                    DevTestTag.TEST_TEST,
                    // Test Results - assume no tests until results are found
                    accMashStatus:                  MashStatus.MASH_NOT_IMPLEMENTED,
                    accMashTestStatus:              MashTestStatus.MASH_NOT_LINKED,
                    intMashStatus:                  MashStatus.MASH_NOT_IMPLEMENTED,
                    intMashTestStatus:              MashTestStatus.MASH_NOT_LINKED,
                    modMashStatus:                  MashStatus.MASH_NOT_IMPLEMENTED,
                    modMashTestStatus:              MashTestStatus.MASH_NOT_LINKED,
                }

            );

            // Also insert any Feature Background Steps
            const backgroundSteps = FeatureBackgroundSteps.find({
                designVersionId:        userContext.designVersionId,
                designUpdateId:         userContext.designUpdateId,
                featureReferenceId:     feature.componentReferenceId,
                isRemoved:              false
            }).fetch();

            backgroundSteps.forEach((backgroundStep) => {

                UserWorkPackageFeatureStepData.insert(
                    {
                        userId:                         userContext.userId,
                        designVersionId:                userContext.designVersionId,
                        designUpdateId:                 userContext.designUpdateId,
                        workPackageId:                  userContext.workPackageId,
                        designComponentId:              backgroundStep._id,
                        mashComponentType:              ComponentType.SCENARIO_STEP,
                        designComponentName:            backgroundStep.stepFullName,
                        designComponentReferenceId:     backgroundStep.stepReferenceId,
                        designFeatureReferenceId:       feature.componentReferenceId,
                        mashItemIndex:                  backgroundStep.stepIndex,
                        mashItemFeatureIndex:           currentFeatureIndex,
                        // Step Data
                        stepContext:                    StepContext.STEP_FEATURE,
                        stepType:                       backgroundStep.stepType,
                        stepText:                       backgroundStep.stepText,
                        stepTextRaw:                    backgroundStep.stepTextRaw,
                        // Test Data
                        mashItemName:                   backgroundStep.stepFullName,
                        // Test Results
                        accMashStatus:                  MashStatus.MASH_NOT_IMPLEMENTED,
                        accMashTestStatus:              MashTestStatus.MASH_NOT_LINKED,
                    }
                );
            });


            log((msg) => console.log(msg), LogLevel.DEBUG, "Inserted Int Test FEATURE {} with index {}", featureName, currentFeatureIndex);

            // Increment the feature index
            currentFeatureIndex++;

            // Insert all Feature children into the mash as the testing baseline
            designItemList.forEach((designItem) => {

                UserWorkPackageMashData.insert(
                    {
                        // Design Identity
                        userId: userContext.userId,
                        designVersionId: userContext.designVersionId,
                        designUpdateId: userContext.designUpdateId,
                        workPackageId: userContext.workPackageId,
                        mashComponentType: designItem.itemType,
                        designComponentName: designItem.itemName,
                        designComponentId: designItem.itemId,
                        designComponentReferenceId: designItem.itemRef,
                        designFeatureReferenceId: designItem.featureRef,
                        designFeatureAspectReferenceId: designItem.aspectRef,
                        designScenarioReferenceId: designItem.scenarioRef,
                        mashItemIndex: designItem.index,
                        mashItemFeatureIndex: designItem.featureIndex,
                        // Status
                        hasChildren: designItem.hasChildren,
                        // Test Data
                        mashItemName:                   designItem.itemName,
                        mashItemTag:                    DevTestTag.TEST_TEST,
                        // Test Results - assume no tests until results are found
                        accMashStatus:                  MashStatus.MASH_NOT_IMPLEMENTED,
                        accMashTestStatus:              MashTestStatus.MASH_NOT_LINKED,
                        intMashStatus:                  MashStatus.MASH_NOT_IMPLEMENTED,
                        intMashTestStatus:              MashTestStatus.MASH_NOT_LINKED,
                        modMashStatus:                  MashStatus.MASH_NOT_IMPLEMENTED,
                        modMashTestStatus:              MashTestStatus.MASH_NOT_LINKED,
                    }
                );

                // Add any Scenario Steps too
                if(designItem.itemType === ComponentType.SCENARIO){

                    let scenarioSteps = ScenarioSteps.find({
                        designVersionId:        userContext.designVersionId,
                        designUpdateId:         userContext.designUpdateId,
                        scenarioReferenceId:    designItem.scenarioRef,
                        isRemoved:              false
                    }).fetch();

                    scenarioSteps.forEach((step) => {

                        UserWorkPackageFeatureStepData.insert(
                            {
                                userId:                         userContext.userId,
                                designVersionId:                userContext.designVersionId,
                                designUpdateId:                 userContext.designUpdateId,
                                workPackageId:                  userContext.workPackageId,
                                designComponentId:              step._id,
                                mashComponentType:              ComponentType.SCENARIO_STEP,
                                designComponentName:            step.stepFullName,
                                designComponentReferenceId:     step.stepReferenceId,
                                designFeatureReferenceId:       designItem.featureRef,
                                designScenarioReferenceId:      designItem.scenarioRef,
                                mashItemIndex:                  step.stepIndex,
                                mashItemFeatureIndex:           currentFeatureIndex,
                                // Step Data
                                stepContext:                    StepContext.STEP_SCENARIO,
                                stepType:                       step.stepType,
                                stepText:                       step.stepText,
                                stepTextRaw:                    step.stepTextRaw,
                                // Test Data
                                mashItemName:                   step.stepFullName,
                                // Test Results
                                accMashStatus:                  MashStatus.MASH_NOT_IMPLEMENTED,
                                accMashTestStatus:              MashTestStatus.MASH_NOT_LINKED,
                            }
                        );
                    });
                }

            });

            log((msg) => console.log(msg), LogLevel.DEBUG, "Mash data inserted");

        });

        // Return the current index so the next batch of features can start from there
        return currentFeatureIndex;
    }

    updateMashResults(userContext, viewOptions){

        // Run through the test results and update Mash where tests are found

        // TODO add ACC and MOD
        if(viewOptions.devAccTestsVisible){

            // Get the Acceptance test SCENARIO results for current user - STEP results are in separate data mash
            log((msg) => console.log(msg), LogLevel.DEBUG, "Getting Acc Test Results for User {}", userContext.userId);

            const accResultsData = UserAccTestResults.find({userId: userContext.userId, componentType: ComponentType.SCENARIO}).fetch();

            if(accResultsData.length > 0){

                accResultsData.forEach((testResult) => {

                    // See if the test relates to a Scenario.  The tests should be structured so that the test names are Scenarios
                    // For integration tests the Scenario should be the lowest level of test so the name should be unique
                    // (Module tests should be used to test within a Scenario)

                    let designScenario = UserWorkPackageMashData.findOne({
                        userId: userContext.userId,
                        designVersionId: userContext.designVersionId,
                        designUpdateId: userContext.designUpdateId,
                        workPackageId: userContext.workPackageId,
                        mashComponentType: ComponentType.SCENARIO,
                        designComponentName: testResult.scenarioName
                    });

                    if (designScenario) {
                        log((msg) => console.log(msg), LogLevel.TRACE, "Found test {}", testResult.scenarioName);
                        // Update to a linked record
                        UserWorkPackageMashData.update(
                            {_id: designScenario._id},
                            {
                                $set: {
                                    accMashStatus: MashStatus.MASH_LINKED,
                                    accMashTestStatus: testResult.testResult
                                }
                            }
                        );

                    } else {

                        // See if this is an unknown Scenario in a known Feature
                        let designFeature = UserWorkPackageMashData.findOne({
                            userId: userContext.userId,
                            designVersionId: userContext.designVersionId,
                            designUpdateId: userContext.designUpdateId,
                            workPackageId: userContext.workPackageId,
                            mashComponentType: ComponentType.FEATURE,
                            designComponentName: testResult.featureName
                        });

                        if(designFeature){

                            // Add a new Mash entry for this scenario under the feature as "Not in Design"
                            log((msg) => console.log(msg), LogLevel.DEBUG, "Adding unknown Scenario {} for Feature {}", testResult.scenarioName, testResult.featureName);

                            UserWorkPackageMashData.insert(
                                {
                                    // Design Identity
                                    userId: userContext.userId,
                                    designVersionId: userContext.designVersionId,
                                    designUpdateId: userContext.designUpdateId,
                                    workPackageId: userContext.workPackageId,
                                    mashComponentType: ComponentType.SCENARIO,
                                    designComponentName: 'NONE',
                                    designComponentId: 'NONE',
                                    designComponentReferenceId: 'NONE',
                                    designFeatureReferenceId: designFeature.designFeatureReferenceId,
                                    designFeatureAspectReferenceId: 'NONE',
                                    designScenarioReferenceId: 'NONE',
                                    // Status
                                    hasChildren: false,
                                    // Test Data
                                    mashItemName:                   testResult.scenarioName,
                                    mashItemTag:                    DevTestTag.TEST_TEST,
                                    // Test Results
                                    accMashStatus:                  MashStatus.MASH_NOT_DESIGNED,
                                    accMashTestStatus:              testResult.testResult
                                }
                            );
                        }
                    }

                    // And add the Scenario Step results too
                    if(testResult.stepName != 'NONE') {

                        let designScenario = UserWorkPackageMashData.findOne({
                            userId: userContext.userId,
                            designVersionId: userContext.designVersionId,
                            designUpdateId: userContext.designUpdateId,
                            workPackageId: userContext.workPackageId,
                            mashComponentType: ComponentType.SCENARIO,
                            designComponentName: testResult.scenarioName
                        });

                        if(designScenario) {

                            let designStep = UserWorkPackageFeatureStepData.findOne({
                                userId: userContext.userId,
                                designVersionId: userContext.designVersionId,
                                designUpdateId: userContext.designUpdateId,
                                workPackageId: userContext.workPackageId,
                                designScenarioReferenceId: designScenario.designComponentReferenceId,
                                designComponentName: testResult.stepName
                            });

                            if (designStep){

                                UserWorkPackageFeatureStepData.update(
                                    {_id: designStep._id},
                                    {
                                        $set: {
                                            accMashStatus: MashStatus.MASH_LINKED,
                                            accMashTestStatus: testResult.testResult
                                        }
                                    }
                                );
                            } else {

                                // Insert Scenario Steps not in the Design if Scenario is in the Design
                                let stepData = this.getTestStepData(testResult.stepName);

                                UserWorkPackageFeatureStepData.insert(
                                    {
                                        userId:                         userContext.userId,
                                        designVersionId:                userContext.designVersionId,
                                        designUpdateId:                 userContext.designUpdateId,
                                        workPackageId:                  userContext.workPackageId,
                                        designComponentId:              'NONE',
                                        mashComponentType:              ComponentType.SCENARIO_STEP,
                                        designComponentName:            'NONE',
                                        designComponentReferenceId:     'NONE',
                                        designFeatureReferenceId:       designScenario.designFeatureReferenceId,
                                        designScenarioReferenceId:      designScenario.designComponentReferenceId,
                                        // Step Data
                                        stepContext:                    StepContext.STEP_SCENARIO,
                                        stepType:                       stepData.stepType,
                                        stepText:                       stepData.stepText,
                                        stepTextRaw:                    stepData.stepTextRaw,
                                        // Test Data
                                        mashItemName:                   testResult.stepName,
                                        // Test Results
                                        accMashStatus:                  MashStatus.MASH_NOT_DESIGNED,
                                        accMashTestStatus:              MashTestStatus.MASH_NOT_LINKED,
                                    }
                                );

                            }
                        }
                    }

                });



            } else {
                log((msg) => console.log(msg), LogLevel.DEBUG, "No acceptance test results data");
            }

        }

        if(viewOptions.devIntTestsVisible) {

            // Get the Integration test results for current user
            log((msg) => console.log(msg), LogLevel.DEBUG, "Getting Int Test Results for User {}", userContext.userId);

            const intResultsData = UserIntTestResults.find({userId: userContext.userId}).fetch();

            if(intResultsData.length > 0) {
                intResultsData.forEach((testResult) => {

                    // See if the test relates to a Scenario.  The tests should be structured so that the test names are Scenarios
                    // For integration tests the Scenario should be the lowest level of test so the name should be unique
                    // (Module tests should be used to test within a Scenario)

                    let designScenario = UserWorkPackageMashData.findOne({
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
                        UserWorkPackageMashData.update(
                            {_id: designScenario._id},
                            {
                                $set: {
                                    intMashStatus: MashStatus.MASH_LINKED,
                                    intMashTestStatus: testResult.testResult
                                }
                            }
                        );

                    }

                });
            } else {
                log((msg) => console.log(msg), LogLevel.DEBUG, "No integration test results data");
            }
        }



    };

    setTestStepMashStatus(mashStepId, stepStatus, stepTestStatus){

        UserWorkPackageFeatureStepData.update(
            {_id: mashStepId},
            {
                $set: {
                    accMashStatus: stepStatus,
                    accMashTestStatus: stepTestStatus
                }
            }
        );

    };

    removeMashStep(mashStepId){
        UserWorkPackageFeatureStepData.remove(
            {_id: mashStepId}
        );
    }

    getTestStepData(testStepName){

        const firstSpace = testStepName.indexOf(' ');
        let stepType = testStepName.substring(0, firstSpace).trim();
        let stepText = testStepName.substring(firstSpace).trim();
        let rawText = DesignComponentModules.getRawTextFor(stepText);

        return {
            stepType: stepType,
            stepText: stepText,
            rawText: rawText
        }
    };





}

export default new MashDataModules();