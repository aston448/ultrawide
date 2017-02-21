import { Meteor } from 'meteor/meteor';

import ClientTestIntegrationServices from '../../imports/apiClient/apiClientTestIntegration';

import TestDataHelpers                  from '../test_modules/test_data_helpers.js'

import {RoleType, TestType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testIntegration.refreshTestResults'(role, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const viewOptions = TestDataHelpers.getViewOptions(userName);

        const outcome = ClientTestIntegrationServices.refreshTestData(userContext, role, viewOptions, false, false);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Refresh Test Results');
    },

});