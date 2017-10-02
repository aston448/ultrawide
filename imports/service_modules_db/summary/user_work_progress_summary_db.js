import {UserWorkProgressSummary}        from '../../collections/summary/user_work_progress_summary.js';

class UserWorkProgressSummaryData {

    // INSERT ==========================================================================================================
    bulkInsert(batchData){

        UserWorkProgressSummary.batchInsert(batchData);
    }

    // REMOVE ==========================================================================================================

    removeWorkProgressSummary(userContext){

        return UserWorkProgressSummary.remove({
            userId: userContext.userId,
            designVersionId: userContext.designVersionId
        });
    }
}

export default new UserWorkProgressSummaryData();