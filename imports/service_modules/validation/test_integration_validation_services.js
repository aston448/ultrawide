
// Ultrawide Services
import { RoleType, ComponentType } from '../../constants/constants.js';
import { Validation, TestIntegrationValidationErrors } from '../../constants/validation_errors.js';

//======================================================================================================================
//
// Validation Services for Test Integration.
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class TestIntegrationValidationServicesClass{

    validateExportIntegrationTests(userRole, designComponent){

        // User must be Developer
        if(userRole !== RoleType.DEVELOPER){
            return TestIntegrationValidationErrors.EXPORT_INT_INVALID_ROLE;
        }

        // Component must exist
        if(!designComponent){
            return TestIntegrationValidationErrors.EXPORT_INT_NO_COMPONENT;
        }

        // Component must be a Feature
        if(designComponent.componentType !== ComponentType.FEATURE){
            return TestIntegrationValidationErrors.EXPORT_INT_NOT_FEATURE;
        }

        return Validation.VALID;
    };

    validateExportUnitTests(userRole, designComponent){

        // User must be Developer
        if(userRole !== RoleType.DEVELOPER){
            return TestIntegrationValidationErrors.EXPORT_UNIT_INVALID_ROLE;
        }

        // Component must exist
        if(!designComponent){
            return TestIntegrationValidationErrors.EXPORT_UNIT_NO_COMPONENT;
        }

        // Component must be a Feature
        if(designComponent.componentType !== ComponentType.FEATURE){
            return TestIntegrationValidationErrors.EXPORT_UNIT_NOT_FEATURE;
        }

        return Validation.VALID;
    };

}
export const TestIntegrationValidationServices = new TestIntegrationValidationServicesClass();
