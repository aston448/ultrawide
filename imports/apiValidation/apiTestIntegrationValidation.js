
// Ultrawide Services
import TestIntegrationValidationServices    from '../service_modules/validation/test_integration_validation_services.js';

// Data Access
import DesignComponentData                  from '../data/design/design_component_db.js';
import DesignUpdateComponentData            from '../data/design_update/design_update_component_db.js';

//======================================================================================================================
//
// Validation API for Test Output Locations
//
//======================================================================================================================

class TestIntegrationValidationApi{

    validateExportIntegrationTests(userRole, userContext){

        let designComponent = null;

        if(userContext.designUpdateId === 'NONE'){

            designComponent = DesignComponentData.getDesignComponentById(userContext.designComponentId);

        } else {

            designComponent = DesignUpdateComponentData.getUpdateComponentById(userContext.designComponentId);

        }

        return TestIntegrationValidationServices.validateExportIntegrationTests(userRole, designComponent);
    };
}
export default new TestIntegrationValidationApi();
