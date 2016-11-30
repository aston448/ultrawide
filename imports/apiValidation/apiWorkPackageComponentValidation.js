
// Ultrawide Services
import WorkPackageComponentValidationServices from '../service_modules/validation/work_package_component_validation_services.js';

//======================================================================================================================
//
// Validation API for Work Package Components
//
//======================================================================================================================

class WorkPackageComponentValidationApi {

    validateToggleInScope(view, displayContext){

        return WorkPackageComponentValidationServices.validateToggleInScope(view, displayContext)
    };
}

export default new WorkPackageComponentValidationApi();
