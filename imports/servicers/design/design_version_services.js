
// Ultrawide Collections
import {DesignVersions}             from '../../collections/design/design_versions.js';
import {DesignVersionComponents}           from '../../collections/design/design_version_components.js';

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
                    console.log(e);
                    throw new Meteor.Error(e.error, e.message);
                }

                // And finally update the old design version to complete
                DesignVersionModules.completePreviousDesignVersion(currentDesignVersionId);
            }
        }
    };

    // updateWorkingDesignVersion(currentDesignVersionId){
    //
    //     if(Meteor.isServer){
    //         // Here we are creating a temporary preview of what the working DV will look like.  To do this
    //         // we delete all data for the DV and repopulate it as per creating the next DV: merge any
    //         // updates that are marked as include.  But we don't create a new DV or move any updates.
    //
    //         // This applies only to updatable design versions.
    //
    //         // Get the Design Version the working one is based on
    //         const workingDesignVersion = DesignVersions.findOne({_id: currentDesignVersionId});
    //         let previousDesignVersionId = 'NONE';
    //
    //         if(workingDesignVersion){
    //             previousDesignVersionId = workingDesignVersion.baseDesignVersionId;
    //         } else {
    //             return;
    //         }
    //
    //         if(previousDesignVersionId !== 'NONE'){
    //             // Recreate the current DV as the previous DV plus current updates
    //             DesignVersionModules.updateCurrentWorkingDesign(previousDesignVersionId, currentDesignVersionId);
    //         }
    //
    //     }
    // }
}

export default new DesignVersionServices();