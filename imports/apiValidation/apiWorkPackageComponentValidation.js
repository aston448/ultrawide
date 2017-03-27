// Ultrawide Collections
import { WorkPackageComponents }    from '../collections/work/work_package_components.js';
import { DesignVersionComponents }      from '../collections/design/design_version_components.js';
import { DesignUpdateComponents }       from '../collections/design_update/design_update_components.js';

// Ultrawide Services
import { ComponentType, ViewType } from '../constants/constants.js';
import { WorkPackageComponentValidationErrors } from '../constants/validation_errors.js';
import WorkPackageComponentValidationServices from '../service_modules/validation/work_package_component_validation_services.js';

//======================================================================================================================
//
// Validation API for Work Package Components
//
//======================================================================================================================

class WorkPackageComponentValidationApi {

    validateToggleInScope(view, displayContext, userContext, designComponentId){

        // Get the design component being toggled
        let designComponent = null;
        let wpType = '';

        switch(view){
            case ViewType.WORK_PACKAGE_BASE_EDIT:
                designComponent = DesignVersionComponents.findOne({_id: designComponentId});
                break;
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                designComponent = DesignUpdateComponents.findOne({_id: designComponentId});
                break;
        }

        return WorkPackageComponentValidationServices.validateToggleInScope(view, displayContext, userContext, designComponent)
    };
}

export default new WorkPackageComponentValidationApi();
