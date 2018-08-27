
// Ultrawide Services
import { RoleType} from '../../constants/constants.js';
import { Validation, DesignPermutationValidationErrors } from '../../constants/validation_errors.js';

//======================================================================================================================
//
// Validation Services for Scenario Test Expectations
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class ScenarioTestExpectationValidationServicesClass {

    validateAddTestTypeExpectation(){

        return Validation.VALID;
    }

    validateAddTestTypePermutationValueExpectation(){

        return Validation.VALID;
    }

    validateRemoveTestTypePermutationValueExpectation(){

        return Validation.VALID;
    }

    validateRemoveTestTypePermutationExpectation(){

        return Validation.VALID;
    }

    validateRemoveTestTypeExpectation(){

        return Validation.VALID;
    }
}
export const ScenarioTestExpectationValidationServices = new ScenarioTestExpectationValidationServicesClass();