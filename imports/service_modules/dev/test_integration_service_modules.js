
// Ultrawide Collections
import { DesignVersionComponents }                 from '../../collections/design/design_version_components.js';
import { DesignUpdateComponents }           from '../../collections/design_update/design_update_components.js';
import { FeatureBackgroundSteps }           from '../../collections/design/feature_background_steps.js';
import { ScenarioSteps }                    from '../../collections/design/scenario_steps.js';
import { WorkPackages }                     from '../../collections/work/work_packages.js';
import { WorkPackageComponents }            from '../../collections/work/work_package_components.js';
import { UserWorkPackageMashData }          from '../../collections/dev/user_work_package_mash_data.js';
import { UserUnitTestMashData }             from '../../collections/dev/user_unit_test_mash_data.js';
import { UserWorkPackageFeatureStepData }   from '../../collections/dev/user_work_package_feature_step_data.js';
import { UserAccTestResults }               from '../../collections/dev/user_acc_test_results.js';
import { UserIntTestResults }               from '../../collections/dev/user_int_test_results.js';
import { UserUnitTestResults }              from '../../collections/dev/user_unit_test_results.js';
import { UserDevFeatures }                  from '../../collections/dev/user_dev_features.js';
import { UserDevFeatureScenarios }          from '../../collections/dev/user_dev_feature_scenarios.js';
import { UserDevFeatureScenarioSteps }      from '../../collections/dev/user_dev_feature_scenario_steps.js';
import { UserTestTypeLocations }            from '../../collections/configure/user_test_type_locations.js';
import { TestOutputLocations }              from '../../collections/configure/test_output_locations.js';
import { TestOutputLocationFiles }          from '../../collections/configure/test_output_location_files.js';
import { UserDesignVersionMashScenarios }   from '../../collections/mash/user_dv_mash_scenarios.js';

// Ultrawide Services
import { TestType, TestRunner, ComponentType, MashStatus, MashTestStatus, DevTestTag, StepContext, TestDataStatus,
    ScenarioStepStatus, ScenarioStepType, TestLocationType, TestLocationFileType, UpdateMergeStatus, LogLevel } from '../../constants/constants.js';
import { log } from '../../common/utils.js';

import  DesignComponentModules     from '../../service_modules/design/design_component_service_modules.js';
import ClientIdentityServices       from '../../apiClient/apiIdentity.js';
import MeteorMochaTestServices      from './test_processor_meteor_mocha.js';
import ChimpMochaTestServices       from './test_processor_chimp_mocha.js';
import ChimpCucumberTestServices    from './test_processor_chimp_cucumber.js';

//======================================================================================================================
//
// Server Modules for Test Integration Services.
//
// Methods called from within main API methods
//
//======================================================================================================================

class TestIntegrationModules{

    getAcceptanceTestResults(userContext){

    };

    getIntegrationTestResults(userContext){

        log((msg) => console.log(msg), LogLevel.DEBUG, "Getting Integration test results...");

        // Get a list of the expected test files for integration

        // See which locations the user has marked as containing integration files for the current role
        const userLocations = UserTestTypeLocations.find({
            userId:         userContext.userId,
            isIntLocation:  true
        }).fetch();

        log((msg) => console.log(msg), LogLevel.TRACE, "Found {} user integration test locations", userLocations.length);

        userLocations.forEach((userLocation) => {

            log((msg) => console.log(msg), LogLevel.TRACE, "Processing user location {}", userLocation.locationName);

            // Get the actual location data
            const outputLocation = TestOutputLocations.findOne({_id: userLocation.locationId});

            log((msg) => console.log(msg), LogLevel.TRACE, "Processing location {}", outputLocation.locationName);

            // Grab any files here marked as integration test outputs
            const testOutputFiles = TestOutputLocationFiles.find({
                locationId: outputLocation._id,
                fileType:   TestLocationFileType.INTEGRATION
            }).fetch();

            log((msg) => console.log(msg), LogLevel.TRACE, "Found {} user integration test files", testOutputFiles.length);

            testOutputFiles.forEach((file) => {

                const testFile = outputLocation.locationFullPath + file.fileName;

                log((msg) => console.log(msg), LogLevel.TRACE, "Getting Integration Results from {}", testFile);

                // Call the appropriate file parser
                switch (file.testRunner) {
                    case TestRunner.CHIMP_MOCHA:
                        log((msg) => console.log(msg), LogLevel.TRACE, "Getting CHIMP_MOCHA Results Data");

                        ChimpMochaTestServices.getJsonTestResults(testFile, userContext.userId, TestType.INTEGRATION);
                        break;

                }

            });


        });


    };

    getUnitTestResults(userContext){

        // Get a list of the expected test files for unit tests

        // See which locations the user has marked as containing unit test files for the current role
        const userLocations = UserTestTypeLocations.find({
            userId: userContext.userId,
            isUnitLocation: true
        }).fetch();

        userLocations.forEach((userLocation) => {

            // Get the actual location data
            const outputLocation = TestOutputLocations.findOne({_id: userLocation.locationId});

            // Grab any files here marked as integration test outputs
            const testOutputFiles = TestOutputLocationFiles.find({
                locationId: outputLocation._id,
                fileType:   TestLocationFileType.UNIT
            }).fetch();

            testOutputFiles.forEach((file) => {

                const testFile = outputLocation.locationFullPath + file.fileName;

                log((msg) => console.log(msg), LogLevel.DEBUG, "Getting Unit Results from {}", testFile);

                // Call the appropriate file parser
                switch (file.testRunner) {
                    case TestRunner.METEOR_MOCHA:
                        log((msg) => console.log(msg), LogLevel.TRACE, "Getting METEOR_MOCHA Results Data");

                        MeteorMochaTestServices.getJsonTestResults(testFile, userContext.userId, TestType.UNIT);
                        break;

                }

            });

        });
    };

    updateUserMashScenariosForDesignVersion(userContext){

        log((msg) => console.log(msg), LogLevel.DEBUG, "Recreating user mash scenarios... {}", userContext.userId);


        // Clear all data for user
        UserDesignVersionMashScenarios.remove({
            userId:             userContext.userId,
            designVersionId:    userContext.designVersionId
        });


        // Get all non-removed Scenarios for current DV
        const dvScenarios = DesignVersionComponents.find({
            designVersionId:    userContext.designVersionId,
            componentType:      ComponentType.SCENARIO,
            updateMergeStatus:  {$ne: UpdateMergeStatus.COMPONENT_REMOVED}
        }).fetch();

        let batchData = [];

        dvScenarios.forEach((scenario) => {

            // TODO - ACC RESULTS

            // INT RESULTS ---------------------------------------------------------------------------------------------
            let intResult = UserIntTestResults.findOne({
                userId:     userContext.userId,
                testName:   scenario.componentNameNew
            });

            let intMashStatus = MashStatus.MASH_NOT_IMPLEMENTED;
            let intTestResult = MashTestStatus.MASH_NOT_LINKED;
            let intError = '';
            let intStack = '';
            let intDuration = 0;

            if(intResult){
                intMashStatus = MashStatus.MASH_LINKED;
                intTestResult = intResult.testResult;
                intError = intResult.testError;
                intStack = intResult.stackTrace;
                intDuration = intResult.testDuration
            }

            // UNIT RESULTS --------------------------------------------------------------------------------------------
            let unitResults = UserUnitTestMashData.find({
                userId:     userContext.userId,
                designScenarioReferenceId: scenario.componentReferenceId
            }).fetch();

            let unitPasses = 0;
            let unitFails = 0;
            let scenarioUnitTestStatus = MashTestStatus.MASH_NOT_LINKED;
            let scenarioUnitMashStatus = MashStatus.MASH_NOT_IMPLEMENTED;

            unitResults.forEach((unitResult) => {
                if(unitResult.testOutcome === MashTestStatus.MASH_PASS){
                    unitPasses++;
                }
                if(unitResult.testOutcome === MashTestStatus.MASH_FAIL){
                    unitFails++;
                }
            });

            if(unitPasses > 0){
                scenarioUnitTestStatus = MashTestStatus.MASH_PASS;
                scenarioUnitMashStatus = MashStatus.MASH_LINKED;
            }
            // Override if failures
            if(unitFails > 0){
                scenarioUnitTestStatus = MashTestStatus.MASH_FAIL;
                scenarioUnitMashStatus = MashStatus.MASH_LINKED;
            }

            batchData.push(
                {
                    userId:                         userContext.userId,
                    designVersionId:                userContext.designVersionId,
                    scenarioName:                   scenario.componentNameNew,
                    designFeatureReferenceId:       scenario.componentFeatureReferenceIdNew,
                    designFeatureAspectReferenceId: scenario.componentParentReferenceIdNew,
                    designScenarioReferenceId:      scenario.componentReferenceId,
                    mashItemIndex:                  scenario.componentIndexNew,
                    // Test Data
                    mashItemName:                   scenario.componentNameNew,
                    mashItemTag:                    DevTestTag.TEST_TEST,
                    // Test Results
                    accMashStatus:                  MashStatus.MASH_NOT_LINKED,
                    accMashTestStatus:              MashTestStatus.MASH_NOT_LINKED,
                    intMashStatus:                  intMashStatus,
                    intMashTestStatus:              intTestResult,
                    unitMashStatus:                 scenarioUnitMashStatus,
                    unitMashTestStatus:             scenarioUnitTestStatus,
                    unitPassCount:                  unitPasses,
                    unitFailCount:                  unitFails,
                    accErrorMessage:                '',
                    intErrorMessage:                intError,
                    accStackTrace:                  '',
                    intStackTrace:                  intStack,
                    accDuration:                    0,
                    intDuration:                    intDuration,
                    dataStatus:                     MashStatus.MASH_IN_DESIGN
                }
            );

        });

        // Use batch insert for efficiency
        if(batchData.length > 0) {
            UserDesignVersionMashScenarios.batchInsert(batchData);
        }

        log((msg) => console.log(msg), LogLevel.DEBUG, "Recreating user mash scenarios - DONE {}", userContext.userId);
    };


    updateUnitTestScenarioResults(userContext){

        // Get the Module test results for current user
        log((msg) => console.log(msg), LogLevel.DEBUG, "Processing Unit Test Results for User {}", userContext.userId);

        UserUnitTestMashData.remove({userId: userContext.userId});

        let designScenarios = DesignVersionComponents.find({
            designVersionId:    userContext.designVersionId,
            componentType:      ComponentType.SCENARIO,
            updateMergeStatus:  {$ne: UpdateMergeStatus.COMPONENT_REMOVED}
        });

        let batchData = [];

        designScenarios.forEach((scenario) => {

            log((msg) => console.log(msg), LogLevel.TRACE, "  Processing Scenario {}", scenario.componentNameNew);

            // See which updated test results relate to this scenario
            let searchRegex = new RegExp(scenario.componentNameNew);
            let unitPassCount = 0;
            let unitFailCount = 0;

            const unitTests = UserUnitTestResults.find({
                userId:         userContext.userId,
                testFullName:   {$regex: searchRegex}
            }).fetch();

            let newResult = false;

            unitTests.forEach((unitTestResult) => {

                log((msg) => console.log(msg), LogLevel.TRACE, "    Got unit result {}", unitTestResult.testName);

                newResult = true;

                const testIdentity = this.getUnitTestIdentity(unitTestResult.testFullName, scenario.componentNameNew, unitTestResult.testName);

                let testError = '';
                let testStack = '';
                let testDuration = 0;
                if(unitTestResult.testResult === MashTestStatus.MASH_FAIL){
                    testError = unitTestResult.testError;
                    testStack = unitTestResult.stackTrace;
                    unitFailCount++;
                }
                if(unitTestResult.testResult === MashTestStatus.MASH_PASS){
                    testDuration = unitTestResult.testDuration;
                    unitPassCount++;
                }

                // Insert a new child Module Test record
                batchData.push(
                    {
                        // Identity
                        userId:                      userContext.userId,
                        suiteName:                   scenario.componentNameNew,
                        testGroupName:               testIdentity.subSuite,
                        designScenarioReferenceId:   scenario.componentReferenceId,
                        designAspectReferenceId:     scenario.componentParentReferenceIdNew,
                        designFeatureReferenceId:    scenario.componentFeatureReferenceIdNew,
                        // Data
                        testName:                    unitTestResult.testName,
                        // Status
                        mashStatus:                  MashStatus.MASH_LINKED,
                        testOutcome:                 unitTestResult.testResult,
                        testErrors:                  testError,
                        testStack:                   testStack,
                        testDuration:                testDuration,
                        isStale:                     false
                    }
                );
            });
        });

        // And bulk insert the scenario unit test results for efficiency
        if(batchData.length > 0) {
            UserUnitTestMashData.batchInsert(batchData);
        }


        log((msg) => console.log(msg), LogLevel.DEBUG, "Unit test data complete");
    }

    getUnitTestIdentity(fullTitle, scenarioName, testName){

        // A mod test full Title could be:
        // SUITE...SCENARIO...SUBSUITE...TEST
        // But SUITE and SUBSUITE might not be there

        const scenarioStart = fullTitle.indexOf(scenarioName);
        const testStart = fullTitle.indexOf(testName);

        let suite = fullTitle.substring(0, scenarioStart).trim();
        if(suite === ''){
            suite = 'Test';
        }
        let subSuite = fullTitle.substring(scenarioStart + scenarioName.length, testStart).trim();

        if(subSuite === ''){
            subSuite = suite;
        }
        return({
            suite: suite,
            subSuite: subSuite
        })
    }

    // DORMANT CODE - Scenario Steps Processing ========================================================================

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

export default new TestIntegrationModules();