
// Ultrawide Collections
import { DesignVersions }           from '../../collections/design/design_versions.js';
import { DesignUpdates }            from '../../collections/design_update/design_updates.js';
import { DesignVersionComponents }         from '../../collections/design/design_version_components.js';
import { DesignUpdateComponents }   from '../../collections/design_update/design_update_components.js';
import { DomainDictionary }         from '../../collections/design/domain_dictionary.js';

// Ultrawide Services
import { DesignUpdateMergeAction, DesignVersionStatus, DesignUpdateStatus, UpdateMergeStatus } from '../../constants/constants.js';

//======================================================================================================================
//
// Server Modules for Design Version Items.
//
// Methods called from within main API methods
//
//======================================================================================================================

class DesignVersionModules{

    // Create a final version of the working design version before completeing it for good
    finaliseCurrentWorkingDesign(previousDesignVersionId, currentDesignVersionId){

        // Delete all design components from current version
        this.deleteCurrentVersionComponents(currentDesignVersionId);

        // Copy previous version to current
        this.copyPreviousDesignVersionToCurrent(previousDesignVersionId, currentDesignVersionId);

        // Merge updates as FINAL
        this.mergeUpdates(currentDesignVersionId, true);

    };

    // Create a progress update for the working design version
    updateCurrentWorkingDesign(previousDesignVersionId, currentDesignVersionId){

        // Delete all design components from current version
        this.deleteCurrentVersionComponents(currentDesignVersionId);

        // Copy previous version to current
        this.copyPreviousDesignVersionToCurrent(previousDesignVersionId, currentDesignVersionId);

        // Merge updates as CHANGES
        this.mergeUpdates(currentDesignVersionId, false);
    };


    deleteCurrentVersionComponents(currentDesignVersionId){

        DesignVersionComponents.remove({designVersionId: currentDesignVersionId});
    };

    copyPreviousDesignVersionToCurrent(previousDesignVersionId, currentDesignVersionId){

        // Abort if current version has not been cleared
        const currentComponentsCount = DesignVersionComponents.find({designVersionId: currentDesignVersionId}).count();
        if(currentComponentsCount > 0){
            throw new Meteor.Error('COPY DV', 'Current version has not been cleared');
        }

        // Get all the old version components
        const oldDesignComponents = DesignVersionComponents.find({designVersionId: previousDesignVersionId});

        // Recreate the current version as an exact copy
        oldDesignComponents.forEach((oldComponent) => {

            let newDesignComponentId = DesignVersionComponents.insert(
                {
                    // Identity
                    componentReferenceId:       oldComponent.componentReferenceId,
                    designId:                   oldComponent.designId,
                    designVersionId:            currentDesignVersionId,
                    componentType:              oldComponent.componentType,
                    componentLevel:             oldComponent.componentLevel,
                    componentParentIdNew:          oldComponent.componentParentIdNew,                     // This will be wrong but updated afterwards
                    componentParentReferenceIdNew: oldComponent.componentParentReferenceIdNew,
                    componentFeatureReferenceIdNew:oldComponent.componentFeatureReferenceIdNew,
                    componentIndexNew:             oldComponent.componentIndexNew,

                    // Data
                    componentNameNew:              oldComponent.componentNameNew,
                    componentNameRawNew:           oldComponent.componentNameRawNew,
                    componentNarrativeNew:         oldComponent.componentNarrativeNew,
                    componentNarrativeRawNew:      oldComponent.componentNarrativeRawNew,
                    componentTextRawNew:           oldComponent.componentTextRawNew,

                    // State
                    isRemovable:                oldComponent.isRemovable,
                    isRemoved:                  oldComponent.isRemoved,
                    isNew:                      oldComponent.isNew,
                    isDevUpdated:               oldComponent.isDevUpdated,
                    isDevAdded:                 oldComponent.isDevAdded,
                    lockingUser:                oldComponent.lockingUser,
                    designUpdateId:             oldComponent.designUpdateId,
                    updateMergeStatus:          oldComponent.updateMergeStatus
                }
            );

        });

        // Fix the parent ids
        this.fixParentIds(currentDesignVersionId);
    };

    populateNextDesignVersion(currentDesignVersionId, newDesignVersionId){

        // Get all the current version components.  These are now updated with latest updates
        const currentDesignComponents = DesignVersionComponents.find({designVersionId: currentDesignVersionId});

        // Recreate the current version as an exact copy but resetting any change indication flags so we have a blank sheet for new changes
        currentDesignComponents.forEach((currentComponent) => {

            let newDesignComponentId = DesignVersionComponents.insert(
                {
                    // Identity
                    componentReferenceId:       currentComponent.componentReferenceId,
                    designId:                   currentComponent.designId,
                    designVersionId:            newDesignVersionId,
                    componentType:              currentComponent.componentType,
                    componentLevel:             currentComponent.componentLevel,
                    componentParentIdNew:          currentComponent.componentParentIdNew,                     // This will be wrong but updated afterwards
                    componentParentReferenceIdNew: currentComponent.componentParentReferenceIdNew,
                    componentFeatureReferenceIdNew:currentComponent.componentFeatureReferenceIdNew,
                    componentIndexNew:             currentComponent.componentIndexNew,

                    // Data
                    componentNameNew:              currentComponent.componentNameNew,
                    componentNameRawNew:           currentComponent.componentNameRawNew,
                    componentNarrativeNew:         currentComponent.componentNarrativeNew,
                    componentNarrativeRawNew:      currentComponent.componentNarrativeRawNew,
                    componentTextRawNew:           currentComponent.componentTextRawNew,

                    // State
                    isRemovable:                currentComponent.isRemovable,
                    isRemoved:                  false,
                    isNew:                      false,
                    isDevUpdated:               false,
                    isDevAdded:                 false,
                    lockingUser:                'NONE',
                    designUpdateId:             'NONE',
                    updateMergeStatus:          UpdateMergeStatus.COMPONENT_BASE
                }
            );
        });

        // Fix the parent ids
        this.fixParentIds(newDesignVersionId);

    }

    // Change the old design version parent ids to the ids for the new design version
    fixParentIds(newDesignVersionId){

        // The correct parent id for the new version will be the id of the component that has the reference id relating to the parent reference id
        const newDesignVersionComponents = DesignVersionComponents.find({designVersionId: newDesignVersionId});

        newDesignVersionComponents.forEach((component) => {

            // Get the id of the new component that has the parent reference id as its unchanging reference id
            let parent = DesignVersionComponents.findOne({designVersionId: newDesignVersionId, componentReferenceId: component.componentParentReferenceIdNew});

            let parentId = 'NONE';
            if(parent){
                parentId = parent._id;
            }

            // Update if needs updating
            DesignVersionComponents.update(
                { _id: component._id, componentParentIdNew: {$ne: parentId}},
                {
                    $set:{
                        componentParentIdNew: parentId
                    }
                }
            );
        });
    };

    mergeUpdates(currentDesignVersionId, finalMerge){

        // Get the INCLUDE updates for the working DV
        const updatesToMerge = DesignUpdates.find(
            {
                designVersionId: currentDesignVersionId,
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

            // UPDATES -------------------------------------------------------------------------------------------------

            // Update all design components that are changed but not new as well
            changedComponents = DesignUpdateComponents.find({
                designUpdateId: update._id,
                isNew:          false,
                $or:[{isChanged: true}, {isTextChanged: true}]
            });

            changedComponents.forEach((changedComponent) => {

                // Assume modified unless only the details were changed
                let mergeStatus = UpdateMergeStatus.COMPONENT_MODIFIED;

                if(changedComponent.isTextChanged && !(changedComponent.isChanged)){
                    mergeStatus = UpdateMergeStatus.COMPONENT_DETAILS_MODIFIED;
                }

                DesignVersionComponents.update(
                    {
                        designVersionId:        currentDesignVersionId,
                        componentReferenceId:   changedComponent.componentReferenceId
                    },
                    {
                        $set:{
                            componentNameNew:              changedComponent.componentNameNew,
                            componentNameRawNew:           changedComponent.componentNameRawNew,
                            componentNarrativeNew:         changedComponent.componentNarrativeNew,
                            componentNarrativeRawNew:      changedComponent.componentNarrativeRawNew,
                            componentTextRawNew:           changedComponent.componentTextRawNew,
                            updateMergeStatus:          mergeStatus
                        }
                    }
                );
            });

            // MOVES ---------------------------------------------------------------------------------------------------

            // Update any existing components that have been moved to have the correct parents and list index
            // TODO - allow components to move levels
            movedComponents = DesignUpdateComponents.find({designUpdateId: update._id, isNew: false, isMoved: true});

            movedComponents.forEach((movedComponent) => {

                // Get the actual parent id of the moved component from the existing design
                actualParent = DesignVersionComponents.findOne({componentReferenceId: movedComponent.componentParentReferenceIdNew});
                if(actualParent){
                    actualParentId = actualParent._id;
                } else {
                    actualParentId = 'NONE';
                }

                // Assume moved unless also changed - in which case mark as changed.  Moving still trumps details text changes
                let mergeStatus = UpdateMergeStatus.COMPONENT_MOVED;

                if (movedComponent.isChanged) {
                    mergeStatus = UpdateMergeStatus.COMPONENT_MODIFIED;
                }

                DesignVersionComponents.update(
                    {
                        designVersionId:        currentDesignVersionId,
                        componentReferenceId:   movedComponent.componentReferenceId
                    },
                    {
                        $set:{
                            componentParentIdNew:          actualParentId,
                            componentParentReferenceIdNew: movedComponent.componentParentReferenceIdNew,
                            componentIndexNew:             movedComponent.componentIndexNew,
                            updateMergeStatus:          mergeStatus
                        }
                    }
                );

            });

            // REMOVALS ------------------------------------------------------------------------------------------------

            // Remove any design components that are removed
            // For update previews we want to logically remove then rather than actually so the removal can be seen.

            removedComponents = DesignUpdateComponents.find({designUpdateId: update._id, isRemoved: true});

            if(finalMerge){

                // Creating new version - remove completely from the version
                removedComponents.forEach((removedComponent) => {

                    DesignVersionComponents.remove(
                        {
                            designVersionId:        currentDesignVersionId,
                            componentReferenceId:   removedComponent.componentReferenceId
                        }
                    );
                });

            } else {

                // This is a work progress update - logically delete - just mark as removed
                removedComponents.forEach((removedComponent) => {
                    DesignVersionComponents.update(
                        {
                            designVersionId:        currentDesignVersionId,
                            componentReferenceId:   removedComponent.componentReferenceId
                        },
                        {
                            $set:{
                                isRemoved:          true,
                                updateMergeStatus:  UpdateMergeStatus.COMPONENT_REMOVED
                            }
                        }
                    );
                });
            }

            // ADDITIONS -----------------------------------------------------------------------------------------------

            // Add any design components that are new.  They may be changed as well but as new they just need to be inserted
            newComponents = DesignUpdateComponents.find({designUpdateId: update._id, isNew: true});

            newComponents.forEach((newComponent) => {
                DesignVersionComponents.insert(
                    {
                        // Identity
                        componentReferenceId:       newComponent.componentReferenceId,
                        designId:                   newComponent.designId,
                        designVersionId:            currentDesignVersionId,                                 // New design version
                        componentType:              newComponent.componentType,
                        componentLevel:             newComponent.componentLevel,                        // TODO - allow level to change??
                        componentParentIdNew:          newComponent.componentParentIdNew,                  // This will be wrong but updated afterwards
                        componentParentReferenceIdNew: newComponent.componentParentReferenceIdNew,
                        componentFeatureReferenceIdNew:newComponent.componentFeatureReferenceIdNew,
                        componentIndexNew:             newComponent.componentIndexNew,

                        // Data
                        componentNameNew:              newComponent.componentNameNew,
                        componentNameRawNew:           newComponent.componentNameRawNew,
                        componentNarrativeNew:         newComponent.componentNarrativeNew,
                        componentNarrativeRawNew:      newComponent.componentNarrativeRawNew,
                        componentTextRawNew:           newComponent.componentTextRawNew,

                        // State
                        isRemovable:                newComponent.isRemovable,
                        isRemoved:                  false,
                        isNew:                      false,
                        isOpen:                     false,
                        updateMergeStatus:          UpdateMergeStatus.COMPONENT_ADDED
                    }
                );
            });

            // Fix the parent ids
            this.fixParentIds(currentDesignVersionId);

            // Close down the Update if this is not a preview - i.e. if we are creating the next design version
            if(finalMerge) {

                // Set the update as now merged - no more editing allowed
                DesignUpdates.update(
                    {_id: update._id},
                    {
                        $set: {
                            updateStatus: DesignUpdateStatus.UPDATE_MERGED
                        }
                    }
                );
            }
        });

    };

    rollForwardUpdates(currentDesignVersionId, newDesignVersionId){

        //console.log("MERGE: Rolling forward updates...");

        const updatesToRollForward = DesignUpdates.find(
            {
                designVersionId: currentDesignVersionId,
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
                    designVersionId: currentDesignVersionId,
                    isNew: false,
                    isChanged: false,
                    isTextChanged: false,
                    isRemoved: false,
                    isRemovedElsewhere: false  // Or not anything that is removed in another update
                }
            );

            updateComponentsToUpdate.forEach((updateComponent) => {

                // Update the details to that of the same component in the new DV
                currentDesignVersionComponent = DesignVersionComponents.findOne({designVersionId: newDesignVersionId, componentReferenceId: updateComponent.componentReferenceId});

                if(currentDesignVersionComponent) {

                    DesignUpdateComponents.update(
                        {_id: updateComponent._id},
                        {
                            $set: {
                                componentNameOld: currentDesignVersionComponent.componentNameNew,
                                componentNameNew: currentDesignVersionComponent.componentNameNew,
                                componentNameRawOld: currentDesignVersionComponent.componentNameRawNew,
                                componentNameRawNew: currentDesignVersionComponent.componentNameRawNew,
                                componentNarrativeOld: currentDesignVersionComponent.componentNarrativeNew,
                                componentNarrativeNew: currentDesignVersionComponent.componentNarrativeNew,
                                componentNarrativeRawOld: currentDesignVersionComponent.componentNarrativeRawNew,
                                componentNarrativeRawNew: currentDesignVersionComponent.componentNarrativeRawNew,
                                componentTextRawNew: currentDesignVersionComponent.componentTextRawNew,
                                componentTextRawNew: currentDesignVersionComponent.componentTextRawNew
                            }
                        }
                    );
                } else {
                    console.log("Component with ref " + updateComponent.componentReferenceId + " not found in DV " + newDesignVersionId);
                }
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
            {designVersionId: currentDesignVersionId, updateMergeAction: DesignUpdateMergeAction.MERGE_ROLL},
            {
                $set:{
                    designVersionId: newDesignVersionId,
                    updateMergeAction: DesignUpdateMergeAction.MERGE_INCLUDE
                }
            },
            {multi: true}
        );


    }

    closeDownIgnoreUpdates(currentDesignVersionId){

        // Just mark them all as IGNORED
        DesignUpdates.update(
            {
                designVersionId: currentDesignVersionId,
                updateMergeAction: DesignUpdateMergeAction.MERGE_IGNORE
            },
            {
                $set:{
                    updateStatus: DesignUpdateStatus.UPDATE_IGNORED
                }
            },
            {multi: true}
        );
    }

    rollForwardDomainDictionary(currentDesignVersionId, newDesignVersionId){

        // We want to copy ALL dictionary entries to the new DV.

        const oldEntries = DomainDictionary.find({
            designVersionId: currentDesignVersionId
        }).fetch();

        oldEntries.forEach((entry) => {

            DomainDictionary.insert({
                designId:               entry.designId,
                designVersionId:        newDesignVersionId,
                domainTermOld:          entry.domainTermOld,
                domainTermNew:          entry.domainTermNew,
                domainTextRaw:          entry.domainTextRaw,
                sortingName:            entry.sortingName,
                markInDesign:           entry.markInDesign,
                isNew:                  entry.isNew,
                isChanged:              entry.isChanged,
            });
        });
    }

    completeCurrentDesignVersion(currentDesignVersionId){

        // Complete status depends on current status
        const currentDv = DesignVersions.findOne({_id: currentDesignVersionId});

        let newDvStatus = DesignVersionStatus.VERSION_DRAFT_COMPLETE;

        if(currentDv.designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE){
            newDvStatus = DesignVersionStatus.VERSION_UPDATABLE_COMPLETE;
        }

        DesignVersions.update(
            {_id: currentDesignVersionId},
            {
                $set:{
                    designVersionStatus: newDvStatus
                }
            }
        );
    }


}

export default new DesignVersionModules()

