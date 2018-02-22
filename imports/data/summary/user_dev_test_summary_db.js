import { UserDevTestSummary }       from '../../collections/summary/user_dev_test_summary.js';

class UserDevTestSummaryData{

    // INSERT ==========================================================================================================

    bulkInsertData(batchData){

        UserDevTestSummary.batchInsert(batchData);
    }

    // SELECT ==========================================================================================================

    getTestSummaryForScenario(userId, designVersionId, scenarioRefId, featureRefId){

        return UserDevTestSummary.findOne({
            userId:                 userId,
            designVersionId:        designVersionId,
            scenarioReferenceId:    scenarioRefId,
            featureReferenceId:     featureRefId
        });
    }

    getTestSummaryForFeature(userId, designVersionId, featureRefId){

        return UserDevTestSummary.findOne({
            userId:                 userId,
            designVersionId:        designVersionId,
            scenarioReferenceId:    'NONE',
            featureReferenceId:     featureRefId
        });
    }

    getFeaturesWithNoTestRequirements(userId, designVersionId){

        return UserDevTestSummary.find({
            userId:                     userId,
            designVersionId:            designVersionId,
            featureExpectedTestCount:   0
        }).fetch();
    }

    getFeaturesWithFailingTests(userId, designVersionId){

        return UserDevTestSummary.find({
            userId:                     userId,
            designVersionId:            designVersionId,
            featureTestFailCount:       {$gt: 0}
        }).fetch();
    }

    getFeaturesWithSomePassingTests(userId, designVersionId){

        return UserDevTestSummary.find({
            userId:                     userId,
            designVersionId:            designVersionId,
            featureTestFailCount:       0,
            featureTestPassCount:       {$gt: 0}
        }).fetch();
    }

    getFeaturesWithAllTestsPassing(userId, designVersionId){

        return UserDevTestSummary.find({
            userId:                     userId,
            designVersionId:            designVersionId,
            featureAllTestsFulfilled:   true
        }).fetch();
    }

    // UPDATE ==========================================================================================================

    updateFeatureTestSummary(userId, designVersionId, featureRefId, featureData){

        return UserDevTestSummary.update(
            {
                userId:                 userId,
                designVersionId:        designVersionId,
                scenarioReferenceId:    'NONE',
                featureReferenceId:     featureRefId
            },
            {
                $set:{
                    featureScenarioCount:           featureData.featureScenarioCount,
                    featureExpectedTestCount:       featureData.featureExpectedTestCount,
                    featureFulfilledTestCount:      featureData.featureFulfilledTestCount,
                    featureSummaryStatus:           featureData.featureTestStatus,                         // Summary of all tests in Feature
                    featureTestPassCount:           featureData.featurePassingTests,        // Number of tests passing in whole feature
                    featureTestFailCount:           featureData.featureFailingTests,        // Number of tests failing in whole feature
                    featureNoTestCount:             featureData.featureNoTestScenarios,        // Number of scenarios with no tests
                    duFeatureScenarioCount:         featureData.duFeatureScenarioCount,
                    duFeatureExpectedTestCount:     featureData.duFeatureExpectedTestCount,
                    duFeatureFulfilledTestCount:    featureData.duFeatureFulfilledTestCount,
                    duFeatureSummaryStatus:         featureData.duFeatureTestStatus,                         // Summary of all tests in Feature for current DU
                    duFeatureTestPassCount:         featureData.duFeaturePassingTests,        // Number of tests passing in whole feature for current DU
                    duFeatureTestFailCount:         featureData.duFeatureFailingTests,        // Number of tests failing in whole feature for current DU
                    duFeatureNoTestCount:           featureData.duFeatureNoTestScenarios,        // Number of scenarios with no tests for current DU
                    wpFeatureScenarioCount:         featureData.wpFeatureScenarioCount,
                    wpFeatureExpectedTestCount:     featureData.wpFeatureExpectedTestCount,
                    wpFeatureFulfilledTestCount:    featureData.wpFeatureFulfilledTestCount,
                    wpFeatureSummaryStatus:         featureData.wpFeatureTestStatus,                         // Summary of all tests in Feature for current WP
                    wpFeatureTestPassCount:         featureData.wpFeaturePassingTests,        // Number of tests passing in whole feature for current WP
                    wpFeatureTestFailCount:         featureData.wpFeatureFailingTests,        // Number of tests failing in whole feature for current WP
                    wpFeatureNoTestCount:           featureData.wpFeatureNoTestScenarios,        // Number of scenarios with no tests for current WP

                }
            }
        )
    }

    // REMOVE ==========================================================================================================

    removeAllUserData(userId){

        return UserDevTestSummary.remove({
            userId: userId,
        });
    }
}

export default new UserDevTestSummaryData();