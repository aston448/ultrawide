import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import TextLookups                      from '../../imports/common/lookups.js'

import { ViewType, RoleType, UltrawideAction }           from '../../imports/constants/constants.js';
import { LoginMessages }      from '../../imports/constants/message_texts.js';

describe('UC 805 User Password Change', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 805 User Password Change');
    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();

        // Login as old password user
        browser.url('http://localhost:3030/');

        browser.waitForExist('#loginUserName');

        browser.setValue('#loginUserName', 'gloria');
        browser.setValue('#loginPassword', 'gloria123');

        browser.click('#loginSubmit');

        // Verify
        browser.waitUntil(function () {
            return browser.getText('#headerView') === TextLookups.viewText(ViewType.ROLES)
        }, 5000, 'expected login after 5s');

        // Go to Config Screen
        const actionId = '#' + RoleType.DESIGNER + '_' + UltrawideAction.ACTION_CONFIGURE;
        browser.waitForExist(actionId);
        browser.click(actionId);

        browser.waitUntil(function () {
            return browser.getText('#headerView') === (RoleType.DESIGNER + ' - ' + TextLookups.viewText(ViewType.CONFIGURE))
        }, 5000, 'expected config screen after 5s');

        // Select My Settings tab
        browser.waitForExist('#config-view_tabs-tab-3');
        browser.click('#config-view_tabs-tab-3');

    });

    afterEach(function(){

        browser.click('#Logout');
    });


    // Actions
    it('An Ultrawide user may update their password', function(){

        // Set new values
        browser.waitForVisible('#configOldPassword');
        browser.setValue('#configOldPassword', 'gloria123');
        browser.waitForVisible('#configNewPassword1');
        browser.setValue('#configNewPassword1', 'gloria456');
        browser.waitForVisible('#configNewPassword2');
        browser.setValue('#configNewPassword2', 'gloria456');

        // Execute
        browser.waitForVisible('#configChangePassword');
        browser.click('#configChangePassword');

        // Verify - should now be logged out
        browser.waitUntil(function () {
            return browser.getText('#headerView') === TextLookups.viewText(ViewType.AUTHORISE)
        }, 5000, 'expected login after 5s');

        // Verify - can log in with new password
        browser.setValue('#loginUserName', 'gloria');
        browser.setValue('#loginPassword', 'gloria456');

        browser.click('#loginSubmit');

        // Verify
        browser.waitUntil(function () {
            return browser.getText('#headerView') === TextLookups.viewText(ViewType.ROLES)
        }, 5000, 'expected login after 5s');
    });


    // Conditions
    it('The new password cannot be the same as the old password');

    it('The old password must be correct for the currently logged on user');

    it('The new password and password confirmation must match');


    // Consequences
    it('When a user password is successfully changed the user is logged out and must log in with the new password');

});
