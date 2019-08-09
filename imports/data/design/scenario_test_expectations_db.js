
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

    getAllTestTypeExpectations(designVersionId, scenarioReferenceId){

        return ScenarioTestExpectations.find({
            designVersionId:        designVersionId,
            scenarioReferenceId:    scenarioReferenceId,
            permutationId:          'NONE',
            permutationValueId:     'NONE'
        }).fetch();
    }

    getScenarioTestExpectationsForScenario(designVersionId, scenarioReferenceId){

        return ScenarioTestExpectations.find({
            designVersionId:        designVersionId,
            scenarioReferenceId:    scenarioReferenceId
        }).fetch();
    }

    getPermutationTestExpectationsForScenario(designVersionId, scenarioReferenceId){

        return ScenarioTestExpectations.find({
            designVersionId:        designVersionId,
            scenarioReferenceId:    scenarioReferenceId,
            permutationValueId:     {$ne: 'NONE'}
        }).fetch();
    }

    getPermutationExpectationsForScenarioTestType(designVersionId, scenarioReferenceId, testType){

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

    getScenarioTestExpectationsForScenarioTestTypeValuePermutationValue(designVersionId, scenarioReferenceId, testType){

        return ScenarioTestExpectations.find({
            designVersionId:        designVersionId,
            scenarioReferenceId:    scenarioReferenceId,
            testType:               testType,
            permutationId:          'VALUE',
            permutationValueId:     'VALUE',
        }).fetch();
    }

    getAllTestExpectationsForDesignVersion(designVersionId){

        return ScenarioTestExpectations.find({
            designVersionId:    designVersionId
        }).fetch();
    }

    getExpectationsWithPermutationCount(permutationId){
        return ScenarioTestExpectations.find({
            permutationId:      permutationId
        }).count();
    }

    getExpectationsWithPermutationValueCount(permutationValueId){
        return ScenarioTestExpectations.find({
            permutationValueId: permutationValueId
        }).count();
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

    updateValuePermutationValue(expectationId, newValue){

        return ScenarioTestExpectations.update(
            {
                _id: expectationId,
            },
            {
                $set:{
                    valuePermutationValue: newValue
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

    removeAllExpectationsForScenario(designVersionId, scenarioReferenceId){

        return ScenarioTestExpectations.remove(
            {
                designVersionId:        designVersionId,
                scenarioReferenceId:    scenarioReferenceId
            }
        );
    }

    removeScenarioTestExpectationsForTestType(designVersionId, scenarioReferenceId, testType){

        return ScenarioTestExpectations.remove(
            {
                designVersionId:        designVersionId,
                scenarioReferenceId:    scenarioReferenceId,
                testType:               testType
            }
        );
    }

    removeScenarioTestExpectationsForTestTypePermutation(designVersionId, scenarioReferenceId, testType, permutationId){

        return ScenarioTestExpectations.remove(
            {
                designVersionId:        designVersionId,
                scenarioReferenceId:    scenarioReferenceId,
                testType:               testType,
                permutationId:          permutationId
            }
        );
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