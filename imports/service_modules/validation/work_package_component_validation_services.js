// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections

// Ultrawide Services
import { ViewType, DisplayContext } from '../../constants/constants.js';
import { Validation, WorkPackageComponentValidationErrors } from '../../constants/validation_errors.js';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Work Package Component Validation - Supports validations relating to Work Package Scope Components
//
// ---------------------------------------------------------------------------------------------------------------------

class WorkPackageComponentValidationServices{

    validateToggleInScope(view, displayContext) {

        // Must be editing a WP to update scope
        if (!(view === ViewType.WORK_PACKAGE_BASE_EDIT || view === ViewType.WORK_PACKAGE_UPDATE_EDIT)) {
            return WorkPackageComponentValidationErrors.WORK_PACKAGE_COMPONENT_INVALID_VIEW_SCOPE;
        }

        // Must be in the scope pane
        if (displayContext != DisplayContext.WP_SCOPE) {
            return WorkPackageComponentValidationErrors.WORK_PACKAGE_COMPONENT_INVALID_CONTEXT_SCOPE;
        }

        return Validation.VALID;
    }
}

export default new WorkPackageComponentValidationServices();
