
// Ultrawide Collections
import { DesignUpdateComponents }   from '../collections/design_update/design_update_components.js';
import { DesignVersionComponents }         from '../collections/design/design_version_components.js';

// Ultrawide Services
import { DesignUpdateComponentValidationErrors } from '../constants/validation_errors.js';

import DesignUpdateComponentValidationServices  from '../service_modules/validation/design_update_component_validation_services.js';
import DesignUpdateComponentModules             from '../service_modules/design_update/design_update_component_service_modules.js';

//======================================================================================================================
//
// Validation API for Design Update Components
//
//======================================================================================================================

class DesignUpdateComponentValidationApi{

    validateAddDesignUpdateComponent(view, mode, parentComponentId, componentType){

        if(parentComponentId) {
            const parentComponent = DesignUpdateComponents.findOne({_id: parentComponentId});
            const parentInOtherUpdates = DesignUpdateComponents.find({
                componentReferenceId:   parentComponent.componentReferenceId,
                designVersionId:        parentComponent.designVersionId,
                designUpdateId:         {$ne: parentComponent.designUpdateId},
            }).fetch();
            return DesignUpdateComponentValidationServices.validateAddDesignUpdateComponent(view, mode, componentType, parentComponent, parentInOtherUpdates);
        } else{
            // Means this is an application being added so no need to check target
            return DesignUpdateComponentValidationServices.validateAddDesignUpdateComponent(view, mode, componentType, null, null);
        }


    };

    validateRemoveDesignUpdateComponent(view, mode, designUpdateComponentId){

        let designUpdateComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

        if(designUpdateComponent.isNew){

            // Added in this Design Update

            // Only removable items (i.e. with no children) can be removed...
            if (designUpdateComponent.isRemovable){
                // Just double check....
                if(DesignUpdateComponentModules.hasNoChildren(designUpdateComponentId)){
                    return DesignUpdateComponentValidationServices.validateRemoveDesignUpdateComponent(view, mode, designUpdateComponent);
                } else {
                    return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_REMOVABLE;
                }
            } else {
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_REMOVABLE;
            }

        } else {

            // Existing Item being logically deleted - we allow this and cascade to all children as long as there are no new items under it here or elsewhere
            if(DesignUpdateComponentModules.hasNoNewChildrenInAnyUpdate(designUpdateComponentId)){

                // Also check that no children have been put in scope in another update
                if(DesignUpdateComponentModules.hasNoInScopeChildrenInOtherUpdates(designUpdateComponentId)) {
                    return DesignUpdateComponentValidationServices.validateRemoveDesignUpdateComponent(view, mode, designUpdateComponent);
                } else {
                    return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_DELETABLE_SCOPE;
                }
            } else {
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_DELETABLE_NEW;
            }
        }


    };

    validateRestoreDesignUpdateComponent(view, mode, designUpdateComponentId){

        let designUpdateComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

        // Cannot restore a component if its parent is removed
        const parentComponent = DesignUpdateComponents.findOne({_id: designUpdateComponent.componentParentIdNew});

        return DesignUpdateComponentValidationServices.validateRestoreDesignUpdateComponent(view, mode, designUpdateComponent, parentComponent);
    }

    validateUpdateDesignUpdateComponentName(view, mode, designUpdateComponentId, newName){

        // Get other components of the same type that should not have the same name
        const thisUpdateComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

        // This is components in any update for the current design version
        const existingUpdateComponents = DesignUpdateComponents.find({
            _id:                {$ne: designUpdateComponentId},
            designVersionId:    thisUpdateComponent.designVersionId,
            componentType:      thisUpdateComponent.componentType
        }).fetch();

        const existingDesignVersionComponents = DesignVersionComponents.find({
            componentReferenceId:   {$ne: thisUpdateComponent.componentReferenceId},
            designVersionId:        thisUpdateComponent.designVersionId,
            componentType:          thisUpdateComponent.componentType
        });

        return DesignUpdateComponentValidationServices.validateUpdateDesignUpdateComponentName(view, mode, thisUpdateComponent, newName, existingUpdateComponents, existingDesignVersionComponents);
    };

    validateUpdateDesignUpdateFeatureNarrative(view, mode, designUpdateComponentId){

        const thisUpdateComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

        return DesignUpdateComponentValidationServices.validateUpdateDesignUpdateFeatureNarrative(view, mode, thisUpdateComponent);
    };

    validateMoveDesignUpdateComponent(view, mode, displayContext, movingComponentId, targetComponentId){

        const movingComponent = DesignUpdateComponents.findOne({_id: movingComponentId});
        const targetComponent = DesignUpdateComponents.findOne({_id: targetComponentId});

        return DesignUpdateComponentValidationServices.validateMoveDesignUpdateComponent(view, mode, displayContext, movingComponent, targetComponent)
    };

    validateReorderDesignUpdateComponent(view, mode, displayContext, movingComponentId, targetComponentId){

        const movingComponent = DesignUpdateComponents.findOne({_id: movingComponentId});
        const targetComponent = DesignUpdateComponents.findOne({_id: targetComponentId});

        return DesignUpdateComponentValidationServices.validateReorderDesignUpdateComponent(view, mode, displayContext, movingComponent, targetComponent)
    };

    validateToggleDesignUpdateComponentScope(view, mode, displayContext, baseComponentId, designUpdateId, updateComponent, newScope){

        const designComponent = DesignVersionComponents.findOne({_id: baseComponentId});

        let hasNoNewChildren = true;

        if(updateComponent && !newScope){
            // Component exists and de-scoping
            hasNoNewChildren = DesignUpdateComponentModules.hasNoNewChildren(updateComponent._id, false);
        }

        // A list of this component in other updates for the same design version.  Used to stop stuff being changed in two parallel updates at once
        const componentInOtherDesignUpdates = DesignUpdateComponents.find({
            componentReferenceId:   designComponent.componentReferenceId,
            designVersionId:        designComponent.designVersionId,
            designUpdateId:         {$ne: designUpdateId},
        }).fetch();

        return DesignUpdateComponentValidationServices.validateToggleDesignUpdateComponentScope(view, mode, displayContext, designComponent, updateComponent, componentInOtherDesignUpdates, hasNoNewChildren, newScope);
    }

}
export default new DesignUpdateComponentValidationApi();
