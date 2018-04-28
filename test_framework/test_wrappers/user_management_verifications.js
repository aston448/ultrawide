
class UserManagementVerificationsClass {

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

export const UserManagementVerifications = new UserManagementVerificationsClass();
