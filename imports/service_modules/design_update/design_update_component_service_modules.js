
// Ultrawide Collections
import { DesignUpdates }            from '../../collections/design_update/design_updates.js';
import { DesignVersionComponents }  from '../../collections/design/design_version_components.js';
import { DesignUpdateComponents }   from '../../collections/design_update/design_update_components.js';
import { WorkPackages }             from '../../collections/work/work_packages.js';
import { WorkPackageComponents }    from '../../collections/work/work_package_components.js';

// Ultrawide Services
import { ComponentType, LogLevel, WorkPackageStatus, WorkPackageType, DesignUpdateMergeAction, UpdateScopeType, UpdateMergeStatus }      from '../../constants/constants.js';
import DesignUpdateComponentServices    from '../../servicers/design_update/design_update_component_services.js';
import DesignComponentModules           from '../../service_modules/design/design_component_service_modules.js';
import DesignUpdateModules              from '../../service_modules/design_update/design_update_service_modules.js';
import DesignVersionModules             from '../../service_modules/design/design_version_service_modules.js';
import WorkPackageModules               from '../../service_modules/work/work_package_service_modules.js';

import { log }                          from '../../common/utils.js'

// REDUX services
import store from '../../redux/store'
import {setCurrentUserOpenDesignUpdateItems, updateOpenItemsFlag} from '../../redux/actions'

//======================================================================================================================
//
// Server Modules for Design Update Components.
//
// Methods called from within main API methods
//
//======================================================================================================================

class DesignUpdateComponentModules{

    addDefaultFeatureAspects(designVersionId, designUpdateId, featureId, defaultRawText, view){
        DesignUpdateComponentServices.addNewComponent(designVersionId, designUpdateId, featureId, ComponentType.FEATURE_ASPECT, 0, 'Interface', DesignComponentModules.getRawTextFor('Interface'), defaultRawText, false, view);
        DesignUpdateComponentServices.addNewComponent(designVersionId, designUpdateId, featureId, ComponentType.FEATURE_ASPECT, 0, 'Actions', DesignComponentModules.getRawTextFor('Actions'), defaultRawText, false, view);
        DesignUpdateComponentServices.addNewComponent(designVersionId, designUpdateId, featureId, ComponentType.FEATURE_ASPECT, 0, 'Conditions', DesignComponentModules.getRawTextFor('Conditions'), defaultRawText, false, view);
        DesignUpdateComponentServices.addNewComponent(designVersionId, designUpdateId, featureId, ComponentType.FEATURE_ASPECT, 0, 'Consequences', DesignComponentModules.getRawTextFor('Consequences'), defaultRawText, false, view);
    }

    updateWorkPackagesWithNewUpdateItem(designVersionId, designUpdateId, newUpdateComponentId){

        // See if any update WPs affected by this update
        const workPackages = WorkPackages.find({
            designVersionId:    designVersionId,
            designUpdateId:     designUpdateId,
            workPackageStatus:  {$ne: WorkPackageStatus.WP_COMPLETE},
            workPackageType:    WorkPackageType.WP_UPDATE
        }).fetch();

        const component = DesignUpdateComponents.findOne({_id: newUpdateComponentId});

        // Application will not have parent
        let componentParentId = 'NONE';
        const componentParent = DesignUpdateComponents.findOne({_id: component.componentParentIdNew});
        if(componentParent){
            componentParentId = componentParent._id;
        }

        // If the parent is in the WP actual scope, add in this component too
        workPackages.forEach((wp) => {

            WorkPackageModules.addNewDesignComponentToWorkPackage(wp, component, componentParentId, designVersionId);

        });
    };

    updateCurrentDesignVersionWithScopedScenario(designUpdateId, scenario){


        const designUpdate = DesignUpdates.findOne({_id: designUpdateId});

        // Add this item to the working design if we are merging this update
        if(designUpdate.updateMergeAction === DesignUpdateMergeAction.MERGE_INCLUDE){

            DesignVersionModules.setDesignVersionScenarioAsQueried(scenario);
        }
    }

    updateCurrentDesignVersionWithUnscopedScenario(duScenario){

        const designUpdate = DesignUpdates.findOne({_id: duScenario.designUpdateId});

        const baseScenario = DesignVersionComponents.findOne({
            designVersionId:        designUpdate.designVersionId,
            componentReferenceId:   duScenario.componentReferenceId
        });

        // Add this item to the working design if we are merging this update
        if(designUpdate.updateMergeAction === DesignUpdateMergeAction.MERGE_INCLUDE){

            DesignVersionModules.setDesignVersionScenarioAsBase(baseScenario);
        }
    }

    updateCurrentDesignVersionWithNewUpdateItem(designUpdateId, newUpdateComponentId){

        const designUpdate = DesignUpdates.findOne({_id: designUpdateId});

        // Add this item to the working design if we are merging this update
        if(designUpdate.updateMergeAction === DesignUpdateMergeAction.MERGE_INCLUDE){

            const updateComponent = DesignUpdateComponents.findOne({_id: newUpdateComponentId});

            DesignVersionModules.addUpdateItemToDesignVersion(updateComponent);
        }
    }

    updateWorkPackageLocation(designUpdateComponentId, reorder){

        const component = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

        // See if any update WPs affected by this update
        const workPackages = WorkPackages.find({
            designVersionId:    component.designVersionId,
            designUpdateId:     component.designUpdateId,
            workPackageStatus:  {$ne: WorkPackageStatus.WP_COMPLETE},
            workPackageType:    WorkPackageType.WP_UPDATE
        }).fetch();

        const componentParent = DesignUpdateComponents.findOne({_id: component.componentParentIdNew});

        workPackages.forEach((wp) => {

            WorkPackageModules.updateDesignComponentLocationInWorkPackage(reorder, wp, component, componentParent);

        });
    };

    updateCurrentDesignVersionWithNewLocation(movingComponentId){

        // Pass in the ID and get the component again AFTER the change...

        const designUpdateComponent = DesignUpdateComponents.findOne({_id: movingComponentId});
        const designUpdate = DesignUpdates.findOne({_id: designUpdateComponent.designUpdateId});

        // Add this item to the working design if we are merging this update
        if(designUpdate.updateMergeAction === DesignUpdateMergeAction.MERGE_INCLUDE){

            DesignVersionModules.moveUpdateItemInDesignVersion(designUpdateComponent);
        }
    }

    removeWorkPackageItems(designUpdateComponentId, designVersionId, designUpdateId){

        // See if any update WPs affected by this update
        const workPackages = WorkPackages.find({
            designVersionId:    designVersionId,
            designUpdateId:     designUpdateId,
            workPackageStatus:  {$ne: WorkPackageStatus.WP_COMPLETE},
            workPackageType:    WorkPackageType.WP_UPDATE
        }).fetch();

        workPackages.forEach((wp) => {

            WorkPackageModules.removeDesignComponentFromWorkPackage(wp._id, designUpdateComponentId);

        });
    };

    updateCurrentDesignVersionWithRemoval(removedComponent){

        // With this action we can pass in the actual component as we act BEFORE it is removed.

        const designUpdate = DesignUpdates.findOne({_id: removedComponent.designUpdateId});

        // Remove from working design if we are merging this update
        if(designUpdate.updateMergeAction === DesignUpdateMergeAction.MERGE_INCLUDE){

            DesignVersionModules.removeUpdateItemInDesignVersion(removedComponent)
        }
    }

    updateCurrentDesignVersionWithRestore(restoredComponent){

        const designUpdate = DesignUpdates.findOne({_id: restoredComponent.designUpdateId});

        // Restore to the working design if we are merging this update
        if(designUpdate.updateMergeAction === DesignUpdateMergeAction.MERGE_INCLUDE){

            DesignVersionModules.restoreUpdateItemInDesignVersion(restoredComponent)
        }
    }

    updateCurrentDesignVersionComponentName(updatedComponentId){

        const designUpdateComponent = DesignUpdateComponents.findOne({_id: updatedComponentId});
        const designUpdate = DesignUpdates.findOne({_id: designUpdateComponent.designUpdateId});

        // Update the working design if we are merging this update
        if(designUpdate.updateMergeAction === DesignUpdateMergeAction.MERGE_INCLUDE){

            DesignVersionModules.updateItemNameInDesignVersion(designUpdateComponent)
        }
    }

    updateCurrentDesignVersionComponentDetails(updatedComponentId){

        const designUpdateComponent = DesignUpdateComponents.findOne({_id: updatedComponentId});
        const designUpdate = DesignUpdates.findOne({_id: designUpdateComponent.designUpdateId});

        // Update the working design if we are merging this update
        if(designUpdate.updateMergeAction === DesignUpdateMergeAction.MERGE_INCLUDE){

            DesignVersionModules.updateItemDetailsInDesignVersion(designUpdateComponent)
        }
    }

    setIndex(componentId, componentType, parentId){

        // Get the max index of OTHER components of this type under the same parent in the working version
        // List of Peers has to be a combination of EXISTING and NEW peers
        let existingPeerComponents = [];
        let newPeerComponents = [];

        const updateComponent = DesignUpdateComponents.findOne({_id: componentId});

        if(componentType === ComponentType.APPLICATION){

            existingPeerComponents = DesignVersionComponents.find(
                {
                    designVersionId: updateComponent.designVersionId,
                    componentReferenceId: {$ne: updateComponent.componentReferenceId},
                    componentType: componentType,
                    updateMergeStatus: UpdateMergeStatus.COMPONENT_BASE
                },
                {sort:{componentIndexNew: -1}}
            ).fetch();

            newPeerComponents = DesignUpdateComponents.find(
                {
                    designUpdateId: updateComponent.designUpdateId,
                    componentReferenceId: {$ne: updateComponent.componentReferenceId},
                    componentType: componentType,
                    isNew: true
                },
                {sort:{componentIndexNew: -1}}
            ).fetch();

        } else {

            existingPeerComponents = DesignVersionComponents.find(
                {
                    designVersionId: updateComponent.designVersionId,
                    componentReferenceId: {$ne: updateComponent.componentReferenceId},
                    componentType: componentType,
                    componentParentReferenceIdNew: updateComponent.componentParentReferenceIdNew,
                    updateMergeStatus: {$ne: UpdateMergeStatus.COMPONENT_ADDED}
                },
                {sort: {componentIndexNew: -1}}
            ).fetch();

            newPeerComponents = DesignUpdateComponents.find(
                {
                    designUpdateId: updateComponent.designUpdateId,
                    componentReferenceId: {$ne: updateComponent.componentReferenceId},
                    componentType: componentType,
                    componentParentReferenceIdNew: updateComponent.componentParentReferenceIdNew,
                    isNew: true
                },
                {sort:{componentIndexNew: -1}}
            ).fetch();
        }

        // If no components then leave as default of 100
        if(existingPeerComponents.length > 0 || newPeerComponents.length > 0){

            // Find the biggest from the new and existing
            let maxPeer = 0;
            if(existingPeerComponents.length > 0){
                maxPeer = existingPeerComponents[0].componentIndexNew;
                //console.log("Max existing peer is " + existingPeerComponents[0].componentNameNew + " with index " + existingPeerComponents[0].componentIndexNew);
            }
            if(newPeerComponents.length > 0){
                if(newPeerComponents[0].componentIndexNew > maxPeer){
                    maxPeer = newPeerComponents[0].componentIndexNew;
                    //console.log("Max new peer is " + newPeerComponents[0].componentNameNew + " with index " + newPeerComponents[0].componentIndexNew);
                }
            }

            let newIndex = maxPeer + 100;

            DesignUpdateComponents.update(
                {_id: componentId},
                {
                    $set:{
                        componentIndexOld: newIndex,
                        componentIndexNew: newIndex
                    }
                }
            );
        }
    };

    addComponentPeers(designVersionId, designUpdateId, parentRefId, componentType, newUpdateComponentId){

        // Get the new component added to DU
        const duComponent = DesignUpdateComponents.findOne({_id: newUpdateComponentId});

        // Get the peer components
        const peers = DesignVersionComponents.find({
            designVersionId:                designVersionId,
            componentType:                  componentType,
            componentParentReferenceIdNew:  parentRefId
        });

        peers.forEach((peer) => {

            // This call only inserts stuff not already in the update so won't insert others that happen to be in scope
            this.insertComponentToUpdateScope(peer, designUpdateId, UpdateScopeType.SCOPE_PEER_SCOPE)  // Insert as in peer scope
        });
    }

    removeUnwantedPeers(removedComponent, parentId){

        const parent = DesignUpdateComponents.findOne({_id: parentId});

        // Might be an Application with no parent
        let duParentId = 'NONE';

        if(parent){
            duParentId = parent._id;
        }

        // If there are no longer any New components under the parent, set any peer scope items out of scope
        const peers = DesignUpdateComponents.find({
            designUpdateId:                 removedComponent.designUpdateId,
            componentType:                  removedComponent.componentType,
            componentParentIdNew:           duParentId
        });

        let newComponents = false;

        peers.forEach((peer) => {
            if(peer.isNew){
                newComponents = true;
            }
        });

        if(!newComponents){
            // Set all peer scope peers out of scope (i.e. remove them)
            DesignUpdateComponents.remove(
                {
                    designUpdateId:                 removedComponent.designUpdateId,
                    componentType:                  removedComponent.componentType,
                    componentParentIdNew:           duParentId,
                    scopeType:                      UpdateScopeType.SCOPE_PEER_SCOPE
                }
            );
        }
    }

    insertComponentToUpdateScope(baseComponent, designUpdateId, scopeType){

        // Only insert if not already existing
        const updateComponent = DesignUpdateComponents.findOne({
            designUpdateId: designUpdateId,
            componentReferenceId: baseComponent.componentReferenceId
        });

        if(!updateComponent){
            const isScopable = DesignUpdateModules.isScopable(baseComponent.componentType);

            const designUpdateComponentId = DesignUpdateComponents.insert({
                componentReferenceId:           baseComponent.componentReferenceId,
                designId:                       baseComponent.designId,
                designVersionId:                baseComponent.designVersionId,
                designUpdateId:                 designUpdateId,
                componentType:                  baseComponent.componentType,
                componentLevel:                 baseComponent.componentLevel,
                componentParentIdOld:           'NONE',                                             // To be corrected after
                componentParentIdNew:           'NONE',                                             // To be corrected after
                componentParentReferenceIdOld:  baseComponent.componentParentReferenceIdNew,
                componentParentReferenceIdNew:  baseComponent.componentParentReferenceIdNew,
                componentFeatureReferenceIdOld: baseComponent.componentFeatureReferenceIdNew,
                componentFeatureReferenceIdNew: baseComponent.componentFeatureReferenceIdNew,
                componentIndexOld:              baseComponent.componentIndexNew,
                componentIndexNew:              baseComponent.componentIndexNew,

                // Data
                componentNameOld:               baseComponent.componentNameNew,
                componentNameNew:               baseComponent.componentNameNew,
                componentNameRawOld:            baseComponent.componentNameRawNew,
                componentNameRawNew:            baseComponent.componentNameRawNew,
                componentNarrativeOld:          baseComponent.componentNarrativeNew,
                componentNarrativeNew:          baseComponent.componentNarrativeNew,
                componentNarrativeRawOld:       baseComponent.componentNarrativeRawNew,
                componentNarrativeRawNew:       baseComponent.componentNarrativeRawNew,
                componentTextRawOld:            baseComponent.componentTextRawNew,
                componentTextRawNew:            baseComponent.componentTextRawNew,

                // Update State
                isNew:                          false,
                isChanged:                      false,
                isTextChanged:                  false,
                isMoved:                        false,
                isRemoved:                      false,
                isRemovedElsewhere:             false,
                isDevUpdated:                   false,
                isDevAdded:                     false,

                // Editing state (shared and persistent)
                isRemovable:                    true,           // Note all update items are removable when scoped
                isScopable:                     isScopable,
                scopeType:                      scopeType
            });

            // // Set all added components as open by default
            // const openDuItems = store.getState().currentUserOpenDesignUpdateItems;
            // store.dispatch(setCurrentUserOpenDesignUpdateItems(openDuItems, designUpdateComponentId, true));
            // store.dispatch(updateOpenItemsFlag(designUpdateComponentId));

            // Set the correct parent IDs
            this.fixParentIds(designUpdateComponentId);

            // If it is a Scenario set the base design component as queried if DU is set to merge
            // This could get overridden by subsequent actions...
            if(baseComponent.componentType === ComponentType.SCENARIO && scopeType !== UpdateScopeType.SCOPE_PEER_SCOPE) {
                this.updateCurrentDesignVersionWithScopedScenario(designUpdateId, baseComponent);
            }

            return designUpdateComponentId;
        } else {
            return null;
        }
    }


    fixParentIds(componentId){

        const component = DesignUpdateComponents.findOne({_id: componentId});

        // Get the id of the new component that has the parent reference id as its unchanging reference id
        let parentNew = DesignUpdateComponents.findOne({designUpdateId: component.designUpdateId, componentReferenceId: component.componentParentReferenceIdNew});
        let parentOld = DesignUpdateComponents.findOne({designUpdateId: component.designUpdateId, componentReferenceId: component.componentParentReferenceIdOld});

        let parentIdNew = 'NONE';
        let parentIdOld = 'NONE';

        if(parentNew){
            parentIdNew = parentNew._id;
        }

        if(parentOld){
            parentIdOld = parentOld._id;
        }

        // Update
        DesignUpdateComponents.update(
            { _id: component._id},
            {
                $set:{
                    componentParentIdOld: parentIdOld,
                    componentParentIdNew: parentIdNew
                }
            }
        );
    }


    updateToActualScope(designUpdateComponentId){

        const updateComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

        DesignUpdateComponents.update(
            {_id: designUpdateComponentId},
            {
                $set:{
                    scopeType: UpdateScopeType.SCOPE_IN_SCOPE
                }
            }
        );

        // If it was a scenario and in peer scope (could not be in any other type) mark as now queried
        if(updateComponent && updateComponent.componentType === ComponentType.SCENARIO){

            const baseScenario = DesignVersionComponents.findOne({
                designVersionId:        updateComponent.designVersionId,
                componentReferenceId:   updateComponent.componentReferenceId
            });

            this.updateCurrentDesignVersionWithScopedScenario(updateComponent.designUpdateId, baseScenario);
        }

    }

    updateToParentScope(designUpdateComponentId){

        DesignUpdateComponents.update(
            {_id: designUpdateComponentId},
            {
                $set:{
                    scopeType: UpdateScopeType.SCOPE_PARENT_SCOPE
                }
            }
        )
    }

    removeComponentFromUpdateScope(designUpdateComponentId){

        const duComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

        // Check to see if this component has peers in peer scope AND a peer still in scope - if so don't remove it, just revert to peer scope

        // Get the peer components IN the update
        let peers = DesignUpdateComponents.find({
            designUpdateId:                 duComponent.designUpdateId,
            componentType:                  duComponent.componentType,
            componentParentReferenceIdNew:  duComponent.componentParentReferenceIdNew,
            _id:                            {$ne: duComponent._id}
        }).fetch();

        let peerCount = 0;
        let scopeCount = 0;

        peers.forEach((peer) => {

            if(peer.scopeType === UpdateScopeType.SCOPE_PEER_SCOPE){
                peerCount++;
            } else {
                scopeCount++;
            }
        });

        if(peerCount > 0 && scopeCount > 0){
            DesignUpdateComponents.update(
                {_id: designUpdateComponentId},
                {
                    $set:{
                        scopeType: UpdateScopeType.SCOPE_PEER_SCOPE
                    }
                }
            )
        } else {
            DesignUpdateComponents.remove({_id: designUpdateComponentId});
        }

        // If a Scenario...
        if(duComponent.componentType === ComponentType.SCENARIO){

            // Update the Design Version scenario as no longer queried
            this.updateCurrentDesignVersionWithUnscopedScenario(duComponent);

            // And remove from any WP where in scope
            this.removeWorkPackageItems(designUpdateComponentId, duComponent.designVersionId, duComponent.designUpdateId);
        }
    }

    addParentsToScope(childComponent, designUpdateId){

        // Setting this component in scope
        // Set all parents to be in Parent Scope (unless already in scope themselves)

        let parentId = DesignVersionComponents.findOne({_id: childComponent._id}).componentParentIdNew;

        if(parentId !== 'NONE'){

            let parentComponent = DesignVersionComponents.findOne({_id: parentId});

            if(parentComponent) {

                let currentUpdateComponent = DesignUpdateComponents.findOne({
                    designUpdateId: designUpdateId,
                    componentReferenceId: parentComponent.componentReferenceId
                });

                if(!currentUpdateComponent){
                    // No DU Component for the parent so add it to PARENT scope
                    this.insertComponentToUpdateScope(parentComponent, designUpdateId, UpdateScopeType.SCOPE_PARENT_SCOPE);

                    // And carry on up the tree
                    this.addParentsToScope(parentComponent, designUpdateId);

                } else {
                    // If existing component in peer scope convert to parent scope
                    if(currentUpdateComponent.scopeType === UpdateScopeType.SCOPE_PEER_SCOPE){
                        this.updateToParentScope(currentUpdateComponent._id);

                        // And carry on up the tree
                        this.addParentsToScope(parentComponent, designUpdateId);
                    }
                }
            }
        }
    }

    removeChildrenFromScope(parentComponent, designUpdateId){

        let dvChildren = DesignVersionComponents.find({
            designVersionId: parentComponent.designVersionId,
            componentParentIdNew: parentComponent._id
        });

        dvChildren.forEach((child) => {

            let currentUpdateComponent = DesignUpdateComponents.findOne({
                designUpdateId: designUpdateId,
                componentReferenceId: child.componentReferenceId
            });

            if(currentUpdateComponent){
                this.removeComponentFromUpdateScope(currentUpdateComponent._id);
            }

            // And remove any children of this child
            this.removeChildrenFromScope(child, designUpdateId);
        });
    }

    removeChildlessParentsFromScope(childComponent, designUpdateId){

        // Removing this component from scope
        // Remove all parents from scope unless they have other children still in scope

        let parentId = DesignVersionComponents.findOne({_id: childComponent._id}).componentParentIdNew;

        if(parentId !== 'NONE'){

            let parentComponent = DesignVersionComponents.findOne({_id: parentId});

            if(parentComponent) {

                let currentUpdateComponent = DesignUpdateComponents.findOne({
                    designUpdateId: designUpdateId,
                    componentReferenceId: parentComponent.componentReferenceId
                });

                if(currentUpdateComponent){

                    // Only remove components that are not in scope themselves
                    if(!(currentUpdateComponent.scopeType === UpdateScopeType.SCOPE_IN_SCOPE)) {
                        if (this.hasNoChildren(currentUpdateComponent._id)) {

                            // OK to remove the DU component
                            this.removeComponentFromUpdateScope(currentUpdateComponent._id);

                            // And move on up
                            this.removeChildlessParentsFromScope(parentComponent, designUpdateId);
                        }
                    }
                }
            }
        }

    }


    // updateParentScope(designUpdateComponentId, newScope){
    //
    //     if(newScope){
    //         // Setting this component in scope
    //         // Set all parents to be in Parent Scope (unless already in scope themselves)
    //
    //         let parentAddId = DesignUpdateComponents.findOne({_id: designUpdateComponentId}).componentParentIdNew;
    //
    //         let applicationAdd = false;
    //
    //         // Applications at the top level are created with parent id = 'NONE';
    //         while(!applicationAdd){
    //
    //             DesignUpdateComponents.update(
    //                 {_id: parentAddId},
    //                 {
    //                     $set:{
    //                         scopeType: UpdateScopeType.SCOPE_PARENT_SCOPE
    //                     }
    //                 }
    //             );
    //
    //
    //             // If we have just updated an Application its time to stop
    //             applicationAdd = (parentAddId === 'NONE');
    //
    //             // Get next parent if continuing
    //             if(!applicationAdd) {
    //                 parentAddId = DesignUpdateComponents.findOne({_id: parentAddId}).componentParentIdNew;
    //             }
    //         }
    //     } else {
    //         // Setting this component out of scope:
    //
    //         // That does not mean children of it are out of scope...
    //
    //         let descopedItem = DesignUpdateComponents.findOne({_id: designUpdateComponentId});
    //
    //         // Remove all parents from parent scope if they no longer have a child in scope
    //
    //         // Are there any other in scope or parent scope components that have the same parent id as the descoped item.  If so we don't descope the parent
    //         let inScopeChildren = DesignUpdateComponents.find({
    //             componentParentIdNew:   descopedItem.componentParentIdNew,
    //             scopeType:              { $in:[UpdateScopeType.SCOPE_IN_SCOPE, UpdateScopeType.SCOPE_PARENT_SCOPE]}
    //         }).count();
    //
    //         let continueLooking = true;
    //
    //         while(inScopeChildren === 0 && continueLooking){
    //
    //             DesignUpdateComponents.update(
    //                 {_id: descopedItem.componentParentIdNew},
    //                 {
    //                     $set:{
    //                         scopeType: UpdateScopeType.SCOPE_OUT_SCOPE
    //                     }
    //                 }
    //             );
    //
    //             // Stop looking if we have reached the Application level
    //             continueLooking = (descopedItem.componentType !== ComponentType.APPLICATION);
    //
    //             // Get next parent if continuing
    //             if(continueLooking) {
    //                 // Move descoped item up to the parent that has just been descoped
    //                 descopedItem = DesignUpdateComponents.findOne({_id: descopedItem.componentParentIdNew});
    //                 // And see if its parent has any in scope children
    //                 inScopeChildren = DesignUpdateComponents.find({
    //                     componentParentIdNew: descopedItem.componentParentIdNew,
    //                     scopeType: UpdateScopeType.SCOPE_IN_SCOPE
    //                 }).count();
    //             }
    //         }
    //     }
    // };

    hasNoChildren(designUpdateComponentId){
        // Children are those with their parent id = this item and not logically deleted
        return DesignUpdateComponents.find({componentParentIdNew: designUpdateComponentId, isRemoved: false}).count() === 0;
    };

    hasNoInScopeChildrenInOtherUpdates(designUpdateComponentId){

        // We need to check that any instance of this component in other updates has no in scope children
        const thisComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

        // Get all other components that are this component in any other Update for the current Design Version
        const otherInstances = DesignUpdateComponents.find({
            id: {$ne: designUpdateComponentId},
            designVersionId: thisComponent.designVersionId,
            componentReferenceId: thisComponent.componentReferenceId
        });

        let noInScopeChildren = true;

        otherInstances.forEach((instance) => {

            // Want also to reject if the item being removed is itself in scope elsewhere
            if((instance.scopeType === UpdateScopeType.SCOPE_IN_SCOPE) && (instance._id !== designUpdateComponentId)){
                noInScopeChildren = false;
            }

            if(!this.hasNoInScopeChildren(instance._id, false)){
                noInScopeChildren = false;
            }
        });

        return noInScopeChildren;
    }

    hasNoNewChildrenInAnyUpdate(designUpdateComponentId){

        // We need to check that any instance of this component in all updates has no new children
        const thisComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

        // Get all components that are this component in any Update for the current Design Version
        const componentInstances = DesignUpdateComponents.find({designVersionId: thisComponent.designVersionId, componentReferenceId: thisComponent.componentReferenceId});

        let noNewChildren = true;

        componentInstances.forEach((instance) => {

            if(!this.hasNoNewChildren(instance._id, false)){
                noNewChildren = false;
            }
        });

        return noNewChildren;
    };

    hasNoInScopeChildren(designUpdateComponentId, inScopeChild){


        let children = DesignUpdateComponents.find({componentParentIdNew: designUpdateComponentId});

        log((msg) => console.log(msg), LogLevel.TRACE, "Looking for in scope children for component {}", designUpdateComponentId);

        if(children.count() === 0){
            // No more children so no new children
            log((msg) => console.log(msg), LogLevel.TRACE, "No children found");
            return !inScopeChild;
        } else {
            // Are any in scope?
            log((msg) => console.log(msg), LogLevel.TRACE, "{} children found", children.count());

            children.forEach((child) => {
                if(child.scopeType === UpdateScopeType.SCOPE_IN_SCOPE){
                    log((msg) => console.log(msg), LogLevel.TRACE, "In scope child found");
                    inScopeChild = true;
                } else {

                    // Search it for in scope children
                    log((msg) => console.log(msg), LogLevel.TRACE, "Looking for in scope children for component {}", child._id);
                    inScopeChild = !this.hasNoInScopeChildren(child._id, inScopeChild);
                }
            });

            // Return false if in scope child found
            return !inScopeChild;
        }
    };

    hasNoNewChildren(designUpdateComponentId, newChild){

        let children = DesignUpdateComponents.find({componentParentIdNew: designUpdateComponentId});

        log((msg) => console.log(msg), LogLevel.TRACE, "Looking for new children for component {}", designUpdateComponentId);

        if(children.count() === 0){
            // No more children so return what the current findings are
            log((msg) => console.log(msg), LogLevel.TRACE, "No children found");
            return !newChild;
        } else {
            // Are any new?
            log((msg) => console.log(msg), LogLevel.TRACE, "{} children found", children.count());

            children.forEach((child) => {
                if(child.isNew){
                    log((msg) => console.log(msg), LogLevel.TRACE, "New child found");
                    newChild = true;
                } else {

                    // Search it for new children
                    log((msg) => console.log(msg), LogLevel.TRACE, "Looking for new children for component {}", child._id);
                    newChild = !this.hasNoNewChildren(child._id, newChild);
                }
            });

            // Return false if new child found
            return !newChild;
        }
    };

    isNotParentOfNewChildren(designUpdateComponentId){

        let children = DesignUpdateComponents.find({componentParentIdNew: designUpdateComponentId});
        let newChild = false;

        log((msg) => console.log(msg), LogLevel.TRACE, "Looking for new children for component {}", designUpdateComponentId);

        if(children.count() === 0){
            // No children so return true
            log((msg) => console.log(msg), LogLevel.TRACE, "No children found");
            return true
        } else {
            // Are any new?
            log((msg) => console.log(msg), LogLevel.TRACE, "{} children found", children.count());

            children.forEach((child) => {
                if(child.isNew){
                    log((msg) => console.log(msg), LogLevel.TRACE, "New child found");
                    newChild = true;
                }
            });

            // Return false if new child found
            return !newChild;
        }
    }

    hasNoRemovedChildren(designUpdateComponentId, removedChild){

        let children = DesignUpdateComponents.find({componentParentIdNew: designUpdateComponentId});

        log((msg) => console.log(msg), LogLevel.TRACE, "Looking for removed children for component {}", designUpdateComponentId);

        if(children.count() === 0){
            // No more children so return what the current findings are
            log((msg) => console.log(msg), LogLevel.TRACE, "No children found");
            return !removedChild;
        } else {
            // Are any removed?
            log((msg) => console.log(msg), LogLevel.TRACE, "{} children found", children.count());

            children.forEach((child) => {
                if(child.isRemoved){
                    log((msg) => console.log(msg), LogLevel.TRACE, "Removed child found");
                    removedChild = true;
                } else {

                    // Search it for removed children
                    log((msg) => console.log(msg), LogLevel.TRACE, "Looking for removed children for component {}", child._id);
                    removedChild = !this.hasNoRemovedChildren(child._id, removedChild);
                }
            });

            // Return false if removed child found
            return !removedChild;
        }
    };

    // Check to see if parent is not logically deleted
    isDeleted(designUpdateComponentParentId){

        //console.log("checking to see if " + designUpdateComponentParentId + " is removed...");

        // OK if there actually is no parent
        if(designUpdateComponentParentId === 'NONE'){
            return false;
        }

        //console.log("Not top level...")

        // Otherwise OK if parent is not removed
        return parent = DesignUpdateComponents.findOne({_id: designUpdateComponentParentId}).isRemoved;

    };

    // logicallyDeleteChildrenForAllUpdates(designUpdateComponent){
    //
    //     // Get any components that are this component in any Update for the current Design Version
    //     const componentInstances = DesignUpdateComponents.find({designVersionId: designUpdateComponent.designVersionId, componentReferenceId: designUpdateComponent.componentReferenceId});
    //
    //     componentInstances.forEach((instance) => {
    //         this.logicallyDeleteChildren(instance._id, thisComponent.designUpdateId);
    //     });
    //
    // };

    // logicallyRestoreChildrenForAllUpdates(designUpdateComponentId){
    //
    //     const thisComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});
    //
    //     // Get all components that are this component in any Update for the current Design Version
    //     const componentInstances = DesignUpdateComponents.find({
    //         designVersionId:        thisComponent.designVersionId,
    //         componentReferenceId:   thisComponent.componentReferenceId
    //     });
    //
    //     componentInstances.forEach((instance) => {
    //         this.logicallyRestoreChildren(instance._id);
    //     });
    //
    // };

    logicallyDeleteComponent(designUpdateComponentId){

        DesignUpdateComponents.update(
            {_id: designUpdateComponentId},
            {
                $set:{
                    isRemoved: true,
                    scopeType: UpdateScopeType.SCOPE_IN_SCOPE  // Automatically in scope when deleted
                }
            }
        );
    }


    // Recursive function to mark all children down to the bottom of the tree as removed
    logicallyDeleteChildren(designUpdateComponent){

        // Get the children in the Design Version
        let childComponents = DesignVersionComponents.find({
            designVersionId:                designUpdateComponent.designVersionId,
            componentParentReferenceIdNew:  designUpdateComponent.componentReferenceId
        }).fetch();

        let done = false;

        childComponents.forEach((child) => {

            // If not existing in the Design Update, add them
            let childDuComponent = DesignUpdateComponents.findOne({
                designUpdateId: designUpdateComponent.designUpdateId,
                componentId: child._id
            });

            if(!childDuComponent){

                // Add as new in scope item - if not already there.  If it is there it must already be deleted
                const newDesignUpdateComponentId = this.insertComponentToUpdateScope(child, designUpdateComponent.designUpdateId, UpdateScopeType.SCOPE_IN_SCOPE);

                // And mark it as deleted if added
                if(newDesignUpdateComponentId) {
                    this.logicallyDeleteComponent(newDesignUpdateComponentId);

                    // And add a WP component if original component was in WP
                    //this.updateWorkPackagesWithNewUpdateItem(designUpdateComponent.designVersionId, designUpdateComponent.designUpdateId, newDesignUpdateComponentId);

                    childDuComponent = DesignUpdateComponents.findOne({_id: newDesignUpdateComponentId});
                } else {

                    // No further updates needed
                    done = true
                }

            } else {

                // Mark existing component as deleted
                this.logicallyDeleteComponent(childDuComponent._id);
            }

            // Recursively call for these children - if not a Scenario which is the bottom of the tree
            if(child.componentType !== ComponentType.SCENARIO && !done) {

                this.logicallyDeleteChildren(childDuComponent);
            }
        });

    };
}

export default new DesignUpdateComponentModules()
