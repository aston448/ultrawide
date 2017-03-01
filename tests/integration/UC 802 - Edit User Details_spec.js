import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import UserManagementActions            from '../../test_framework/test_wrappers/user_management_actions.js';
import UserManagementVerifications      from '../../test_framework/test_wrappers/user_management_verifications.js';

import { UserManagementValidationErrors } from '../../imports/constants/validation_errors.js'
import { DefaultUserDetails }           from '../../imports/constants/default_names.js'

describe('UC 802 - Edit User Details', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 802 - Edit User Details');
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
    it('The admin user can edit an Ultrawide user and save details', function(){

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

        // Execute - make some updates
        const newUserDetails = {
            userName:       'wilma',
            password:       'wilma123',
            displayName:    'Wilma Cargo',
            isDesigner:     true,
            isDeveloper:    false,
            isManager:      true,
            isAdmin:        false,
            isActive:       true
        };

        UserManagementActions.adminSavesUserDetails(DefaultUserDetails.NEW_USER_NAME, newUserDetails);

        // Verify
        expect(UserManagementVerifications.userDetailsAre(newUserDetails));

    });


    // Conditions
    it('A user may not be saved with the username \'admin\'', function(){

        // Setup - add a new user
        UserManagementActions.adminAddsNewUser();

        // Execute - a non-admin user called admin
        const newUserDetails = {
            userName:       'admin',
            password:       'admin123',
            displayName:    'Admin Istrator',
            isDesigner:     true,
            isDeveloper:    false,
            isManager:      true,
            isAdmin:        false,
            isActive:       true
        };

        const expectation = {success: false, message: UserManagementValidationErrors.USER_MANAGEMENT_INVALID_USER_NAME_ADMIN};
        UserManagementActions.adminSavesUserDetails(DefaultUserDetails.NEW_USER_NAME, newUserDetails, expectation);

        // Verify new user still exists
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

    });

    it('A user may not be saved with a username that is the same as for an existing active user', function(){

        // Setup - add a new user
        UserManagementActions.adminAddsNewUser();

        // Execute - try to rename as 'gloria' - existing designer user
        const newUserDetails = {
            userName:       'gloria',
            password:       'gloria123',
            displayName:    'Gloria Hunniford',
            isDesigner:     true,
            isDeveloper:    false,
            isManager:      false,
            isAdmin:        false,
            isActive:       true
        };

        const expectation = {success: false, message: UserManagementValidationErrors.USER_MANAGEMENT_INVALID_USER_NAME_DUPLICATE};
        UserManagementActions.adminSavesUserDetails(DefaultUserDetails.NEW_USER_NAME, newUserDetails, expectation);

        // Verify new user still exists
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

    });

    it('A user may not be saved with a username that is the same as for an existing inactive user', function(){

        // Setup - add a new user
        UserManagementActions.adminAddsNewUser();

        // Deactivate 'miles'
        UserManagementActions.adminDeactivatesUser('miles');

        // Check
        const milesDetails = {
            userName:       'miles',
            password:       'miles',
            displayName:    'Miles Behind',
            isDesigner:     false,
            isDeveloper:    false,
            isManager:      true,
            isAdmin:        false,
            isActive:       false       // Deactivated
        };
        expect(UserManagementVerifications.userDetailsAre(milesDetails));

        // Execute - try to rename as 'miles' - existing deactivated user
        const newUserDetails = {
            userName:       'miles',
            password:       'miles123',
            displayName:    'Miles Ahead',
            isDesigner:     false,
            isDeveloper:    false,
            isManager:      true,
            isAdmin:        false,
            isActive:       true
        };

        const expectation = {success: false, message: UserManagementValidationErrors.USER_MANAGEMENT_INVALID_USER_NAME_DUPLICATE};
        UserManagementActions.adminSavesUserDetails(DefaultUserDetails.NEW_USER_NAME, newUserDetails, expectation);

        // Verify new user still exists
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

    });

    it('A user may not be saved with a username that contains non-alphanumeric characters', function(){

        // Setup - add a new user
        UserManagementActions.adminAddsNewUser();

        // Expectation of dodgy user name
        const expectation = {success: false, message: UserManagementValidationErrors.USER_MANAGEMENT_INVALID_USER_NAME_ALPHANUM};

        // Execute - try to save space in it
        let newUserDetails = {
            userName:       'user name',
            password:       'password',
            displayName:    'No Name',
            isDesigner:     false,
            isDeveloper:    false,
            isManager:      true,
            isAdmin:        false,
            isActive:       true
        };

        UserManagementActions.adminSavesUserDetails(DefaultUserDetails.NEW_USER_NAME, newUserDetails, expectation);

        // Non alpha characters
        newUserDetails.userName = 'wilma@cargo';
        UserManagementActions.adminSavesUserDetails(DefaultUserDetails.NEW_USER_NAME, newUserDetails, expectation);

        newUserDetails.userName = 'wilma_cargo';
        UserManagementActions.adminSavesUserDetails(DefaultUserDetails.NEW_USER_NAME, newUserDetails, expectation);

    });

    it('A user may not be saved with no username', function(){

        // Setup - add a new user
        UserManagementActions.adminAddsNewUser();


        // Execute - try to save with no user name
        const newUserDetails = {
            userName:       '',
            password:       'password',
            displayName:    'No Name',
            isDesigner:     false,
            isDeveloper:    false,
            isManager:      true,
            isAdmin:        false,
            isActive:       true
        };

        const expectation = {success: false, message: UserManagementValidationErrors.USER_MANAGEMENT_INVALID_USER_NAME_BLANK};
        UserManagementActions.adminSavesUserDetails(DefaultUserDetails.NEW_USER_NAME, newUserDetails, expectation);

        // Verify new user still exists
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
    });

    it('A user may not be saved with no password', function(){

        // Setup - add a new user
        UserManagementActions.adminAddsNewUser();

        // Execute - try to save with no user name
        const newUserDetails = {
            userName:       'wilma',
            password:       '',
            displayName:    'No Password',
            isDesigner:     false,
            isDeveloper:    false,
            isManager:      true,
            isAdmin:        false,
            isActive:       true
        };

        const expectation = {success: false, message: UserManagementValidationErrors.USER_MANAGEMENT_INVALID_PASSWORD_BLANK};
        UserManagementActions.adminSavesUserDetails(DefaultUserDetails.NEW_USER_NAME, newUserDetails, expectation);

        // Verify new user still exists
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
    });

    it('Only the admin user can save changes to users', function(){

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

        // Execute - make some updates
        const newUserDetails = {
            userName:       'wilma',
            password:       'wilma123',
            displayName:    'Wilma Cargo',
            isDesigner:     true,
            isDeveloper:    false,
            isManager:      true,
            isAdmin:        false,
            isActive:       true
        };

        // Expectation that all will fail
        const expectation = {success: false, message: UserManagementValidationErrors.USER_MANAGEMENT_INVALID_USER_SAVE};

        // Designer
        UserManagementActions.designerSavesUserDetails(DefaultUserDetails.NEW_USER_NAME, newUserDetails, expectation);

        // Developer
        UserManagementActions.developerSavesUserDetails(DefaultUserDetails.NEW_USER_NAME, newUserDetails, expectation);

        // Manager
        UserManagementActions.managerSavesUserDetails(DefaultUserDetails.NEW_USER_NAME, newUserDetails, expectation);

        // Verify new user still exists
        expect(UserManagementVerifications.userDetailsAre(defaultUser));

    });

});
