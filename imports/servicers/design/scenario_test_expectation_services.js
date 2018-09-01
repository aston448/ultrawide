// Ultrawide Services

import { ScenarioTestExpectationData }  from '../../data/design/scenario_test_expectations_db.js';

import {TestType, LogLevel, MashTestStatus} from "../../constants/constants";

import {log} from '../../common/utils.js';

//======================================================================================================================
//
// Server Code for Scenario Test Expectations
//
// Methods called directly by Server API
//
//======================================================================================================================

class ScenarioTestExpectationServicesClass{

    // Insert one expection for Scenario-Permutation-PermutationValue.  Where latter two are 'NONE' its just a general expectation for the scenario
    insertTestExpectation(expectationData){

        const result = ScenarioTestExpectationData.insertScenarioTestExpectation(expectationData);
    }

    removeTestExpectation(expectationId){

        const result = ScenarioTestExpectationData.removeScenarioTestExpectation(expectationId);
    }

    // User Actions ----------------------------------------------------------------------------------------------------

    // Select Test Type - set basic test type expectation
    selectTestType(designVersionId, scenarioReferenceId, testType){

        // Data check - should not already exist
        const expectation = ScenarioTestExpectationData.getScenarioTestExpectationsForScenarioTestType(designVersionId, scenarioReferenceId, testType);

        if(expectation.length === 0){

            const expectationData = {
                designVersionId:                designVersionId,
                scenarioReferenceId:            scenarioReferenceId,
                testType:                       testType,
                permutationId:                  'NONE',
                permutationValueId:             'NONE',
                expectationStatus:              MashTestStatus.MASH_NOT_LINKED
            };

            ScenarioTestExpectationData.insertScenarioTestExpectation(expectationData);

            // And mark the Scenario as requiring the test


        } else {
            // Log a warning as should not be happening
            log((msg) => console.log(msg), LogLevel.WARNING, 'Test expectation already existed - not adding to Scenario Test Expectations', testType);
        }
    }

    // Unselect Test Type - clear all underlying expectations
    unselectTestType(designVersionId, scenarioReferenceId, testType){

        ScenarioTestExpectationData.removeScenarioTestExpectationsForTestType(designVersionId, scenarioReferenceId, testType);
    }

    // Unselect Permutation - clear all permutation value expectations
    unselectTestTypePermutation(designVersionId, scenarioReferenceId, testType, permutationId){

        ScenarioTestExpectationData.removeScenarioTestExpectationsForTestTypePermutation(designVersionId, scenarioReferenceId, testType, permutationId);
    }

    // Select Permutation Value - set expectation for value
    selectTestTypePermutationValue(designVersionId, scenarioReferenceId, testType, permutationId, permutationValueId){

        // Data check - should not already exist
        const expectation = ScenarioTestExpectationData.getScenarioTestExpectationForScenarioTestTypePermutationValue(designVersionId, scenarioReferenceId, testType, permutationId, permutationValueId);

        if(expectation){

            // Log a warning as should not be happening
            log((msg) => console.log(msg), LogLevel.WARNING, 'Test expectation already existed - not adding to Scenario Test Expectations', testType);

        } else {

            const expectationData = {
                designVersionId:                designVersionId,
                scenarioReferenceId:            scenarioReferenceId,
                testType:                       testType,
                permutationId:                  permutationId,
                permutationValueId:             permutationValueId,
                expectationStatus:              MashTestStatus.MASH_NOT_LINKED
            };

            ScenarioTestExpectationData.insertScenarioTestExpectation(expectationData);
         }
    }

    // Unselect Permutation Value - clear expectation for value
    unselectTestTypePermutationValue(designVersionId, scenarioReferenceId, testType, permutationId, permutationValueId){

        ScenarioTestExpectationData.removeScenarioTestExpectationForTestTypePermutationValue(designVersionId, scenarioReferenceId, testType, permutationId, permutationValueId);
    }

}

export const ScenarioTestExpectationServices = new ScenarioTestExpectationServicesClass();