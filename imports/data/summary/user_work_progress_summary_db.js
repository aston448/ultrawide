import {UserWorkProgressSummary}        from '../../collections/summary/user_work_progress_summary.js';


class UserWorkProgressSummaryDataClass {

    // INSERT ==========================================================================================================
    bulkInsert(batchData){

        UserWorkProgressSummary.batchInsert(batchData);
    }

    // SELECT ==========================================================================================================


    getUpdateSummaryListItems(userId, designVersionId, designUpdateId, itemType){

        return UserWorkProgressSummary.find(
            {
                userId:             userId,
                designVersionId:    designVersionId,
                designUpdateId:     designUpdateId,
                workSummaryType:    itemType
            },
            {sort: {name: 1}}
        ).fetch();
    }

    // REMOVE ==========================================================================================================

}

export const UserWorkProgressSummaryData = new UserWorkProgressSummaryDataClass();