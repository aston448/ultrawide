
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
import { UserDvMashScenarioData }               from '../../data/mash/user_dv_mash_scenario_db.js'
import { UserMashScenarioTestData }             from '../../data/mash/user_mash_scenario_test_db.js';
import { UserRoleData }                         from '../../data/users/user_role_db.js';
import {ScenarioTestExpectationData}            from "../../data/design/scenario_test_expectations_db";
import {DesignPermutationValueData}             from "../../data/design/design_permutation_value_db";
import {UserDvScenarioTestExpectationStatusData}from '../../data/mash/user_dv_scenario_test_expectation_status_db.js'
import {UserTestData} from "../../data/test_data/user_test_data_db";
import {WorkItemData} from "../../data/work/work_item_db";
import {WorkPackageData} from "../../data/work/work_package_db";
import {DesignVersionData} from "../../data/design/design_version_db";
import {UserDvBacklogData} from "../../data/summary/user_dv_backlog_db";
import {DesignAnomalyData} from "../../data/design/design_anomaly_db";

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

                        const permutationValue = DesignPermutationValueData.getDesignPermutationValueById(expectation.permutationValueId).permutationValueName;

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

    recreateUserScenarioTestMashData(userContext){

        log((msg) => console.log(msg), LogLevel.PERF, "    Recreating user mash scenarios... {}", userContext.userId);

        // Clear all data for user-designVersion
        UserDvMashScenarioData.removeAllDvScenariosForUser(userContext.userId, userContext.designVersionId);
        UserMashScenarioTestData.removeAllDvTestsForUser(userContext.userId, userContext.designVersionId);
        UserDvScenarioTestExpectationStatusData.removeAllUserExpectationStatuses(userContext.userId);

        log((msg) => console.log(msg), LogLevel.PERF, "    Old data removed...");

        // Get all non-removed Scenarios for current DV
        const dvScenarios = DesignComponentData.getNonRemovedDvScenarios(userContext.designVersionId);

        log((msg) => console.log(msg), LogLevel.PERF, "    {} Scenarios loaded...", dvScenarios.length);

        let scenarioBatchData = [];
        let scenarioTestBatchData = [];
        let scenarioExpectationStatusBatch = [];

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

        dvScenarios.forEach((scenario) => {

            //log((msg) => console.log(msg), LogLevel.TRACE, "Scenario = {}", scenario.componentNameNew.substring(1,20));

            // See which updated test results relate to this scenario
            // Note that all test-results plugins must ensure that the Scenario is within testFullName

            let searchRegex = new RegExp(scenario.componentNameNew);

            // Unit Tests
            const unitTests = myUnitTestResults.find({
                testFullName:   {$regex: searchRegex}
            }).fetch();

            //log((msg) => console.log(msg), LogLevel.TRACE, "    Matched {} unit tests", unitTests.length);

            // Integration Tests
            const intTests = myIntegrationTestResults.find({
                testFullName:   {$regex: searchRegex}
            }).fetch();

            //log((msg) => console.log(msg), LogLevel.TRACE, "    Matched {} int tests", intTests.length);

            // Acceptance Tests
            const accTests = myAcceptanceTestResults.find({
                testFullName:   {$regex: searchRegex}
            }).fetch();

            //log((msg) => console.log(msg), LogLevel.TRACE, "    Matched {} acc tests", accTests.length);

            // Create the basic Scenario Mash
            let unitTestCount = 0;
            let unitTestPasses = 0;
            let unitTestFails = 0;
            let unitTestPendings = 0;
            let intTestCount = 0;
            let intTestPasses = 0;
            let intTestFails = 0;
            let intTestPendings = 0;
            let accTestCount = 0;
            let accTestPasses = 0;
            let accTestFails = 0;
            let accTestPendings = 0;
            let scenarioUnitTestStatus = MashTestStatus.MASH_NOT_LINKED;
            let scenarioIntTestStatus = MashTestStatus.MASH_NOT_LINKED;
            let scenarioAccTestStatus = MashTestStatus.MASH_NOT_LINKED;
            let scenarioUnitMashStatus = MashStatus.MASH_NOT_LINKED;
            let scenarioIntMashStatus = MashStatus.MASH_NOT_LINKED;
            let scenarioAccMashStatus = MashStatus.MASH_NOT_LINKED;

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
                        testFullName:               unitTest.testFullName,
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
                        testFullName:               intTest.testFullName,
                        // Status
                        testOutcome:                intTest.testResult,                         // Pending / Pass / Fail
                        testError:                  intTest.testError,                          // Error if Failure
                        testErrorReason:            intTest.testErrorReason,                    // Error reason if Failure
                        testStack:                  intTest.testStackTrace,                     // Stack if Failure
                        testDuration:               intTest.testDuration,                       // Duration if test run successfully
                    }
                );
            });

            accTests.forEach((accTest) => {

                accTestCount++;
                scenarioAccMashStatus = MashStatus.MASH_LINKED;

                if(accTest.testResult === MashTestStatus.MASH_PASS){
                    accTestPasses++;
                }
                if(accTest.testResult === MashTestStatus.MASH_FAIL){
                    accTestFails++;
                }
                if(accTest.testResult === MashTestStatus.MASH_PENDING){
                    accTestPendings++;
                }
                const testIdentity = this.getTestIdentity(accTest.testFullName, scenario.componentNameNew, accTest.testSuite, accTest.testGroup, accTest.testName);

                // Insert an acc test record
                scenarioTestBatchData.push(
                    {
                        userId:                     userContext.userId,                         // Meteor user id
                        designVersionId:            userContext.designVersionId,                // Current design version
                        designScenarioReferenceId:  scenario.componentReferenceId,              // Reference to matching scenario in design (if any)
                        designAspectReferenceId:    scenario.componentParentReferenceIdNew,     // Reference to parent Feature Aspect in design (if any)
                        designFeatureReferenceId:   scenario.componentFeatureReferenceIdNew,    // Reference to parent Feature in design (if any)
                        testType:                   TestType.ACCEPTANCE,
                        // Data
                        suiteName:                  testIdentity.suite,                         // Feature or Module
                        groupName:                  testIdentity.group,                         // Scenario or Group
                        testName:                   testIdentity.test,                          // Scenario or Test
                        testFullName:               accTest.testFullName,
                        // Status
                        testOutcome:                accTest.testResult,                         // Pending / Pass / Fail
                        testError:                  accTest.testError,                          // Error if Failure
                        testErrorReason:            accTest.testErrorReason,                    // Error reason if Failure
                        testStack:                  accTest.testStackTrace,                     // Stack if Failure
                        testDuration:               accTest.testDuration,                       // Duration if test run successfully
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

            if(accTestFails > 0){
                scenarioAccTestStatus = MashTestStatus.MASH_FAIL;
            } else {
                if(accTestPasses > 0){
                    scenarioAccTestStatus = MashTestStatus.MASH_PASS;
                }else {
                    if(accTestPendings > 0){
                        scenarioAccTestStatus = MashTestStatus.MASH_PENDING;
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
                    accMashStatus:                  scenarioAccMashStatus,                     // Whether linked to dev or not and where originating - Acceptance Tests
                    accMashTestStatus:              scenarioAccTestStatus,                     // If linked, latest test results status - Acceptance Tests
                    accTestCount:                   accTestCount,
                    accPassCount:                   accTestPasses,
                    accFailCount:                   accTestFails,
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

            //log((msg) => console.log(msg), LogLevel.TRACE, "    Logged Tests.");

        });

        // Bulk insert the data
        if(scenarioBatchData.length > 0) {
            log((msg) => console.log(msg), LogLevel.PERF, "    Inserting {} summary records...", scenarioBatchData.length);
            UserDvMashScenarioData.bulkInsertData(scenarioBatchData);
        }

        if(scenarioTestBatchData.length > 0) {
            log((msg) => console.log(msg), LogLevel.PERF, "    Inserting {} mash records...", scenarioTestBatchData.length);
            UserMashScenarioTestData.bulkInsertData(scenarioTestBatchData);
        }

        // Now calculate the overall expectation status for each scenario given the test results
        this.calculateUserTestExpectationStatusForExpectations(userContext, dvScenarios)

    }

    calculateUserTestExpectationStatusForExpectations(userContext, dvScenarios){

        let scenarioExpectationStatusBatch = [];

        dvScenarios.forEach((scenario) => {

            const scenarioPermExpectations = ScenarioTestExpectationData.getPermutationTestExpectationsForScenario(
                userContext.designVersionId,
                scenario.componentReferenceId
            );

            const scenarioTestTypeExpectations = ScenarioTestExpectationData.getAllTestTypeExpectations(
                userContext.designVersionId,
                scenario.componentReferenceId
            );

            const scenarioTestData = UserMashScenarioTestData.getAllScenarioTestData(
                userContext.userId,
                userContext.designVersionId,
                scenario.componentReferenceId
            );

            let unitPermCount = 0;
            let unitPermPassCount = 0;
            let unitPermFailCount = 0;
            let intPermCount = 0;
            let intPermPassCount = 0;
            let intPermFailCount = 0;
            let accPermCount = 0;
            let accPermPassCount = 0;
            let accPermFailCount = 0;

            scenarioPermExpectations.forEach((expectation) => {

                if(expectation.permutationValueId !== 'NONE'){

                    switch(expectation.testType) {
                        case TestType.UNIT:
                            unitPermCount++;
                            break;
                        case TestType.INTEGRATION:
                            intPermCount++;
                            break;
                        case TestType.ACCEPTANCE:
                            accPermCount++;
                            break;
                    }

                    const permValue = DesignPermutationValueData.getDesignPermutationValueById(expectation.permutationValueId);

                    scenarioTestData.forEach((test) => {

                        // Must only match up tests and expectations for the same test type!
                        if(expectation.testType === test.testType){

                            if (test.testName.includes(permValue.permutationValueName)) {

                                if (test.testOutcome === MashTestStatus.MASH_PASS) {

                                    switch(expectation.testType) {
                                        case TestType.UNIT:
                                            unitPermPassCount++;
                                            break;
                                        case TestType.INTEGRATION:
                                            intPermPassCount++;
                                            break;
                                        case TestType.ACCEPTANCE:
                                            accPermPassCount++;
                                            break;
                                    }
                                }

                                if (test.testOutcome === MashTestStatus.MASH_FAIL) {

                                    switch(expectation.testType) {
                                        case TestType.UNIT:
                                            unitPermFailCount++;
                                            break;
                                        case TestType.INTEGRATION:
                                            intPermFailCount++;
                                            break;
                                        case TestType.ACCEPTANCE:
                                            accPermFailCount++;
                                            break;
                                    }
                                }

                                scenarioExpectationStatusBatch.push({
                                    userId:                     userContext.userId,
                                    designVersionId:            userContext.designVersionId,
                                    scenarioTestExpectationId:  expectation._id,
                                    expectationStatus:          test.testOutcome
                                });
                            }
                        }


                    });

                }

            });

            // Now we have accounted for all the permutation expectations we can log the status of the actual test type
            scenarioTestTypeExpectations.forEach((expectation) => {

                if(unitPermCount === 0){

                    // No permutations so use actual result (if any - otherwise untested)

                    let testOutcome = MashTestStatus.MASH_NOT_LINKED;

                    scenarioTestData.forEach((test) => {

                        // Must only match up tests and expectations for the same test type!
                        if (test.testType === expectation.testType) {
                            if(test.testFullName.includes(scenario.componentNameNew)){

                                testOutcome = test.testOutcome;
                            }
                        }
                    });

                    scenarioExpectationStatusBatch.push({
                        userId:                     userContext.userId,
                        designVersionId:            userContext.designVersionId,
                        scenarioTestExpectationId:  expectation._id,
                        expectationStatus:          testOutcome
                    });


                } else {

                    // Permutation tests existed so outcome is based on all their results
                    switch (expectation.testType) {
                        case TestType.UNIT:

                            let unitTestStatus = MashTestStatus.MASH_NOT_LINKED;

                            // Status depends on passes or fails
                            if (unitPermFailCount > 0) {
                                unitTestStatus = MashTestStatus.MASH_FAIL
                            } else {
                                if (unitPermPassCount === unitPermCount) {
                                    unitTestStatus = MashTestStatus.MASH_PASS;
                                } else {
                                    unitTestStatus = MashTestStatus.MASH_INCOMPLETE;
                                }
                            }

                            scenarioExpectationStatusBatch.push({
                                userId: userContext.userId,
                                designVersionId: userContext.designVersionId,
                                scenarioTestExpectationId: expectation._id,
                                expectationStatus: unitTestStatus
                            });

                            break;

                        case TestType.INTEGRATION:

                            let intTestStatus = MashTestStatus.MASH_NOT_LINKED;

                            // Status depends on passes or fails
                            if (intPermFailCount > 0) {
                                intTestStatus = MashTestStatus.MASH_FAIL
                            } else {
                                if (intPermPassCount === intPermCount) {
                                    intTestStatus = MashTestStatus.MASH_PASS;
                                } else {
                                    intTestStatus = MashTestStatus.MASH_INCOMPLETE;
                                }
                            }

                            scenarioExpectationStatusBatch.push({
                                userId: userContext.userId,
                                designVersionId: userContext.designVersionId,
                                scenarioTestExpectationId: expectation._id,
                                expectationStatus: intTestStatus
                            });

                            break;

                        case TestType.ACCEPTANCE:

                            let accTestStatus = MashTestStatus.MASH_NOT_LINKED;

                            // Status depends on passes or fails
                            if (accPermFailCount > 0) {
                                accTestStatus = MashTestStatus.MASH_FAIL
                            } else {
                                if (accPermPassCount === accPermCount) {
                                    accTestStatus = MashTestStatus.MASH_PASS;
                                } else {
                                    accTestStatus = MashTestStatus.MASH_INCOMPLETE;
                                }
                            }

                            scenarioExpectationStatusBatch.push({
                                userId: userContext.userId,
                                designVersionId: userContext.designVersionId,
                                scenarioTestExpectationId: expectation._id,
                                expectationStatus: accTestStatus
                            });

                            break;
                    }
                }
            });
        });

        // Insert batch data
        if(scenarioExpectationStatusBatch.length > 0){
            log((msg) => console.log(msg), LogLevel.PERF, "    Inserting {} expectation status records...", scenarioExpectationStatusBatch.length);
            UserDvScenarioTestExpectationStatusData.bulkInsertData(scenarioExpectationStatusBatch);
        }
    }

    getTestExpectationsForScenario(userContext, scenarioRefId){

        const scenarioTestTypeStatuses = this.getScenarioOverallExpectationStatus(userContext, scenarioRefId);
        const unitTestExpectation = ScenarioTestExpectationData.getScenarioTestTypeExpectation(userContext.designVersionId, scenarioRefId, TestType.UNIT);
        const intTestExpectation = ScenarioTestExpectationData.getScenarioTestTypeExpectation(userContext.designVersionId, scenarioRefId, TestType.INTEGRATION);
        const accTestExpectation = ScenarioTestExpectationData.getScenarioTestTypeExpectation(userContext.designVersionId, scenarioRefId, TestType.ACCEPTANCE);

        return{
            scenarioStatuses: scenarioTestTypeStatuses,
            unitExpectation: unitTestExpectation,
            intExpectation: intTestExpectation,
            accExpectation: accTestExpectation
        }
    }


    getUserResultForScenarioExpectation(userContext, expectation){

        // Get the user test results for the expectation scenario
        const scenarioResults = UserMashScenarioTestData.getScenarioTestsByType(
            userContext.userId,
            userContext.designVersionId,
            expectation.scenarioReferenceId,
            expectation.testType
        );

        let resultStatus = MashTestStatus.MASH_NOT_LINKED;

        if(expectation.permutationValueId === 'NONE'){

            // This is a general expectation for the test type so we need to match the Scenario

            // Get the scenario
            const scenario = DesignComponentData.getDesignComponentByRef(userContext.designVersionId, expectation.scenarioReferenceId);

            scenarioResults.forEach((result) => {

                // If the individual test references the perm value set the result against it
                if(result.testFullName.includes(scenario.componentNameNew)){

                    resultStatus = result.testOutcome
                }
            });

        } else {

            // This is an expectation for a permutation value test

            // Get the permutation value
            const permValue = DesignPermutationValueData.getDesignPermutationValueById(expectation.permutationValueId);

            scenarioResults.forEach((result) => {

                // If the individual test references the perm value set the result against it
                if(result.testName.includes(permValue.permutationValueName)){

                    resultStatus = result.testOutcome
                }
            })
        }

        return resultStatus;

    }

    getScenarioOverallExpectationStatus(userContext, scenarioRefId){

        // Here the designItem contains the actual Scenario Mash data - should be for one scenario
        const mashScenario = UserDvMashScenarioData.getScenario(userContext, scenarioRefId);

        let unitStatus = MashTestStatus.MASH_NOT_LINKED;
        let intStatus = MashTestStatus.MASH_NOT_LINKED;
        let accStatus = MashTestStatus.MASH_NOT_LINKED;

        if(mashScenario) {

            unitStatus = mashScenario.unitMashTestStatus;
            intStatus = mashScenario.intMashTestStatus;
            accStatus = mashScenario.accMashTestStatus;

            // Check for expectation completeness if not already failing
            if (mashScenario.unitMashTestStatus !== MashTestStatus.MASH_FAIL) {

                if (this.testTypeIsIncomplete(userContext, scenarioRefId, TestType.UNIT)) {
                    unitStatus = MashTestStatus.MASH_INCOMPLETE;
                }
            }

            if (mashScenario.intMashTestStatus !== MashTestStatus.MASH_FAIL) {

                if (this.testTypeIsIncomplete(userContext, scenarioRefId, TestType.INTEGRATION)) {
                    intStatus = MashTestStatus.MASH_INCOMPLETE;
                }
            }

            if (mashScenario.accMashTestStatus !== MashTestStatus.MASH_FAIL) {

                if (this.testTypeIsIncomplete(userContext, scenarioRefId, TestType.ACCEPTANCE)) {
                    accStatus = MashTestStatus.MASH_INCOMPLETE;
                }
            }
        }

        return(
            {
                unitStatus: unitStatus,
                intStatus:  intStatus,
                accStatus:  accStatus
            }
        )
    }


    testTypeIsIncomplete(userContext, scenarioRefId, testType){

        const allExpectations = ScenarioTestExpectationData.getScenarioTestExpectationsForScenarioTestType(
            userContext.designVersionId,
            scenarioRefId,
            testType
        );

        // But if any values are missing or pending mark as incomplete
        let retVal = false;

        allExpectations.forEach((expectation) => {

            const userExpectationStatus = UserDvScenarioTestExpectationStatusData.getUserExpectationStatusData(userContext.userId, userContext.designVersionId, expectation._id);

            if(expectation.permutationValueId !== 'NONE'){
                if(userExpectationStatus){
                    // Expected test is missing
                    if(userExpectationStatus.expectationStatus === MashTestStatus.MASH_NOT_LINKED || userExpectationStatus.expectationStatus === MashTestStatus.MASH_PENDING){
                        retVal = true;
                    }
                } else {
                    // No status for expected test...
                    retVal = true;
                }

            }
        });

        return retVal;
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

export const TestIntegrationModules = new TestIntegrationModulesClass();