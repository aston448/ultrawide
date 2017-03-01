import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import UserManagementActions            from '../../test_framework/test_wrappers/user_management_actions.js';
import UserManagementVerifications      from '../../test_framework/test_wrappers/user_management_verifications.js';

import { UserManagementValidationErrors } from '../../imports/constants/validation_errors.js'
import { DefaultUserDetails }           from '../../imports/constants/default_names.js'

describe('UC 801 - Create New User', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 801 - Create New User');
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
    it('The admin user can add a new Ultrawide user',function(){

        // Execute
        UserManagementActions.adminAddsNewUser();

        // Verify - good if no failure - test below verifies default details
    });


    // Conditions
    it('Only the admin user can create new users', function(){

        // Expectation is failure
        const expectation = {success: false, message: UserManagementValidationErrors.USER_MANAGEMENT_INVALID_USER_ADD};

        // Try Designer
        UserManagementActions.designerAddsNewUser(expectation);

        // Try Developer
        UserManagementActions.developerAddsNewUser(expectation);

        // Try Manager
        UserManagementActions.managerAddsNewUser(expectation);
    });


    // Consequences
    it('When a new user is added that user has a default login and password and no access to Ultrawide roles', function(){

        // Execute
        UserManagementActions.adminAddsNewUser();

        // Verify
        const expectedUser = {
            userName:       DefaultUserDetails.NEW_USER_NAME,
            password:       DefaultUserDetails.NEW_USER_PASSWORD,
            displayName:    DefaultUserDetails.NEW_USER_DISPLAY_NAME,
            isDesigner:     false,
            isDeveloper:    false,
            isManager:      false,
            isAdmin:        false,
            isActive:       true
        };

        expect(UserManagementVerifications.userDetailsAre(expectedUser));
    });

});
