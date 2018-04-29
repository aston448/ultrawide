
import { UserAcceptanceTestResults }       from '../../collections/test_results/user_ultrawide_test_results.js';

class UserAcceptanceTestResultDataClass {

    // INSERT ==========================================================================================================

    bulkInsertData(resultsBatch){

        UserAcceptanceTestResults.batchInsert(resultsBatch);
    }

    // SELECT ==========================================================================================================

    getUserTestResults(userId){

        return UserAcceptanceTestResults.find({
            userId:         userId
        }).fetch();
    }

    getUserMatchingTestResults(userId, searchRegex){

        return UserAcceptanceTestResults.find({
            userId:         userId,
            testFullName:   {$regex: searchRegex}
        }).fetch();
    }

    // REMOVE ==========================================================================================================

    removeAllDataForUser(userId){

        return UserAcceptanceTestResults.remove({
            userId:     userId
        });
    }
}

export const UserAcceptanceTestResultData = new UserAcceptanceTestResultDataClass();