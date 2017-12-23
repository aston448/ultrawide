import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import DesignComponentVerifications     from '../../test_framework/test_wrappers/design_component_verifications.js';

import BrowserActions                   from '../../test_framework/browser_actions/browser_actions.js';
import BrowserChecks                    from '../../test_framework/browser_actions/browser_checks.js';

import {ComponentType,} from '../../imports/constants/constants.js'
import {DefaultComponentNames}    from '../../imports/constants/default_names.js';

describe('UC 142 - Add Functional Design Component', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 142 - Add Functional Design Component');
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


    it('A Feature may be added to a Design Section', function(){

        // Setup
        // Make sure Application1 and Section1 is open
        BrowserActions.openComponent('Application1');
        BrowserActions.openComponent('Application1 Section1');

        // Execute
        // Add a Feature
        BrowserActions.addFeatureTo('Application1 Section1');

        // Verify
        BrowserChecks.componentIsVisible(DefaultComponentNames.NEW_FEATURE_NAME);
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Design1', 'DesignVersion1', 'Section1'));
    });


    it('A Scenario may be added to a Feature Aspect', function(){

        // Setup
        // Make sure Actions is open
        BrowserActions.openComponent('Application1');
        BrowserActions.openComponent('Application1 Section1');
        BrowserActions.openComponent('Feature1');
        BrowserActions.openComponent('Feature1 Actions');

        // Execute
        // Add a Scenario
        BrowserActions.addScenarioTo('Feature1 Actions');

        // Verify
        BrowserChecks.componentIsVisible(DefaultComponentNames.NEW_SCENARIO_NAME);
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Design1', 'DesignVersion1', 'Actions'));
    });

});
