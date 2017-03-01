import {RoleType, ViewOptionType, ViewType} from '../../imports/constants/constants.js'

class UserManagementActions {

    // Add user
    adminAddsNewUser(expectation){

        server.call('testUserManagement.addNewUser', 'admin', expectation);
    };

    designerAddsNewUser(expectation){

        server.call('testUserManagement.addNewUser', 'gloria', expectation);
    };

    developerAddsNewUser(expectation){

        server.call('testUserManagement.addNewUser', 'hugh', expectation);
    };

    managerAddsNewUser(expectation){

        server.call('testUserManagement.addNewUser', 'miles', expectation);
    };


    // Save User
    adminSavesUserDetails(userName, newDetails, expectation){

        server.call('testUserManagement.saveUser', 'admin', userName, newDetails, expectation)
    };

    designerSavesUserDetails(userName, newDetails, expectation){

        server.call('testUserManagement.saveUser', 'gloria', userName, newDetails, expectation)
    };

    developerSavesUserDetails(userName, newDetails, expectation){

        server.call('testUserManagement.saveUser', 'hugh', userName, newDetails, expectation)
    };

    managerSavesUserDetails(userName, newDetails, expectation){

        server.call('testUserManagement.saveUser', 'miles', userName, newDetails, expectation)
    };



    // Activate / Deactivate
    adminDeactivatesUser(userName, expectation){

        server.call('testUserManagement.deactivateUser', 'admin', userName, expectation);
    };

    designerDeactivatesUser(userName, expectation){

        server.call('testUserManagement.deactivateUser', 'gloria', userName, expectation);
    };

    developerDeactivatesUser(userName, expectation){

        server.call('testUserManagement.deactivateUser', 'hugh', userName, expectation);
    };

    managerDeactivatesUser(userName, expectation){

        server.call('testUserManagement.deactivateUser', 'miles', userName, expectation);
    };

    adminActivatesUser(userName, expectation){

        server.call('testUserManagement.activateUser', 'admin', userName, expectation);
    };

    designerActivatesUser(userName, expectation){

        server.call('testUserManagement.activateUser', 'gloria', userName, expectation);
    };

    developerActivatesUser(userName, expectation){

        server.call('testUserManagement.activateUser', 'hugh', userName, expectation);
    };

    managerActivatesUser(userName, expectation){

        server.call('testUserManagement.activateUser', 'miles', userName, expectation);
    };

}

export default new UserManagementActions();
