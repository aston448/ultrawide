
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
    addNewDesignUpdate(designVersionId, populateUpdate){

        if(Meteor.isServer) {
            // First Add a new Update record
            const designUpdateId = DesignUpdates.insert(
                {
                    designVersionId:    designVersionId,                                // The design version this is a change to
                    updateName:         DefaultItemNames.NEW_DESIGN_UPDATE_NAME,        // Identifier of this update
                    updateReference:    DefaultItemNames.NEW_DESIGN_UPDATE_REF,     // Update version number if required
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW
                }
            );

            // Next get the base design version to create the update from
            const designVersion = DesignVersions.findOne({
                _id: designVersionId
            });

            if (designUpdateId && designVersion) {
                if (populateUpdate) {
                    DesignUpdateModules.populateDesignUpdate(designVersion.baseDesignVersionId, designVersionId, designUpdateId);
                }
            }

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
        }
    };

    withdrawUpdate(designUpdateId){

        if(Meteor.isServer) {
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

            DesignUpdates.update(
                {_id: designUpdateId},
                {
                    $set:{
                        updateMergeAction: newAction
                    }
                }
            );
        }
    };
}

export default new DesignUpdateServices();