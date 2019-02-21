
// Ultrawide Data
import {WorkItemData}               from '../../data/work/work_item_db.js';
import {WorkPackageData}            from '../../data/work/work_package_db.js';
import {DesignVersionData}          from '../../data/design/design_version_db.js';
import {DesignComponentData}        from '../../data/design/design_component_db.js';
import {UserDvWorkSummaryData}      from '../../data/summary/user_dv_work_summary_db.js';
import {UserDvBacklogData}          from '../../data/summary/user_dv_backlog_db.js';
import {UserDvTestSummaryData}      from '../../data/summary/user_dv_test_summary_db.js';

// Ultrawide services
import {TestSummaryModules}         from '../../service_modules/summary/test_summary_service_modules.js';

import {DesignVersionStatus, BacklogType, SummaryType, LogLevel}    from '../../constants/constants.js';
import {log}                                                        from '../../common/utils.js'
import {UserDvFeatureTestSummary} from "../../collections/summary/user_dv_feature_test_summary";
import {DesignAnomalyData} from "../../data/design/design_anomaly_db";
import {WorkPackageComponentData} from "../../data/work/work_package_component_db";

class ProjectSummaryServicesClass {

    refreshUserProjectWorkSummary(userContext){

        if(Meteor.isServer){

            if(userContext.designVersionId === 'NONE'){
                return;
            }

            log((msg) => console.log(msg), LogLevel.PERF, "Project Summary: Clear User Data START");

            // First clear the existing data for this user
            UserDvWorkSummaryData.removeUserSummaryData(userContext);
            UserDvBacklogData.removeUserBacklogData(userContext);

            log((msg) => console.log(msg), LogLevel.PERF, "Project Summary: Clear User Data END");

            // And then recreate the summary for batch insert, inserting backlog data as we find it
            const dv = DesignVersionData.getDesignVersionById(userContext.designVersionId);

            let userSummaryData = [];

            let dvAssignedRow = {
                userId:                 userContext.userId,
                summaryType:            SummaryType.SUMMARY_DV_ASSIGNED,
                dvId:                   userContext.designVersionId,
                dvName:                 DesignVersionData.getDesignVersionById(userContext.designVersionId).designVersionName,
                inId:                   'NONE',
                inName:                 '',
                itId:                   'NONE',
                itName:                 '',
                duId:                   'NONE',
                duName:                 '',
                wpId:                   'NONE',
                wpName:                 '',
                featureCount:           0,
                scenarioCount:          0,
                noExpectationsCount:    0,
                expectedTestCount:      0,
                passingTestCount:       0,
                failingTestCount:       0,
                missingTestCount:       0,
                scenarioIncompleteCount:0,
                scenarioCompleteCount:  0
            };

            const dvIncrements = WorkItemData.getDesignVersionIncrements(userContext.designVersionId);

            log((msg) => console.log(msg), LogLevel.PERF, "Project Summary: Process Increments START");

            dvIncrements.forEach((increment) => {

                let inRow = {
                    userId:                 userContext.userId,
                    summaryType:            SummaryType.SUMMARY_IN,
                    dvId:                   userContext.designVersionId,
                    dvName:                 '',
                    inId:                   increment._id,
                    inName:                 increment.wiName,
                    itId:                   'NONE',
                    itName:                 '',
                    duId:                   'NONE',
                    duName:                 '',
                    wpId:                   'NONE',
                    wpName:                 '',
                    featureCount:           0,
                    scenarioCount:          0,
                    noExpectationsCount:    0,
                    expectedTestCount:      0,
                    passingTestCount:       0,
                    failingTestCount:       0,
                    missingTestCount:       0,
                    scenarioIncompleteCount:0,
                    scenarioCompleteCount:  0
                };

                // Iterations in Increment
                const inIterations = WorkItemData.getDesignVersionIncrementIterations(userContext.designVersionId, increment.wiReferenceId);

                log((msg) => console.log(msg), LogLevel.PERF, "Project Summary: Process Iterations START");

                inIterations.forEach((iteration) => {

                    let itRow = {
                        userId:                 userContext.userId,
                        summaryType:            SummaryType.SUMMARY_IT,
                        dvId:                   userContext.designVersionId,
                        dvName:                 '',
                        inId:                   increment._id,
                        inName:                 '',
                        itId:                   iteration._id,
                        itName:                 iteration.wiName,
                        duId:                   'NONE',
                        duName:                 '',
                        wpId:                   'NONE',
                        wpName:                 '',
                        featureCount:           0,
                        scenarioCount:          0,
                        noExpectationsCount:    0,
                        expectedTestCount:      0,
                        passingTestCount:       0,
                        failingTestCount:       0,
                        missingTestCount:       0,
                        scenarioIncompleteCount:0,
                        scenarioCompleteCount:  0
                    };

                    let workPackages = [];

                    log((msg) => console.log(msg), LogLevel.PERF, "Project Summary: Process WPs START");

                    if(dv.designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE || dv.designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE_COMPLETE){

                        // All WPs are in Updates
                        // TODO Update and Update WP processing

                    } else {

                        // WPs in Iterations
                        workPackages = WorkPackageData.getDesignVersionWorkPackagesInIteration(userContext.designVersionId, iteration.wiReferenceId);

                        // Get some local WP Component Scenario Data
                        let dvWorkPackageActiveScenarioComponentsDb = new Mongo.Collection(null);
                        const dvWorkPackageActiveScenarioComponents = WorkPackageComponentData.getCurrentDesignVersionActiveScenarios(userContext.designVersionId);
                        dvWorkPackageActiveScenarioComponentsDb.batchInsert(dvWorkPackageActiveScenarioComponents);

                        workPackages.forEach((wp) => {

                            // Get all scenarios in the WP
                            const wpData = this.processWorkPackage(userContext, increment._id, iteration._id, 'NONE', wp, dvWorkPackageActiveScenarioComponentsDb);

                            //console.log('WP DATA: %o', wpData);

                            // Add work package row to the data
                            userSummaryData.push(wpData.wpRow);

                            // And update the other rows
                            itRow.scenarioCount += wpData.wpRow.scenarioCount;
                            itRow.noExpectationsCount += wpData.wpRow.noExpectationsCount;
                            itRow.expectedTestCount += wpData.wpRow.expectedTestCount;
                            itRow.passingTestCount += wpData.wpRow.passingTestCount;
                            itRow.failingTestCount += wpData.wpRow.failingTestCount;
                            itRow.missingTestCount += wpData.wpRow.missingTestCount;
                            itRow.scenarioIncompleteCount += wpData.wpRow.scenarioIncompleteCount;
                            itRow.scenarioCompleteCount += wpData.wpRow.scenarioCompleteCount;

                            inRow.scenarioCount += wpData.wpRow.scenarioCount;
                            inRow.noExpectationsCount += wpData.wpRow.noExpectationsCount;
                            inRow.expectedTestCount += wpData.wpRow.expectedTestCount;
                            inRow.passingTestCount += wpData.wpRow.passingTestCount;
                            inRow.failingTestCount += wpData.wpRow.failingTestCount;
                            inRow.missingTestCount += wpData.wpRow.missingTestCount;
                            inRow.scenarioIncompleteCount += wpData.wpRow.scenarioIncompleteCount;
                            inRow.scenarioCompleteCount += wpData.wpRow.scenarioCompleteCount;

                            dvAssignedRow.scenarioCount += wpData.wpRow.scenarioCount;
                            dvAssignedRow.noExpectationsCount += wpData.wpRow.noExpectationsCount;
                            dvAssignedRow.expectedTestCount += wpData.wpRow.expectedTestCount;
                            dvAssignedRow.passingTestCount += wpData.wpRow.passingTestCount;
                            dvAssignedRow.failingTestCount += wpData.wpRow.failingTestCount;
                            dvAssignedRow.missingTestCount += wpData.wpRow.missingTestCount;
                            dvAssignedRow.scenarioIncompleteCount += wpData.wpRow.scenarioIncompleteCount;
                            dvAssignedRow.scenarioCompleteCount += wpData.wpRow.scenarioCompleteCount;

                            // And add additional backlog data for the current position
                            wpData.backlogData.forEach((backlogItem) => {

                                // WP
                                UserDvBacklogData.addUpdateBacklogEntry(backlogItem);

                                // Iteration
                                backlogItem.wpId = 'NONE';
                                backlogItem.summaryType = SummaryType.SUMMARY_IT;
                                UserDvBacklogData.addUpdateBacklogEntry(backlogItem);

                                // Increment
                                backlogItem.itId = 'NONE';
                                backlogItem.summaryType = SummaryType.SUMMARY_IN;
                                UserDvBacklogData.addUpdateBacklogEntry(backlogItem);

                                // Design Version Assigned
                                backlogItem.inId = 'NONE';
                                backlogItem.summaryType = SummaryType.SUMMARY_DV_ASSIGNED;
                                UserDvBacklogData.addUpdateBacklogEntry(backlogItem);

                                // Design Version Total
                                backlogItem.inId = 'NONE';
                                backlogItem.summaryType = SummaryType.SUMMARY_DV;
                                UserDvBacklogData.addUpdateBacklogEntry(backlogItem);
                            });

                        });
                    }

                    log((msg) => console.log(msg), LogLevel.PERF, "Project Summary: Process WPs END");

                    // Add iteration row to data
                    userSummaryData.push(itRow);
                });

                log((msg) => console.log(msg), LogLevel.PERF, "Project Summary: Process Iterations END");



                // Add increment row to data
                userSummaryData.push(inRow);
            });

            log((msg) => console.log(msg), LogLevel.PERF, "Project Summary: Process Increments END");

            // Add design version row to data
            userSummaryData.push(dvAssignedRow);

            log((msg) => console.log(msg), LogLevel.PERF, "Project Summary: Process Orphans START");

            // Add a not under work management row...
            const orphanScenarios = DesignComponentData.getDvScenariosNotInWorkPackages(userContext.designVersionId);

            let dvUnassignedRow = {
                userId:                 userContext.userId,
                summaryType:            SummaryType.SUMMARY_DV_UNASSIGNED,
                dvId:                   userContext.designVersionId,
                dvName:                 DesignVersionData.getDesignVersionById(userContext.designVersionId).designVersionName,
                inId:                   'NONE',
                inName:                 '',
                itId:                   'NONE',
                itName:                 '',
                duId:                   'NONE',
                duName:                 '',
                wpId:                   'NONE',
                wpName:                 '',
                featureCount:           0,
                scenarioCount:          0,
                noExpectationsCount:    0,
                expectedTestCount:      0,
                passingTestCount:       0,
                failingTestCount:       0,
                missingTestCount:       0,
                scenarioIncompleteCount:0,
                scenarioCompleteCount:  0
            };

            let unassignedBacklogData = [];

            orphanScenarios.forEach((scenario) => {

                const dvUnassignedData = this.processScenario(dvUnassignedRow, userContext, scenario.componentReferenceId);
                dvUnassignedRow = dvUnassignedData.rowData;

                unassignedBacklogData = unassignedBacklogData.concat(dvUnassignedData.backlogData);
            });

            userSummaryData.push(dvUnassignedRow);

            log((msg) => console.log(msg), LogLevel.PERF, "Project Summary: Process Orphans END");

            // Get the entire total for DV = assigned + unassigned
            const dvFeatures = DesignVersionData.getNonRemovedFeatures(userContext.designId, userContext.designVersionId);
            //const dvFeatures = DesignVersionData.getNonRemovedFeatureCount(userContext.designId, userContext.designVersionId);

            let dvTotalRow = {
                userId:                 userContext.userId,
                summaryType:            SummaryType.SUMMARY_DV,
                dvId:                   userContext.designVersionId,
                dvName:                 DesignVersionData.getDesignVersionById(userContext.designVersionId).designVersionName,
                inId:                   'NONE',
                inName:                 '',
                itId:                   'NONE',
                itName:                 '',
                duId:                   'NONE',
                duName:                 '',
                wpId:                   'NONE',
                wpName:                 '',
                featureCount:           dvFeatures.length,
                scenarioCount:          dvAssignedRow.scenarioCount + dvUnassignedRow.scenarioCount,
                noExpectationsCount:    dvAssignedRow.noExpectationsCount + dvUnassignedRow.noExpectationsCount,
                expectedTestCount:      dvAssignedRow.expectedTestCount + dvUnassignedRow.expectedTestCount,
                passingTestCount:       dvAssignedRow.passingTestCount + dvUnassignedRow.passingTestCount,
                failingTestCount:       dvAssignedRow.failingTestCount + dvUnassignedRow.failingTestCount,
                missingTestCount:       dvAssignedRow.missingTestCount + dvUnassignedRow.missingTestCount,
                scenarioIncompleteCount:dvAssignedRow.scenarioIncompleteCount + dvUnassignedRow.scenarioIncompleteCount,
                scenarioCompleteCount:  dvAssignedRow.scenarioCompleteCount + dvUnassignedRow.scenarioCompleteCount
            };

            userSummaryData.push(dvTotalRow);

            // Batch insert for speed
            if(userSummaryData.length > 0){
                UserDvWorkSummaryData.bulkInsert(userSummaryData);
            }

            log((msg) => console.log(msg), LogLevel.PERF, "Project Summary: Batch Data Inserted");

            // Merge in the unassigned backlog data
            this.updateBacklogData(unassignedBacklogData);

            // Add anomaly backlog data for Features and Scenarios and 'no Scenario Feature' backlog data
            let anomalyBacklogList = [];
            let noScenarioBacklogList = [];

            const workContext = {
                userId:                 userContext.userId,
                dvId:                   userContext.designVersionId,
                inId:                   'NONE',
                itId:                   'NONE',
                duId:                   'NONE',
                wpId:                   'NONE',
                summaryType:            SummaryType.SUMMARY_DV
            };

            dvFeatures.forEach((feature) => {

                const designAnomalies = DesignAnomalyData.getAllActiveFeatureDesignAnomalies(userContext.designVersionId, feature.componentReferenceId);
                const scenarioCount = DesignComponentData.getNonRemovedFeatureScenarios(userContext.designVersionId, feature.componentReferenceId).length;

                if(designAnomalies.length > 0){

                    const backlogEntryAnomaly = this.getBacklogEntry(workContext, BacklogType.BACKLOG_SCENARIO_ANOMALY, feature.componentReferenceId, 0, 0);

                    anomalyBacklogList.push(backlogEntryAnomaly);
                }

                if(scenarioCount === 0){

                    const backlogEntryDesign = this.getBacklogEntry(workContext, BacklogType.BACKLOG_DESIGN, feature.componentReferenceId, 0, 0);

                    noScenarioBacklogList.push(backlogEntryDesign);
                }
            });

            this.updateBacklogData(anomalyBacklogList);
            this.updateBacklogData(noScenarioBacklogList);

            // Add the feature test and anomaly data to backlog data
            const backlogData = UserDvBacklogData.getAllUserBacklogData(userContext);

            backlogData.forEach((backlogFeature) => {

                // Get feature summary of test results
                const featureTestData = UserDvTestSummaryData.getFeatureSummary(userContext.userId, userContext.designVersionId, backlogFeature.featureRefId);

                // Get count of anomalies against the Feature or its Scenarios
                const featureAnomalyCount = DesignAnomalyData.getAllActiveFeatureDesignAnomalies(userContext.designVersionId, backlogFeature.featureRefId).length;

                UserDvBacklogData.addFeatureTestAndAnomalyData(backlogFeature._id, featureTestData, featureAnomalyCount);
            });

        }

    }

    processWorkPackage(userContext, incrementId, iterationId, designUpdateId, workPackage, dvWorkPackageActiveScenarioComponentsDb){

        let wpRow = {
            userId:                 userContext.userId,
            summaryType:            SummaryType.SUMMARY_WP,
            dvId:                   userContext.designVersionId,
            dvName:                 '',
            inId:                   incrementId,
            inName:                 '',
            itId:                   iterationId,
            itName:                 '',
            duId:                   designUpdateId,
            duName:                 '',
            wpId:                   workPackage._id,
            wpName:                 workPackage.workPackageName,
            featureCount:           0,
            scenarioCount:          0,
            noExpectationsCount:    0,
            expectedTestCount:      0,
            passingTestCount:       0,
            failingTestCount:       0,
            missingTestCount:       0,
            scenarioIncompleteCount:0,
            scenarioCompleteCount:  0
        };

        log((msg) => console.log(msg), LogLevel.PERF, "Project Summary: Process Scenarios for WP {} START", workPackage.workPackageName);

        // This gives us the scenario ref id
        //const itWpScenarioComponents = WorkPackageData.getActiveScenarios(workPackage._id);
        const itWpScenarioComponents = dvWorkPackageActiveScenarioComponentsDb.find({
            workPackageId: workPackage._id
        }).fetch();

        // Finally, for each Scenario get the summary data
        let wpBacklogData = [];

        itWpScenarioComponents.forEach((scenarioComponent) => {

            const scenarioData = this.processScenario(wpRow, userContext, scenarioComponent.componentReferenceId);
            wpRow = scenarioData.rowData;
            wpBacklogData = wpBacklogData.concat(scenarioData.backlogData);

        });

        //console.log('WP BACKLOG DATA: %o', wpBacklogData);

        log((msg) => console.log(msg), LogLevel.PERF, "Project Summary: Process Scenarios for WP {} END", workPackage.workPackageName);

        return{
            wpRow: wpRow,
            backlogData: wpBacklogData
        }
    }

    processScenario(rowData, userContext, scenarioRefId){

        // Get previously calculated test summary data
        // TODO - make this a pre loaded user sub section of the data to prevent slow down when lots of user data
        const scenarioData = UserDvTestSummaryData.getScenarioSummary(userContext.userId, userContext.designVersionId, scenarioRefId);

        // Count the number of open or ongoing anomalies for this scenario
        const scenarioAnomalyCount = DesignAnomalyData.getActiveScenarioDesignAnomalies(userContext.designVersionId, scenarioRefId).length;

        let noExpectationsCount = 0;
        let completeCount = 0;
        let incompleteCount = 0;

        if(scenarioData) {

            if (scenarioData.totalTestExpectedCount === 0) {
                noExpectationsCount = 1;
            }

            // Complete if tests expected and all expected are passing
            if ((scenarioData.totalTestExpectedCount === scenarioData.totalTestPassCount) && scenarioData.totalTestExpectedCount > 0) {
                completeCount = 1;
            } else {
                // Incomplete if tests expected but not all passing
                if (scenarioData.totalTestExpectedCount > 0) {
                    incompleteCount = 1;
                }
            }

            rowData.scenarioCount++;
            rowData.noExpectationsCount += noExpectationsCount;
            rowData.expectedTestCount += scenarioData.totalTestExpectedCount;
            rowData.passingTestCount += scenarioData.totalTestPassCount;
            rowData.failingTestCount += scenarioData.totalTestFailCount;
            rowData.missingTestCount += scenarioData.totalTestMissingCount;
            rowData.scenarioCompleteCount += completeCount;
            rowData.scenarioIncompleteCount += incompleteCount;

        }

        const workContext = {
            userId:                 userContext.userId,
            dvId:                   userContext.designVersionId,
            inId:                   rowData.inId,
            itId:                   rowData.itId,
            duId:                   rowData.duId,
            wpId:                   rowData.wpId,
            summaryType:            rowData.summaryType
        };

        const backlogData = this.getBacklogData(workContext, scenarioData, scenarioAnomalyCount);

        return {
            rowData: rowData,
            backlogData: backlogData
        };
    }

    getBacklogData(workContext, scenarioData, scenarioAnomalyCount){

        let backlogData = [];

        if(!scenarioData){
            return backlogData;
        }

        if(workContext.summaryType === SummaryType.SUMMARY_DV_UNASSIGNED) {

            // A scenario with no WP so goes into the work assignment backlog.
            backlogData.push(this.getBacklogEntry(workContext, BacklogType.BACKLOG_WP_ASSIGN, scenarioData.featureReferenceId, 0, 0));

            if(scenarioAnomalyCount > 0) {
                backlogData.push(this.getBacklogEntry(workContext, BacklogType.BACKLOG_SCENARIO_ANOMALY, scenarioData.featureReferenceId, 0, scenarioAnomalyCount));
            }

            // Add the same stuff to the overall DV so unassigned appears in there too
            const dvWorkContext = {
                userId:                 workContext.userId,
                dvId:                   workContext.dvId,
                inId:                   'NONE',
                itId:                   'NONE',
                duId:                   'NONE',
                wpId:                   'NONE',
                summaryType:            SummaryType.SUMMARY_DV
            };

            backlogData.push(this.getBacklogEntry(dvWorkContext, BacklogType.BACKLOG_WP_ASSIGN, scenarioData.featureReferenceId, 0, 0));

            if(scenarioData.totalTestExpectedCount === 0){
                backlogData.push(this.getBacklogEntry(dvWorkContext, BacklogType.BACKLOG_TEST_EXP, scenarioData.featureReferenceId, 0, 0));
            }

            if(scenarioData.totalTestMissingCount > 0){
                backlogData.push(this.getBacklogEntry(dvWorkContext, BacklogType.BACKLOG_TEST_MISSING, scenarioData.featureReferenceId, scenarioData.totalTestMissingCount, 0));
            }

            if(scenarioData.totalTestFailCount > 0){
                backlogData.push(this.getBacklogEntry(dvWorkContext, BacklogType.BACKLOG_TEST_FAIL, scenarioData.featureReferenceId, scenarioData.totalTestFailCount, 0));
            }

            if(scenarioAnomalyCount > 0) {
                backlogData.push(this.getBacklogEntry(dvWorkContext, BacklogType.BACKLOG_SCENARIO_ANOMALY, scenarioData.featureReferenceId, 0, scenarioAnomalyCount));
            }

        }



        // Scenarios with no test expectations
        if(scenarioData.totalTestExpectedCount === 0){
            backlogData.push(this.getBacklogEntry(workContext, BacklogType.BACKLOG_TEST_EXP, scenarioData.featureReferenceId, 0, 0));
        }

        // Scenarios with missing tests
        if(scenarioData.totalTestMissingCount > 0){
            backlogData.push(this.getBacklogEntry(workContext, BacklogType.BACKLOG_TEST_MISSING, scenarioData.featureReferenceId, scenarioData.totalTestMissingCount, 0));
        }

        // Scenarios with failing tests
        if(scenarioData.totalTestFailCount > 0){
            backlogData.push(this.getBacklogEntry(workContext, BacklogType.BACKLOG_TEST_FAIL, scenarioData.featureReferenceId, scenarioData.totalTestFailCount, 0));
        }

        // Scenarios with design anomalies
        if(scenarioAnomalyCount > 0){
            backlogData.push(this.getBacklogEntry(workContext, BacklogType.BACKLOG_SCENARIO_ANOMALY, scenarioData.featureReferenceId, 0, scenarioAnomalyCount));
        }

        return backlogData;
    }

    getBacklogEntry(workContext, backlogType, featureRefId, scenarioTestCount, scenarioAnomalyCount){

        const featureName = DesignComponentData.getDesignComponentByRef(workContext.dvId, featureRefId).componentNameNew;

        return {
            userId:                 workContext.userId,
            dvId:                   workContext.dvId,
            inId:                   workContext.inId,
            itId:                   workContext.itId,
            duId:                   workContext.duId,
            wpId:                   workContext.wpId,
            backlogType:            backlogType,
            featureRefId:           featureRefId,
            featureName:            featureName,
            scenarioCount:          1,
            scenarioTestCount:      scenarioTestCount,
            scenarioAnomalyCount:   scenarioAnomalyCount,
            summaryType:            workContext.summaryType
        }

    }

    updateBacklogData(backlogDataList){

        backlogDataList.forEach((backlogEntry) => {

            UserDvBacklogData.addUpdateBacklogEntry(backlogEntry);
        });
    }

}

export const ProjectSummaryServices = new ProjectSummaryServicesClass();

