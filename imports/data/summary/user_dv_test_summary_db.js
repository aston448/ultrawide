import { UserDvScenarioTestSummary }        from '../../collections/summary/user_dv_scenario_test_summary.js';
import { UserDvFeatureTestSummary }         from "../../collections/summary/user_dv_feature_test_summary";
import { UserDvTestSummary }                from "../../collections/summary/user_dv_test_summary";

import {MashTestStatus} from "../../constants/constants";

class UserDvTestSummaryDataClass {

    // INSERT ==========================================================================================================

    bulkInsertScenarioSummaryData(batchData){

        UserDvScenarioTestSummary.batchInsert(batchData);
    }

    bulkInsertFeatureSummaryData(batchData){

        UserDvFeatureTestSummary.batchInsert(batchData);
    }

    insertScenarioTestSummary(summaryData){

        return UserDvScenarioTestSummary.insert({
            userId:                     summaryData.userId,
            designVersionId:            summaryData.designVersionId,
            scenarioReferenceId:        summaryData.scenarioReferenceId,
            featureReferenceId:         summaryData.featureReferenceId,
            accTestExpectedCount:       summaryData.accTestExpectedCount,
            accTestPassCount:           summaryData.accTestPassCount,
            accTestFailCount:           summaryData.accTestFailCount,
            accTestMissingCount:        summaryData.accTestMissingCount,
            intTestExpectedCount:       summaryData.intTestExpectedCount,
            intTestPassCount:           summaryData.intTestPassCount,
            intTestFailCount:           summaryData.intTestFailCount,
            intTestMissingCount:        summaryData.intTestMissingCount,
            unitTestExpectedCount:      summaryData.unitTestExpectedCount,
            unitTestPassCount:          summaryData.unitTestPassCount,
            unitTestFailCount:          summaryData.unitTestFailCount,
            unitTestMissingCount:       summaryData.unitTestMissingCount,
            scenarioTestStatus:         summaryData.scenarioTestStatus
        });
    }

    insertFeatureTestSummary(summaryData){

        return UserDvFeatureTestSummary.insert({
            userId:                     summaryData.userId,
            designVersionId:            summaryData.designVersionId,
            featureReferenceId:         summaryData.featureReferenceId,
            featureScenarioCount:       summaryData.featureScenarioCount,
            featureExpectedTestCount:   summaryData.featureExpectedTestCount,
            featurePassingTestCount:    summaryData.featurePassingTestCount,
            featureFailingTestCount:    summaryData.featureFailingTestCount,
            featureMissingTestCount:    summaryData.featureMissingTestCount,
            featureTestStatus:          summaryData.featureTestStatus
        });
    }

    insertDvTestSummary(summaryData){

        return UserDvTestSummary.insert({
            userId:                     summaryData.userId,
            designVersionId:            summaryData.designVersionId,
            dvFeatureCount:             summaryData.dvFeatureCount,
            dvScenarioCount:            summaryData.dvScenarioCount,
            dvExpectedTestCount:        summaryData.dvExpectedTestCount,
            dvPassingTestCount:         summaryData.dvPassingTestCount,
            dvFailingTestCount:         summaryData.dvFailingTestCount,
            dvMissingTestCount:         summaryData.dvMissingTestCount
        });
    }

    // SELECT ==========================================================================================================

    getScenarioSummary(userId, designVersionId, scenarioRefId){

        return UserDvScenarioTestSummary.findOne({
            userId:                 userId,
            designVersionId:        designVersionId,
            scenarioReferenceId:    scenarioRefId
        });
    }

    getFeatureSummary(userId, designVersionId, featureRefId){

        return UserDvFeatureTestSummary.findOne({
            userId:                 userId,
            designVersionId:        designVersionId,
            featureReferenceId:     featureRefId
        });
    }

    getScenarioSummariesForFeature(userId, designVersionId,  featureRefId){

        return UserDvScenarioTestSummary.find({
            userId:                 userId,
            designVersionId:        designVersionId,
            featureReferenceId:     featureRefId
        }).fetch();
    }

    getFeatureSummariesForDesignVersion(userId, designVersionId){

        return UserDvFeatureTestSummary.find({
            userId:                 userId,
            designVersionId:        designVersionId
        }).fetch();
    }


    // getTestSummaryForScenario(userId, designVersionId, scenarioRefId, featureRefId){
    //
    //     return UserDevTestSummary.findOne({
    //         userId:                 userId,
    //         designVersionId:        designVersionId,
    //         scenarioReferenceId:    scenarioRefId,
    //         featureReferenceId:     featureRefId
    //     });
    // }
    //
    // getTestSummaryForFeature(userId, designVersionId, featureRefId){
    //
    //     return UserDevTestSummary.findOne({
    //         userId:                 userId,
    //         designVersionId:        designVersionId,
    //         scenarioReferenceId:    'NONE',
    //         featureReferenceId:     featureRefId
    //     });
    // }
    //
    // getFeaturesWithMissingTestRequirements(userId, designVersionId){
    //
    //     return UserDevTestSummary.find({
    //         userId:                     userId,
    //         designVersionId:            designVersionId,
    //         featureNoRequirementCount:  {$gt: 0}
    //     }).fetch();
    // }
    //
    // getFeaturesWithMissingRequiredTests(userId, designVersionId){
    //
    //     return UserDevTestSummary.find({
    //         userId:                     userId,
    //         designVersionId:            designVersionId,
    //         featureNoTestCount:         {$gt: 0}
    //     }).fetch();
    // }
    //
    // getFeaturesWithFailingTests(userId, designVersionId){
    //
    //     return UserDevTestSummary.find({
    //         userId:                     userId,
    //         designVersionId:            designVersionId,
    //         featureTestFailCount:       {$gt: 0}
    //     }).fetch();
    // }
    //
    // getFeaturesWithSomePassingTests(userId, designVersionId){
    //
    //     return UserDevTestSummary.find({
    //         userId:                     userId,
    //         designVersionId:            designVersionId,
    //         featureTestFailCount:       0,
    //         featureAllTestsFulfilled:   false,
    //         featureTestPassCount:       {$gt: 0}
    //     }).fetch();
    // }
    //
    // getFeaturesWithAllTestsPassing(userId, designVersionId){
    //
    //     return UserDevTestSummary.find({
    //         userId:                     userId,
    //         designVersionId:            designVersionId,
    //         featureAllTestsFulfilled:   true,
    //         featureTestFailCount:       0
    //     }).fetch();
    // }

    // UPDATE ==========================================================================================================

    // updateFeatureTestSummary(userId, designVersionId, featureRefId, featureData){
    //
    //     return UserDevTestSummary.update(
    //         {
    //             userId:                 userId,
    //             designVersionId:        designVersionId,
    //             scenarioReferenceId:    'NONE',
    //             featureReferenceId:     featureRefId
    //         },
    //         {
    //             $set:{
    //                 featureScenarioCount:           featureData.featureScenarioCount,
    //                 featureExpectedTestCount:       featureData.featureExpectedTestCount,
    //                 featureFulfilledTestCount:      featureData.featureFulfilledTestCount,
    //                 featureSummaryStatus:           featureData.featureTestStatus,              // Summary of all tests in Feature
    //                 featureTestPassCount:           featureData.featurePassingTests,            // Number of tests passing in whole feature
    //                 featureTestFailCount:           featureData.featureFailingTests,            // Number of tests failing in whole feature
    //                 featureNoTestCount:             featureData.featureNoTestScenarios,         // Number of scenarios with no tests
    //                 featureNoRequirementCount:      featureData.featureNoRequirementScenarios,  // Number of scenarios with no test requirements
    //                 duFeatureScenarioCount:         featureData.duFeatureScenarioCount,
    //                 duFeatureExpectedTestCount:     featureData.duFeatureExpectedTestCount,
    //                 duFeatureFulfilledTestCount:    featureData.duFeatureFulfilledTestCount,
    //                 duFeatureSummaryStatus:         featureData.duFeatureTestStatus,                         // Summary of all tests in Feature for current DU
    //                 duFeatureTestPassCount:         featureData.duFeaturePassingTests,        // Number of tests passing in whole feature for current DU
    //                 duFeatureTestFailCount:         featureData.duFeatureFailingTests,        // Number of tests failing in whole feature for current DU
    //                 duFeatureNoTestCount:           featureData.duFeatureNoTestScenarios,        // Number of scenarios with no tests for current DU
    //                 wpFeatureScenarioCount:         featureData.wpFeatureScenarioCount,
    //                 wpFeatureExpectedTestCount:     featureData.wpFeatureExpectedTestCount,
    //                 wpFeatureFulfilledTestCount:    featureData.wpFeatureFulfilledTestCount,
    //                 wpFeatureSummaryStatus:         featureData.wpFeatureTestStatus,                         // Summary of all tests in Feature for current WP
    //                 wpFeatureTestPassCount:         featureData.wpFeaturePassingTests,        // Number of tests passing in whole feature for current WP
    //                 wpFeatureTestFailCount:         featureData.wpFeatureFailingTests,        // Number of tests failing in whole feature for current WP
    //                 wpFeatureNoTestCount:           featureData.wpFeatureNoTestScenarios,        // Number of scenarios with no tests for current WP
    //
    //             }
    //         }
    //     )
    // }

    // REMOVE ==========================================================================================================

    removeScenarioTestSummary(userContext, scenarioRefId){

        return UserDvScenarioTestSummary.remove({
            userId:                 userContext.userId,
            designVersionId:        userContext.designVersionId,
            scenarioReferenceId:    scenarioRefId
        });
    }

    removeFeatureTestSummary(userContext, featureRefId){

        return UserDvFeatureTestSummary.remove({
            userId:                 userContext.userId,
            designVersionId:        userContext.designVersionId,
            featureReferenceId:     featureRefId
        });

    }

    removeDvTestSummary(userContext){

        return UserDvTestSummary.remove({
            userId:                 userContext.userId,
            designVersionId:        userContext.designVersionId
        });
    }

    removeAllUserSummaryData(userId){

        // Scenario summaries
        return UserDvScenarioTestSummary.remove({
            userId: userId,
        });

        // Feature summaries

        // DV summary
    }
}

export const UserDvTestSummaryData = new UserDvTestSummaryDataClass();