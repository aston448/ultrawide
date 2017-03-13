
// Ultrawide Collections
import {DesignVersions}             from '../../collections/design/design_versions.js';
import {DesignComponents}           from '../../collections/design/design_components.js';

// Ultrawide Services
import { DesignVersionStatus }      from '../../constants/constants.js';
import { DefaultItemNames }         from '../../constants/default_names.js';

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
                    baseDesignVersionId: designVersion.baseDesignVersionId
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

    createNextDesignVersion(previousDesignVersionId){

        if(Meteor.isServer) {
            // Overall the steps are:
            // 1. Insert a new Design Version as PUBLISHED UPDATABLE
            // 2. Create new design components for the new version as a copy of the old
            // 3. Update the parent ids for the new design components
            // 4. Merge in the updates from the old DV that are for merging
            // 5. Carry forward the updates from the old DV that are for carrying forward
            // 6. Carry forward Domain Dictionary terms
            // 7. Set the old DV to Published Final

            // Get the current design version details
            const oldDesignVersion = DesignVersions.findOne({_id: previousDesignVersionId});

            // Create a new design version - note: this is the only way a new version can be created...
            let newDesignVersionId = DesignVersions.insert(
                {
                    designId: oldDesignVersion.designId,
                    designVersionName: DefaultItemNames.NEXT_DESIGN_VERSION_NAME,
                    designVersionNumber: DefaultItemNames.NEXT_DESIGN_VERSION_NUMBER,
                    designVersionStatus: DesignVersionStatus.VERSION_UPDATABLE,
                    baseDesignVersionId: previousDesignVersionId // Based on the previous DV
                }

            );

            if(newDesignVersionId){
                // Copy previous design to new version
                DesignVersionModules.mergeStepCreateNewDesignComponents(previousDesignVersionId, newDesignVersionId);

                // Fix the parent ids in the new set
                DesignVersionModules.fixParentIds(newDesignVersionId);

                // Merge in the Updates set for Merge
                DesignVersionModules.mergeStepMergeUpdates(previousDesignVersionId, newDesignVersionId);

                // Process the updates to be Rolled Forward
                DesignVersionModules.mergeStepRollForwardUpdates(previousDesignVersionId, newDesignVersionId);

                // Put to bed the ignored updates
                DesignVersionModules.mergeStepIgnoreUpdates(previousDesignVersionId, newDesignVersionId);

                // Carry forward the Domain Dictionary
                DesignVersionModules.rollForwardDomainDictionary(previousDesignVersionId, newDesignVersionId);

                // And finally update the old design version to complete
                DesignVersionModules.mergeStepUpdateOldVersion(previousDesignVersionId);
            }
        }

    };

    updateWorkingDesignVersion(workingDesignVersionId){

        if(Meteor.isServer){
            // Here we are creating a temporary preview of what the working DV will look like.  To do this
            // we delete all data for the DV and repopulate it as per creating the next DV: merge any
            // updates that are marked as include.  But we don't create a new DV or move any updates.

            // This applies only to updatable design versions.

            // Get the Design Version the working one is based on
            const workingDesignVersion = DesignVersions.findOne({_id: workingDesignVersionId});
            let baseDesignVersionId = 'NONE';

            if(workingDesignVersion){
                baseDesignVersionId = workingDesignVersion.baseDesignVersionId;
            } else {
                return;
            }

            // Delete all existing data for the working version
            DesignComponents.remove({
                designVersionId: workingDesignVersionId
            });

            // Copy previous design to new version
            DesignVersionModules.mergeStepCreateNewDesignComponents(baseDesignVersionId, workingDesignVersionId);

            // Fix the parent ids in the new set
            DesignVersionModules.fixParentIds(workingDesignVersionId);

            // Merge in the latest Updates set for Merge - in this case the updates are for the current version
            DesignVersionModules.mergeStepMergeUpdates(workingDesignVersionId, workingDesignVersionId);

        }
    }


}

export default new DesignVersionServices();