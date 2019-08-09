
// Ultrawide Services
import { RoleType} from '../../constants/constants.js';
import { Validation, DesignPermutationValidationErrors } from '../../constants/validation_errors.js';

//======================================================================================================================
//
// Validation Services for Design Permutations.
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class DesignPermutationValidationServicesClass {

    // PERMUTATIONS -------------------------------------------------------------------------------------------------------

    validateAddPermutation(userRole){

        // Only a Designer can add a permutation
        if(userRole !== RoleType.DESIGNER){

            return DesignPermutationValidationErrors.PERMUTATION_ADD_INVALID_ROLE;
        }

        return Validation.VALID;
    };

    validateRemovePermutation(userRole, expectationsCount){

        // Only a Designer can remove a permutation
        if(userRole !== RoleType.DESIGNER){

            return DesignPermutationValidationErrors.PERMUTATION_REMOVE_INVALID_ROLE;
        }

        // You can't remove a permutation that is in use for a test expectation
        if(expectationsCount > 0){

            return DesignPermutationValidationErrors.PERMUTATION_REMOVE_IN_USE;
        }

        return Validation.VALID;
    };

    validateSavePermutation(userRole, thisPermutation, otherPermutations){

        // Only a Designer can save a permutation
        if(userRole !== RoleType.DESIGNER){

            return DesignPermutationValidationErrors.PERMUTATION_SAVE_INVALID_ROLE;
        }

        // New name must not be same as existing for Design
        otherPermutations.forEach((permutation) => {

            if(permutation.permutationName === thisPermutation.permutationName){

                return DesignPermutationValidationErrors.PERMUTATION_SAVE_DUPLICATE_NAME;
            }
        });

        return Validation.VALID;
    }


    // PERMUTATION VALUES ----------------------------------------------------------------------------------------------

    validateAddPermutationValue(userRole){

        // Only a Designer can add a permutation value
        if(userRole !== RoleType.DESIGNER){

            return DesignPermutationValidationErrors.PERMUTATION_VALUE_ADD_INVALID_ROLE;
        }

        return Validation.VALID;
    };

    validateRemovePermutationValue(userRole, expectationsCount){

        // Only a Designer can remove a permutation value
        if(userRole !== RoleType.DESIGNER){

            return DesignPermutationValidationErrors.PERMUTATION_VALUE_REMOVE_INVALID_ROLE;
        }

        // You can't remove a permutation value that is in use for a test expectation
        if(expectationsCount > 0){

            return DesignPermutationValidationErrors.PERMUTATION_VALUE_REMOVE_IN_USE;
        }

        return Validation.VALID;
    };

    validateSavePermutationValue(userRole, thisPermutationValue, otherPermutationValues){

        // Only a Designer can save a permutation
        if(userRole !== RoleType.DESIGNER){

            return DesignPermutationValidationErrors.PERMUTATION_VALUE_SAVE_INVALID_ROLE;
        }

        // New name must not be same as existing for same permutation
        otherPermutationValues.forEach((permutationValue) => {

            if(permutationValue.permutationValueName === thisPermutationValue.permutationValueName){

                return DesignPermutationValidationErrors.PERMUTATION_VALUE_SAVE_DUPLICATE_NAME;
            }
        });

        return Validation.VALID;
    }

}
export const DesignPermutationValidationServices = new DesignPermutationValidationServicesClass();