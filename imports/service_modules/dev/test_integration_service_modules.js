
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
import { TestType, TestRunner, ComponentType, MashStatus, MashTestStatus, DevTestTag, StepContext, WorkPackageScopeType,
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

    getAcceptanceTestResults(userContext){

    };

    getIntegrationTestResults(userContext){

        // Clear existing results for user
        UserIntTestResults.remove({userId: userContext.userId});

        // Get a list of the expected test files for integration

        // See which locations the user has marked as containing integration files for the current role
        const userLocations = UserTestTypeLocations.find({
            userId:         userContext.userId,
            isIntLocation:  true
        }).fetch();

        log((msg) => console.log(msg), LogLevel.TRACE, "Found {} user integration test locations", userLocations.length);

        userLocations.forEach((userLocation) => {

            log((msg) => console.log(msg), LogLevel.TRACE, "Processing user location {} of type {}", userLocation.locationName, userLocation.locationType);

            // Get the actual location data
            const outputLocation = TestOutputLocations.findOne({_id: userLocation.locationId});

            log((msg) => console.log(msg), LogLevel.TRACE, "Processing location {} of type {}", outputLocation.locationName, outputLocation.locationType);

            if(outputLocation.locationType === TestLocationType.LOCAL){

                // Grab any files here marked as integration test outputs
                const testOutputFiles = TestOutputLocationFiles.find({
                    locationId: outputLocation._id,
                    fileType:   TestLocationFileType.INTEGRATION
                }).fetch();

                log((msg) => console.log(msg), LogLevel.TRACE, "Found {} user integration test files", testOutputFiles.length);

                testOutputFiles.forEach((file) => {

                    const testFile = outputLocation.locationPath + file.fileName;

                    log((msg) => console.log(msg), LogLevel.TRACE, "Getting Integration Results from {}", testFile);

                    // Call the appropriate file parser
                    switch (file.testRunner) {
                        case TestRunner.CHIMP_MOCHA:
                            log((msg) => console.log(msg), LogLevel.TRACE, "Getting CHIMP_MOCHA Results Data");

                            ChimpMochaTestServices.getJsonTestResults(testFile, userContext.userId, TestType.INTEGRATION);
                            break;

                    }

                });

            } else {

                // TODO - server access code...

            }
        });


    };

    getUnitTestResults(userContext){

        // Clear existing results for user
        UserUnitTestResults.remove({userId: userContext.userId});

        // Get a list of the expected test files for unit tests

        // See which locations the user has marked as containing unit test files for the current role
        const userLocations = UserTestTypeLocations.find({
            userId: userContext.userId,
            isUnitLocation: true
        }).fetch();

        userLocations.forEach((userLocation) => {

            // Get the actual location data
            const outputLocation = TestOutputLocations.findOne({_id: userLocation.locationId});

            if(outputLocation.locationType === TestLocationType.LOCAL){

                // Grab any files here marked as integration test outputs
                const testOutputFiles = TestOutputLocationFiles.find({
                    locationId: outputLocation._id,
                    fileType:   TestLocationFileType.UNIT
                }).fetch();

                testOutputFiles.forEach((file) => {

                    const testFile = outputLocation.locationPath + file.fileName;

                    log((msg) => console.log(msg), LogLevel.TRACE, "Getting Unit Results from {}", testFile);

                    // Call the appropriate file parser
                    switch (file.testRunner) {
                        case TestRunner.METEOR_MOCHA:
                            log((msg) => console.log(msg), LogLevel.TRACE, "Getting METEOR_MOCHA Results Data");

                            MeteorMochaTestServices.getJsonTestResults(testFile, userContext.userId, TestType.UNIT);
                            break;

                    }

                });

            } else {

                // TODO - server access code...

            }
        });





        // Call the correct results service to get the test data


    };

    createUserMashScenariosForDesignVersion(userContext){

        // Clear all data for user
        UserDesignVersionMashScenarios.remove({userId: userContext.userId});

        // Get all non-removed Scenarios for current DV
        const dvScenarios = DesignVersionComponents.find({
            designVersionId:    userContext.designVersionId,
            componentType:      ComponentType.SCENARIO,
            updateMergeStatus:  {$ne: UpdateMergeStatus.COMPONENT_REMOVED}
        }).fetch();

        dvScenarios.forEach((scenario) => {

            UserDesignVersionMashScenarios.insert({
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
                intMashStatus:                  MashStatus.MASH_NOT_LINKED,
                intMashTestStatus:              MashTestStatus.MASH_NOT_LINKED,
                unitMashStatus:                 MashStatus.MASH_NOT_LINKED,
                unitMashTestStatus:             MashTestStatus.MASH_NOT_LINKED,
                accErrorMessage:                '',
                intErrorMessage:                '',
                accStackTrace:                  '',
                intStackTrace:                  '',
                accDuration:                    0,
                intDuration:                    0,
            });
        });
    };


    updateIntTestScenarioResults(userContext){

        const intResults = UserIntTestResults.find({
            userId: userContext.userId
        });

        intResults.forEach((result) => {
            UserDesignVersionMashScenarios.update(
                {scenarioName: result.testName},
                {
                    $set: {
                        intMashStatus: MashStatus.MASH_LINKED,
                        intMashTestStatus: result.testResult,
                        intErrorMessage: result.testError,
                        intStackTrace: result.stackTrace,
                        intDuration: result.testDuration
                    }
                }
            );
        });

    };

    updateUnitTestScenarioResults(userContext){

        // Get the Module test results for current user
        log((msg) => console.log(msg), LogLevel.DEBUG, "Getting Unit Test Results for User {}", userContext.userId);

        // Set all unit tests as stale...  Anything that is not refreshed will be deleted
        // Set everything to Pending so the screen visually refreshes
        UserUnitTestMashData.update(
            {
                userId: userContext.userId
            },
            {
                $set:{
                    testOutcome: MashTestStatus.MASH_PENDING,
                    isStale: true
                }
            },
            {multi: true}
        );

        UserDesignVersionMashScenarios.update(
            {
                userId: userContext.userId
            },
            {
                $set: {
                    unitMashTestStatus: MashTestStatus.MASH_PENDING
                }
            },
            {multi: true}
        );

        const unitResultsData = UserUnitTestResults.find({userId: userContext.userId}).fetch();


        let mashScenarios =  UserDesignVersionMashScenarios.find({
            userId: userContext.userId,
            designVersionId: userContext.designVersionId
        }).fetch();

        if(unitResultsData.length > 0) {

            // Parse Test Results
            unitResultsData.forEach((testResult) => {

                let testIdentity = {
                    suite: testResult.testName,
                    subSuite: testResult.testName
                };

                log((msg) => console.log(msg), LogLevel.TRACE, "Unit Test Result: {}", testResult.testFullName);

                let testError = '';
                let testStack = '';
                let testDuration = 0;
                if(testResult.testResult === MashTestStatus.MASH_FAIL){
                    testError = testResult.testError;
                    testStack = testResult.stackTrace;
                }
                if(testResult.testResult === MashTestStatus.MASH_PASS){
                    testDuration = testResult.testDuration;
                }

                let linked = false;


                // See if the test relates to a Scenario
                mashScenarios.forEach((designScenario) => {

                    if(testResult.testFullName.includes(designScenario.scenarioName)){

                        log((msg) => console.log(msg), LogLevel.TRACE, "  Matched Scenario: {}", designScenario.scenarioName);



                        // Update the Mash
                        UserDesignVersionMashScenarios.update(
                            {_id: designScenario._id},
                            {
                                $set: {
                                    unitMashStatus: MashStatus.MASH_LINKED,
                                    //unitMashTestStatus: MashTestStatus.MASH_PENDING // Depends on the sum of all Module tests
                                }
                            }
                        );

                        // Update existing module result
                        let updated = UserUnitTestMashData.update(
                            {
                                userId:                      userContext.userId,
                                suiteName:                   designScenario.scenarioName,
                                //testGroupName:               testIdentity.subSuite,
                                testName:                    testResult.testName
                            },
                            {
                                $set:{
                                    mashStatus:         MashStatus.MASH_LINKED,
                                    testOutcome:        testResult.testResult,
                                    testErrors:         testError,
                                    testStack:          testStack,
                                    testDuration:       testDuration,
                                    isStale:            false
                                }
                            }
                        );

                        log((msg) => console.log(msg), LogLevel.TRACE, "  Updated Scenario: {}", designScenario.scenarioName);

                        if(updated === 0){

                            testIdentity = this.getUnitTestIdentity(testResult.testFullName, designScenario.scenarioName, testResult.testName);

                            // Insert a new child Module Test record
                            UserUnitTestMashData.insert(
                                {
                                    // Identity
                                    userId:                      userContext.userId,
                                    suiteName:                   designScenario.scenarioName,
                                    testGroupName:               testIdentity.subSuite,
                                    designScenarioReferenceId:   designScenario.designScenarioReferenceId,
                                    designAspectReferenceId:     designScenario.designFeatureAspectReferenceId,
                                    designFeatureReferenceId:    designScenario.designFeatureReferenceId,
                                    // Data
                                    testName:                    testResult.testName,
                                    // Status
                                    mashStatus:                  MashStatus.MASH_LINKED,
                                    testOutcome:                 testResult.testResult,
                                    testErrors:                  testError,
                                    testStack:                   testStack,
                                    testDuration:                testDuration,
                                    isStale:                     false
                                }
                            );

                            log((msg) => console.log(msg), LogLevel.TRACE, "  Inserted Scenario: {}", designScenario.scenarioName);
                        }

                        linked = true;
                    } else {
                        testIdentity = this.getUnitTestIdentity(testResult.testFullName, designScenario.scenarioName, testResult.testName);
                    }
                });

                // If no scenarios matched, insert as non-linked test
                if(!linked){

                    UserUnitTestMashData.insert(
                        {
                            // Identity
                            userId:                      userContext.userId,
                            suiteName:                   testIdentity.suite,
                            testGroupName:               testIdentity.subSuite,
                            designScenarioReferenceId:   'NONE',
                            designAspectReferenceId:     'NONE',
                            designFeatureReferenceId:    'NONE',
                            // Data
                            testName:                    testResult.testName,
                            // Status
                            mashStatus:                  MashStatus.MASH_NOT_DESIGNED,
                            testOutcome:                 testResult.testResult,
                            testErrors:                  testError,
                            testStack:                   testStack,
                            testDuration:                testDuration,
                        }
                    );
                }
            });

            // Remove any stuff that is still stale - tests that have gone or changed
            UserUnitTestMashData.remove({isStale: true});

            // Now update the mod test status of the scenario:
            // Any failures = FAIL
            // Any passes and no failures = PASS
            // Neither = NO TEST
            mashScenarios.forEach((designScenario) => {

                const modPassCount = UserUnitTestMashData.find({
                    userId:                     userContext.userId,
                    designScenarioReferenceId:  designScenario.designScenarioReferenceId,
                    mashStatus:                 MashStatus.MASH_LINKED,
                    testOutcome:                MashTestStatus.MASH_PASS
                }).count();

                const modFailCount = UserUnitTestMashData.find({
                    userId:                     userContext.userId,
                    designScenarioReferenceId:  designScenario.designScenarioReferenceId,
                    mashStatus:                 MashStatus.MASH_LINKED,
                    testOutcome:                MashTestStatus.MASH_FAIL
                }).count();

                let scenarioTestStatus = MashTestStatus.MASH_NOT_LINKED;

                if(modPassCount > 0){
                    scenarioTestStatus = MashTestStatus.MASH_PASS;
                }
                // Override if failures
                if(modFailCount > 0){
                    scenarioTestStatus = MashTestStatus.MASH_FAIL;
                }

                // Update the Mash i
                UserDesignVersionMashScenarios.update(
                    {_id: designScenario._id},
                    {
                        $set: {
                            unitMashTestStatus: scenarioTestStatus
                        }
                    }
                );

            });

        } else {
            log((msg) => console.log(msg), LogLevel.DEBUG, "No module test results data");
        }

    }




    updateMashResults(userContext, viewOptions){

        // Run through the test results and update Mash where tests are found

        if(viewOptions.devAccTestsVisible){

            // Get the Acceptance test SCENARIO results for current user - STEP results are in separate data mash
            log((msg) => console.log(msg), LogLevel.TRACE, "Getting Acc Test Results for User {}", userContext.userId);

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
                            log((msg) => console.log(msg), LogLevel.TRACE, "Adding unknown Scenario {} for Feature {}", testResult.scenarioName, testResult.featureName);

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
                    if(testResult.stepName !== 'NONE') {

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

}

export default new TestIntegrationModules();