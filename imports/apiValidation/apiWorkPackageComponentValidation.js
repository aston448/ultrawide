// Ultrawide Collections
import { WorkPackageComponents }    from '../collections/work/work_package_components.js';

// Ultrawide Services
import { ComponentType } from '../constants/constants.js';
import { WorkPackageComponentValidationErrors } from '../constants/validation_errors.js';
import WorkPackageComponentValidationServices from '../service_modules/validation/work_package_component_validation_services.js';

//======================================================================================================================
//
// Validation API for Work Package Components
//
//======================================================================================================================

class WorkPackageComponentValidationApi {

    validateToggleInScope(view, displayContext, wpComponentId){

        // Need to return a fail if user is trying to add a specific scenario that is already in scope elsewhere
        const workPackageComponent = WorkPackageComponents.findOne({_id: wpComponentId});

        if(workPackageComponent.componentType === ComponentType.SCENARIO && !workPackageComponent.componentActive){
            // See if this Scenario is already in scope elsewhere
            const otherInstances = WorkPackageComponents.find({
                _id:                    {$ne: workPackageComponent._id},            // Not same WP item
                designVersionId:        workPackageComponent.designVersionId,       // Same Base Design Version
                componentReferenceId:   workPackageComponent.componentReferenceId,  // Same component
                componentActive:        true                                        // Already in scope
            }).fetch();

            if(otherInstances.length > 0){
                return WorkPackageComponentValidationErrors.WORK_PACKAGE_COMPONENT_ALREADY_IN_SCOPE;
            }
        }

        return WorkPackageComponentValidationServices.validateToggleInScope(view, displayContext)
    };
}

export default new WorkPackageComponentValidationApi();
