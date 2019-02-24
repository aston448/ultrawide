// Ultrawide Services

import { ScenarioTestExpectationData }  from '../../data/design/scenario_test_expectations_db.js';

import { LogLevel, MashTestStatus} from "../../constants/constants";

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
    selectTestType(userContext, scenarioReferenceId, testType){

        if(Meteor.isServer) {
            // Data check - should not already exist
            const expectation = ScenarioTestExpectationData.getScenarioTestExpectationsForScenarioTestType(userContext.designVersionId, scenarioReferenceId, testType);

            if (expectation.length === 0) {

                const expectationData = {
                    designVersionId:        userContext.designVersionId,
                    scenarioReferenceId:    scenarioReferenceId,
                    testType:               testType,
                    permutationId:          'NONE',
                    permutationValueId:     'NONE',
                    expectationStatus:       MashTestStatus.MASH_NOT_LINKED
                };

                ScenarioTestExpectationData.insertScenarioTestExpectation(expectationData);

            } else {
                // Log a warning as should not be happening
                log((msg) => console.log(msg), LogLevel.WARNING, 'Test expectation already existed - not adding to Scenario Test Expectations', testType);
            }
        }
    }

    // Unselect Test Type - clear all underlying expectations
    unselectTestType(userContext, scenarioReferenceId, testType){

        if(Meteor.isServer) {
            ScenarioTestExpectationData.removeScenarioTestExpectationsForTestType(userContext.designVersionId, scenarioReferenceId, testType);
        }
    }

    // Unselect Permutation - clear all permutation value expectations
    unselectTestTypePermutation(userContext, scenarioReferenceId, testType, permutationId){

        if(Meteor.isServer) {
            ScenarioTestExpectationData.removeScenarioTestExpectationsForTestTypePermutation(userContext.designVersionId, scenarioReferenceId, testType, permutationId);
        }
    }

    // Select Permutation Value - set expectation for value
    selectTestTypePermutationValue(userContext, scenarioReferenceId, testType, permutationId, permutationValueId){

        if(Meteor.isServer) {
            // Data check - should not already exist
            const expectation = ScenarioTestExpectationData.getScenarioTestExpectationForScenarioTestTypePermutationValue(userContext.designVersionId, scenarioReferenceId, testType, permutationId, permutationValueId);

            if (expectation) {

                // Log a warning as should not be happening
                log((msg) => console.log(msg), LogLevel.WARNING, 'Test expectation already existed - not adding to Scenario Test Expectations', testType);

            } else {

                const expectationData = {
                    designVersionId: userContext.designVersionId,
                    scenarioReferenceId: scenarioReferenceId,
                    testType: testType,
                    permutationId: permutationId,
                    permutationValueId: permutationValueId,
                    expectationStatus: MashTestStatus.MASH_NOT_LINKED
                };

                const expectationId = ScenarioTestExpectationData.insertScenarioTestExpectation(expectationData);

                console.log('Inserted new test expectation for value %s', expectationId);

            }

        }
    }

    // Unselect Permutation Value - clear expectation for value
    unselectTestTypePermutationValue(userContext, scenarioReferenceId, testType, permutationId, permutationValueId){

        if(Meteor.isServer) {
            ScenarioTestExpectationData.removeScenarioTestExpectationForTestTypePermutationValue(userContext.designVersionId, scenarioReferenceId, testType, permutationId, permutationValueId);
        }
    }

}

export const ScenarioTestExpectationServices = new ScenarioTestExpectationServicesClass();