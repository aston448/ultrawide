
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

    addNewSpecificValueTestExpectation(userContext, scenarioReferenceId, testType, callback){

        addNewSpecificValueTestExpectation.call(
            {
                userContext:            userContext,
                scenarioReferenceId:    scenarioReferenceId,
                testType:               testType
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateSpecificValueTestExpectation(expectationId, newValue, callback){

        updateSpecificValueTestExpectation.call(
            {
                expectationId:          expectationId,
                newValue:               newValue
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    removeSpecificValueTestExpectation(expectationId, callback){

        removeSpecificValueTestExpectation.call(
            {
                expectationId:          expectationId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    selectTestType(userContext, scenarioReferenceId, testType, callback){

        selectTestType.call(
            {
                userContext:            userContext,
                scenarioReferenceId:    scenarioReferenceId,
                testType:               testType
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    unselectTestType(userContext, scenarioReferenceId, testType, callback){

        unselectTestType.call(
            {
                userContext:            userContext,
                scenarioReferenceId:    scenarioReferenceId,
                testType:               testType
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    unselectTestTypePermutation(userContext, scenarioReferenceId, testType, permutationId, callback){

        unselectTestTypePermutation.call(
            {
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

    selectTestTypePermutationValue(userContext, scenarioReferenceId, testType, permutationId, permutationValueId, callback){

        selectTestTypePermutationValue.call(
            {
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

    unselectTestTypePermutationValue(userContext, scenarioReferenceId, testType, permutationId, permutationValueId, callback){

        unselectTestTypePermutationValue.call(
            {
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