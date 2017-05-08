
// Ultrawide Collections
import {DesignVersions}                 from '../../collections/design/design_versions.js';
import {DesignVersionComponents}        from '../../collections/design/design_version_components.js';
import {DesignUpdates}                  from '../../collections/design_update/design_updates.js';
import {DesignUpdateComponents}         from '../../collections/design_update/design_update_components.js';
import {WorkPackages}                   from '../../collections/work/work_packages.js';
import {WorkPackageComponents}          from '../../collections/work/work_package_components.js';
import {UserWorkProgressSummary}        from '../../collections/summary/user_work_progress_summary.js';
import {UserDevDesignSummaryData}       from '../../collections/summary/user_dev_design_summary_data.js';
import {UserDesignVersionMashScenarios} from '../../collections/mash/user_dv_mash_scenarios.js';

// Ultrawide Services
import { DesignVersionStatus, WorkSummaryType, WorkPackageStatus, ComponentType, WorkPackageScopeType, UpdateScopeType, MashTestStatus, DesignUpdateStatus, DesignUpdateMergeAction, UpdateMergeStatus, LogLevel }      from '../../constants/constants.js';
import { DefaultItemNames }         from '../../constants/default_names.js';
import { log } from '../../common/utils.js';

import DesignVersionModules         from '../../service_modules/design/design_version_service_modules.js';

//======================================================================================================================
//
// Server Code for Design Version Items.
//
// Methods called directly by Server API
//
//======================================================================================================================

class DesignVersionServices{

    addNewDesignVersion(designId, designVersionName, designVersionNumber, designVersionStatus) {

        if (Meteor.isServer) {
            const designVersionId = DesignVersions.insert(
                {
                    designId: designId,
                    designVersionName: designVersionName,
                    designVersionNumber: designVersionNumber,
                    designVersionStatus: designVersionStatus
                }
            );

            return designVersionId;
        }
    }

    importDesignVersion(designId, designVersion){

        if(Meteor.isServer) {
            let designVersionId = DesignVersions.insert(
                {
                    designId: designId,
                    designVersionName: designVersion.designVersionName,
                    designVersionNumber: designVersion.designVersionNumber,
                    designVersionRawText: designVersion.designVersionRawText,
                    designVersionStatus: designVersion.designVersionStatus,
                    baseDesignVersionId: designVersion.baseDesignVersionId,
                    designVersionIndex: designVersion.designVersionIndex
                }
            );

            return designVersionId;
        }
    }

    updateDesignVersionName(designVersionId, newName){

        if(Meteor.isServer) {
            DesignVersions.update(
                {_id: designVersionId},
                {
                    $set: {
                        designVersionName: newName
                    }
                }
            );
        }
    };

    updateDesignVersionNumber(designVersionId, newNumber){

        if(Meteor.isServer) {
            DesignVersions.update(
                {_id: designVersionId},
                {
                    $set: {
                        designVersionNumber: newNumber
                    }
                }
            );
        }
    };

    publishDesignVersion(designVersionId){

        if(Meteor.isServer) {
            DesignVersions.update(
                {_id: designVersionId},

                {
                    $set: {
                        designVersionStatus: DesignVersionStatus.VERSION_DRAFT
                    }
                }
            );
        }
    };

    withdrawDesignVersion(designVersionId){

        if(Meteor.isServer) {
            DesignVersions.update(
                {_id: designVersionId},

                {
                    $set: {
                        designVersionStatus: DesignVersionStatus.VERSION_NEW
                    }
                }
            );
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
            const currentDesignVersion = DesignVersions.findOne({_id: currentDesignVersionId});

            // Now add a new Design Version to become the new current version
            let nextDesignVersionId = DesignVersions.insert(
                {
                    designId: currentDesignVersion.designId,
                    designVersionName: DefaultItemNames.NEXT_DESIGN_VERSION_NAME,
                    designVersionNumber: DefaultItemNames.NEXT_DESIGN_VERSION_NUMBER,
                    designVersionStatus: DesignVersionStatus.VERSION_UPDATABLE,
                    baseDesignVersionId: currentDesignVersionId,                            // Based on the previous DV
                    designVersionIndex: currentDesignVersion.designVersionIndex + 1        // Increment index to create correct ordering
                }
            );

            // If that was successful do the real work...
            if(nextDesignVersionId) {

                try {
                    // Populate new DV with a copy of the previous version
                    DesignVersionModules.copyPreviousDesignVersionToCurrent(currentDesignVersion._id, nextDesignVersionId);

                    // If moving from an updatable DV deal with any non-merged updates
                    if(currentDesignVersion.designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE) {

                        // Process the updates to be Rolled Forward
                        DesignVersionModules.rollForwardUpdates(currentDesignVersionId, nextDesignVersionId);

                        // Put to bed the ignored updates
                        DesignVersionModules.closeDownIgnoreUpdates(currentDesignVersionId);
                    }

                    // Carry forward the Domain Dictionary
                    DesignVersionModules.rollForwardDomainDictionary(currentDesignVersionId, nextDesignVersionId);

                } catch(e) {

                    // If anything went wrong roll back to where we were
                    //DesignVersionModules.rollBackNewDesignVersion(currentDesignVersionId, newDesignVersionId);
                    console.log(e.stack);
                    throw new Meteor.Error(e.error, e.stack);
                }

                // And finally update the old design version to complete
                DesignVersionModules.completePreviousDesignVersion(currentDesignVersionId);
            }
        }
    };

    updateWorkProgress(userContext){

        if(Meteor.isServer) {

            if(userContext.designVersionId === 'NONE'){
                return;
            }

            log((msg) => {console.log(msg)}, LogLevel.DEBUG, "Refreshing Work Progress Data...");

            // Remove data for DV for this user
            UserWorkProgressSummary.remove({
                userId: userContext.userId,
                designVersionId: userContext.designVersionId
            });

            // And recalculate it
            const dv = DesignVersions.findOne({_id: userContext.designVersionId});

            // Get DV stats
            const dvSummary = UserDevDesignSummaryData.findOne({
                userId:             userContext.userId,
                designVersionId:    userContext.designVersionId
            });


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
                const totalScenarios = DesignVersionComponents.find({
                        designVersionId:    userContext.designVersionId,
                        componentType:      ComponentType.SCENARIO,
                        updateMergeStatus:  {$ne: UpdateMergeStatus.COMPONENT_REMOVED}
                    }).count();

                dvTotalScenarios = totalScenarios;
                dvNoTestScenarios = totalScenarios;
            }

            log((msg) => {console.log(msg)}, LogLevel.DEBUG, "DV: Total: {} Passing: {} Failing: {} NoTest {}", dvTotalScenarios, dvPassingScenarios, dvFailingScenarios, dvNoTestScenarios);

            let batchData = [];

            switch(dv.designVersionStatus){
                case DesignVersionStatus.VERSION_NEW:
                case DesignVersionStatus.VERSION_DRAFT:
                case DesignVersionStatus.VERSION_DRAFT_COMPLETE:

                    // Get any published WPs
                    const baseWps = WorkPackages.find(
                        {
                            designVersionId:    userContext.designVersionId,
                            workPackageStatus:  {$ne: WorkPackageStatus.WP_NEW}
                        },
                        {
                            $sort: {workPackageName: 1}
                        }
                    ).fetch();

                    let dvWpScenarios = 0;

                    baseWps.forEach((wp) => {

                        let wpScenarios = WorkPackageComponents.find({
                            workPackageId: wp._id,
                            componentType: ComponentType.SCENARIO,
                            scopeType: WorkPackageScopeType.SCOPE_ACTIVE
                        }).fetch();


                        let wpTotalScenarios = 0;
                        if(wpScenarios){
                            wpTotalScenarios = wpScenarios.length;
                            dvWpScenarios += wpTotalScenarios;
                        }
                        let wpPassingScenarios = 0;
                        let wpFailingScenarios = 0;
                        let wpUntestedScenarios = 0;

                        wpScenarios.forEach((wpScenario) =>{

                            let testResult = UserDesignVersionMashScenarios.findOne({
                                userId:                     userContext.userId,
                                designVersionId:            userContext.designVersionId,
                                designScenarioReferenceId:  wpScenario.componentReferenceId
                            });

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
                        batchData.push({
                            userId:                     userContext.userId,
                            designVersionId:            userContext.designVersionId,
                            workPackageId:              wp._id,
                            workSummaryType:            WorkSummaryType.WORK_SUMMARY_BASE_WP,
                            name:                       wp.workPackageName,
                            totalScenarios:             wpTotalScenarios,
                            scenariosPassing:           wpPassingScenarios,
                            scenariosFailing:           wpFailingScenarios,
                            scenariosNoTests:           wpUntestedScenarios
                        });
                    });

                    // Insert the DV summary details
                    batchData.push({
                        userId:                     userContext.userId,
                        designVersionId:            userContext.designVersionId,
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
                    const designUpdates = DesignUpdates.find(
                        {
                            designVersionId:            userContext.designVersionId,
                            updateStatus:               {$in: [DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT, DesignUpdateStatus.UPDATE_MERGED]},
                            updateMergeAction:          DesignUpdateMergeAction.MERGE_INCLUDE
                        },
                        {
                            $sort: {updateReference: 1, updateName: 1}
                        }
                    );

                    designUpdates.forEach((du) => {

                        let duScenarios = DesignUpdateComponents.find({
                            designUpdateId: du._id,
                            componentType: ComponentType.SCENARIO,
                            isRemoved: false,
                            scopeType: UpdateScopeType.SCOPE_IN_SCOPE
                        }).fetch();

                        let duWpScenarios = 0;
                        let duPassingScenarios = 0;
                        let duFailingScenarios = 0;
                        let duUntestedScenarios = 0;

                        duScenarios.forEach((duScenario) => {

                            let wpScenario = WorkPackageComponents.findOne({
                                designVersionId:            userContext.designVersionId,
                                componentReferenceId:       duScenario.componentReferenceId,     // A Scenario can only occur in one WP for a Design Version
                                scopeType:                  WorkPackageScopeType.SCOPE_ACTIVE
                            });

                            if(wpScenario){
                                duWpScenarios++;
                            }

                            let testResult = UserDesignVersionMashScenarios.findOne({
                                userId:                     userContext.userId,
                                designVersionId:            userContext.designVersionId,
                                designScenarioReferenceId:  duScenario.componentReferenceId
                            });

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

                        // Insert this update to the summary
                        batchData.push({
                            userId:                     userContext.userId,
                            designVersionId:            userContext.designVersionId,
                            designUpdateId:             du._id,
                            workSummaryType:            WorkSummaryType.WORK_SUMMARY_UPDATE,
                            name:                       du.updateReference + ' - ' + du.updateName,
                            totalScenarios:             duScenarios.length,
                            scenariosInWp:              duWpScenarios,
                            scenariosPassing:           duPassingScenarios,
                            scenariosFailing:           duFailingScenarios,
                            scenariosNoTests:           duUntestedScenarios
                        });

                        // Get the published DU Work Packages
                        let duWorkPackages = WorkPackages.find(
                            {
                                designUpdateId: du._id,
                                workPackageStatus: {$ne: WorkPackageStatus.WP_NEW}
                            },
                            {
                                $sort: {workPackageName: 1}
                            }
                        ).fetch();

                        duWorkPackages.forEach((wp) => {

                            let wpTotalScenarios = 0;
                            let wpPassingScenarios = 0;
                            let wpFailingScenarios = 0;
                            let wpUntestedScenarios = 0;

                            let wpScenarios = WorkPackageComponents.find({
                                workPackageId:              wp._id,
                                componentType:              ComponentType.SCENARIO,
                                scopeType:                  WorkPackageScopeType.SCOPE_ACTIVE
                            }).fetch();

                            wpScenarios.forEach((wpScenario) => {

                                // Ignore removed update items
                                let wpDuItem = DesignUpdateComponents.findOne({
                                    _id: wpScenario.componentId
                                });

                                if(wpDuItem && ! wpDuItem.isRemoved) {

                                    wpTotalScenarios++;

                                    let testResult = UserDesignVersionMashScenarios.findOne({
                                        userId:                     userContext.userId,
                                        designVersionId:            userContext.designVersionId,
                                        designScenarioReferenceId:  wpScenario.componentReferenceId
                                    });

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

                            // Insert this WP to the summary
                            batchData.push({
                                userId:                     userContext.userId,
                                designVersionId:            userContext.designVersionId,
                                designUpdateId:             du._id,
                                workPackageId:              wp._id,
                                workSummaryType:            WorkSummaryType.WORK_SUMMARY_UPDATE_WP,
                                name:                       wp.workPackageName,
                                totalScenarios:             wpTotalScenarios,
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

            UserWorkProgressSummary.batchInsert(batchData);
        }

        log((msg) => {console.log(msg)}, LogLevel.DEBUG, "Done Refreshing Work Progress Data...");
    }
}

export default new DesignVersionServices();