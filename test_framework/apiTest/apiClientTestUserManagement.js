import { Meteor } from 'meteor/meteor';


import { UserRoles }   from '../../imports/collections/users/user_roles.js';

import ClientUserManagementServices     from '../../imports/apiClient/apiClientUserManagement.js';
import TestDataHelpers                  from '../test_modules/test_data_helpers.js'


Meteor.methods({

    'testUserManagement.addNewUser'(expectation){


        expectation = TestDataHelpers.getExpectation(expectation);

        const adminUser = UserRoles.findOne({userName: 'admin'});

        if(!adminUser){
            throw new Meteor.Error("FAIL", "Admin user not found");
        }

        const outcome = ClientUserManagementServices.addUser(adminUser.userId);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Add User');

    },

    'testUserManagement.saveUser'(newUser, expectation){


        expectation = TestDataHelpers.getExpectation(expectation);

        const adminUser = UserRoles.findOne({userName: 'admin'});

        if(!adminUser){
            throw new Meteor.Error("FAIL", "Admin user not found");
        }

        const outcome = ClientUserManagementServices.saveUser(adminUser.userId, newUser);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Save User');

    },

    'testUserManagement.deactivateUser'(userName, expectation){


        expectation = TestDataHelpers.getExpectation(expectation);

        const adminUser = UserRoles.findOne({userName: 'admin'});

        if(!adminUser){
            throw new Meteor.Error("FAIL", "Admin user not found");
        }

        const targetUser = UserRoles.findOne({userName: userName});

        if(!targetUser){
            throw new Meteor.Error("FAIL", "User " + userName + " not found");
        }

        const outcome = ClientUserManagementServices.deactivateUser(adminUser.userId, targetUser.userId);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Deactivate User');

    },

    'testUserManagement.activateUser'(userName, expectation){


        expectation = TestDataHelpers.getExpectation(expectation);

        const adminUser = UserRoles.findOne({userName: 'admin'});

        if(!adminUser){
            throw new Meteor.Error("FAIL", "Admin user not found");
        }

        const targetUser = UserRoles.findOne({userName: userName});

        if(!targetUser){
            throw new Meteor.Error("FAIL", "User " + userName + " not found");
        }

        const outcome = ClientUserManagementServices.activateUser(adminUser.userId, targetUser.userId);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Activate User');

    },


});

