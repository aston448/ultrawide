import {UserDevDesignSummary}       from '../../collections/summary/user_dev_design_summary.js';

class UserDevDesignSummaryDataClass {

    // INSERT ==========================================================================================================

    insertNewDesignSummary(
        userId,
        designVersionId,
        designUpdateId,
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
            designUpdateId: designUpdateId,
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

    // Note - this may be a summary of an update only if designUpdateId is not NONE
    getUserDesignSummary(userContext){

        return UserDevDesignSummary.findOne({
            userId:             userContext.userId,
            designVersionId:    userContext.designVersionId,
            designUpdateId:     userContext.designUpdateId
        });
    }


    // REMOVE ==========================================================================================================

    removeAllUserData(userId){

        return UserDevDesignSummary.remove({
            userId:     userId,
        });
    }
}

export const UserDevDesignSummaryData = new UserDevDesignSummaryDataClass();