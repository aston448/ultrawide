
// Ultrawide Collections
import { DesignUpdateComponents } from '../collections/design_update/design_update_components.js';

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

    validateAddDesignUpdateComponent(view, mode, parentComponentId){

        if(parentComponentId) {
            const parentComponent = DesignUpdateComponents.findOne({_id: parentComponentId});
            const parentInOtherUpdates = DesignUpdateComponents.find({
                componentReferenceId:   parentComponent.componentReferenceId,
                designVersionId:        parentComponent.designVersionId,
                designUpdateId:         {$ne: parentComponent.designUpdateId},
            }).fetch();
            return DesignUpdateComponentValidationServices.validateAddDesignUpdateComponent(view, mode, parentComponent, parentInOtherUpdates);
        } else{
            // Means this is an application being added so no need to check target
            return DesignUpdateComponentValidationServices.validateAddDesignUpdateComponent(view, mode, null, null);
        }


    };

    validateRemoveDesignUpdateComponent(view, mode, designUpdateComponentId){

        // TODO - allow more drastic logical deleting?

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

        const existingUpdateComponents = DesignUpdateComponents.find({
            _id:                {$ne: designUpdateComponentId},
            designVersionId:    thisUpdateComponent.designVersionId,
            designUpdateId:     thisUpdateComponent.designUpdateId,
            componentType:      thisUpdateComponent.componentType
        }).fetch();

        return DesignUpdateComponentValidationServices.validateUpdateDesignUpdateComponentName(view, mode, thisUpdateComponent.componentType, newName, existingUpdateComponents, thisUpdateComponent.componentParentIdNew);
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

    validateToggleDesignUpdateComponentScope(view, mode, displayContext, designUpdateComponentId, newScope){

        const designUpdateComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

        const hasNoNewChildren = DesignUpdateComponentModules.hasNoNewChildren(designUpdateComponentId, false);

        // A list of this component in other updates for the same design version.  Used to stop a Scenario being changed in two parallel updates at once
        const componentInOtherDesignUpdates = DesignUpdateComponents.find({
            componentReferenceId:   designUpdateComponent.componentReferenceId,
            designVersionId:        designUpdateComponent.designVersionId,
            designUpdateId:         {$ne: designUpdateComponent.designUpdateId},
        }).fetch();

        return DesignUpdateComponentValidationServices.validateToggleDesignUpdateComponentScope(view, mode, displayContext, designUpdateComponent, componentInOtherDesignUpdates, hasNoNewChildren, newScope);
    }

}
export default new DesignUpdateComponentValidationApi();
