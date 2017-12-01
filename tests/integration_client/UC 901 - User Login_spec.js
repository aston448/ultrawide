import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import TextLookups                      from '../../imports/common/lookups.js'

import { ViewType }           from '../../imports/constants/constants.js';
import { LoginMessages }      from '../../imports/constants/message_texts.js';

describe('UC 901 - User Login', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 901 - User Login');

        TestFixtures.clearAllData();
    });

    after(function(){

    });

    beforeEach(function(){

    });

    afterEach(function(){

    });


    // Actions
    it('A user may log in with the correct username and password', function(){

        // Execute
        browser.url('http://localhost:3000/');

        browser.waitForVisible('#loginUserName');

        browser.setValue('#loginUserName', 'gloria');
        browser.setValue('#loginPassword', 'gloria123');

        browser.click('#loginSubmit');

        // Verify
        browser.waitUntil(function () {
            return browser.getText('#headerView') === TextLookups.viewText(ViewType.SELECT)
        }, 5000, 'expected login after 5s');

    });


    // Conditions
    it('An error is shown if an unknown username is entered', function(){

        // Execute
        browser.url('http://localhost:3000/');

        browser.waitForVisible('#loginUserName');

        browser.setValue('#loginUserName', 'hen');
        browser.setValue('#loginPassword', 'hen123');

        browser.click('#loginSubmit');

        // Verify
        browser.waitUntil(function () {
            return browser.getText('#headerMessage') === LoginMessages.MSG_LOGIN_FAIL
        }, 5000, 'expected rejection after 5s');
    });

    it('An error is shown if a password that is not correct for the username is entered', function(){

        // Execute
        browser.url('http://localhost:3000/');

        browser.waitForVisible('#loginUserName');

        browser.setValue('#loginUserName', 'gloria');
        browser.setValue('#loginPassword', 'bollox');

        browser.click('#loginSubmit');

        // Verify
        browser.waitUntil(function () {
            return browser.getText('#headerMessage') === LoginMessages.MSG_LOGIN_FAIL
        }, 5000, 'expected rejection after 5s');
    });


    // Consequences
    it('When successfully logged in the role selection screen is shown', function(){

        // Execute
        browser.url('http://localhost:3000/');

        browser.waitForVisible('#loginUserName');

        browser.setValue('#loginUserName', 'miles');
        browser.setValue('#loginPassword', 'miles123');

        browser.click('#loginSubmit');

        // Verify
        browser.waitUntil(function () {
            return browser.getText('#headerView') === TextLookups.viewText(ViewType.SELECT)
        }, 5000, 'expected login after 5s');
    });

});
