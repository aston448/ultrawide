
import {
    addUser,
    saveUser,
    activateUser,
    deactivateUser
} from '../apiValidatedMethods/user_management_methods.js'

// =====================================================================================================================
// Server API for User Management
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================

class ServerUserManagementApi {

    addUser(actionUserId, callback) {

        addUser.call(
            {
                actionUserId: actionUserId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    saveUser(actionUserId, user, callback) {

        saveUser.call(
            {
                actionUserId:   actionUserId,
                user:           user
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    activateUser(actionUserId, userId, callback) {

        activateUser.call(
            {
                actionUserId:   actionUserId,
                userId:         userId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    deactivateUser(actionUserId, userId, callback) {

        deactivateUser.call(
            {
                actionUserId:   actionUserId,
                userId:         userId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };
}

export default new ServerUserManagementApi();
