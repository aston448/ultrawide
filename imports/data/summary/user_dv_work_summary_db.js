import {UserDvWorkSummary}        from '../../collections/summary/user_dv_work_summary.js';
import {SummaryType} from "../../constants/constants";


class UserDvWorkSummaryDataClass {

    // INSERT ==========================================================================================================
    bulkInsert(batchData){

        UserDvWorkSummary.batchInsert(batchData);
    }

    // SELECT ==========================================================================================================

    getDesignVersionSummary(designVersionId){

        return UserDvWorkSummary.findOne(
            {
                summaryType:    SummaryType.SUMMARY_DV,
                dvId:           designVersionId,
                noWorkPackage:  false
            }
        );
    }

    getDesignVersionUnassignedSummary(designVersionId){

        return UserDvWorkSummary.findOne(
            {
                summaryType:    SummaryType.SUMMARY_DV,
                dvId:           designVersionId,
                noWorkPackage:  true
            }
        );
    }

    getIncrementSummary(designVersionId, incrementId){

        return UserDvWorkSummary.findOne(
            {
                summaryType:    SummaryType.SUMMARY_IN,
                dvId:           designVersionId,
                inId:           incrementId,
                noWorkPackage:  false
            }
        );
    }

    getIterationSummary(designVersionId, iterationId){

        return UserDvWorkSummary.findOne(
            {
                summaryType:    SummaryType.SUMMARY_IT,
                dvId:           designVersionId,
                itId:           iterationId,
                noWorkPackage:  false
            }
        );
    }

    getWorkPackageSummary(designVersionId, workPackageId){

        return UserDvWorkSummary.findOne(
            {
                summaryType:    SummaryType.SUMMARY_WP,
                dvId:           designVersionId,
                wpId:           workPackageId,
                noWorkPackage:  false
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