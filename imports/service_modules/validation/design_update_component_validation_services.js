
// Ultrawide Services
import { ViewType, ViewMode, DisplayContext, ComponentType, UpdateScopeType, UpdateMergeStatus } from '../../constants/constants.js';
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

    validateAddDesignUpdateComponent(view, mode, componentType, parentComponent){

        // Additions only allowed in update edit or WP develop when in edit mode
        if(!(view === ViewType.DESIGN_UPDATE_EDIT || view === ViewType.DEVELOP_UPDATE_WP)){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_VIEW_ADD;
        }

        // Additions not allowed in view only mode
        if(mode !== ViewMode.MODE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_ADD;
        }

        // Cannot add to a deleted parent
        if(parentComponent) {
            if (parentComponent.isRemoved || parentComponent.isRemovedElsewhere) {
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_ADDABLE_PARENT_REMOVED;
            }
        }

        // Cannot add to a parent that is not in scope
        if(parentComponent){
            if(parentComponent.scopeType !== UpdateScopeType.SCOPE_IN_SCOPE){
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_ADDABLE_PARENT_OUT_SCOPE;
            }
        }

        // For Update WPs, additions only allowed for Scenarios and Feature Aspects
        if(view === ViewType.DEVELOP_UPDATE_WP){

            // Anything that's not a Scenario or Feature aspect is no good
            if(!(componentType === ComponentType.SCENARIO || componentType === ComponentType.FEATURE_ASPECT)){
                // FAIL can't update any other components
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_WP_ADDABLE;
            }
        }

        return Validation.VALID;
    };

    validateRemoveDesignUpdateComponent(view, mode, designUpdateComponent){

        // Updates only allowed in update edit or WP development when in edit mode
        if(!(view === ViewType.DESIGN_UPDATE_EDIT || view === ViewType.DEVELOP_UPDATE_WP)){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_VIEW_REMOVE;
        }

        // Updates not allowed in view only mode
        if(mode !== ViewMode.MODE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_REMOVE;
        }

        // If WP, must removed by the developer.  Since only Scenarios and Feature Aspects can be added by Dev, limited to these.
        if(view === ViewType.DEVELOP_UPDATE_WP){
            if(!designUpdateComponent.isDevAdded){
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_REMOVABLE_DEV;
            }
        }

        // Component must not be removed elsewhere
        if(designUpdateComponent.isRemovedElsewhere){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_DELETABLE_REMOVED_ELSEWHERE;
        }

        // Component must be removable - i.e. not have children
        if(!designUpdateComponent.isRemovable){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_REMOVABLE;
        }

        return Validation.VALID;

    };

    validateRestoreDesignUpdateComponent(view, mode, designUpdateComponent, parentComponent){

        // Updates only allowed in update edit when in edit mode
        if(view !== ViewType.DESIGN_UPDATE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_VIEW_RESTORE;
        }

        // Updates not allowed in view only mode
        if(mode !== ViewMode.MODE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_RESTORE;
        }

        // Component must not be removed elsewhere
        if(designUpdateComponent.isRemovedElsewhere){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_RESTORABLE;
        }

        // Component must be restorable - i.e. removed HERE
        if(!designUpdateComponent.isRemoved){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_RESTORABLE;
        }

        // Parent must not be removed - if there is one
        if(parentComponent){
            if(parentComponent.isRemoved || parentComponent.isRemovedElsewhere){
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_RESTORABLE_PARENT;
            }
        }

        return Validation.VALID;
    };

    validateUpdateDesignUpdateComponentName(view, mode, updateComponent, newName, existingUpdateComponents, existingDesignVersionComponents, designVersionComponent){

        // Updates only allowed in update edit or WP Develop when in edit mode
        if(!(view === ViewType.DESIGN_UPDATE_EDIT || view === ViewType.DEVELOP_UPDATE_WP)){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_VIEW_EDIT;
        }

        // Updates not allowed in view only mode
        if(mode !== ViewMode.MODE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_EDIT;
        }

        // Component must not be removed already in this update
        if(updateComponent.isRemoved){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_EDIT_REMOVED;
        }

        // Component must not be removed elsewhere
        if(updateComponent.isRemovedElsewhere){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_EDIT_REMOVED;
        }

        // For Update WPs, updates only allowed for Scenarios and Added Feature Aspects
        if(view === ViewType.DEVELOP_UPDATE_WP){

            // Fail bad Feature Aspects
            if(updateComponent.componentType === ComponentType.FEATURE_ASPECT && !updateComponent.isDevAdded){
                // FAIL - cant update non dev added Feature Aspects
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_WP_UPDATABLE;
            }

            // Anything else that's not a Scenario or Feature aspect is no good
            if((updateComponent.componentType !== ComponentType.SCENARIO) && (updateComponent.componentType !== ComponentType.FEATURE_ASPECT)){
                // FAIL can't update any other components
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_WP_UPDATABLE;
            }
        }

        // Name cannot be edited if not an in scope item
        if(updateComponent.scopeType !== UpdateScopeType.SCOPE_IN_SCOPE){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_UPDATABLE_SCOPE;
        }

        // Name cannot be updated if it is updated in another published update
        if(designVersionComponent){
            if(designVersionComponent.updateMergeStatus === UpdateMergeStatus.COMPONENT_MODIFIED){
                // The component has been modified by some update
                if(!updateComponent.isChanged){
                    // But its not by us already so don't allow it
                    return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_UPDATABLE_OTHER_DU;
                }
            }
        }

        // Name must be unique for component type - for functional components only
        if(updateComponent.componentType === ComponentType.DESIGN_SECTION || updateComponent.componentType === ComponentType.FEATURE_ASPECT){

            // For non-functional components must be unique under the same parent only
            let duplicate = false;

            existingUpdateComponents.forEach((existingComponent) => {

                if(existingComponent.componentNameNew === newName  && existingComponent.componentParentReferenceIdNew === updateComponent.componentParentReferenceIdNew){
                    duplicate = true;
                }
            });

            existingDesignVersionComponents.forEach((existingComponent) => {

                if(existingComponent.componentNameNew === newName  && existingComponent.componentParentReferenceIdNew === updateComponent.componentParentReferenceIdNew){
                    duplicate = true;
                }
            });

            if(duplicate){
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_NAME_DUPLICATE_FOR_PARENT;
            }
        } else {

            let duplicate = false;

            existingUpdateComponents.forEach((existingComponent) => {

                if(existingComponent.componentNameNew === newName){
                    duplicate = true;
                }
            });

            existingDesignVersionComponents.forEach((existingComponent) => {

                if(existingComponent.componentNameNew === newName){
                    duplicate = true;
                }
            });

            if(duplicate){
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_NAME_DUPLICATE;
            }
        }

        // A Scenario name must not be the subset or superset of another Scenario name
        if(updateComponent.componentType === ComponentType.SCENARIO){

            let subset = false;
            let superset = false;

            existingUpdateComponents.forEach((existingComponent) => {

                if(existingComponent.componentNameNew.includes(newName)){
                    subset = true;
                }

                if(newName.includes(existingComponent.componentNameNew)){
                    superset = true;
                }
            });

            existingDesignVersionComponents.forEach((existingComponent) => {

                if(existingComponent.componentNameNew.includes(newName)){
                    subset = true;
                }

                if(newName.includes(existingComponent.componentNameNew)){
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
        if(view !== ViewType.DESIGN_UPDATE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_VIEW_EDIT;
        }

        // Updates not allowed in view only mode
        if(mode !== ViewMode.MODE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_EDIT;
        }

        // The component must be in scope for the update
        if(!(updateComponent.scopeType === UpdateScopeType.SCOPE_IN_SCOPE)){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_SCOPE_EDIT;
        }

        return Validation.VALID;

    };

    validateMoveDesignUpdateComponent(view, mode, displayContext, movingComponent, targetComponent){

        // Moves only allowed in update edit when in edit mode
        if(view !== ViewType.DESIGN_UPDATE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_VIEW_MOVE;
        }

        // Moves not allowed in view only mode
        if(mode !== ViewMode.MODE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_MOVE;
        }

        // Moves not allowed outside the Design Update Editor
        if(displayContext !== DisplayContext.UPDATE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_CONTEXT_MOVE;
        }

        // Only new components in the Design Update can be moved
        if(!movingComponent.isNew){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_COMPONENT_MOVE;
        }

        // Moves must be to a valid destination
        if(!locationMoveDropAllowed(movingComponent.componentType, targetComponent.componentType, view, (targetComponent.scopeType === UpdateScopeType.SCOPE_IN_SCOPE))){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MOVE;
        }

        return Validation.VALID;

    };

    validateReorderDesignUpdateComponent(view, mode, displayContext, movingComponent, targetComponent){

        // Moves only allowed in update edit when in edit mode
        if(view !== ViewType.DESIGN_UPDATE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_VIEW_MOVE;
        }

        // Moves not allowed in view only mode
        if(mode !== ViewMode.MODE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_MOVE;
        }

        // Moves not allowed outside the Update Editor
        if(displayContext !== DisplayContext.UPDATE_EDIT){
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

    validateToggleDesignUpdateComponentScope(view, mode, displayContext, scopeComponent, updateComponent, componentInOtherUpdates, hasNoNewChildren, newScope){

        // Updates only allowed in update edit when in edit mode
        if(view !== ViewType.DESIGN_UPDATE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_VIEW_SCOPE;
        }

        // Updates not allowed in view only mode
        if(mode !== ViewMode.MODE_EDIT){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_MODE_SCOPE;
        }

        // Context must be scoping
        if(displayContext !== DisplayContext.UPDATE_SCOPE){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_CONTEXT_SCOPE;
        }

        // No component can be put in scope if it's already removed in another update
        if(newScope){

            let alreadyRemoved = false;

            componentInOtherUpdates.forEach((instance) => {
                if(instance.isRemoved){
                    alreadyRemoved = true;
                }
            });

            if(alreadyRemoved){
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_SCOPABLE_REMOVED;
            }
        }

        // A Feature cannot be put in scope if it has been changed in another update
        if(newScope){

            if(scopeComponent.componentType === ComponentType.FEATURE){

                let alreadyChanged = false;

                componentInOtherUpdates.forEach((instance) => {
                    if(instance.isChanged){
                        alreadyChanged = true;
                    }
                });

                if(alreadyChanged){
                    return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_SCOPABLE_CHANGED;
                }

            }
        }

        // A Scenario cannot be put in scope if it is in scope for another update (not parent scope)
        if(newScope){

            if(scopeComponent.componentType === ComponentType.SCENARIO) {

                let alreadyInScope = false;

                componentInOtherUpdates.forEach((instance) => {
                    if (instance.scopeType === UpdateScopeType.SCOPE_IN_SCOPE) {
                        alreadyInScope = true;
                    }
                });

                if (alreadyInScope) {
                    return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_SCOPABLE_IN_SCOPE;
                }
            }

        }

        // Item must be in scope in this update to remove it
        if(!newScope && updateComponent){
            if(updateComponent.scopeType !== UpdateScopeType.SCOPE_IN_SCOPE){
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_IN_SCOPE;
            }
        }

        // A new item added to the Design Update cannot be de-scoped from it
        if(!newScope && updateComponent){
            if(updateComponent.isNew){
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_UNSCOPABLE_NEW;
            }
        }

        // An item cannot be put out of scope if it is removed
        if(!newScope && updateComponent){
            if(updateComponent.isRemoved){
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_UNSCOPABLE_REMOVED;
            }
        }

        // An item cannot be put out of scope if it is modified
        if(!newScope && updateComponent){
            if(updateComponent.isChanged){
                return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_UNSCOPABLE_CHANGED;
            }
        }

        // An item that is the direct parent of new children in the update cannot be de-scoped
        if(!newScope && !hasNoNewChildren){
            return DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_UNSCOPABLE_NEW_CHILDREN;
        }


        return Validation.VALID;
    }
}

export default new DesignUpdateComponentValidationServices();