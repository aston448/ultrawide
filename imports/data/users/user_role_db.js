
import { UserRoles }                    from '../../collections/users/user_roles.js';

class UserRoleData{

    // INSERT ==========================================================================================================

    insertNewUserRole(userId, user){

        return UserRoles.insert({
            userId: userId,
            userName: user.userName,
            displayName: user.displayName,
            isDesigner: user.isDesigner,
            isDeveloper: user.isDeveloper,
            isManager: user.isManager,
            isAdmin: false,
            isActive: user.isActive
        });
    }

    insertAdminUser(userId){

        return UserRoles.insert({
            userId:         userId,
            userName:       'admin',
            displayName:    'Admin User',
            isDesigner:     false,
            isDeveloper:    false,
            isManager:      false,
            isAdmin:        true
        });
    }

    // SELECT ==========================================================================================================

    getRoleByUserId(userId){

        return UserRoles.findOne({userId: userId});
    }

    getRoleByUserName(userName){

        return UserRoles.findOne({userName: userName});
    }

    getAllUserRoles(){

        return UserRoles.find({}).fetch();
    }

    getOtherUsers(userId){

        UserRoles.find({_id: {$ne: userId}}).fetch();
    }

    getNonAdminUsers(){

        return UserRoles.find({
            isAdmin: false
        }).fetch();
    }

    // UPDATE ==========================================================================================================

    saveUserDetails(newUser){

        return UserRoles.update(
            {userId: newUser.userId},
            {
                $set: {
                    userName:       newUser.userName,
                    displayName:    newUser.displayName,
                    isDesigner:     newUser.isDesigner,
                    isDeveloper:    newUser.isDeveloper,
                    isManager:      newUser.isManager,
                }
            }
        );
    }

    setActiveFlag(userId, isActive){

        return UserRoles.update(
            {userId: userId},
            {
                $set: {
                    isActive: isActive
                }
            }
        );
    }

    setApiKey(userId, apiKey){

        return UserRoles.update(
            {userId: userId},
            {
                $set:{
                    apiKey: apiKey
                }
            }
        );
    }
}

export default new UserRoleData();