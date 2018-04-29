import { Meteor } from 'meteor/meteor';

import { ClientTestIntegrationServices } from '../../imports/apiClient/apiClientTestIntegration';

import { TestDataHelpers }                  from '../test_modules/test_data_helpers.js'

import {RoleType, TestType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testIntegration.refreshTestResults'(view, role, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const viewOptions = TestDataHelpers.getViewOptions(userContext.userId);

        const outcome = ClientTestIntegrationServices.refreshTestData(userContext, true);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Refresh Test Results');
    },

    // 'testIntegration.refreshTestData'(view, role, userName, expectation){
    //
    //     expectation = TestDataHelpers.getExpectation(expectation);
    //
    //     const userContext = TestDataHelpers.getUserContext(userName);
    //     const viewOptions = TestDataHelpers.getViewOptions(userName);
    //
    //     const outcome = ClientTestIntegrationServices.refreshDesignMashData(userContext);
    //
    //     TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Refresh Test Results');
    // },

});