
import {
    selectTestType,
    unselectTestType,
    unselectTestTypePermutation,
    selectTestTypePermutationValue,
    unselectTestTypePermutationValue,
    addNewSpecificValueTestExpectation,
    updateSpecificValueTestExpectation,
    removeSpecificValueTestExpectation
} from '../apiValidatedMethods/scenario_test_expectation_methods.js'


// =====================================================================================================================
// Server API for Scenario Test Expectations
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================

class ServerScenarioTestExpectationApiClass {

    addNewSpecificValueTestExpectation(userRole, userContext, scenarioReferenceId, testType, callback){

        addNewSpecificValueTestExpectation.call(
            {
                userRole:               userRole,
                userContext:            userContext,
                scenarioReferenceId:    scenarioReferenceId,
                testType:               testType
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateSpecificValueTestExpectation(userRole, expectationId, newValue, callback){

        updateSpecificValueTestExpectation.call(
            {
                userRole:               userRole,
                expectationId:          expectationId,
                newValue:               newValue
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    removeSpecificValueTestExpectation(userRole, expectationId, callback){

        removeSpecificValueTestExpectation.call(
            {
                userRole:               userRole,
                expectationId:          expectationId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    selectTestType(userRole, userContext, scenarioReferenceId, testType, callback){

        selectTestType.call(
            {
                userRole:               userRole,
                userContext:            userContext,
                scenarioReferenceId:    scenarioReferenceId,
                testType:               testType
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    unselectTestType(userRole, userContext, scenarioReferenceId, testType, callback){

        unselectTestType.call(
            {
                userRole:               userRole,
                userContext:            userContext,
                scenarioReferenceId:    scenarioReferenceId,
                testType:               testType
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    unselectTestTypePermutation(userRole, userContext, scenarioReferenceId, testType, permutationId, callback){

        unselectTestTypePermutation.call(
            {
                userRole:               userRole,
                userContext:            userContext,
                scenarioReferenceId:    scenarioReferenceId,
                testType:               testType,
                permutationId:          permutationId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

    selectTestTypePermutationValue(userRole, userContext, scenarioReferenceId, testType, permutationId, permutationValueId, callback){

        selectTestTypePermutationValue.call(
            {
                userRole:               userRole,
                userContext:            userContext,
                scenarioReferenceId:    scenarioReferenceId,
                testType:               testType,
                permutationId:          permutationId,
                permutationValueId:     permutationValueId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

    unselectTestTypePermutationValue(userRole, userContext, scenarioReferenceId, testType, permutationId, permutationValueId, callback){

        unselectTestTypePermutationValue.call(
            {
                userRole:               userRole,
                userContext:            userContext,
                scenarioReferenceId:    scenarioReferenceId,
                testType:               testType,
                permutationId:          permutationId,
                permutationValueId:     permutationValueId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

}

export const ServerScenarioTestExpectationApi = new ServerScenarioTestExpectationApiClass();