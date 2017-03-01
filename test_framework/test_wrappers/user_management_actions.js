import {RoleType, ViewOptionType, ViewType} from '../../imports/constants/constants.js'

class UserManagementActions {


    adminAddsNewUser(expectation){

        server.call('testUserManagement.addNewUser', expectation);
    };

    adminSavesUserDetails(userName, newDetails, expectation){

        server.call('testUserManagement.saveUser', userName, newDetails, expectation)
    };

    adminDeactivatesUser(userName, expectation){

        server.call('testUserManagement.deactivateUser', userName, expectation);
    };

    adminActivatesUser(userName, expectation){

        server.call('testUserManagement.activateUser', userName, expectation);
    };

}

export default new UserManagementActions();
