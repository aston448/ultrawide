// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections
import { DesignComponents } from '../collections/design/design_components.js';

// Ultrawide Services
import { ViewType, RoleType } from '../constants/constants.js';
import { DesignComponentValidationErrors } from '../constants/validation_errors.js';

import DesignComponentValidationServices from '../service_modules/validation/design_component_validation_services.js';
import DesignComponentModules from '../service_modules/design/design_component_service_modules.js';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Component Validation - Supports validations relating to a Design Component.
// Functions called from here must be module testable - no database access allowed!  So get data and pass to functions.
//
// ---------------------------------------------------------------------------------------------------------------------

class DesignComponentValidationApi{

    validateAddDesignComponent(view, mode){

        return DesignComponentValidationServices.validateAddDesignComponent(view, mode)
    };

    validateRemoveDesignComponent(view, mode, designComponentId){

        let designComponent = DesignComponents.findOne({_id: designComponentId});

        if (designComponent.isRemovable){
            // Just double check....
            if(DesignComponentModules.hasNoChildren(designComponentId)){
                return DesignComponentValidationServices.validateRemoveDesignComponent(view, mode, designComponent);
            } else {
                return DesignComponentValidationErrors.DESIGN_COMPONENT_NOT_REMOVABLE;
            }
        }
    };

    validateUpdateComponentName(view, mode, designComponentId, newName){

        // Get other components of the same type that should not have the same name
        const thisComponent = DesignComponents.findOne({_id: designComponentId});

        const existingComponents = DesignComponents.find({
            _id:                {$ne: designComponentId},
            designVersionId:    thisComponent.designVersionId,
            componentType:      thisComponent.componentType
        }).fetch();

        return DesignComponentValidationServices.validateUpdateComponentName(view, mode, thisComponent.componentType, newName, existingComponents);
    };

    validateUpdateFeatureNarrative(view, mode){

        return DesignComponentValidationServices.validateUpdateFeatureNarrative(view, mode)
    };

    validateMoveDesignComponent(view, mode, displayContext, movingComponentId, targetComponentId){

        const movingComponent = DesignComponents.findOne({_id: movingComponentId});
        const targetComponent = DesignComponents.findOne({_id: targetComponentId});

        return DesignComponentValidationServices.validateMoveDesignComponent(view, mode, displayContext, movingComponent, targetComponent)
    };

    validateReorderDesignComponent(view, mode, displayContext, movingComponentId, targetComponentId){

        const movingComponent = DesignComponents.findOne({_id: movingComponentId});
        const targetComponent = DesignComponents.findOne({_id: targetComponentId});

        return DesignComponentValidationServices.validateReorderDesignComponent(view, mode, displayContext, movingComponent, targetComponent)
    }

}
export default new DesignComponentValidationApi();
