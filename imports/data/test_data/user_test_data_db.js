
import {UserWorkItemTestSummary}    from "../../collections/user_temp/user_work_item_test_summary";
import {UserScenarioTestSummary}    from "../../collections/user_temp/user_scenario_test_summary";
import {UserTestTypeSummary}        from "../../collections/user_temp/user_test_type_summary";
import {UserTestExpectationResults} from "../../collections/user_temp/user_test_expectation_results";
import {UserWorkItemBacklog}        from "../../collections/user_temp/user_work_item_backlog";


import {SummaryType, WorkItemType} from "../../constants/constants";


class UserTestDataClass {

    // INSERT ----------------------------------------------------------------------------------------------------------
    bulkInsertWorkItemSummaryData(batch){

        UserWorkItemTestSummary.batchInsert(batch);
    }

    bulkInsertScenarioSummaryData(batch){

        UserScenarioTestSummary.batchInsert(batch);
    }

    bulkInsertExpectationResultData(batch){

        UserTestExpectationResults.batchInsert(batch);
    }

    bulkInsertWorkItemBacklogData(batch){

        UserWorkItemBacklog.batchInsert(batch);
    }


    // SELECT ----------------------------------------------------------------------------------------------------------

    getWorkItemSummaryDataById(summaryId){

        return UserWorkItemTestSummary.findOne(
            {
                _id: summaryId
            }
        );
    }

    getDvSummaryItem(userId, designVersionId){

        return UserWorkItemTestSummary.findOne(
            {
                userId: userId,
                designVersionId: designVersionId,
                workItemId: designVersionId,
                workItemType: WorkItemType.DESIGN_VERSION
            }
        );
    }

    getWorkItemSummaryData(userId, designVersionId, workItemId, workItemType){

        return UserWorkItemTestSummary.findOne(
            {
                userId: userId,
                designVersionId: designVersionId,
                workItemId: workItemId,
                workItemType: workItemType
            }
        );

    }

    getBacklogDataForWp(userId, dvId, wpId, backlogType){

        return UserWorkItemBacklog.find(
            {
                userId:                 userId,
                dvId:                   dvId,
                wpId:                   wpId,
                backlogType:            backlogType
            },
            {$sort: {featureName: 1}}
        ).fetch();
    }

    getBacklogDataForIteration(userId, dvId, itId, backlogType){

        return UserWorkItemBacklog.find(
            {
                userId:                 userId,
                dvId:                   dvId,
                itId:                   itId,
                backlogType:            backlogType
            },
            {$sort: {featureName: 1}}
        ).fetch();
    }

    getBacklogDataForIncrement(userId, dvId, inId, backlogType){

        return UserWorkItemBacklog.find(
            {
                userId:                 userId,
                dvId:                   dvId,
                inId:                   inId,
                backlogType:            backlogType
            },
            {$sort: {featureName: 1}}
        ).fetch();
    }

    getBacklogDataForDvAssigned(userId, dvId, backlogType){

        return UserWorkItemBacklog.find(
            {
                userId:                 userId,
                dvId:                   dvId,
                summaryType:            SummaryType.SUMMARY_WP,
                backlogType:            backlogType
            },
            {$sort: {featureName: 1}}
        ).fetch();
    }

    getBacklogDataForDvUnassigned(userId, dvId, backlogType){

        return UserWorkItemBacklog.find(
            {
                userId:                 userId,
                dvId:                   dvId,
                summaryType:            SummaryType.SUMMARY_DV_UNASSIGNED,
                backlogType:            backlogType
            },
            {$sort: {featureName: 1}}
        ).fetch();
    }

    getBacklogDataForDv(userId, dvId, backlogType){

        return UserWorkItemBacklog.find(
            {
                userId:                 userId,
                dvId:                   dvId,
                backlogType:            backlogType
            },
            {$sort: {featureName: 1}}
        ).fetch();
    }

    getTestExpectationResult(userId, designVersionId, testExpectationId){

        return UserTestExpectationResults.findOne(
            {
                userId:                         userId,
                designVersionId:                designVersionId,
                scenarioTestExpectationId:      testExpectationId
            }
        );
    }

    getScenarioTestSummary(userId, designVersionId, designScenarioReferenceId){

        return UserScenarioTestSummary.findOne(
            {
                userId:                         userId,
                designVersionId:                designVersionId,
                designScenarioReferenceId:      designScenarioReferenceId
            }
        );
    }

    getFeatureScenarioTestSummaries(userId, designVersionId, designFeatureReferenceId){

        return UserScenarioTestSummary.find(
            {
                userId:                         userId,
                designVersionId:                designVersionId,
                designFeatureReferenceId:       designFeatureReferenceId
            }
        ).fetch();
    }

    getScenarioPermutationTestResults(userId, designVersionId, scenarioRefId){

        return UserTestExpectationResults.find(
            {
                userId:                     userId,
                designVersionId:            designVersionId,
                designScenarioReferenceId:  scenarioRefId,
                testName:                   {$ne: 'NONE'}   // Exclude dummy scenario outcome
            },
            {$sort: {testType: 1}}
         ).fetch();
    }

    getScenarioLevelTestResults(userId, designVersionId, scenarioRefId){

        // For scenarios with test permutations get the combined result
        const dummyResults = UserTestExpectationResults.find(
            {
                userId:                     userId,
                designVersionId:            designVersionId,
                designScenarioReferenceId:  scenarioRefId,
                testName:                   'NONE'
            }
        ).fetch();

        if(dummyResults.length > 0){

            return dummyResults;

        } else {

            // Otherwise get the actual scenario test result
            return UserTestExpectationResults.find(
                {
                    userId:                     userId,
                    designVersionId:            designVersionId,
                    designScenarioReferenceId:  scenarioRefId,
                    permValue:                  'SCENARIO'
                }
            ).fetch();
        }
    }

    getScenarioTestTypeExpectationResult(userId, designVersionId, scenarioRefId, testExpectationId){

        return UserTestExpectationResults.findOne(
            {
                userId:                     userId,
                designVersionId:            designVersionId,
                designScenarioReferenceId:  scenarioRefId,
                scenarioTestExpectationId:  testExpectationId
            }
        );
    }

    // REMOVE ----------------------------------------------------------------------------------------------------------
    clearAllUserTestData(userId){

        UserWorkItemTestSummary.remove({
            userId:         userId
        });

        UserScenarioTestSummary.remove({
            userId:         userId
        });

        UserTestTypeSummary.remove({
            userId:         userId
        });

        UserTestExpectationResults.remove({
            userId:         userId
        });

        UserWorkItemBacklog.remove({
            userId:         userId
        });
    }

}


export const UserTestData = new UserTestDataClass();