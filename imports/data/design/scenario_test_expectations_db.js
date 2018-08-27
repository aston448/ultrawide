import {ScenarioTestExpectations} from "../../collections/design/scenario_test_expectations";
import {DefaultItemNames} from "../../constants/default_names";
import {TestType} from "../../constants/constants";



class ScenarioTestExpectationDataClass{

    // INSERT ==========================================================================================================
    insertScenarioTestExpectation(expectationData){

        return ScenarioTestExpectations.insert(
            {
                designVersionId:                expectationData.designVersionId,
                scenarioReferenceId:            expectationData.scenarioReferenceId,
                testType:                       expectationData.testType,
                permutationId:                  expectationData.permutationId,
                permutationValueId:             expectationData.permutationValueId,
                expectationStatus:              expectationData.expectationStatus
            }
        );
    }


    // SELECT ==========================================================================================================

    getScenarioTestExpectationById(expectationId){

        return ScenarioTestExpectations.findOne({
            _id: expectationId
        });
    }

    getScenarioTestExpectationsForScenario(designVersionId, scenarioReferenceId){

        return ScenarioTestExpectations.find({
            designVersionId:        designVersionId,
            scenarioReferenceId:    scenarioReferenceId
        }).fetch();
    }

    getScenarioTestExpectationsForScenarioTestType(designVersionId, scenarioReferenceId, testType){

            return ScenarioTestExpectations.find({
                designVersionId:        designVersionId,
                scenarioReferenceId:    scenarioReferenceId,
                testType:               testType
            }).fetch();
    }

    getScenarioTestExpectationsForScenarioTestTypePermutationValue(designVersionId, scenarioReferenceId, testType, permutationId, permutationValueId){

        return ScenarioTestExpectations.find({
            designVersionId:        designVersionId,
            scenarioReferenceId:    scenarioReferenceId,
            testType:               testType,
            permutationId:          permutationId,
            permutationValueId:     permutationValueId,
        }).fetch();
    }

    // UPDATE ==========================================================================================================


    // Called when permutations are removed but basic test expectations remain
    removePermutationExpectations(expectationId){

        return ScenarioTestExpectations.update(
            {_id: expectationId},
            {
                $set:{
                    permutationId: 'NONE',
                    permutationValueId: 'NONE'
                }
            }
        );
    }



    // REMOVE ==========================================================================================================

    removeScenarioTestExpectation(expectationId){

        return ScenarioTestExpectations.remove({
            _id: expectationId
        });
    }

    removeScenarioTestExpectationsForTestType(designVersionId, scenarioReferenceId, testType){

        return ScenarioTestExpectations.remove({
            designVersionId:        designVersionId,
            scenarioReferenceId:    scenarioReferenceId,
            testType:               testType
        });
    }

    removeScenarioTestExpectationsForTestTypePermutation(designVersionId, scenarioReferenceId, testType, permutationId){

        return ScenarioTestExpectations.remove({
            designVersionId:        designVersionId,
            scenarioReferenceId:    scenarioReferenceId,
            testType:               testType,
            permutationId:          permutationId
        });
    }

    removeScenarioTestExpectationForTestTypePermutationValue(designVersionId, scenarioReferenceId, testType, permutationId, permutationValueId){

        return ScenarioTestExpectations.remove({
            designVersionId:        designVersionId,
            scenarioReferenceId:    scenarioReferenceId,
            testType:               testType,
            permutationId:          permutationId,
            permutationValueId:     permutationValueId
        });
    }

}

export const ScenarioTestExpectationData = new ScenarioTestExpectationDataClass();