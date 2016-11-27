// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections
import {DesignVersions} from '../../collections/design/design_versions.js';
import {DesignUpdates} from '../../collections/design_update/design_updates.js';
import {DesignComponents} from '../../collections/design/design_components.js';
import {DesignUpdateComponents} from '../../collections/design_update/design_update_components.js'

// Ultrawide Services
import {DesignVersionStatus, DesignUpdateStatus, DesignUpdateMergeAction} from '../../constants/constants.js';
import DesignVersionModules from '../../service_modules/design/design_version_service_modules.js';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Version Services - Entry point for Server Code testing
//
// ---------------------------------------------------------------------------------------------------------------------


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
                    designVersionStatus: designVersion.designVersionStatus
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
                        designVersionStatus: DesignVersionStatus.VERSION_PUBLISHED_DRAFT
                    }
                }
            );
        }
    };

    unpublishDesignVersion(designVersionId){

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

    mergeUpdatesToNewDraftVersion(designVersionId){

        if(Meteor.isServer) {
            // Overall the steps are:
            // 1. Insert a new Design Version
            // 2. Create new design components for the new version as a copy of the old
            // 3. Update the parent ids for the new design components
            // 4. Merge in the updates from the old DV that are for merging
            // 5. Carry forward the updates from the old DV that are for carrying forward
            // 6. Set the old DV to Published Final


            //console.log("MERGE: Creating new design version...");

            // Get the current design version details
            const oldDesignVersion = DesignVersions.findOne({_id: designVersionId});

            // Create a new design version - note: this is the only way a new version can be created...
            let newDesignVersionId = DesignVersions.insert(
                {
                    designId: oldDesignVersion.designId,
                    designVersionName: oldDesignVersion.designVersionName + ' with updates',
                    designVersionNumber: oldDesignVersion.designVersionNumber + ' ++',
                    designVersionStatus: DesignVersionStatus.VERSION_PUBLISHED_DRAFT
                }

            );

            if(newDesignVersionId){
                // Get a list of updates to be merged in and merge them
                DesignVersionModules.mergeStepCreateNewDesignComponents(designVersionId, newDesignVersionId);
            }
        }

    };


}

export default new DesignVersionServices();