
import { UserUnitTestResults }       from '../../collections/test_results/user_ultrawide_test_results.js';

class UserUnitTestResultData {

    // INSERT ==========================================================================================================

    bulkInsertData(resultsBatch){

        UserUnitTestResults.batchInsert(resultsBatch);
    }

    // SELECT ==========================================================================================================

    getUserMatchingTestResults(userId, searchRegex){

        UserUnitTestResults.find({
            userId:         userId,
            testFullName:   {$regex: searchRegex}
        }).fetch();
    }

    // REMOVE ==========================================================================================================

    removeAllDataForUser(userId){

        UserUnitTestResults.remove({
            userId:     userId
        });
    }
}

export default new UserUnitTestResultData();