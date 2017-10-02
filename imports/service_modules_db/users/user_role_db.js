
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

    getRoleByUserName(userName){

        return UserRoles.findOne({userName: userName});
    }

    getAllUserRoles(){

        return UserRoles.find({}).fetch();
    }
}

export default new UserRoleData();