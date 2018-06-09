
import { TestFixtures }                     from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignVerifications }              from '../../../test_framework/test_wrappers/design_verifications.js';

import { BrowserActions }                   from '../../../test_framework/browser_actions/browser_actions.js';
import { BrowserChecks }                    from '../../../test_framework/browser_actions/browser_checks.js';

import {MenuAction}                     from "../../../imports/constants/constants";
import {DefaultItemNames}               from "../../../imports/constants/default_names";

import { UI }           from "../../../imports/constants/ui_context_ids";

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
        BrowserActions.selectNamedItem(UI.ITEM_DESIGN, 'Design1');
        BrowserActions.selectNamedItem(UI.ITEM_DESIGN_VERSION, 'DesignVersion1');
        BrowserActions.buttonClick(UI.BUTTON_EDIT, 'DesignVersion1');

        // Verify Not View Only
        BrowserChecks.componentIsVisible(UI.OPTION_EDIT, 'Application1');

        // Set in View Mode
        BrowserActions.selectNamedItem(UI.OPTION_MENU_ICON, 'View Mode');
        assert.isFalse(BrowserChecks.componentExists(UI.OPTION_EDIT, 'Application1'));

        // Execute -----------------------------------------------------------------------------------------------------
        BrowserActions.selectNamedItem(UI.OPTION_MENU_ICON, 'Edit Mode');

        // Verify ------------------------------------------------------------------------------------------------------
        assert.isTrue(BrowserChecks.componentExists(UI.OPTION_EDIT, 'Application1'));
        BrowserChecks.componentIsVisible(UI.OPTION_EDIT, 'Application1');
    });
});


