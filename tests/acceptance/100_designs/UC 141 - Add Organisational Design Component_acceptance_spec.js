import { TestFixtures }                     from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignComponentVerifications }     from '../../../test_framework/test_wrappers/design_component_verifications.js';

import { BrowserActions }                   from '../../../test_framework/browser_actions/browser_actions.js';
import { BrowserChecks }                    from '../../../test_framework/browser_actions/browser_checks.js';

import { ComponentType }                from '../../../imports/constants/constants.js'
import { DefaultComponentNames }        from '../../../imports/constants/default_names.js';
import {MenuAction} from "../../../imports/constants/constants";

describe('UC 141 - Add Organisational Design Component', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 141 - Add Organisational Design Component');

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

    // Actions
    it('An Application may be added to a Design Version', function() {

        // Execute
        // Add an Application
        BrowserActions.addApplication();

        // Verify
        //BrowserChecks.componentIsVisible(DefaultComponentNames.NEW_APPLICATION_NAME);
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Design1', 'DesignVersion1', 'NONE'));
    });


    it('A Design Section may be added to an Application', function(){

        // Setup
        // Make sure Application1 is open
        BrowserActions.openComponent('Application1');

        // Execute
        // Add a Design Section
        BrowserActions.addDesignSectionTo('Application1');


        // Verify - New Design Section in Application1
        //BrowserChecks.componentIsVisible('Application1 ' + DefaultComponentNames.NEW_DESIGN_SECTION_NAME);
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Design1', 'DesignVersion1', 'Application1'));
    });


    it('A Design Section may be added to another Design Section as a subsection', function(){

        // Setup
        // Make sure Application1 and Section1 is open
        BrowserActions.openComponent('Application1');
        BrowserActions.openComponent('Application1 Section1');

        // Execute - add new section to 'Section1'
        BrowserActions.addDesignSectionTo('Application1 Section1');

        // Verify - new component added with parent Section1
        BrowserChecks.componentIsVisible('Section1 ' + DefaultComponentNames.NEW_DESIGN_SECTION_NAME);
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Design1', 'DesignVersion1', 'Section1'));
    });

    it('A Feature Aspect may be added to a Feature', function(){

        // Setup
        // Make sure Feature1 is open
        BrowserActions.openComponent('Application1');
        BrowserActions.openComponent('Application1 Section1');
        BrowserActions.openComponent('Feature1');

        // Execute - add new aspect to Feature1'
        BrowserActions.addFeatureAspectTo('Feature1');

        // Verify - new component added
        BrowserChecks.componentIsVisible('Feature1 ' + DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Design1', 'DesignVersion1', 'Feature1'));
    });

});
