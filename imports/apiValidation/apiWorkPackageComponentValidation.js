// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections
import { DesignVersions } from '../collections/design/design_versions.js';
import { DesignUpdates } from '../collections/design_update/design_updates.js';
import { WorkPackages } from '../collections/work/work_packages.js';

// Ultrawide Services
import WorkPackageComponentValidationServices from '../service_modules/validation/work_package_component_validation_services.js';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Work Package Component Validation - Supports validations relating to Work Package Scope Components
//
// ---------------------------------------------------------------------------------------------------------------------


class WorkPackageComponentValidationApi {

    validateToggleInScope(view, displayContext){

        return WorkPackageComponentValidationServices.validateToggleInScope(view, displayContext)
    }
}

export default new WorkPackageComponentValidationApi();
