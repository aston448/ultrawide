
// Ultrawide Services
import { RoleType } from '../../constants/constants.js';
import { Validation, DesignValidationErrors } from '../../constants/validation_errors.js';

//======================================================================================================================
//
// Validation Services for Test Output Locations.
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class TestOutputLocationValidationServices{

    validateAddLocation(userRole){

        // To add a Location, user must be a Developer
        if(userRole != RoleType.DEVELOPER){ return TestOutputLocationValidationErrors.LOCATION_INVALID_ROLE_ADD }

        return Validation.VALID;
    };


}
export default new TestOutputLocationValidationServices();
