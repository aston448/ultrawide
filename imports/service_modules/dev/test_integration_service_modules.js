
// Ultrawide Services
import { TestType, TestRunner, MashStatus, MashTestStatus, SummaryType, BacklogType, WorkItemType, LogLevel } from '../../constants/constants.js';
import { log } from '../../common/utils.js';

import { UltrawideMochaTestServices }       from '../../service_modules/dev/test_processor_ultrawide_mocha.js';

// Data Access
import { DesignComponentData }                  from '../../data/design/design_component_db.js';
import { UserAcceptanceTestResultData }         from '../../data/test_results/user_acceptance_test_result_db.js';
import { UserIntegrationTestResultData }        from '../../data/test_results/user_integration_test_result_db.js';
import { UserUnitTestResultData }               from '../../data/test_results/user_unit_test_result_db.js';
import { UserTestTypeLocationData }             from '../../data/configure/user_test_type_location_db.js';
import { TestOutputLocationData }               from '../../data/configure/test_output_location_db.js';
import { TestOutputLocationFileData }           from '../../data/configure/test_output_location_file_db.js';
import { UserRoleData }                         from '../../data/users/user_role_db.js';
import {ScenarioTestExpectationData}            from "../../data/design/scenario_test_expectations_db";
import {DesignPermutationValueData}             from "../../data/design/design_permutation_value_db";
import {UserTestData} from "../../data/test_data/user_test_data_db";
import {WorkItemData} from "../../data/work/work_item_db";
import {WorkPackageData} from "../../data/work/work_package_db";
import {DesignVersionData} from "../../data/design/design_version_db";
import {DesignAnomalyData} from "../../data/design/design_anomaly_db";
import {WorkPackageTestStatus} from "../../constants/constants";

//======================================================================================================================
//
// Server Modules for Test Integration Services.
//
// Methods called from within main API methods
//
//======================================================================================================================

class TestIntegrationModulesClass {

    getAcceptanceTestResults(userContext){

        log((msg) => console.log(msg), LogLevel.PERF, "    Getting Acceptance test results...");

        // Get a list of the expected test files for integration

        // See which locations the user has marked as containing acceptance test files for the current role
        const user = UserRoleData.getRoleByUserId(userContext.userId);

        let userLocations = [];

        if(user.isGuestViewer){
            // Use defaults
            userLocations = TestOutputLocationData.getGuestViewerLocations();

        } else {
            userLocations = UserTestTypeLocationData.getUserAcceptanceTestsLocations(userContext.userId);
        }

        log((msg) => console.log(msg), LogLevel.TRACE, "Found {} user acceptance test locations", userLocations.length);

        userLocations.forEach((userLocation) => {

            log((msg) => console.log(msg), LogLevel.TRACE, "Processing user location {}", userLocation.locationName);

            let outputLocation = null;

            if(user.isGuestViewer){
                outputLocation = userLocation;
            } else {
                // Get the actual location data
                outputLocation = TestOutputLocationData.getOutputLocationById(userLocation.locationId);
            }

            if(outputLocation) {

                log((msg) => console.log(msg), LogLevel.TRACE, "Processing location {}", outputLocation.locationName);

                // Grab any files here marked as integration test outputs
                const testOutputFiles = TestOutputLocationFileData.getAcceptanceTestFilesForLocation(outputLocation._id);

                log((msg) => console.log(msg), LogLevel.TRACE, "Found {} user acceptance test files", testOutputFiles.length);

                testOutputFiles.forEach((file) => {

                    const testFile = outputLocation.locationFullPath + file.fileName;

                    log((msg) => console.log(msg), LogLevel.DEBUG, "    Getting Acceptance Results from {}", testFile);

                    // Call the appropriate file parser
                    switch (file.testRunner) {
                        case TestRunner.CHIMP_MOCHA:
                            log((msg) => console.log(msg), LogLevel.TRACE, "Getting CHIMP_MOCHA Acceptance Results Data");

                            UltrawideMochaTestServices.getJsonTestResults(testFile, userContext.userId, TestType.ACCEPTANCE);
                            break;

                    }
                });
            }
        });
    }

    getIntegrationTestResults(userContext){

        log((msg) => console.log(msg), LogLevel.PERF, "    Getting Integration test results...");

        // Get a list of the expected test files for integration

        // See which locations the user has marked as containing integration test files for the current role
        const user = UserRoleData.getRoleByUserId(userContext.userId);

        let userLocations = [];

        if(user.isGuestViewer){
            // Use defaults
            userLocations = TestOutputLocationData.getGuestViewerLocations();

        } else {
            userLocations = UserTestTypeLocationData.getUserIntegrationTestsLocations(userContext.userId);
        }

        log((msg) => console.log(msg), LogLevel.TRACE, "Found {} user integration test locations", userLocations.length);

        userLocations.forEach((userLocation) => {

            log((msg) => console.log(msg), LogLevel.TRACE, "Processing user location {}", userLocation.locationName);

            let outputLocation = null;

            if(user.isGuestViewer){
                outputLocation = userLocation;
            } else {
                // Get the actual location data
                outputLocation = TestOutputLocationData.getOutputLocationById(userLocation.locationId);
            }

            if(outputLocation) {
                log((msg) => console.log(msg), LogLevel.TRACE, "Processing location {}", outputLocation.locationName);

                // Grab any files here marked as integration test outputs
                const testOutputFiles = TestOutputLocationFileData.getIntegrationTestFilesForLocation(outputLocation._id);

                log((msg) => console.log(msg), LogLevel.TRACE, "Found {} user integration test files", testOutputFiles.length);

                testOutputFiles.forEach((file) => {

                    const testFile = outputLocation.locationFullPath + file.fileName;

                    log((msg) => console.log(msg), LogLevel.DEBUG, "    Getting Integration Results from {}", testFile);

                    // Call the appropriate file parser
                    switch (file.testRunner) {
                        case TestRunner.CHIMP_MOCHA:
                            log((msg) => console.log(msg), LogLevel.TRACE, "Getting CHIMP_MOCHA Integration Results Data");

                            UltrawideMochaTestServices.getJsonTestResults(testFile, userContext.userId, TestType.INTEGRATION);
                            break;

                    }
                });
            }
        });
    };

    getUnitTestResults(userContext){

        // Get a list of the expected test files for unit tests
        log((msg) => console.log(msg), LogLevel.PERF, "    Getting Unit test results...");

        // See which locations the user has marked as containing unit test files for the current role
        const user = UserRoleData.getRoleByUserId(userContext.userId);

        let userLocations = [];

        if(user.isGuestViewer){
            // Use defaults
            userLocations = TestOutputLocationData.getGuestViewerLocations();

        } else {
            userLocations = UserTestTypeLocationData.getUserUnitTestsLocations(userContext.userId);
        }

        userLocations.forEach((userLocation) => {

            let outputLocation = null;

            if(user.isGuestViewer){
                outputLocation = userLocation;
            } else {
                // Get the actual location data
                outputLocation = TestOutputLocationData.getOutputLocationById(userLocation.locationId);
            }

            if(outputLocation) {

                // Grab any files here marked as integration test outputs
                const testOutputFiles = TestOutputLocationFileData.getUnitTestFilesForLocation(outputLocation._id);

                testOutputFiles.forEach((file) => {

                    const testFile = outputLocation.locationFullPath + file.fileName;

                    log((msg) => console.log(msg), LogLevel.DEBUG, "    Getting Unit Results from {}", testFile);

                    // Call the appropriate file parser
                    switch (file.testRunner) {
                        case TestRunner.METEOR_MOCHA:
                            log((msg) => console.log(msg), LogLevel.TRACE, "Getting METEOR_MOCHA Results Data");

                            UltrawideMochaTestServices.getJsonTestResults(testFile, userContext.userId, TestType.UNIT);
                            break;

                    }
                });
            }
        });
    };

    updateScenarioTestData(userContext, scenarioRefId){

        // TODO - a function to delete and recreate the test data for one Scenario.  To be called when scenario test expectations are changed

    }

    updateUserTestData(userContext){

        log((msg) => console.log(msg), LogLevel.PERF, "    Recreating user test data... {}", userContext.userId);

        // Clear existing data for user
        UserTestData.clearAllUserTestData(userContext.userId);

        // Extract out just the user's test results so that when there are many users this does not
        // slow down
        let myAcceptanceTestResults = new Mongo.Collection(null);
        let myIntegrationTestResults = new Mongo.Collection(null);
        let myUnitTestResults = new Mongo.Collection(null);

        const userAccResults = UserAcceptanceTestResultData.getUserTestResults(userContext.userId);
        myAcceptanceTestResults.batchInsert(userAccResults);

        const userIntResults = UserIntegrationTestResultData.getUserTestResults(userContext.userId);
        myIntegrationTestResults.batchInsert(userIntResults);

        const userUnitResults = UserUnitTestResultData.getUserTestResults(userContext.userId);
        myUnitTestResults.batchInsert(userUnitResults);

        const dvIncrements = WorkItemData.getDesignVersionIncrements(userContext.designVersionId);

        let scenarioTestSummaryData = [];
        let testExpectationResultsData = [];
        let backlogData = [];
        const workItemTestSummaryData = [];

        let dvAssignedTotalScenarios = 0;
        let dvAssignedTotalExpectations = 0;
        let dvAssignedTotalTests = 0;
        let dvAssignedTotalPass = 0;
        let dvAssignedTotalFail = 0;
        let dvAssignedTotalMissing = 0;
        let dvAssignedTotalNoExpectations = 0;
        let dvAssignedTotalScenarioAnomalies = 0;

        const designVersionName = DesignVersionData.getDesignVersionById(userContext.designVersionId).designVersionName;

        // Assigned Work -----------------------------------------------------------------------------------------------
        if(dvIncrements.length === 0){

            // No work plan for this DV yet
            // TODO - decide what we calculate here

        } else {

            log((msg) => console.log(msg), LogLevel.PERF, "        Processing Work Items...");


            // Increments Loop
            dvIncrements.forEach((increment) => {

                let inTotalScenarios = 0;
                let inTotalExpectations = 0;
                let inTotalTests = 0;
                let inTotalPass = 0;
                let inTotalFail = 0;
                let inTotalMissing = 0;
                let inTotalNoExpectations = 0;
                let inTotalScenarioAnomalies = 0;

                const incIterations = WorkItemData.getDesignVersionIncrementIterations(userContext.designVersionId, increment.wiReferenceId);

                // Iterations Loop
                incIterations.forEach((iteration) => {

                    log((msg) => console.log(msg), LogLevel.PERF, "          Iteration... {}", iteration.wiName);

                    let itTotalScenarios = 0;
                    let itTotalExpectations = 0;
                    let itTotalTests = 0;
                    let itTotalPass = 0;
                    let itTotalFail = 0;
                    let itTotalMissing = 0;
                    let itTotalNoExpectations = 0;
                    let itTotalScenarioAnomalies = 0;

                    const itWorkPackages = WorkItemData.getDesignVersionIterationWps(userContext.designVersionId, iteration.wiReferenceId);

                    // Work Packages Loop
                    itWorkPackages.forEach((wp) => {

                        log((msg) => console.log(msg), LogLevel.PERF, "            WP... {}", wp.workPackageName);
                        let wpTotalScenarios = 0;
                        let wpTotalExpectations = 0;
                        let wpTotalTests = 0;
                        let wpTotalPass = 0;
                        let wpTotalFail = 0;
                        let wpTotalMissing = 0;
                        let wpTotalNoExpectations = 0;
                        let wpTotalScenarioAnomalies = 0;

                        const wpScenarios = WorkPackageData.getActiveScenarios(wp._id);

                        // Scenarios Loop
                        wpScenarios.forEach((scenario) => {


                            const scenarioReturnData = this.processScenario(
                                userContext,
                                scenario,
                                testExpectationResultsData,
                                scenarioTestSummaryData,
                                myAcceptanceTestResults,
                                myIntegrationTestResults,
                                myUnitTestResults
                            );

                            // Update the cached data
                            testExpectationResultsData = scenarioReturnData.expectationResults;
                            scenarioTestSummaryData = scenarioReturnData.scenarioSummaries;

                            // Add Scenario totals to the Parent WP
                            wpTotalScenarios++;
                            wpTotalExpectations += scenarioReturnData.scenarioData.scenarioTotalExpectations;
                            wpTotalTests += scenarioReturnData.scenarioData.scenarioTotalTests;
                            wpTotalPass += scenarioReturnData.scenarioData.scenarioTotalPass;
                            wpTotalFail += scenarioReturnData.scenarioData.scenarioTotalFail;
                            wpTotalMissing += scenarioReturnData.scenarioData.scenarioTotalMissing;
                            wpTotalScenarioAnomalies += scenarioReturnData.scenarioData.scenarioTotalAnomalies;
                            if(scenarioReturnData.scenarioData.scenarioTotalExpectations === 0){
                                wpTotalNoExpectations++;
                            }

                            const newBacklogData = this.updateBacklogData(userContext, scenarioReturnData.scenario, scenarioReturnData.scenarioData, iteration._id, increment._id, wp._id, SummaryType.SUMMARY_WP);

                            newBacklogData.forEach((item) => {
                                backlogData.push(item);
                            });

                        });

                        // Push the WP data
                        workItemTestSummaryData.push({
                            userId:                     userContext.userId,
                            designVersionId:            userContext.designVersionId,
                            workItemId:                 wp._id,
                            workItemName:               wp.workPackageName,
                            workItemType:               WorkItemType.BASE_WORK_PACKAGE,         //TODO - Support Update WPs
                            totalFeatures:              0,
                            totalScenarios:             wpTotalScenarios,
                            totalExpectations:          wpTotalExpectations,
                            totalTests:                 wpTotalTests,
                            totalPassing:               wpTotalPass,
                            totalFailing:               wpTotalFail,
                            totalMissing:               wpTotalMissing,
                            totalNoExpectations:        wpTotalNoExpectations,
                            totalScenarioAnomalies:     wpTotalScenarioAnomalies,
                            totalFeatureAnomalies:      0,
                            totalScenariosUnassigned:   0
                        });

                        // Add WP totals to the Parent Iteration
                        itTotalScenarios += wpTotalScenarios;
                        itTotalExpectations += wpTotalExpectations;
                        itTotalTests += wpTotalTests;
                        itTotalPass += wpTotalPass;
                        itTotalFail += wpTotalFail;
                        itTotalMissing += wpTotalMissing;
                        itTotalNoExpectations += wpTotalNoExpectations;
                        itTotalScenarioAnomalies += wpTotalScenarioAnomalies;

                        // Update the WP test status
                        let wpTestStatus = WorkPackageTestStatus.WP_TESTS_NONE;

                        if(wpTotalFail > 0){
                            wpTestStatus = WorkPackageTestStatus.WP_TESTS_FAILING;
                        } else {
                            if(wpTotalPass > 0){
                                if(wpTotalPass === wpTotalExpectations){
                                    wpTestStatus = WorkPackageTestStatus.WP_TESTS_COMPLETE;
                                } else {
                                    wpTestStatus = WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE;
                                }
                            }
                        }

                        WorkPackageData.setWorkPackageTestStatus(wp._id, wpTestStatus);

                    });

                    // Push the Iteration data
                    workItemTestSummaryData.push({
                        userId:                     userContext.userId,
                        designVersionId:            userContext.designVersionId,
                        workItemId:                 iteration._id,
                        workItemName:               iteration.wiName,
                        workItemType:               WorkItemType.ITERATION,
                        totalFeatures:              0,
                        totalScenarios:             itTotalScenarios,
                        totalExpectations:          itTotalExpectations,
                        totalTests:                 itTotalTests,
                        totalPassing:               itTotalPass,
                        totalFailing:               itTotalFail,
                        totalMissing:               itTotalMissing,
                        totalNoExpectations:        itTotalNoExpectations,
                        totalScenarioAnomalies:     itTotalScenarioAnomalies,
                        totalFeatureAnomalies:      0,
                        totalScenariosUnassigned:   0
                    });

                    // Add Iteration totals to the Parent Increment
                    inTotalScenarios += itTotalScenarios;
                    inTotalExpectations += itTotalExpectations;
                    inTotalTests += itTotalTests;
                    inTotalPass += itTotalPass;
                    inTotalFail += itTotalFail;
                    inTotalMissing += itTotalMissing;
                    inTotalNoExpectations += itTotalNoExpectations;
                    inTotalScenarioAnomalies += itTotalScenarioAnomalies;
                });

                // Push the Increment data
                workItemTestSummaryData.push({
                    userId:                     userContext.userId,
                    designVersionId:            userContext.designVersionId,
                    workItemId:                 increment._id,
                    workItemName:               increment.wiName,
                    workItemType:               WorkItemType.INCREMENT,
                    totalFeatures:              0,
                    totalScenarios:             inTotalScenarios,
                    totalExpectations:          inTotalExpectations,
                    totalTests:                 inTotalTests,
                    totalPassing:               inTotalPass,
                    totalFailing:               inTotalFail,
                    totalMissing:               inTotalMissing,
                    totalNoExpectations:        inTotalNoExpectations,
                    totalScenarioAnomalies:     inTotalScenarioAnomalies,
                    totalFeatureAnomalies:      0,
                    totalScenariosUnassigned:   0
                });

                // Add Increment totals to the Parent DV
                dvAssignedTotalScenarios += inTotalScenarios;
                dvAssignedTotalExpectations += inTotalExpectations;
                dvAssignedTotalTests += inTotalTests;
                dvAssignedTotalPass += inTotalPass;
                dvAssignedTotalFail += inTotalFail;
                dvAssignedTotalMissing += inTotalMissing;
                dvAssignedTotalNoExpectations += inTotalNoExpectations;
                dvAssignedTotalScenarioAnomalies += inTotalScenarioAnomalies;
            });

            // Push the DV data

            workItemTestSummaryData.push({
                userId:                     userContext.userId,
                designVersionId:            userContext.designVersionId,
                workItemId:                 userContext.designVersionId,
                workItemName:               designVersionName + ' (Assigned)',
                workItemType:               WorkItemType.DV_ASSIGNED,
                totalFeatures:              0,
                totalScenarios:             dvAssignedTotalScenarios,
                totalExpectations:          dvAssignedTotalExpectations,
                totalTests:                 dvAssignedTotalTests,
                totalPassing:               dvAssignedTotalPass,
                totalFailing:               dvAssignedTotalFail,
                totalMissing:               dvAssignedTotalMissing,
                totalNoExpectations:        dvAssignedTotalNoExpectations,
                totalScenarioAnomalies:     dvAssignedTotalScenarioAnomalies,
                totalFeatureAnomalies:      0,
                totalScenariosUnassigned:   0
            });


        }

        // Unassigned Scenarios ----------------------------------------------------------------------------------------

        let dvUnassignedTotalScenarios = 0;
        let dvUnassignedTotalExpectations = 0;
        let dvUnassignedTotalTests = 0;
        let dvUnassignedTotalPass = 0;
        let dvUnassignedTotalFail = 0;
        let dvUnassignedTotalMissing = 0;
        let dvUnassignedTotalNoExpectations = 0;
        let dvUnassignedTotalScenarioAnomalies = 0;
        let dvUnassignedTotalNoWp = 0;

        const unassignedScenarios = DesignComponentData.getDvScenariosNotInWorkPackages(userContext.designVersionId);

        unassignedScenarios.forEach((scenario) => {

            const scenarioReturnData = this.processScenario(
                userContext,
                scenario,
                testExpectationResultsData,
                scenarioTestSummaryData,
                myAcceptanceTestResults,
                myIntegrationTestResults,
                myUnitTestResults
            );

            // Update the cached data
            testExpectationResultsData = scenarioReturnData.expectationResults;
            scenarioTestSummaryData = scenarioReturnData.scenarioSummaries;

            dvUnassignedTotalScenarios++;
            dvUnassignedTotalExpectations +=scenarioReturnData.scenarioData.scenarioTotalExpectations;
            dvUnassignedTotalTests += scenarioReturnData.scenarioData.scenarioTotalTests;
            dvUnassignedTotalPass += scenarioReturnData.scenarioData.scenarioTotalPass;
            dvUnassignedTotalFail += scenarioReturnData.scenarioData.scenarioTotalFail;
            dvUnassignedTotalMissing += scenarioReturnData.scenarioData.scenarioTotalMissing;
            dvUnassignedTotalScenarioAnomalies += scenarioReturnData.scenarioData.scenarioTotalAnomalies;
            if(scenarioReturnData.scenarioData.scenarioTotalExpectations === 0){
                dvUnassignedTotalNoExpectations++;
            }
            dvUnassignedTotalNoWp += scenarioReturnData.scenarioData.scenarioTotalNoWp;

            // Add unassigned backlog data
            const newBacklogData = this.updateBacklogData(userContext, scenarioReturnData.scenario, scenarioReturnData.scenarioData, 'NONE', 'NONE', 'NONE', SummaryType.SUMMARY_DV_UNASSIGNED);

            newBacklogData.forEach((item) => {
                backlogData.push(item);
            });


        });

        // Push the DV unassigned data
        workItemTestSummaryData.push({
            userId:                     userContext.userId,
            designVersionId:            userContext.designVersionId,
            workItemId:                 userContext.designVersionId,
            workItemName:               designVersionName + ' (Unassigned)',
            workItemType:               WorkItemType.DV_UNASSIGNED,
            totalFeatures:              0,
            totalScenarios:             dvUnassignedTotalScenarios,
            totalExpectations:          dvUnassignedTotalExpectations,
            totalTests:                 dvUnassignedTotalTests,
            totalPassing:               dvUnassignedTotalPass,
            totalFailing:               dvUnassignedTotalFail,
            totalMissing:               dvUnassignedTotalMissing,
            totalNoExpectations:        dvUnassignedTotalNoExpectations,
            totalScenarioAnomalies:     dvUnassignedTotalScenarioAnomalies,
            totalFeatureAnomalies:      0,
            totalScenariosUnassigned:   dvUnassignedTotalNoWp
        });


        const dvFeatures = DesignVersionData.getNonRemovedFeatureCount(userContext.designId, userContext.designVersionId);

        // Get Feature anomalies and add them to the whole DV backlog
        const dvFeatureAnomalies = DesignAnomalyData.getAllActiveFeatureDesignAnomaliesInDv(userContext.designVersionId);

        dvFeatureAnomalies.forEach((featureAnomaly) => {

            const feature = DesignComponentData.getDesignComponentByRef(userContext.designVersionId, featureAnomaly.featureReferenceId);

            const backlogEntry = this.createBacklogEntry('NONE', 'NONE', 'NONE', userContext, BacklogType.BACKLOG_FEATURE_ANOMALY, feature, 1, SummaryType.SUMMARY_DV);

            backlogData.push(backlogEntry);

        });


        // Push the DV total data
        workItemTestSummaryData.push({
            userId:                     userContext.userId,
            designVersionId:            userContext.designVersionId,
            workItemId:                 userContext.designVersionId,
            workItemName:               designVersionName,
            workItemType:               WorkItemType.DESIGN_VERSION,
            totalFeatures:              dvFeatures,
            totalScenarios:             dvAssignedTotalScenarios+ dvUnassignedTotalScenarios,
            totalExpectations:          dvAssignedTotalExpectations + dvUnassignedTotalExpectations,
            totalTests:                 dvAssignedTotalTests + dvUnassignedTotalTests,
            totalPassing:               dvAssignedTotalPass + dvUnassignedTotalPass,
            totalFailing:               dvAssignedTotalFail + dvUnassignedTotalFail,
            totalMissing:               dvAssignedTotalMissing + dvUnassignedTotalMissing,
            totalNoExpectations:        dvAssignedTotalNoExpectations + dvUnassignedTotalNoExpectations,
            totalScenarioAnomalies:     dvAssignedTotalScenarioAnomalies + dvUnassignedTotalScenarioAnomalies,
            totalFeatureAnomalies:      dvFeatureAnomalies.length
        });

        // Data Insert -------------------------------------------------------------------------------------------------

        log((msg) => console.log(msg), LogLevel.PERF, "        Bulk Inserts...");

        // Bulk Insert the Work Item data
        if(workItemTestSummaryData.length > 0){
            UserTestData.bulkInsertWorkItemSummaryData(workItemTestSummaryData);
        }

        // Bulk insert the Scenario data
        if(scenarioTestSummaryData.length > 0){
            UserTestData.bulkInsertScenarioSummaryData(scenarioTestSummaryData);
        }

        // Bulk insert the Expectations results
        log((msg) => console.log(msg), LogLevel.PERF, "        Inserting {} expectation results", testExpectationResultsData.length);
        if(testExpectationResultsData.length > 0){
            UserTestData.bulkInsertExpectationResultData(testExpectationResultsData);
        }

        // Bulk insert Backlog data
        if(backlogData.length > 0){
            UserTestData.bulkInsertWorkItemBacklogData(backlogData);
        }

        log((msg) => console.log(msg), LogLevel.PERF, "     DONE");
    }

    processScenario(userContext, wpScenario, testExpectationResultsData, scenarioTestSummaryData, myAcceptanceTestResults, myIntegrationTestResults, myUnitTestResults){

        let scenarioData = {
            scenarioTotalExpectations: 0,
            scenarioTotalTests: 0,
            scenarioTotalPass: 0,
            scenarioTotalFail: 0,
            scenarioTotalMissing: 0,
            scenarioTotalAnomalies: 0,
            scenarioTotalNoWp: 0,
            scenarioAccExpectations: 0,
            scenarioAccTests: 0,
            scenarioAccPass: 0,
            scenarioAccFail: 0,
            scenarioAccMissing: 0,
            scenarioIntExpectations: 0,
            scenarioIntTests: 0,
            scenarioIntPass: 0,
            scenarioIntFail: 0,
            scenarioIntMissing: 0,
            scenarioUnitExpectations: 0,
            scenarioUnitTests: 0,
            scenarioUnitPass: 0,
            scenarioUnitFail: 0,
            scenarioUnitMissing: 0,

        };

        const scenario = DesignComponentData.getDesignComponentByRef(userContext.designVersionId, wpScenario.componentReferenceId);
        const scenarioName = scenario.componentNameNew;

        log((msg) => console.log(msg), LogLevel.TRACE, "              Scenario... {}", scenarioName);

        const scenarioAnomalies = DesignAnomalyData.getActiveScenarioDesignAnomalies(userContext.designVersionId, scenario.componentReferenceId);

        const scenarioAccTestExpectations = ScenarioTestExpectationData.getScenarioTestExpectationsForScenarioTestType(userContext.designVersionId, scenario.componentReferenceId, TestType.ACCEPTANCE);
        const scenarioIntTestExpectations = ScenarioTestExpectationData.getScenarioTestExpectationsForScenarioTestType(userContext.designVersionId, scenario.componentReferenceId, TestType.INTEGRATION);
        const scenarioUnitTestExpectations = ScenarioTestExpectationData.getScenarioTestExpectationsForScenarioTestType(userContext.designVersionId, scenario.componentReferenceId, TestType.UNIT);

        let newExpectationResultsData = testExpectationResultsData;

        // For each type of test, determine if there are permutation tests or not.  If there are, get the results of those and then set the overall test result accordingly
        log((msg) => console.log(msg), LogLevel.TRACE, "                 Results for ACC");
        const accExpectationResultData = this.getTestTypeResults(scenarioAccTestExpectations, myAcceptanceTestResults, scenario, newExpectationResultsData, userContext, TestType.ACCEPTANCE);

        newExpectationResultsData = accExpectationResultData.testExpectationResultsData;

        log((msg) => console.log(msg), LogLevel.TRACE, "                 Results for INT");
        const intExpectationResultData = this.getTestTypeResults(scenarioIntTestExpectations, myIntegrationTestResults, scenario, newExpectationResultsData, userContext, TestType.INTEGRATION);

        newExpectationResultsData = intExpectationResultData.testExpectationResultsData;

        log((msg) => console.log(msg), LogLevel.TRACE, "                 Results for UNIT");
        const unitExpectationResultData = this.getTestTypeResults(scenarioUnitTestExpectations, myUnitTestResults, scenario, newExpectationResultsData, userContext, TestType.UNIT);

        newExpectationResultsData = unitExpectationResultData.testExpectationResultsData;

        let accExpectationResults = accExpectationResultData.testTypeExpectationResults;
        let intExpectationResults = intExpectationResultData.testTypeExpectationResults;
        let unitExpectationResults = unitExpectationResultData.testTypeExpectationResults;

        let accScenarioResult = accExpectationResultData.scenarioExpectationResult;
        let intScenarioResult = intExpectationResultData.scenarioExpectationResult;
        let unitScenarioResult = unitExpectationResultData.scenarioExpectationResult;


        // Sort out the expectations - if there are values then the base expectation doesn't count.
        scenarioData = this.addScenarioData(accExpectationResults, accScenarioResult, scenarioData, TestType.ACCEPTANCE);

        scenarioData = this.addScenarioData(intExpectationResults, intScenarioResult, scenarioData, TestType.INTEGRATION);

        scenarioData = this.addScenarioData(unitExpectationResults, unitScenarioResult, scenarioData, TestType.UNIT);

        scenarioData.scenarioTotalAnomalies = scenarioAnomalies.length;

        if(scenario.workPackageId === 'NONE'){
            scenarioData.scenarioTotalNoWp = 1;
        }

        // Push the scenario data
        scenarioTestSummaryData.push({
            userId:                     userContext.userId,
            designVersionId:            userContext.designVersionId,
            designFeatureReferenceId:   scenario.componentFeatureReferenceIdNew,
            designScenarioReferenceId:  scenario.componentReferenceId,
            totalExpectations:          scenarioData.scenarioTotalExpectations,
            totalTests:                 scenarioData.scenarioTotalTests,
            totalPassing:               scenarioData.scenarioTotalPass,
            totalFailing:               scenarioData.scenarioTotalFail,
            totalMissing:               scenarioData.scenarioTotalMissing,
            totalAccExpectations:       scenarioData.scenarioAccExpectations,
            totalAccTests:              scenarioData.scenarioAccTests,
            totalAccPassing:            scenarioData.scenarioAccPass,
            totalAccFailing:            scenarioData.scenarioAccFail,
            totalAccMissing:            scenarioData.scenarioAccMissing,
            totalIntExpectations:       scenarioData.scenarioIntExpectations,
            totalIntTests:              scenarioData.scenarioIntTests,
            totalIntPassing:            scenarioData.scenarioIntPass,
            totalIntFailing:            scenarioData.scenarioIntFail,
            totalIntMissing:            scenarioData.scenarioIntMissing,
            totalUnitExpectations:      scenarioData.scenarioUnitExpectations,
            totalUnitTests:             scenarioData.scenarioUnitTests,
            totalUnitPassing:           scenarioData.scenarioUnitPass,
            totalUnitFailing:           scenarioData.scenarioUnitFail,
            totalUnitMissing:           scenarioData.scenarioUnitMissing
        });

        return{
            expectationResults: newExpectationResultsData,
            scenarioSummaries:  scenarioTestSummaryData,
            scenarioData:       scenarioData,
            scenario:           scenario
        }

    }

    updateBacklogData(userContext, scenario, scenarioData, currentIterationId, currentIncrementId, currentWpId, summaryType){

        const newBacklogEntries = [];
        let backlogEntry = {};

        const feature = DesignComponentData.getDesignComponentByRef(scenario.designVersionId, scenario.componentFeatureReferenceIdNew);

        // Missing Expectations Backlog
        if(scenarioData.scenarioTotalExpectations === 0){

            // Add 1 scenario with no expectations...
            backlogEntry = this.createBacklogEntry(currentWpId, currentIterationId, currentIncrementId, userContext, BacklogType.BACKLOG_TEST_EXP, feature, 1, summaryType);
            newBacklogEntries.push(backlogEntry);
        }

        // Failing Tests Backlog
        if(scenarioData.scenarioTotalFail > 0){

            // Add 1 scenario with n failing tests...
            backlogEntry = this.createBacklogEntry(currentWpId, currentIterationId, currentIncrementId, userContext, BacklogType.BACKLOG_TEST_FAIL, feature, scenarioData.scenarioTotalFail, summaryType);
            newBacklogEntries.push(backlogEntry);
        }

        // Missing Tests Backlog
        if(scenarioData.scenarioTotalMissing > 0){

            // Add 1 scenario with n missing tests...
            backlogEntry = this.createBacklogEntry(currentWpId, currentIterationId, currentIncrementId, userContext, BacklogType.BACKLOG_TEST_MISSING, feature, scenarioData.scenarioTotalMissing, summaryType);
            newBacklogEntries.push(backlogEntry);
        }

        // Scenario Anomalies Backlog
        if(scenarioData.scenarioTotalAnomalies> 0){

            // Add 1 scenario with n anomalies...
            backlogEntry = this.createBacklogEntry(currentWpId, currentIterationId, currentIncrementId, userContext, BacklogType.BACKLOG_SCENARIO_ANOMALY, feature, scenarioData.scenarioTotalAnomalies, summaryType);
            newBacklogEntries.push(backlogEntry);
        }

        // Scenario Unassigned Backlog
        if(scenarioData.scenarioTotalNoWp > 0){

            // Add 1 scenario
            backlogEntry = this.createBacklogEntry(currentWpId, currentIterationId, currentIncrementId, userContext, BacklogType.BACKLOG_WP_ASSIGN, feature, scenarioData.scenarioTotalNoWp, summaryType);
            newBacklogEntries.push(backlogEntry);
        }

        return newBacklogEntries;

    }

    createBacklogEntry(currentWpId, currentIterationId, currentIncrementId, userContext, backlogType, feature, backlogItemCount, summaryType){

        return {
            userId:                 userContext.userId,
            dvId:                   userContext.designVersionId,
            inId:                   currentIncrementId,
            itId:                   currentIterationId,
            duId:                   'NONE',
            wpId:                   currentWpId,
            summaryType:            summaryType,
            backlogType:            backlogType,
            featureRefId:           feature.componentReferenceId,
            featureName:            feature.componentNameNew,
            scenarioCount:          1,
            backlogItemCount:       backlogItemCount
        }
    }

    getTestTypeResults(testTypeExpectations, testTypeResults, scenario, testExpectationResultsData, userContext, testType){

        // TODO - new method of calculation where we get all the scenario results and add any that match expected tests to
        // expectation results and any additional as scenario results...

        // There is at least one expectation for the scenario
        if(testTypeExpectations.length > 0){

            let scenarioExpectationResult = {
                result: MashTestStatus.MASH_NO_TESTS,
                test: {}
            };

            let testTypeExpectationResults = [];

            // Exactly one means that it must be a scenario level expectation
            if(testTypeExpectations.length === 1){

                log((msg) => console.log(msg), LogLevel.TRACE, "                 One expectation");

                // No permutations - get this test result
                scenarioExpectationResult = this.getExpectationResult(testTypeResults, scenario.componentNameNew, 'NONE');

                if(scenarioExpectationResult.result !== MashTestStatus.MASH_NO_TESTS){

                    const testIdentity = this.getTestIdentity(
                        scenarioExpectationResult.test.testFullName,
                        scenario.componentNameNew,
                        scenarioExpectationResult.test.testSuite,
                        scenarioExpectationResult.test.testGroup,
                        scenarioExpectationResult.test.testName,
                    );

                    testExpectationResultsData.push({
                        userId:                     userContext.userId,
                        designVersionId:            userContext.designVersionId,
                        designScenarioReferenceId:  scenario.componentReferenceId,
                        scenarioTestExpectationId:  testTypeExpectations[0]._id,
                        testType:                   testType,
                        permValue:                  'SCENARIO',
                        suiteName:                  testIdentity.suite,
                        groupName:                  testIdentity.group,
                        testName:                   testIdentity.test,
                        testFullName:               scenarioExpectationResult.test.testFullName,
                        testOutcome:                scenarioExpectationResult.result,
                        testError:                  scenarioExpectationResult.test.testError,
                        testErrorReason:            scenarioExpectationResult.test.testErrorReason,
                        testStack:                  scenarioExpectationResult.test.testStackTrace,
                        testDuration:               scenarioExpectationResult.test.testDuration
                    });

                } else {

                    testExpectationResultsData.push({
                        userId:                     userContext.userId,
                        designVersionId:            userContext.designVersionId,
                        designScenarioReferenceId:  scenario.componentReferenceId,
                        scenarioTestExpectationId:  testTypeExpectations[0]._id,
                        testType:                   testType,
                        permValue:                  'SCENARIO',
                        suiteName:                  'NONE',
                        groupName:                  'NONE',
                        testName:                   'No test found',
                        testFullName:               'NONE',
                        testOutcome:                MashTestStatus.MASH_NO_TESTS,
                        testError:                  '',
                        testErrorReason:            '',
                        testStack:                  '',
                        testDuration:               0
                    });
                }

            } else {

                // More than one expectation - scenario level plus permutations.  Only the permuatations are now actual expectations
                log((msg) => console.log(msg), LogLevel.TRACE, "                 {} expectations", testTypeExpectations.length);

                let scenarioStatus = MashTestStatus.MASH_NO_TESTS;
                let scenarioMissing = 0;
                let scenarioPass = 0;
                let scenarioFail = 0;
                let scenarioExpectationId = 'NONE';

                testTypeExpectations.forEach((expectation) => {

                    // Ignore the overall expectation
                    if(expectation.permutationValueId !== 'NONE'){

                        let permutationValue = '';

                        if(expectation.permutationValueId === 'VALUE'){
                            permutationValue = expectation.valuePermutationValue;
                        } else {
                            permutationValue = DesignPermutationValueData.getDesignPermutationValueById(expectation.permutationValueId).permutationValueName;
                        }

                        let expectationResult = {
                            result: MashTestStatus.MASH_NO_TESTS,
                            test: {}
                        };

                        expectationResult = this.getExpectationResult(testTypeResults, scenario.componentNameNew, permutationValue);

                        //log((msg) => console.log(msg), LogLevel.PERF, "                 Adding perm {} result {}", permutationValue, expectationResult.result);

                        testTypeExpectationResults.push({
                            value:  permutationValue,
                            result: expectationResult
                        });

                        // Store the overall status
                        switch(expectationResult.result){
                            case MashTestStatus.MASH_NO_TESTS:
                            case MashTestStatus.MASH_PENDING:
                                scenarioMissing++;
                                break;
                            case MashTestStatus.MASH_PASS:
                                scenarioPass++;
                                break;
                            case MashTestStatus.MASH_FAIL:
                                scenarioFail++;
                                break;
                        }


                        if(expectationResult.result !== MashTestStatus.MASH_NO_TESTS){

                            const testIdentity = this.getTestIdentity(
                                expectationResult.test.testFullName,
                                scenario.componentNameNew,
                                expectationResult.test.testSuite,
                                expectationResult.test.testGroup,
                                expectationResult.test.testName,
                            );

                            testExpectationResultsData.push({
                                userId:                     userContext.userId,
                                designVersionId:            userContext.designVersionId,
                                designScenarioReferenceId:  scenario.componentReferenceId,
                                scenarioTestExpectationId:  expectation._id,
                                testType:                   testType,
                                permValue:                  permutationValue,
                                suiteName:                  testIdentity.suite,
                                groupName:                  testIdentity.group,
                                testName:                   testIdentity.test,
                                testFullName:               expectationResult.test.testFullName,
                                testOutcome:                expectationResult.result,
                                testError:                  expectationResult.test.testError,
                                testErrorReason:            expectationResult.test.testErrorReason,
                                testStack:                  expectationResult.test.testStackTrace,
                                testDuration:               expectationResult.test.testDuration
                            });
                        } else {

                            testExpectationResultsData.push({
                                userId: userContext.userId,
                                designVersionId: userContext.designVersionId,
                                designScenarioReferenceId: scenario.componentReferenceId,
                                scenarioTestExpectationId: expectation._id,
                                testType: testType,
                                permValue: permutationValue,
                                suiteName: 'NONE',
                                groupName: 'NONE',
                                testName: 'No test found',
                                testFullName: 'NONE',
                                testOutcome: MashTestStatus.MASH_NO_TESTS,
                                testError: '',
                                testErrorReason: '',
                                testStack: '',
                                testDuration: 0
                            });
                        }

                    } else {

                        // Get the dummy scenario expectation
                        scenarioExpectationId = expectation._id;
                    }
                });

                // Update the overall status
                if(scenarioFail > 0){
                    // Any fails its a fail
                    scenarioStatus = MashTestStatus.MASH_FAIL;
                } else {
                    if(scenarioPass === 0){
                        // No fails and no passes = no tests
                        scenarioStatus = MashTestStatus.MASH_NO_TESTS;
                    } else {
                        if(scenarioMissing > 0){
                            // Passes and missing = incomplete
                            scenarioStatus = MashTestStatus.MASH_INCOMPLETE;
                        } else {
                            // Passes and no missing = pass
                            scenarioStatus = MashTestStatus.MASH_PASS;
                        }
                    }
                }

                log((msg) => console.log(msg), LogLevel.TRACE, "                 Overall scenario result is {}", scenarioStatus);

                // Add a dummy test expectation result for the whole scenario
                testExpectationResultsData.push({
                    userId:                     userContext.userId,
                    designVersionId:            userContext.designVersionId,
                    designScenarioReferenceId:  scenario.componentReferenceId,
                    scenarioTestExpectationId:  scenarioExpectationId,
                    testType:                   testType,
                    permValue:                  'NONE',
                    suiteName:                  'NONE',
                    groupName:                  'NONE',
                    testName:                   'NONE',
                    testFullName:               'NONE',
                    testOutcome:                scenarioStatus,
                    testError:                  'NONE',
                    testErrorReason:            'NONE',
                    testStack:                  'NONE',
                    testDuration:               'NONE',
                });

                scenarioExpectationResult = {
                    result: scenarioStatus,
                    test: {}
                };
            }

            return{
                scenarioExpectationResult:      scenarioExpectationResult,
                testTypeExpectationResults:     testTypeExpectationResults,
                testExpectationResultsData:     testExpectationResultsData
            }

        } else {

            log((msg) => console.log(msg), LogLevel.TRACE, "                 No expectations");

            // No expectations
            return{
                scenarioExpectationResult:      null,
                testTypeExpectationResults:     [],
                testExpectationResultsData:     testExpectationResultsData  // Make sure we return this as is...
            }
        }



    }

    getExpectationResult(resultsData, scenarioText, permutationValue){

        let searchRegex = new RegExp(scenarioText);

        // Get any test results for the Scenario
        const scenarioTests = resultsData.find({
            testFullName:   {$regex: searchRegex}
        }).fetch();

        // Need a separate result so can return something if no test found
        let result = MashTestStatus.MASH_NO_TESTS;
        let theTest = {};

        // Ideally there is only one result
        scenarioTests.forEach((test) => {

            if(permutationValue !== 'NONE'){

                // If a permutation the actual test must include it
                if((test.testName !== scenarioText) && test.testName.includes(permutationValue)){
                    result = test.testResult;
                    theTest = test;
                }

            } else{

                // No permutation so should be only 1 matching test
                result = test.testResult;
                theTest = test;
            }

        });

        return {
            result: result,
            test: theTest
        }

    }

    addScenarioData(testTypeExpectationResults, testTypeScenarioResult, scenarioData, testType){

        // Process any permutation results
        let noPermutations = true;

        // Run through the results recorded for scenario test permutations
        testTypeExpectationResults.forEach((result) => {

            noPermutations = false;

            // Each permutation is an expectation
            log((msg) => console.log(msg), LogLevel.TRACE, "               Scenario data: Adding 1 perm expectation");

            scenarioData.scenarioTotalExpectations++;

            switch(testType){
                case TestType.ACCEPTANCE:
                    scenarioData.scenarioAccExpectations++;
                    break;
                case TestType.INTEGRATION:
                    scenarioData.scenarioIntExpectations++;
                    break;
                case TestType.UNIT:
                    scenarioData.scenarioUnitExpectations++;
                    break;
            }

            switch (result.result.result) {
                case MashTestStatus.MASH_NO_TESTS:
                case MashTestStatus.MASH_PENDING:
                    scenarioData.scenarioTotalMissing++;
                    switch(testType){
                        case TestType.ACCEPTANCE:
                            scenarioData.scenarioAccMissing++;
                            break;
                        case TestType.INTEGRATION:
                            scenarioData.scenarioIntMissing++;
                            break;
                        case TestType.UNIT:
                            scenarioData.scenarioUnitMissing++;
                            break;
                    }
                    break;
                case MashTestStatus.MASH_PASS:
                    scenarioData.scenarioTotalPass++;
                    scenarioData.scenarioTotalTests++;
                    switch(testType){
                        case TestType.ACCEPTANCE:
                            scenarioData.scenarioAccPass++;
                            scenarioData.scenarioAccTests++;
                            break;
                        case TestType.INTEGRATION:
                            scenarioData.scenarioIntPass++;
                            scenarioData.scenarioIntTests++;
                            break;
                        case TestType.UNIT:
                            scenarioData.scenarioUnitPass++;
                            scenarioData.scenarioUnitTests++;
                            break;
                    }
                    break;
                case MashTestStatus.MASH_FAIL:
                    scenarioData.scenarioTotalFail++;
                    scenarioData.scenarioTotalTests++;
                    switch(testType){
                        case TestType.ACCEPTANCE:
                            scenarioData.scenarioAccFail++;
                            scenarioData.scenarioAccTests++;
                            break;
                        case TestType.INTEGRATION:
                            scenarioData.scenarioIntFail++;
                            scenarioData.scenarioIntTests++;
                            break;
                        case TestType.UNIT:
                            scenarioData.scenarioUnitFail++;
                            scenarioData.scenarioUnitTests++;
                            break;
                    }
                    break;
            }

        });

        // If there were no permutations but there is a scenario result...
        if(noPermutations && testTypeScenarioResult){

            // One expectation only
            log((msg) => console.log(msg), LogLevel.TRACE, "               Scenario data: Adding 1 scenario expectation");
            scenarioData.scenarioTotalExpectations++;
            switch(testType){
                case TestType.ACCEPTANCE:
                    scenarioData.scenarioAccExpectations++;
                    break;
                case TestType.INTEGRATION:
                    scenarioData.scenarioIntExpectations++;
                    break;
                case TestType.UNIT:
                    scenarioData.scenarioUnitExpectations++;
                    break;
            }

            switch (testTypeScenarioResult.result) {
                case MashTestStatus.MASH_NO_TESTS:
                case MashTestStatus.MASH_PENDING:
                    scenarioData.scenarioTotalMissing++;
                    switch(testType){
                        case TestType.ACCEPTANCE:
                            scenarioData.scenarioAccMissing++;
                            break;
                        case TestType.INTEGRATION:
                            scenarioData.scenarioIntMissing++;
                            break;
                        case TestType.UNIT:
                            scenarioData.scenarioUnitMissing++;
                            break;
                    }
                    break;
                case MashTestStatus.MASH_PASS:
                    scenarioData.scenarioTotalPass++;
                    scenarioData.scenarioTotalTests++;
                    switch(testType){
                        case TestType.ACCEPTANCE:
                            scenarioData.scenarioAccPass++;
                            scenarioData.scenarioAccTests++;
                            break;
                        case TestType.INTEGRATION:
                            scenarioData.scenarioIntPass++;
                            scenarioData.scenarioIntTests++;
                            break;
                        case TestType.UNIT:
                            scenarioData.scenarioUnitPass++;
                            scenarioData.scenarioUnitTests++;
                            break;
                    }
                    break;
                case MashTestStatus.MASH_FAIL:
                    scenarioData.scenarioTotalFail++;
                    scenarioData.scenarioTotalTests++;
                    switch(testType){
                        case TestType.ACCEPTANCE:
                            scenarioData.scenarioAccFail++;
                            scenarioData.scenarioAccTests++;
                            break;
                        case TestType.INTEGRATION:
                            scenarioData.scenarioIntFail++;
                            scenarioData.scenarioIntTests++;
                            break;
                        case TestType.UNIT:
                            scenarioData.scenarioUnitFail++;
                            scenarioData.scenarioUnitTests++;
                            break;
                    }
                    break;
            }
        }

        return scenarioData;
    }




    // getUserResultForScenarioExpectation(userContext, expectation){
    //
    //     // Get the user test results for the expectation scenario
    //     const scenarioResults = UserMashScenarioTestData.getScenarioTestsByType(
    //         userContext.userId,
    //         userContext.designVersionId,
    //         expectation.scenarioReferenceId,
    //         expectation.testType
    //     );
    //
    //     let resultStatus = MashTestStatus.MASH_NOT_LINKED;
    //
    //     if(expectation.permutationValueId === 'NONE'){
    //
    //         // This is a general expectation for the test type so we need to match the Scenario
    //
    //         // Get the scenario
    //         const scenario = DesignComponentData.getDesignComponentByRef(userContext.designVersionId, expectation.scenarioReferenceId);
    //
    //         scenarioResults.forEach((result) => {
    //
    //             // If the individual test references the perm value set the result against it
    //             if(result.testFullName.includes(scenario.componentNameNew)){
    //
    //                 resultStatus = result.testOutcome
    //             }
    //         });
    //
    //     } else {
    //
    //         // This is an expectation for a permutation value test
    //
    //         // Get the permutation value
    //         const permValue = DesignPermutationValueData.getDesignPermutationValueById(expectation.permutationValueId);
    //
    //         scenarioResults.forEach((result) => {
    //
    //             // If the individual test references the perm value set the result against it
    //             if(result.testName.includes(permValue.permutationValueName)){
    //
    //                 resultStatus = result.testOutcome
    //             }
    //         })
    //     }
    //
    //     return resultStatus;
    //
    // }

    // getScenarioOverallExpectationStatus(userContext, scenarioRefId){
    //
    //     // Here the designItem contains the actual Scenario Mash data - should be for one scenario
    //     const mashScenario = UserDvMashScenarioData.getScenario(userContext, scenarioRefId);
    //
    //     let unitStatus = MashTestStatus.MASH_NOT_LINKED;
    //     let intStatus = MashTestStatus.MASH_NOT_LINKED;
    //     let accStatus = MashTestStatus.MASH_NOT_LINKED;
    //
    //     if(mashScenario) {
    //
    //         unitStatus = mashScenario.unitMashTestStatus;
    //         intStatus = mashScenario.intMashTestStatus;
    //         accStatus = mashScenario.accMashTestStatus;
    //
    //         // Check for expectation completeness if not already failing
    //         if (mashScenario.unitMashTestStatus !== MashTestStatus.MASH_FAIL) {
    //
    //             if (this.testTypeIsIncomplete(userContext, scenarioRefId, TestType.UNIT)) {
    //                 unitStatus = MashTestStatus.MASH_INCOMPLETE;
    //             }
    //         }
    //
    //         if (mashScenario.intMashTestStatus !== MashTestStatus.MASH_FAIL) {
    //
    //             if (this.testTypeIsIncomplete(userContext, scenarioRefId, TestType.INTEGRATION)) {
    //                 intStatus = MashTestStatus.MASH_INCOMPLETE;
    //             }
    //         }
    //
    //         if (mashScenario.accMashTestStatus !== MashTestStatus.MASH_FAIL) {
    //
    //             if (this.testTypeIsIncomplete(userContext, scenarioRefId, TestType.ACCEPTANCE)) {
    //                 accStatus = MashTestStatus.MASH_INCOMPLETE;
    //             }
    //         }
    //     }
    //
    //     return(
    //         {
    //             unitStatus: unitStatus,
    //             intStatus:  intStatus,
    //             accStatus:  accStatus
    //         }
    //     )
    // }


    // testTypeIsIncomplete(userContext, scenarioRefId, testType){
    //
    //     const allExpectations = ScenarioTestExpectationData.getScenarioTestExpectationsForScenarioTestType(
    //         userContext.designVersionId,
    //         scenarioRefId,
    //         testType
    //     );
    //
    //     // But if any values are missing or pending mark as incomplete
    //     let retVal = false;
    //
    //     allExpectations.forEach((expectation) => {
    //
    //         const userExpectationStatus = UserDvScenarioTestExpectationStatusData.getUserExpectationStatusData(userContext.userId, userContext.designVersionId, expectation._id);
    //
    //         if(expectation.permutationValueId !== 'NONE'){
    //             if(userExpectationStatus){
    //                 // Expected test is missing
    //                 if(userExpectationStatus.expectationStatus === MashTestStatus.MASH_NOT_LINKED || userExpectationStatus.expectationStatus === MashTestStatus.MASH_PENDING){
    //                     retVal = true;
    //                 }
    //             } else {
    //                 // No status for expected test...
    //                 retVal = true;
    //             }
    //
    //         }
    //     });
    //
    //     return retVal;
    // }

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
}

export const TestIntegrationModules = new TestIntegrationModulesClass();