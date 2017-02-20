
// Ultrawide Services
import { RoleType, TestLocationType, TestLocationAccessType } from '../../constants/constants.js';
import { Validation, TestOutputLocationValidationErrors, TestOutputLocationFileValidationErrors } from '../../constants/validation_errors.js';

//======================================================================================================================
//
// Validation Services for Test Output Locations.
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class TestOutputLocationValidationServices{

    // LOCATIONS -------------------------------------------------------------------------------------------------------

    validateAddLocation(userRole){

        // To add a Location, user must be a Developer
        if(userRole != RoleType.DEVELOPER){
            return TestOutputLocationValidationErrors.LOCATION_INVALID_ROLE_ADD
        }

        return Validation.VALID;
    };

    validateSaveLocation(userRole, location, otherLocations){

        // User must be a Developer
        if(userRole != RoleType.DEVELOPER){
            return TestOutputLocationValidationErrors.LOCATION_INVALID_ROLE_SAVE
        }

        // Location name cannot be the same as another location
        let duplicate = false;
        otherLocations.forEach((otherLocation) => {
            if(otherLocation.locationName === location.locationName){
                duplicate = true;
            }
        });

        if(duplicate){
            return TestOutputLocationValidationErrors.LOCATION_INVALID_NAME_DUPLICATE;
        }

        // If location is remote, the access type must be set
        if(location.locationType === TestLocationType.REMOTE && location.locationAccessType === TestLocationAccessType.NONE){
            return TestOutputLocationValidationErrors.LOCATION_ACCESS_TYPE_NOT_SET;
        }

        return Validation.VALID;
    };

    validateRemoveLocation(userRole){

        // User must be a Developer
        if(userRole != RoleType.DEVELOPER){
            return TestOutputLocationValidationErrors.LOCATION_INVALID_ROLE_REMOVE;
        }

        return Validation.VALID;
    }

    // LOCATION FILES --------------------------------------------------------------------------------------------------

    validateAddLocationFile(userRole){

        // To add a Location File, user must be a Developer
        if(userRole != RoleType.DEVELOPER){
            return TestOutputLocationFileValidationErrors.LOCATION_FILE_INVALID_ROLE_ADD;
        }

        return Validation.VALID;
    }

    validateSaveLocationFile(userRole, locationFile, otherLocationFiles){

        // User must be a Developer
        if(userRole != RoleType.DEVELOPER){
            return TestOutputLocationFileValidationErrors.LOCATION_FILE_INVALID_ROLE_SAVE;
        }

        // Alias must not be same as that for another file at this location
        let duplicate = false;
        otherLocationFiles.forEach((otherLocationFile) => {
            if(otherLocationFile.fileAlias === locationFile.fileAlias){
                duplicate = true;
            }
        });

        if(duplicate){
            return TestOutputLocationFileValidationErrors.LOCATION_FILE_INVALID_ALIAS_DUPLICATE;
        }

        return Validation.VALID;
    }

    validateRemoveLocationFile(userRole){

        // User must be a Developer
        if(userRole != RoleType.DEVELOPER){
            return TestOutputLocationFileValidationErrors.LOCATION_FILE_INVALID_ROLE_REMOVE;
        }

        return Validation.VALID;
    }

    // USER CONFIG -----------------------------------------------------------------------------------------------------

    validateSaveUserConfiguration(){

        return Validation.VALID;
    }


}
export default new TestOutputLocationValidationServices();
