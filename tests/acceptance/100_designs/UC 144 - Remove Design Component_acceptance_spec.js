
import { TestFixtures }                     from '../../../test_framework/test_wrappers/test_fixtures.js';
import { BrowserActions }                   from '../../../test_framework/browser_actions/browser_actions.js';
import { BrowserChecks }                    from '../../../test_framework/browser_actions/browser_checks.js';

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
        BrowserActions.selectNamedItem('Design1');
        BrowserActions.selectNamedItem('DesignVersion1');

        BrowserActions.editItem();

    });

    it('A Scenario with no Scenario Steps may be removed from a Design Version', function(){

        // Setup
        // Make sure Actions open
        BrowserActions.openComponent('Application1');
        BrowserActions.openComponent('Application1 Section1');
        BrowserActions.openComponent('Feature1');
        BrowserActions.openComponent('Feature1 Actions');

        // Execute
        BrowserActions.removeComponent('Scenario1');

        // Verify
        assert.isFalse(BrowserChecks.componentExists('Scenario1'))
        //expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 0));
    });

    it('A Feature Aspect with no Scenarios may be removed from a Design Version', function(){

        // Setup
        BrowserActions.openComponent('Application1');
        BrowserActions.openComponent('Application1 Section1');
        BrowserActions.openComponent('Feature1');
        BrowserActions.openComponent('Feature1 Actions');
        // Remove all Scenarios in Actions
        BrowserActions.removeComponent('Scenario1');
        BrowserActions.removeComponent('Scenario7');
        BrowserActions.removeComponent('ExtraScenario');

         // Execute
        BrowserActions.removeComponent('Feature1 Actions');

        // Verify
        assert.isFalse(BrowserChecks.componentExists('Feature1 Actions'))
        //expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 2));
    });

    it('A Feature with no Feature Aspects or Scenarios may be removed from a Design Version', function(){

        // Setup
        BrowserActions.openComponent('Application1');
        BrowserActions.openComponent('Application1 Section2');
        BrowserActions.openComponent('Feature2');
        BrowserActions.openComponent('Feature2 Actions');
        BrowserActions.removeComponent('Scenario3');

        BrowserActions.openComponent('Feature2 Conditions');
        BrowserActions.removeComponent('Scenario4');

        BrowserActions.removeComponent('Feature2 Interface');
        BrowserActions.removeComponent('Feature2 Actions');
        BrowserActions.removeComponent('Feature2 Conditions');
        BrowserActions.removeComponent('Feature2 Consequences');

        // Execute
        BrowserActions.removeComponent('Feature2');

        // Verify
        assert.isFalse(BrowserChecks.componentExists('Feature2'));
    });

    it('A Design Section with no Features or sub sections may be removed from a Design Version', function(){

        // Setup
        BrowserActions.openComponent('Application1');
        BrowserActions.openComponent('Application1 Section1');

        // Execute
        BrowserActions.removeComponent('Section1 SubSection1');

        // Verify
        assert.isFalse(BrowserChecks.componentExists('Section1 SubSection1'));
    });

    it('An Application with no Design sections may be removed from a Design Version', function(){


        // Execute
        BrowserActions.removeComponent('Application88');

        // Verify
        assert.isFalse(BrowserChecks.componentExists('Application88'));
    });
});
