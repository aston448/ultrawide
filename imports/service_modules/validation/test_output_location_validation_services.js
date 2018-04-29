
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

class TestOutputLocationValidationServicesClass {

    // LOCATIONS -------------------------------------------------------------------------------------------------------

    validateAddLocation(userRole){

        return Validation.VALID;
    };

    validateSaveLocation(userRole, location, otherLocations){

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

        // Location path cannot be the same as another location
        otherLocations.forEach((otherLocation) => {
            if(otherLocation.locationFullPath === location.locationFullPath){
                duplicate = true;
            }
        });

        if(duplicate){
            return TestOutputLocationValidationErrors.LOCATION_INVALID_PATH_DUPLICATE;
        }

        return Validation.VALID;
    };

    validateRemoveLocation(userRole){

        return Validation.VALID;
    }

    // LOCATION FILES --------------------------------------------------------------------------------------------------

    validateAddLocationFile(userRole){

        return Validation.VALID;
    }

    validateSaveLocationFile(userRole, locationFile, otherLocationFiles){

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

        // Name must not be the same as that for another file at this location
        otherLocationFiles.forEach((otherLocationFile) => {
            if(otherLocationFile.fileName === locationFile.fileName){
                duplicate = true;
            }
        });

        if(duplicate){
            return TestOutputLocationFileValidationErrors.LOCATION_FILE_INVALID_NAME_DUPLICATE;
        }

        return Validation.VALID;
    }

    validateRemoveLocationFile(userRole){

        return Validation.VALID;
    }

    // USER CONFIG -----------------------------------------------------------------------------------------------------

    validateSaveUserConfiguration(){

        return Validation.VALID;
    }


}
export const TestOutputLocationValidationServices = new TestOutputLocationValidationServicesClass();
