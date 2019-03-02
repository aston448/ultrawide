
// Ultrawide Services
import { DesignVersionStatus, UpdateMergeStatus, ComponentType, LogLevel } from '../../constants/constants.js';
import { log, getIdFromMap } from '../../common/utils.js';

// Data Access
import { DesignVersionData }            from '../../data/design/design_version_db.js';
import { DesignComponentData }          from '../../data/design/design_component_db.js';
import { DesignUpdateData }             from '../../data/design_update/design_update_db.js';
import { DesignUpdateComponentData }    from '../../data/design_update/design_update_component_db.js';
import { DomainDictionaryData }        from '../../data/design/domain_dictionary_db.js';
import {ScenarioTestExpectationData} from "../../data/design/scenario_test_expectations_db";
import {DesignPermutationValueData} from "../../data/design/design_permutation_value_db";
import {DesignComponentServices} from "../../servicers/design/design_component_services";
import {DesignComponentModules} from "./design_component_service_modules";


//======================================================================================================================
//
// Server Modules for Design Version Items.
//
// Methods called from within main API methods
//
//======================================================================================================================

class DesignVersionModulesClass {

    copyPreviousDesignVersionToCurrent(previousDesignVersionId, currentDesignVersionId){

        // Abort if current version has not been cleared
        const currentComponentsCount = DesignVersionData.getComponentCount(currentDesignVersionId);

        if(currentComponentsCount > 0){
            throw new Meteor.Error('COPY DV', 'Current version has not been cleared');
        }

        // Get all the old version components
        const oldDesignComponents = DesignVersionData.getAllComponents(previousDesignVersionId);

        let newDesignVersionBatch = [];

        // Recreate the current version as an exact copy with the NEW values being used
        oldDesignComponents.forEach((previousComponent) => {

            // Insert all except removed items
            if(previousComponent.updateMergeStatus !== UpdateMergeStatus.COMPONENT_REMOVED) {

                newDesignVersionBatch.push(
                    {
                        // Identity
                        componentReferenceId:           previousComponent.componentReferenceId,
                        designId:                       previousComponent.designId,
                        designVersionId:                currentDesignVersionId,
                        componentType:                  previousComponent.componentType,
                        componentLevel:                 previousComponent.componentLevel,

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

        // Batch insert for speed
        if(newDesignVersionBatch.length > 0) {
            DesignComponentData.bulkInsert(newDesignVersionBatch);
        }

        log(msg => console.log(msg), LogLevel.DEBUG, "  Populated new DV with copy of previous");

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
    // fixParentIdsForDesignVersion(newDesignVersionId){
    //
    //     // The correct parent id for the new version will be the id of the component that has the reference id relating to the parent reference id
    //     const newDesignVersionComponents = DesignVersionComponents.find({designVersionId: newDesignVersionId});
    //
    //     newDesignVersionComponents.forEach((component) => {
    //
    //         this.fixParentIds(component);
    //     });
    // };


    // fixParentIdsForComponent(componentId){
    //
    //     // The correct parent id for the new version will be the id of the component that has the reference id relating to the parent reference id
    //     const component = DesignVersionComponents.findOne({_id: componentId});
    //
    //     this.fixParentIds(component);
    //
    // };

    // fixParentIds(component){
    //
    //     // Get the id of the new component that has the parent reference id as its unchanging reference id
    //     let parentNew = DesignVersionComponents.findOne({designVersionId: component.designVersionId, componentReferenceId: component.componentParentReferenceIdNew});
    //     let parentOld = DesignVersionComponents.findOne({designVersionId: component.designVersionId, componentReferenceId: component.componentParentReferenceIdOld});
    //
    //     let parentIdNew = 'NONE';
    //     let parentIdOld = 'NONE';
    //
    //     if(parentNew){
    //         parentIdNew = parentNew._id;
    //     }
    //
    //     if(parentOld){
    //         parentIdOld = parentOld._id;
    //     }
    //
    //     // Update
    //     DesignVersionComponents.update(
    //         { _id: component._id},
    //         {
    //             $set:{
    //                 componentParentIdOld: parentIdOld,
    //                 componentParentIdNew: parentIdNew
    //             }
    //         }
    //     );
    // }

    mergeDesignUpdate(designUpdateId){

        // An update previously not merged is now merged so add all its changes to the current design version
        const update = DesignUpdateData.getDesignUpdateById(designUpdateId);


        // QUERIES -----------------------------------------------------------------------------------------------------

        // Update any Scenarios that are in scope but not changed to queried status
        const queriedScenarios = DesignUpdateData.getUnchangedInScopeScenarios(designUpdateId);

        queriedScenarios.forEach((scenario) => {

            let baseScenario = DesignComponentData.getDesignComponentByRef(update.designVersionId, scenario.componentReferenceId);

            // Only set stuff that is BASE
            if(baseScenario.updateMergeStatus === UpdateMergeStatus.COMPONENT_BASE) {
                this.setDesignVersionScenarioAsQueried(baseScenario)
            }

        });

        // UPDATES -----------------------------------------------------------------------------------------------------

        // Update all design components that are changed but not new as well
        const changedComponents = DesignUpdateData.getChangedComponents(designUpdateId);

        changedComponents.forEach((changedComponent) => {

            // Update as modified unless only details changed
            if((changedComponent.isTextChanged || changedComponent.isNarrativeChanged) && !(changedComponent.isChanged)){

                this.updateItemDetailsInDesignVersion(changedComponent);
            } else {

                this.updateItemNameInDesignVersion(changedComponent);
            }
        });

        // MOVES -------------------------------------------------------------------------------------------------------

        // Update any components that have been moved to have the correct parents and list index

        const movedComponents = DesignUpdateData.getMovedComponents(designUpdateId);

        movedComponents.forEach((movedComponent) => {

            this.moveUpdateItemInDesignVersion(movedComponent);
        });

        // Recalc the hierarchy if any moved components
        if(movedComponents.length > 0){
            DesignComponentModules.populateHierarchyIndexData(update.designVersionId);
        }

        // REMOVALS ----------------------------------------------------------------------------------------------------

        // Remove any design components that are removed
        // For update previews we want to logically remove then rather than actually so the removal can be seen.

        const removedComponents = DesignUpdateData.getRemovedComponents(designUpdateId);

        // This is a work progress update - logically delete - just mark as removed
        removedComponents.forEach((removedComponent) => {

            this.removeUpdateItemInDesignVersion(removedComponent);
        });

        // ADDITIONS ---------------------------------------------------------------------------------------------------

        // Add any design components that are new.  They may be changed as well but as new they just need to be inserted
        const newComponents = DesignUpdateData.getNewComponents(designUpdateId);

        newComponents.forEach((newComponent) => {

            this.addUpdateItemToDesignVersion(newComponent);

            // And add any default Feature Aspects added to a new Feature
            if(newComponent.componentType === ComponentType.FEATURE){

                let defaultAspects = DesignUpdateComponentData.getExistingAspectsForFeature(designUpdateId, newComponent.componentReferenceId);

                defaultAspects.forEach((aspect) => {

                    this.addUpdateItemToDesignVersion(aspect);
                });
            }
        });
    }

    unmergeDesignUpdate(designUpdateId){

        // An update previously merged is now not merged so undo all its changes to the current design version
        const update = DesignUpdateData.getDesignUpdateById(designUpdateId);

        // ADDITIONS ---------------------------------------------------------------------------------------------------

        const newComponents = DesignUpdateData.getNewComponents(designUpdateId);

        newComponents.forEach((newComponent) => {

            this.undoAddUpdateItemToDesignVersion(newComponent);

            // And remove any default Feature Aspects added to a new Feature
            if(newComponent.componentType === ComponentType.FEATURE){

                let defaultAspects = DesignUpdateComponentData.getExistingAspectsForFeature(designUpdateId, newComponent.componentReferenceId);

                defaultAspects.forEach((aspect) => {

                    this.undoAddUpdateItemToDesignVersion(aspect);
                });
            }
        });

        // REMOVALS ----------------------------------------------------------------------------------------------------

        // Restore any design components that are removed

        const removedComponents = DesignUpdateData.getRemovedComponents(designUpdateId);

        // This is a work progress update - logically delete - just mark as removed
        removedComponents.forEach((removedComponent) => {

            this.restoreUpdateItemInDesignVersion(removedComponent);
        });

        // MOVES -------------------------------------------------------------------------------------------------------

        // Put moved components back to where they were.  As only new components can be moved there cannot be
        // a combination of moves of an existing item by various updates

        const movedComponents = DesignUpdateData.getMovedComponents(designUpdateId);

        movedComponents.forEach((movedComponent) => {

            this.undoMoveUpdateItemInDesignVersion(movedComponent);
        });

        // UPDATES -----------------------------------------------------------------------------------------------------

        // Revert all design components that are changed but not new as well
        const changedComponents = DesignUpdateData.getChangedComponents(designUpdateId);

        changedComponents.forEach((changedComponent) => {

            if((changedComponent.isTextChanged || changedComponent.isNarrativeChanged) && !(changedComponent.isChanged)){

                this.undoUpdateItemDetailsInDesignVersion(changedComponent);
            } else {

                this.undoUpdateItemNameInDesignVersion(changedComponent);
            }
        });

        // QUERIES -----------------------------------------------------------------------------------------------------

        // Update any Scenarios that are in scope but not changed from queried back to base
        const queriedScenarios = DesignUpdateData.getUnchangedInScopeScenarios(designUpdateId);

        queriedScenarios.forEach((scenario) => {

            let baseScenario = DesignComponentData.getDesignComponentByRef(update.designVersionId, scenario.componentReferenceId);

            // Only set stuff that is QUERIED
            if(baseScenario.updateMergeStatus === UpdateMergeStatus.COMPONENT_SCENARIO_QUERIED) {
                this.setDesignVersionScenarioAsBase(baseScenario)
            }
        });

    }

    setDesignVersionScenarioAsQueried(scenario){

        DesignComponentData.setUpdateMergeStatus(scenario._id, UpdateMergeStatus.COMPONENT_SCENARIO_QUERIED);
    }

    setDesignVersionScenarioAsBase(scenario){

        DesignComponentData.setUpdateMergeStatus(scenario._id, UpdateMergeStatus.COMPONENT_BASE);
    }

    addUpdateItemToDesignVersion(updateItem){

        // First check that this item is not already added.  It is already impossible to add duplicated items.
        const designVersionItem = DesignComponentData.getDesignComponentByRef(updateItem.designVersionId, updateItem.componentReferenceId);

        if(!designVersionItem){

            const newComponentId = DesignComponentData.addUpdateComponentToDesignVersion(updateItem);

            // Need to get the component again to get the latest update merge status
            const child = DesignComponentData.getDesignComponentById(newComponentId);

            // Flag parents for added item
            this.setParentsUpdateMergeStatus(child, true);

            // And set the hierarchy
            DesignComponentModules.updateComponentHierarchyIndex(child);
        }
    }

    undoAddUpdateItemToDesignVersion(updateItem){

        // Just remove the item from the current design version if it was added

        const designVersionItem = DesignComponentData.getDesignComponentByRef(updateItem.designVersionId, updateItem.componentReferenceId);

        if(designVersionItem && designVersionItem.updateMergeStatus === UpdateMergeStatus.COMPONENT_ADDED){

            // First un-flag parents as necessary
            this.setParentsUpdateMergeStatus(designVersionItem, false);

            DesignComponentData.removeComponent(designVersionItem._id);
        }
    };

    moveUpdateItemInDesignVersion(updateItem){

        const designVersionItem = DesignComponentData.getDesignComponentByRef(updateItem.designVersionId, updateItem.componentReferenceId);

        // Only mark as moved if that is the only thing new about it
        let mergeStatus = UpdateMergeStatus.COMPONENT_MOVED;

        if(updateItem.updateMergeStatus !== UpdateMergeStatus.COMPONENT_BASE){
            mergeStatus = updateItem.updateMergeStatus;
        }

        if(designVersionItem){

            // Logically move the Design Version component
            DesignComponentData.moveInDesignVersionFromUpdate(designVersionItem._id, updateItem, mergeStatus);

            // Need to get the component again to get the latest data
            const child = DesignComponentData.getDesignComponentById(designVersionItem._id);

            // Flag parents
            this.setParentsUpdateMergeStatus(child, true);
        }
    };

    undoMoveUpdateItemInDesignVersion(updateItem){

        const designVersionItem = DesignComponentData.getDesignComponentByRef(updateItem.designVersionId, updateItem.componentReferenceId);

        // Only go back to base if move is the only thing new about it
        let mergeStatus = UpdateMergeStatus.COMPONENT_BASE;

        if(updateItem.updateMergeStatus !== UpdateMergeStatus.COMPONENT_MOVED){
            mergeStatus = updateItem.updateMergeStatus;
        }

        if(designVersionItem){


            // Logically undo move of Design Version component
            DesignComponentData.undoMoveInDesignVersionFromUpdate(designVersionItem._id, updateItem, mergeStatus);


            // Clear parents if going back to base
            if(mergeStatus === UpdateMergeStatus.COMPONENT_BASE){

                // Need to get the component again to get the latest update merge status
                const child = DesignComponentData.getDesignComponentById(designVersionItem._id);

                // Flag parents
                this.setParentsUpdateMergeStatus(child, true);
            }

        }
    };

    logicallyDeleteDesignVersionItem(designVersionItem){

        const dvComponent = DesignComponentData.getDesignComponentById(designVersionItem._id);

        // Set as removed and revert any name modifications
        DesignComponentData.logicallyDeleteInDesignVersion(dvComponent);

        // Need to get the component again to get the latest update merge status
        const child = DesignComponentData.getDesignComponentById(designVersionItem._id);

        // Flag parents
        this.setParentsUpdateMergeStatus(child, true);
    }

    logicallyRestoreDesignVersionItem(designVersionItem){

        // Mark the item as no longer deleted.
        let updateMergeStatus = UpdateMergeStatus.COMPONENT_BASE;

        // Check for previous changes
        if(designVersionItem.componentNarrativeNew !== designVersionItem.componentNarrativeOld) {
            updateMergeStatus = UpdateMergeStatus.COMPONENT_DETAILS_MODIFIED;
        }

        //TODO - currently not feasible to check for text changes unless we start storing non-raw?

        if(designVersionItem.componentNameNew !== designVersionItem.componentNameOld) {
            updateMergeStatus = UpdateMergeStatus.COMPONENT_MODIFIED;
        }

        DesignComponentData.setUpdateMergeStatus(designVersionItem._id, updateMergeStatus);

        // Clear parents if going back to base
        if(updateMergeStatus === UpdateMergeStatus.COMPONENT_BASE){
            // Need to get the component again to get the latest update merge status
            const child = DesignComponentData.getDesignComponentById(designVersionItem._id);

            // Clear parents
            this.setParentsUpdateMergeStatus(child, false);
        }

    }

    setParentsUpdateMergeStatus(child, set){

        if(child.componentParentReferenceIdNew !== 'NONE') {

            const parent = DesignComponentData.getDesignComponentByRef(child.designVersionId, child.componentParentReferenceIdNew);

            if(parent) {

                if (set) {
                    // If setting only update if not set already as something
                    if (parent.updateMergeStatus === UpdateMergeStatus.COMPONENT_BASE) {

                        DesignComponentData.setUpdateMergeStatus(parent._id, UpdateMergeStatus.COMPONENT_BASE_PARENT);
                    }

                    // Carry on up
                    this.setParentsUpdateMergeStatus(parent, set);

                } else {

                    // Clearing.  Only clear if set as parent-base and no other children require this flag
                    // Note that original item needs to be cleared before calling this...

                    if (!(this.hasUpdateModifiedChildren(parent, child))) {
                        // Revert to base if parent-base
                        if (parent.updateMergeStatus === UpdateMergeStatus.COMPONENT_BASE_PARENT) {

                            DesignComponentData.setUpdateMergeStatus(parent._id, UpdateMergeStatus.COMPONENT_BASE);
                        }

                        // Carry on up
                        this.setParentsUpdateMergeStatus(parent, set);
                    }
                }
            }
        }
    }

    hasUpdateModifiedChildren(designVersionComponent, originalChildComponent){

        // Get children
        const children = DesignComponentData.getChildComponentsByIndex(
            designVersionComponent.designVersionId,
            designVersionComponent.componentReferenceId
        );

        let found = false;

        if(children.length > 0){
            children.forEach((child) => {

                // Get modified children that are not the original item
                if((child.id !== originalChildComponent._id) && (child.updateMergeStatus !== UpdateMergeStatus.COMPONENT_BASE)){

                    found = true;
                }

                if(found){
                    return true;
                }
            });

            // If no children were flagged then their children can't be flagged either
        }

        return found;

    }

    removeUpdateItemInDesignVersion(updateItem){

        const designVersionItem = DesignComponentData.getDesignComponentByRef(updateItem.designVersionId, updateItem.componentReferenceId);

        if(designVersionItem){

            if(updateItem.isNew){
                // New DU item

                // First un-flag parents as necessary
                this.setParentsUpdateMergeStatus(designVersionItem, false);

                // Complete delete - this sort of delete does not delete children as only bottom level can be deleted
                DesignComponentData.removeComponent(designVersionItem._id);

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

        const children = DesignComponentData.getChildComponentsByIndex(designVersionItem.designVersionId, designVersionItem.componentReferenceId);

        children.forEach((child) => {

            this.logicallyDeleteDesignVersionItem(child);

            // And go on down if more children
            if(child.componentType !== ComponentType.SCENARIO){

                this.removeUpdateItemChildren(child);
            }
        });

    }

    restoreUpdateItemInDesignVersion(updateItem){

        const designVersionItem = DesignComponentData.getDesignComponentByRef(updateItem.designVersionId, updateItem.componentReferenceId);

        if(designVersionItem && designVersionItem.updateMergeStatus === UpdateMergeStatus.COMPONENT_REMOVED){

            this.logicallyRestoreDesignVersionItem(designVersionItem);

            this.restoreUpdateItemChildren(designVersionItem);
        }
    }

    restoreUpdateItemChildren(designVersionItem){

        const children = DesignComponentData.getChildComponentsByIndex(designVersionItem.designVersionId, designVersionItem.componentReferenceId);

        children.forEach((child) => {

            this.logicallyRestoreDesignVersionItem(child);

            // And go on down if more children
            if(child.componentType !== ComponentType.SCENARIO){

                this.restoreUpdateItemChildren(child);
            }
        });
    }

    updateItemNameInDesignVersion(updateItem){

        const designVersionItem = DesignComponentData.getDesignComponentByRef(updateItem.designVersionId, updateItem.componentReferenceId);

        if(designVersionItem){

            // Only a modification if EXISTING item is modified.  Added items are always added even if modified later
            let updateMergeStatus = UpdateMergeStatus.COMPONENT_MODIFIED;

            if(designVersionItem.updateMergeStatus === UpdateMergeStatus.COMPONENT_ADDED){
                updateMergeStatus = UpdateMergeStatus.COMPONENT_ADDED;
            }

            //console.log('Updating component name to ' + updateItem.componentNameNew + ' in DV');

            // Update the name to the latest value.  If a new item, don't keep 'old' name.
            if(updateMergeStatus === UpdateMergeStatus.COMPONENT_ADDED){
                DesignComponentData.updateNewItemNameFromDesignUpdate(designVersionItem._id, updateItem, updateMergeStatus);
            } else {
                DesignComponentData.updateNameFromDesignUpdate(designVersionItem._id, updateItem, updateMergeStatus);
            }

            // Need to get the component again to get the latest update merge status
            const child = DesignComponentData.getDesignComponentById(designVersionItem._id);

            // Flag parents
            this.setParentsUpdateMergeStatus(child, true);
        }
    }

    undoUpdateItemNameInDesignVersion(updateItem){

        // Also check that the DV component has the same name as in this DU.  If not it is modified elsewhere
        // and we'll leave it as it is
        const designVersionItem = DesignComponentData.getDesignComponentByRef(updateItem.designVersionId, updateItem.componentReferenceId);

        if(designVersionItem && designVersionItem.updateMergeStatus === UpdateMergeStatus.COMPONENT_MODIFIED && designVersionItem.componentNameNew === updateItem.componentNameNew){

            // Only go back to base status if the details not also changed
            let updateMergeStatus = UpdateMergeStatus.COMPONENT_BASE;

            if(updateItem.isTextChanged){
                updateMergeStatus = UpdateMergeStatus.COMPONENT_DETAILS_MODIFIED;
            }

            // Update the name to the previous value
            DesignComponentData.undoUpdateNameFromDesignUpdate(designVersionItem._id, updateItem, updateMergeStatus);

            // Clear parents if going back to base
            if(updateMergeStatus === UpdateMergeStatus.COMPONENT_BASE){
                // Need to get the component again to get the latest update merge status
                const child = DesignComponentData.getDesignComponentById(designVersionItem._id);

                // Flag parents
                this.setParentsUpdateMergeStatus(child, true);
            }
        }
    }

    updateItemDetailsInDesignVersion(updateItem){

        const designVersionItem = DesignComponentData.getDesignComponentByRef(updateItem.designVersionId, updateItem.componentReferenceId);

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

            // Update the details to the latest value
            DesignComponentData.updateDetailsFromDesignUpdate(designVersionItem._id, updateItem, updateMergeStatus);

            // Need to get the component again to get the latest update merge status
            const child = DesignComponentData.getDesignComponentById(designVersionItem._id);

            // Flag parents
            this.setParentsUpdateMergeStatus(child, true);
        }
    }

    undoUpdateItemDetailsInDesignVersion(updateItem){

        // Also check that the DV component has the same details as in this DU.  If not it is modified elsewhere
        // and we'll leave it as it is
        // TODO: changes in details text
        const designVersionItem = DesignComponentData.getDesignComponentByRef(updateItem.designVersionId, updateItem.componentReferenceId);

        if(designVersionItem && designVersionItem.componentNarrativeNew === updateItem.componentNarrativeNew){

            // Only go back to base status
            let updateMergeStatus = UpdateMergeStatus.COMPONENT_BASE;

            // Update the details to the previous value
            DesignComponentData.undoUpdateDetailsFromDesignUpdate(designVersionItem._id, updateItem, updateMergeStatus);

            // Clear parents if going back to base
            if(updateMergeStatus === UpdateMergeStatus.COMPONENT_BASE){
                // Need to get the component again to get the latest update merge status
                const child = DesignComponentData.getDesignComponentById(designVersionItem._id);

                // Flag parents
                this.setParentsUpdateMergeStatus(child, true);
            }

        }
    }

    rollForwardUpdates(currentDesignVersionId, newDesignVersionId){

        //console.log("MERGE: Rolling forward updates...");

        const updatesToRollForward = DesignVersionData.getRollForwardUpdates(currentDesignVersionId);

        let updateComponentsToUpdate = null;
        let currentDesignVersionComponent = null;

        // These updates need to have their design version updated so they move to the new design version
        // Also, anything that is not new or changed in the update needs to be reset to match the latest design version
        updatesToRollForward.forEach((update) => {

            // Update details of any non-changed and non-new or removed update components
            updateComponentsToUpdate = DesignVersionData.getUnchangedUpdateComponents(update._id);

            updateComponentsToUpdate.forEach((updateComponent) => {

                // Update the details to that of the same component in the new DV
                currentDesignVersionComponent = DesignComponentData.getDesignComponentByRef(newDesignVersionId, updateComponent.componentReferenceId);

                if(currentDesignVersionComponent) {

                    DesignUpdateComponentData.updateWithLatestDvComponentDetails(updateComponent._id, currentDesignVersionComponent);

                } else {
                    //console.log("Component with ref " + updateComponent.componentReferenceId + " not found in DV " + newDesignVersionId);
                }
            });

            // Move all components to new design version
            DesignUpdateComponentData.bulkUpdateDesignVersion(update._id, newDesignVersionId)

        });

        // Move all roll forward updates to the new design version.  Status remains same.  Action goes back to default
        const rolled = DesignUpdateData.bulkMoveRollForwardUpdatesToNewDesignVersion(currentDesignVersionId, newDesignVersionId);

        log(msg => console.log(msg), LogLevel.DEBUG, "  {} updates were rolled forward", rolled);

    }

    closeDownIgnoreUpdates(currentDesignVersionId){

        // Just mark them all as IGNORED
        const ignored = DesignUpdateData.bulkSetDesignUpdatesAsIgnore(currentDesignVersionId);

        log(msg => console.log(msg), LogLevel.DEBUG, "  {} updates were ignored", ignored);

    }

    rollForwardDomainDictionary(currentDesignVersionId, newDesignVersionId){

        // We want to copy ALL dictionary entries to the new DV.

        const oldEntries = DesignVersionData.getDomainDictionaryEntries(currentDesignVersionId);

        let newDomainDictionaryBatch = [];

        oldEntries.forEach((entry) => {

            newDomainDictionaryBatch.push(
                {
                    designId:               entry.designId,
                    designVersionId:        newDesignVersionId,
                    domainTermOld:          entry.domainTermOld,
                    domainTermNew:          entry.domainTermNew,
                    domainTextRaw:          entry.domainTextRaw,
                    sortingName:            entry.sortingName,
                    markInDesign:           entry.markInDesign,
                    isNew:                  entry.isNew,
                    isChanged:              entry.isChanged,
                }
            );
        });

        if(newDomainDictionaryBatch.length > 0) {
            DomainDictionaryData.bulkInsertEntries(newDomainDictionaryBatch);
        }
    }

    rollForwardTestExpectationValues(currentDesignVersionId, newDesignVersionId){

        const oldValues = DesignPermutationValueData.getAllValuesForDesignVersion(currentDesignVersionId);
        const permutationValuesMapping = [];

        oldValues.forEach((oldValue) => {

            // Import the existing value to the new DV but with the old permutation id
            const newId = DesignPermutationValueData.importDesignPermutationValue(oldValue, newDesignVersionId, oldValue.permutationId);

            if (newId) {
                // Store the new Design Update ID
                permutationValuesMapping.push({oldId: oldValue._id, newId: newId});
            }
        });

        return permutationValuesMapping;
    }

    rollForwardTestExpectations(currentDesignVersionId, newDesignVersionId, permutationValuesMapping){

        // We want to copy ALL test expectations to the new DV.

        const oldExpectations = ScenarioTestExpectationData.getAllTestExpectationsForDesignVersion(currentDesignVersionId);

        let newExpectationsBatch = [];

        oldExpectations.forEach((expectation) => {

            newExpectationsBatch.push(
                {
                    designVersionId:                newDesignVersionId,
                    scenarioReferenceId:            expectation.scenarioReferenceId,
                    testType:                       expectation.testType,
                    permutationId:                  expectation.permutationId,
                    permutationValueId:             getIdFromMap(permutationValuesMapping, expectation.permutationValueId),
                    expectationStatus:              expectation.expectationStatus
                }
            );
        });

        if(newExpectationsBatch.length > 0) {
            ScenarioTestExpectationData.bulkInsert(newExpectationsBatch);
        }
    }

    completePreviousDesignVersion(previousDesignVersionId){

        // Complete status depends on current status
        const currentDv = DesignVersionData.getDesignVersionById(previousDesignVersionId);

        let newDvStatus = DesignVersionStatus.VERSION_DRAFT_COMPLETE;

        if(currentDv.designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE){

            // Complete the merged updates
            const completed = DesignUpdateData.bulkCompleteMergedUpdates(previousDesignVersionId);

            log(msg => console.log(msg), LogLevel.DEBUG, "  {} updates were completed in previous design version", completed);

            newDvStatus = DesignVersionStatus.VERSION_UPDATABLE_COMPLETE;
        }

        DesignVersionData.setDesignVersionStatus(previousDesignVersionId, newDvStatus);
    }
}

export const DesignVersionModules = new DesignVersionModulesClass()

