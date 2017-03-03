import { Meteor } from 'meteor/meteor';

import ClientTestIntegrationServices from '../../imports/apiClient/apiClientTestIntegration';

import TestDataHelpers                  from '../test_modules/test_data_helpers.js'

import {RoleType, TestType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testIntegration.refreshTestResults'(view, role, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const viewOptions = TestDataHelpers.getViewOptions(userName);

        // Assume data is subscribed but test data needs a refresh - the call should set the test data to Stale
        const testIntegrationDataContext = {
            designVersionDataLoaded:        true,
            testIntegrationDataLoaded:      true,
            testSummaryDataLoaded:          true,
            mashDataStale:                  false,
            testDataStale:                  false
        };

        // Ensure stale flag is false here so Design not refreshed
        const outcome = ClientTestIntegrationServices.refreshTestData(view, userContext, role, viewOptions, false, testIntegrationDataContext);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Refresh Test Results');
    },

    'testIntegration.refreshTestData'(view, role, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const viewOptions = TestDataHelpers.getViewOptions(userName);

        // Assume data is subscribed but test and mash data needs a refresh - the call should set the test and mash data to Stale
        const testIntegrationDataContext = {
            designVersionDataLoaded:        true,
            testIntegrationDataLoaded:      true,
            testSummaryDataLoaded:          true,
            mashDataStale:                  false,
            testDataStale:                  false
        };

        // This actually calls Refresh Test Data but with stale flag true so Design is also refreshed
        const outcome = ClientTestIntegrationServices.refreshDesignMashData(view, userContext, role, viewOptions, false, testIntegrationDataContext);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Refresh Test Results');
    },

});