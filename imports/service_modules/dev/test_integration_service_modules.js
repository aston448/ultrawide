
// Ultrawide Services
import { TestType, TestRunner, MashStatus, MashTestStatus, LogLevel } from '../../constants/constants.js';
import { log } from '../../common/utils.js';

import UltrawideMochaTestServices       from '../../service_modules/dev/test_processor_ultrawide_mocha.js';

// Data Access
import DesignComponentData              from '../../service_modules_db/design/design_component_db.js';
import UserIntegrationTestResultData    from '../../service_modules_db/test_results/user_integration_test_result_db.js';
import UserUnitTestResultData           from '../../service_modules_db/test_results/user_unit_test_result_db.js';
import UserTestTypeLocationData         from '../../service_modules_db/configure/user_test_type_location_db.js';
import TestOutputLocationData           from '../../service_modules_db/configure/test_output_location_db.js';
import TestOutputLocationFileData       from '../../service_modules_db/configure/test_output_location_file_db.js';
import UserDvMashScenarioData           from '../../service_modules_db/mash/user_dv_mash_scenario_db.js'
import UserMashScenarioTestData         from '../../service_modules_db/mash/user_mash_scenario_test_db.js';
;
//======================================================================================================================
//
// Server Modules for Test Integration Services.
//
// Methods called from within main API methods
//
//======================================================================================================================

class TestIntegrationModules{

    getIntegrationTestResults(userContext){

        log((msg) => console.log(msg), LogLevel.DEBUG, "Getting Integration test results...");

        // Clear data for current user
        UserIntegrationTestResultData.removeAllDataForUser(userContext.userId);

        log((msg) => console.log(msg), LogLevel.DEBUG, "    Old data removed.");

        // Get a list of the expected test files for integration

        // See which locations the user has marked as containing integration files for the current role
        const userLocations = UserTestTypeLocationData.getUserIntegrationTestsLocations(userContext.userId);

        log((msg) => console.log(msg), LogLevel.TRACE, "Found {} user integration test locations", userLocations.length);

        userLocations.forEach((userLocation) => {

            log((msg) => console.log(msg), LogLevel.TRACE, "Processing user location {}", userLocation.locationName);

            // Get the actual location data
            const outputLocation = TestOutputLocationData.getOutputLocationById(userLocation.locationId);

            log((msg) => console.log(msg), LogLevel.TRACE, "Processing location {}", outputLocation.locationName);

            // Grab any files here marked as integration test outputs
            const testOutputFiles = TestOutputLocationFileData.getIntegrationTestFilesForLocation(outputLocation._id);

            log((msg) => console.log(msg), LogLevel.TRACE, "Found {} user integration test files", testOutputFiles.length);

            testOutputFiles.forEach((file) => {

                const testFile = outputLocation.locationFullPath + file.fileName;

                log((msg) => console.log(msg), LogLevel.TRACE, "Getting Integration Results from {}", testFile);

                // Call the appropriate file parser
                switch (file.testRunner) {
                    case TestRunner.CHIMP_MOCHA:
                        log((msg) => console.log(msg), LogLevel.TRACE, "Getting CHIMP_MOCHA Integration Results Data");

                        UltrawideMochaTestServices.getJsonTestResults(testFile, userContext.userId, TestType.INTEGRATION);
                        break;

                }
            });
        });
    };

    getUnitTestResults(userContext){

        // Clear data for current user
        UserUnitTestResultData.removeAllDataForUser(userContext.userId);

        log((msg) => console.log(msg), LogLevel.DEBUG, "    Old data removed.");

        // Get a list of the expected test files for unit tests

        // See which locations the user has marked as containing unit test files for the current role
        const userLocations = UserTestTypeLocationData.getUserUnitTestsLocations(userContext.userId);

        userLocations.forEach((userLocation) => {

            // Get the actual location data
            const outputLocation = TestOutputLocationData.getOutputLocationById(userLocation.locationId);

            // Grab any files here marked as integration test outputs
            const testOutputFiles = TestOutputLocationFileData.getUnitTestFilesForLocation(outputLocation._id);

            testOutputFiles.forEach((file) => {

                const testFile = outputLocation.locationFullPath + file.fileName;

                log((msg) => console.log(msg), LogLevel.DEBUG, "Getting Unit Results from {}", testFile);

                // Call the appropriate file parser
                switch (file.testRunner) {
                    case TestRunner.METEOR_MOCHA:
                        log((msg) => console.log(msg), LogLevel.TRACE, "Getting METEOR_MOCHA Results Data");

                        UltrawideMochaTestServices.getJsonTestResults(testFile, userContext.userId, TestType.UNIT);
                        break;

                }
            });
        });
    };

    recreateUserScenarioTestMashData(userContext){

        log((msg) => console.log(msg), LogLevel.DEBUG, "Recreating user mash scenarios... {}", userContext.userId);

        // Clear all data for user-designVersion
        UserDvMashScenarioData.removeAllDvScenariosForUser(userContext.userId, userContext.designVersionId);
        UserMashScenarioTestData.removeAllDvTestsForUser(userContext.userId, userContext.designVersionId);

        log((msg) => console.log(msg), LogLevel.DEBUG, "Old data removed...");

        // Get all non-removed Scenarios for current DV
        const dvScenarios = DesignComponentData.getNonRemovedDvScenarios(userContext.designVersionId);

        log((msg) => console.log(msg), LogLevel.DEBUG, "Scenarios loaded...");

        let scenarioBatchData = [];
        let scenarioTestBatchData = [];

        dvScenarios.forEach((scenario) => {

            // See which updated test results relate to this scenario
            // Note that all test-results plugins must ensure that the Scenario is within testFullName

            let searchRegex = new RegExp(scenario.componentNameNew);

            // Unit Tests
            const unitTests = UserUnitTestResultData.getUserMatchingTestResults(userContext.userId, searchRegex);

            // Integration Tests
            const intTests = UserIntegrationTestResultData.getUserMatchingTestResults(userContext.userId, searchRegex);

            // Create the basic Scenario Mash
            let unitTestCount = 0;
            let unitTestPasses = 0;
            let unitTestFails = 0;
            let unitTestPendings = 0;
            let intTestCount = 0;
            let intTestPasses = 0;
            let intTestFails = 0;
            let intTestPendings = 0;
            let scenarioUnitTestStatus = MashTestStatus.MASH_NOT_LINKED;
            let scenarioIntTestStatus = MashTestStatus.MASH_NOT_LINKED;
            let scenarioUnitMashStatus = MashStatus.MASH_NOT_LINKED;
            let scenarioIntMashStatus = MashStatus.MASH_NOT_LINKED;

            unitTests.forEach((unitTest) => {

                unitTestCount++;
                scenarioUnitMashStatus = MashStatus.MASH_LINKED;

                if(unitTest.testResult === MashTestStatus.MASH_PASS){
                    unitTestPasses++;
                }
                if(unitTest.testResult === MashTestStatus.MASH_FAIL){
                    unitTestFails++;
                }
                if(unitTest.testResult === MashTestStatus.MASH_PENDING){
                    unitTestPendings++;
                }
                const testIdentity = this.getTestIdentity(unitTest.testFullName, scenario.componentNameNew, unitTest.testSuite, unitTest.testGroup, unitTest.testName);

                // Insert a unit test record
                scenarioTestBatchData.push(
                    {
                        userId:                     userContext.userId,                         // Meteor user id
                        designVersionId:            userContext.designVersionId,                // Current design version
                        designScenarioReferenceId:  scenario.componentReferenceId,              // Reference to matching scenario in design (if any)
                        designAspectReferenceId:    scenario.componentParentReferenceIdNew,     // Reference to parent Feature Aspect in design (if any)
                        designFeatureReferenceId:   scenario.componentFeatureReferenceIdNew,    // Reference to parent Feature in design (if any)
                        testType:                   TestType.UNIT,
                        // Data
                        suiteName:                  testIdentity.suite,                         // Feature or Module
                        groupName:                  testIdentity.group,                         // Scenario or Group
                        testName:                   testIdentity.test,                          // Scenario or Test
                        // Status
                        testOutcome:                unitTest.testResult,                        // Pending / Pass / Fail
                        testError:                  unitTest.testError,                         // Error if Failure
                        testErrorReason:            unitTest.testErrorReason,                   // Error reason if Failure
                        testStack:                  unitTest.testStackTrace,                    // Stack if Failure
                        testDuration:               unitTest.testDuration,                      // Duration if test run successfully
                    }
                );

            });

            intTests.forEach((intTest) => {

                intTestCount++;
                scenarioIntMashStatus = MashStatus.MASH_LINKED;

                if(intTest.testResult === MashTestStatus.MASH_PASS){
                    intTestPasses++;
                }
                if(intTest.testResult === MashTestStatus.MASH_FAIL){
                    intTestFails++;
                }
                if(intTest.testResult === MashTestStatus.MASH_PENDING){
                    intTestPendings++;
                }
                const testIdentity = this.getTestIdentity(intTest.testFullName, scenario.componentNameNew, intTest.testSuite, intTest.testGroup, intTest.testName);

                // Insert an int test record
                scenarioTestBatchData.push(
                    {
                        userId:                     userContext.userId,                         // Meteor user id
                        designVersionId:            userContext.designVersionId,                // Current design version
                        designScenarioReferenceId:  scenario.componentReferenceId,              // Reference to matching scenario in design (if any)
                        designAspectReferenceId:    scenario.componentParentReferenceIdNew,     // Reference to parent Feature Aspect in design (if any)
                        designFeatureReferenceId:   scenario.componentFeatureReferenceIdNew,    // Reference to parent Feature in design (if any)
                        testType:                   TestType.INTEGRATION,
                        // Data
                        suiteName:                  testIdentity.suite,                         // Feature or Module
                        groupName:                  testIdentity.group,                         // Scenario or Group
                        testName:                   testIdentity.test,                          // Scenario or Test
                        // Status
                        testOutcome:                intTest.testResult,                         // Pending / Pass / Fail
                        testError:                  intTest.testError,                          // Error if Failure
                        testErrorReason:            intTest.testErrorReason,                    // Error reason if Failure
                        testStack:                  intTest.testStackTrace,                     // Stack if Failure
                        testDuration:               intTest.testDuration,                       // Duration if test run successfully
                    }
                );
            });

            // Get the overall Scenario status based on tests
            if(unitTestFails > 0){
                scenarioUnitTestStatus = MashTestStatus.MASH_FAIL;
            } else {
                if(unitTestPasses > 0){
                    scenarioUnitTestStatus = MashTestStatus.MASH_PASS;
                } else {
                    if(unitTestPendings > 0){
                        scenarioUnitTestStatus = MashTestStatus.MASH_PENDING;
                    }
                }
            }

            if(intTestFails > 0){
                scenarioIntTestStatus = MashTestStatus.MASH_FAIL;
            } else {
                if(intTestPasses > 0){
                    scenarioIntTestStatus = MashTestStatus.MASH_PASS;
                }else {
                    if(intTestPendings > 0){
                        scenarioIntTestStatus = MashTestStatus.MASH_PENDING;
                    }
                }
            }

            if(intTestCount > 0){

            }

            // Insert a scenario summary record
            scenarioBatchData.push(
                {
                    userId:                         userContext.userId,
                    designVersionId:                userContext.designVersionId,
                    scenarioName:                   scenario.componentNameNew,
                    designFeatureReferenceId:       scenario.componentFeatureReferenceIdNew,
                    designFeatureAspectReferenceId: scenario.componentParentReferenceIdNew,
                    designScenarioReferenceId:      scenario.componentReferenceId,
                    mashItemIndex:                  scenario.componentIndexNew,
                    // Test Data
                    // Acceptance
                    // accMashStatus:                  ,                     // Whether linked to dev or not and where originating - Acceptance Tests
                    // accMashTestStatus:              ,                     // If linked, latest test results status - Acceptance Tests
                    // accPassCount:                   ,
                    // accFailCount:                   ,
                    // Integration
                    intMashStatus:                  scenarioIntMashStatus,                     // Whether linked to dev or not and where originating - Integration Tests
                    intMashTestStatus:              scenarioIntTestStatus,                     // If linked, latest test results status - Integration Tests
                    intTestCount:                   intTestCount,
                    intPassCount:                   intTestPasses,
                    intFailCount:                   intTestFails,
                    // Unit
                    unitMashStatus:                 scenarioUnitMashStatus,                     // Whether linked to dev or not and where originating - Module Tests
                    unitMashTestStatus:             scenarioUnitTestStatus,                     // If linked, latest test results status - Module Tests
                    unitTestCount:                  unitTestCount,
                    unitPassCount:                  unitTestPasses,
                    unitFailCount:                  unitTestFails,
                    dataStatus:                     MashStatus.MASH_IN_DESIGN
                }
            );

        });

        // Bulk insert the data
        if(scenarioBatchData.length > 0) {
            UserDvMashScenarioData.bulkInsertData(scenarioBatchData);
        }

        if(scenarioTestBatchData.length > 0) {
            UserMashScenarioTestData.bulkInsertData(scenarioTestBatchData);
        }
    }



    getTestIdentity(fullTitle, scenarioName, suiteName, groupName, testName){

        let suite = suiteName;
        let group = groupName;
        let test = testName;

        // If already known, just return it
        if(suiteName !== 'NONE' && groupName !== 'NONE' && testName !== 'NONE'){

            return({
                suite:  suite,
                group:  group,
                test:   test
            });
        }

        let fullTitleTest = '';

        const scenarioStart = fullTitle.indexOf(scenarioName);

        let fullTitleSuite = fullTitle.substring(0, scenarioStart).trim();

        if(fullTitleSuite === ''){

            fullTitleTest = fullTitle.substring(scenarioStart + scenarioName.length, fullTitle.length).trim();

            if(fullTitleTest === ''){
                suite = 'NONE';
                group = 'NONE';
                test = scenarioName;
            } else {
                suite = 'NONE';
                group = scenarioName;
                test = fullTitleTest;
            }

        } else {

            fullTitleTest = fullTitle.substring(scenarioStart + scenarioName.length, fullTitle.length).trim();

            if(fullTitleTest === ''){
                suite = 'NONE';
                group = fullTitleSuite;
                test = scenarioName;
            } else {
                suite = fullTitleSuite;
                group = scenarioName;
                test = fullTitleTest;
            }
        }

        return({
            suite:  suite,
            group:  group,
            test:   test
        });

    }


    // DORMANT CODE - Scenario Steps Processing ========================================================================

    // linkAcceptanceFilesToDesign(userContext){
    //
    //     // Run through the Design data and link anything that is present in a file
    //     const wpMash = UserWorkPackageMashData.find({
    //         userId:                 userContext.userId,
    //         designVersionId:        userContext.designVersionId,
    //         designUpdateId:         userContext.designUpdateId,
    //         workPackageId:          userContext.workPackageId
    //     }).fetch();
    //
    //     wpMash.forEach((wpItem) => {
    //
    //         switch(wpItem.mashComponentType){
    //             case ComponentType.FEATURE:
    //
    //                 // Link the Feature if found in a Feature file
    //
    //                 let fileFeature = UserDevFeatures.findOne({
    //                     userId: userContext.userId,
    //                     featureReferenceId: wpItem.designComponentReferenceId,
    //                 });
    //
    //                 if(fileFeature){
    //                     UserWorkPackageMashData.update(
    //                         {_id: wpItem._id},
    //                         {
    //                             $set:{
    //                                 accMashStatus: MashStatus.MASH_LINKED
    //                             }
    //                         }
    //                     );
    //                 }
    //                 break;
    //
    //             case ComponentType.SCENARIO:
    //
    //                 // Link the Scenario if found in a linked Feature
    //                 let fileScenario = UserDevFeatureScenarios.findOne({
    //                     userId: userContext.userId,
    //                     featureReferenceId: wpItem.designFeatureReferenceId,
    //                     scenarioReferenceId: wpItem.designComponentReferenceId
    //                 });
    //
    //                 if(fileScenario){
    //                     UserWorkPackageMashData.update(
    //                         {_id: wpItem._id},
    //                         {
    //                             $set:{
    //                                 accMashStatus: MashStatus.MASH_LINKED
    //                             }
    //                         }
    //                     );
    //
    //                     // And now check the steps for this Scenario
    //                     let designSteps = UserWorkPackageFeatureStepData.find({
    //                         userId:                     userContext.userId,
    //                         designVersionId:            userContext.designVersionId,
    //                         designUpdateId:             userContext.designUpdateId,
    //                         workPackageId:              userContext.workPackageId,
    //                         designScenarioReferenceId:  wpItem.designComponentReferenceId
    //                     }).fetch();
    //
    //                     designSteps.forEach((step) => {
    //
    //                         // Link the Scenario Step if found in a linked Scenario
    //                         let fileScenarioStep = UserDevFeatureScenarioSteps.findOne({
    //                             userId: userContext.userId,
    //                             featureReferenceId: wpItem.designFeatureReferenceId,
    //                             scenarioReferenceId: step.designScenarioReferenceId,
    //                             scenarioStepReferenceId: step.designComponentReferenceId
    //                         });
    //
    //                         if(fileScenarioStep){
    //                             UserWorkPackageFeatureStepData.update(
    //                                 {_id: step._id},
    //                                 {
    //                                     $set:{
    //                                         accMashStatus: MashStatus.MASH_LINKED
    //                                     }
    //                                 }
    //                             );
    //                         }
    //                     });
    //                 }
    //
    //                 break;
    //
    //         }
    //     });
    //
    //     // And Run through the file data and add in any scenarios that are DEV only for Design Features
    //     const devScenarios = UserDevFeatureScenarios.find({
    //         userId: userContext.userId,
    //         featureReferenceId: {$ne: 'NONE'},
    //         scenarioReferenceId: 'NONE'
    //     }).fetch();
    //
    //     devScenarios.forEach((scenario) => {
    //
    //         // UserWorkPackageMashData.insert(
    //         //     {
    //         //         // Design Identity
    //         //         userId: userContext.userId,
    //         //         designVersionId: userContext.designVersionId,
    //         //         designUpdateId: userContext.designUpdateId,
    //         //         workPackageId: userContext.workPackageId,
    //         //         mashComponentType: ComponentType.SCENARIO,
    //         //         designComponentName: 'NONE',
    //         //         designComponentId: 'NONE',
    //         //         designComponentReferenceId: 'NONE',
    //         //         designFeatureReferenceId: scenario.featureReferenceId,
    //         //         designFeatureAspectReferenceId: 'NONE',
    //         //         designScenarioReferenceId: 'NONE',
    //         //         // Status
    //         //         hasChildren: false,
    //         //         // Test Data
    //         //         mashItemName:                   scenario.scenarioName,
    //         //         mashItemTag:                    scenario.scenarioTag,
    //         //         // Test Results
    //         //         accMashStatus:                  MashStatus.MASH_NOT_DESIGNED,
    //         //         accMashTestStatus:              MashTestStatus.MASH_NOT_LINKED
    //         //     }
    //         // );
    //     });
    //
    //     // And also add in any DEV only Scenario Steps for Design Scenarios
    //     const devSteps = UserDevFeatureScenarioSteps.find({
    //         userId: userContext.userId,
    //         featureReferenceId: {$ne: 'NONE'},
    //         scenarioReferenceId: {$ne: 'NONE'},
    //         scenarioStepReferenceId: 'NONE'
    //     }).fetch();
    //
    //     devSteps.forEach((step) => {
    //
    //         UserWorkPackageFeatureStepData.insert(
    //             {
    //                 userId:                         userContext.userId,
    //                 designVersionId:                userContext.designVersionId,
    //                 designUpdateId:                 userContext.designUpdateId,
    //                 workPackageId:                  userContext.workPackageId,
    //                 designComponentId:              'NONE',
    //                 mashComponentType:              ComponentType.SCENARIO_STEP,
    //                 designComponentName:            'NONE',
    //                 designComponentReferenceId:     'NONE',
    //                 designFeatureReferenceId:       step.featureReferenceId,
    //                 designScenarioReferenceId:      step.scenarioReferenceId,
    //                 // Step Data
    //                 stepContext:                    StepContext.STEP_SCENARIO,
    //                 stepType:                       step.stepType,
    //                 stepText:                       step.stepText,
    //                 stepTextRaw:                    step.stepTextRaw,
    //                 // Test Data
    //                 mashItemName:                   step.stepFullName,
    //                 // Test Results
    //                 accMashStatus:                  MashStatus.MASH_NOT_DESIGNED,
    //                 accMashTestStatus:              MashTestStatus.MASH_NOT_LINKED
    //             }
    //         );
    //     });
    // }
    //
    // setTestStepMashStatus(mashStepId, stepStatus, stepTestStatus){
    //
    //     UserWorkPackageFeatureStepData.update(
    //         {_id: mashStepId},
    //         {
    //             $set: {
    //                 accMashStatus: stepStatus,
    //                 accMashTestStatus: stepTestStatus
    //             }
    //         }
    //     );
    //
    // };
    //
    // removeMashStep(mashStepId){
    //     UserWorkPackageFeatureStepData.remove(
    //         {_id: mashStepId}
    //     );
    // }
    //
    // getTestStepData(testStepName){
    //
    //     const firstSpace = testStepName.indexOf(' ');
    //     let stepType = testStepName.substring(0, firstSpace).trim();
    //     let stepText = testStepName.substring(firstSpace).trim();
    //     let rawText = DesignComponentModules.getRawTextFor(stepText);
    //
    //     return {
    //         stepType: stepType,
    //         stepText: stepText,
    //         rawText: rawText
    //     }
    // };



}

export default new TestIntegrationModules();