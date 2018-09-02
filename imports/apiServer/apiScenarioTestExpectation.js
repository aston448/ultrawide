
import {
    selectTestType,
    unselectTestType,
    unselectTestTypePermutation,
    selectTestTypePermutationValue,
    unselectTestTypePermutationValue,
    updateScenarioExpectationStatus
} from '../apiValidatedMethods/scenario_test_expectation_methods.js'


// =====================================================================================================================
// Server API for Scenario Test Expectations
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================

class ServerScenarioTestExpectationApiClass {

    selectTestType(designVersionId, scenarioReferenceId, testType, callback){

        selectTestType.call(
            {
                designVersionId:        designVersionId,
                scenarioReferenceId:    scenarioReferenceId,
                testType:               testType
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    unselectTestType(designVersionId, scenarioReferenceId, testType, callback){

        unselectTestType.call(
            {
                designVersionId:        designVersionId,
                scenarioReferenceId:    scenarioReferenceId,
                testType:               testType
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    unselectTestTypePermutation(designVersionId, scenarioReferenceId, testType, permutationId, callback){

        unselectTestTypePermutation.call(
            {
                designVersionId:        designVersionId,
                scenarioReferenceId:    scenarioReferenceId,
                testType:               testType,
                permutationId:          permutationId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    }

    selectTestTypePermutationValue(designVersionId, scenarioReferenceId, testType, permutationId, permutationValueId, callback){

        selectTestTypePermutationValue.call(
            {
                designVersionId:        designVersionId,
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

    unselectTestTypePermutationValue(designVersionId, scenarioReferenceId, testType, permutationId, permutationValueId, callback){

        unselectTestTypePermutationValue.call(
            {
                designVersionId:        designVersionId,
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

    updateScenarioExpectationStatus(userContext, scenarioReferenceId, callback){

        updateScenarioExpectationStatus.call(
            {
                userContext,
                scenarioReferenceId
            },
            (err, result) => {
                callback(err, result);
            }
        )
    }
}

export const ServerScenarioTestExpectationApi = new ServerScenarioTestExpectationApiClass();