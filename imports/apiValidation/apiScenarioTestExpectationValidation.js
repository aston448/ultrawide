// Ultrawide Services
import { ScenarioTestExpectationValidationServices } from '../service_modules/validation/scenario_test_expectation_validation_services.js';

// Data Access


//======================================================================================================================
//
// Validation API for Scenario Test Expectations
//
//======================================================================================================================

class ScenarioTestExpectationValidationApiClass {


    validateAddTestTypeExpectation(){

        return ScenarioTestExpectationValidationServices.validateAddTestTypeExpectation();
    }

    validateAddTestTypePermutationValueExpectation(){

        return ScenarioTestExpectationValidationServices.validateAddTestTypePermutationValueExpectation();
    }

    validateRemoveTestTypePermutationValueExpectation(){

        return ScenarioTestExpectationValidationServices.validateRemoveTestTypePermutationValueExpectation();
    }

    validateRemoveTestTypePermutationExpectation(){

        return ScenarioTestExpectationValidationServices.validateRemoveTestTypePermutationExpectation();
    }

    validateRemoveTestTypeExpectation(){

        return ScenarioTestExpectationValidationServices.validateRemoveTestTypeExpectation();
    }

}
export const ScenarioTestExpectationValidationApi = new ScenarioTestExpectationValidationApiClass();