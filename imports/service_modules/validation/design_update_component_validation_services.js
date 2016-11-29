// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections

// Ultrawide Services
import { ViewType, ViewMode, DisplayContext, ComponentType } from '../../constants/constants.js';
import { Validation, DesignUpdateComponentValidationErrors } from '../../constants/validation_errors.js';

import {locationMoveDropAllowed, reorderDropAllowed, log} from '../../common/utils.js';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Update Component Validation - Supports validations relating to Design Update Components
//
// ---------------------------------------------------------------------------------------------------------------------

class DesignUpdateComponentValidationServices{

    validateAddDesignUpdateComponent(view, mode){

        // Additions only allowed in update edit when in edit mode
        if(view != ViewType.DESIGN_UPDATE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_VIEW_ADD;
        }

        // Additions not allowed in view only mode
        if(mode != ViewMode.MODE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_ADD;
        }

        return Validation.VALID;
    };

    validateRemoveDesignUpdateComponent(view, mode, designUpdateComponent){

        // Updates only allowed in update edit when in edit mode
        if(view != ViewType.DESIGN_UPDATE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_VIEW_REMOVE;
        }

        // Updates not allowed in view only mode
        if(mode != ViewMode.MODE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_REMOVE;
        }

        // Component must be removable
        if(!designUpdateComponent.isRemovable){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_REMOVABLE;
        }

        return Validation.VALID;

    };

    validateRestoreDesignUpdateComponent(view, mode, designUpdateComponent){

        // Updates only allowed in update edit when in edit mode
        if(view != ViewType.DESIGN_UPDATE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_VIEW_RESTORE;
        }

        // Updates not allowed in view only mode
        if(mode != ViewMode.MODE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_RESTORE;
        }

        // Component must be restorable
        if(!designUpdateComponent.isRemoved){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_RESTORABLE;
        }

        return Validation.VALID;
    };

    validateUpdateDesignUpdateComponentName(view, mode, componentType, newName, existingUpdateComponents){

        // Updates only allowed in update edit when in edit mode
        if(view != ViewType.DESIGN_UPDATE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_VIEW_EDIT;
        }

        // Updates not allowed in view only mode
        if(mode != ViewMode.MODE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_EDIT;
        }

        // Name must be unique for component type - for functional components only
        if(componentType === ComponentType.DESIGN_SECTION || componentType === ComponentType.FEATURE_ASPECT){
            // No need to validate
            return Validation.VALID;
        } else {

            let duplicate = false;

            existingUpdateComponents.forEach((component) => {

                if(component.componentNameNew === newName){
                    duplicate = true;
                }
            });

            if(duplicate){
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_NAME_DUPLICATE;
            } else {
                return Validation.VALID;
            }
        }
    };

    validateUpdateDesignUpdateFeatureNarrative(view, mode){

        // Updates only allowed in update edit when in edit mode
        if(view != ViewType.DESIGN_UPDATE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_VIEW_EDIT;
        }

        // Updates not allowed in view only mode
        if(mode != ViewMode.MODE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_EDIT;
        }

        return Validation.VALID;

    };

    validateMoveDesignUpdateComponent(view, mode, displayContext, movingComponent, targetComponent){

        // Moves only allowed in update edit when in edit mode
        if(view != ViewType.DESIGN_UPDATE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_VIEW_MOVE;
        }

        // Moves not allowed in view only mode
        if(mode != ViewMode.MODE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_MOVE;
        }

        // Moves not allowed outside the Design Update Editor
        if(displayContext != DisplayContext.UPDATE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_CONTEXT_MOVE;
        }

        // Moves must be to a valid destination
        if(!locationMoveDropAllowed(movingComponent.componentType, targetComponent.componentType, view, targetComponent.isInScope)){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MOVE;
        }

        return Validation.VALID;

    };

    validateReorderDesignUpdateComponent(view, mode, displayContext, movingComponent, targetComponent){

        // Moves only allowed in update edit when in edit mode
        if(view != ViewType.DESIGN_UPDATE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_VIEW_MOVE;
        }

        // Moves not allowed in view only mode
        if(mode != ViewMode.MODE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_MOVE;
        }

        // Moves not allowed outside the Update Editor
        if(displayContext != DisplayContext.UPDATE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_CONTEXT_MOVE;
        }

        // Moves must be to a valid destination
        if(!reorderDropAllowed(movingComponent, targetComponent)){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_REORDER;
        }

        return Validation.VALID;
    };

    validateToggleDesignUpdateComponentScope(view, mode, displayContext){

        // Updates only allowed in update edit when in edit mode
        if(view != ViewType.DESIGN_UPDATE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_VIEW_SCOPE;
        }

        // Updates not allowed in view only mode
        if(mode != ViewMode.MODE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_SCOPE;
        }

        // Context must be scoping
        if(displayContext != DisplayContext.UPDATE_SCOPE){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_CONTEXT_SCOPE;
        }

        return Validation.VALID;
    }
}

export default new DesignUpdateComponentValidationServices();