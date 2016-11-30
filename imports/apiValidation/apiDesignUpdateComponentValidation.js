
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

    validateAddDesignUpdateComponent(view, mode){

        return DesignUpdateComponentValidationServices.validateAddDesignUpdateComponent(view, mode)
    };

    validateRemoveDesignUpdateComponent(view, mode, designUpdateComponentId){

        // TODO - allow more drastic logical deleting?

        let designUpdateComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

        if (designUpdateComponent.isRemovable){
            // Just double check....
            if(DesignUpdateComponentModules.hasNoChildren(designUpdateComponentId)){
                return DesignUpdateComponentValidationServices.validateRemoveDesignUpdateComponent(view, mode, designUpdateComponent);
            } else {
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_REMOVABLE;
            }
        }
    };

    validateRestoreDesignUpdateComponent(view, mode, designUpdateComponentId){

        let designUpdateComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

        return DesignUpdateComponentValidationServices.validateRestoreDesignUpdateComponent(view, mode, designUpdateComponent);
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

        return DesignUpdateComponentValidationServices.validateUpdateDesignUpdateComponentName(view, mode, thisUpdateComponent.componentType, newName, existingUpdateComponents);
    };

    validateUpdateDesignUpdateFeatureNarrative(view, mode){

        return DesignUpdateComponentValidationServices.validateUpdateDesignUpdateFeatureNarrative(view, mode)
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

    validateToggleDesignUpdateComponentScope(view, mode, displayContext, designUpdateComponentId){

        let designUpdateComponent = DesignUpdateComponents.findOne({_id: designUpdateComponentId});

        return DesignUpdateComponentValidationServices.validateToggleDesignUpdateComponentScope(view, mode, displayContext, designUpdateComponent);
    }

}
export default new DesignUpdateComponentValidationApi();
