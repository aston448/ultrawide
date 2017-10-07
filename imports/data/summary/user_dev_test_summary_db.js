import { UserDevTestSummary }       from '../../collections/summary/user_dev_test_summary.js';

class UserDevTestSummaryData{

    // INSERT ==========================================================================================================

    bulkInsertData(batchData){

        UserDevTestSummary.batchInsert(batchData);
    }

    // SELECT ==========================================================================================================

    getTestSummaryForScenario(userId, designVersionId, scenarioRefId, featureRefId){

        return UserDevTestSummary.findOne({
            userId:                 userId,
            designVersionId:        designVersionId,
            scenarioReferenceId:    scenarioRefId,
            featureReferenceId:     featureRefId
        });
    }

    getTestSummaryForFeature(userId, designVersionId, featureRefId){

        return UserDevTestSummary.findOne({
            userId:                 userId,
            designVersionId:        designVersionId,
            scenarioReferenceId:    'NONE',
            featureReferenceId:     featureRefId
        });
    }

    // REMOVE ==========================================================================================================

    removeAllUserData(userId){

        return UserDevTestSummary.remove({
            userId: userId,
        });
    }
}

export default new UserDevTestSummaryData();