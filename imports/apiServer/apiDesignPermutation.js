
import {
    addPermutation,
    removePermutation,
    savePermutation,
    addPermutationValue,
    removePermutationValue,
    savePermutationValue
} from '../apiValidatedMethods/design_permutation_methods'


// =====================================================================================================================
// Server API for Design Permutations
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================

class ServerDesignPermutationApiClass {

    addPermutation(userRole, designId, callback){

        addPermutation.call(
            {
                userRole:   userRole,
                designId:   designId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    removePermutation(userRole, permutationId, callback){

        removePermutation.call(
            {
                userRole:       userRole,
                permutationId:  permutationId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    savePermutation(userRole, permutation, callback){

        savePermutation.call(
            {
                userRole:       userRole,
                permutation:    permutation
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    addPermutationValue(userRole, permutationId, designVersionId, callback){

        addPermutationValue.call(
            {
                userRole:           userRole,
                permutationId:      permutationId,
                designVersionId:    designVersionId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    removePermutationValue(userRole, permutationValueId, callback){

        removePermutationValue.call(
            {
                userRole:               userRole,
                permutationValueId:     permutationValueId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    savePermutationValue(userRole, permutationValue, callback){

        savePermutationValue.call(
            {
                userRole:           userRole,
                permutationValue:   permutationValue
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

}

export const ServerDesignPermutationApi = new ServerDesignPermutationApiClass();