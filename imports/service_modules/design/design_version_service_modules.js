
// Ultrawide Collections
import { DesignVersions }           from '../../collections/design/design_versions.js';
import { DesignUpdates }            from '../../collections/design_update/design_updates.js';
import { DesignComponents }         from '../../collections/design/design_components.js';
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

    mergeStepCreateNewDesignComponents(oldDesignVersionId, newDesignVersionId){

        // Here we have to create a new set of design components for the new design version - the same as the old one...
        // ...and then merge in changes as required by the user.

        //console.log("MERGE: Creating new design components...");

        // Get all the old version components
        const oldDesignComponents = DesignComponents.find({designVersionId: oldDesignVersionId});

        // Create an exact copy in the new DV
        oldDesignComponents.forEach((oldComponent) => {

            let newDesignComponentId = DesignComponents.insert(
                {
                    // Identity
                    componentReferenceId:       oldComponent.componentReferenceId,
                    designId:                   oldComponent.designId,
                    designVersionId:            newDesignVersionId,                                 // New design version
                    componentType:              oldComponent.componentType,
                    componentLevel:             oldComponent.componentLevel,
                    componentParentId:          oldComponent.componentParentId,                     // This will be wrong but updated afterwards
                    componentParentReferenceId: oldComponent.componentParentReferenceId,
                    componentFeatureReferenceId:oldComponent.componentFeatureReferenceId,
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
                    isDevUpdated:               oldComponent.isDevUpdated,
                    isDevAdded:                 oldComponent.isDevAdded,
                    lockingUser:                oldComponent.lockingUser,
                    designUpdateId:             oldComponent.designUpdateId
                }
            );

        });

        // Fix the parent ids
        this.fixParentIds(newDesignVersionId);
    };

    // Change the old design version parent ids to the ids for the new design version
    fixParentIds(newDesignVersionId){

        // The correct parent id for the new version will be the id of the component that has the reference id relating to the parent reference id
        const newDesignVersionComponents = DesignComponents.find({designVersionId: newDesignVersionId});

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
                }
            );

        });

    };

    mergeStepMergeUpdates(oldDesignVersionId, newDesignVersionId){

        // Note that when merging for a preview of the current working version (as opposed to creating a new one)
        // the old and new DV are the same

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

                DesignComponents.update(
                    {
                        designVersionId:        newDesignVersionId,
                        componentReferenceId:   changedComponent.componentReferenceId
                    },
                    {
                        $set:{
                            componentName:              changedComponent.componentNameNew,
                            componentNameRaw:           changedComponent.componentNameRawNew,
                            componentNarrative:         changedComponent.componentNarrativeNew,
                            componentNarrativeRaw:      changedComponent.componentNarrativeRawNew,
                            componentTextRaw:           changedComponent.componentTextRawNew,
                            updateMergeStatus:          mergeStatus
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

                // Assume moved unless also changed - in which case mark as changed.  Moving still trumps details text changes
                let mergeStatus = UpdateMergeStatus.COMPONENT_MOVED;
                if(movedComponent.isChanged){
                    mergeStatus = UpdateMergeStatus.COMPONENT_MODIFIED;
                }

                DesignComponents.update(
                    {
                        designVersionId:        newDesignVersionId,
                        componentReferenceId:   movedComponent.componentReferenceId
                    },
                    {
                        $set:{
                            componentParentId:          actualParentId,
                            componentParentReferenceId: movedComponent.componentParentReferenceIdNew,
                            componentIndex:             movedComponent.componentIndexNew,
                            updateMergeStatus:          mergeStatus
                        }
                    }
                );

            });

            // Remove any design components that are removed
            // For update previews we want to logically remove then rather than actually so the removal can be seen.

            removedComponents = DesignUpdateComponents.find({designUpdateId: update._id, isRemoved: true});

            if(oldDesignVersionId === newDesignVersionId){

                // This is a preview update - logically delete - just mark as removed
                removedComponents.forEach((removedComponent) => {
                    DesignComponents.update(
                        {
                            designVersionId:        newDesignVersionId,
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
            } else {

                // Creating new version - remove completely
                removedComponents.forEach((removedComponent) => {

                    DesignComponents.remove(
                        {
                            designVersionId:        newDesignVersionId,
                            componentReferenceId:   removedComponent.componentReferenceId
                        }
                    );

                });
            }



            // Add any design components that are new.  They may be changed as well but as new they just need to be inserted
            newComponents = DesignUpdateComponents.find({designUpdateId: update._id, isNew: true});

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
                        componentFeatureReferenceId:newComponent.componentFeatureReferenceIdNew,
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
                        isOpen:                     false,
                        updateMergeStatus:          UpdateMergeStatus.COMPONENT_ADDED
                    }
                );
            });

            // Fix the parent ids
            this.fixParentIds(newDesignVersionId);

            // Only close down the Update if this is not a preview - i.e. if we are creating the next design version
            if(oldDesignVersionId != newDesignVersionId) {
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

    mergeStepRollForwardUpdates(oldDesignVersionId, newDesignVersionId){

        //console.log("MERGE: Rolling forward updates...");

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
                    isRemoved: false,
                    isRemovedElsewhere: false  // Or not anything that is removed in another update
                }
            );

            updateComponentsToUpdate.forEach((updateComponent) => {

                // Update the details to that of the same component in the new DV
                currentDesignVersionComponent = DesignComponents.findOne({designVersionId: newDesignVersionId, componentReferenceId: updateComponent.componentReferenceId});

                if(currentDesignVersionComponent) {

                    DesignUpdateComponents.update(
                        {_id: updateComponent._id},
                        {
                            $set: {
                                componentNameOld: currentDesignVersionComponent.componentName,
                                componentNameNew: currentDesignVersionComponent.componentName,
                                componentNameRawOld: currentDesignVersionComponent.componentNameRaw,
                                componentNameRawNew: currentDesignVersionComponent.componentNameRaw,
                                componentNarrativeOld: currentDesignVersionComponent.componentNarrative,
                                componentNarrativeNew: currentDesignVersionComponent.componentNarrative,
                                componentNarrativeRawOld: currentDesignVersionComponent.componentNarrativeRaw,
                                componentNarrativeRawNew: currentDesignVersionComponent.componentNarrativeRaw,
                                componentTextRaw: currentDesignVersionComponent.componentTextRaw,
                                componentTextRawNew: currentDesignVersionComponent.componentTextRaw
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
            {designVersionId: oldDesignVersionId, updateMergeAction: DesignUpdateMergeAction.MERGE_ROLL},
            {
                $set:{
                    designVersionId: newDesignVersionId,
                    updateMergeAction: DesignUpdateMergeAction.MERGE_INCLUDE
                }
            },
            {multi: true}
        );


    }

    mergeStepIgnoreUpdates(oldDesignVersionId, newDesignVersionId){

        // Just mark them all as IGNORED
        DesignUpdates.update(
            {
                designVersionId: oldDesignVersionId,
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

    rollForwardDomainDictionary(oldDesignVersionId, newDesignVersionId){

        // We want to copy ALL dictionary entries to the new DV.

        const oldEntries = DomainDictionary.find({
            designVersionId: oldDesignVersionId
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

    mergeStepUpdateOldVersion(oldDesignVersionId){

        // Complete status depends on current status
        const oldDv = DesignVersions.findOne({_id: oldDesignVersionId});
        let newDvStatus = DesignVersionStatus.VERSION_DRAFT_COMPLETE;

        if(oldDv.designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE){
            newDvStatus = DesignVersionStatus.VERSION_UPDATABLE_COMPLETE;
        }

        DesignVersions.update(
            {_id: oldDesignVersionId},
            {
                $set:{
                    designVersionStatus: newDvStatus
                }
            }

        )
    }


}

export default new DesignVersionModules()

