
// Ultrawide Services
import { RoleType} from '../../constants/constants.js';
import { Validation, TestExpectationValidationErrors } from '../../constants/validation_errors.js';

//======================================================================================================================
//
// Validation Services for Scenario Test Expectations
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class ScenarioTestExpectationValidationServicesClass {

    validateAddTestTypeExpectation(userRole){

        if(userRole !== RoleType.DESIGNER){

            return TestExpectationValidationErrors.EXPECTATION_ADD_INVALID_ROLE;
        }

        return Validation.VALID;
    }

    validateUpdateTestTypeExpectation(userRole){

        if(userRole !== RoleType.DESIGNER){

            return TestExpectationValidationErrors.EXPECTATION_UPDATE_INVALID_ROLE;
        }

        return Validation.VALID;
    }


    validateAddTestTypePermutationValueExpectation(userRole){

        if(userRole !== RoleType.DESIGNER){

            return TestExpectationValidationErrors.EXPECTATION_ADD_INVALID_ROLE;
        }

        return Validation.VALID;
    }

    validateRemoveTestTypePermutationValueExpectation(userRole){

        if(userRole !== RoleType.DESIGNER){

            return TestExpectationValidationErrors.EXPECTATION_REMOVE_INVALID_ROLE;
        }

        return Validation.VALID;
    }

    validateRemoveTestTypePermutationExpectation(userRole){

        if(userRole !== RoleType.DESIGNER){

            return TestExpectationValidationErrors.EXPECTATION_REMOVE_INVALID_ROLE;
        }

        return Validation.VALID;
    }

    validateRemoveTestTypeExpectation(userRole){

        if(userRole !== RoleType.DESIGNER){

            return TestExpectationValidationErrors.EXPECTATION_REMOVE_INVALID_ROLE;
        }

        return Validation.VALID;
    }
}
export const ScenarioTestExpectationValidationServices = new ScenarioTestExpectationValidationServicesClass();