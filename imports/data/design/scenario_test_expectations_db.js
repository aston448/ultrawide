
import {ScenarioTestExpectations} from "../../collections/design/scenario_test_expectations";

class ScenarioTestExpectationDataClass{

    // INSERT ==========================================================================================================
    insertScenarioTestExpectation(expectationData){

        return ScenarioTestExpectations.insert(
            {
                designVersionId:                expectationData.designVersionId,
                scenarioReferenceId:            expectationData.scenarioReferenceId,
                testType:                       expectationData.testType,
                permutationId:                  expectationData.permutationId,
                permutationValueId:             expectationData.permutationValueId
            }
        );
    }

    bulkInsert(batchData){
        ScenarioTestExpectations.batchInsert(batchData);
    }

    // SELECT ==========================================================================================================

    getScenarioTestExpectationById(expectationId){

        return ScenarioTestExpectations.findOne({
            _id: expectationId
        });
    }

    getScenarioTestTypeExpectation(designVersionId, scenarioReferenceId, testType){

        // There can be only one...

        return ScenarioTestExpectations.findOne({
            designVersionId:        designVersionId,
            scenarioReferenceId:    scenarioReferenceId,
            testType:               testType,
            permutationId:          'NONE',
            permutationValueId:     'NONE'
        });
    }

    getScenarioTestExpectationsForScenario(designVersionId, scenarioReferenceId){

        return ScenarioTestExpectations.find({
            designVersionId:        designVersionId,
            scenarioReferenceId:    scenarioReferenceId
        }).fetch();
    }

    getPermutationValuesForScenarioTestType(designVersionId, scenarioReferenceId, testType){

        return ScenarioTestExpectations.find({
            designVersionId:        designVersionId,
            scenarioReferenceId:    scenarioReferenceId,
            testType:               testType,
            permutationValueId:     {$ne: 'NONE'}
        }).fetch();
    }

    getPermutationValuesForScenarioTestTypePerm(designVersionId, scenarioReferenceId, testType, permId){

        return ScenarioTestExpectations.find({
            designVersionId:        designVersionId,
            scenarioReferenceId:    scenarioReferenceId,
            testType:               testType,
            permutationId:          permId,
            permutationValueId:     {$ne: 'NONE'}
        }).fetch();
    }

    getScenarioTestExpectationsForScenarioTestType(designVersionId, scenarioReferenceId, testType){

            return ScenarioTestExpectations.find({
                designVersionId:        designVersionId,
                scenarioReferenceId:    scenarioReferenceId,
                testType:               testType
            }).fetch();
    }

    getScenarioTestExpectationForScenarioTestTypePermutationValue(designVersionId, scenarioReferenceId, testType, permutationId, permutationValueId){

        // There can be only one...

        return ScenarioTestExpectations.findOne({
            designVersionId:        designVersionId,
            scenarioReferenceId:    scenarioReferenceId,
            testType:               testType,
            permutationId:          permutationId,
            permutationValueId:     permutationValueId,
        });
    }

    getAllTestExpectationsForDesignVersion(designVersionId){

        return ScenarioTestExpectations.find({
            designVersionId:        designVersionId
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

    setExpectationPermutationValueTestStatus(expectationId, testResult){

        return ScenarioTestExpectations.update(
            {_id: expectationId},
            {
                $set:{
                    expectationStatus: testResult
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