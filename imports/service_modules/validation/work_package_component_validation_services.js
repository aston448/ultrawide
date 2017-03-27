
// Ultrawide Services
import { ViewType, DisplayContext, ComponentType } from '../../constants/constants.js';
import { Validation, WorkPackageComponentValidationErrors } from '../../constants/validation_errors.js';

//======================================================================================================================
//
// Validation Services for Work Package Components.
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class WorkPackageComponentValidationServices{

    validateToggleInScope(view, displayContext, userContext, designComponent) {

        // Must be editing a WP to update scope
        if (!(view === ViewType.WORK_PACKAGE_BASE_EDIT || view === ViewType.WORK_PACKAGE_UPDATE_EDIT)) {
            return WorkPackageComponentValidationErrors.WORK_PACKAGE_COMPONENT_INVALID_VIEW_SCOPE;
        }

        // Must be in the scope pane
        if (displayContext !== DisplayContext.WP_SCOPE) {
            return WorkPackageComponentValidationErrors.WORK_PACKAGE_COMPONENT_INVALID_CONTEXT_SCOPE;
        }

        // A Scenario cannot be scoped if already in another WP
        if(designComponent.componentType === ComponentType.SCENARIO){

            if(designComponent.workPackageId !== 'NONE'){
                if(designComponent.workPackageId !== userContext.workPackageId){
                    return WorkPackageComponentValidationErrors.WORK_PACKAGE_COMPONENT_ALREADY_IN_SCOPE;
                }
            }
        }

        return Validation.VALID;
    }
}

export default new WorkPackageComponentValidationServices();
