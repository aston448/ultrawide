
// Ultrawide Collections
import { DesignUpdateComponents }   from '../../collections/design_update/design_update_components.js';
import { WorkPackages }             from '../../collections/work/work_packages.js';
import { WorkPackageComponents }    from '../../collections/work/work_package_components.js';

// Ultrawide Services
import { ComponentType, LogLevel, WorkPackageStatus, WorkPackageType }      from '../../constants/constants.js';
import DesignUpdateComponentServices    from '../../servicers/design_update/design_update_component_services.js';
import DesignComponentModules           from '../../service_modules/design/design_component_service_modules.js';
import { log }                          from '../../common/utils.js'
//======================================================================================================================
//
// Server Modules for Design Update Components.
//
// Methods called from within main API methods
//
//======================================================================================================================

class DesignUpdateComponentModules{

    addDefaultFeatureAspects(designVersionId, designUpdateId, featureId, defaultRawText){
        DesignUpdateComponentServices.addNewComponent(designVersionId, designUpdateId, featureId, ComponentType.FEATURE_ASPECT, 0, 'Interface', DesignComponentModules.getRawTextFor('Interface'), defaultRawText, false);
        DesignUpdateComponentServices.addNewComponent(designVersionId, designUpdateId, featureId, ComponentType.FEATURE_ASPECT, 0, 'Actions', DesignComponentModules.getRawTextFor('Actions'), defaultRawText, false);
        DesignUpdateComponentServices.addNewComponent(designVersionId, designUpdateId, featureId, ComponentType.FEATURE_ASPECT, 0, 'Conditions', DesignComponentModules.getRawTextFor('Conditions'), defaultRawText, false);
        DesignUpdateComponentServices.addNewComponent(designVersionId, designUpdateId, featureId, ComponentType.FEATURE_ASPECT, 0, 'Consequences', DesignComponentModules.getRawTextFor('Consequences'), defaultRawText, false);
    }

    updateWorkPackages(designVersionId, designUpdateId, newUpdateComponentId){

        // See if any update WPs affected by this update
        const workPackages = WorkPackages.find({
            designVersionId:    designVersionId,
            designUpdateId:     designUpdateId,
            workPackageStatus:  {$ne: WorkPackageStatus.WP_COMPLETE},
            workPackageType:    WorkPackageType.WP_UPDATE
        }).fetch();

        const component = DesignUpdateComponents.findOne({_id: newUpdateComponentId});

        workPackages.forEach((wp) => {

            const wpComponentId = WorkPackageComponents.insert(
                {
                    designVersionId:                designVersionId,
                    workPackageId:                  wp._id,
                    workPackageType:                wp.workPackageType,
                    componentId:                    component._id,
                    componentReferenceId:           component.componentReferenceId,
                    componentType:                  component.componentType,
                    componentParentReferenceId:     component.componentParentReferenceIdNew,
                    componentFeatureReferenceId:    component.componentFeatureReferenceIdNew,
                    componentLevel:                 component.componentLevel,
                    componentIndex:                 component.componentIndexNew,
                    componentParent:                false,
                    componentActive:                false       // Start by assuming nothing in scope
                }
            );

            // If the added item is a Scenario or a Feature Aspect and its parent is already in scope for this WP then put it in scope for the WP
            if(component.componentType === ComponentType.SCENARIO || component.componentType === ComponentType.FEATURE_ASPECT){

                // Get the Design parent
                const parent = DesignUpdateComponents.findOne({_id: component.componentParentIdNew});

                // Get the parent in the WP
                const wpParent = WorkPackageComponents.findOne({workPackageId: wp._id, componentReferenceId: parent.componentReferenceId});

                // Update if active in this WP - Scenarios if sibling Scenarios are active.
                if(component.componentType === ComponentType.SCENARIO && (wpParent.componentActive || wpParent.componentParent)){
                    WorkPackageComponents.update(
                        {_id: wpComponentId},
                        {
                            $set:{componentActive: true}
                        }
                    );
                }

                // Feature Aspects if Feature is active
                if(component.componentType === ComponentType.FEATURE_ASPECT && wpParent.componentActive){
                    WorkPackageComponents.update(
                        {_id: wpComponentId},
                        {
                            $set:{componentActive: true}
                        }
                    );
                }
            }
        });
    };

    updateWorkPackageLocation(designUpdateComponentId, reorder){

        const component = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

        // See if any update WPs affected by this update
        const workPackages = WorkPackages.find({
            designVersionId:    component.designVersionId,
            designUpdateId:     component.designUpdateId,
            workPackageStatus:  {$ne: WorkPackageStatus.WP_COMPLETE},
            workPackageType:    WorkPackageType.WP_UPDATE
        }).fetch();

        //console.log("Update WP Location WPs to update: " + workPackages.length);

        workPackages.forEach((wp) => {
            if(reorder){
                // Just a reordering job so can keep the WP scope as it is
                WorkPackageComponents.update(
                    {
                        workPackageId:                  wp._id,
                        workPackageType:                wp.workPackageType,
                        componentId:                    designUpdateComponentId
                    },
                    {
                        $set:{
                            componentParentReferenceId:     component.componentParentReferenceIdNew,
                            componentFeatureReferenceId:    component.componentFeatureReferenceIdNew,
                            componentLevel:                 component.componentLevel,
                            componentIndex:                 component.componentIndexNew,
                        }
                    },
                    {multi: true}
                );
            } else {
                // Moved to a new section so will have to descope from WP
                WorkPackageComponents.update(
                    {
                        workPackageId:                  wp._id,
                        workPackageType:                wp.workPackageType,
                        componentId:                    designUpdateComponentId
                    },
                    {
                        $set:{
                            componentParentReferenceId:     component.componentParentReferenceIdNew,
                            componentFeatureReferenceId:    component.componentFeatureReferenceIdNew,
                            componentLevel:                 component.componentLevel,
                            componentIndex:                 component.componentIndexNew,
                            componentParent:                false,      // Reset WP status
                            componentActive:                false
                        }
                    },
                    {multi: true}
                );
            }
        });
    };

    removeWorkPackageItems(designUpdateComponentId, designVersionId, designUpdateId){

        // See if any update WPs affected by this update
        const workPackages = WorkPackages.find({
            designVersionId:    designVersionId,
            designUpdateId:     designUpdateId,
            workPackageStatus:  {$ne: WorkPackageStatus.WP_COMPLETE},
            workPackageType:    WorkPackageType.WP_UPDATE
        }).fetch();

        workPackages.forEach((wp) => {
            WorkPackageComponents.remove(
                {
                    workPackageId:                  wp._id,
                    workPackageType:                wp.workPackageType,
                    componentId:                    designUpdateComponentId
                }
            );
        });

    };

    setIndex(componentId, componentType, parentId){

        // Get the max index of OTHER components of this type under the same parent
        const peerComponents = DesignUpdateComponents.find({_id: {$ne: componentId}, componentType: componentType, componentParentIdNew: parentId}, {sort:{componentIndexNew: -1}});

        // If no components then leave as default of 100
        if(peerComponents.count() > 0){
            //console.log("Highest peer is " + peerComponents.fetch()[0].componentNameOld);

            let newIndex = peerComponents.fetch()[0].componentIndexOld + 100;

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

    updateParentScope(designUpdateComponentId, newScope){

        if(newScope){
            // Setting this component in scope
            // Set all parents to be in Parent Scope (unless already in scope themselves)

            let parentAddId = DesignUpdateComponents.findOne({_id: designUpdateComponentId}).componentParentIdNew;

            let applicationAdd = false;

            // Applications at the top level are created with parent id = 'NONE';
            while(!applicationAdd){

                DesignUpdateComponents.update(
                    {_id: parentAddId, isInScope: false},
                    {
                        $set:{
                            isParentScope: true
                        }
                    }
                );


                // If we have just updated an Application its time to stop
                applicationAdd = (parentAddId === 'NONE');

                // Get next parent if continuing
                if(!applicationAdd) {
                    parentAddId = DesignUpdateComponents.findOne({_id: parentAddId}).componentParentIdNew;
                }
            }
        } else {
            // Setting this component out of scope:

            // That does not mean children of it are out of scope...

            let descopedItem = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

            // Remove all parents from parent scope if they no longer have a child in scope

            // Are there any other in scope or parent scope components that have the same parent id as the descoped item.  If so we don't descope the parent
            let inScopeChildren = DesignUpdateComponents.find({componentParentIdNew: descopedItem.componentParentIdNew, $or:[{isInScope: true}, {isParentScope: true}]}).count();
            let continueLooking = true;

            while(inScopeChildren == 0 && continueLooking){

                DesignUpdateComponents.update(
                    {_id: descopedItem.componentParentIdNew},
                    {
                        $set:{
                            isParentScope: false
                        }
                    }
                );

                // Stop looking if we have reached the Application level
                continueLooking = (descopedItem.componentType != ComponentType.APPLICATION);

                // Get next parent if continuing
                if(continueLooking) {
                    // Move descoped item up to the parent that has just been descoped
                    descopedItem = DesignUpdateComponents.findOne({_id: descopedItem.componentParentIdNew});
                    // And see if its parent has any in scope children
                    inScopeChildren = DesignUpdateComponents.find({componentParentIdNew: descopedItem.componentParentIdNew, isInScope: true}).count();
                }
            }
        }
    };

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
            if(instance.isInScope && instance._id != designUpdateComponentId){
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
                if(child.isInScope){
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

    logicallyDeleteChildrenForAllUpdates(designUpdateComponentId){

        const thisComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

        // Get all components that are this component in any Update for the current Design Version
        const componentInstances = DesignUpdateComponents.find({designVersionId: thisComponent.designVersionId, componentReferenceId: thisComponent.componentReferenceId});

        componentInstances.forEach((instance) => {
            this.logicallyDeleteChildren(instance._id, thisComponent.designUpdateId);
        });

    };

    logicallyRestoreChildrenForAllUpdates(designUpdateComponentId){

        const thisComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

        // Get all components that are this component in any Update for the current Design Version
        const componentInstances = DesignUpdateComponents.find({designVersionId: thisComponent.designVersionId, componentReferenceId: thisComponent.componentReferenceId});

        componentInstances.forEach((instance) => {
            this.logicallyRestoreChildren(instance._id);
        });

    };

    // Recursive function to mark all children down to the bottom of the tree as removed
    logicallyDeleteChildren(designUpdateComponentId, masterDesignUpdateId){

        let childComponents = DesignUpdateComponents.find({componentParentIdNew: designUpdateComponentId});

        if(childComponents.count() > 0){
            let inScope = false;
            let parentScope = false;

            childComponents.forEach((child) => {

                // The scope is updated if you are the Update actually doing the delete
                if(child.designUpdateId === masterDesignUpdateId) {
                    switch (child.componentType) {
                        case ComponentType.FEATURE:
                        case ComponentType.FEATURE_ASPECT:
                        case ComponentType.SCENARIO:
                            inScope = true;
                            parentScope = true;
                            break;
                        default:
                            inScope = false;
                            parentScope = true;
                            break;
                    }
                }

                DesignUpdateComponents.update(
                    {_id: child._id},
                    {
                        $set:{
                            isRemoved: true,
                            isInScope: inScope,     // Any Feature, Feature Aspect, Scenario removed is automatically in scope
                            isParentScope: parentScope
                        }
                    }
                );

                // Recursively call for these children - if not a Scenario which is the bottom of the tree
                if(child.componentType != ComponentType.SCENARIO) {
                    this.logicallyDeleteChildren(child._id, masterDesignUpdateId)
                }

            });

            return true;

        } else {
            return false;
        }
    };

    // Recursive function to mark all children down to the bottom of the tree as not removed
    logicallyRestoreChildren(designUpdateComponentId){

        let childComponents = DesignUpdateComponents.find({componentParentIdNew: designUpdateComponentId});

        if(childComponents.count() > 0){
            childComponents.forEach((child) => {

                DesignUpdateComponents.update(
                    {_id: child._id},
                    {
                        $set:{
                            isRemoved: false,
                            isInScope: false,
                            isParentScope: false
                        }
                    }
                );

                // Recursively call for these children - if not a Scenario which is the bottom of the tree
                if(child.componentType != ComponentType.SCENARIO) {
                    this.logicallyRestoreChildren(child._id)
                }

            });

            return true;

        } else {
            return false;
        }
    };
}

export default new DesignUpdateComponentModules()
