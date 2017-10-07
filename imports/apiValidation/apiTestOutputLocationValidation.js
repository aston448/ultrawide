
// Ultrawide Services
import TestOutputLocationValidationServices from '../service_modules/validation/test_output_location_validation_services.js';

// Data Access
import TestOutputLocationData               from '../data/configure/test_output_location_db.js';

//======================================================================================================================
//
// Validation API for Test Output Locations
//
//======================================================================================================================

class TestOutputLocationValidationApi{

    validateAddLocation(userRole){

        return TestOutputLocationValidationServices.validateAddLocation(userRole);
    };

    validateSaveLocation(userRole, location){

        const otherLocations = TestOutputLocationData.getOtherLocations(location._id);

        return TestOutputLocationValidationServices.validateSaveLocation(userRole, location, otherLocations);
    };

    validateRemoveLocation(userRole){

        return TestOutputLocationValidationServices.validateRemoveLocation(userRole);
    };

    validateAddLocationFile(userRole){

        return TestOutputLocationValidationServices.validateAddLocationFile(userRole);
    };

    validateSaveLocationFile(userRole, locationFile){

        // Get other files for this location
        const otherLocationFiles = TestOutputLocationData.getOtherLocationFiles(locationFile.locationId, locationFile._id);

        return TestOutputLocationValidationServices.validateSaveLocationFile(userRole, locationFile, otherLocationFiles);
    }

    validateRemoveLocationFile(userRole){

        return TestOutputLocationValidationServices.validateRemoveLocationFile(userRole);
    }

    validateSaveUserConfiguration(){

        return TestOutputLocationValidationServices.validateSaveUserConfiguration();
    }

}
export default new TestOutputLocationValidationApi();
