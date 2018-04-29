
// Ultrawide Services
import { ViewType } from '../constants/constants.js';

import { WorkPackageComponentValidationServices }   from '../service_modules/validation/work_package_component_validation_services.js';

// Data Access
import { DesignComponentData }                      from '../data/design/design_component_db.js';
import { DesignUpdateComponentData }                from '../data/design_update/design_update_component_db.js';

//======================================================================================================================
//
// Validation API for Work Package Components
//
//======================================================================================================================

class WorkPackageComponentValidationApiClass {

    validateToggleInScope(view, displayContext, userContext, designComponentId){

        // Get the design component being toggled
        let designComponent = null;
        let wpType = '';

        switch(view){
            case ViewType.WORK_PACKAGE_BASE_EDIT:

                designComponent = DesignComponentData.getDesignComponentById(designComponentId);
                break;

            case ViewType.WORK_PACKAGE_UPDATE_EDIT:

                designComponent = DesignUpdateComponentData.getUpdateComponentById(designComponentId);
                break;
        }

        return WorkPackageComponentValidationServices.validateToggleInScope(view, displayContext, userContext, designComponent)
    };
}

export const WorkPackageComponentValidationApi = new WorkPackageComponentValidationApiClass();
