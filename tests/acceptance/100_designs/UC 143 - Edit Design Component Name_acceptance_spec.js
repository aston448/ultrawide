
import { TestFixtures }                     from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignComponentActions }           from '../../../test_framework/test_wrappers/design_component_actions.js';
import { DesignComponentVerifications }     from '../../../test_framework/test_wrappers/design_component_verifications.js';

import { BrowserActions }                   from '../../../test_framework/browser_actions/browser_actions.js';
import { BrowserChecks }                    from '../../../test_framework/browser_actions/browser_checks.js';

import { ComponentType }                from '../../../imports/constants/constants.js'
import { UI }                           from "../../../imports/constants/ui_context_ids";

describe('UC 143 - Edit Design Component Name', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 143 - Edit Design Component Name');
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

    it('A Design Component name can be edited and saved', function(){

        // Setup
        // Make sure Application1 and Section1 is open
        BrowserActions.openComponent('Application1');
        BrowserActions.openComponent('Application1 Section1');

        BrowserChecks.componentIsVisible(UI.OPTION_EDIT, 'Feature1');
        BrowserChecks.editorIsPassive('Feature1');

        // Execute
        BrowserActions.optionClick(UI.OPTION_EDIT, 'Feature1');

        BrowserChecks.componentIsVisible(UI.OPTION_SAVE, 'Feature1');
        BrowserChecks.componentIsVisible(UI.OPTION_UNDO, 'Feature1');
        BrowserChecks.editorIsActive('Feature1');

        // Unfortunately no way of automating input to DraftJs Editor?
        //BrowserActions.addTextToEditor('Feature1', 'My Feature');
        DesignComponentActions.designerUpdatesSelectedComponentNameTo('My Feature');

        BrowserActions.optionClick(UI.OPTION_SAVE, 'Feature1');
        BrowserChecks.componentIsVisible(UI.OPTION_EDIT, 'My Feature');

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'My Feature', 'Design1', 'DesignVersion1'));

    });

    it('A Design Component name can be edited but then the changes discarded', function(){

        // Setup
        // Make sure Application1 and Section1 is open
        BrowserActions.openComponent('Application1');
        BrowserActions.openComponent('Application1 Section1');

        BrowserChecks.componentIsVisible(UI.OPTION_EDIT, 'Feature1');
        BrowserChecks.editorIsPassive('Feature1');

        // Execute
        BrowserActions.optionClick(UI.OPTION_EDIT, 'Feature1');

        BrowserChecks.componentIsVisible(UI.OPTION_SAVE, 'Feature1');
        BrowserChecks.componentIsVisible(UI.OPTION_UNDO, 'Feature1');
        BrowserChecks.editorIsActive('Feature1');

        // Unfortunately no way of automating input to DraftJs Editor?
        // So this is only really testing that the buttons are there and clickable
        //BrowserActions.addTextToEditor('Feature1', 'NewFeatureName');

        BrowserActions.optionClick(UI.OPTION_UNDO, 'Feature1');
        BrowserChecks.componentIsVisible(UI.OPTION_EDIT, 'Feature1');

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1'));

    });


});
