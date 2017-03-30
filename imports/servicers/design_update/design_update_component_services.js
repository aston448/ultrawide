
// Ultrawide Collections
import { DesignVersions }           from '../../collections/design/design_versions.js';
import { DesignUpdates }            from '../../collections/design_update/design_updates.js';
import { DesignVersionComponents }         from '../../collections/design/design_version_components.js';
import { DesignUpdateComponents }   from '../../collections/design_update/design_update_components.js';

// Ultrawide services
import { ComponentType, ViewType, UpdateScopeType, LogLevel }  from '../../constants/constants.js';
import { DefaultComponentNames }    from '../../constants/default_names.js';
import { getIdFromMap, log }        from '../../common/utils.js';

import DesignServices               from '../design/design_services.js';
import DesignUpdateModules          from '../../service_modules/design_update/design_update_service_modules.js';
import DesignComponentModules       from '../../service_modules/design/design_component_service_modules.js';
import DesignUpdateComponentModules from '../../service_modules/design_update/design_update_component_service_modules.js';

//======================================================================================================================
//
// Server Code for Design Update Components.
//
// Methods called directly by Server API
//
//======================================================================================================================

class DesignUpdateComponentServices{

    // Add a new design update component to design update
    addNewComponent(designVersionId, designUpdateId, parentId, componentType, componentLevel, defaultName, defaultRawName, defaultRawText, isNew, view, isChanged = false){

        if(Meteor.isServer) {
            // Get the parent reference id (if there is a parent)
            let parentRefId = 'NONE';
            let featureRefId = 'NONE';

            let parent = DesignUpdateComponents.findOne({_id: parentId});

            if (parent) {
                parentRefId = parent.componentReferenceId;

                // Get the Feature Reference ID.  This will be NONE for anything that is not under a Feature
                featureRefId = parent.componentFeatureReferenceIdNew;
            }

            // Get the design id - this is added to the components for easier access to data
            let designId = DesignVersions.findOne({_id: designVersionId}).designId;

            // If adding from a Work Package set as dev added
            let devAdded = (view === ViewType.DEVELOP_UPDATE_WP);

            let newUpdateComponentId = DesignUpdateComponents.insert(
                {
                    componentReferenceId:           'TEMP',                 // Will update this after component created
                    designId:                       designId,
                    designVersionId:                designVersionId,
                    designUpdateId:                 designUpdateId,
                    componentType:                  componentType,
                    componentLevel:                 componentLevel,
                    componentParentIdOld:           parentId,
                    componentParentIdNew:           parentId,               // Because this component may be moved later
                    componentParentReferenceIdOld:  parentRefId,
                    componentParentReferenceIdNew:  parentRefId,
                    componentFeatureReferenceIdOld: featureRefId,
                    componentFeatureReferenceIdNew: featureRefId,

                    // Data is all defaults to start with
                    componentNameOld:               defaultName,
                    componentNameRawOld:            defaultRawName,
                    componentNameNew:               defaultName,
                    componentNameRawNew:            defaultRawName,
                    componentTextRawOld:            defaultRawText,
                    componentTextRawNew:            defaultRawText,

                    // State is a new item
                    isNew:                          isNew,                  // New item added to design
                    isChanged:                      isChanged,              // Usually false
                    isTextChanged:                  false,                  // For now - will go to true when text is edited
                    isMoved:                        false,
                    isRemoved:                      false,
                    isDevAdded:                     devAdded,

                    scopeType:                      UpdateScopeType.SCOPE_IN_SCOPE,                         // All new items are automatically in scope
                    isScopable:                     DesignUpdateModules.isScopable(componentType)           // A Scopable item can be picked as part of a change
                }
            );

            if(newUpdateComponentId){

                // Update the component reference to be the _id.  Note that this is not silly because the CR ID will
                // always be the _id of the component that was created first.  So for components added in a design new edit
                // it will be the design component _id...
                DesignUpdateComponents.update(
                    {_id: newUpdateComponentId},
                    {$set: {componentReferenceId: newUpdateComponentId}}
                );

                // Set the starting index for a new component (at end of list).  This checks against the working design, not just this update
                DesignUpdateComponentModules.setIndex(newUpdateComponentId, componentType, parentId);

                // Ensure that all parents of the component are now in ParentScope
                //DesignUpdateComponentModules.updateParentScope(newUpdateComponentId, true);

                // If a Feature also update the Feature Ref Id to the new ID + add the default narrative
                if (componentType === ComponentType.FEATURE) {
                    DesignUpdateComponents.update(
                        {_id: newUpdateComponentId},
                        {
                            $set: {
                                componentFeatureReferenceIdOld: newUpdateComponentId,
                                componentFeatureReferenceIdNew: newUpdateComponentId,
                                componentNarrativeOld: DefaultComponentNames.NEW_NARRATIVE_TEXT,
                                componentNarrativeNew: DefaultComponentNames.NEW_NARRATIVE_TEXT,
                                componentNarrativeRawOld: DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_NARRATIVE_TEXT),
                                componentNarrativeRawNew: DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_NARRATIVE_TEXT)
                            }
                        }
                    );

                    // Make sure Design is no longer removable now that a feature added
                    DesignServices.setRemovable(designId);

                    // Update any WPs before adding the feature aspects
                    DesignUpdateComponentModules.updateWorkPackagesWithNewUpdateItem(designVersionId, designUpdateId, newUpdateComponentId);

                    // And update the Working Design Version if update is for Merging
                    DesignUpdateComponentModules.updateCurrentDesignVersionWithNewUpdateItem(designUpdateId, newUpdateComponentId);

                    // And for Features add the default Feature Aspects
                    // TODO - that could be user configurable!
                    DesignUpdateComponentModules.addDefaultFeatureAspects(designVersionId, designUpdateId, newUpdateComponentId, '', view);
                } else {
                    // Just update any WPs
                    DesignUpdateComponentModules.updateWorkPackagesWithNewUpdateItem(designVersionId, designUpdateId, newUpdateComponentId);

                    // And update the Working Design Version if update is for Merging
                    DesignUpdateComponentModules.updateCurrentDesignVersionWithNewUpdateItem(designUpdateId, newUpdateComponentId);
                }

                // When inserting a new design component its parent becomes non-removable
                if (parentId) {
                    DesignUpdateComponents.update(
                        {_id: parentId},
                        {
                            $set: {isRemovable: false}
                        }
                    );
                }

                // Peer components are also added in parent scope if not already added so that new component can be placed by user
                DesignUpdateComponentModules.addComponentPeers(designVersionId, designUpdateId, parentRefId, componentType, newUpdateComponentId);

                // And the Design Update Summary is now stale
                DesignUpdates.update({_id: designUpdateId}, {$set:{summaryDataStale: true}});
            }
        }
    };

    importComponent(designId, designVersionId, designUpdateId, component){
        if(Meteor.isServer) {

            // Fix any missing feature refs
            let componentFeatureReferenceIdNew = component.componentFeatureReferenceIdNew;
            if (component.componentType === ComponentType.FEATURE && componentFeatureReferenceIdNew === 'NONE') {
                componentFeatureReferenceIdNew = component.componentReferenceId;
            }

            const designUpdateComponentId = DesignUpdateComponents.insert(
                {
                    // Identity
                    componentReferenceId: component.componentReferenceId,
                    designId: designId,                                           // Restored Design Id
                    designVersionId: designVersionId,                                    // Restored Design Version Id
                    designUpdateId: designUpdateId,                                     // Restored Design Update Id
                    componentType: component.componentType,
                    componentLevel: component.componentLevel,
                    componentParentIdOld: component.componentParentIdOld,                     // Will be wrong and corrected later
                    componentParentIdNew: component.componentParentIdNew,                     // Ditto
                    componentParentReferenceIdOld: component.componentParentReferenceIdOld,
                    componentParentReferenceIdNew: component.componentParentReferenceIdNew,
                    componentFeatureReferenceIdOld: component.componentFeatureReferenceIdOld,
                    componentFeatureReferenceIdNew: componentFeatureReferenceIdNew,
                    componentIndexOld: component.componentIndexOld,
                    componentIndexNew: component.componentIndexNew,

                    // Data
                    componentNameOld: component.componentNameOld,
                    componentNameNew: component.componentNameNew,
                    componentNameRawOld: component.componentNameRawOld,
                    componentNameRawNew: component.componentNameRawNew,
                    componentNarrativeOld: component.componentNarrativeOld,
                    componentNarrativeNew: component.componentNarrativeNew,
                    componentNarrativeRawOld: component.componentNarrativeRawOld,
                    componentNarrativeRawNew: component.componentNarrativeRawNew,
                    componentTextRawOld: component.componentTextRawOld,
                    componentTextRawNew: component.componentTextRawNew,

                    // Update State
                    isNew: component.isNew,
                    isChanged: component.isChanged,
                    isTextChanged: component.isTextChanged,
                    isMoved: component.isMoved,
                    isRemoved: component.isRemoved,
                    isDevUpdated: component.isDevUpdated,
                    isDevAdded: component.isDevAdded,
                    workPackageId: component.workPackageId,

                    // Editing state (shared and persistent)
                    isRemovable: component.isRemovable,
                    isScopable: component.isScopable,
                    scopeType: component.scopeType,
                    lockingUser: component.lockingUser
                }
            );

            return designUpdateComponentId;
        }
    };

    // Resets parent ids after an import of data
    importRestoreParent(designUpdateComponentId, componentMap){
        if(Meteor.isServer) {
            const designUpdateComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

            const oldParentIdOld = designUpdateComponent.componentParentIdOld;
            const oldParentIdNew = designUpdateComponent.componentParentIdNew;

            // log(LogLevel.TRACE, "Restoring parent for DU component {} with previous old parent id {} and previous new parent id {}",
            //     designUpdateComponent.componentNameNew,
            //     oldParentIdOld,
            //     oldParentIdNew);

            let newParentIdOld = 'NONE';
            let newParentIdNew = 'NONE';

            if (oldParentIdOld != 'NONE') {
                newParentIdOld = getIdFromMap(componentMap, oldParentIdOld);
                log(LogLevel.TRACE, "New Parent Id Old is {}", newParentIdOld);
            }

            if (oldParentIdNew != 'NONE') {
                newParentIdNew = getIdFromMap(componentMap, oldParentIdNew);
                log(LogLevel.TRACE, "New Parent Id New is {}", newParentIdNew);
            }

            DesignUpdateComponents.update(
                {_id: designUpdateComponentId},
                {
                    $set: {
                        componentParentIdOld: newParentIdOld,
                        componentParentIdNew: newParentIdNew
                    }
                }
            );
        }
    }


    // Move a design update component to a new parent
    moveComponent(componentId, newParentId){

        if(Meteor.isServer) {
            const newParent = DesignUpdateComponents.findOne({_id: newParentId});
            const movingComponent = DesignUpdateComponents.findOne({_id: componentId});

            // Check for move back to old position
            const oldParentId = movingComponent.componentParentIdOld;

            // Not moved if the old parent is the same as the new one
            let isMoved = (oldParentId !== newParentId);

            // If a Design Section, make sure the level gets changed correctly
            let newLevel = movingComponent.componentLevel;

            if (movingComponent.componentType === ComponentType.DESIGN_SECTION) {
                newLevel = newParent.componentLevel + 1;
            }

            let updatedComponents = 0;
            if(movingComponent.componentType === ComponentType.FEATURE) {
                // The Feature Reference does not change
                updatedComponents = DesignUpdateComponents.update(
                    {_id: componentId},
                    {
                        $set: {
                            componentParentIdNew: newParentId,
                            componentParentReferenceIdNew: newParent.componentReferenceId,
                            componentLevel: newLevel,
                            isMoved: isMoved
                        }
                    }
                );
            } else {
                // The Feature Reference is the feature reference of the new parent.  A Feature has its own reference as the Feature Reference
                updatedComponents = DesignUpdateComponents.update(
                    {_id: componentId},
                    {
                        $set: {
                            componentParentIdNew: newParentId,
                            componentParentReferenceIdNew: newParent.componentReferenceId,
                            componentFeatureReferenceIdNew: newParent.componentFeatureReferenceIdNew,
                            componentLevel: newLevel,
                            isMoved: isMoved
                        }
                    }
                );
            }

            if(updatedComponents > 0){

                // Make sure new Parent is now not removable as it must have a child
                DesignUpdateComponents.update(
                    {_id: newParentId},
                    {
                        $set: {
                            isRemovable: false
                        }
                    }
                );

                // But the old parent may now be removable
                if (DesignUpdateComponentModules.hasNoChildren(oldParentId)) {
                    DesignUpdateComponents.update(
                        {_id: oldParentId},
                        {$set: {isRemovable: true}}
                    );
                }

                // Make sure this component is also moved in any work packages
                DesignUpdateComponentModules.updateWorkPackageLocation(componentId, false);

                // And in the current Design Version
                DesignUpdateComponentModules.updateCurrentDesignVersionWithNewLocation(componentId);

                // Design Update Summary is now stale
                DesignUpdates.update({_id: movingComponent.designUpdateId}, {$set:{summaryDataStale: true}});
            }
        }
    };

    // Move the component to a new position in its local list
    reorderComponent(componentId, targetComponentId){

        if(Meteor.isServer) {
            // The new position is always just above the target component

            const movingComponent = DesignUpdateComponents.findOne({_id: componentId});
            const targetComponent = DesignUpdateComponents.findOne({_id: targetComponentId});

            const peerComponents = DesignUpdateComponents.find(
                {
                    _id: {$ne: componentId},
                    componentType: movingComponent.componentType,
                    componentParentIdNew: movingComponent.componentParentIdNew
                },
                {sort: {componentIndexNew: -1}}
            );

            let indexBelow = targetComponent.componentIndexNew;
            //console.log("Index below = " + indexBelow);

            let indexAbove = 0;                                 // The default if nothing exists above
            const listMaxArrayIndex = peerComponents.count() - 1;
            //console.log("List max = " + listMaxArrayIndex);

            const peerArray = peerComponents.fetch();

            // Go through the list of peers (ordered from bottom to top)
            let i = 0;
            while (i <= listMaxArrayIndex) {
                if (peerArray[i].componentIndexNew === targetComponent.componentIndexNew) {
                    // OK, this is the target component so the next one in the list (if there is one) is the one that will be above the new position
                    if (i < listMaxArrayIndex) {
                        indexAbove = peerArray[i + 1].componentIndexNew;
                    }
                    break;
                }
                i++;
            }

            //console.log("Index above = " + indexAbove);

            // The new index is half way between the above an below index - sort of Dewey Decimal system to avoid having to reindex everything every time
            const indexDiff = indexBelow - indexAbove;
            const newIndex = (indexBelow + indexAbove) / 2;

            //console.log("Setting new index for " + movingComponent.componentNameNew + " to " + newIndex);

            DesignUpdateComponents.update(
                {_id: componentId},
                {
                    $set: {
                        componentIndexNew: newIndex
                    }
                }
            );

            // Update any WPs with new ordering
            DesignUpdateComponentModules.updateWorkPackageLocation(componentId, true);

            // And also the current Design Version
            DesignUpdateComponentModules.updateCurrentDesignVersionWithNewLocation(componentId);

            // Over time the indexing differences may get too small to work any more so periodically reset the indexes for this list.
            if (indexDiff < 0.001) {
                //console.log("Index reset!");

                // Get the components in current order
                const resetComponents = DesignUpdateComponents.find(
                    {
                        componentType: movingComponent.componentType,
                        componentParentIdNew: movingComponent.componentParentIdNew
                    },
                    {sort: {componentIndexNew: 1}}
                );

                let resetIndex = 100;

                // Reset them to 100, 200, 300 etc...
                resetComponents.forEach((component) => {
                    DesignUpdateComponents.update(
                        {_id: component._id},
                        {
                            $set: {
                                componentIndexNew: resetIndex
                            }
                        }
                    );

                    resetIndex = resetIndex + 100;
                })
            }

        }
    };

    // Change the scope state of a design update component
    toggleScope(baseComponentId, designUpdateId, newScope, forceRemove = false){

        if(Meteor.isServer) {

            const baseComponent = DesignVersionComponents.findOne({_id: baseComponentId});

            if (baseComponent) {

                const currentUpdateComponent = DesignUpdateComponents.findOne({
                    designUpdateId: designUpdateId,
                    componentReferenceId: baseComponent.componentReferenceId
                });

                // Adding to scope means adding to the current DU
                if(newScope) {

                        // Just check that it doesn't already exist
                        if (!currentUpdateComponent) {

                            // Add the new component as IN SCOPE
                            DesignUpdateComponentModules.insertComponentToUpdateScope(baseComponent, designUpdateId, UpdateScopeType.SCOPE_IN_SCOPE);

                            // Add all parents not already added
                            DesignUpdateComponentModules.addParentsToScope(baseComponent, designUpdateId);

                            // And fix the parent ids for all the items added
                            DesignUpdateModules.fixParentIds(baseComponent.designVersionId, designUpdateId);
                        } else {

                            // Component already exists so put in real scope if not in parent scope
                            DesignUpdateComponentModules.updateToActualScope(currentUpdateComponent._id);
                        }

                } else {

                    // Removing from scope means removing from the update - can only remove if in scope...
                    if(currentUpdateComponent && (currentUpdateComponent.scopeType === UpdateScopeType.SCOPE_IN_SCOPE)){

                        if(forceRemove){

                            // In this case we are restoring a delete so we want to remove everything that is in scope
                            DesignUpdateComponentModules.removeChildrenFromScope(baseComponent, designUpdateId);

                            DesignUpdateComponentModules.removeComponentFromUpdateScope(currentUpdateComponent._id);

                            DesignUpdateComponentModules.removeChildlessParentsFromScope(baseComponent, designUpdateId);

                        } else {

                            // Remove anything above it that is not in scope itself or has in-scope children
                            // -- UNLESS there is another in scope item below
                            if(DesignUpdateComponentModules.hasNoInScopeChildren(currentUpdateComponent._id, false)) {

                                // OK to remove completely
                                DesignUpdateComponentModules.removeComponentFromUpdateScope(currentUpdateComponent._id);

                                // And also remove any children that may be in parent scope due to abandoned component addition
                                DesignUpdateComponentModules.removeChildrenFromScope(baseComponent, designUpdateId);

                                // And the parents if OK
                                DesignUpdateComponentModules.removeChildlessParentsFromScope(baseComponent, designUpdateId);

                            } else {

                                // Need to convert to parent scope
                                DesignUpdateComponentModules.updateToParentScope(currentUpdateComponent._id);
                            }
                        }




                    }
                }
            }
        }
    }


    // Save text for a design update component
    updateComponentName(designUpdateComponentId, componentNewName, componentNewNameRaw){

        if(Meteor.isServer) {
            // Item only counts as logically changed if the new name is still different to that in the existing design version.
            // So it becomes not changed if reverted back to the original name after a change...

            let duComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

            let changed = (componentNewName !== duComponent.componentNameOld);

            // Update the new names for the update
            DesignUpdateComponents.update(
                {_id: designUpdateComponentId},
                {
                    $set: {
                        componentNameNew: componentNewName,
                        componentNameRawNew: componentNewNameRaw,
                        isChanged: changed
                    }
                }
            );


            if(changed) {

                // Update the design version if necessary
                DesignUpdateComponentModules.updateCurrentDesignVersionComponentName(designUpdateComponentId);

                // And the Design Update Summary is now stale if it was a real change
                DesignUpdates.update({_id: duComponent.designUpdateId}, {$set: {summaryDataStale: true}});
            }
        }
    };


    // Save the narrative for a feature component
    updateFeatureNarrative(featureId, newNarrative, newRawNarrative){

        if(Meteor.isServer) {

            let duComponent = DesignUpdateComponents.findOne({_id: featureId});
            let componentOldNarrative = duComponent.componentNarrativeOld;

            let changed = (newNarrative !== componentOldNarrative);

            DesignUpdateComponents.update(
                {_id: featureId},
                {
                    $set: {
                        componentNarrativeNew: newNarrative,
                        componentNarrativeRawNew: newRawNarrative,
                        isChanged: changed
                    }
                }
            );

            if(changed){

                // Update the design version if necessary
                DesignUpdateComponentModules.updateCurrentDesignVersionComponentDetails(featureId);
            }
        }
    };


    removeComponent(designUpdateComponentId, parentId){

        if(Meteor.isServer) {
            // For a design update this is a logical delete it it was an existing item
            // If however it was new in the update and is removable, remove it completely

            let designUpdateComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

            if (designUpdateComponent.isNew) {

                // Remove from the Design Version
                DesignUpdateComponentModules.updateCurrentDesignVersionWithRemoval(designUpdateComponent);

                // Actually delete it - Validation has already confirmed it is removable
                let removedComponents = DesignUpdateComponents.remove(
                    {_id: designUpdateComponentId}
                );

                if (removedComponents > 0) {

                    // When removing a design component its parent may become removable
                    if (DesignUpdateComponentModules.hasNoChildren(parentId)) {
                        DesignUpdateComponents.update(
                            {_id: parentId},
                            {$set: {isRemovable: true}}
                        )
                    }

                    // Remove component from any related work packages
                    DesignUpdateComponentModules.removeWorkPackageItems(designUpdateComponent._id, designUpdateComponent.designVersionId, designUpdateComponent.designUpdateId);


                    // If this happened to be the last Feature, Design is now removable
                    if (designUpdateComponent.componentType === ComponentType.FEATURE) {
                        DesignServices.setRemovable(designUpdateComponent.designId);
                    }

                    // Set as stale so that adding and removing a new component is picked up
                    DesignUpdates.update({_id: designUpdateComponent.designUpdateId}, {$set: {summaryDataStale: true}});
                }

            } else {

                // An existing component so Logically delete it for this update ad mark as removed elswhere for other updates
                let thisComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

                // Set removed component removed
                let deletedComponents = DesignUpdateComponents.update(
                    {
                        _id: designUpdateComponentId
                    },
                    {
                        $set: {
                            isRemoved: true
                            // Keep isRemovable as is so that restore can work
                        }
                    }
                );

                // Set other Update component instances as removed elsewhere
                DesignUpdateComponents.update(
                    {
                        _id:                    {$ne: designUpdateComponentId},
                        designUpdateId:         {$ne: thisComponent.designUpdateId},
                        designVersionId:        thisComponent.designVersionId,
                        componentReferenceId:   thisComponent.componentReferenceId
                    },
                    {
                        $set: {
                            isRemovedElsewhere: true
                        }
                    },
                    {multi: true}
                );

                if(deletedComponents > 0){

                    // For logically deleted components set the deleted component as in scope only in the update where it was deleted

                    DesignUpdateComponents.update(
                        {_id: designUpdateComponentId},
                        {
                            $set: {
                                scopeType: UpdateScopeType.SCOPE_IN_SCOPE
                            }
                        }
                    );

                    // For a logical delete we allow deletion of all children if we are allowing the delete
                    // We would not allow it if any new Components are under the component being deleted
                    // in this or any other Update.  This logic happens in Validation.

                    // Assuming we can delete because this component or a child of it is not in scope in another update
                    // we need to add all child components to the update scope as deleted
                    DesignUpdateComponentModules.logicallyDeleteChildren(thisComponent);

                    // And mark all as removed in the Design Version
                    DesignUpdateComponentModules.updateCurrentDesignVersionWithRemoval(thisComponent);

                    // This is a real change to functionality so set DU Summary as stale
                    DesignUpdates.update({_id: thisComponent.designUpdateId}, {$set: {summaryDataStale: true}});
                }
            }
        }
    };

    restoreComponent(designUpdateComponentId, parentId){

        if(Meteor.isServer) {

            // Undo a logical delete
            let thisComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

            let baseComponent = DesignVersionComponents.findOne({
                designVersionId: thisComponent.designVersionId,
                componentReferenceId: thisComponent.componentReferenceId
            });

            // Clear any parallel update components
            DesignUpdateComponents.update(
                {
                    _id:                    {$ne: designUpdateComponentId},
                    designUpdateId:         {$ne: thisComponent.designUpdateId},
                    designVersionId:        thisComponent.designVersionId,
                    componentReferenceId:   thisComponent.componentReferenceId
                },
                {
                    $set: {
                        isRemovedElsewhere: false
                    }
                },
                {multi: true}
            );

            // Mark as no longer removed in the Design Version
            DesignUpdateComponentModules.updateCurrentDesignVersionWithRestore(thisComponent);

            // Restore the component and its children - which effectively just means removing it from scope
            // Use force remove option to remove everything
            this.toggleScope(baseComponent._id, thisComponent.designUpdateId, false, true);
        }
    }


}

export default new DesignUpdateComponentServices();