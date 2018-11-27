import {UserDvWorkSummary}        from '../../collections/summary/user_dv_work_summary.js';
import {SummaryType} from "../../constants/constants";


class UserDvWorkSummaryDataClass {

    // INSERT ==========================================================================================================
    bulkInsert(batchData){

        UserDvWorkSummary.batchInsert(batchData);
    }

    // SELECT ==========================================================================================================

    getWorkItemSummaryDataById(summaryId){

        return UserDvWorkSummary.findOne(
            {
                _id: summaryId
            }
        );
    }

    getDesignVersionSummary(designVersionId){

        return UserDvWorkSummary.findOne(
            {
                summaryType:    SummaryType.SUMMARY_DV,
                dvId:           designVersionId
            }
        );
    }
    getDesignVersionAssignedSummary(designVersionId){

        return UserDvWorkSummary.findOne(
            {
                summaryType:    SummaryType.SUMMARY_DV_ASSIGNED,
                dvId:           designVersionId
            }
        );
    }

    getDesignVersionUnassignedSummary(designVersionId){

        return UserDvWorkSummary.findOne(
            {
                summaryType:    SummaryType.SUMMARY_DV_UNASSIGNED,
                dvId:           designVersionId
            }
        );
    }

    getIncrementSummary(designVersionId, incrementId){

        return UserDvWorkSummary.findOne(
            {
                summaryType:    SummaryType.SUMMARY_IN,
                dvId:           designVersionId,
                inId:           incrementId
            }
        );
    }

    getIterationSummary(designVersionId, iterationId){

        return UserDvWorkSummary.findOne(
            {
                summaryType:    SummaryType.SUMMARY_IT,
                dvId:           designVersionId,
                itId:           iterationId
            }
        );
    }

    getWorkPackageSummary(designVersionId, workPackageId){

        return UserDvWorkSummary.findOne(
            {
                summaryType:    SummaryType.SUMMARY_WP,
                dvId:           designVersionId,
                wpId:           workPackageId
            }
        );
    }


    // REMOVE ==========================================================================================================

    removeUserSummaryData(userContext){

        // Wipe for all design versions to prevent excess data build up
        return UserDvWorkSummary.remove({
            userId:             userContext.userId
        });
    }
}

export const UserDvWorkSummaryData = new UserDvWorkSummaryDataClass();