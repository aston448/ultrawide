
// Ultrawide Services
import { ViewType, DisplayContext, ComponentType, UpdateScopeType, WorkPackageStatus } from '../../constants/constants.js';
import { Validation, WorkPackageComponentValidationErrors } from '../../constants/validation_errors.js';

//======================================================================================================================
//
// Validation Services for Work Package Components.
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class WorkPackageComponentValidationServicesClass {

    validateToggleInScope(view, displayContext, userContext, designComponent, dcWpStatus) {

        // Must be editing a WP to update scope
        if (!(view === ViewType.WORK_PACKAGE_BASE_EDIT || view === ViewType.WORK_PACKAGE_UPDATE_EDIT)) {
            return WorkPackageComponentValidationErrors.WORK_PACKAGE_COMPONENT_INVALID_VIEW_SCOPE;
        }

        // Must be in the scope pane
        if (displayContext !== DisplayContext.WP_SCOPE) {
            return WorkPackageComponentValidationErrors.WORK_PACKAGE_COMPONENT_INVALID_CONTEXT_SCOPE;
        }

        // A Scenario cannot be scoped if already in another WP unless that WP is Closed
        if(designComponent && designComponent.componentType === ComponentType.SCENARIO){

            if(designComponent.workPackageId !== 'NONE' && dcWpStatus !== WorkPackageStatus.WP_CLOSED){
                if(designComponent.workPackageId !== userContext.workPackageId){
                    return WorkPackageComponentValidationErrors.WORK_PACKAGE_COMPONENT_ALREADY_IN_SCOPE;
                }
            }
        }

        // An update WP item can't be scoped if it is not in scope of the update (i.e. in scope or a parent of in scope)
        if(view === ViewType.WORK_PACKAGE_UPDATE_EDIT){
            if(!designComponent){
                return WorkPackageComponentValidationErrors.WORK_PACKAGE_COMPONENT_NOT_SCOPABLE;
            }
            if((designComponent.scopeType !== UpdateScopeType.SCOPE_IN_SCOPE) && (designComponent.scopeType !== UpdateScopeType.SCOPE_PARENT_SCOPE)){
                return WorkPackageComponentValidationErrors.WORK_PACKAGE_COMPONENT_NOT_SCOPABLE;
            }
        }

        return Validation.VALID;
    }
}

export const WorkPackageComponentValidationServices = new WorkPackageComponentValidationServicesClass();
