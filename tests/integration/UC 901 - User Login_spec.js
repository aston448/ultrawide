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


    // Interface
    it('A username may be entered');

    it('A password may be entered');

    it('There is an option to log in');


    // Actions
    it('A user may log in with the correct username and password', function(){

        // Execute
        browser.url('http://localhost:3030/');

        browser.waitForExist('#loginUserName');

        browser.setValue('#loginUserName', 'gloria');
        browser.setValue('#loginPassword', 'gloria123');

        browser.click('#loginSubmit');

        // Verify
        LoginVerifications.user_IsLoggedIn('gloria');

    });


    // Conditions
    it('An error is shown if an unknown username is entered');

    it('An error is shown if a password that is not correct for the username is entered');


    // Consequences
    it('When successfully logged in the role selection screen is shown');

});
