import {UserDevDesignSummary}       from '../../collections/summary/user_dev_design_summary.js';

class UserDevDesignSummaryData{

    // INSERT ==========================================================================================================

    insertNewDesignVersionSummary(
        userId,
        designVersionId,
        totalFeatureCount,
        totalScenarioCount,
        totalScenariosWithoutTests,
        totalPassingScenarioCount,
        totalFailingScenarioCount,
        totalUnitTestsPassing,
        totalUnitTestsFailing,
        totalUnitTestsPending,
        totalIntTestsPassing,
        totalIntTestsFailing,
        totalIntTestsPending,
        totalAccTestsPassing,
        totalAccTestsFailing,
        totalAccTestsPending
    ){

        return UserDevDesignSummary.insert({
            userId: userId,
            designVersionId: designVersionId,
            featureCount: totalFeatureCount,
            scenarioCount: totalScenarioCount,
            untestedScenarioCount: totalScenariosWithoutTests,
            passingScenarioCount: totalPassingScenarioCount,
            failingScenarioCount: totalFailingScenarioCount,
            unitTestPassCount: totalUnitTestsPassing,
            unitTestFailCount: totalUnitTestsFailing,
            unitTestPendingCount: totalUnitTestsPending,
            intTestPassCount: totalIntTestsPassing,
            intTestFailCount: totalIntTestsFailing,
            intTestPendingCount: totalIntTestsPending,
            accTestPassCount: totalAccTestsPassing,
            accTestFailCount: totalAccTestsFailing,
            accTestPendingCount: totalAccTestsPending
        });
    }

    // SELECT ==========================================================================================================

    getUserDesignVersionSummary(userContext){

        return UserDevDesignSummaryData.findOne({
            userId:             userContext.userId,
            designVersionId:    userContext.designVersionId
        });
    }

    // REMOVE ==========================================================================================================

    removeAllUserData(userId){

        return UserDevDesignSummary.remove({
            userId:     userId,
        });
    }
}

export default new UserDevDesignSummaryData();