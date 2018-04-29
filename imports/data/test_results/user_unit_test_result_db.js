
import { UserUnitTestResults }       from '../../collections/test_results/user_ultrawide_test_results.js';

class UserUnitTestResultDataClass {

    // INSERT ==========================================================================================================

    bulkInsertData(resultsBatch){

        UserUnitTestResults.batchInsert(resultsBatch);
    }

    // SELECT ==========================================================================================================

    getUserTestResults(userId){

        return UserUnitTestResults.find({
            userId:         userId
        }).fetch();
    }

    getUserMatchingTestResults(userId, searchRegex){

        return UserUnitTestResults.find({
            userId:         userId,
            testFullName:   {$regex: searchRegex}
        }).fetch();
    }

    // REMOVE ==========================================================================================================

    removeAllDataForUser(userId){

        return UserUnitTestResults.remove({
            userId:     userId
        });
    }
}

export const UserUnitTestResultData = new UserUnitTestResultDataClass();