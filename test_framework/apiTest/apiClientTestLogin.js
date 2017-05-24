import { Meteor } from 'meteor/meteor';

import ClientLoginServices              from '../../imports/apiClient/apiClientLogin.js'
import TestDataHelpers                  from '../test_modules/test_data_helpers.js'

import {RoleType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testLogin.loginUser'(userName, password, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const outcome = ClientLoginServices.userLogin(userName, password);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Add Design');
    },
});
