
// Ultrawide Collections
import { DesignUpdates }                    from '../../collections/design_update/design_updates.js';
import { DesignUpdateComponents }           from '../../collections/design_update/design_update_components.js';
import { WorkPackageComponents }            from '../../collections/work/work_package_components.js';
import { UserDesignVersionMashScenarios }   from '../../collections/mash/user_dv_mash_scenarios.js';

// Ultrawide Services
import { DesignUpdateStatus, DesignUpdateMergeAction, DesignUpdateTestStatus, DesignUpdateWpStatus, MashTestStatus, ComponentType, UpdateScopeType, LogLevel } from '../../constants/constants.js';
import { DefaultItemNames }         from '../../constants/default_names.js';
import { log } from '../../common/utils.js';

import DesignUpdateModules          from '../../service_modules/design_update/design_update_service_modules.js';

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

            const designUpdateId = DesignUpdates.insert(
                {
                    designVersionId:    designVersionId,                                // The design version this is a change to
                    updateName:         DefaultItemNames.NEW_DESIGN_UPDATE_NAME,        // Identifier of this update
                    updateReference:    DefaultItemNames.NEW_DESIGN_UPDATE_REF,     // Update version number if required
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW
                }
            );

            return designUpdateId;
        }
    };

    importDesignUpdate(designVersionId, designUpdate){

        if(Meteor.isServer) {

            let designUpdateId = DesignUpdates.insert(
                {
                    designVersionId:    designVersionId,
                    updateName:         designUpdate.updateName,
                    updateReference:    designUpdate.updateReference,
                    updateRawText:      designUpdate.updateRawText,
                    updateStatus:       designUpdate.updateStatus,
                    updateMergeAction:  designUpdate.updateMergeAction,
                    summaryDataStale:   true,                               // Ensure that all summaries get recreated after an import as various IDs will be broken
                    updateWpStatus:     designUpdate.updateWpStatus,
                    updateTestStatus:   designUpdate.updateTestStatus
                }
            );

            return designUpdateId;
        }
    }

    publishUpdate(designUpdateId){

        if(Meteor.isServer) {
            DesignUpdates.update(
                {_id: designUpdateId},
                {
                    $set: {
                        updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
                        updateMergeAction:  DesignUpdateMergeAction.MERGE_INCLUDE    // By default include this update for the next DV
                    }
                }
            );

            // Merge this update with the Design Version
            DesignUpdateModules.addUpdateToDesignVersion(designUpdateId);
        }
    };

    withdrawUpdate(designUpdateId){

        if(Meteor.isServer) {

            // This call will only act if DU is currently merged
            DesignUpdateModules.removeMergedUpdateFromDesignVersion(designUpdateId);

            DesignUpdates.update(
                {_id: designUpdateId},
                {
                    $set: {
                        updateStatus:       DesignUpdateStatus.UPDATE_NEW,
                        updateMergeAction:  DesignUpdateMergeAction.MERGE_IGNORE
                    }
                }
            );


        }
    };

    updateDesignUpdateName(designUpdateId, newName){

        if(Meteor.isServer) {
            DesignUpdates.update(
                {_id: designUpdateId},
                {
                    $set: {
                        updateName: newName
                    }
                }
            );
        }

    };

    updateDesignUpdateRef(designUpdateId, newRef){

        if(Meteor.isServer) {
            DesignUpdates.update(
                {_id: designUpdateId},
                {
                    $set: {
                        updateReference: newRef
                    }
                }
            );
        }

    };

    removeUpdate(designUpdateId){

        if(Meteor.isServer) {

            // Remove this update from the Design version if it is Merged - it should not be as have to withdraw before remove
            DesignUpdateModules.removeMergedUpdateFromDesignVersion(designUpdateId);

            // Delete all components in the design update
            let removedComponents = DesignUpdateComponents.remove(
                {designUpdateId: designUpdateId}
            );

            if(removedComponents >= 0){

                // OK so delete the update itself
                DesignUpdates.remove({_id: designUpdateId});
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

            DesignUpdates.update(
                {_id: designUpdateId},
                {
                    $set:{
                        updateMergeAction: newAction
                    }
                }
            );

            // Merge this update with the Design Version if now merged
            if(newAction === DesignUpdateMergeAction.MERGE_INCLUDE){
                DesignUpdateModules.addUpdateToDesignVersion(designUpdateId);
            }

        }
    };

    updateDesignUpdateStatuses(userContext){

        if(Meteor.isServer) {

            const designUpdates = DesignUpdates.find({designVersionId: userContext.designVersionId});

            log((msg) => console.log(msg), LogLevel.INFO, "Updating DU Statuses...");

            designUpdates.forEach((du) => {

                log((msg) => console.log(msg), LogLevel.INFO, "  DU: {}", du.updateName);

                let duScenarios = DesignUpdateComponents.find({
                    designUpdateId: du._id,
                    componentType: ComponentType.SCENARIO,
                    scopeType: {$ne: UpdateScopeType.SCOPE_PEER_SCOPE}
                }).fetch();
                let allInWp = true;
                let someInWp = false;
                let noneInWp = true;
                let noFails = true;
                let noPasses = true;
                let allPassing = true;

                duScenarios.forEach((duScenario) => {

                    log((msg) => console.log(msg), LogLevel.TRACE, "    DU Scenario: {}", duScenario.componentNameNew);


                    let scenarioTestResult = UserDesignVersionMashScenarios.findOne({
                        userId: userContext.userId,
                        designVersionId: userContext.designVersionId,
                        designScenarioReferenceId: duScenario.componentReferenceId
                    });

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

                log((msg) => console.log(msg), LogLevel.INFO, "    All in WP: {}  Some in WP {}", allInWp, someInWp);
                log((msg) => console.log(msg), LogLevel.INFO, "    No Fails: {}  No Passes {}  All Passes {}", noFails, noPasses, allPassing);

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

                log((msg) => console.log(msg), LogLevel.INFO, "    WP Status: {}  Test Status: {}", duWpStatus, duTestStatus);

                DesignUpdates.update(
                    {
                        _id: du._id
                    },
                    {
                        $set: {
                            updateWpStatus: duWpStatus,
                            updateTestStatus: duTestStatus
                        }
                    }
                );
            });
        }
    }
}

export default new DesignUpdateServices();