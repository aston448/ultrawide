
// Ultrawide Data
import {WorkItemData}               from '../../data/work/work_item_db.js';
import {WorkPackageData}            from '../../data/work/work_package_db.js';
import {DesignVersionData}          from '../../data/design/design_version_db.js';
import {DesignComponentData}        from '../../data/design/design_component_db.js';
import {UserDvWorkSummaryData}      from '../../data/summary/user_dv_work_summary_db.js';
import {UserDvBacklogData}          from '../../data/summary/user_dv_backlog_db.js';

// Ultrawide services
import {TestSummaryModules}         from '../../service_modules/summary/test_summary_service_modules.js';

import {DesignVersionStatus, BacklogType, SummaryType, LogLevel}    from '../../constants/constants.js';
import {log}                                                        from '../../common/utils.js'

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

            let dvRow = {
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
                scenarioCount:          0,
                noExpectationsCount:    0,
                expectedTestCount:      0,
                passingTestCount:       0,
                failingTestCount:       0,
                missingTestCount:       0,
                noWorkPackage:          false
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
                    scenarioCount:          0,
                    noExpectationsCount:    0,
                    expectedTestCount:      0,
                    passingTestCount:       0,
                    failingTestCount:       0,
                    missingTestCount:       0,
                    noWorkPackage:          false
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
                        scenarioCount:          0,
                        noExpectationsCount:    0,
                        expectedTestCount:      0,
                        passingTestCount:       0,
                        failingTestCount:       0,
                        missingTestCount:       0,
                        noWorkPackage:          false
                    };

                    let workPackages = [];

                    log((msg) => console.log(msg), LogLevel.PERF, "Project Summary: Process WPs START");

                    if(dv.designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE || dv.designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE_COMPLETE){

                        // All WPs are in Updates
                        // TODO Update and Update WP processing

                    } else {

                        // WPs in Iterations
                        workPackages = WorkPackageData.getDesignVersionWorkPackagesInIteration(userContext.designVersionId, iteration.wiReferenceId);

                        workPackages.forEach((wp) => {

                            // Get all scenarios in the WP
                            const wpRow = this.processWorkPackage(userContext, increment._id, iteration._id, 'NONE', wp);

                            // Add work package row to the data
                            userSummaryData.push(wpRow);

                            // And update the other rows
                            itRow.scenarioCount += wpRow.scenarioCount;
                            itRow.noExpectationsCount += wpRow.noExpectationsCount;
                            itRow.expectedTestCount += wpRow.expectedTestCount;
                            itRow.passingTestCount += wpRow.passingTestCount;
                            itRow.failingTestCount += wpRow.failingTestCount;
                            itRow.missingTestCount += wpRow.missingTestCount;

                            inRow.scenarioCount += wpRow.scenarioCount;
                            inRow.noExpectationsCount += wpRow.noExpectationsCount;
                            inRow.expectedTestCount += wpRow.expectedTestCount;
                            inRow.passingTestCount += wpRow.passingTestCount;
                            inRow.failingTestCount += wpRow.failingTestCount;
                            inRow.missingTestCount += wpRow.missingTestCount;

                            dvRow.scenarioCount += wpRow.scenarioCount;
                            dvRow.noExpectationsCount += wpRow.noExpectationsCount;
                            dvRow.expectedTestCount += wpRow.expectedTestCount;
                            dvRow.passingTestCount += wpRow.passingTestCount;
                            dvRow.failingTestCount += wpRow.failingTestCount;
                            dvRow.missingTestCount += wpRow.missingTestCount;

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
            userSummaryData.push(dvRow);

            log((msg) => console.log(msg), LogLevel.PERF, "Project Summary: Process Orphans START");

            // Add a not under work management row...
            const orphanScenarios = DesignComponentData.getDvScenariosNotInWorkPackages(userContext.designVersionId);

            let dvOrphanRow = {
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
                scenarioCount:          0,
                noExpectationsCount:    0,
                expectedTestCount:      0,
                passingTestCount:       0,
                failingTestCount:       0,
                missingTestCount:       0,
                noWorkPackage:          true
            };

            orphanScenarios.forEach((scenario) => {

                dvOrphanRow = this.processScenario(dvOrphanRow, userContext, scenario.componentReferenceId);

            });

            userSummaryData.push(dvOrphanRow);

            log((msg) => console.log(msg), LogLevel.PERF, "Project Summary: Process Orphans END");

            // Batch insert for speed
            if(userSummaryData.length > 0){
                UserDvWorkSummaryData.bulkInsert(userSummaryData);
            }

            log((msg) => console.log(msg), LogLevel.PERF, "Project Summary: Batch Data Inserted");

        }

    }

    processWorkPackage(userContext, incrementId, iterationId, designUpdateId, workPackage){

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
            scenarioCount:          0,
            noExpectationsCount:    0,
            expectedTestCount:      0,
            passingTestCount:       0,
            failingTestCount:       0,
            missingTestCount:       0,
            noWorkPackage:          false
        };

        log((msg) => console.log(msg), LogLevel.PERF, "Project Summary: Process Scenarios for WP {} END", workPackage.workPackageName);

        // This gives us the scenario ref id
        const itWpScenarioComponents = WorkPackageData.getActiveScenarios(workPackage._id);

        // Finally, for each Scenario get the summary data
        itWpScenarioComponents.forEach((scenarioComponent) => {

            wpRow = this.processScenario(wpRow, userContext, scenarioComponent.componentReferenceId)

        });

        log((msg) => console.log(msg), LogLevel.PERF, "Project Summary: Process Scenarios for WP {} END", workPackage.workPackageName);

        return wpRow;
    }

    processScenario(rowData, userContext, scenarioRefId){

        const scenarioData = TestSummaryModules.getSummaryDataForScenario(userContext, scenarioRefId);

        let noExpectationsCount = 0;

        if(scenarioData.totalTestExpectedCount === 0){
            noExpectationsCount = 1;
        }

        rowData.scenarioCount++;
        rowData.noExpectationsCount += noExpectationsCount;
        rowData.expectedTestCount += scenarioData.totalTestExpectedCount;
        rowData.passingTestCount += scenarioData.totalTestPassCount;
        rowData.failingTestCount += scenarioData.totalTestFailCount;
        rowData.missingTestCount += scenarioData.totalTestMissingCount;

        const workContext = {
            userId:                 userContext.userId,
            dvId:                   userContext.designVersionId,
            inId:                   rowData.inId,
            itId:                   rowData.itId,
            duId:                   rowData.duId,
            wpId:                   rowData.wpId,
            noWorkPackage:          rowData.noWorkPackage
        };

        this.addBacklogData(workContext, scenarioData);

        return rowData;
    }

    addBacklogData(workContext, scenarioData){

        if(workContext.noWorkPackage){

            // A scenario with no WP so goes into the work assignment backlog.
            UserDvBacklogData.addUpdateBacklogEntry(workContext, scenarioData.featureReferenceId, 0, BacklogType.BACKLOG_WP_ASSIGN);

        } else {

            // Scenarios with no test expectations
            if(scenarioData.totalTestExpectedCount === 0){
                UserDvBacklogData.addUpdateBacklogEntry(workContext, scenarioData.featureReferenceId, 0, BacklogType.BACKLOG_TEST_EXP);
            }

            // Scenarios with missing tests
            if(scenarioData.totalTestMissingCount > 0){
                UserDvBacklogData.addUpdateBacklogEntry(workContext, scenarioData.featureReferenceId, scenarioData.totalTestMissingCount, BacklogType.BACKLOG_TEST_MISSING);
            }

            // Scenarios with failing tests
            if(scenarioData.totalTestFailCount > 0){
                UserDvBacklogData.addUpdateBacklogEntry(workContext, scenarioData.featureReferenceId, scenarioData.totalTestFailCount, BacklogType.BACKLOG_TEST_FAIL);
            }
        }
    }
}

export const ProjectSummaryServices = new ProjectSummaryServicesClass();

