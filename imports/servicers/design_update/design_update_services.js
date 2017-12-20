
// Ultrawide Services
import { DesignUpdateStatus, DesignUpdateMergeAction, DesignUpdateTestStatus, DesignUpdateWpStatus, DuWorkPackageTestStatus, MashTestStatus, WorkPackageTestStatus, LogLevel } from '../../constants/constants.js';
import { DefaultItemNames }         from '../../constants/default_names.js';
import { log } from '../../common/utils.js';

import DesignUpdateModules          from '../../service_modules/design_update/design_update_service_modules.js';

// Data Access
import DesignVersionData            from '../../data/design/design_version_db.js';
import DesignUpdateData             from '../../data/design_update/design_update_db.js';
import DesignUpdateComponentData    from '../../data/design_update/design_update_component_db.js';
import UserDvMashScenarioData       from '../../data/mash/user_dv_mash_scenario_db.js'

//======================================================================================================================
//
// Server Code for Design Update Items.
//
// Methods called directly by Server API
//
//======================================================================================================================

class DesignUpdateServices{

    // Add a new design update
    addNewDesignUpdate(designVersionId){

        if(Meteor.isServer) {

            return DesignUpdateData.addNewDesignUpdate(designVersionId);

        }
    };


    publishUpdate(designUpdateId){

        if(Meteor.isServer) {

            // Set published
            DesignUpdateData.updateDuStatus(
                designUpdateId,
                DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                DesignUpdateMergeAction.MERGE_INCLUDE           // By default include this update for the next DV
            );

            // Merge this update with the Design Version
            DesignUpdateModules.addUpdateToDesignVersion(designUpdateId);
        }
    };

    withdrawUpdate(designUpdateId){

        if(Meteor.isServer) {

            // This call will only act if DU is currently merged
            DesignUpdateModules.removeMergedUpdateFromDesignVersion(designUpdateId);

            // Set back to new
            DesignUpdateData.updateDuStatus(
                designUpdateId,
                DesignUpdateStatus.UPDATE_NEW,
                DesignUpdateMergeAction.MERGE_IGNORE
            );

        }
    };

    updateDesignUpdateName(designUpdateId, newName){

        if(Meteor.isServer) {

            DesignUpdateData.setUpdateName(designUpdateId, newName);
        }

    };

    updateDesignUpdateRef(designUpdateId, newRef){

        if(Meteor.isServer) {

            DesignUpdateData.setUpdateReference(designUpdateId, newRef);
        }

    };

    removeUpdate(designUpdateId){

        if(Meteor.isServer) {

            // Remove this update from the Design version if it is Merged - it should not be as have to withdraw before remove
            DesignUpdateModules.removeMergedUpdateFromDesignVersion(designUpdateId);

            // Delete all components in the design update
            const removedComponents = DesignUpdateComponentData.removeAllUpdateComponents(designUpdateId);

            if(removedComponents >= 0){

                // OK so delete the update itself
                DesignUpdateData.removeUpdate(designUpdateId);
            }
        }
    };

    updateMergeAction(designUpdateId, newAction){

        if(Meteor.isServer){

            // If becoming not merged remove before change
            if(newAction !== DesignUpdateMergeAction.MERGE_INCLUDE){

                // This call will only act if DU is currently merged
                DesignUpdateModules.removeMergedUpdateFromDesignVersion(designUpdateId);
            }

            DesignUpdateData.setUpdateMergeAction(designUpdateId, newAction);

            // Merge this update with the Design Version if now merged
            if(newAction === DesignUpdateMergeAction.MERGE_INCLUDE){
                DesignUpdateModules.addUpdateToDesignVersion(designUpdateId);
            }

        }
    };

    updateDesignUpdateStatuses(userContext){

        if(Meteor.isServer) {

            const designUpdates = DesignVersionData.getAllUpdates(userContext.designVersionId);

            log((msg) => console.log(msg), LogLevel.DEBUG, "Updating DU Statuses...");

            designUpdates.forEach((du) => {

                log((msg) => console.log(msg), LogLevel.TRACE, "  DU: {}", du.updateName);

                let duScenarios = DesignUpdateData.getNonPeerScopeScenarios(du._id);

                let allInWp = true;
                let someInWp = false;
                let noneInWp = true;
                let noFails = true;
                let noPasses = true;
                let allPassing = true;

                duScenarios.forEach((duScenario) => {

                    log((msg) => console.log(msg), LogLevel.TRACE, "    DU Scenario: {}", duScenario.componentNameNew);


                    let scenarioTestResult = UserDvMashScenarioData.getScenario(userContext, duScenario.componentReferenceId);

                    if (duScenario.workPackageId !== 'NONE' ) {
                        someInWp = true;
                        noneInWp = false;
                    } else {
                        allInWp = false;
                    }

                    if (scenarioTestResult) {
                        if (scenarioTestResult.accMashTestStatus === MashTestStatus.MASH_FAIL || scenarioTestResult.intMashTestStatus === MashTestStatus.MASH_FAIL || scenarioTestResult.unitMashTestStatus === MashTestStatus.MASH_FAIL) {
                            // Any fail means fail wins
                            noFails = false;
                        } else {
                            if (scenarioTestResult.accMashTestStatus === MashTestStatus.MASH_PASS || scenarioTestResult.intMashTestStatus === MashTestStatus.MASH_PASS || scenarioTestResult.unitMashTestStatus === MashTestStatus.MASH_PASS) {
                                // There is at least one passing test...
                                noPasses = false;
                            } else {
                                // Not a pass or fail so can't all be passing
                                allPassing = false;
                            }
                        }
                    } else {
                        allPassing = false;
                    }
                });

                log((msg) => console.log(msg), LogLevel.TRACE, "    All in WP: {}  Some in WP {}", allInWp, someInWp);
                log((msg) => console.log(msg), LogLevel.TRACE, "    No Fails: {}  No Passes {}  All Passes {}", noFails, noPasses, allPassing);

                let duWpStatus = DesignUpdateWpStatus.DU_NO_WP_SCENARIOS;

                if (allInWp) {
                    duWpStatus = DesignUpdateWpStatus.DU_ALL_WP_SCENARIOS;
                } else {
                    if (someInWp) {
                        duWpStatus = DesignUpdateWpStatus.DU_SOME_WP_SCENARIOS;
                    }
                }

                let duTestStatus = DesignUpdateTestStatus.DU_SOME_SCENARIOS_PASSING;

                if (!noFails) {
                    duTestStatus = DesignUpdateTestStatus.DU_SCENARIOS_FAILING;
                } else {
                    if (allPassing) {
                        duTestStatus = DesignUpdateTestStatus.DU_ALL_SCENARIOS_PASSING;
                    } else {
                        if (noPasses) {
                            duTestStatus = DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING;
                        }
                    }
                }

                log((msg) => console.log(msg), LogLevel.TRACE, "    WP Status: {}  Test Status: {}", duWpStatus, duTestStatus);

                DesignUpdateData.updateProgressStatus(du._id, duWpStatus, duTestStatus);

            });
        }
    }

    updateDesignUpdateWorkPackageTestStatus(designUpdateId){

        const updateWps = DesignUpdateData.getAllWorkPackages(designUpdateId);

        let wpTestStatus = DuWorkPackageTestStatus.DU_WPS_COMPLETE;

        for(const wp of updateWps){

            if(wp.workPackageTestStatus === WorkPackageTestStatus.WP_TESTS_NOT_COMPLETE){
                wpTestStatus = DuWorkPackageTestStatus.DU_WPS_NOT_COMPLETE;
                break;
            }
        }

        log((msg) => console.log(msg), LogLevel.DEBUG, 'Updating DU Completeness to {}...', wpTestStatus);
        DesignUpdateData.updateWpTestStatus(designUpdateId, wpTestStatus);

    }
}

export default new DesignUpdateServices();