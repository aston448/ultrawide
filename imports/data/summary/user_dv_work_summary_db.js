import {UserDvWorkSummary}        from '../../collections/summary/user_dv_work_summary.js';


class UserDvWorkSummaryDataClass {

    // INSERT ==========================================================================================================
    bulkInsert(batchData){

        UserDvWorkSummary.batchInsert(batchData);
    }

    // SELECT ==========================================================================================================



    // REMOVE ==========================================================================================================

    removeUserSummaryData(userContext){

        // Wipe for all design versions to prevent excess data build up
        return UserDvWorkSummary.remove({
            userId:             userContext.userId
        });
    }
}

export const UserDvWorkSummaryData = new UserDvWorkSummaryDataClass();