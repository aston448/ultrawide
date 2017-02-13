
// Ultrawide Collections
import {  } from '../collections/design/designs.js';

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


}
export default new TestOutputLocationValidationApi();
