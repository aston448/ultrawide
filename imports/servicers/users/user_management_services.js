
// Ultrawide Collections
import { UserRoles }      from '../../collections/users/user_roles.js'

// Ultrawide Services
import { log }                      from '../../common/utils.js';
import { LogLevel}                  from '../../constants/constants.js';
import { DefaultUserDetails }       from '../../constants/default_names.js'


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
            UserRoles.insert(
                {
                    userId:             userId,
                    userName:           DefaultUserDetails.NEW_USER_NAME,
                    password:           DefaultUserDetails.NEW_USER_PASSWORD,
                    displayName:        DefaultUserDetails.NEW_USER_DISPLAY_NAME,
                    isDesigner:         false,
                    isDeveloper:        false,
                    isManager:          false,
                    isAdmin:            false,
                    isActive:           true
                }
            );
        }
    };

    saveUser(newUser){

        if (Meteor.isServer) {
            // Get existing details - userId cannot change
            const existingUser = UserRoles.findOne({userId: newUser.userId});

            // If username changed update it
            if (existingUser.userName != newUser.userName) {
                Accounts.setUsername(newUser.userId, newUser.userName);
            }

            // If password changed, update it
            if (existingUser.password != newUser.password) {
                Accounts.setPassword(newUser.userId, newUser.password);
            }

            UserRoles.update(
                {userId: newUser.userId},
                {
                    $set: {
                        userName:       newUser.userName,
                        password:       newUser.password,
                        displayName:    newUser.displayName,
                        isDesigner:     newUser.isDesigner,
                        isDeveloper:    newUser.isDeveloper,
                        isManager:      newUser.isManager,
                    }
                }
            );
        }
    };

    setUserActive(userId){

        if (Meteor.isServer) {
            UserRoles.update(
                {userId: userId},
                {
                    $set: {
                        isActive: true
                    }
                }
            );
        }
    };

    setUserInactive(userId){

        if (Meteor.isServer) {
            UserRoles.update(
                {userId: userId},
                {
                    $set: {
                        isActive: false
                    }
                }
            );
        }
    };

    saveUserApiKey(userId, apiKey){

        UserRoles.update(
            {userId: userId},
            {
                $set:{
                    apiKey: apiKey
                }
            }
        );
    }

    verifyApiKey(apiKey){

        // The api key should be that provided to the admin user
        const userData = UserRoles.findOne({
            userName: 'admin'
        });

        if(userData){
            // And a key must have been deliberately generated
            if(userData.apiKey !== 'NONE'){
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

