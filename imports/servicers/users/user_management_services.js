
// Ultrawide Services
import { log }                      from '../../common/utils.js';
import { LogLevel}                  from '../../constants/constants.js';
import { DefaultUserDetails }       from '../../constants/default_names.js'

// Data Access
import { UserRoleData }                 from '../../data/users/user_role_db.js';

//======================================================================================================================
//
// Server Code for User Management.
//
// Methods called directly by Server API
//
//======================================================================================================================

class UserManagementServices {

    // Add a new Ultrawide User
    addUser(){

        if (Meteor.isServer) {

            // Generate a unique user name so more than one new user can be generated at once before they are named
            const date = new Date();
            const newUserName = 'newUser_' + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();

            // Create a new Meteor account
            const userId = Accounts.createUser(
                {
                    username: newUserName,
                    password: 'password'
                }
            );

            // Create a new default entry.  Has no access until edited.
            const user = {
                userName:           DefaultUserDetails.NEW_USER_NAME,
                displayName:        DefaultUserDetails.NEW_USER_DISPLAY_NAME,
                isDesigner:         false,
                isDeveloper:        false,
                isManager:          false,
                isAdmin:            false,
                isActive:           true
            };

            UserRoleData.insertNewUserRole(
                userId,
                user
            );

        }
    };

    saveUser(newUser){

        if (Meteor.isServer) {
            // Get existing details - userId cannot change
            const existingUser = UserRoleData.getRoleByUserId(newUser.userId);

            // If username changed update it
            if (existingUser.userName !== newUser.userName) {
                Accounts.setUsername(newUser.userId, newUser.userName);
            }

            UserRoleData.saveUserDetails(newUser);
        }
    };

    resetUserPassword(user){

        if (Meteor.isServer) {

            Accounts.setPassword(user.userId, user.userName + '123');

        }
    };

    setUserActive(userId){

        if (Meteor.isServer) {

            UserRoleData.setActiveFlag(userId, true);
        }
    };

    setUserInactive(userId){

        if (Meteor.isServer) {

            UserRoleData.setActiveFlag(userId, false);
        }
    };

    saveUserApiKey(userId, apiKey){

        UserRoleData.setApiKey(userId, apiKey);
    }

    verifyApiKey(apiKey){

        // The api key should be that provided to the admin user
        const userData = UserRoleData.getRoleByUserName('admin');

        if(userData){
            // And a key must have been deliberately generated
            if(userData.apiKey !== 'NONE'){
                //console.log("Key: " + apiKey + "  User Key: " + userData.apiKey);
                if(userData.apiKey !== apiKey){
                    throw new Meteor.Error('API', 'Invalid Access Key');
                }
            } else {
                throw new Meteor.Error('API', 'No Access Key');
            }
        } else {
            throw new Meteor.Error('API', 'No Access Key');
        }

        return true;
    }

}

export default new UserManagementServices();

