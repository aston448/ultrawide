
import { UserIntegrationTestResults }       from '../../collections/test_results/user_ultrawide_test_results.js';

class UserIntegrationTestResultDataClass {

    // INSERT ==========================================================================================================

    bulkInsertData(resultsBatch){

        UserIntegrationTestResults.batchInsert(resultsBatch);
    }

    // SELECT ==========================================================================================================

    getUserTestResults(userId){

        return UserIntegrationTestResults.find({
            userId:         userId
        }).fetch();
    }

    getUserMatchingTestResults(userId, searchRegex){

        return UserIntegrationTestResults.find({
            userId:         userId,
            testFullName:   {$regex: searchRegex}
        }).fetch();
    }

    // REMOVE ==========================================================================================================

    removeAllDataForUser(userId){

        return UserIntegrationTestResults.remove({
            userId:     userId
        });
    }
}

export const UserIntegrationTestResultData = new UserIntegrationTestResultDataClass();