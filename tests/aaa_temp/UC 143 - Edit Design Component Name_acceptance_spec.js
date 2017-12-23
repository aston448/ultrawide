
import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import DesignComponentActions           from '../../test_framework/test_wrappers/design_component_actions.js';
import DesignComponentVerifications     from '../../test_framework/test_wrappers/design_component_verifications.js';

import BrowserActions                   from '../../test_framework/browser_actions/browser_actions.js';
import BrowserChecks                    from '../../test_framework/browser_actions/browser_checks.js';

import { ComponentType }                from '../../imports/constants/constants.js'

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
        BrowserActions.selectNamedItem('Design1');
        BrowserActions.selectNamedItem('DesignVersion1');

        BrowserActions.editItem();
    });

    it('A Design Component name can be edited and saved', function(){

        // Setup
        // Make sure Application1 and Section1 is open
        BrowserActions.openComponent('Application1');
        BrowserActions.openComponent('Application1 Section1');

        BrowserChecks.componentIsVisible('Edit Feature1');
        BrowserChecks.editorIsPassive('Feature1');

        // Execute
        BrowserActions.editComponent('Feature1');

        BrowserChecks.componentIsVisible('Save Feature1');
        BrowserChecks.componentIsVisible('Undo Feature1');
        BrowserChecks.editorIsActive('Feature1');

        // Unfortunately no way of automating input to DraftJs Editor?
        DesignComponentActions.designerUpdatesSelectedComponentNameTo('My Feature');

        BrowserActions.saveComponent('My Feature');
        BrowserChecks.componentIsVisible('Edit My Feature');

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'My Feature', 'Design1', 'DesignVersion1'));

    });

    it('A Design Component name can be edited but then the changes discarded', function(){

        // Setup
        // Make sure Application1 and Section1 is open
        BrowserActions.openComponent('Application1');
        BrowserActions.openComponent('Application1 Section1');

        BrowserChecks.componentIsVisible('Edit Feature1');
        BrowserChecks.editorIsPassive('Feature1');

        // Execute
        BrowserActions.editComponent('Feature1');

        BrowserChecks.componentIsVisible('Save Feature1');
        BrowserChecks.componentIsVisible('Undo Feature1');
        BrowserChecks.editorIsActive('Feature1');

        // Unfortunately no way of automating input to DraftJs Editor?
        // So this is only really testing that the buttons are there and clickable

        BrowserActions.undoComponent('Feature1');
        BrowserChecks.componentIsVisible('Edit Feature1');

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1'));

    });


});
