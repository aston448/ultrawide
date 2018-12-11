import {UserDvBacklog}        from '../../collections/summary/user_dv_backlog.js';
import {UserDvFeatureTestSummary} from "../../collections/summary/user_dv_feature_test_summary";
import {MashTestStatus} from "../../constants/constants";


class UserDvBacklogDataClass {

    // INSERT ==========================================================================================================
    bulkInsert(batchData){

        UserDvBacklog.batchInsert(batchData);
    }

    addUpdateBacklogEntry(backlogEntry){

        const currentEntry = UserDvBacklog.findOne({
            userId: backlogEntry.userId,
            dvId: backlogEntry.dvId,
            inId: backlogEntry.inId,
            itId: backlogEntry.itId,
            duId: backlogEntry.duId,
            wpId: backlogEntry.wpId,
            backlogType: backlogEntry.backlogType,
            featureRefId: backlogEntry.featureRefId,
            summaryType: backlogEntry.summaryType
        });

        if(currentEntry){

            // Add another scenario to this count
            UserDvBacklog.update(
                {
                    _id: currentEntry._id
                },
                {
                    $set:{
                        scenarioCount:  currentEntry.scenarioCount + 1,
                        scenarioTestCount: currentEntry.scenarioTestCount + backlogEntry.scenarioTestCount,
                        scenarioAnomalyCount: currentEntry.scenarioAnomalyCount + backlogEntry.scenarioAnomalyCount
                    }
                }
            );

        } else {

            // New item not yet counted
            UserDvBacklog.insert({
                userId:                 backlogEntry.userId,
                dvId:                   backlogEntry.dvId,
                inId:                   backlogEntry.inId,
                itId:                   backlogEntry.itId,
                duId:                   backlogEntry.duId,
                wpId:                   backlogEntry.wpId,
                backlogType:            backlogEntry.backlogType,
                featureRefId:           backlogEntry.featureRefId,
                scenarioCount:          1,
                scenarioTestCount:      backlogEntry.scenarioTestCount,
                scenarioAnomalyCount:   backlogEntry.scenarioAnomalyCount,
                summaryType:            backlogEntry.summaryType
            });
        }

    }

    // SELECT ==========================================================================================================

    getBacklogSummaryDataForWorkItemBacklog(workContext, backlogType){

        // Returns a list of features in the backlog
        return UserDvBacklog.find(
            {
                userId:                 workContext.userId,
                dvId:                   workContext.dvId,
                inId:                   workContext.inId,
                itId:                   workContext.itId,
                duId:                   workContext.duId,
                wpId:                   workContext.wpId,
                backlogType:            backlogType,
                summaryType:            workContext.summaryType
            }
        ).fetch();
    }



    getAllUserBacklogData(userContext){

        return UserDvBacklog.find(
            {
                userId:                 userContext.userId,
            }
        ).fetch();
    }

    // UPDATE ==========================================================================================================

    addFeatureTestAndAnomalyData(backlogId, featureResults, anomalyCount){

        return UserDvBacklog.update(
            {
                _id: backlogId
            },
            {
                $set:{
                    featureScenarioCount:           featureResults.featureScenarioCount,
                    featureExpectedTestCount:       featureResults.featureExpectedTestCount,
                    featurePassingTestCount:        featureResults.featurePassingTestCount,
                    featureFailingTestCount:        featureResults.featureFailingTestCount,
                    featureMissingTestCount:        featureResults.featureMissingTestCount,
                    featureMissingExpectationCount: featureResults.featureMissingExpectationCount,
                    featureTestStatus:              featureResults.featureTestStatus,
                    featureAnomalyCount:            anomalyCount
                }
            }
        );
    }


    // REMOVE ==========================================================================================================

    removeUserBacklogData(userContext){

        // Wipe for all design versions to prevent excess data build up
        return UserDvBacklog.remove({
            userId:             userContext.userId
        });
    }
}

export const UserDvBacklogData = new UserDvBacklogDataClass();