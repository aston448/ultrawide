import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import UserManagementActions            from '../../test_framework/test_wrappers/user_management_actions.js';
import UserManagementVerifications      from '../../test_framework/test_wrappers/user_management_verifications.js';

import { UserManagementValidationErrors } from '../../imports/constants/validation_errors.js'
import { DefaultUserDetails }           from '../../imports/constants/default_names.js'

describe('UC 803 - Deactivate User', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 803 - Deactivate User');
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
    it('The admin user can deactivate an active user', function(){

        // Setup - add a new user
        UserManagementActions.adminAddsNewUser();

        const defaultUser = {
            userName:       DefaultUserDetails.NEW_USER_NAME,
            password:       DefaultUserDetails.NEW_USER_PASSWORD,
            displayName:    DefaultUserDetails.NEW_USER_DISPLAY_NAME,
            isDesigner:     false,
            isDeveloper:    false,
            isManager:      false,
            isAdmin:        false,
            isActive:       true
        };

        expect(UserManagementVerifications.userDetailsAre(defaultUser));

        // Execute - deactivate
        UserManagementActions.adminDeactivatesUser(DefaultUserDetails.NEW_USER_NAME);

        // Verify
        expect(UserManagementVerifications.userIsInactive(DefaultUserDetails.NEW_USER_NAME));
    });


    // Conditions
    it('Only the admin user can deactivate a user', function(){

        // Setup - add a new user
        UserManagementActions.adminAddsNewUser();

        // Expect all to fail
        const expectation = {success: false, message: UserManagementValidationErrors.USER_MANAGEMENT_INVALID_USER_DEACTIVATE};

        // Designer
        UserManagementActions.designerDeactivatesUser(DefaultUserDetails.NEW_USER_NAME, expectation);
        expect(UserManagementVerifications.userIsActive(DefaultUserDetails.NEW_USER_NAME));

        // Developer
        UserManagementActions.developerDeactivatesUser(DefaultUserDetails.NEW_USER_NAME, expectation);
        expect(UserManagementVerifications.userIsActive(DefaultUserDetails.NEW_USER_NAME));

        // Manager
        UserManagementActions.managerDeactivatesUser(DefaultUserDetails.NEW_USER_NAME, expectation);
        expect(UserManagementVerifications.userIsActive(DefaultUserDetails.NEW_USER_NAME));
    });


});
