
// Ultrawide Collections
import { DesignVersions }           from '../../collections/design/design_versions.js';
import { DesignUpdates }            from '../../collections/design_update/design_updates.js';
import { DesignComponents }         from '../../collections/design/design_components.js';
import { DesignUpdateComponents }   from '../../collections/design_update/design_update_components.js';

// Ultrawide Services
import { DesignUpdateMergeAction, DesignVersionStatus, DesignUpdateStatus } from '../../constants/constants.js';

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
                }
            );

        });

        // Fix the parent ids
        this.fixParentIds(oldDesignVersionId, newDesignVersionId, this.mergeStepMergeUpdates(oldDesignVersionId, newDesignVersionId));
    };

    // Change the old design version parent ids to the ids for the new design version
    fixParentIds(oldDesignVersionId, newDesignVersionId, callbackFunction){

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

        // All done - call the next step
        if(callbackFunction) {
            callbackFunction(oldDesignVersionId, newDesignVersionId);
        }
    };

    mergeStepMergeUpdates(oldDesignVersionId, newDesignVersionId){

        //console.log("MERGE: Merging updates...");

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
                    }
                );
            });

            // Fix the parent ids
            this.fixParentIds(oldDesignVersionId, newDesignVersionId);

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

        //console.log("MERGE: Updating old DV...");

        DesignVersions.update(
            {_id: oldDesignVersionId},
            {
                $set:{
                    designVersionStatus: DesignVersionStatus.VERSION_PUBLISHED_COMPLETE
                }
            }

        )
    }


}

export default new DesignVersionModules()

