
// Ultrawide Collections
import { DesignVersionComponents }         from '../collections/design/design_version_components.js';
import { DesignUpdateComponents }   from '../collections/design_update/design_update_components.js';

// Ultrawide Services
import TestIntegrationValidationServices from '../service_modules/validation/test_integration_validation_services.js';

//======================================================================================================================
//
// Validation API for Test Output Locations
//
//======================================================================================================================

class TestIntegrationValidationApi{

    validateExportIntegrationTests(userRole, userContext){

        let designComponent = null;

        if(userContext.designUpdateId === 'NONE'){
            designComponent = DesignVersionComponents.findOne({_id: userContext.designComponentId});
        } else {
            designComponent = DesignUpdateComponents.findOne({_id: userContext.designComponentId});
        }

        return TestIntegrationValidationServices.validateExportIntegrationTests(userRole, designComponent);
    };


}
export default new TestIntegrationValidationApi();
