import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';

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
        browser.url('http://localhost:3030/');

        browser.waitForExist('#loginUserName');

        browser.setValue('#loginUserName', 'gloria');
        browser.setValue('#loginPassword', 'gloria123');

        browser.click('#loginSubmit');

        // Verify
        browser.waitUntil(function () {
            return browser.getText('#headerView') === 'ROLE SELECTION'
        }, 5000, 'expected roles screen after 5s');

        // Logout
        browser.click('#Logout');

        // Verify
        browser.waitUntil(function () {
            return browser.getText('#headerView') === 'LOGIN'
        }, 5000, 'expected login after 5s');

    });


    // Conditions
    it('A logged out user cannot return to an Ultrawide screen by using the browser navigation tools');

    it('A logged out user cannot return to an Ultrawide screen by entering a URL');


    // Consequences
    it('When a user logs out the login screen is shown');

});
