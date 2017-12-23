
import TestFixtures from '../../../test_framework/test_wrappers/test_fixtures.js';
import DesignVerifications from '../../../test_framework/test_wrappers/design_verifications.js';

import BrowserActions                   from '../../../test_framework/browser_actions/browser_actions.js';
import BrowserChecks                    from '../../../test_framework/browser_actions/browser_checks.js';
import {MenuAction}                     from "../../../imports/constants/constants";
import {DefaultItemNames}               from "../../../imports/constants/default_names";


describe('UC 101 - Add New Design', function() {

    before(function(){
        TestFixtures.logTestSuite('UC 101 - Add New Design');
    });

    after(function(){
        BrowserActions.selectMenuItem(MenuAction.MENU_ACTION_LOGOUT);
    });

    beforeEach(function(){
        TestFixtures.clearAllData();

        BrowserActions.loginAsDesigner();
    });


    // Actions
    it('A Designer can add a new Design to Ultrawide', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        BrowserActions.selectDesignsTab();

        // Execute -----------------------------------------------------------------------------------------------------
        BrowserActions.addNewDesign();

        // Verify ------------------------------------------------------------------------------------------------------
        // Created a new Design
        BrowserChecks.componentIsVisible(DefaultItemNames.NEW_DESIGN_NAME);

        expect(DesignVerifications.defaultNewDesignExists());

    });


});


