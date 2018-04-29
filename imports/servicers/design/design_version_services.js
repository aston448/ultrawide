
// Ultrawide Services
import { DesignVersionStatus, WorkSummaryType, MashTestStatus, LogLevel }      from '../../constants/constants.js';
import { DefaultItemNames }         from '../../constants/default_names.js';
import { log } from '../../common/utils.js';

import { DesignVersionModules }         from '../../service_modules/design/design_version_service_modules.js';

// Data Access
import { DesignVersionData }            from '../../data/design/design_version_db.js';
import { DesignUpdateData }             from '../../data/design_update/design_update_db.js';
import { DesignUpdateComponentData }    from '../../data/design_update/design_update_component_db.js';
import { UserWorkProgressSummaryData }  from '../../data/summary/user_work_progress_summary_db.js';
import { UserDevDesignSummaryData }     from '../../data/summary/user_dev_design_summary_db';
import { WorkPackageData }              from '../../data/work/work_package_db.js';
import { WorkPackageComponentData }    from '../../data/work/work_package_component_db.js';
import { UserDvMashScenarioData }       from '../../data/mash/user_dv_mash_scenario_db.js';


//======================================================================================================================
//
// Server Code for Design Version Items.
//
// Methods called directly by Server API
//
//======================================================================================================================

class DesignVersionServicesClass {

    addNewDesignVersion(designId, designVersionName, designVersionNumber, designVersionStatus) {

        if (Meteor.isServer) {

            return DesignVersionData.insertNewDesignVersion(designId, designVersionName, designVersionNumber, designVersionStatus);
        }
    }

    updateDesignVersionName(designVersionId, newName){

        if(Meteor.isServer) {

            const updated = DesignVersionData.updateDesignVersionName(designVersionId, newName);
        }
    };

    updateDesignVersionNumber(designVersionId, newNumber){

        if(Meteor.isServer) {

            const updated = DesignVersionData.updateDesignVersionNumber(designVersionId, newNumber);
        }
    };

    publishDesignVersion(designVersionId){

        if(Meteor.isServer) {

            // This means setting the status to draft - everyone can see and work on it
            const updated = DesignVersionData.setDesignVersionStatus(designVersionId, DesignVersionStatus.VERSION_DRAFT);
        }
    };

    withdrawDesignVersion(designVersionId){

        if(Meteor.isServer) {

            // This means setting the status back to new - only Designer can see and work on it
            const updated = DesignVersionData.setDesignVersionStatus(designVersionId, DesignVersionStatus.VERSION_NEW);
        }
    };

    createNextDesignVersion(currentDesignVersionId){

        if(Meteor.isServer) {

            // The steps are:
            // 1. Create new Design Version (current)
            // 2. Copy what is now previous Design Version to current ignoring removed stuff and resetting statuses
            // 3. Roll forward any updates that have been marked as Carry Forward
            // 4. Close down any Ignore Updates
            // 5. Carry forward a copy of the Domain Dictionary
            // 6. Complete the old version - remove stuff that is removed and set merged updates to Merged

            // Get the current design version details - the version being completed
            const currentDesignVersion = DesignVersionData.getDesignVersionById(currentDesignVersionId);

            log(msg => console.log(msg), LogLevel.DEBUG, "Create Next Design Version Starting...");

            // Now add a new Design Version to become the new current version
            const nextDesignVersionId = DesignVersionData.insertNewDesignVersion(
                currentDesignVersion.designId,
                DefaultItemNames.NEXT_DESIGN_VERSION_NAME,
                DefaultItemNames.NEXT_DESIGN_VERSION_NUMBER,
                DesignVersionStatus.VERSION_UPDATABLE,
                currentDesignVersionId,                            // Based on the previous DV
                currentDesignVersion.designVersionIndex + 1
            );

            log(msg => console.log(msg), LogLevel.DEBUG, "  Inserted new DV");

            // If that was successful do the real work...
            if(nextDesignVersionId) {

                try {
                    // Populate new DV with a copy of the previous version
                    DesignVersionModules.copyPreviousDesignVersionToCurrent(currentDesignVersion._id, nextDesignVersionId);
                    log(msg => console.log(msg), LogLevel.DEBUG, "  Previous DV Copied to New");

                    // If moving from an updatable DV deal with any non-merged updates
                    if(currentDesignVersion.designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE) {

                        // Process the updates to be Rolled Forward
                        DesignVersionModules.rollForwardUpdates(currentDesignVersionId, nextDesignVersionId);
                        log(msg => console.log(msg), LogLevel.DEBUG, "  Updates Rolled Forward");

                        // Put to bed the ignored updates
                        DesignVersionModules.closeDownIgnoreUpdates(currentDesignVersionId);
                        log(msg => console.log(msg), LogLevel.DEBUG, "  Ignored Updates Removed");
                    }

                    // Carry forward the Domain Dictionary
                    DesignVersionModules.rollForwardDomainDictionary(currentDesignVersionId, nextDesignVersionId);
                    log(msg => console.log(msg), LogLevel.DEBUG, "  Domain Dictionary Carried Forward");

                } catch(e) {

                    // If anything went wrong roll back to where we were
                    //DesignVersionModules.rollBackNewDesignVersion(currentDesignVersionId, newDesignVersionId);
                    console.log(e.stack);
                    throw new Meteor.Error(e.code, e.stack);
                }

                // And finally update the old design version to complete
                DesignVersionModules.completePreviousDesignVersion(currentDesignVersionId);
                log(msg => console.log(msg), LogLevel.DEBUG, "Create Next Design Version Complete");
            }
        }
    };

    updateWorkProgress(userContext){

        // NOTE!!!  Because we are using batch insert for speed here the batch array entries MUST contain all fields
        // Not doing so causes no error but random results later on

        if(Meteor.isServer) {

            if(userContext.designVersionId === 'NONE'){
                return;
            }

            log((msg) => {console.log(msg)}, LogLevel.DEBUG, "Refreshing Work Progress Data...");

            // Remove data for DV for this user
            UserWorkProgressSummaryData.removeWorkProgressSummary(userContext);


            // And recalculate it
            const dv = DesignVersionData.getDesignVersionById(userContext.designVersionId);

            // Get DV stats
            const dvSummary = UserDevDesignSummaryData.getUserDesignSummary(userContext);

            let dvTotalScenarios = 0;
            let dvPassingScenarios = 0;
            let dvFailingScenarios = 0;
            let dvNoTestScenarios = 0;

            if(dvSummary) {

                // Can use the already calculated summary data
                dvTotalScenarios = dvSummary.scenarioCount;
                dvPassingScenarios = dvSummary.passingScenarioCount;
                dvFailingScenarios = dvSummary.failingScenarioCount;
                dvNoTestScenarios = dvSummary.untestedScenarioCount;

            } else {

                // No test data yet - set all as no test
                const totalScenarios = DesignVersionData.getNonRemovedScenarioCount(userContext.designVersionId);

                dvTotalScenarios = totalScenarios;
                dvNoTestScenarios = totalScenarios;
            }

            log((msg) => {console.log(msg)}, LogLevel.DEBUG, "DV: Total: {} Passing: {} Failing: {} NoTest {}", dvTotalScenarios, dvPassingScenarios, dvFailingScenarios, dvNoTestScenarios);

            let batchData = [];

            // Get a local copy of just the data relevant to this user and the current DV.
            // This optimises processing when there are lots of users / design versions.
            let myMashScenarioData = new Mongo.Collection(null);

            const userMashScenarios = UserDvMashScenarioData.getUserDesignVersionData(userContext);

            if(userMashScenarios.length > 0) {
                myMashScenarioData.batchInsert(userMashScenarios);
            }

            switch(dv.designVersionStatus){
                case DesignVersionStatus.VERSION_NEW:
                case DesignVersionStatus.VERSION_DRAFT:
                case DesignVersionStatus.VERSION_DRAFT_COMPLETE:

                    // Get any published WPs
                    const baseWps = DesignVersionData.getPublishedWorkPackages(userContext.designVersionId);

                    let dvWpScenarios = 0;

                    baseWps.forEach((wp) => {

                        let wpScenarios = WorkPackageData.getActiveScenarios(wp._id);

                        let wpTotalScenarios = 0;

                        if(wpScenarios){
                            wpTotalScenarios = wpScenarios.length;
                            dvWpScenarios += wpTotalScenarios;
                        }
                        let wpPassingScenarios = 0;
                        let wpFailingScenarios = 0;
                        let wpUntestedScenarios = 0;

                        wpScenarios.forEach((wpScenario) =>{

                            let testResult = myMashScenarioData.findOne({designScenarioReferenceId:  wpScenario.componentReferenceId})//UserDvMashScenariosData.getScenario(userContext, wpScenario.componentReferenceId);

                            if(testResult) {
                                if (testResult.accMashTestStatus === MashTestStatus.MASH_FAIL || testResult.intMashTestStatus === MashTestStatus.MASH_FAIL || testResult.unitFailCount > 0) {
                                    wpFailingScenarios++;
                                } else {
                                    if (testResult.accMashTestStatus === MashTestStatus.MASH_PASS || testResult.intMashTestStatus === MashTestStatus.MASH_PASS || testResult.unitPassCount > 0) {
                                        wpPassingScenarios++;
                                    } else {
                                        wpUntestedScenarios++;
                                    }
                                }
                            } else {
                                wpUntestedScenarios++;
                            }
                        });

                        // Insert the WP summary details
                        log((msg) => {console.log(msg)}, LogLevel.DEBUG, "Inserting Base WP Summary: Total: {}  Pass: {}  Fail: {}  No Test: {}", wpTotalScenarios, wpPassingScenarios, wpFailingScenarios, wpUntestedScenarios);
                        batchData.push({
                            userId:                     userContext.userId,
                            designVersionId:            userContext.designVersionId,
                            designUpdateId:             'NONE',
                            workPackageId:              wp._id,
                            workSummaryType:            WorkSummaryType.WORK_SUMMARY_BASE_WP,
                            name:                       wp.workPackageName,
                            totalScenarios:             wpTotalScenarios,
                            scenariosInWp:              0,
                            scenariosPassing:           wpPassingScenarios,
                            scenariosFailing:           wpFailingScenarios,
                            scenariosNoTests:           wpUntestedScenarios
                        });
                    });

                    // Insert the DV summary details

                    log((msg) => {console.log(msg)}, LogLevel.DEBUG, "Inserting DV Summary: Total: {}  Pass: {}  Fail: {}  No Test: {}", dvTotalScenarios, dvPassingScenarios, dvFailingScenarios, dvNoTestScenarios);
                    batchData.push({
                        userId:                     userContext.userId,
                        designVersionId:            userContext.designVersionId,
                        designUpdateId:             'NONE',
                        workPackageId:              'NONE',
                        workSummaryType:            WorkSummaryType.WORK_SUMMARY_BASE_DV,
                        name:                       dv.designVersionName,
                        totalScenarios:             dvTotalScenarios,
                        scenariosInWp:              dvWpScenarios,
                        scenariosPassing:           dvPassingScenarios,
                        scenariosFailing:           dvFailingScenarios,
                        scenariosNoTests:           dvNoTestScenarios
                    });
                    break;

                case DesignVersionStatus.VERSION_UPDATABLE:
                case DesignVersionStatus.VERSION_UPDATABLE_COMPLETE:

                    let dvName = dv.designVersionName + ' (ALL)';

                    // Insert a record that indicates the total for the DV, not just for updates in it
                    batchData.push({
                        userId:                     userContext.userId,
                        designVersionId:            userContext.designVersionId,
                        designUpdateId:             'NONE',
                        workPackageId:              'NONE',
                        workSummaryType:            WorkSummaryType.WORK_SUMMARY_UPDATE_DV_ALL,
                        name:                       dvName,
                        totalScenarios:             dvTotalScenarios,
                        scenariosInWp:              0,
                        scenariosPassing:           dvPassingScenarios,
                        scenariosFailing:           dvFailingScenarios,
                        scenariosNoTests:           dvNoTestScenarios
                    });

                    let dvUpdateScenarioCount = 0;
                    let dvUpdateScenariosInWpCount = 0;
                    let dvUpdatePassingCount = 0;
                    let dvUpdateFailingCount = 0;
                    let dvUpdateUntestedCount = 0;

                    // Here we need to know how many Scenarios are in Updates, then how may of those are in WPs
                    const designUpdates = DesignVersionData.getMergeIncludeUpdates(userContext.designVersionId);

                    designUpdates.forEach((du) => {

                        let duScenarios = DesignUpdateData.getInScopeScenarios(du._id);

                        let duWpScenarios = 0;
                        let duPassingScenarios = 0;
                        let duFailingScenarios = 0;
                        let duUntestedScenarios = 0;

                        duScenarios.forEach((duScenario) => {

                            let wpScenario = WorkPackageComponentData.getDvScenarioWpComponentByReference(userContext.designVersionId, duScenario.componentReferenceId);

                            if(wpScenario){
                                duWpScenarios++;
                            }

                            let testResult = myMashScenarioData.findOne({designScenarioReferenceId: duScenario.componentReferenceId}) //UserDvMashScenariosData.getScenario(userContext, duScenario.componentReferenceId);

                            if(testResult) {
                                if (testResult.accMashTestStatus === MashTestStatus.MASH_FAIL || testResult.intMashTestStatus === MashTestStatus.MASH_FAIL || testResult.unitFailCount > 0) {
                                    duFailingScenarios++;
                                } else {
                                    if (testResult.accMashTestStatus === MashTestStatus.MASH_PASS || testResult.intMashTestStatus === MashTestStatus.MASH_PASS || testResult.unitPassCount > 0) {
                                        duPassingScenarios++;
                                    } else {
                                        duUntestedScenarios++;
                                    }
                                }
                            } else {
                                duUntestedScenarios++;
                            }
                        });

                        // Add to total DV update scenario count
                        if(duScenarios) {
                            dvUpdateScenarioCount += duScenarios.length;
                        }
                        dvUpdateScenariosInWpCount += duWpScenarios;
                        dvUpdatePassingCount += duPassingScenarios;
                        dvUpdateFailingCount += duFailingScenarios;
                        dvUpdateUntestedCount += duUntestedScenarios;

                        log((msg) => {console.log(msg)}, LogLevel.DEBUG, "Inserting DU Summary: Total: {}  Pass: {}  Fail: {}  No Test: {}", duScenarios.length, duPassingScenarios, duFailingScenarios, duUntestedScenarios);

                        // Insert this update to the summary
                        batchData.push({
                            userId:                     userContext.userId,
                            designVersionId:            userContext.designVersionId,
                            designUpdateId:             du._id,
                            workPackageId:              'NONE',
                            workSummaryType:            WorkSummaryType.WORK_SUMMARY_UPDATE,
                            name:                       du.updateReference + ' - ' + du.updateName,
                            totalScenarios:             duScenarios.length,
                            scenariosInWp:              duWpScenarios,
                            scenariosPassing:           duPassingScenarios,
                            scenariosFailing:           duFailingScenarios,
                            scenariosNoTests:           duUntestedScenarios
                        });

                        // Get the published DU Work Packages
                        let duWorkPackages = DesignUpdateData.getPublishedWorkPackages(du._id);

                        duWorkPackages.forEach((wp) => {

                            let wpTotalScenarios = 0;
                            let wpPassingScenarios = 0;
                            let wpFailingScenarios = 0;
                            let wpUntestedScenarios = 0;

                            let wpScenarios = WorkPackageData.getActiveScenarios(wp._id);

                            wpScenarios.forEach((wpScenario) => {

                                // Ignore removed update items
                                let wpDuItem = DesignUpdateComponentData.getUpdateComponentByRef(wpScenario.designVersionId, du._id, wpScenario.componentReferenceId);

                                if(wpDuItem && ! wpDuItem.isRemoved) {

                                    wpTotalScenarios++;

                                    let testResult = myMashScenarioData.findOne({designScenarioReferenceId: wpScenario.componentReferenceId}) //UserDvMashScenariosData.getScenario(userContext, wpScenario.componentReferenceId);

                                    if (testResult) {
                                        if (testResult.accMashTestStatus === MashTestStatus.MASH_FAIL || testResult.intMashTestStatus === MashTestStatus.MASH_FAIL || testResult.unitFailCount > 0) {
                                            wpFailingScenarios++;
                                        } else {
                                            if (testResult.accMashTestStatus === MashTestStatus.MASH_PASS || testResult.intMashTestStatus === MashTestStatus.MASH_PASS || testResult.unitPassCount > 0) {
                                                wpPassingScenarios++;
                                            } else {
                                                wpUntestedScenarios++;
                                            }
                                        }
                                    } else {
                                        wpUntestedScenarios++;
                                    }
                                }
                            });

                            log((msg) => {console.log(msg)}, LogLevel.DEBUG, "Inserting Update WP Summary: Total: {}  Pass: {}  Fail: {}  No Test: {}", wpTotalScenarios, wpPassingScenarios, wpFailingScenarios, wpUntestedScenarios);

                            // Insert this WP to the summary
                            batchData.push({
                                userId:                     userContext.userId,
                                designVersionId:            userContext.designVersionId,
                                designUpdateId:             du._id,
                                workPackageId:              wp._id,
                                workSummaryType:            WorkSummaryType.WORK_SUMMARY_UPDATE_WP,
                                name:                       wp.workPackageName,
                                totalScenarios:             wpTotalScenarios,
                                scenariosInWp:              0,
                                scenariosPassing:           wpPassingScenarios,
                                scenariosFailing:           wpFailingScenarios,
                                scenariosNoTests:           wpUntestedScenarios
                            });
                        });
                    });

                    // Insert the Updatable DV entry now we know the total scenario count
                    // Insert the DV summary details

                    dvName = dv.designVersionName + ' (UPDATES)';

                    batchData.push({
                        userId:                     userContext.userId,
                        designVersionId:            userContext.designVersionId,
                        designUpdateId:             'NONE',
                        workPackageId:              'NONE',
                        workSummaryType:            WorkSummaryType.WORK_SUMMARY_UPDATE_DV,
                        name:                       dvName,
                        totalScenarios:             dvUpdateScenarioCount,
                        scenariosInWp:              dvUpdateScenariosInWpCount,
                        scenariosPassing:           dvUpdatePassingCount,
                        scenariosFailing:           dvUpdateFailingCount,
                        scenariosNoTests:           dvUpdateUntestedCount
                    });

                    break;
            }

            if(batchData.length > 0) {
                UserWorkProgressSummaryData.bulkInsert(batchData);
            }

            log((msg) => {console.log(msg)}, LogLevel.DEBUG, "Done Refreshing Work Progress Data...");
        }
    }
}

export const DesignVersionServices = new DesignVersionServicesClass();