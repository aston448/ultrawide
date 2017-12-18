import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import TextLookups                      from '../../imports/common/lookups.js'

import BrowserActions                   from '../../test_framework/browser_actions/browser_actions.js';
import BrowserChecks                    from '../../test_framework/browser_actions/browser_checks.js';

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


    describe('Actions', function(){

        it('A user may log in with the correct username and password', function(){

            // Execute
            BrowserActions.loginAs('gloria', 'gloria123');

            // Verify
            BrowserChecks.isLoggedIn();

        });
    });


    describe('Conditions', function(){

        it('An error is shown if an unknown username is entered', function(){

            // Execute
            BrowserActions.loginAs('hen', 'hen123');

            // Verify
            BrowserChecks.hasUserMessage(LoginMessages.MSG_LOGIN_FAIL);
        });

        it('An error is shown if a password that is not correct for the username is entered', function(){

            // Execute
            BrowserActions.loginAs('gloria', 'hen123');

            // Verify
            BrowserChecks.hasUserMessage(LoginMessages.MSG_LOGIN_FAIL);
        });
    });





    describe('Consequences', function(){

        it('When successfully logged in the home screen is shown', function(){

            // Execute
            BrowserActions.loginAs('miles', 'miles123');

            // Verify
            BrowserChecks.isLoggedIn();
        });
    });


});
