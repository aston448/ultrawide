
import {UserDvScenarioTestExpectationStatus} from "../../collections/mash/user_dv_scenario_test_expectation_status.js";

class UserDvScenarioTestExpectationStatusDataClass{

    // INSERT ==========================================================================================================
    insertUserScenarioTestExpectationStatus(userId, designVersionId, expectationId, testResult){

        return UserDvScenarioTestExpectationStatus.insert(
            {

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


    setUserExpectationTestStatus(userId, designVersionId, expectationId, testResult){

        return UserDvScenarioTestExpectationStatus.update(
            {
                userId:                     userId,
                designVersionId:            designVersionId,
                scenarioTestExpectationId:  expectationId
            },
            {
                $set:{
                    expectationStatus: testResult
                }
            }
        );
    }



    // REMOVE ==========================================================================================================

    removeAllUserExpectationStatuses(userId){

        return UserDvScenarioTestExpectationStatus.remove(
            {userId: userId}
        );
    }

}

export const UserDvScenarioTestExpectationStatusData = new UserDvScenarioTestExpectationStatusDataClass();