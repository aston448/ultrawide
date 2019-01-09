
// Ultrawide Services
import { DesignUpdateSummaryServices }              from '../summary/design_update_summary_services.js';
import { WorkPackageServices }                      from '../../servicers/work/work_package_services.js';
import { TestIntegrationModules }                   from '../../service_modules/dev/test_integration_service_modules.js';
import { TestSummaryServices }                      from '../summary/test_summary_services.js';
import { ChimpMochaTestServices }                   from '../../service_modules/dev/test_processor_chimp_mocha.js';
import { UltrawideMochaTestServices }               from '../../service_modules/dev/test_processor_ultrawide_mocha.js';

import { TestRunner, LogLevel, TestType}            from '../../constants/constants.js';
import {log}                                        from '../../common/utils.js';

// Data Access
import { DesignUpdateData }                         from '../../data/design_update/design_update_db.js';
import { DesignVersionData }                        from '../../data/design/design_version_db.js';
import { UserAcceptanceTestResultData }             from '../../data/test_results/user_acceptance_test_result_db.js';
import { UserIntegrationTestResultData }            from '../../data/test_results/user_integration_test_result_db.js';
import { UserUnitTestResultData }                   from '../../data/test_results/user_unit_test_result_db.js';
import {ScenarioTestExpectationData}                from "../../data/design/scenario_test_expectations_db";
import {UserDvScenarioTestExpectationStatusData}    from "../../data/mash/user_dv_scenario_test_expectation_status_db";

//======================================================================================================================
//
// Server Code for Test Mash Processing.
//
// Methods called directly by Server API
//
//======================================================================================================================

class TestIntegrationServicesClass{

    refreshTestData(userContext){

        // To be called when the Design Version data is loaded or the Design Version changes or user requests a data refresh

        if(Meteor.isServer){

            log((msg) => console.log(msg), LogLevel.PERF, "REFRESH MASH DATA...");

            // Clear data for current user
            UserUnitTestResultData.removeAllDataForUser(userContext.userId);
            UserIntegrationTestResultData.removeAllDataForUser(userContext.userId);
            UserAcceptanceTestResultData.removeAllDataForUser(userContext.userId);

            log((msg) => console.log(msg), LogLevel.PERF, "    Old data removed.");

            // Get latest results
            TestIntegrationModules.getAcceptanceTestResults(userContext);
            TestIntegrationModules.getIntegrationTestResults(userContext);
            TestIntegrationModules.getUnitTestResults(userContext);

            // Recalculate the design-test mash
            TestIntegrationModules.recreateUserScenarioTestMashData(userContext);

            log((msg) => console.log(msg), LogLevel.PERF, "    Updating WP completeness...");

            // Update the completeness of work packages
            this.updateWorkPackageCompleteness(userContext);

            log((msg) => console.log(msg), LogLevel.PERF, "    Updating test summary...");
            // And update the test summary data
            this.updateTestSummaryData(userContext);

            log((msg) => console.log(msg), LogLevel.PERF, "    Test summary updated...");

            // Update DU Summary if a DU selected
            if(userContext.designVersionId !== 'NONE') {

                log((msg) => console.log(msg), LogLevel.PERF, "    Setting update summary data stale...");
                // Mark ALL design update summary data as stale so that results are updated when update is accessed
                DesignUpdateData.bulkSetUpdatesStale(userContext.designVersionId);

                // And update the current update now in needed
                if(userContext.designUpdateId !== 'NONE') {
                    log((msg) => console.log(msg), LogLevel.PERF, "    Recreating DU Summary data...");
                    DesignUpdateSummaryServices.recreateDesignUpdateSummaryData(userContext, true);
                }
            }

            log((msg) => console.log(msg), LogLevel.PERF, "REFRESH MASH DATA - DONE");
        }
    }

    updateScenarioTestTypeExpectationStatuses(userContext, scenarioRefId, testType){

        if(Meteor.isServer) {

            // Update / add individual test expectation statuses
            const scenarioTestTypeExpectations = ScenarioTestExpectationData.getScenarioTestExpectationsForScenarioTestType(
                userContext.designVersionId,
                scenarioRefId,
                testType
            );

            scenarioTestTypeExpectations.forEach((testExpectation) => {

                const userTestExpectationStatus = UserDvScenarioTestExpectationStatusData.getUserExpectationStatusData(
                    userContext.userId,
                    userContext.designVersionId,
                    testExpectation._id
                );

                // Get test result for the expectation - if any
                const testResult = TestIntegrationModules.getUserResultForScenarioExpectation(userContext, testExpectation);

                if (userTestExpectationStatus) {

                    // Update existing status
                    UserDvScenarioTestExpectationStatusData.setUserExpectationTestStatus(userTestExpectationStatus._id, testResult);

                } else {

                    // Insert new expectation status
                    UserDvScenarioTestExpectationStatusData.insertUserScenarioTestExpectationStatus(
                        userContext.userId,
                        userContext.designVersionId,
                        testExpectation._id,
                        testResult
                    );
                }
            });

            // Update the overall Scenario Test Type Expectation status where there are sub-expectations
            const scenarioTestTypeStatuses = TestIntegrationModules.getScenarioOverallExpectationStatus(userContext, scenarioRefId);

            scenarioTestTypeExpectations.forEach((testExpectation) => {

                if(testExpectation.permutationValueId === 'NONE'){

                    const userTestTypeExpectationStatus = UserDvScenarioTestExpectationStatusData.getUserExpectationStatusData(
                        userContext.userId,
                        userContext.designVersionId,
                        testExpectation._id
                    );

                    switch(testType){
                        case TestType.UNIT:
                            UserDvScenarioTestExpectationStatusData.setUserExpectationTestStatus(
                                userTestTypeExpectationStatus._id,
                                scenarioTestTypeStatuses.unitStatus
                            );
                            break;
                        case TestType.INTEGRATION:
                            UserDvScenarioTestExpectationStatusData.setUserExpectationTestStatus(
                                userTestTypeExpectationStatus._id,
                                scenarioTestTypeStatuses.intStatus
                            );
                            break;
                        case TestType.ACCEPTANCE:
                            UserDvScenarioTestExpectationStatusData.setUserExpectationTestStatus(
                                userTestTypeExpectationStatus._id,
                                scenarioTestTypeStatuses.accStatus
                            );
                            break;
                    }
                }
            });
        }
     }

    updateTestSummaryData(userContext){

        // Called if the test summary needs a refresh

        if(Meteor.isServer){

            // Recreate the summary mash
            TestSummaryServices.refreshAllTestSummaryData(userContext);
        }
    }

    updateTestSummaryForFeature(userContext){

        // Called if the test summary needs a refresh for just one feature

        if(Meteor.isServer){

            TestSummaryServices.updateFeatureTestSummary(userContext)
        }
    }

    updateWorkPackageCompleteness(userContext){

        const dvWorkPackages = DesignVersionData.getAllWorkPackages(userContext.designVersionId);

        dvWorkPackages.forEach((wp) => {
            WorkPackageServices.updateWorkPackageTestCompleteness(userContext, wp._id);
        })
    }

    // User generates an integration or acceptance test file from a Design or Design Update Feature
    exportIntegrationTestFile(userContext, outputDir, testRunner, testType){

        // Add in other test generation here...
        switch(testRunner){
            case TestRunner.CHIMP_MOCHA:
                UltrawideMochaTestServices.generateTestTemplateFile(userContext, outputDir, testType);
                break;
        }
    };

    exportUnitTestFile(userContext, outputDir, testRunner){

        // Add in other test generation here...
        switch(testRunner){
            case TestRunner.METEOR_MOCHA:
                UltrawideMochaTestServices.generateFeatureUnitTestTemplate(userContext, outputDir);
                break;
        }
    };

    //  // A Design Only step is moved into the Linked Steps area...
    // updateMovedDesignStep(mashDataItemId)  {
    //
    //     if(Meteor.isServer){
    //         // Mark this step as linked
    //         TestIntegrationModules.setTestStepMashStatus(mashDataItemId, MashStatus.MASH_LINKED, MashTestStatus.MASH_PENDING);
    //     }
    //
    // };

    // // A Dev Only step is moved into the Linked Steps area
    // updateMovedDevStep(devMashItemId, targetMashItemId, userContext){
    //
    //     // The target step is the one below where the new step will fall
    //
    //     // Get the index of the target step if there is one (there won't be if dropping into empty box)
    //     let targetIndex = 0;
    //     let newIndex = 0;
    //
    //     const movingStep = UserWorkPackageFeatureStepData.findOne({_id: devMashItemId});
    //     const currentScenarioId = userContext.scenarioReferenceId;
    //
    //     if(targetMashItemId) {
    //         targetIndex = UserWorkPackageFeatureStepData.findOne({_id: targetMashItemId}).mashItemIndex;
    //     }
    //
    //     if(targetIndex > 0){
    //         log((msg) => console.log(msg), LogLevel.TRACE, "Target Index =  {}", targetIndex);
    //         let previousIndex = 0;
    //
    //         // Find the next smallest index in the current set of steps
    //
    //         const currentSteps = this.getFinalScenarioSteps(currentScenarioId, userContext);
    //
    //         // The steps returned are in ascending order
    //         let lastItem = 0;
    //         currentSteps.forEach((step) => {
    //
    //             if(step._id === targetMashItemId){
    //                 previousIndex = lastItem;
    //             }
    //             lastItem = step.mashItemIndex;
    //         });
    //         log((msg) => console.log(msg), LogLevel.TRACE, "Previous Index =  {}", previousIndex);
    //
    //         newIndex = ((previousIndex + targetIndex) / 2);
    //
    //         log((msg) => console.log(msg), LogLevel.TRACE, "New Index =  {}", newIndex);
    //     }
    //
    //     // This data needs to be added to the design.  This process also updates the Mash data with the new Design item details
    //     const stepFullName = movingStep.stepType + ' ' +  movingStep.stepText;
    //     ScenarioServices.addDesignScenarioStepFromDev(currentScenarioId, userContext, movingStep.stepType, movingStep.stepText, stepFullName, newIndex, devMashItemId);
    //
    // }

    // exportScenario(scenarioReferenceId, userContext){
    //
    //     // Make out that this entire scenario is linked.  This should update the Scenario Entry and all the steps
    //     UserAccTestMashData.update(
    //         {
    //             userId:                         userContext.userId,
    //             designVersionId:                userContext.designVersionId,
    //             designUpdateId:                 userContext.designUpdateId,
    //             workPackageId:                  userContext.workPackageId,
    //             designScenarioReferenceId:      scenarioReferenceId
    //         },
    //         {
    //             $set:{
    //                 mashStatus: MashStatus.MASH_LINKED
    //             }
    //         },
    //         { multi: true }
    //     );
    //
    //     // Then export the whole feature
    //     this.exportFeatureConfiguration(userContext);
    // }

    // exportFeatureConfiguration(userContext){
    //
    //     //const devContext = UserCurrentDevContext.findOne({userId: userContext.userId});
    //     // TODO Refactor this to use user context properly
    //
    //     FeatureFileServices.writeFeatureFile(userContext.featureReferenceId, userContext);
    //
    // }

    // exportIntegrationTests(userContext){
    //
    //     FeatureFileServices.writeIntegrationFile(userContext);
    //
    // }


    // GENERIC FIND FUNCTIONS ==========================================================================================
    //
    // getFinalScenarioSteps(designScenarioReferenceId, userContext) {
    //     return UserWorkPackageFeatureStepData.find(
    //         {
    //             userId: userContext.userId,
    //             designVersionId: userContext.designVersionId,
    //             designUpdateId: userContext.designUpdateId,
    //             workPackageId: userContext.workPackageId,
    //             designScenarioReferenceId: designScenarioReferenceId,
    //             accMashStatus: MashStatus.MASH_LINKED
    //         },
    //         {sort: {mashItemIndex: 1}}
    //     ).fetch();
    // };

    // getDesignOnlyScenarioSteps(designScenarioReferenceId, userContext) {
    //     return UserWorkPackageFeatureStepData.find(
    //         {
    //             userId: userContext.userId,
    //             designVersionId: userContext.designVersionId,
    //             designUpdateId: userContext.designUpdateId,
    //             workPackageId: userContext.workPackageId,
    //             designScenarioReferenceId: designScenarioReferenceId,
    //             accMashStatus: MashStatus.MASH_NOT_IMPLEMENTED
    //         },
    //         {sort: {mashItemIndex: 1}}
    //     ).fetch();
    // };

}

export const TestIntegrationServices = new TestIntegrationServicesClass();
