import { Meteor } from 'meteor/meteor';

import { UserWorkPackageMashData }      from '../../imports/collections/dev/user_work_package_mash_data.js';

import { MashTestStatus } from '../../imports/constants/constants.js';

import TestDataHelpers              from '../test_modules/test_data_helpers.js'

Meteor.methods({

    // LOCATIONS -------------------------------------------------------------------------------------------------------

    'verifyTestResults.scenarioIntTestResultIs'(scenarioName, result, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const testResult = TestDataHelpers.getMashTestResult(userContext, scenarioName);


        if (testResult.intMashTestStatus != result) {
            throw new Meteor.Error("FAIL", "Expecting test result " + result + " but got " + testResult.intMashTestStatus + " for Scenario " + scenarioName);
        } else {
            return true;
        }
    },

});
