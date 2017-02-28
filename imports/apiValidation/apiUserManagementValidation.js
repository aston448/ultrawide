
// Ultrawide Collections
import { UserRoles }                    from '../collections/users/user_roles.js';

// Ultrawide Services
import UserManagementValidationServices from '../service_modules/validation/user_management_validation_services.js';
import { Validation, UserManagementValidationErrors } from '../constants/validation_errors.js';
//======================================================================================================================
//
// Validation API for User Management
//
//======================================================================================================================

class UserManagementValidationApi{

    validateAddUser(actionUserId){

        const actionUser = UserRoles.findOne({userId: actionUserId});

        if(!actionUser){
            return UserManagementValidationErrors.USER_MANAGEMENT_NO_ADMIN_USER;
        } else {
            return UserManagementValidationServices.validateAddUser(actionUser)
        }
    };

    validateSaveUser(actionUserId, newUser){

        const actionUser = UserRoles.findOne({userId: actionUserId});

        // Get other users that are not the current one
        const otherUsers = UserRoles.find({_id: {$ne: newUser._id}}).fetch();

        if(!actionUser){
            return UserManagementValidationErrors.USER_MANAGEMENT_NO_ADMIN_USER;
        } else {
            return UserManagementValidationServices.validateSaveUser(actionUser, newUser, otherUsers)
        }
    };

    validateActivateDeactivateUser(actionUserId, isActive){

        const actionUser = UserRoles.findOne({userId: actionUserId});

        if(!actionUser){
            return UserManagementValidationErrors.USER_MANAGEMENT_NO_ADMIN_USER;
        } else {
            return UserManagementValidationServices.validateActivateDeactivateUser(actionUser, isActive)
        }
    }
}

export default new UserManagementValidationApi();
