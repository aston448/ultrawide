import { Meteor } from 'meteor/meteor';

import ClientTestIntegrationServices from '../../imports/apiClient/apiClientTestIntegration';

import TestDataHelpers                  from '../test_modules/test_data_helpers.js'

import {RoleType, TestType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testIntegration.refreshTestResults'(role, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const viewOptions = TestDataHelpers.getViewOptions(userName);

        // Ensure stale flag is false here so Design not refreshed
        const outcome = ClientTestIntegrationServices.refreshTestData(userContext, role, viewOptions, false, false);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Refresh Test Results');
    },

    'testIntegration.refreshTestData'(role, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const viewOptions = TestDataHelpers.getViewOptions(userName);

        // This actually calls Refresh Test Data but with stale flag true so Design is also refreshed
        const outcome = ClientTestIntegrationServices.refreshDesignMashData(userContext, role, viewOptions, false);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Refresh Test Results');
    },

});