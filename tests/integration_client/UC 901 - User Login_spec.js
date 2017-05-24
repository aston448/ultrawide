import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import LoginActions                     from '../../test_framework/test_wrappers/login_actions.js';
import LoginVerifications               from '../../test_framework/test_wrappers/login_verifications.js';

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
        browser.url('http://localhost:3030/');

        browser.waitForExist('#loginUserName');

        browser.setValue('#loginUserName', 'gloria');
        browser.setValue('#loginPassword', 'gloria123');

        browser.click('#loginSubmit');

        // Verify
        browser.waitUntil(function () {
            return browser.getText('#headerView') === 'ROLE SELECTION'
        }, 5000, 'expected login after 5s');

    });


    // Conditions
    it('An error is shown if an unknown username is entered', function(){

        // Execute
        browser.url('http://localhost:3030/');

        browser.waitForExist('#loginUserName');

        browser.setValue('#loginUserName', 'hen');
        browser.setValue('#loginPassword', 'hen123');

        browser.click('#loginSubmit');

        // Verify
        browser.waitUntil(function () {
            return browser.getText('#headerMessage') === 'Invalid login credentials'
        }, 5000, 'expected rejection after 5s');
    });

    it('An error is shown if a password that is not correct for the username is entered', function(){

        // Execute
        browser.url('http://localhost:3030/');

        browser.waitForExist('#loginUserName');

        browser.setValue('#loginUserName', 'gloria');
        browser.setValue('#loginPassword', 'bollox');

        browser.click('#loginSubmit');

        // Verify
        browser.waitUntil(function () {
            return browser.getText('#headerMessage') === 'Invalid login credentials'
        }, 5000, 'expected rejection after 5s');
    });


    // Consequences
    it('When successfully logged in the role selection screen is shown');

});
