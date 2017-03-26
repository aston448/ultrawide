
// Ultrawide Collections
import { DesignVersionComponents } from '../collections/design/design_version_components.js';

// Ultrawide Services
import { DesignComponentValidationErrors, Validation } from '../constants/validation_errors.js';

import DesignComponentValidationServices    from '../service_modules/validation/design_component_validation_services.js';
import DesignComponentModules               from '../service_modules/design/design_component_service_modules.js';

//======================================================================================================================
//
// Validation API for Design Components
//
//======================================================================================================================

class DesignComponentValidationApi{

    validateAddDesignComponent(view, mode, componentType){

        return DesignComponentValidationServices.validateAddDesignComponent(view, mode, componentType)
    };

    validateRemoveDesignComponent(view, mode, designComponentId){

        let designComponent = DesignVersionComponents.findOne({_id: designComponentId});

        const status = DesignComponentValidationServices.validateRemoveDesignComponent(view, mode, designComponent);

        if (status === Validation.VALID){
            // Just double check....
            if(DesignComponentModules.hasNoChildren(designComponentId)){
                return Validation.VALID;
            } else {
                return DesignComponentValidationErrors.DESIGN_COMPONENT_NOT_REMOVABLE;
            }
        } else {
            return status;
        }
    };

    validateUpdateComponentName(view, mode, designComponentId, newName){

        // Get other components of the same type that should not have the same name
        const thisComponent = DesignVersionComponents.findOne({_id: designComponentId});

        const existingComponents = DesignVersionComponents.find({
            _id:                {$ne: designComponentId},
            designVersionId:    thisComponent.designVersionId,
            componentType:      thisComponent.componentType
        }).fetch();

        return DesignComponentValidationServices.validateUpdateComponentName(view, mode, thisComponent.componentType, thisComponent.isDevAdded, newName, existingComponents, thisComponent.componentParentIdNew);
    };

    validateUpdateFeatureNarrative(view, mode){

        return DesignComponentValidationServices.validateUpdateFeatureNarrative(view, mode)
    };

    validateMoveDesignComponent(view, mode, displayContext, movingComponentId, targetComponentId){

        const movingComponent = DesignVersionComponents.findOne({_id: movingComponentId});
        const targetComponent = DesignVersionComponents.findOne({_id: targetComponentId});

        return DesignComponentValidationServices.validateMoveDesignComponent(view, mode, displayContext, movingComponent, targetComponent)
    };

    validateReorderDesignComponent(view, mode, displayContext, movingComponentId, targetComponentId){

        const movingComponent = DesignVersionComponents.findOne({_id: movingComponentId});
        const targetComponent = DesignVersionComponents.findOne({_id: targetComponentId});

        return DesignComponentValidationServices.validateReorderDesignComponent(view, mode, displayContext, movingComponent, targetComponent)
    }

}
export default new DesignComponentValidationApi();
