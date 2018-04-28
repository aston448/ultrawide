import { Meteor } from 'meteor/meteor';

import {  } from '../../imports/constants/constants.js';

import { TestDataHelpers }      from '../test_modules/test_data_helpers.js'

Meteor.methods({

    // LOCATIONS -------------------------------------------------------------------------------------------------------

    'verifyTestResults.scenarioIntTestResultIs'(scenarioName, result, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const testResult = TestDataHelpers.getMashTestResult(userContext, scenarioName);


        if (testResult.intMashTestStatus !== result) {
            throw new Meteor.Error("FAIL", "Expecting test result " + result + " but got " + testResult.intMashTestStatus + " for Scenario " + scenarioName);
        } else {
            return true;
        }
    },

    'verifyTestResults.scenarioUnitTestResultIs'(scenarioName, result, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const testResult = TestDataHelpers.getMashTestResult(userContext, scenarioName);


        if (testResult.unitMashTestStatus !== result) {
            throw new Meteor.Error("FAIL", "Expecting test result " + result + " but got " + testResult.unitMashTestStatus + " for Scenario " + scenarioName);
        } else {
            return true;
        }
    },

    'verifyTestResults.unitTestResultIs'(scenarioName, unitTestName, result, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const testResult = TestDataHelpers.getUnitTestResult(userContext, scenarioName, unitTestName);

        if (testResult.testOutcome !== result) {
            throw new Meteor.Error("FAIL", "Expecting unit test result " + result + " but got " + testResult.testOutcome + " for Scenario " + scenarioName + " unit test " + unitTestName);
        } else {
            return true;
        }
    },

    'verifyTestResults.testMashWindowContainsUnitTest'(scenarioName, unitTestName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        // This will error if not found
        const testResult = TestDataHelpers.getUnitTestResult(userContext, scenarioName, unitTestName);
    },


    'verifyTestResults.testMashWindowDoesNotContainUnitTest'(scenarioName, unitTestName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        // This will error if not found so pass in expect failure
        const testResult = TestDataHelpers.getUnitTestResult(userContext, scenarioName, unitTestName, true);
    },

});
