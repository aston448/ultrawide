
import { UserIntegrationTestResults }       from '../../collections/test_results/user_ultrawide_test_results.js';

class UserIntegrationTestResultData {

    // INSERT ==========================================================================================================

    bulkInsertData(resultsBatch){

        UserIntegrationTestResults.batchInsert(resultsBatch);
    }

    // SELECT ==========================================================================================================

    getUserMatchingTestResults(userId, searchRegex){

        UserIntegrationTestResults.find({
            userId:         userId,
            testFullName:   {$regex: searchRegex}
        }).fetch();
    }

    // REMOVE ==========================================================================================================

    removeAllDataForUser(userId){

        UserIntegrationTestResults.remove({
            userId:     userId
        });
    }
}

export default new UserIntegrationTestResultData();