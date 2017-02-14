
// Ultrawide Services
import { RoleType } from '../../constants/constants.js';
import { Validation, TestOutputLocationValidationErrors } from '../../constants/validation_errors.js';

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
        if(userRole != RoleType.DEVELOPER){
            return TestOutputLocationValidationErrors.LOCATION_INVALID_ROLE_ADD
        }

        return Validation.VALID;
    };

    validateSaveLocation(userRole, location){

        // User must be a Developer
        if(userRole != RoleType.DEVELOPER){
            return TestOutputLocationValidationErrors.LOCATION_INVALID_ROLE_SAVE
        }


        // TODO - can add more validation of the details here

        return Validation.VALID;
    };

    validateRemoveLocation(userRole){

        // User must be a Developer
        if(userRole != RoleType.DEVELOPER){
            return TestOutputLocationValidationErrors.LOCATION_INVALID_ROLE_REMOVE
        }

        return Validation.VALID;
    }


}
export default new TestOutputLocationValidationServices();
