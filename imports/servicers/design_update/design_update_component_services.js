
// Ultrawide services
import { ComponentType, ViewType, UpdateScopeType, LogLevel }  from '../../constants/constants.js';
import { DefaultComponentNames }    from '../../constants/default_names.js';
import { log }        from '../../common/utils.js';

import { DesignServices }               from '../design/design_services.js';
import { DesignUpdateModules }          from '../../service_modules/design_update/design_update_service_modules.js';
import { DesignComponentModules }       from '../../service_modules/design/design_component_service_modules.js';
import { DesignUpdateComponentModules } from '../../service_modules/design_update/design_update_component_service_modules.js';
import { WorkPackageModules }           from '../../service_modules/work/work_package_service_modules.js';

// Data Access
import { DesignVersionData }            from '../../data/design/design_version_db.js';
import { DesignComponentData }          from '../../data/design/design_component_db.js';
import { DesignUpdateData }             from '../../data/design_update/design_update_db.js';
import { DesignUpdateComponentData }    from '../../data/design_update/design_update_component_db.js';
import { WorkPackageData }              from '../../data/work/work_package_db.js';
import { UserDvMashScenarioData } from "../../data/mash/user_dv_mash_scenario_db";

//======================================================================================================================
//
// Server Code for Design Update Components.
//
// Methods called directly by Server API
//
//======================================================================================================================

class DesignUpdateComponentServicesClass {

    // Add a new design update component to design update
    addNewComponent(designVersionId, designUpdateId, workPackageId, parentRefId, componentType, componentLevel, defaultName, defaultRawName, defaultRawText, isNew, view, isChanged = false, isDefault = false){

        if(Meteor.isServer) {

            log((msg) => console.log(msg), LogLevel.DEBUG, 'Adding Update {} Component in view {}', componentType, view);

            // Get the parent reference id (if there is a parent)
            let featureRefId = 'NONE';

            let parent = DesignUpdateComponentData.getUpdateComponentByRef(designVersionId, designUpdateId, parentRefId);

            if (parent) {

                // Get the Feature Reference ID.  This will be NONE for anything that is not under a Feature
                featureRefId = parent.componentFeatureReferenceIdNew;
            }

            const dv = DesignVersionData.getDesignVersionById(designVersionId);

            // If adding from a Work Package set as dev added
            let devAdded = (view === ViewType.DEVELOP_UPDATE_WP);

            log((msg) => console.log(msg), LogLevel.DEBUG, '  Inserting Component...');

            let newUpdateComponentId = DesignUpdateComponentData.insertNewUpdateComponent(
                dv.designId,
                designVersionId,
                designUpdateId,
                componentType,
                componentLevel,
                parentRefId,
                featureRefId,
                defaultName,
                defaultRawName,
                defaultRawText,
                isNew,
                isDefault,
                isChanged,
                devAdded,
                workPackageId,
                DesignUpdateModules.isScopable(componentType)
            );


            if(newUpdateComponentId){

                // Update the component reference to be the _id.  Note that this is not silly because the CR ID will
                // always be the _id of the component that was created first.  So for components added in a design new edit
                // it will be the design component _id...
                log((msg) => console.log(msg), LogLevel.DEBUG, '  Updating reference...');

                DesignUpdateComponentData.setComponentReferenceId(newUpdateComponentId);

                log((msg) => console.log(msg), LogLevel.DEBUG, '  Setting Index...');
                // Set the starting index for a new component (at end of list).  This checks against the working design, not just this update
                DesignUpdateComponentModules.setIndex(newUpdateComponentId, componentType);


                // If a Feature also update the Feature Ref Id to the new ID + add the default narrative
                if (componentType === ComponentType.FEATURE) {

                    log((msg) => console.log(msg), LogLevel.DEBUG, '  Configuring Feature...');

                    DesignUpdateComponentData.initialiseFeatureDetails(
                        newUpdateComponentId,
                        DefaultComponentNames.NEW_NARRATIVE_TEXT,
                        DesignComponentModules.getRawTextFor(DefaultComponentNames.NEW_NARRATIVE_TEXT)
                    );

                    log((msg) => console.log(msg), LogLevel.DEBUG, '  Setting removable on Design...');
                    // Make sure Design is no longer removable now that a feature added
                    DesignServices.setRemovable(dv.designId);

                    log((msg) => console.log(msg), LogLevel.DEBUG, '  Updating DV...');
                    // And update the Working Design Version if update is for Merging
                    DesignUpdateComponentModules.updateCurrentDesignVersionWithNewUpdateItem(designUpdateId, newUpdateComponentId);

                    // And for Features add the default Feature Aspects
                      log((msg) => console.log(msg), LogLevel.DEBUG, '  Adding Default Aspects...');
                    DesignUpdateComponentModules.addDefaultFeatureAspects(dv.designId, designVersionId, designUpdateId, newUpdateComponentId, '', view);

                } else {

                    // Update the Working Design Version if update is for Merging
                    log((msg) => console.log(msg), LogLevel.DEBUG, '  Updating DV...');
                    DesignUpdateComponentModules.updateCurrentDesignVersionWithNewUpdateItem(designUpdateId, newUpdateComponentId);
                }

                // Add Dev Added Aspects and Scenarios to WP
                log((msg) => console.log(msg), LogLevel.DEBUG, '  DEV ADDED {} and WP is {}', devAdded, workPackageId);

                if(devAdded && workPackageId !== 'NONE' && (componentType === ComponentType.FEATURE_ASPECT || componentType === ComponentType.SCENARIO)){

                    const wp = WorkPackageData.getWorkPackageById(workPackageId);
                    const component = DesignUpdateComponentData.getUpdateComponentById(newUpdateComponentId);
                    const parent = DesignUpdateComponentData.getUpdateComponentByRef(component.designVersionId, component.designUpdateId, component.componentParentReferenceIdNew);

                    WorkPackageModules.addNewDesignComponentToWorkPackage(wp, component, parent._id, designVersionId, designUpdateId);
                    log((msg) => console.log(msg), LogLevel.DEBUG, '  Added component {} to WP {}', component.componentNameNew, wp.workPackageName);
                }

                log((msg) => console.log(msg), LogLevel.DEBUG, '  Setting parent removability...');

                // When inserting a new design component its parent becomes non-removable
                if (parent) {
                    DesignUpdateComponentData.setRemovable(parent._id, false);
                }

                log((msg) => console.log(msg), LogLevel.DEBUG, '  Adding peers...');

                // Peer components are also added in peer scope if not already added so that new component can be placed by user
                DesignUpdateComponentModules.addComponentPeers(designVersionId, designUpdateId, parentRefId, componentType, newUpdateComponentId);

                // And the Design Update Summary is now stale
                log((msg) => console.log(msg), LogLevel.DEBUG, '  Set summary stale...');

                DesignUpdateData.setSummaryDataStale(designUpdateId, true);

                log((msg) => console.log(msg), LogLevel.DEBUG, 'DONE Add Update Component');
            }
        }
    };


    // Move a design update component to a new parent
    moveComponent(componentId, newParentId){

        if(Meteor.isServer) {

            const newParent = DesignUpdateComponentData.getUpdateComponentById(newParentId);
            const movingComponent = DesignUpdateComponentData.getUpdateComponentById(componentId);
            const oldParent = DesignUpdateComponentData.getUpdateComponentByRef(movingComponent.designVersionId, movingComponent.designUpdateId, movingComponent.componentParentReferenceIdNew);

            // Check for move back to old position
            const oldParentRefId = movingComponent.componentParentReferenceIdOld;

            // Not moved if the old parent is the same as the new one
            let isMoved = (oldParentRefId !== newParent.componentReferenceId);

            // If a Design Section, make sure the level gets changed correctly
            let newLevel = movingComponent.componentLevel;

            if (movingComponent.componentType === ComponentType.DESIGN_SECTION) {
                newLevel = newParent.componentLevel + 1;
            }

            // If moving a feature it must keep its feature ref id - otherwise take on the parent feature ref
            let componentFeatureReferenceId = newParent.componentFeatureReferenceIdNew;
            if(movingComponent.componentType === ComponentType.FEATURE) {
                componentFeatureReferenceId = movingComponent.componentFeatureReferenceIdNew;
            }

            const updatedComponents = DesignUpdateComponentData.updateAfterMove(componentId, newParent.componentReferenceId, componentFeatureReferenceId, newLevel, isMoved);

            if(updatedComponents > 0){

                // Make sure new Parent is now not removable as it must have a child
                DesignUpdateComponentData.setRemovable(newParentId, false);

                // But the old parent may now be removable
                if(oldParent) {
                    if (DesignUpdateComponentModules.hasNoNonRemovedChildren(oldParent._id)) {

                        DesignUpdateComponentData.setRemovable(oldParent._id, true);
                    }
                }
                // Make sure this component is also moved in any work packages
                DesignUpdateComponentModules.updateWorkPackageLocation(componentId, false);

                // And in the current Design Version
                DesignUpdateComponentModules.updateCurrentDesignVersionWithNewLocation(componentId);

                // Design Update Summary is now stale
                DesignUpdateData.setSummaryDataStale(movingComponent.designUpdateId, true);
            }
        }
    };

    // Move the component to a new position in its local list
    reorderComponent(componentId, targetComponentId){

        if(Meteor.isServer) {
            // The new position is always just above the target component

            const movingComponent = DesignUpdateComponentData.getUpdateComponentById(componentId);
            const targetComponent = DesignUpdateComponentData.getUpdateComponentById(targetComponentId);
            const oldIndex = movingComponent.componentIndexNew;

            const peerComponents = DesignUpdateComponentData.getPeerComponents(
                movingComponent.designUpdateId,
                movingComponent.componentReferenceId,
                movingComponent.componentType,
                movingComponent.componentParentReferenceIdNew
            );

            let indexBelow = targetComponent.componentIndexNew;
            //console.log("Index below = " + indexBelow);

            let indexAbove = 0;                                 // The default if nothing exists above
            const listMaxArrayIndex = peerComponents.length - 1;
            //console.log("List max = " + listMaxArrayIndex);


            // Go through the list of peers (ordered from bottom to top)
            let i = 0;
            while (i <= listMaxArrayIndex) {
                if (peerComponents[i].componentIndexNew === targetComponent.componentIndexNew) {
                    // OK, this is the target component so the next one in the list (if there is one) is the one that will be above the new position
                    if (i < listMaxArrayIndex) {
                        indexAbove = peerComponents[i + 1].componentIndexNew;
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

            DesignUpdateComponentData.setIndex(componentId, oldIndex, newIndex);

            // Update any WPs with new ordering
            DesignUpdateComponentModules.updateWorkPackageLocation(componentId, true);

            // And also the current Design Version
            DesignUpdateComponentModules.updateCurrentDesignVersionWithNewLocation(componentId);

            // Over time the indexing differences may get too small to work any more so periodically reset the indexes for this list.
            if (indexDiff < 0.001) {
                //console.log("Index reset!");

                // Get the components in current order
                const resetComponents = DesignUpdateComponentData.getChildComponentsOfType(movingComponent.designUpdateId, movingComponent.componentType, movingComponent.componentParentReferenceIdNew);

                let resetIndex = 100;

                // Reset them to 100, 200, 300 etc...
                resetComponents.forEach((component) => {
                    DesignUpdateComponentData.setIndex(component._id, resetIndex, resetIndex);
                    resetIndex = resetIndex + 100;
                })
            }

        }
    };

    // Change the scope state of a design update component
    toggleScope(baseComponentId, designUpdateId, newScope, forceRemove = false){

        if(Meteor.isServer) {

            const baseComponent = DesignComponentData.getDesignComponentById(baseComponentId);

            if (baseComponent) {

                const currentUpdateComponent = DesignUpdateComponentData.getUpdateComponentByRef(baseComponent.designVersionId, designUpdateId, baseComponent.componentReferenceId);

                // Adding to scope means adding to the current DU
                if(newScope) {

                        // Just check that it doesn't already exist
                        if (!currentUpdateComponent) {

                            // Add the new component as IN SCOPE
                            DesignUpdateComponentModules.insertComponentToUpdateScope(baseComponent, designUpdateId, UpdateScopeType.SCOPE_IN_SCOPE);

                            // Add all parents not already added
                            DesignUpdateComponentModules.addParentsToScope(baseComponent, designUpdateId);

                        } else {

                            // Component already exists so put in real scope
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

                            // Remove anything above it that is not in scope itself or has in-scope children (due to additions or removals or changes)
                            // -- UNLESS there is another in scope item below
                            if(DesignUpdateComponentModules.hasNoInScopeChildren(currentUpdateComponent._id, false)) {

                                // OK to remove completely
                                DesignUpdateComponentModules.removeComponentFromUpdateScope(currentUpdateComponent._id);

                                // And also remove any children that may be in parent scope due to abandoned component addition
                                DesignUpdateComponentModules.removeChildrenFromScope(baseComponent, designUpdateId);

                                // And the parents if OK
                                DesignUpdateComponentModules.removeChildlessParentsFromScope(baseComponent, designUpdateId);

                            } else {

                                // Need to convert to parent scope os effectively not removable from scope
                                DesignUpdateComponentModules.updateToParentScope(currentUpdateComponent._id);
                            }
                        }
                    }
                }

                DesignUpdateData.setSummaryDataStale(designUpdateId, true);
            }
        }
    }


    // Save text for a design update component
    updateComponentName(designUpdateComponentId, componentNewName, componentNewNameRaw){

        if(Meteor.isServer) {
            // Item only counts as logically changed if the new name is still different to that in the existing design version.
            // So it becomes not changed if reverted back to the original name after a change...

            let duComponent = DesignUpdateComponentData.getUpdateComponentById(designUpdateComponentId);

            // For a new component, the name updates to whatever the latest name is - no old and new versions as the whole thing is NEW
            if(duComponent.isNew){

                DesignUpdateComponentData.updateComponentName(
                    designUpdateComponentId,
                    componentNewName,
                    componentNewName,
                    componentNewNameRaw,
                    componentNewNameRaw,
                    false
                );

                // Keep DV up to date
                DesignUpdateComponentModules.updateCurrentDesignVersionComponentName(designUpdateComponentId);

                // Make sure summary updates...
                DesignUpdateData.setSummaryDataStale(duComponent.designUpdateId, true);


            } else {

                // An existing component so just update the new name...

                let changed = (componentNewName !== duComponent.componentNameOld);

                // Update the new names for the update
                DesignUpdateComponentData.updateComponentName(
                    designUpdateComponentId,
                    duComponent.componentNameOld,
                    componentNewName,
                    duComponent.componentNameRawOld,
                    componentNewNameRaw,
                    changed
                );

                if (changed) {

                    // Update the design version if necessary
                    DesignUpdateComponentModules.updateCurrentDesignVersionComponentName(designUpdateComponentId);

                    // And the Design Update Summary is now stale if it was a real change
                    DesignUpdateData.setSummaryDataStale(duComponent.designUpdateId, true);
                }
            }
        }
    };


    // Save the narrative for a feature component
    updateFeatureNarrative(featureId, newNarrative, newRawNarrative){

        if(Meteor.isServer) {

            let duComponent = DesignUpdateComponentData.getUpdateComponentById(featureId);

            // For a new component, the narrative updates to whatever the latest name is - no old and new versions as the whole thing is NEW
            if(duComponent.isNew){

                DesignUpdateComponentData.updateFeatureNarrative(
                    featureId,
                    newNarrative,
                    newNarrative,
                    newRawNarrative,
                    newRawNarrative,
                    false
                );

                // Keep DV up to date
                DesignUpdateComponentModules.updateCurrentDesignVersionComponentDetails(featureId);

            } else {
                // An existing component so just update the new narrative...

                let changed = (newNarrative !== duComponent.componentNarrativeOld);

                DesignUpdateComponentData.updateFeatureNarrative(
                    featureId,
                    duComponent.componentNarrativeOld,
                    newNarrative,
                    duComponent.componentNarrativeRawOld,
                    newRawNarrative,
                    changed
                );

                if (changed) {

                    // Update the design version if necessary
                    DesignUpdateComponentModules.updateCurrentDesignVersionComponentDetails(featureId);
                }
            }
        }
    };


    removeComponent(designUpdateComponentId, parentId){

        if(Meteor.isServer) {
            // For a design update this is a logical delete it it was an existing item
            // If however it was new in the update and is removable, remove it completely

            let duComponent = DesignUpdateComponentData.getUpdateComponentById(designUpdateComponentId);

            // For Feature aspects added as default items and not marked as new as such (so they don't appear as user changes)
            // treat them as new so if deleted they go completely...

            let newDefaultAspect = false;

            if(duComponent.componentType === ComponentType.FEATURE_ASPECT){
                // The feature is the parent component
                const feature = DesignUpdateComponentData.getUpdateComponentByRef(
                    duComponent.designVersionId,
                    duComponent.designUpdateId,
                    duComponent.componentParentReferenceIdNew
                );

                if(feature.isNew && !duComponent.isNew){
                    newDefaultAspect = true;
                }
            }

            if (duComponent.isNew || newDefaultAspect) {

                // Remove from the Design Version
                DesignUpdateComponentModules.updateCurrentDesignVersionWithRemoval(duComponent);

                // Actually delete it - Validation has already confirmed it is removable
                let removedComponents = DesignUpdateComponentData.removeComponent(designUpdateComponentId);

                if (removedComponents > 0) {

                    // When removing a design component its parent may become removable
                    if (DesignUpdateComponentModules.hasNoNonRemovedChildren(parentId)) {

                        DesignUpdateComponentData.setRemovable(parentId, true);
                    }

                    // Remove peers if they are no longer necessary
                    DesignUpdateComponentModules.removeUnwantedPeers(duComponent);

                    // Remove component from any related work packages
                    DesignUpdateComponentModules.removeWorkPackageItems(duComponent.componentReferenceId, duComponent.designVersionId, duComponent.designUpdateId);


                    // If this happened to be the last Feature, Design is now removable
                    if (duComponent.componentType === ComponentType.FEATURE) {
                        DesignServices.setRemovable(duComponent.designId);
                    }

                    // Set as stale so that adding and removing a new component is picked up
                    DesignUpdateData.setSummaryDataStale(duComponent.designUpdateId, true);
                }

            } else {

                // An existing component so Logically delete it for this update ad mark as removed elswhere for other updates
                let thisComponent = DesignUpdateComponentData.getUpdateComponentById(designUpdateComponentId);

                // Set removed component removed.  Undo any name modifications made in this update
                let deletedComponents = DesignUpdateComponentData.logicallyDeleteComponent(
                    designUpdateComponentId,
                    thisComponent.componentNameOld,
                    thisComponent.componentNameRawOld
                );

                // Set other Update component instances as removed elsewhere
                DesignUpdateComponentData.setOtherDvInstancesRemovedElsewhere(
                    designUpdateComponentId,
                    thisComponent.designUpdateId,
                    thisComponent.designVersionId,
                    thisComponent.componentReferenceId,
                    true
                );

                if(deletedComponents > 0){

                    // For a logical delete we allow deletion of all children if we are allowing the delete
                    // We would not allow it if any new Components are under the component being deleted
                    // in this or any other Update.  This logic happens in Validation.

                    // Assuming we can delete because this component or a child of it is not in scope in another update
                    // we need to add all child components to the update scope as deleted
                    DesignUpdateComponentModules.logicallyDeleteChildren(thisComponent);

                    // And mark all as removed in the Design Version
                    DesignUpdateComponentModules.updateCurrentDesignVersionWithRemoval(thisComponent);

                    // This is a real change to functionality so set DU Summary as stale
                    DesignUpdateData.setSummaryDataStale(thisComponent.designUpdateId, true);
                }
            }
        }
    };

    restoreComponent(designUpdateComponentId,){

        if(Meteor.isServer) {

            // Undo a logical delete
            let thisComponent = DesignUpdateComponentData.getUpdateComponentById(designUpdateComponentId);

            let baseComponent = DesignComponentData.getDesignComponentByRef(thisComponent.designVersionId, thisComponent.componentReferenceId);

            // Clear any parallel update components
            DesignUpdateComponentData.setOtherDvInstancesRemovedElsewhere(
                designUpdateComponentId,
                thisComponent.designUpdateId,
                thisComponent.designVersionId,
                thisComponent.componentReferenceId,
                false
            );

            // Mark as no longer removed in the Design Version
            DesignUpdateComponentModules.updateCurrentDesignVersionWithRestore(thisComponent);

            // Restore the component and its children - which effectively just means removing it from scope
            // Use force remove option to remove everything
            this.toggleScope(baseComponent._id, thisComponent.designUpdateId, false, true);

            DesignUpdateData.setSummaryDataStale(thisComponent.designUpdateId, true);
        }
    }

    setScenarioTestExpectations(userId, designUpdateComponentId, accExpectation, intExpectation, unitExpectation){

        DesignUpdateComponentData.setTestExpectations(designUpdateComponentId, accExpectation, intExpectation, unitExpectation);

        // Duplicate the expectations on the base component
        const updateComponent = DesignUpdateComponentData.getUpdateComponentById(designUpdateComponentId);

        const baseComponent = DesignComponentData.getDesignComponentByRef(updateComponent.designVersionId, updateComponent.componentReferenceId);

        DesignComponentData.setTestExpectations(baseComponent._id, accExpectation, intExpectation, unitExpectation);

        // And update the mash expectations too for this scenario
        UserDvMashScenarioData.updateMashScenarioExpectations(userId, baseComponent.designVersionId, baseComponent.componentReferenceId, accExpectation, intExpectation, unitExpectation);

    }
}

export const DesignUpdateComponentServices = new DesignUpdateComponentServicesClass();