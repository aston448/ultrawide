
// Ultrawide Collections
import { DesignVersions }           from '../../collections/design/design_versions.js';
import { DesignUpdates }            from '../../collections/design_update/design_updates.js';
import { DesignUpdateComponents }   from '../../collections/design_update/design_update_components.js';

// Ultrawide Services
import { DesignUpdateStatus, DesignUpdateMergeAction } from '../../constants/constants.js';
import { DefaultItemNames }         from '../../constants/default_names.js';

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
                    summaryDataStale:   designUpdate.summaryDataStale
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
}

export default new DesignUpdateServices();