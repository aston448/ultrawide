
import TestFixtures                     from '../../../test_framework/test_wrappers/test_fixtures.js';
import DesignVerifications              from '../../../test_framework/test_wrappers/design_verifications.js';

import BrowserActions                   from '../../../test_framework/browser_actions/browser_actions.js';
import BrowserChecks                    from '../../../test_framework/browser_actions/browser_checks.js';

import {MenuAction}                     from "../../../imports/constants/constants";
import {DefaultItemNames}               from "../../../imports/constants/default_names";


describe('UC 122 - Set Design Version as Editable', function() {

    before(function(){
        TestFixtures.logTestSuite('UC 122 - Set Design Version as Editable');
    });

    after(function(){
        BrowserActions.selectMenuItem(MenuAction.MENU_ACTION_LOGOUT);
    });

    beforeEach(function(){
        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        BrowserActions.loginAsDesigner();
        BrowserActions.selectDesignsTab();

    });


    // Actions
    it('A Design Version in View Only mode may be switched back to edit mode', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        BrowserActions.selectNamedItem('Design1');
        BrowserActions.selectNamedItem('DesignVersion1');
        BrowserActions.editItem();

        // Verify Not View Only
        BrowserChecks.componentIsVisible('Edit Application1');

        // Set in View Mode
        BrowserActions.selectNamedItem('Option View Mode');
        assert.isFalse(BrowserChecks.componentExists('Edit Application1'));

        // Execute -----------------------------------------------------------------------------------------------------
        BrowserActions.selectNamedItem('Option Edit Mode');

        // Verify ------------------------------------------------------------------------------------------------------
        assert.isTrue(BrowserChecks.componentExists('Edit Application1'));
        BrowserChecks.componentIsVisible('Edit Application1');
    });
});


