import { TestFixtures }                     from '../../test_framework/test_wrappers/test_fixtures.js';
import { BrowserActions }                   from '../../test_framework/browser_actions/browser_actions.js';
import { BrowserChecks }                    from '../../test_framework/browser_actions/browser_checks.js';

import { ViewType, MenuAction } from '../../imports/constants/constants.js';

describe('UC 902 - User Logout', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 902 - User Logout');

        TestFixtures.clearAllData();
    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    describe('Actions', function(){

        it('A user may log out of Ultrawide', function(){

            // Setup - Login
            BrowserActions.loginAs('gloria', 'gloria123');

            // Verify
            BrowserChecks.isLoggedIn();

            // Logout
            BrowserActions.selectMenuItem(MenuAction.MENU_ACTION_LOGOUT);

            // Verify on login screen again
            BrowserChecks.isOnScreen(ViewType.AUTHORISE);

        });
    });


    describe('Consequences', function(){

        it('When a user logs out the login screen is shown', function(){

            // Setup - Login
            BrowserActions.loginAs('gloria', 'gloria123');

            // Verify
            BrowserChecks.isLoggedIn();

            // Logout
            BrowserActions.selectMenuItem(MenuAction.MENU_ACTION_LOGOUT);

            // Verify on login screen again
            BrowserChecks.isOnScreen(ViewType.AUTHORISE);
        });
    });


});
