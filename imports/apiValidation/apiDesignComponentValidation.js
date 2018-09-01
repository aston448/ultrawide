
// Ultrawide Services
import { DesignComponentValidationErrors, Validation } from '../constants/validation_errors.js';

import { DesignComponentValidationServices }    from '../service_modules/validation/design_component_validation_services.js';
import { DesignComponentModules }               from '../service_modules/design/design_component_service_modules.js';

// Data Access
import { DesignVersionData }                    from '../data/design/design_version_db.js';
import { DesignComponentData }                  from '../data/design/design_component_db.js';

//======================================================================================================================
//
// Validation API for Design Components
//
//======================================================================================================================

class DesignComponentValidationApiClass {

    validateAddDesignComponent(view, mode, componentType){

        return DesignComponentValidationServices.validateAddDesignComponent(view, mode, componentType)
    };

    validateRemoveDesignComponent(view, mode, designComponentId){

        let designComponent = DesignComponentData.getDesignComponentById(designComponentId);

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
        const thisComponent = DesignComponentData.getDesignComponentById(designComponentId);

        const existingComponents = DesignVersionData.getOtherComponentsOfType(
            thisComponent.componentReferenceId,
            thisComponent.designVersionId,
            thisComponent.componentType
        );

        return DesignComponentValidationServices.validateUpdateComponentName(view, mode, thisComponent.componentType, thisComponent.isDevAdded, newName, existingComponents, thisComponent.componentParentReferenceIdNew);
    };

    validateUpdateFeatureNarrative(view, mode){

        return DesignComponentValidationServices.validateUpdateFeatureNarrative(view, mode)
    };

    validateMoveDesignComponent(view, mode, displayContext, movingComponentId, targetComponentId){

        const movingComponent = DesignComponentData.getDesignComponentById(movingComponentId);
        const targetComponent = DesignComponentData.getDesignComponentById(targetComponentId);

        return DesignComponentValidationServices.validateMoveDesignComponent(view, mode, displayContext, movingComponent, targetComponent)
    };

    validateReorderDesignComponent(view, mode, displayContext, movingComponentId, targetComponentId){

        const movingComponent = DesignComponentData.getDesignComponentById(movingComponentId);
        const targetComponent = DesignComponentData.getDesignComponentById(targetComponentId);

        return DesignComponentValidationServices.validateReorderDesignComponent(view, mode, displayContext, movingComponent, targetComponent)
    }

}
export const DesignComponentValidationApi = new DesignComponentValidationApiClass();
