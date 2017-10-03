
import { UserMashScenarioTests }            from '../../collections/mash/user_mash_scenario_tests.js';

class UserMashScenarioTestData{

    // INSERT ==========================================================================================================

    bulkInsertData(scenarioTestBatchData){

        UserMashScenarioTests.batchInsert(scenarioTestBatchData);
    }

    // REMOVE ==========================================================================================================

    removeAllDvTestsForUser(userId, designVersionId){

        UserMashScenarioTests.remove({
            userId:             userId,
            designVersionId:    designVersionId
        });
    }
}

export default new UserMashScenarioTestData();