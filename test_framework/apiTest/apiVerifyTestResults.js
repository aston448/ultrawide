import { Meteor } from 'meteor/meteor';

import {  } from '../../imports/constants/constants.js';

import { TestDataHelpers }      from '../test_modules/test_data_helpers.js'
import {MashTestStatus, TestType} from "../../imports/constants/constants";

Meteor.methods({

    'verifyTestResults.scenarioTestExpectationResultIs'(scenarioName, designPermutationName, designPermutationValue, testType, expectedResult, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const testResult = TestDataHelpers.getScenarioExpectationResult(userContext, scenarioName, testType, designPermutationName, designPermutationValue);

        if(testResult) {

            if (testResult.testOutcome !== expectedResult) {
                throw new Meteor.Error("FAIL", "Expecting test result " + expectedResult + " but got " + testResult.testOutcome + " for Scenario " + scenarioName + ' with permutation value ' + designPermutationValue);
            } else {
                return true;
            }

        } else {

            // See if we were expecting no result
            if(expectedResult === MashTestStatus.MASH_NO_TESTS){
                return true;
            } else {
                throw new Meteor.Error("FAIL", "Expecting test result " + expectedResult + " but got no results for Scenario " + scenarioName + ' with permutation value ' + designPermutationValue);
            }
        }
    },


});
