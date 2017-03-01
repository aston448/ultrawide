import { Meteor } from 'meteor/meteor';


import { UserRoles }   from '../../imports/collections/users/user_roles.js';

import ClientUserManagementServices     from '../../imports/apiClient/apiClientUserManagement.js';
import TestDataHelpers                  from '../test_modules/test_data_helpers.js'


Meteor.methods({

    'testUserManagement.addNewUser'(actioningUserName, expectation){


        expectation = TestDataHelpers.getExpectation(expectation);

        const actioningUser = UserRoles.findOne({userName: actioningUserName});

        if(!actioningUser){
            throw new Meteor.Error("FAIL", "Actioning user " + actioningUserName + " not found");
        }

        const outcome = ClientUserManagementServices.addUser(actioningUser.userId);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Add User');

    },

    'testUserManagement.saveUser'(actioningUserName, userName, newDetails, expectation){


        expectation = TestDataHelpers.getExpectation(expectation);

        const actioningUser = UserRoles.findOne({userName: actioningUserName});

        if(!actioningUser){
            throw new Meteor.Error("FAIL", "Actioning user " + actioningUserName + " not found");
        }

        const targetUser = UserRoles.findOne({userName: userName});

        if(!targetUser){
            throw new Meteor.Error("FAIL", "User " + userName + " not found");
        }

        const newUser = {
            userId:         targetUser.userId,
            userName:       newDetails.userName,
            password:       newDetails.password,
            displayName:    newDetails.displayName,
            isDesigner:     newDetails.isDesigner,
            isDeveloper:    newDetails.isDeveloper,
            isManager:      newDetails.isManager,
            isAdmin:        false,
            isActive:       targetUser.isActive
        };

        const outcome = ClientUserManagementServices.saveUser(actioningUser.userId, newUser);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Save User');

    },

    'testUserManagement.deactivateUser'(actioningUserName, userName, expectation){


        expectation = TestDataHelpers.getExpectation(expectation);

        const actioningUser = UserRoles.findOne({userName: actioningUserName});

        if(!actioningUser){
            throw new Meteor.Error("FAIL", "Actioning user " + actioningUserName + " not found");
        }

        const targetUser = UserRoles.findOne({userName: userName});

        if(!targetUser){
            throw new Meteor.Error("FAIL", "User " + userName + " not found");
        }

        const outcome = ClientUserManagementServices.deactivateUser(actioningUser.userId, targetUser.userId);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Deactivate User');

    },

    'testUserManagement.activateUser'(actioningUserName, userName, expectation){


        expectation = TestDataHelpers.getExpectation(expectation);

        const actioningUser = UserRoles.findOne({userName: actioningUserName});

        if(!actioningUser){
            throw new Meteor.Error("FAIL", "Actioning user " + actioningUserName + " not found");
        }

        const targetUser = UserRoles.findOne({userName: userName});

        if(!targetUser){
            throw new Meteor.Error("FAIL", "User " + userName + " not found");
        }

        const outcome = ClientUserManagementServices.activateUser(actioningUser.userId, targetUser.userId);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Activate User');

    },


});

