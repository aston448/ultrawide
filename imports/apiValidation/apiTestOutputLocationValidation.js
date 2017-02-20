
// Ultrawide Collections
import { TestOutputLocations }          from '../collections/configure/test_output_locations.js';
import { TestOutputLocationFiles }      from '../collections/configure/test_output_location_files.js';

// Ultrawide Services
import TestOutputLocationValidationServices from '../service_modules/validation/test_output_location_validation_services.js';

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

        const otherLocations = TestOutputLocations.find({_id: {$ne: location._id}}).fetch();

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
        const otherLocationFiles = TestOutputLocationFiles.find({
            _id: {$ne: locationFile._id},
            locationId: locationFile.locationId
        }).fetch();

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
