
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

    validateAddDesignUpdateComponent(view, mode, parentComponent, parentInOtherUpdates){

        // Additions only allowed in update edit when in edit mode
        if(view != ViewType.DESIGN_UPDATE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_VIEW_ADD;
        }

        // Additions not allowed in view only mode
        if(mode != ViewMode.MODE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_ADD;
        }

        // Check that scopable target is in scope for adding to if there is one
        if(parentComponent){
            switch(parentComponent.componentType){
                case ComponentType.FEATURE:
                case ComponentType.FEATURE_ASPECT:
                case ComponentType.SCENARIO:
                    // Must be in scope to add stuff to them
                    if(!parentComponent.isInScope){
                        return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_COMPONENT_ADD;
                    }
                    // And not removed
                    if(parentComponent.isRemoved){
                        return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_ADDABLE_PARENT_REMOVED;
                    }
                    break;
                default:
                    // Others must not be removed
                    if(parentComponent.isRemoved){
                        return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_ADDABLE_PARENT_REMOVED;
                    }
            }
        }

        // TODO Remove if not needed - think that will always be removed in current update if removed in other update
        // // Check that the target parent has not been removed in another update
        // if(parentInOtherUpdates) {
        //
        //     let isRemoved = false;
        //
        //     parentInOtherUpdates.forEach((instance) => {
        //
        //         if (instance.isRemoved) {
        //             isRemoved = true;
        //         }
        //     });
        //
        //     if (isRemoved) {
        //         return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_ADDABLE_PARENT_REMOVED_OTHER;
        //     }
        // }

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

    validateUpdateDesignUpdateComponentName(view, mode, componentType, isDevAdded, newName, existingUpdateComponents, componentParentId){

        // Updates only allowed in update edit or WP Develop when in edit mode
        if(!(view === ViewType.DESIGN_UPDATE_EDIT || view === ViewType.DEVELOP_UPDATE_WP)){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_VIEW_EDIT;
        }

        // Updates not allowed in view only mode
        if(mode != ViewMode.MODE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_EDIT;
        }

        // For Update WPs, updates only allowed for Scenarios and Added Feature Aspects
        if(view === ViewType.DEVELOP_UPDATE_WP){

            // Fail bad Feature Aspects
            if(componentType === ComponentType.FEATURE_ASPECT && !isDevAdded){
                // FAIL - cant update non dev added Feature Aspects
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_WP_UPDATABLE;
            }

            // Anything else that's not a Scenario or Feature aspect is no good
            if((componentType != ComponentType.SCENARIO) && (componentType != ComponentType.FEATURE_ASPECT)){
                // FAIL can't update any other components
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_WP_UPDATABLE;
            }
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
            }
        }

        // A Scenario name must not be the subset or superset of another Scenario name
        if(componentType === ComponentType.SCENARIO){

            let subset = false;
            let superset = false;

            existingUpdateComponents.forEach((component) => {

                if(component.componentNameNew.includes(newName)){
                    subset = true;
                }

                if(newName.includes(component.componentNameNew)){
                    superset = true;
                }
            });

            if(subset){
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_NAME_SUBSET;
            }

            if(superset){
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_NAME_SUPERSET;
            }
        }

        return Validation.VALID;
    };

    validateUpdateDesignUpdateFeatureNarrative(view, mode, updateComponent){

        // Updates only allowed in update edit when in edit mode
        if(view != ViewType.DESIGN_UPDATE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_VIEW_EDIT;
        }

        // Updates not allowed in view only mode
        if(mode != ViewMode.MODE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_EDIT;
        }

        // The component must be in scope for the update
        if(!(updateComponent.isInScope)){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_SCOPE_EDIT;
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

    validateToggleDesignUpdateComponentScope(view, mode, displayContext, component, componentInOtherUpdates, hasNoNewChildren, newScope){

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

        // A new item added to the Design Update cannot be de-scoped from it
        if(!newScope){
            if(component.isNew){
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_UNSCOPABLE_NEW;
            }
        }

        // An item that has new children in the update cannot be de-scoped from it
        if(!newScope && !hasNoNewChildren){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_UNSCOPABLE_NEW_CHILDREN;
        }

        // No component can be put in scope if it's already removed in another update
        if(newScope){

            let isRemoved = false;

            componentInOtherUpdates.forEach((instance) => {

                if(instance.isRemoved){
                    isRemoved = true;
                }
            });

            if(isRemoved){
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_SCOPABLE_REMOVED;
            }
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