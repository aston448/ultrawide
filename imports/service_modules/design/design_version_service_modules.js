
// Ultrawide Collections
import { DesignVersions }           from '../../collections/design/design_versions.js';
import { DesignUpdates }            from '../../collections/design_update/design_updates.js';
import { DesignVersionComponents }         from '../../collections/design/design_version_components.js';
import { DesignUpdateComponents }   from '../../collections/design_update/design_update_components.js';
import { DomainDictionary }         from '../../collections/design/domain_dictionary.js';

// Ultrawide Services
import { DesignUpdateMergeAction, DesignVersionStatus, DesignUpdateStatus, UpdateMergeStatus, ComponentType } from '../../constants/constants.js';

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

        // Recreate the current version as an exact copy with the NEW values being used
        oldDesignComponents.forEach((previousComponent) => {

            // Insert all except removed items
            if(previousComponent.updateMergeStatus !== UpdateMergeStatus.COMPONENT_REMOVED) {

                DesignVersionComponents.insert(
                    {
                        // Identity
                        componentReferenceId:           previousComponent.componentReferenceId,
                        designId:                       previousComponent.designId,
                        designVersionId:                currentDesignVersionId,
                        componentType:                  previousComponent.componentType,
                        componentLevel:                 previousComponent.componentLevel,

                        componentParentIdOld:           previousComponent.componentParentIdNew,
                        componentParentIdNew:           previousComponent.componentParentIdNew,
                        componentParentReferenceIdOld:  previousComponent.componentParentReferenceIdNew,
                        componentParentReferenceIdNew:  previousComponent.componentParentReferenceIdNew,
                        componentFeatureReferenceIdOld: previousComponent.componentFeatureReferenceIdNew,
                        componentFeatureReferenceIdNew: previousComponent.componentFeatureReferenceIdNew,
                        componentIndexOld:              previousComponent.componentIndexNew,
                        componentIndexNew:              previousComponent.componentIndexNew,

                        // Data
                        componentNameOld:               previousComponent.componentNameNew,
                        componentNameNew:               previousComponent.componentNameNew,
                        componentNameRawOld:            previousComponent.componentNameRawNew,
                        componentNameRawNew:            previousComponent.componentNameRawNew,
                        componentNarrativeOld:          previousComponent.componentNarrativeNew,
                        componentNarrativeNew:          previousComponent.componentNarrativeNew,
                        componentNarrativeRawOld:       previousComponent.componentNarrativeRawNew,
                        componentNarrativeRawNew:       previousComponent.componentNarrativeRawNew,
                        componentTextRawOld:            previousComponent.componentTextRawNew,
                        componentTextRawNew:            previousComponent.componentTextRawNew,

                        // Update State - everything is reset
                        isNew:                          false,
                        workPackageId:                  'NONE',
                        updateMergeStatus:              UpdateMergeStatus.COMPONENT_BASE,
                        isDevUpdated:                   false,
                        isDevAdded:                     false,

                        isRemovable:                    previousComponent.isRemovable,
                    }
                );
            }

        });

        // Fix the parent ids
        this.fixParentIdsForDesignVersion(currentDesignVersionId);
    };

    // populateNextDesignVersion(currentDesignVersionId, newDesignVersionId){
    //
    //     // Get all the current version components.  These are now updated with latest updates
    //     const currentDesignComponents = DesignVersionComponents.find({designVersionId: currentDesignVersionId});
    //
    //     // Recreate the current version as an exact copy but resetting any change indication flags so we have a blank sheet for new changes
    //     currentDesignComponents.forEach((currentComponent) => {
    //
    //         let newDesignComponentId = DesignVersionComponents.insert(
    //             {
    //                 // Identity
    //                 componentReferenceId:           currentComponent.componentReferenceId,
    //                 designId:                       currentComponent.designId,
    //                 designVersionId:                newDesignVersionId,
    //                 componentType:                  currentComponent.componentType,
    //                 componentLevel:                 currentComponent.componentLevel,
    //
    //                 componentParentIdOld:           oldComponent.componentParentIdNew,
    //                 componentParentIdNew:           oldComponent.componentParentIdNew,
    //                 componentParentReferenceIdOld:  oldComponent.componentParentReferenceIdNew,
    //                 componentParentReferenceIdNew:  oldComponent.componentParentReferenceIdNew,
    //                 componentFeatureReferenceIdOld: oldComponent.componentFeatureReferenceIdNew,
    //                 componentFeatureReferenceIdNew: oldComponent.componentFeatureReferenceIdNew,
    //                 componentIndexOld:              oldComponent.componentIndexNew,
    //                 componentIndexNew:              oldComponent.componentIndexNew,
    //
    //                 // Data
    //                 componentNameNew:              currentComponent.componentNameNew,
    //                 componentNameRawNew:           currentComponent.componentNameRawNew,
    //                 componentNarrativeNew:         currentComponent.componentNarrativeNew,
    //                 componentNarrativeRawNew:      currentComponent.componentNarrativeRawNew,
    //                 componentTextRawNew:           currentComponent.componentTextRawNew,
    //
    //                 // State
    //                 isRemovable:                currentComponent.isRemovable,
    //                 isRemoved:                  false,
    //                 isNew:                      false,
    //                 isDevUpdated:               false,
    //                 isDevAdded:                 false,
    //                 lockingUser:                'NONE',
    //                 designUpdateId:             'NONE',
    //                 updateMergeStatus:          UpdateMergeStatus.COMPONENT_BASE
    //             }
    //         );
    //     });
    //
    //     // Fix the parent ids
    //     this.fixParentIds(newDesignVersionId);
    //
    // }

    // Change the old design version parent ids to the ids for the new design version
    fixParentIdsForDesignVersion(newDesignVersionId){

        // The correct parent id for the new version will be the id of the component that has the reference id relating to the parent reference id
        const newDesignVersionComponents = DesignVersionComponents.find({designVersionId: newDesignVersionId});

        newDesignVersionComponents.forEach((component) => {

            this.fixParentIds(component);
        });
    };


    fixParentIdsForComponent(componentId){

        // The correct parent id for the new version will be the id of the component that has the reference id relating to the parent reference id
        const component = DesignVersionComponents.findOne({_id: componentId});

        this.fixParentIds(component);

    };

    fixParentIds(component){

        // Get the id of the new component that has the parent reference id as its unchanging reference id
        let parentNew = DesignVersionComponents.findOne({designVersionId: component.designVersionId, componentReferenceId: component.componentParentReferenceIdNew});
        let parentOld = DesignVersionComponents.findOne({designVersionId: component.designVersionId, componentReferenceId: component.componentParentReferenceIdOld});

        let parentIdNew = 'NONE';
        let parentIdOld = 'NONE';

        if(parentNew){
            parentIdNew = parentNew._id;
        }

        if(parentOld){
            parentIdOld = parentOld._id;
        }

        // Update
        DesignVersionComponents.update(
            { _id: component._id},
            {
                $set:{
                    componentParentIdOld: parentIdOld,
                    componentParentIdNew: parentIdNew
                }
            }
        );
    }

    mergeDesignUpdate(designUpdateId){

        // An update previously not merged is now merged so add all its changes to the current design version
        const update = DesignUpdates.findOne({_id: designUpdateId});

        // UPDATES -----------------------------------------------------------------------------------------------------

        // Update all design components that are changed but not new as well
        const changedComponents = DesignUpdateComponents.find({
            designUpdateId: update._id,
            isNew:          false,
            $or:[{isChanged: true}, {isTextChanged: true}]
        });

        changedComponents.forEach((changedComponent) => {

            // Update as modified unless only details changed
            if(changedComponent.isTextChanged && !(changedComponent.isChanged)){

                this.updateItemDetailsInDesignVersion(changedComponent);
            } else {

                this.updateItemNameInDesignVersion(changedComponent);
            }

        });

        // MOVES -------------------------------------------------------------------------------------------------------

        // Update any components that have been moved to have the correct parents and list index

        const movedComponents = DesignUpdateComponents.find({designUpdateId: update._id, isMoved: true});

        movedComponents.forEach((movedComponent) => {

            this.moveUpdateItemInDesignVersion(movedComponent);

        });

        // REMOVALS ----------------------------------------------------------------------------------------------------

        // Remove any design components that are removed
        // For update previews we want to logically remove then rather than actually so the removal can be seen.

        const removedComponents = DesignUpdateComponents.find({designUpdateId: update._id, isRemoved: true});

        // This is a work progress update - logically delete - just mark as removed
        removedComponents.forEach((removedComponent) => {

            this.removeUpdateItemInDesignVersion(removedComponent);

        });

        // ADDITIONS ---------------------------------------------------------------------------------------------------

        // Add any design components that are new.  They may be changed as well but as new they just need to be inserted
        const newComponents = DesignUpdateComponents.find({designUpdateId: update._id, isNew: true});

        newComponents.forEach((newComponent) => {

            this.addUpdateItemToDesignVersion(newComponent);

        });
    }

    unmergeDesignUpdate(designUpdateId){

        // An update previously merged is now not merged so undo all its changes to the current design version
        const update = DesignUpdates.findOne({_id: designUpdateId});

        // ADDITIONS ---------------------------------------------------------------------------------------------------

        const newComponents = DesignUpdateComponents.find({designUpdateId: update._id, isNew: true});

        newComponents.forEach((newComponent) => {

            this.undoAddUpdateItemToDesignVersion(newComponent);

        });

        // REMOVALS ----------------------------------------------------------------------------------------------------

        // Restore any design components that are removed

        const removedComponents = DesignUpdateComponents.find({designUpdateId: update._id, isRemoved: true});

        // This is a work progress update - logically delete - just mark as removed
        removedComponents.forEach((removedComponent) => {

            this.restoreUpdateItemInDesignVersion(removedComponent);

        });

        // MOVES -------------------------------------------------------------------------------------------------------

        // Put moved components back to where they were.  As only new components can be moved there cannot be
        // a combination of moves of an existing item by various updates

        const movedComponents = DesignUpdateComponents.find({designUpdateId: update._id, isMoved: true});

        movedComponents.forEach((movedComponent) => {

            this.undoMoveUpdateItemInDesignVersion(movedComponent);

        });

        // UPDATES -----------------------------------------------------------------------------------------------------

        // Revert all design components that are changed but not new as well
        const changedComponents = DesignUpdateComponents.find({
            designUpdateId: update._id,
            isNew:          false,
            $or:[{isChanged: true}, {isTextChanged: true}]
        });

        changedComponents.forEach((changedComponent) => {

            if(changedComponent.isTextChanged && !(changedComponent.isChanged)){

                this.undoUpdateItemDetailsInDesignVersion(changedComponent);
            } else {

                this.undoUpdateItemNameInDesignVersion(changedComponent);
            }

        });

    }

    addUpdateItemToDesignVersion(updateItem){

        // First check that this item is not already added.  It is already impossible to add duplicated items.
        const designVersionItem = DesignVersionComponents.findOne({
            designVersionId: updateItem.designVersionId,
            componentReferenceId: updateItem.componentReferenceId
        });

        if(!designVersionItem){

            const newComponentId = DesignVersionComponents.insert(
                {
                    // Identity
                    componentReferenceId:           updateItem.componentReferenceId,
                    designId:                       updateItem.designId,
                    designVersionId:                updateItem.designVersionId,
                    componentType:                  updateItem.componentType,
                    componentLevel:                 updateItem.componentLevel,

                    componentParentIdOld:           updateItem.componentParentIdNew,
                    componentParentIdNew:           updateItem.componentParentIdNew,
                    componentParentReferenceIdOld:  updateItem.componentParentReferenceIdNew,
                    componentParentReferenceIdNew:  updateItem.componentParentReferenceIdNew,
                    componentFeatureReferenceIdOld: updateItem.componentFeatureReferenceIdNew,
                    componentFeatureReferenceIdNew: updateItem.componentFeatureReferenceIdNew,
                    componentIndexOld:              updateItem.componentIndexNew,
                    componentIndexNew:              updateItem.componentIndexNew,

                    // Data
                    componentNameOld:               updateItem.componentNameNew,
                    componentNameNew:               updateItem.componentNameNew,
                    componentNameRawOld:            updateItem.componentNameRawNew,
                    componentNameRawNew:            updateItem.componentNameRawNew,
                    componentNarrativeOld:          updateItem.componentNarrativeNew,
                    componentNarrativeNew:          updateItem.componentNarrativeNew,
                    componentNarrativeRawOld:       updateItem.componentNarrativeRawNew,
                    componentNarrativeRawNew:       updateItem.componentNarrativeRawNew,
                    componentTextRawOld:            updateItem.componentTextRawNew,
                    componentTextRawNew:            updateItem.componentTextRawNew,

                    // Update State
                    isNew:                          false,  // Not new in terms of editing
                    workPackageId:                  'NONE',
                    updateMergeStatus:              UpdateMergeStatus.COMPONENT_ADDED,  // But is new in terms of the design version
                    isDevUpdated:                   false,
                    isDevAdded:                     false,

                    isRemovable:                    updateItem.isRemovable,
                }
            );

            this.fixParentIdsForComponent(newComponentId);

            // Need to get the component again to get the latest update merge status
            const child = DesignVersionComponents.findOne({_id: newComponentId});

            // Flag parents for added item
            this.setParentsUpdateMergeStatus(child, true);
        }
    }

    undoAddUpdateItemToDesignVersion(updateItem){

        // Just remove the item from the current design version if it was added

        const designVersionItem = DesignVersionComponents.findOne({
            designVersionId:        updateItem.designVersionId,
            componentReferenceId:   updateItem.componentReferenceId,
            updateMergeStatus:      UpdateMergeStatus.COMPONENT_ADDED
        });

        if(designVersionItem){

            // First un-flag parents as necessary
            this.setParentsUpdateMergeStatus(designVersionItem, false);

            DesignVersionComponents.remove({
                _id: designVersionItem._id
            });
        }

    };

    moveUpdateItemInDesignVersion(updateItem){

        const designVersionItem = DesignVersionComponents.findOne({
            designVersionId: updateItem.designVersionId,
            componentReferenceId: updateItem.componentReferenceId
        });

        // Only mark as moved if that is the only thing new about it
        let mergeStatus = UpdateMergeStatus.COMPONENT_MOVED;

        if(updateItem.updateMergeStatus !== UpdateMergeStatus.COMPONENT_BASE){
            mergeStatus = updateItem.updateMergeStatus;
        }

        if(designVersionItem){

            // Get the new design version parent id
            const newParentItem = DesignVersionComponents.findOne({
                designVersionId: updateItem.designVersionId,
                componentReferenceId: updateItem.componentParentReferenceIdNew
            });

            // Update to new parent data all that might have changed
            DesignVersionComponents.update(
                {_id: designVersionItem._id},
                {
                    $set:{
                        componentLevel:                 updateItem.componentLevel,
                        componentParentIdNew:           newParentItem._id,
                        componentParentReferenceIdNew:  updateItem.componentParentReferenceIdNew,
                        componentFeatureReferenceIdNew: updateItem.componentFeatureReferenceIdNew,
                        componentIndexNew:              updateItem.componentIndexNew,
                        updateMergeStatus:              mergeStatus
                    }
                }
            );

            // Need to get the component again to get the latest update merge status
            const child = DesignVersionComponents.findOne({_id: designVersionItem._id});

            // Flag parents
            this.setParentsUpdateMergeStatus(child, true);
        }
    };

    undoMoveUpdateItemInDesignVersion(updateItem){

        const designVersionItem = DesignVersionComponents.findOne({
            designVersionId: updateItem.designVersionId,
            componentReferenceId: updateItem.componentReferenceId
        });

        // Only go back to base if move is the only thing new about it
        let mergeStatus = UpdateMergeStatus.COMPONENT_BASE;

        if(updateItem.updateMergeStatus !== UpdateMergeStatus.COMPONENT_MOVED){
            mergeStatus = updateItem.updateMergeStatus;
        }

        if(designVersionItem){

            // Get the old design version parent id according to the Design Update
            const oldParentItem = DesignVersionComponents.findOne({
                designVersionId: updateItem.designVersionId,
                componentReferenceId: updateItem.componentParentReferenceIdOld
            });

            // Update to new parent data all that might have changed
            DesignVersionComponents.update(
                {_id: designVersionItem._id},
                {
                    $set:{
                        componentLevel:                 updateItem.componentLevel,
                        componentParentIdNew:           oldParentItem._id,
                        componentParentReferenceIdNew:  updateItem.componentParentReferenceIdOld,
                        componentFeatureReferenceIdNew: updateItem.componentFeatureReferenceIdOld,
                        componentIndexNew:              updateItem.componentIndexOld,
                        updateMergeStatus:              mergeStatus
                    }
                }
            );

            // Clear parents if going back to base
            if(mergeStatus === UpdateMergeStatus.COMPONENT_BASE){
                // Need to get the component again to get the latest update merge status
                const child = DesignVersionComponents.findOne({_id: designVersionItem._id});

                // Flag parents
                this.setParentsUpdateMergeStatus(child, true);
            }

        }
    };

    logicallyDeleteDesignVersionItem(designVersionItem){

        DesignVersionComponents.update(
            {_id: designVersionItem._id},
            {
                $set: {
                    updateMergeStatus: UpdateMergeStatus.COMPONENT_REMOVED
                }
            }
        );

        // Need to get the component again to get the latest update merge status
        const child = DesignVersionComponents.findOne({_id: designVersionItem._id});

        // Flag parents
        this.setParentsUpdateMergeStatus(child, true);
    }

    logicallyRestoreDesignVersionItem(designVersionItem){

        // Mark the item as no longer deleted
        let updateMergeStatus = UpdateMergeStatus.COMPONENT_BASE;

        // Check for previous changes
        if(designVersionItem.componentNarrativeNew !== designVersionItem.componentNarrativeOld) {
            updateMergeStatus = UpdateMergeStatus.COMPONENT_DETAILS_MODIFIED;
        }

        //TODO - currently not feasible to check for text changes unless we start storing non-raw?

        if(designVersionItem.componentNameNew !== designVersionItem.componentNameOld) {
            updateMergeStatus = UpdateMergeStatus.COMPONENT_MODIFIED;
        }

        DesignVersionComponents.update(
            {_id: designVersionItem._id},
            {
                $set:{
                    updateMergeStatus:  updateMergeStatus
                }
            }
        );

        // Clear parents if going back to base
        if(updateMergeStatus === UpdateMergeStatus.COMPONENT_BASE){
            // Need to get the component again to get the latest update merge status
            const child = DesignVersionComponents.findOne({_id: designVersionItem._id});

            // Flag parents
            this.setParentsUpdateMergeStatus(child, true);
        }

    }

    setParentsUpdateMergeStatus(child, set){

        if(child.componentParentIdNew !== 'NONE') {
            const parent = DesignVersionComponents.findOne({
                _id: child.componentParentIdNew
            });

            if(set){
                // If setting only update if not set already as something
                if(parent.updateMergeStatus === UpdateMergeStatus.COMPONENT_BASE) {
                    DesignVersionComponents.update(
                        {_id: parent._id},
                        {
                            $set: {
                                updateMergeStatus: UpdateMergeStatus.COMPONENT_BASE_PARENT
                            }
                        }
                    );
                }

                // Carry on up
                this.setParentsUpdateMergeStatus(parent, set);

            } else {

                // Clearing.  Only clear if set as parent-base and no other children require this flag
                // Note that original item needs to be cleared before calling this...

                if(!(this.hasUpdateModifiedChildren(parent, child))){
                    // Revert to base if parent-base
                    console.log("Checking parent " + parent.componentNameNew);
                    if(parent.updateMergeStatus === UpdateMergeStatus.COMPONENT_BASE_PARENT) {
                        DesignVersionComponents.update(
                            {_id: parent._id},
                            {
                                $set: {
                                    updateMergeStatus: UpdateMergeStatus.COMPONENT_BASE
                                }
                            }
                        );
                    }

                    // Carry on up
                    this.setParentsUpdateMergeStatus(parent, set);
                }
            }
        }
    }

    hasUpdateModifiedChildren(designVersionComponent, originalChildComponent){

        // Get children that are not the original item
        const children = DesignVersionComponents.find({
            designVersionId: designVersionComponent.designVersionId,
            componentParentIdNew: designVersionComponent._id,
            _id: {$ne: originalChildComponent._id}
        }).fetch();

        let found = false;

        if(children.length > 0){
            children.forEach((child) => {
                console.log("Checking child " + child.componentNameNew);
                if(child.updateMergeStatus !== UpdateMergeStatus.COMPONENT_BASE){
                    console.log("Modified: " + child.updateMergeStatus);
                    found = true;
                }

                if(found){
                    return true;
                }
            });

            // If no children were flagged then their children can't be flagged either
        }

        console.log("Returning: " + found);
        return found;

    }

    removeUpdateItemInDesignVersion(updateItem){

        const designVersionItem = DesignVersionComponents.findOne({
            designVersionId: updateItem.designVersionId,
            componentReferenceId: updateItem.componentReferenceId
        });

        if(designVersionItem){

            if(updateItem.isNew){
                // New DU item

                // First un-flag parents as necessary
                this.setParentsUpdateMergeStatus(designVersionItem, false);

                // Complete delete - this sort of delete does not delete children as only bottom level can be deleted
                DesignVersionComponents.remove({_id: designVersionItem._id});

            } else {
                // Existing DV item

                // Mark the item as logically deleted
                this.logicallyDeleteDesignVersionItem(designVersionItem);

                // And do the same for all children
                this.removeUpdateItemChildren(designVersionItem);
            }
        }
    };

    removeUpdateItemChildren(designVersionItem){

        const children = DesignVersionComponents.find({
            designVersionId:        designVersionItem.designVersionId,
            componentParentIdNew:   designVersionItem._id
        }).fetch();

        children.forEach((child) => {

            this.logicallyDeleteDesignVersionItem(child);

            // And go on down if more children
            if(child.componentType !== ComponentType.SCENARIO){

                this.removeUpdateItemChildren(child);
            }
        });

    }

    restoreUpdateItemInDesignVersion(updateItem){

        const designVersionItem = DesignVersionComponents.findOne({
            designVersionId:        updateItem.designVersionId,
            componentReferenceId:   updateItem.componentReferenceId,
            updateMergeStatus:      UpdateMergeStatus.COMPONENT_REMOVED
        });

        if(designVersionItem){

            this.logicallyRestoreDesignVersionItem(designVersionItem);

            this.restoreUpdateItemChildren(designVersionItem);
        }
    }

    restoreUpdateItemChildren(designVersionItem){

        const children = DesignVersionComponents.find({
            designVersionId:        designVersionItem.designVersionId,
            componentParentIdNew:   designVersionItem._id
        }).fetch();

        children.forEach((child) => {

            this.logicallyRestoreDesignVersionItem(child);

            // And go on down if more children
            if(child.componentType !== ComponentType.SCENARIO){

                this.restoreUpdateItemChildren(child);
            }
        });
    }

    updateItemNameInDesignVersion(updateItem){

        const designVersionItem = DesignVersionComponents.findOne({
            designVersionId: updateItem.designVersionId,
            componentReferenceId: updateItem.componentReferenceId
        });

        if(designVersionItem){

            // Only a modification if EXISTING item is modified.  Added items are always added even if modified later
            let updateMergeStatus = UpdateMergeStatus.COMPONENT_MODIFIED;

            if(designVersionItem.updateMergeStatus === UpdateMergeStatus.COMPONENT_ADDED){
                updateMergeStatus = UpdateMergeStatus.COMPONENT_ADDED;
            }

            //console.log('Updating component name to ' + updateItem.componentNameNew + ' in DV');

            // Update the name to the latest value
            DesignVersionComponents.update(
                {_id: designVersionItem._id},
                {
                    $set:{
                        componentNameNew:               updateItem.componentNameNew,
                        componentNameRawNew:            updateItem.componentNameRawNew,
                        updateMergeStatus:              updateMergeStatus
                    }
                }
            );

            // Need to get the component again to get the latest update merge status
            const child = DesignVersionComponents.findOne({_id: designVersionItem._id});

            // Flag parents
            this.setParentsUpdateMergeStatus(child, true);
        }
    }

    undoUpdateItemNameInDesignVersion(updateItem){

        // Also check that the DV component has the same name as in this DU.  If not it is modified elsewhere
        // and we'll leave it as it is
        const designVersionItem = DesignVersionComponents.findOne({
            designVersionId:        updateItem.designVersionId,
            componentReferenceId:   updateItem.componentReferenceId,
            updateMergeStatus:      UpdateMergeStatus.COMPONENT_MODIFIED,
            componentNameNew:       updateItem.componentNameNew
        });

        if(designVersionItem){

            // Only go back to base status if the details not also changed
            let updateMergeStatus = UpdateMergeStatus.COMPONENT_BASE;

            if(updateItem.isTextChanged){
                updateMergeStatus = UpdateMergeStatus.COMPONENT_DETAILS_MODIFIED;
            }

            // Update the name to the previous value
            DesignVersionComponents.update(
                {_id: designVersionItem._id},
                {
                    $set:{
                        componentNameNew:               updateItem.componentNameOld,
                        componentNameRawNew:            updateItem.componentNameRawOld,
                        updateMergeStatus:              updateMergeStatus
                    }
                }
            );

            // Clear parents if going back to base
            if(updateMergeStatus === UpdateMergeStatus.COMPONENT_BASE){
                // Need to get the component again to get the latest update merge status
                const child = DesignVersionComponents.findOne({_id: designVersionItem._id});

                // Flag parents
                this.setParentsUpdateMergeStatus(child, true);
            }

        }
    }

    updateItemDetailsInDesignVersion(updateItem){

        const designVersionItem = DesignVersionComponents.findOne({
            designVersionId: updateItem.designVersionId,
            componentReferenceId: updateItem.componentReferenceId
        });

        if(designVersionItem){

            // Only a modification if EXISTING item is modified.  Added items are always added even if modified later
            let updateMergeStatus = UpdateMergeStatus.COMPONENT_DETAILS_MODIFIED;

            if(designVersionItem.updateMergeStatus === UpdateMergeStatus.COMPONENT_ADDED){
                updateMergeStatus = UpdateMergeStatus.COMPONENT_ADDED;
            } else {
                // And if the name was modified this trumps details
                if(designVersionItem.updateMergeStatus === UpdateMergeStatus.COMPONENT_MODIFIED){
                    updateMergeStatus = UpdateMergeStatus.COMPONENT_MODIFIED;
                }
            }

            // Update the name to the latest value
            DesignVersionComponents.update(
                {_id: designVersionItem._id},
                {
                    $set:{
                        componentNarrativeNew:          updateItem.componentNarrativeNew,
                        componentNarrativeRawNew:       updateItem.componentNarrativeRawNew,
                        componentTextRawNew:            updateItem.componentTextRawNew,
                        updateMergeStatus:              updateMergeStatus
                    }
                }
            );

            // Need to get the component again to get the latest update merge status
            const child = DesignVersionComponents.findOne({_id: designVersionItem._id});

            // Flag parents
            this.setParentsUpdateMergeStatus(child, true);
        }
    }

    undoUpdateItemDetailsInDesignVersion(updateItem){

        // Also check that the DV component has the same details as in this DU.  If not it is modified elsewhere
        // and we'll leave it as it is
        // TODO: changes in details text
        const designVersionItem = DesignVersionComponents.findOne({
            designVersionId:        updateItem.designVersionId,
            componentReferenceId:   updateItem.componentReferenceId,
            componentNarrativeNew:  updateItem.componentNarrativeNew,
        });

        if(designVersionItem){

            // Only go back to base status
            let updateMergeStatus = UpdateMergeStatus.COMPONENT_BASE;

            // Update the name to the latest value
            DesignVersionComponents.update(
                {_id: designVersionItem._id},
                {
                    $set:{
                        componentNarrativeNew:          updateItem.componentNarrativeOld,
                        componentNarrativeRawNew:       updateItem.componentNarrativeRawOld,
                        componentTextRawNew:            updateItem.componentTextRawOld,
                        updateMergeStatus:              updateMergeStatus
                    }
                }
            );

            // Clear parents if going back to base
            if(updateMergeStatus === UpdateMergeStatus.COMPONENT_BASE){
                // Need to get the component again to get the latest update merge status
                const child = DesignVersionComponents.findOne({_id: designVersionItem._id});

                // Flag parents
                this.setParentsUpdateMergeStatus(child, true);
            }

        }
    }

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
                    isMoved: false,
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
                                componentLevel:                 currentDesignVersionComponent.componentLevel,
                                componentParentIdOld:           currentDesignVersionComponent.componentParentIdNew,
                                componentParentIdNew:           currentDesignVersionComponent.componentParentIdNew,
                                componentParentReferenceIdOld:  currentDesignVersionComponent.componentParentReferenceIdNew,
                                componentParentReferenceIdNew:  currentDesignVersionComponent.componentParentReferenceIdNew,
                                componentFeatureReferenceIdOld: currentDesignVersionComponent.componentFeatureReferenceIdNew,
                                componentFeatureReferenceIdNew: currentDesignVersionComponent.componentFeatureReferenceIdNew,
                                componentIndexOld:              currentDesignVersionComponent.componentIndexNew,
                                componentIndexNew:              currentDesignVersionComponent.componentIndexNew,
                                componentNameOld:               currentDesignVersionComponent.componentNameNew,
                                componentNameNew:               currentDesignVersionComponent.componentNameNew,
                                componentNameRawOld:            currentDesignVersionComponent.componentNameRawNew,
                                componentNameRawNew:            currentDesignVersionComponent.componentNameRawNew,
                                componentNarrativeOld:          currentDesignVersionComponent.componentNarrativeNew,
                                componentNarrativeNew:          currentDesignVersionComponent.componentNarrativeNew,
                                componentNarrativeRawOld:       currentDesignVersionComponent.componentNarrativeRawNew,
                                componentNarrativeRawNew:       currentDesignVersionComponent.componentNarrativeRawNew,
                                componentTextRawOld:            currentDesignVersionComponent.componentTextRawNew,
                                componentTextRawNew:            currentDesignVersionComponent.componentTextRawNew
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

    completePreviousDesignVersion(previousDesignVersionId){

        // Complete status depends on current status
        const currentDv = DesignVersions.findOne({_id: previousDesignVersionId});

        let newDvStatus = DesignVersionStatus.VERSION_DRAFT_COMPLETE;

        if(currentDv.designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE){

            // Complete the merged updates
            DesignUpdates.update(
                {
                    designVersionId: previousDesignVersionId,
                    updateMergeAction: DesignUpdateMergeAction.MERGE_INCLUDE
                },
                {
                    $set:{
                        updateStatus: DesignUpdateStatus.UPDATE_MERGED
                    }
                },
                {multi: true}
            );

            newDvStatus = DesignVersionStatus.VERSION_UPDATABLE_COMPLETE;
        }

        DesignVersions.update(
            {_id: previousDesignVersionId},
            {
                $set:{
                    designVersionStatus: newDvStatus
                }
            }
        );
    }


}

export default new DesignVersionModules()

