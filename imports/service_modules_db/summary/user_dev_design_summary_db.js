import {UserDevDesignSummary}       from '../../collections/summary/user_dev_design_summary.js';

class UserDevDesignSummaryData{

    // SELECT ==========================================================================================================

    getUserDesignVersionSummary(userContext){

        return UserDevDesignSummaryData.findOne({
            userId:             userContext.userId,
            designVersionId:    userContext.designVersionId
        });
    }
}

export default new UserDevDesignSummaryData();