
// Ultrawide Services
import { ViewType, ViewMode, DisplayContext, ComponentType, RoleType } from '../../constants/constants.js';
import { Validation, DesignComponentValidationErrors } from '../../constants/validation_errors.js';

import {locationMoveDropAllowed, reorderDropAllowed} from '../../common/utils.js';

//======================================================================================================================
//
// Validation Services for Design Components.
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class DesignComponentValidationServicesClass{

    validateAddDesignComponent(view, mode, componentType){

        // Additions only allowed in design edit or base work package when in edit mode
        if(!(view === ViewType.DESIGN_NEW || view === ViewType.DESIGN_PUBLISHED || view === ViewType.DEVELOP_BASE_WP)){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_VIEW_ADD;
        }

        // Additions not allowed in view only mode
        if(mode !== ViewMode.MODE_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_ADD;
        }

        // In work packages only Scenarios and Feature Aspects can be added
        if(view === ViewType.DEVELOP_BASE_WP){

            if(!(componentType === ComponentType.FEATURE_ASPECT || componentType === ComponentType.SCENARIO)){
                return DesignComponentValidationErrors.DESIGN_COMPONENT_NOT_WP_ADDABLE;
            }
        }

        return Validation.VALID;
    };

    validateRemoveDesignComponent(view, mode, designComponent){

        // Only can remove if editing design or WP
        if(!(view === ViewType.DESIGN_NEW || view === ViewType.DESIGN_PUBLISHED || view === ViewType.DEVELOP_BASE_WP)){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_VIEW_REMOVE;
        }

        // Remove not allowed in view only mode
        if(mode !== ViewMode.MODE_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_REMOVE;
        }

        // Component must be removable
        if(!designComponent.isRemovable){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_NOT_REMOVABLE;
        }

        // If WP, must be removable AND added by the developer.  Since only Scenarios and Feature Aspects can be added by Dev, limited to these.
        if(view === ViewType.DEVELOP_BASE_WP){
            if(!designComponent.isDevAdded){
                return DesignComponentValidationErrors.DESIGN_COMPONENT_NOT_REMOVABLE_DEV;
            }
        }

        return Validation.VALID;
    };

    validateUpdateComponentName(view, mode, componentType, isDevAdded, newName, existingComponents, componentParentRefId){

        // Updates only allowed in design edit when in edit mode or for Base WP editing
        if(!(view === ViewType.DESIGN_NEW || view === ViewType.DESIGN_PUBLISHED || view === ViewType.DEVELOP_BASE_WP)){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_VIEW_EDIT;
        }

        // Updates not allowed in view only mode
        if(mode !== ViewMode.MODE_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_EDIT;
        }

        // For Base WPs, updates only allowed for Scenarios and Added Feature Aspects
        if(view === ViewType.DEVELOP_BASE_WP){

            // Fail bad Feature Aspects
            if(componentType === ComponentType.FEATURE_ASPECT && !isDevAdded){
                // FAIL - cant update non dev added Feature Aspects
                return DesignComponentValidationErrors.DESIGN_COMPONENT_NOT_WP_UPDATABLE;
            }

            // Anything else that's not a Scenario or Feature aspect is no good
            if((componentType !== ComponentType.SCENARIO) && (componentType !== ComponentType.FEATURE_ASPECT)){
                // FAIL can't update any other components
                return DesignComponentValidationErrors.DESIGN_COMPONENT_NOT_WP_UPDATABLE;
            }
        }

        // Name must be unique for component type - for functional components only
        if(componentType === ComponentType.DESIGN_SECTION || componentType === ComponentType.FEATURE_ASPECT){

            // For non-functional components must be unique under the same parent only
            let duplicate = false;

            existingComponents.forEach((component) => {

                if(component.componentNameNew === newName  && component.componentParentReferenceIdNew === componentParentRefId){
                    duplicate = true;
                }
            });

            if(duplicate){
                return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_NAME_DUPLICATE_FOR_PARENT;
            }
        } else {

            let duplicate = false;

            existingComponents.forEach((component) => {

                if(component.componentNameNew === newName){
                    duplicate = true;
                }
            });

            if(duplicate){
                return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_NAME_DUPLICATE;
            }
        }

        // A Scenario name must not be the subset or superset of another Scenario name
        if(componentType === ComponentType.SCENARIO){

            let subset = false;
            let superset = false;

            existingComponents.forEach((component) => {

                if(component.componentNameNew.includes(newName)){
                    subset = true;
                }

                if(newName.includes(component.componentNameNew)){
                    superset = true;
                }
            });

            if(subset){
                return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_NAME_SUBSET;
            }

            if(superset){
                return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_NAME_SUPERSET;
            }
        }


        return Validation.VALID;
    };

    validateUpdateFeatureNarrative(view, mode){

        // Updates only allowed in design edit when in edit mode
        if(!(view === ViewType.DESIGN_NEW || view === ViewType.DESIGN_PUBLISHED)){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_VIEW_EDIT;
        }

        // Updates not allowed in view only mode
        if(mode !== ViewMode.MODE_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_EDIT;
        }

        return Validation.VALID;
    };

    validateMoveDesignComponent(view, mode, displayContext, movingComponent, targetComponent, inWp){

        // Moves only allowed in base design
        if(!(view === ViewType.DESIGN_NEW || view === ViewType.DESIGN_PUBLISHED)){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_VIEW_MOVE;
        }

        // Moves not allowed in view only mode
        if(mode !== ViewMode.MODE_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_MOVE;
        }

        // Moves not allowed outside the Design Editor
        if(displayContext !== DisplayContext.BASE_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_CONTEXT_MOVE;
        }

        // Moves must be to a valid destination
        if(!locationMoveDropAllowed(movingComponent.componentType, targetComponent.componentType, view, true)){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE;
        }

        // A component in a Work Package cannot be moved
        if(inWp){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE_WP;
        }

        return Validation.VALID;
    };

    validateReorderDesignComponent(view, mode, displayContext, movingComponent, targetComponent){

        // Moves only allowed in base design
        if(!(view === ViewType.DESIGN_NEW || view === ViewType.DESIGN_PUBLISHED)){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_VIEW_MOVE;
        }

        // Moves not allowed in view only mode
        if(mode !== ViewMode.MODE_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MODE_MOVE;
        }

        // Moves not allowed outside the Design Editor
        if(displayContext !== DisplayContext.BASE_EDIT){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_CONTEXT_MOVE;
        }

        // Moves must be to a valid destination
        if(!reorderDropAllowed(movingComponent, targetComponent)){
            return DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_REORDER;
        }

        return Validation.VALID;
    }
}
export const DesignComponentValidationServices = new DesignComponentValidationServicesClass();