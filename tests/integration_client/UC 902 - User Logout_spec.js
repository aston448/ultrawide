import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import TextLookups                      from '../../imports/common/lookups.js'

import { ViewType, RoleType, UltrawideAction } from '../../imports/constants/constants.js';

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


    // Actions
    it('A user may log out of Ultrawide', function(){

        // Setup - Login
        browser.url('http://localhost:3000/');

        browser.waitForVisible('#loginUserName');

        browser.setValue('#loginUserName', 'gloria');
        browser.setValue('#loginPassword', 'gloria123');

        browser.click('#loginSubmit');

        // Verify
        browser.waitForExist('#main_tabs');

        // Logout
        browser.click('#Logout');

        // Verify
        browser.waitUntil(function () {
            return browser.getText('#headerView') === TextLookups.viewText(ViewType.AUTHORISE)
        }, 5000, 'expected login after 5s');

    });


    // Consequences
    it('When a user logs out the login screen is shown', function(){

        // Setup - Login
        browser.url('http://localhost:3000/');

        browser.waitForVisible('#loginUserName');

        browser.setValue('#loginUserName', 'gloria');
        browser.setValue('#loginPassword', 'gloria123');

        browser.click('#loginSubmit');

        browser.waitForExist('#main_tabs');


        // Click Logout
        browser.click('#Logout');

        // Verify
        browser.waitUntil(function () {
            return browser.getText('#headerView') === TextLookups.viewText(ViewType.AUTHORISE)
        }, 5000, 'expected login after 5s');

    });

});
