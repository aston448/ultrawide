
import { DesignVersions } from '../../collections/design/design_versions.js';
import { DesignUpdates } from '../../collections/design_update/design_updates.js';
import { DesignUpdateComponents } from '../../collections/design_update/design_update_components.js';
import { DesignComponents } from '../../collections/design/design_components.js';

import DesignUpdateComponentServices from './design_update_component_services.js';
import DesignUpdateModules from '../../service_modules/design_update/design_update_service_modules.js';
import DesignUpdateComponentModules from '../../service_modules/design_update/design_update_component_service_modules.js';

import { DesignUpdateStatus, DesignUpdateMergeAction, ComponentType } from '../../constants/constants.js';

class DesignUpdateServices{

    // Add a new design update
    addNewDesignUpdate(designVersionId, populateUpdate){

        if(Meteor.isServer) {
            // First Add a new Update record
            const designUpdateId = DesignUpdates.insert(
                {
                    designVersionId:    designVersionId,                                // The design version this is a change to
                    updateName:         'New Design Update',                            // Identifier of this update - e.g. CR123
                    updateVersion:      '0.1',                                          // Update version number if required
                    updateStatus:       DesignUpdateStatus.UPDATE_NEW
                }
            );

            if (designUpdateId) {
                if (populateUpdate) {
                    DesignUpdateModules.populateDesignUpdate(designVersionId, designUpdateId);
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
                    updateVersion:      designUpdate.updateVersion,
                    updateRawText:      designUpdate.updateRawText,
                    updateStatus:       designUpdate.updateStatus,
                    updateMergeAction:  designUpdate.updateMergeAction
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

    updateDesignUpdateVersion(designUpdateId, newVersion){

        if(Meteor.isServer) {
            DesignUpdates.update(
                {_id: designUpdateId},
                {
                    $set: {
                        updateVersion: newVersion
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
}

export default new DesignUpdateServices();