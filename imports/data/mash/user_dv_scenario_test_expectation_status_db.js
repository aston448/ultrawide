
import {UserDvScenarioTestExpectationStatus} from "../../collections/mash/user_dv_scenario_test_expectation_status.js";

class UserDvScenarioTestExpectationStatusDataClass{

    // INSERT ==========================================================================================================
    insertUserScenarioTestExpectationStatus(userId, designVersionId, expectationId, testResult){

        return UserDvScenarioTestExpectationStatus.insert(
            {
                userId:                     userId,
                designVersionId:            designVersionId,
                scenarioTestExpectationId:  expectationId,
                expectationStatus:          testResult
            }
        );
    }

    bulkInsertData(batchData){
        UserDvScenarioTestExpectationStatus.batchInsert(batchData);
    }

    // SELECT ==========================================================================================================

    getUserExpectationStatusData(userId, designVersionId, expectationId){

        return UserDvScenarioTestExpectationStatus.findOne({
            userId:                     userId,
            designVersionId:            designVersionId,
            scenarioTestExpectationId:  expectationId
        });
    }

    // UPDATE ==========================================================================================================


    setUserExpectationTestStatus(testStatusId, testResult){

        return UserDvScenarioTestExpectationStatus.update(
            {
                _id:    testStatusId
            },
            {
                $set:{
                    expectationStatus: testResult
                }
            }
        );
    }



    // REMOVE ==========================================================================================================

    removeAllUserExpectationStatusesForExpectation(expectationId){

        return UserDvScenarioTestExpectationStatus.remove(
            {scenarioTestExpectationId: expectationId}
        );
    }

    removeAllUserExpectationStatuses(userId){

        return UserDvScenarioTestExpectationStatus.remove(
            {userId: userId}
        );
    }

}

export const UserDvScenarioTestExpectationStatusData = new UserDvScenarioTestExpectationStatusDataClass();