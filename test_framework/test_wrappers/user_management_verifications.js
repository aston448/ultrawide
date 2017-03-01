
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

import TestFixtures from './test_fixtures.js';

class UserManagementVerifications {

    ultrawideUserExistsCalled(userName) {

        server.call('verifyUserManagement.userExistsCalled', userName,
            (function (error, result) {
                return (error === null);
            })
        );
    };

    ultrawideUserDoesNotExistCalled(userName) {

        server.call('verifyUserManagement.userDoesNotExistCalled', userName,
            (function (error, result) {
                return (error === null);
            })
        );
    };

    userDetailsAre(userDetails) {

        server.call('verifyUserManagement.userDetailsAre', userDetails,
            (function (error, result) {
                return (error === null);
            })
        );
    };

    userIsActive(userName){

        server.call('verifyUserManagement.userIsActive', userName,
            (function (error, result) {
                return (error === null);
            })
        );
    };

    userIsInactive(userName){

        server.call('verifyUserManagement.userIsDeactivated', userName,
            (function (error, result) {
                return (error === null);
            })
        );
    };
}

export default new UserManagementVerifications();
