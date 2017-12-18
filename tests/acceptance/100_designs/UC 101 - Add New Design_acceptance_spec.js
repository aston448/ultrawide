
import TestFixtures from '../../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions from '../../../test_framework/test_wrappers/design_actions.js';
import DesignVerifications from '../../../test_framework/test_wrappers/design_verifications.js';
import DesignVersionVerifications from '../../../test_framework/test_wrappers/design_version_verifications.js';

import BrowserActions                   from '../../../test_framework/browser_actions/browser_actions.js';
import BrowserChecks                    from '../../../test_framework/browser_actions/browser_checks.js';

import {RoleType} from '../../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../../imports/constants/default_names.js';
import {DesignValidationErrors} from '../../../imports/constants/validation_errors.js';
import {MenuAction} from "../../../imports/constants/constants";

describe('UC 101 - Add New Design', function() {

    before(function(){
        TestFixtures.logTestSuite('UC 101 - Add New Design');
    });

    after(function(){

    });

    beforeEach(function(){
        TestFixtures.clearAllData();

        BrowserActions.loginAsDesigner();
    });

    afterEach(function(){
        BrowserActions.selectMenuItem(MenuAction.MENU_ACTION_LOGOUT);
    });


    // Actions
    describe('Actions', function(){

        it('A Designer can add a new Design to Ultrawide', function() {

            // Setup -------------------------------------------------------------------------------------------------------
            BrowserActions.selectDesignsTab();

            // Execute -----------------------------------------------------------------------------------------------------
            BrowserActions.addNewDesign();

            // Verify ------------------------------------------------------------------------------------------------------
            // Created a new Design
            expect(DesignVerifications.defaultNewDesignExists());

        });

    });

});


