// == IMPORTS ==========================================================================================================

// Ultrawide Services
import { ViewType, MessageType }            from '../constants/constants.js';
import { Validation }                       from '../constants/validation_errors.js';
import { UserManagementMessages }           from '../constants/message_texts.js'

import ServerUserManagementApi              from '../apiServer/apiUserManagement';
import UserManagementValidationApi          from '../apiValidation/apiUserManagementValidation.js';
import { ClientAppHeaderServices }              from '../apiClient/apiClientAppHeader.js';

// Data Access
import { UserRoleData }                         from '../data/users/user_role_db.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserId, updateUserMessage} from '../redux/actions'

// =====================================================================================================================
// Client API for User Management
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================
class ClientUserManagementServices{

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // Admin adds a new User -------------------------------------------------------------------------------------------
    addUser(actionUserId){

        // Client validation
        let result = UserManagementValidationApi.validateAddUser(actionUserId);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerUserManagementApi.addUser(actionUserId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: UserManagementMessages.MSG_USER_ADDED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // Admin saves user details ----------------------------------------------------------------------------------------
    saveUser(actionUserId, user){

        // Client validation
        let result = UserManagementValidationApi.validateSaveUser(actionUserId, user);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerUserManagementApi.saveUser(actionUserId, user, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: UserManagementMessages.MSG_USER_UPDATED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // Admin resets user password --------------------------------------------------------------------------------------
    resetUserPassword(actionUserId, user){

        // Client validation
        let result = UserManagementValidationApi.validateResetUserPassword(actionUserId, user);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerUserManagementApi.resetUserPassword(actionUserId, user, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: UserManagementMessages.MSG_USER_PASSWORD_RESET
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    }

    // Admin sets user active ------------------------------------------------------------------------------------------
    activateUser(actionUserId, userId){

        // Client validation
        let result = UserManagementValidationApi.validateActivateDeactivateUser(actionUserId, true);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerUserManagementApi.activateUser(actionUserId, userId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: UserManagementMessages.MSG_USER_ACTIVATED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // Admin sets user inactive ----------------------------------------------------------------------------------------
    deactivateUser(actionUserId, userId){

        // Client validation
        let result = UserManagementValidationApi.validateActivateDeactivateUser(actionUserId, false);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerUserManagementApi.deactivateUser(actionUserId, userId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: UserManagementMessages.MSG_USER_DEACTIVATED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    saveUserApiKey(apiKey){

        const userId = store.getState().currentUserItemContext.userId;

        ServerUserManagementApi.saveUserApiKey(userId, apiKey, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: UserManagementMessages.MSG_USER_API_KEY_SAVED
                }));
            }
        });
    }

    changeAdminPassword(oldPassword, newPassword1, newPassword2){

        const userId = store.getState().currentUserItemContext.userId;

        // Client validation
        let result = UserManagementValidationApi.validateChangeAdminPassword(userId, newPassword1, newPassword2);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        if(Meteor.isClient){

            Accounts.changePassword(oldPassword, newPassword1, (err) => {

                if(err){

                    store.dispatch(updateUserMessage({
                        messageType: MessageType.ERROR,
                        messageText: err.reason
                    }));

                    return {success: false, message: err.reason};

                } else {

                    store.dispatch(updateUserMessage({
                        messageType: MessageType.INFO,
                        messageText: UserManagementMessages.MSG_AMIN_PASSWORD_CHANGED
                    }));

                    ClientAppHeaderServices.setViewLogin(store.getState().currentUserItemContext);
                }
            });

        }

        // Indicate that business validation passed
        return {success: true, message: ''};
    }

    changeUserPassword(oldPassword, newPassword1, newPassword2){

        // Client validation
        let result = UserManagementValidationApi.validateChangeUserPassword(newPassword1, newPassword2);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        if(Meteor.isClient){

            Accounts.changePassword(oldPassword, newPassword1, (err) => {

                if(err){

                    store.dispatch(updateUserMessage({
                        messageType: MessageType.ERROR,
                        messageText: err.reason
                    }));

                    return {success: false, message: err.reason};

                } else {

                    store.dispatch(updateUserMessage({
                        messageType: MessageType.INFO,
                        messageText: UserManagementMessages.MSG_AMIN_PASSWORD_CHANGED
                    }));

                    ClientAppHeaderServices.setViewLogin(store.getState().currentUserItemContext);
                }
            });

        }

        // Indicate that business validation passed
        return {success: true, message: ''};
    }

    // LOCAL CLIENT ACTIONS ============================================================================================

    // Keep track of the currently selected location
    setCurrentUser(userId){

        store.dispatch(setCurrentUserId(userId));

    };

    getUserApiKey(){

        const userId = store.getState().currentUserItemContext.userId;

        const userData = UserRoleData.getRoleByUserId(userId);

        if(userData){
            return userData.apiKey;
        } else {
            return 'No key available'
        }
    }

    generateUserApiKey(){

        let newKey = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( let i=0; i < 16; i++ ) {
            newKey += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        // And store it
        this.saveUserApiKey(newKey);

        return newKey;
    }


}

export default new ClientUserManagementServices();
