import {UserWorkProgressSummary}        from '../../collections/summary/user_work_progress_summary.js';

import { WorkSummaryType }              from "../../constants/constants";

class UserWorkProgressSummaryData {

    // INSERT ==========================================================================================================
    bulkInsert(batchData){

        UserWorkProgressSummary.batchInsert(batchData);
    }

    // SELECT ==========================================================================================================

    getHeaderSummaryItem(userId, designVersionId, itemType){

        return UserWorkProgressSummary.findOne(
            {
                userId:                 userId,
                designVersionId:        designVersionId,
                workSummaryType:        itemType
            }
        );
    }

    getSummaryListItems(userId, designVersionId, itemType){

        return UserWorkProgressSummary.find(
            {
                userId:                 userId,
                designVersionId:        designVersionId,
                workSummaryType:        itemType
            },
            {sort: {name: 1}}
        ).fetch();
    }

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

    removeWorkProgressSummary(userContext){

        return UserWorkProgressSummary.remove({
            userId:             userContext.userId,
            designVersionId:    userContext.designVersionId
        });
    }
}

export default new UserWorkProgressSummaryData();