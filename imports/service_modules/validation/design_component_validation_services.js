
// Ultrawide Services
import { ViewType, ViewMode, DisplayContext, ComponentType } from '../../constants/constants.js';
import { Validation, DesignComponentValidationErrors } from '../../constants/validation_errors.js';

import {locationMoveDropAllowed, reorderDropAllowed} from '../../common/utils.js';

//======================================================================================================================
//
// Validation Services for Design Components.
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class DesignComponentValidationServices{

    validateAddDesignComponent(view, mode){

        // Additions only allowed in design edit when in edit mode
        if(view != ViewType.DESIGN_NEW_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_VIEW_ADD;
        }

        // Additions not allowed in view only mode
        if(mode != ViewMode.MODE_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_ADD;
        }

        return Validation.VALID;
    };

    validateRemoveDesignComponent(view, mode, designComponent){

        // Updates only allowed in design edit when in edit mode
        if(view != ViewType.DESIGN_NEW_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_VIEW_REMOVE;
        }

        // Updates not allowed in view only mode
        if(mode != ViewMode.MODE_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_REMOVE;
        }

        // Component must be removable
        if(!designComponent.isRemovable){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_NOT_REMOVABLE;
        }

        return Validation.VALID;
    };

    validateUpdateComponentName(view, mode, componentType, newName, existingComponents){

        // Updates only allowed in design edit when in edit mode
        if(view != ViewType.DESIGN_NEW_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_VIEW_EDIT;
        }

        // Updates not allowed in view only mode
        if(mode != ViewMode.MODE_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_EDIT;
        }

        // Name must be unique for component type - for functional components only
        if(componentType === ComponentType.DESIGN_SECTION || componentType === ComponentType.FEATURE_ASPECT){
            // No need to validate
            return Validation.VALID;
        } else {

            let duplicate = false;

            existingComponents.forEach((component) => {

                if(component.componentName === newName){
                    duplicate = true;
                }
            });

            if(duplicate){
                return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_NAME_DUPLICATE;
            } else {
                return Validation.VALID;
            }
        }
    };

    validateUpdateFeatureNarrative(view, mode){

        // Updates only allowed in design edit when in edit mode
        if(view != ViewType.DESIGN_NEW_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_VIEW_EDIT;
        }

        // Updates not allowed in view only mode
        if(mode != ViewMode.MODE_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_EDIT;
        }

        return Validation.VALID;
    };

    validateMoveDesignComponent(view, mode, displayContext, movingComponent, targetComponent){

        // Moves only allowed in design edit when in edit mode
        if(view != ViewType.DESIGN_NEW_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_VIEW_MOVE;
        }

        // Moves not allowed in view only mode
        if(mode != ViewMode.MODE_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_MOVE;
        }

        // Moves not allowed outside the Design Editor
        if(displayContext != DisplayContext.BASE_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_CONTEXT_MOVE;
        }

        // Moves must be to a valid destination
        if(!locationMoveDropAllowed(movingComponent.componentType, targetComponent.componentType, view, targetComponent.isInScope)){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE;
        }

        return Validation.VALID;
    };

    validateReorderDesignComponent(view, mode, displayContext, movingComponent, targetComponent){

        // Moves only allowed in design edit when in edit mode
        if(view != ViewType.DESIGN_NEW_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_VIEW_MOVE;
        }

        // Moves not allowed in view only mode
        if(mode != ViewMode.MODE_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_MOVE;
        }

        // Moves not allowed outside the Design Editor
        if(displayContext != DisplayContext.BASE_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_CONTEXT_MOVE;
        }

        // Moves must be to a valid destination
        if(!reorderDropAllowed(movingComponent, targetComponent)){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_REORDER;
        }

        return Validation.VALID;
    }
}
export default new DesignComponentValidationServices();