import { Meteor } from 'meteor/meteor';

import { UserRoles }                from '../../imports/collections/users/user_roles.js';

import TestDataHelpers              from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'verifyUserManagement.userExistsCalled'(userName){

        const targetUser = UserRoles.findOne({userName: userName});

        if (targetUser) {
            return true;
        } else {
            throw new Meteor.Error("FAIL", "User " + userName + " not found");
        }
    },

    'verifyUserManagement.userDetailsAre'(userDetails){

        const targetUser = UserRoles.findOne({userName: userDetails.userName});

        if (targetUser) {
            // So we know the name is OK...
            if(targetUser.password === userDetails.password){
                if(targetUser.displayName === userDetails.displayName){
                    if(targetUser.isDesigner === userDetails.isDesigner){
                        if(targetUser.isDeveloper === userDetails.isDeveloper){
                            if(targetUser.isManager === userDetails.isManager){
                                if(targetUser.isActive === userDetails.isActive){
                                    return true;
                                } else {
                                    throw new Meteor.Error("FAIL", "Expecting user isActive to be " + userDetails.isActive + " but found " + targetUser.isActive);
                                }
                            } else {
                                throw new Meteor.Error("FAIL", "Expecting user isManager to be " + userDetails.isManager + " but found " + targetUser.isManager);
                            }
                        } else {
                            throw new Meteor.Error("FAIL", "Expecting user isDeveloper to be " + userDetails.isDeveloper + " but found " + targetUser.isDeveloper);
                        }
                    } else {
                        throw new Meteor.Error("FAIL", "Expecting user isDesigner to be " + userDetails.isDesigner + " but found " + targetUser.isDesigner);
                    }
                } else {
                    throw new Meteor.Error("FAIL", "Expecting user display name to be " + userDetails.displayName + " but found " + targetUser.displayName);
                }
            } else {
                throw new Meteor.Error("FAIL", "Expecting user password to be " + userDetails.password + " but found " + targetUser.password);
            }
        } else {
            throw new Meteor.Error("FAIL", "User " + userDetails.userName + " not found");
        }
    },

    'verifyUserManagement.userIsActive'(userName){

        const targetUser = UserRoles.findOne({userName: userName});

        if (targetUser) {
            if(targetUser.isActive){
                return true;
            } else {
                throw new Meteor.Error("FAIL", "Expecting user to be ACTIVE");
            }
        } else {
            throw new Meteor.Error("FAIL", "User " + userName + " not found");
        }
    },

    'verifyUserManagement.userIsDeactivated'(userName){

        const targetUser = UserRoles.findOne({userName: userName});

        if (targetUser) {
            if(!(targetUser.isActive)){
                return true;
            } else {
                throw new Meteor.Error("FAIL", "Expecting user to be DEACTIVATED");
            }
        } else {
            throw new Meteor.Error("FAIL", "User " + userName + " not found");
        }
    },

});
