
// Ultrawide Services
import UserManagementValidationServices from '../service_modules/validation/user_management_validation_services.js';
import { Validation, UserManagementValidationErrors } from '../constants/validation_errors.js';

// Data Access
import UserRoleData                     from '../data/users/user_role_db.js';

//======================================================================================================================
//
// Validation API for User Management
//
//======================================================================================================================

class UserManagementValidationApi{

    validateAddUser(actionUserId){

        const actionUser = UserRoleData.getRoleByUserId(actionUserId);

        if(!actionUser){
            return UserManagementValidationErrors.USER_MANAGEMENT_NO_ADMIN_USER;
        } else {
            return UserManagementValidationServices.validateAddUser(actionUser)
        }
    };

    validateSaveUser(actionUserId, newUser){

        const actionUser = UserRoleData.getRoleByUserId(actionUserId);

        // Get other users that are not the current one
        const otherUsers = UserRoleData.getOtherUsers(newUser._id);

        if(!actionUser){
            return UserManagementValidationErrors.USER_MANAGEMENT_NO_ADMIN_USER;
        } else {
            return UserManagementValidationServices.validateSaveUser(actionUser, newUser, otherUsers)
        }
    };

    validateResetUserPassword(actionUserId, user){

        const actionUser = UserRoleData.getRoleByUserId(actionUserId);

        if(!actionUser){
            return UserManagementValidationErrors.USER_MANAGEMENT_NO_ADMIN_USER;
        } else {
            return UserManagementValidationServices.validateResetUserPassword(actionUser)
        }
    }

    validateActivateDeactivateUser(actionUserId, isActive){

        const actionUser = UserRoleData.getRoleByUserId(actionUserId);

        if(!actionUser){
            return UserManagementValidationErrors.USER_MANAGEMENT_NO_ADMIN_USER;
        } else {
            return UserManagementValidationServices.validateActivateDeactivateUser(actionUser, isActive)
        }
    }

    validateChangeAdminPassword(userId, newPassword1, newPassword2){

        const actionUser = UserRoleData.getRoleByUserId(actionUserId);

        if(!actionUser){
            return UserManagementValidationErrors.USER_MANAGEMENT_NO_ADMIN_USER;
        } else {
            return UserManagementValidationServices.validateChangeAdminPassword(actionUser, newPassword1, newPassword2);
        }

    }

    validateChangeUserPassword(newPassword1, newPassword2){

        return UserManagementValidationServices.validateChangeUserPassword(newPassword1, newPassword2);
    }
}

export default new UserManagementValidationApi();
