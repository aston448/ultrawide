
// Ultrawide Services
import { RoleType, TestLocationType, TestLocationAccessType } from '../../constants/constants.js';
import { Validation, UserManagementValidationErrors } from '../../constants/validation_errors.js';
import { isAlphaNumeric } from '../../common/utils.js'

//======================================================================================================================
//
// Validation Services for User Managements.
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class UserManagementValidationServices {


    validateAddUser(actionUser) {

        // The actioning user must be the Admin user
        if (!(actionUser.isAdmin)) {
            return UserManagementValidationErrors.USER_MANAGEMENT_INVALID_USER_ADD;
        }

        return Validation.VALID;
    };

    validateSaveUser(actionUser, thisUser, otherUsers){

        // The actioning user must be the Admin user
        if (!(actionUser.isAdmin)) {
            return UserManagementValidationErrors.USER_MANAGEMENT_INVALID_USER_SAVE;
        }

        // The user cannot be given the user name 'admin'
        if(thisUser.userName === 'admin'){
            return UserManagementValidationErrors.USER_MANAGEMENT_INVALID_USER_NAME_ADMIN;
        }

        // The user name cannot be blank
        if(thisUser.userName === ''){
            return UserManagementValidationErrors.USER_MANAGEMENT_INVALID_USER_NAME_BLANK;
        }

        // The user name should only contain alpha-numeric characters
        if(!(isAlphaNumeric(thisUser.userName))){
            return UserManagementValidationErrors.USER_MANAGEMENT_INVALID_USER_NAME_ALPHANUM;
        }

        // The user cannot be given an existing user name
        let duplicate = false;
        otherUsers.forEach((user) => {
            if(user.userName === thisUser.userName){
                duplicate = true;
            }
        });

        if(duplicate){
            return UserManagementValidationErrors.USER_MANAGEMENT_INVALID_USER_NAME_DUPLICATE
        }

        return Validation.VALID;
    };

    validateResetUserPassword(actionUser){

        console.log("Action user: " + actionUser.userName);

        // Action user must be Admin
        if (!(actionUser.isAdmin)) {
            return UserManagementValidationErrors.USER_MANAGEMENT_INVALID_USER_RESET_PASSWORD;
        }

        return Validation.VALID;
    }

    validateActivateDeactivateUser(actionUser, isActive){

        // The actioning user must be the Admin user
        if (!(actionUser.isAdmin)) {
            if(isActive){
                return UserManagementValidationErrors.USER_MANAGEMENT_INVALID_USER_ACTIVATE;
            } else {
                return UserManagementValidationErrors.USER_MANAGEMENT_INVALID_USER_DEACTIVATE;
            }
        }

        return Validation.VALID;
    };

    validateChangeAdminPassword(actionUser, newPassword1, newPassword2){

        // The actioning user must be the Admin user
        if (!(actionUser.isAdmin)) {

            return UserManagementValidationErrors.USER_MANAGEMENT_INVALID_USER_CHANGE_ADMIN_PASSWD;
        }

        // The new passwords must match
        if(newPassword1 !== newPassword2){
            return UserManagementValidationErrors.USER_MANAGEMENT_INVALID_NEW_PASSWORDS
        }

        return Validation.VALID;
    };

    validateChangeUserPassword(newPassword1, newPassword2){

        // The new passwords must match
        if(newPassword1 !== newPassword2){
            return UserManagementValidationErrors.USER_MANAGEMENT_INVALID_NEW_PASSWORDS
        }

        return Validation.VALID;
    };
}

export default new UserManagementValidationServices();


