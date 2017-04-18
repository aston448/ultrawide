
import { Validation } from '../constants/validation_errors.js'

import UserManagementValidationApi      from '../apiValidation/apiUserManagementValidation.js';
import UserManagementServices           from '../servicers/users/user_management_services.js';

//======================================================================================================================
//
// Meteor Validated Methods for User Management
//
//======================================================================================================================

export const addUser = new ValidatedMethod({

    name: 'userManagement.addUser',

    validate: new SimpleSchema({
        actionUserId:   {type: String}
    }).validator(),

    run({actionUserId}){

        const result = UserManagementValidationApi.validateAddUser(actionUserId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('userManagement.addUser.failValidation', result)
        }

        try {
            UserManagementServices.addUser();
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.error, e.stack)
        }
    }
});

export const saveUser = new ValidatedMethod({

    name: 'userManagement.saveUser',

    validate: new SimpleSchema({
        actionUserId:   {type: String},
        user:           {type: Object, blackbox: true}
    }).validator(),

    run({actionUserId, user}){

        const result = UserManagementValidationApi.validateSaveUser(actionUserId, user);

        if (result != Validation.VALID) {
            throw new Meteor.Error('userManagement.saveUser.failValidation', result)
        }

        try {
            UserManagementServices.saveUser(user);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.error, e.stack)
        }
    }
});

export const activateUser = new ValidatedMethod({

    name: 'userManagement.activateUser',

    validate: new SimpleSchema({
        actionUserId:   {type: String},
        userId:         {type: String}
    }).validator(),

    run({actionUserId, userId}){

        const result = UserManagementValidationApi.validateActivateDeactivateUser(actionUserId, true);

        if (result != Validation.VALID) {
            throw new Meteor.Error('userManagement.activateUser.failValidation', result)
        }

        try {
            UserManagementServices.setUserActive(userId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.error, e.stack)
        }
    }
});

export const deactivateUser = new ValidatedMethod({

    name: 'userManagement.deactivateUser',

    validate: new SimpleSchema({
        actionUserId:   {type: String},
        userId:         {type: String}
    }).validator(),

    run({actionUserId, userId}){

        const result = UserManagementValidationApi.validateActivateDeactivateUser(actionUserId, false);

        if (result != Validation.VALID) {
            throw new Meteor.Error('userManagement.deactivateUser.failValidation', result)
        }

        try {
            UserManagementServices.setUserInactive(userId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.error, e.stack)
        }
    }
});
