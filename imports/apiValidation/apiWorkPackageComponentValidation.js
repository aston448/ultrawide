// Ultrawide Collections
import { WorkPackages }             from '../collections/work/work_packages.js';
import { WorkPackageComponents }    from '../collections/work/work_package_components.js';


// Ultrawide Services
import WorkPackageComponentValidationServices from '../service_modules/validation/work_package_component_validation_services.js';

//======================================================================================================================
//
// Validation API for Work Package Components
//
//======================================================================================================================

class WorkPackageComponentValidationApi {

    validateToggleInScope(view, displayContext, wpComponentId){

        //TODO - Add validation to prevent 2 scenarios being in different WPs
        // Need to return a fail if user is trying to add a specific scenario that is already in scope elsewhere
        // const workPackageComponent = WorkPackageComponents.findOne({_id: wpComponentId});
        // const workPackage = WorkPackages.findOne({_id: workPackageComponent.workPackageId});
        //const otherComponents = workPackageComponents.find


        return WorkPackageComponentValidationServices.validateToggleInScope(view, displayContext)
    };
}

export default new WorkPackageComponentValidationApi();
