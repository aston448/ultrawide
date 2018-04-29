
// Ultrawide Services
import { ComponentType, LogLevel, DesignUpdateMergeAction, UpdateScopeType }      from '../../constants/constants.js';
import { DesignUpdateComponentServices }    from '../../servicers/design_update/design_update_component_services.js';
import { DesignUpdateModules }              from '../../service_modules/design_update/design_update_service_modules.js';
import { DesignVersionModules }             from '../../service_modules/design/design_version_service_modules.js';
import { WorkPackageModules }               from '../../service_modules/work/work_package_service_modules.js';

import { log }                          from '../../common/utils.js'

// Data Access
import { DesignComponentData }          from '../../data/design/design_component_db.js';
import { DesignUpdateData }             from '../../data/design_update/design_update_db.js';
import { DesignUpdateComponentData }    from '../../data/design_update/design_update_component_db.js';
import { WorkPackageData }              from '../../data/work/work_package_db.js';
import { DefaultFeatureAspectData }     from '../../data/design/default_feature_aspect_db.js';

//======================================================================================================================
//
// Server Modules for Design Update Components.
//
// Methods called from within main API methods
//
//======================================================================================================================

class DesignUpdateComponentModulesClass{

    addDefaultFeatureAspects(designId, designVersionId, designUpdateId, featureId, defaultRawText, view){

        const defaultAspects = DefaultFeatureAspectData.getIncludedDefaultAspectsForDesign(designId);

        defaultAspects.forEach((defaultAspect) => {

            DesignUpdateComponentServices.addNewComponent(
                designVersionId,
                designUpdateId,
                'NONE',
                featureId,
                ComponentType.FEATURE_ASPECT,
                0,
                defaultAspect.defaultAspectName,
                defaultAspect.defaultAspectNameRaw,
                defaultRawText,
                true,
                view,
                false,
                true
            );

        });
    }

    updateCurrentDesignVersionWithScopedScenario(designUpdateId, scenario){

        const designUpdate = DesignUpdateData.getDesignUpdateById(designUpdateId);

        // Add this item to the working design if we are merging this update
        if(designUpdate.updateMergeAction === DesignUpdateMergeAction.MERGE_INCLUDE){

            DesignVersionModules.setDesignVersionScenarioAsQueried(scenario);
        }
    }

    updateCurrentDesignVersionWithUnscopedScenario(duScenario){

        const designUpdate = DesignUpdateData.getDesignUpdateById(duScenario.designUpdateId);

        const baseScenario = DesignComponentData.getDesignComponentByRef(designUpdate.designVersionId, duScenario.componentReferenceId);

        // Add this item to the working design if we are merging this update
        if(designUpdate.updateMergeAction === DesignUpdateMergeAction.MERGE_INCLUDE){

            DesignVersionModules.setDesignVersionScenarioAsBase(baseScenario);
        }
    }

    updateCurrentDesignVersionWithNewUpdateItem(designUpdateId, newUpdateComponentId){

        const designUpdate = DesignUpdateData.getDesignUpdateById(designUpdateId);

        // Add this item to the working design if we are merging this update
        if(designUpdate.updateMergeAction === DesignUpdateMergeAction.MERGE_INCLUDE){

            const updateComponent = DesignUpdateComponentData.getUpdateComponentById(newUpdateComponentId);

            DesignVersionModules.addUpdateItemToDesignVersion(updateComponent);
        }
    }

    updateWorkPackageLocation(designUpdateComponentId, reorder){

        const component = DesignUpdateComponentData.getUpdateComponentById(designUpdateComponentId);

        // See if any update WPs affected by this update
        const workPackages = WorkPackageData.getActiveWorkPackagesForDesignUpdate(component.designVersionId, component.designUpdateId);

        if(workPackages.length > 0) {

            const componentParent = DesignUpdateComponentData.getUpdateComponentByRef(component.designVersionId, component.designUpdateId, component.componentParentReferenceIdNew);

            workPackages.forEach((wp) => {

                WorkPackageModules.updateDesignComponentLocationInWorkPackage(reorder, wp, component, componentParent);

            });
        }
    };

    updateCurrentDesignVersionWithNewLocation(movingComponentId){

        // Pass in the ID and get the component again AFTER the change...

        const designUpdateComponent = DesignUpdateComponentData.getUpdateComponentById(movingComponentId);
        const designUpdate = DesignUpdateData.getDesignUpdateById(designUpdateComponent.designUpdateId);

        // Add this item to the working design if we are merging this update
        if(designUpdate.updateMergeAction === DesignUpdateMergeAction.MERGE_INCLUDE){

            DesignVersionModules.moveUpdateItemInDesignVersion(designUpdateComponent);
        }
    }

    removeWorkPackageItems(designUpdateComponentRef, designVersionId, designUpdateId){

        // See if any update WPs affected by this update
        const workPackages = WorkPackageData.getActiveWorkPackagesForDesignUpdate(designVersionId, designUpdateId);

        workPackages.forEach((wp) => {

            WorkPackageModules.removeDesignComponentFromWorkPackage(wp, designUpdateComponentRef);

        });
    };

    updateCurrentDesignVersionWithRemoval(removedComponent){

        // With this action we can pass in the actual component as we act BEFORE it is removed.
        const designUpdate = DesignUpdateData.getDesignUpdateById(removedComponent.designUpdateId);

        // Remove from working design if we are merging this update
        if(designUpdate.updateMergeAction === DesignUpdateMergeAction.MERGE_INCLUDE){

            DesignVersionModules.removeUpdateItemInDesignVersion(removedComponent)
        }
    }

    updateCurrentDesignVersionWithRestore(restoredComponent){

        const designUpdate = DesignUpdateData.getDesignUpdateById(restoredComponent.designUpdateId);

        // Restore to the working design if we are merging this update
        if(designUpdate.updateMergeAction === DesignUpdateMergeAction.MERGE_INCLUDE){

            DesignVersionModules.restoreUpdateItemInDesignVersion(restoredComponent)
        }
    }

    updateCurrentDesignVersionComponentName(updatedComponentId){

        const designUpdateComponent = DesignUpdateComponentData.getUpdateComponentById(updatedComponentId);
        const designUpdate = DesignUpdateData.getDesignUpdateById(designUpdateComponent.designUpdateId);

        // Update the working design if we are merging this update
        if(designUpdate.updateMergeAction === DesignUpdateMergeAction.MERGE_INCLUDE){

            DesignVersionModules.updateItemNameInDesignVersion(designUpdateComponent)
        }
    }

    updateCurrentDesignVersionComponentDetails(updatedComponentId){

        const designUpdateComponent = DesignUpdateComponentData.getUpdateComponentById(updatedComponentId);
        const designUpdate = DesignUpdateData.getDesignUpdateById(designUpdateComponent.designUpdateId);

        // Update the working design if we are merging this update
        if(designUpdate.updateMergeAction === DesignUpdateMergeAction.MERGE_INCLUDE){

            DesignVersionModules.updateItemDetailsInDesignVersion(designUpdateComponent)
        }
    }

    setIndex(componentId, componentType){

        // Get the max index of OTHER components of this type under the same parent in the working version
        // List of Peers has to be a combination of EXISTING and NEW peers
        let existingPeerComponents = [];
        let newPeerComponents = [];

        const updateComponent = DesignUpdateComponentData.getUpdateComponentById(componentId);

        // Get all peers in the base design that are not marked as "added"
        existingPeerComponents = DesignComponentData.getBasePeerComponents(updateComponent.designVersionId, updateComponent.componentReferenceId, componentType, updateComponent.componentParentReferenceIdNew);

        // Get peers in the design update that are new items
        newPeerComponents = DesignUpdateComponentData.getNewPeerComponents(updateComponent.designUpdateId, updateComponent.componentReferenceId, componentType, updateComponent.componentParentReferenceIdNew);


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

            DesignUpdateComponentData.setIndex(componentId, newIndex, newIndex);
        }
    };

    addComponentPeers(designVersionId, designUpdateId, parentRefId, componentType, newUpdateComponentId){

        // Get the peer components
        const peers = DesignComponentData.getPeerComponents(designVersionId, newUpdateComponentId, componentType, parentRefId);

        peers.forEach((peer) => {

            // This call only inserts stuff not already in the update so won't insert others that happen to be in scope
            this.insertComponentToUpdateScope(peer, designUpdateId, UpdateScopeType.SCOPE_PEER_SCOPE)  // Insert as in peer scope
        });
    }

    removeUnwantedPeers(removedComponent){

        const parent = DesignUpdateComponentData.getUpdateComponentByRef(removedComponent.designVersionId, removedComponent.designUpdateId, removedComponent.componentParentReferenceIdNew);

        // Might be an Application with no parent
        let duParentRefId = 'NONE';

        if(parent){
            duParentRefId = parent.componentReferenceId;
        }

        // If there are no longer any New components under the parent, set any peer scope items out of scope
        const peers = DesignUpdateComponentData.getPeerComponents(removedComponent.designUpdateId, removedComponent.componentReferenceId, removedComponent.componentType, duParentRefId);

        let newComponents = false;

        peers.forEach((peer) => {
            if(peer.isNew){
                newComponents = true;
            }
        });

        if(!newComponents){
            // Set all peer scope peers out of scope (i.e. remove them)
            DesignUpdateComponentData.removePeerComponents(removedComponent.designUpdateId, removedComponent.componentType, duParentRefId);
        }
    }

    insertComponentToUpdateScope(baseComponent, designUpdateId, scopeType){

        // Only insert if not already existing
        const updateComponent = DesignUpdateComponentData.getUpdateComponentByRef(baseComponent.designVersionId, designUpdateId, baseComponent.componentReferenceId);

        if(!updateComponent){

            const isScopable = DesignUpdateModules.isScopable(baseComponent.componentType);

            const designUpdateComponentId = DesignUpdateComponentData.insertNewUpdateComponentFromBase(designUpdateId, baseComponent, isScopable, scopeType);

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


    // fixParentIds(componentId){
    //
    //     const component = DesignUpdateComponents.findOne({_id: componentId});
    //
    //     // Get the id of the new component that has the parent reference id as its unchanging reference id
    //     let parentNew = DesignUpdateComponents.findOne({designUpdateId: component.designUpdateId, componentReferenceId: component.componentParentReferenceIdNew});
    //     let parentOld = DesignUpdateComponents.findOne({designUpdateId: component.designUpdateId, componentReferenceId: component.componentParentReferenceIdOld});
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
    //     DesignUpdateComponents.update(
    //         { _id: component._id},
    //         {
    //             $set:{
    //                 componentParentIdOld: parentIdOld,
    //                 componentParentIdNew: parentIdNew
    //             }
    //         }
    //     );
    // }


    updateToActualScope(designUpdateComponentId){

        const updateComponent = DesignUpdateComponentData.getUpdateComponentById(designUpdateComponentId);

        DesignUpdateComponentData.setScope(designUpdateComponentId, UpdateScopeType.SCOPE_IN_SCOPE);

        // If it was a scenario and in peer scope (could not be in any other type) mark as now queried
        if(updateComponent && updateComponent.componentType === ComponentType.SCENARIO){

            const baseScenario = DesignComponentData.getDesignComponentByRef(updateComponent.designVersionId, updateComponent.componentReferenceId);

            this.updateCurrentDesignVersionWithScopedScenario(updateComponent.designUpdateId, baseScenario);
        }

    }

    updateToParentScope(designUpdateComponentId){

        DesignUpdateComponentData.setScope(designUpdateComponentId, UpdateScopeType.SCOPE_PARENT_SCOPE);
    }

    removeComponentFromUpdateScope(designUpdateComponentId){

        const duComponent = DesignUpdateComponentData.getUpdateComponentById(designUpdateComponentId);

        // Check to see if this component has peers in peer scope AND a peer still in scope - if so don't remove it, just revert to peer scope

        // Get the peer components IN the update
        let peers = DesignUpdateComponentData.getPeerComponents(duComponent.designUpdateId, duComponent.componentReferenceId, duComponent.componentType, duComponent.componentParentReferenceIdNew);

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

            DesignUpdateComponentData.setScope(designUpdateComponentId, UpdateScopeType.SCOPE_PEER_SCOPE);

        } else {

            DesignUpdateComponentData.removeComponent(designUpdateComponentId);

        }

        // If a Scenario...
        if(duComponent.componentType === ComponentType.SCENARIO){

            // Update the Design Version scenario as no longer queried
            this.updateCurrentDesignVersionWithUnscopedScenario(duComponent);

            // And remove from any WP where in scope
            this.removeWorkPackageItems(duComponent.componentReferenceId, duComponent.designVersionId, duComponent.designUpdateId);
        }
    }

    addParentsToScope(childComponent, designUpdateId){

        // Setting this component in scope
        // Set all parents to be in Parent Scope (unless already in scope themselves)

        if(childComponent.componentParentReferenceIdNew !== 'NONE'){

            let parentComponent = DesignComponentData.getDesignComponentByRef(childComponent.designVersionId, childComponent.componentParentReferenceIdNew);

            if(parentComponent) {

                let currentUpdateComponent = DesignUpdateComponentData.getUpdateComponentByRef(childComponent.designVersionId, designUpdateId, parentComponent.componentReferenceId);

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

        let dvChildren = DesignComponentData.getChildComponents(parentComponent.designVersionId, parentComponent.componentReferenceId);

        dvChildren.forEach((child) => {

            let currentUpdateComponent = DesignUpdateComponentData.getUpdateComponentByRef(parentComponent.designVersionId, designUpdateId, child.componentReferenceId);

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

        if(childComponent.componentParentReferenceIdNew !== 'NONE'){

            let parentComponent = DesignComponentData.getDesignComponentByRef(childComponent.designVersionId, childComponent.componentParentReferenceIdNew);

            if(parentComponent) {

                let currentUpdateComponent = DesignUpdateComponentData.getUpdateComponentByRef(childComponent.designVersionId, designUpdateId, parentComponent.componentReferenceId);

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

    hasNoChildren(designUpdateComponentId){

        let duComponent = DesignUpdateComponentData.getUpdateComponentById(designUpdateComponentId);

        // If the component does not exist because it has been removed then it must have had no children
        if(duComponent) {
            return DesignUpdateComponentData.hasNoChildren(duComponent.designUpdateId, duComponent.componentReferenceId);
        } else {
            return true;
        }
    }

    hasNoNonRemovedChildren(designUpdateComponentId){
        // For use when could be logically removed if all children are removed
        let duComponent = DesignUpdateComponentData.getUpdateComponentById(designUpdateComponentId);

        // If the component does not exist because it has been removed then it must have had no children
        if(duComponent) {
            return DesignUpdateComponentData.hasNoNonRemovedChildren(duComponent.designUpdateId, duComponent.componentReferenceId);
        } else {
            return true;
        }
    };

    hasNoInScopeChildrenInOtherUpdates(designUpdateComponentId){

        // We need to check that any instance of this component in other updates has no in scope children
        const thisComponent = DesignUpdateComponentData.getUpdateComponentById(designUpdateComponentId);

        // Get all other components that are this component in any other Update for the current Design Version
        const otherInstances = DesignUpdateComponentData.getOtherDuComponentInstancesInDv(thisComponent.designVersionId, thisComponent.componentReferenceId, designUpdateComponentId);

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
        const thisComponent = DesignUpdateComponentData.getUpdateComponentById(designUpdateComponentId);

        // Get all components that are this component in any Update for the current Design Version
        const componentInstances = DesignUpdateComponentData.getAllDuComponentInstancesInDv(thisComponent.designVersionId, thisComponent.componentReferenceId);

        let noNewChildren = true;

        componentInstances.forEach((instance) => {

            if(!this.hasNoNewChildren(instance._id, false)){
                noNewChildren = false;
            }
        });

        return noNewChildren;
    };

    hasNoInScopeChildren(designUpdateComponentId, inScopeChild){

        const duComponent = DesignUpdateComponentData.getUpdateComponentById(designUpdateComponentId);
        const children = DesignUpdateComponentData.getScopedChildComponents(duComponent.designVersionId, duComponent.designUpdateId, duComponent.componentReferenceId);

        log((msg) => console.log(msg), LogLevel.TRACE, "Looking for in scope children for component {}", designUpdateComponentId);

        if(children.length === 0){
            // No more children so no new children
            log((msg) => console.log(msg), LogLevel.TRACE, "No children found");
            return !inScopeChild;
        } else {
            // Are any in scope?
            log((msg) => console.log(msg), LogLevel.TRACE, "{} children found", children.length);

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

        const duComponent = DesignUpdateComponentData.getUpdateComponentById(designUpdateComponentId);
        const children = DesignUpdateComponentData.getScopedChildComponents(duComponent.designVersionId, duComponent.designUpdateId, duComponent.componentReferenceId);

        log((msg) => console.log(msg), LogLevel.TRACE, "Looking for new children for component {}", designUpdateComponentId);

        if(children.length === 0){
            // No more children so return what the current findings are
            log((msg) => console.log(msg), LogLevel.TRACE, "No children found");
            return !newChild;
        } else {
            // Are any new?
            log((msg) => console.log(msg), LogLevel.TRACE, "{} children found", children.length);

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

        log((msg) => console.log(msg), LogLevel.PERF, "Looking for new children for component {}", designUpdateComponentId);

        const duComponent = DesignUpdateComponentData.getUpdateComponentById(designUpdateComponentId);

        if(duComponent) {
            const children = DesignUpdateComponentData.getScopedChildComponents(duComponent.designVersionId, duComponent.designUpdateId, duComponent.componentReferenceId);
            let newChild = false;

            if (children.length === 0) {
                // No children so return true
                log((msg) => console.log(msg), LogLevel.TRACE, "No children found");
                return true
            } else {
                // Are any new?
                log((msg) => console.log(msg), LogLevel.TRACE, "{} children found", children.length);

                children.forEach((child) => {
                    if (child.isNew) {
                        log((msg) => console.log(msg), LogLevel.TRACE, "New child found");
                        newChild = true;
                    }
                });

                // Return false if new child found
                return !newChild;
            }
        } else {
            return true;
        }
    }

    hasNoRemovedChildren(designUpdateComponentId, removedChild){

        log((msg) => console.log(msg), LogLevel.DEBUG, "Looking for removed children for component {}", designUpdateComponentId);

        const duComponent = DesignUpdateComponentData.getUpdateComponentById(designUpdateComponentId);
        const children = DesignUpdateComponentData.getScopedChildComponents(duComponent.designVersionId, duComponent.designUpdateId, duComponent.componentReferenceId);

        if(children.length === 0){
            // No more children so return what the current findings are
            log((msg) => console.log(msg), LogLevel.TRACE, "No children found");
            return !removedChild;
        } else {
            // Are any removed?
            log((msg) => console.log(msg), LogLevel.TRACE, "{} children found", children.length);

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
    // isDeleted(designUpdateComponentParentId){
    //
    //     //console.log("checking to see if " + designUpdateComponentParentId + " is removed...");
    //
    //     // OK if there actually is no parent
    //     if(designUpdateComponentParentId === 'NONE'){
    //         return false;
    //     }
    //
    //     //console.log("Not top level...")
    //
    //     // Otherwise OK if parent is not removed
    //     return parent = DesignUpdateComponents.findOne({_id: designUpdateComponentParentId}).isRemoved;
    //
    // };

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

        DesignUpdateComponentData.setLogicallyDeleted(designUpdateComponentId);
    }


    // Recursive function to mark all children down to the bottom of the tree as removed
    logicallyDeleteChildren(designUpdateComponent){

        // Get the children in the Design Version
        const childComponents = DesignComponentData.getChildComponents(designUpdateComponent.designVersionId, designUpdateComponent.componentReferenceId);

        let done = false;

        childComponents.forEach((child) => {

            // If not existing in the Design Update, add them
            let childDuComponent = DesignUpdateComponentData.getUpdateComponentByRef(designUpdateComponent.designVersionId, designUpdateComponent.designUpdateId, child.componentReferenceId);

            if(!childDuComponent){

                // Add as new in scope item - if not already there.  If it is there it must already be deleted
                const newDesignUpdateComponentId = this.insertComponentToUpdateScope(child, designUpdateComponent.designUpdateId, UpdateScopeType.SCOPE_IN_SCOPE);

                // And mark it as deleted if added
                if(newDesignUpdateComponentId) {
                    this.logicallyDeleteComponent(newDesignUpdateComponentId);

                    childDuComponent = DesignUpdateComponentData.getUpdateComponentById(newDesignUpdateComponentId);
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

export const DesignUpdateComponentModules = new DesignUpdateComponentModulesClass();
