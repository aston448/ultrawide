
// Data Access
import { UserContextData }          from '../../data/context/user_context_db.js';
import { UserViewOptionData }       from '../../data/context/user_view_option_db.js';
import { UserRoleData }             from '../../data/users/user_role_db.js';

//======================================================================================================================
//
// Server Code for User Context.
//
// Methods called directly by Server API
//
//======================================================================================================================

class UserContextServicesClass {

    // Save
    saveUserContext(context){

        if(Meteor.isServer) {
            // Remove the current context
            UserContextData.removeUserContext(context.userId);


            // Add the new one
            UserContextData.insertNewUserContext(context);
        }

        //console.log("User Context Saved.  DV: " + context.designVersionId + " DU: " + context.designUpdateId + " WP: " + context.workPackageId);
    };

    saveUserViewOptions(userViewOptions, userId){

        if(Meteor.isServer) {

            const currentViewOptions = UserViewOptionData.getUserViewOptions(userId);

            if(currentViewOptions){

                UserViewOptionData.updateUserViewOptions(userId, userViewOptions);

            } else {

                UserViewOptionData.insertNewUserViewOptions(userId, userViewOptions);

            }
        }
    };

    saveCurrentUserRole(userId, role){

        if(Meteor.isServer){

            UserRoleData.setCurrentRole(userId, role);
        }
    }

}

export const UserContextServices = new UserContextServicesClass();