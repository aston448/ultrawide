
// Ultrawide Services
import { DesignPermutationValidationServices } from '../service_modules/validation/design_permutation_validation_services.js';

// Data Access
import { DesignPermutationData }                from '../data/design/design_permutation_db.js';
import { DesignPermutationValueData }           from '../data/design/design_permutation_value_db.js';
import {ScenarioTestExpectationData}            from "../data/design/scenario_test_expectations_db";

//======================================================================================================================
//
// Validation API for Design Permutations
//
//======================================================================================================================

class DesignPermutationValidationApiClass {

    validateAddPermutation(userRole){

        return DesignPermutationValidationServices.validateAddPermutation(userRole);
    };

    validateRemovePermutation(userRole, permutationId){

        const expectationCount = ScenarioTestExpectationData.getExpectationsWithPermutationCount(permutationId);

        return DesignPermutationValidationServices.validateRemovePermutation(userRole, expectationCount);
    };

    validateSavePermutation(userRole, permutation){

        const otherPermutations = DesignPermutationData.getOtherPermutationsForDesign(permutation.designId, permutation._id);

        return DesignPermutationValidationServices.validateSavePermutation(userRole, permutation, otherPermutations);
    }

    validateAddPermutationValue(userRole){

        return DesignPermutationValidationServices.validateAddPermutationValue(userRole);
    };

    validateRemovePermutationValue(userRole, permutationValueId){

        const expectationCount = ScenarioTestExpectationData.getExpectationsWithPermutationValueCount(permutationValueId);

        return DesignPermutationValidationServices.validateRemovePermutationValue(userRole, expectationCount);
    };

    validateSavePermutationValue(userRole, permutationValue){

        const otherPermutationValues = DesignPermutationValueData.getOtherValuesForPermutation(permutationValue.permutationId, permutationValue.designVersionId, permutationValue._id);

        return DesignPermutationValidationServices.validateSavePermutationValue(userRole, permutationValue, otherPermutationValues);
    }

}
export const DesignPermutationValidationApi = new DesignPermutationValidationApiClass();