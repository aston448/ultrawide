import { TestFixtures }                     from '../../../test_framework/test_wrappers/test_fixtures.js';
import { UserManagementActions }            from '../../../test_framework/test_wrappers/user_management_actions.js';
import { UserManagementVerifications }      from '../../../test_framework/test_wrappers/user_management_verifications.js';

import { UserManagementValidationErrors } from '../../../imports/constants/validation_errors.js'
import { DefaultUserDetails }           from '../../../imports/constants/default_names.js'

describe('UC 804 - Reactivate User', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 804 - Reactivate User');
    });

    after(function(){

    });

    beforeEach(function(){
        TestFixtures.clearAllData();
    });

    afterEach(function(){
        // Need to do this or tests will fail due to existing Meteor users
        TestFixtures.removeAllMeteorUsers();
    });


    // Actions
    it('The admin user can reactivate an inactive user', function(){

        // Setup - add a new user and deactivate
        UserManagementActions.adminAddsNewUser();
        UserManagementActions.adminDeactivatesUser(DefaultUserDetails.NEW_USER_NAME);
        expect(UserManagementVerifications.userIsInactive(DefaultUserDetails.NEW_USER_NAME));

        // Execute
        UserManagementActions.adminActivatesUser(DefaultUserDetails.NEW_USER_NAME);

        // Verify
        expect(UserManagementVerifications.userIsActive(DefaultUserDetails.NEW_USER_NAME));
    });


    // Conditions
    it('Only the admin user can reactivate a user', function(){

        // Setup - add a new user and deactivate
        UserManagementActions.adminAddsNewUser();
        UserManagementActions.adminDeactivatesUser(DefaultUserDetails.NEW_USER_NAME);
        expect(UserManagementVerifications.userIsInactive(DefaultUserDetails.NEW_USER_NAME));

        // Expect all to fail
        const expectation = {success: false, message: UserManagementValidationErrors.USER_MANAGEMENT_INVALID_USER_ACTIVATE};

        // Designer
        UserManagementActions.designerActivatesUser(DefaultUserDetails.NEW_USER_NAME, expectation);
        expect(UserManagementVerifications.userIsInactive(DefaultUserDetails.NEW_USER_NAME));

        // Developer
        UserManagementActions.developerActivatesUser(DefaultUserDetails.NEW_USER_NAME, expectation);
        expect(UserManagementVerifications.userIsInactive(DefaultUserDetails.NEW_USER_NAME));

        // Manager
        UserManagementActions.managerActivatesUser(DefaultUserDetails.NEW_USER_NAME, expectation);
        expect(UserManagementVerifications.userIsInactive(DefaultUserDetails.NEW_USER_NAME));
    });


});
