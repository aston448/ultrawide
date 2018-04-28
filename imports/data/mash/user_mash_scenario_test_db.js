
import { UserMashScenarioTests }            from '../../collections/mash/user_mash_scenario_tests.js';

class UserMashScenarioTestDataClass {

    // INSERT ==========================================================================================================

    bulkInsertData(scenarioTestBatchData){

        UserMashScenarioTests.batchInsert(scenarioTestBatchData);
    }

    // SELECT ==========================================================================================================

    getScenarioTestByType(userId, designVersionId, scenarioReferenceId, testType){

        // To be used when there is only one test

        return UserMashScenarioTests.findOne({
            userId:                         userId,
            designVersionId:                designVersionId,
            designScenarioReferenceId:      scenarioReferenceId,
            testType:                       testType
        });
    }

    getScenarioTestsByType(userId, designVersionId, scenarioReferenceId, testType){

        return UserMashScenarioTests.find({
            userId:                         userId,
            designVersionId:                designVersionId,
            designScenarioReferenceId:      scenarioReferenceId,
            testType:                       testType
        }).fetch();
    }

    // REMOVE ==========================================================================================================

    removeAllDvTestsForUser(userId, designVersionId){

        return UserMashScenarioTests.remove({
            userId:             userId,
            designVersionId:    designVersionId
        });
    }
}

export const UserMashScenarioTestData = new UserMashScenarioTestDataClass();