import { UserDevTestSummary }       from '../../collections/summary/user_dev_test_summary.js';

class UserDevTestSummaryData{

    // INSERT ==========================================================================================================

    bulkInsertData(batchData){

        UserDevTestSummary.batchInsert(batchData);
    }

    // REMOVE ==========================================================================================================

    removeAllUserData(userId){

        return UserDevTestSummary.remove({
            userId: userId,
        });
    }
}

export default new UserDevTestSummaryData();