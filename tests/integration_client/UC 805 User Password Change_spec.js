import { TestFixtures }                     from '../../test_framework/test_wrappers/test_fixtures.js';

import { BrowserActions }                   from '../../test_framework/browser_actions/browser_actions.js';
import { BrowserChecks }                    from '../../test_framework/browser_actions/browser_checks.js';

import { ViewType, MenuAction }           from '../../imports/constants/constants.js';

describe('UC 805 User Password Change', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 805 User Password Change');
    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();

        // Login as old password user
        BrowserActions.loginAs('gloria', 'gloria123');

        // Verify
        BrowserChecks.isLoggedIn();

        // Go to Config Screen
        BrowserActions.selectMenuItem(MenuAction.MENU_ACTION_GOTO_CONFIG);

        // Verify
        BrowserChecks.isOnScreen(ViewType.CONFIGURE);

        // Select My Settings tab
        BrowserActions.selectMySettingsTab()

    });

    afterEach(function(){

        // Logout
        BrowserActions.selectMenuItem(MenuAction.MENU_ACTION_LOGOUT);
    });


    describe('Actions', function(){

        it('An Ultrawide user may update their password', function(){

            // Set new password
            BrowserActions.updatePassword('gloria123', 'gloria456');

            // Verify - should now be logged out
            BrowserChecks.isOnScreen(ViewType.AUTHORISE);

            // Verify - can log in with new password
            BrowserActions.loginAs('gloria', 'gloria456');

            // Verify
            BrowserChecks.isLoggedIn();
        });
    });



    describe('Conditions', function(){

        it('The new password cannot be the same as the old password');

        it('The old password must be correct for the currently logged on user');

        it('The new password and password confirmation must match');
    });



    describe('Consequences', function(){

        it('When a user password is successfully changed the user is logged out and must log in with the new password');
    });

});
