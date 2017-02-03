
// Ultrawide Services
import { ViewType, ViewMode, DisplayContext, ComponentType } from '../../constants/constants.js';
import { Validation, DesignUpdateComponentValidationErrors } from '../../constants/validation_errors.js';

import {locationMoveDropAllowed, reorderDropAllowed} from '../../common/utils.js';

//======================================================================================================================
//
// Validation Services for Design Update Components.
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class DesignUpdateComponentValidationServices{

    validateAddDesignUpdateComponent(view, mode, parentComponent){

        // Additions only allowed in update edit when in edit mode
        if(view != ViewType.DESIGN_UPDATE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_VIEW_ADD;
        }

        // Additions not allowed in view only mode
        if(mode != ViewMode.MODE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_ADD;
        }

        // Check that target is valid for adding to if there is one
        if(parentComponent){
            switch(parentComponent.componentType){
                case ComponentType.FEATURE:
                case ComponentType.FEATURE_ASPECT:
                case ComponentType.SCENARIO:
                    // Must be in scope to add stuff to them
                    if(!parentComponent.isInScope){
                        return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_COMPONENT_ADD;
                    }
                    break;
                default:
                    // Others don't matter
            }
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

    validateRestoreDesignUpdateComponent(view, mode, designUpdateComponent, parentComponent){

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

        // Parent must not be removed - if there is one
        if(parentComponent){
            if(parentComponent.isRemoved){
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_RESTORABLE_PARENT;
            }
        }

        return Validation.VALID;
    };

    validateUpdateDesignUpdateComponentName(view, mode, componentType, newName, existingUpdateComponents, componentParentId){

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
            // For non-functional components must be unique under the same parent only
            let duplicate = false;

            existingUpdateComponents.forEach((component) => {

                if(component.componentNameNew === newName  && component.componentParentIdNew === componentParentId){
                    duplicate = true;
                }
            });

            if(duplicate){
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_NAME_DUPLICATE_FOR_PARENT;
            } else {
                return Validation.VALID;
            }
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

        // Only new components in the Design Update can be moved
        if(!movingComponent.isNew){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_COMPONENT_MOVE;
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

        // Only new update items can be moved
        if(!(movingComponent.isNew)){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_REORDER_EXISTING;
        }

        // Moves must be to a valid destination
        if(!reorderDropAllowed(movingComponent, targetComponent)){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_REORDER;
        }

        return Validation.VALID;
    };

    validateToggleDesignUpdateComponentScope(view, mode, displayContext, component, componentInOtherUpdates, newScope){

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

        // A Scenario cannot be put in scope if it is in scope for another update
        if(newScope && component.componentType === ComponentType.SCENARIO){

            let alreadyInScope = false;

            componentInOtherUpdates.forEach((instance) => {
                if(instance.isInScope){
                    alreadyInScope = true;
                }
            });

            if(alreadyInScope){
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_SCOPABLE_IN_SCOPE;
            }

        }

        return Validation.VALID;
    }
}

export default new DesignUpdateComponentValidationServices();