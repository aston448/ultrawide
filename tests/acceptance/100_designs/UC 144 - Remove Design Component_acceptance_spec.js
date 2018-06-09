
import { TestFixtures }                     from '../../../test_framework/test_wrappers/test_fixtures.js';
import { BrowserActions }                   from '../../../test_framework/browser_actions/browser_actions.js';
import { BrowserChecks }                    from '../../../test_framework/browser_actions/browser_checks.js';

import { UI }                               from "../../../imports/constants/ui_context_ids";

describe('UC 144 - Remove Design Component', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 144 - Remove Design Component');
    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        BrowserActions.loginAs('gloria', 'gloria123');

        BrowserActions.selectDesignsTab();
        BrowserActions.selectNamedItem(UI.ITEM_DESIGN, 'Design1');
        BrowserActions.selectNamedItem(UI.ITEM_DESIGN_VERSION, 'DesignVersion1');

        BrowserActions.buttonClick(UI.BUTTON_EDIT, 'DesignVersion1');

    });

    it('A Scenario with no Scenario Steps may be removed from a Design Version', function(){

        // Setup
        // Make sure Actions open
        BrowserActions.openComponent('Application1');
        BrowserActions.openComponent('Application1 Section1');
        BrowserActions.openComponent('Feature1');
        BrowserActions.openComponent('Feature1 Actions');

        // Execute
        BrowserActions.optionClick(UI.OPTION_REMOVE, 'Scenario1');

        // Verify
        assert.isFalse(BrowserChecks.componentExists(UI.DESIGN_COMPONENT, 'Scenario1'))
        //expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 0));
    });

    it('A Feature Aspect with no Scenarios may be removed from a Design Version', function(){

        // Setup
        BrowserActions.openComponent('Application1');
        BrowserActions.openComponent('Application1 Section1');
        BrowserActions.openComponent('Feature1');
        BrowserActions.openComponent('Feature1 Actions');
        // Remove all Scenarios in Actions
        BrowserActions.optionClick(UI.OPTION_REMOVE, 'Scenario1');
        BrowserActions.optionClick(UI.OPTION_REMOVE, 'Scenario7');
        BrowserActions.optionClick(UI.OPTION_REMOVE, 'ExtraScenario');

         // Execute
        BrowserActions.optionClickWithParent(UI.OPTION_REMOVE, 'Feature1', 'Actions');

        // Verify
        assert.isFalse(BrowserChecks.componentWithParentExists(UI.DESIGN_COMPONENT, 'Feature1', 'Actions'))
        //expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 2));
    });

    it('A Feature with no Feature Aspects or Scenarios may be removed from a Design Version', function(){

        // Setup
        BrowserActions.openComponent('Application1');
        BrowserActions.openComponent('Application1 Section2');
        BrowserActions.openComponent('Feature2');
        BrowserActions.openComponent('Feature2 Actions');
        BrowserActions.optionClick(UI.OPTION_REMOVE, 'Scenario3');

        BrowserActions.openComponent('Feature2 Conditions');
        BrowserActions.optionClick(UI.OPTION_REMOVE, 'Scenario4');

        BrowserActions.optionClickWithParent(UI.OPTION_REMOVE, 'Feature2', 'Interface');
        BrowserActions.optionClickWithParent(UI.OPTION_REMOVE, 'Feature2', 'Actions');
        BrowserActions.optionClickWithParent(UI.OPTION_REMOVE, 'Feature2', 'Conditions');
        BrowserActions.optionClickWithParent(UI.OPTION_REMOVE, 'Feature2', 'Consequences');

        // Execute
        BrowserActions.optionClick(UI.OPTION_REMOVE, 'Feature2');

        // Verify
        assert.isFalse(BrowserChecks.componentExists(UI.DESIGN_COMPONENT, 'Feature2'));
    });

    it('A Design Section with no Features or sub sections may be removed from a Design Version', function(){

        // Setup
        BrowserActions.openComponent('Application1');
        BrowserActions.openComponent('Application1 Section1');

        // Execute
        BrowserActions.optionClickWithParent(UI.OPTION_REMOVE, 'Section1', 'SubSection1');

        // Verify
        assert.isFalse(BrowserChecks.componentWithParentExists(UI.DESIGN_COMPONENT, 'Section1', 'SubSection1'));
    });

    it('An Application with no Design sections may be removed from a Design Version', function(){


        // Execute
        BrowserActions.optionClick(UI.OPTION_REMOVE,'Application88');

        // Verify
        assert.isFalse(BrowserChecks.componentExists(UI.DESIGN_COMPONENT, 'Application88'));
    });
});
