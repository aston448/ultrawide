// Ultrawide Services
import { ScenarioTestExpectationValidationServices } from '../service_modules/validation/scenario_test_expectation_validation_services.js';

// Data Access


//======================================================================================================================
//
// Validation API for Scenario Test Expectations
//
//======================================================================================================================

class ScenarioTestExpectationValidationApiClass {


    validateAddTestTypeExpectation(userRole){

        return ScenarioTestExpectationValidationServices.validateAddTestTypeExpectation(userRole);
    }

    validateUpdateTestTypeExpectation(userRole){

        return ScenarioTestExpectationValidationServices.validateUpdateTestTypeExpectation(userRole);
    }

    validateAddTestTypePermutationValueExpectation(userRole){

        return ScenarioTestExpectationValidationServices.validateAddTestTypePermutationValueExpectation(userRole);
    }

    validateRemoveTestTypePermutationValueExpectation(userRole){

        return ScenarioTestExpectationValidationServices.validateRemoveTestTypePermutationValueExpectation(userRole);
    }

    validateRemoveTestTypePermutationExpectation(userRole){

        return ScenarioTestExpectationValidationServices.validateRemoveTestTypePermutationExpectation(userRole);
    }

    validateRemoveTestTypeExpectation(userRole){

        return ScenarioTestExpectationValidationServices.validateRemoveTestTypeExpectation(userRole);
    }

}
export const ScenarioTestExpectationValidationApi = new ScenarioTestExpectationValidationApiClass();