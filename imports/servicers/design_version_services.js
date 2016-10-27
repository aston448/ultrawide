// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections
import {DesignVersions} from '../collections/design/design_versions.js';
import {DesignUpdates} from '../collections/design_update/design_updates.js';
import {DesignComponents} from '../collections/design/design_components.js';
import {DesignUpdateComponents} from '../collections/design_update/design_update_components.js'

// Ultrawide Services
import {DesignVersionStatus, DesignUpdateStatus, DesignUpdateMergeAction} from '../constants/constants.js';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Version Services - Entry point for Server Code testing
//
// ---------------------------------------------------------------------------------------------------------------------


class DesignVersionServices{

    addNewDesignVersion(designId, designVersionName, designVersionNumber, designVersionStatus){

        const designVersionId = DesignVersions.insert(
            {
                designId:               designId,
                designVersionName:      designVersionName,
                designVersionNumber:    designVersionNumber,
                designVersionStatus:    designVersionStatus
            },

            (error, result) => {
                if(error) {
                    console.log("Create Design Version error: " + error);
                } else {
                    console.log("Create Design Version success: " + result);
                }
            }
        );

        return designVersionId;
    }

    importDesignVersion(designId, designVersion){

        let designVersionId = DesignVersions.insert(
            {
                designId:               designId,
                designVersionName:      designVersion.designVersionName,
                designVersionNumber:    designVersion.designVersionNumber,
                designVersionRawText:   designVersion.designVersionRawText,
                designVersionStatus:    designVersion.designVersionStatus
            }
        );

        return designVersionId;
    }

    updateDesignVersionName(designVersionId, newName){

        DesignVersions.update(
            {_id: designVersionId},
            {
                $set:{
                    designVersionName: newName
                }
            }
        );
    };

    updateDesignVersionNumber(designVersionId, newNumber){

        DesignVersions.update(
            {_id: designVersionId},
            {
                $set:{
                    designVersionNumber: newNumber
                }
            }
        );
    }

    updateDesignVersionStatus(designVersionId, newStatus){

        DesignVersions.update(
            {_id: designVersionId},
            {
                $set:{
                    designVersionStatus: newStatus
                }
            }
        );
    }

    publishDesignVersion(designVersionId){

        DesignVersions.update(

            {_id: designVersionId },

            {
                $set: {
                    designVersionStatus: DesignVersionStatus.VERSION_PUBLISHED_DRAFT
                }
            },

            (error, result) => {
                if(error) {
                    // Error handler
                    console.log("Error publishing DV: " + error);
                } else {
                    console.log("Success publish DV: " + result);
                }
            }
        )
    };

    unpublishDesignVersion(designVersionId){

        DesignVersions.update(

            {_id: designVersionId },

            {
                $set: {
                    designVersionStatus: DesignVersionStatus.VERSION_NEW
                }
            },

            (error, result) => {
                if(error) {
                    // Error handler
                    console.log("Error un-publishing DV: " + error);
                } else {
                    console.log("Success un-publish DV: " + result);
                }
            }
        )
    };

    mergeUpdatesToNewDraftVersion(designVersionId){

        // The steps are called in the success callback of the previous step where necessary.  Overall the steps are:
        // 1. Insert a new Design Version
        // 2. Create new design components for the new version as a copy of the old
        // 3. Update the parent ids for the new design components
        // 4. Merge in the updates from the old DV that are for merging
        // 5. Carry forward the updates from the old DV that are for carrying forward
        // 6. Set the old DV to Published Final


        console.log("MERGE: Creating new design version...");

        // Get the current design version details
        const oldDesignVersion = DesignVersions.findOne({_id: designVersionId});

        // Create a new design version - note: this is the only way a new version can be created...
        DesignVersions.insert(
            {
                designId:               oldDesignVersion.designId,
                designVersionName:      oldDesignVersion.designVersionName + ' with updates',
                designVersionNumber:    oldDesignVersion.designVersionNumber + ' ++',
                designVersionStatus:    DesignVersionStatus.VERSION_PUBLISHED_DRAFT
            },

            (error, result) => {
                if(error) {
                    // Error handler
                    console.log("Error creating new DV: " + error);
                } else {
                    console.log("Success create new DV: " + result);

                    // Get a list of updates to be merged in and merge them
                    this.mergeStepCreateNewDesignComponents(designVersionId, result);

                }
            }
        );

    };

    mergeStepCreateNewDesignComponents(oldDesignVersionId, newDesignVersionId){

        // Here we have to create a new set of design components for the new design version - the same as the old one...
        // ...and then merge in changes as required by the user.

        console.log("MERGE: Creating new design components...");

        // Get all the old version components
        const oldDesignComponents = DesignComponents.find({designVersionId: oldDesignVersionId});

        // Create an exact copy in the new DV
        let componentsToInsert = oldDesignComponents.count();
        let componentsInserted = 0;

        oldDesignComponents.forEach((oldComponent) => {

            DesignComponents.insert(
                {
                    // Identity
                    componentReferenceId:       oldComponent.componentReferenceId,
                    designId:                   oldComponent.designId,
                    designVersionId:            newDesignVersionId,                                 // New design version
                    componentType:              oldComponent.componentType,
                    componentLevel:             oldComponent.componentLevel,
                    componentParentId:          oldComponent.componentParentId,                     // This will be wrong but updated afterwards
                    componentParentReferenceId: oldComponent.componentParentReferenceId,
                    componentIndex:             oldComponent.componentIndex,

                    // Data
                    componentName:              oldComponent.componentName,
                    componentNameRaw:           oldComponent.componentNameRaw,
                    componentNarrative:         oldComponent.componentNarrative,
                    componentNarrativeRaw:      oldComponent.componentNarrativeRaw,
                    componentTextRaw:           oldComponent.componentTextRaw,

                    // State
                    isRemovable:                oldComponent.isRemovable,
                    isRemoved:                  oldComponent.isRemoved,
                    isNew:                      oldComponent.isNew,
                    isOpen:                     oldComponent.isOpen
                },

                (error, result) => {
                    if (error) {
                        // Error handler
                        console.log("Error creating new DV component: " + error);
                    } else {

                        componentsInserted++;

                        // When all components inserted...
                        if(componentsInserted == componentsToInsert) {
                            // Fix the parent ids
                            this.fixParentIds(oldDesignVersionId, newDesignVersionId, this.mergeStepMergeUpdates(oldDesignVersionId, newDesignVersionId));

                        }

                    }
                }
            );

        });
    };


    // Change the old design version parent ids to the ids for the new design version
    fixParentIds(oldDesignVersionId, newDesignVersionId, callbackFunction){

        console.log("MERGE: Fixing parent Ids...");

        // The correct parent id for the new version will be the id of the component that has the reference id relating to the parent reference id

        const newDesignVersionComponents = DesignComponents.find({designVersionId: newDesignVersionId});
        let componentsToUpdate = newDesignVersionComponents.count();
        let componentsUpdated = 0;

        newDesignVersionComponents.forEach((component) => {

            // Get the id of the new component that has the parent reference id as its unchanging reference id
            let parent = DesignComponents.findOne({designVersionId: newDesignVersionId, componentReferenceId: component.componentParentReferenceId});

            let parentId = 'NONE';
            if(parent){
                parentId = parent._id;
            }

            // Update if needs updating
            DesignComponents.update(
                { _id: component._id, componentParentId: {$ne: parentId}},
                {
                    $set:{
                        componentParentId: parentId
                    }
                },

                (error, result) => {
                    if (error) {
                        // Error handler
                        console.log("Error updating new DV component parent id: " + error);
                    } else {

                        componentsUpdated++;

                        // When all components inserted...
                        if(componentsUpdated == componentsToUpdate) {
                            // All done - call the next step
                            if(callbackFunction) {
                                callbackFunction(oldDesignVersionId, newDesignVersionId);
                            }
                        }
                    }
                }
            );

        });
    };

    mergeStepMergeUpdates(oldDesignVersionId, newDesignVersionId){

        console.log("MERGE: Merging updates...");

        const updatesToMerge = DesignUpdates.find(
            {
                designVersionId: oldDesignVersionId,
                updateMergeAction: DesignUpdateMergeAction.MERGE_INCLUDE
            }
        );

        let changedComponents = null;
        let removedComponents = null;
        let movedComponents = null;
        let actualParent = null;
        let actualParentId = 'NONE';
        let newComponents = null;

        updatesToMerge.forEach((update) => {

            // Update all design components that are changed but not new as well
            changedComponents = DesignUpdateComponents.find({designUpdateId: update._id, isNew: false, $or:[{isChanged: true}, {isTextChanged: true}]});

            changedComponents.forEach((changedComponent) => {

                DesignComponents.update(
                    {componentReferenceId: changedComponent.componentReferenceId},
                    {
                        $set:{
                            componentName:              changedComponent.componentNameNew,
                            componentNameRaw:           changedComponent.componentNameRawNew,
                            componentNarrative:         changedComponent.componentNarrativeNew,
                            componentNarrativeRaw:      changedComponent.componentNarrativeRawNew,
                            componentTextRaw:           changedComponent.componentTextRawNew,
                        }
                    }
                );

            });

            // Update any existing components that have been moved to have the correct parents and list index
            // TODO - allow components to move levels
            movedComponents = DesignUpdateComponents.find({designUpdateId: update._id, isNew: false, isMoved: true});

            movedComponents.forEach((movedComponent) => {

                // Get the actual parent id of the moved component from the existing design
                actualParent = DesignComponents.findOne({componentReferenceId: movedComponent.componentParentReferenceIdNew});
                if(actualParent){
                    actualParentId = actualParent._id;
                } else {
                    actualParentId = 'NONE';
                }

                DesignComponents.update(
                    {componentReferenceId: movedComponent.componentReferenceId},
                    {
                        $set:{
                            componentParentId:          actualParentId,
                            componentParentReferenceId: movedComponent.componentParentReferenceIdNew,
                            componentIndex:             movedComponent.componentIndexNew
                        }
                    }
                );

            });

            // Remove any design components that are removed
            removedComponents = DesignUpdateComponents.find({designUpdateId: update._id, isNew: true});

            removedComponents.forEach((removedComponent) => {

                DesignComponents.remove(
                    {componentReferenceId: removedComponent.componentReferenceId}
                );

            });

            // Add any design components that are new.  They may be changed as well but as new they just need to be inserted
            newComponents = DesignUpdateComponents.find({designUpdateId: update._id, isNew: true});
            let componentsToInsert = newComponents.count();

            let componentsInserted = 0;

            newComponents.forEach((newComponent) => {
                DesignComponents.insert(
                    {
                        // Identity
                        componentReferenceId:       newComponent.componentReferenceId,
                        designId:                   newComponent.designId,
                        designVersionId:            newDesignVersionId,                                 // New design version
                        componentType:              newComponent.componentType,
                        componentLevel:             newComponent.componentLevel,                        // TODO - allow level to change??
                        componentParentId:          newComponent.componentParentIdNew,                  // This will be wrong but updated afterwards
                        componentParentReferenceId: newComponent.componentParentReferenceIdNew,
                        componentIndex:             newComponent.componentIndexNew,

                        // Data
                        componentName:              newComponent.componentNameNew,
                        componentNameRaw:           newComponent.componentNameRawNew,
                        componentNarrative:         newComponent.componentNarrativeNew,
                        componentNarrativeRaw:      newComponent.componentNarrativeRawNew,
                        componentTextRaw:           newComponent.componentTextRawNew,

                        // State
                        isRemovable:                newComponent.isRemovable,
                        isRemoved:                  false,
                        isNew:                      false,
                        isOpen:                     false
                    },

                    (error, result) => {
                        if (error) {
                            // Error handler
                            console.log("Error creating new DV component: " + error);
                        } else {

                            componentsInserted++;

                            // When all components inserted...
                            if (componentsInserted == componentsToInsert) {
                                // Fix the parent ids
                                this.fixParentIds(oldDesignVersionId, newDesignVersionId);
                            }

                        }
                    }
                );
            });

            // Set the update as now merged - no more editing allowed
            DesignUpdates.update(
                {_id: update._id},
                {
                    $set:{
                        updateStatus: DesignUpdateStatus.UPDATE_MERGED
                    }
                }
            );
        });

        // All merge updates are now processed - go on to the carry forward updates...
        this.mergeStepRollForwardUpdates(oldDesignVersionId, newDesignVersionId);
    };

    mergeStepRollForwardUpdates(oldDesignVersionId, newDesignVersionId){

        console.log("MERGE: Rolling forward updates...");

        const updatesToRollForward = DesignUpdates.find(
            {
                designVersionId: oldDesignVersionId,
                updateMergeAction: DesignUpdateMergeAction.MERGE_ROLL
            }
        );

        let updateComponentsToUpdate = null;
        let currentDesignVersionComponent = null;

        // These updates need to have their design version updated so they move to the new design version
        // Also, anything that is not new or changed in the update needs to be reset to match the latest design version
        updatesToRollForward.forEach((update) => {

            // Update details of any non-changed and non-new or removed components
            updateComponentsToUpdate = DesignUpdateComponents.find(
                {
                    designVersionId: oldDesignVersionId,
                    isNew: false,
                    isChanged: false,
                    isTextChanged: false,
                    isRemoved: false
                }
            );

            updateComponentsToUpdate.forEach((updateComponent) => {

                // Update the details to that of the same component in the new DV
                currentDesignVersionComponent = DesignComponents.findOne({designVersionId: newDesignVersionId, componentReferenceId: updateComponent.componentReferenceId});

                DesignUpdateComponents.update(
                    {_id: updateComponent._id},
                    {
                        $set:{
                            componentNameOld:               currentDesignVersionComponent.componentName,
                            componentNameNew:               currentDesignVersionComponent.componentName,
                            componentNameRawOld:            currentDesignVersionComponent.componentNameRaw,
                            componentNameRawNew:            currentDesignVersionComponent.componentNameRaw,
                            componentNarrativeOld:          currentDesignVersionComponent.componentNarrative,
                            componentNarrativeNew:          currentDesignVersionComponent.componentNarrative,
                            componentNarrativeRawOld:       currentDesignVersionComponent.componentNarrativeRaw,
                            componentNarrativeRawNew:       currentDesignVersionComponent.componentNarrativeRaw,
                            componentTextRaw:               currentDesignVersionComponent.componentTextRaw,
                            componentTextRawNew:            currentDesignVersionComponent.componentTextRaw
                        }
                    }
                );
            });

            // Move all components to new design version
            DesignUpdateComponents.update(
                {designUpdateId: update._id},
                {
                    $set:{
                        designVersionId: newDesignVersionId
                    }
                },
                {multi: true}
            );

        });



        // Move all updates to the new design version.  Status remains same.  Action goes back to default
        DesignUpdates.update(
            {designVersionId: oldDesignVersionId, updateMergeAction: DesignUpdateMergeAction.MERGE_ROLL},
            {
                $set:{
                    designVersionId: newDesignVersionId,
                    updateMergeAction: DesignUpdateMergeAction.MERGE_INCLUDE
                }
            },
            {multi: true}
        );

        // And finally update the old design version
        this.mergeStepUpdateOldVersion(oldDesignVersionId);

    }

    mergeStepUpdateOldVersion(oldDesignVersionId){

        console.log("MERGE: Updating old DV...");

        DesignVersions.update(
            {_id: oldDesignVersionId},
            {
                $set:{
                    designVersionStatus: DesignVersionStatus.VERSION_PUBLISHED_FINAL
                }
            }

        )
    }

}

export default new DesignVersionServices();