
import TestFixtures                 from '../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                from '../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions         from '../../test_framework/test_wrappers/design_version_actions.js';
import DesignUpdateActions          from '../../test_framework/test_wrappers/design_update_actions.js';
import DesignComponentActions       from '../../test_framework/test_wrappers/design_component_actions.js';
import UpdateComponentActions       from '../../test_framework/test_wrappers/design_update_component_actions.js';
import DesignVerifications          from '../../test_framework/test_wrappers/design_verifications.js';
import DesignUpdateVerifications    from '../../test_framework/test_wrappers/design_update_verifications.js';
import DesignVersionVerifications   from '../../test_framework/test_wrappers/design_version_verifications.js';
import DesignComponentVerifications from '../../test_framework/test_wrappers/design_component_verifications.js';
import UserContextVerifications     from '../../test_framework/test_wrappers/user_context_verifications.js';

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 146 - ReOrder Design Component List', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();
    });

    afterEach(function(){

    });


    // Actions
    it('An Application may be moved to above another Application in a Design Version', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        // Add another application
        DesignComponentActions.designerAddsApplicationCalled('Application2');

        // Check ordering is as created: Application1, Application99, Application2
        DesignComponentActions.designerSelectsApplication('Application1');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application99'));
        DesignComponentActions.designerSelectsApplication('Application99');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application2'));

        // Execute - move Application2 to above Application1
        DesignComponentActions.designerSelectsApplication('Application2');
        DesignComponentActions.designerReordersSelectedComponentToAbove_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');

        // Verify - order should now be 2, 1, 99
        DesignComponentActions.designerSelectsApplication('Application2');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1'));
        DesignComponentActions.designerSelectsApplication('Application1');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application99'));
    });

    it('A Design Section may be moved to above another Design Section in an Application', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        // Add another section
        DesignComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section3');

        // Check ordering is as created - should be Section1, Section2, Section3
        DesignComponentActions.designerSelectsDesignSection('Application1', 'Section1');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        DesignComponentActions.designerSelectsDesignSection('Application1', 'Section2');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section3'));

        // Execute - move Section3 to above Section1
        DesignComponentActions.designerSelectsDesignSection('Application1', 'Section3');
        DesignComponentActions.designerReordersSelectedComponentToAbove_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');

        // Verify - order should now be 3, 1, 2
        DesignComponentActions.designerSelectsDesignSection('Application1', 'Section3');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        DesignComponentActions.designerSelectsDesignSection('Application1', 'Section1');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
    });

    it('A Design Section may be moved to be above another Design Section in its parent Design Section', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        // Add more sub sections to Section1
        DesignComponentActions.designerAddsDesignSectionToDesignSection_Called('Section1', 'SubSection2');
        DesignComponentActions.designerAddsDesignSectionToDesignSection_Called('Section1', 'SubSection3');
        // Check ordering is as created: 1, 2, 3
        DesignComponentActions.designerSelectsDesignSection('Section1', 'SubSection1');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection2'));
        DesignComponentActions.designerSelectsDesignSection('Section1', 'SubSection2');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection3'));

        // Execute - move SubSection3 to above SubSection1
        DesignComponentActions.designerSelectsDesignSection('Section1', 'SubSection3');
        DesignComponentActions.designerReordersSelectedComponentToAbove_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection1');

        // Verify - order should now be 3, 1, 2
        DesignComponentActions.designerSelectsDesignSection('Section1', 'SubSection3');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection1'));
        DesignComponentActions.designerSelectsDesignSection('Section1', 'SubSection1');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection2'));
    });

    it('A Feature may be moved to be above another Feature in a Design Section', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        // Add another Feature to Section1
        DesignComponentActions.designerAddsFeatureToSection_Called('Section1', 'Feature555');

        // Check ordering is as created: Feature1, Feature444, Feature555
        DesignComponentActions.designerSelectsFeature('Section1', 'Feature1');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature444'));
        DesignComponentActions.designerSelectsFeature('Section1', 'Feature444');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature555'));

        // Execute - move Feature555 to above Feature1
        DesignComponentActions.designerSelectsFeature('Section1', 'Feature555');
        DesignComponentActions.designerReordersSelectedComponentToAbove_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature1');

        // Verify - order should now be 555, 1, 444
        DesignComponentActions.designerSelectsFeature('Section1', 'Feature555');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature1'));
        DesignComponentActions.designerSelectsFeature('Section1', 'Feature1');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature444'));
    });

    it('A Feature aspect may be moved to be above another Feature Aspect in a Feature', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        // Check ordering is as created for Feature1: Interface, Actions, Conditions, Consequences, ExtraAspect
        DesignComponentActions.designerSelectsFeatureAspect('Feature1', 'Interface');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        DesignComponentActions.designerSelectsFeatureAspect('Feature1', 'Actions');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        DesignComponentActions.designerSelectsFeatureAspect('Feature1', 'Conditions');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Consequences'));
        DesignComponentActions.designerSelectsFeatureAspect('Feature1', 'Consequences');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'ExtraAspect'));

        // Execute - move Consequences to above Conditions
        DesignComponentActions.designerSelectsFeatureAspect('Feature1', 'Consequences');
        DesignComponentActions.designerReordersSelectedComponentToAbove_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions');

        // Verify - order should now be Interface, Actions, Consequences, Conditions, ExtraAspect
        DesignComponentActions.designerSelectsFeatureAspect('Feature1', 'Interface');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        DesignComponentActions.designerSelectsFeatureAspect('Feature1', 'Actions');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Consequences'));
        DesignComponentActions.designerSelectsFeatureAspect('Feature1', 'Consequences');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        DesignComponentActions.designerSelectsFeatureAspect('Feature1', 'Conditions');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'ExtraAspect'));
    });

    it('A Scenario may be moved to be above another Scenario in a Feature Aspect', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        // Add another Scenario to Feature1 Actions
        DesignComponentActions.designerAddsScenarioToFeatureAspect_Called('Feature1', 'Actions', 'Scenario555');
        // Check ordering is as created: Scenario1, Scenario444, Scenario555
        DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario444'));
        DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario444');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario555'));

        // Execute - move Scenario555 to above Scenario1
        DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario555');
        DesignComponentActions.designerReordersSelectedComponentToAbove_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1');

        // Verify - order should now be 555, 1, 444
        DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario555');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
        expect(DesignComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario444'));
    });

    it('A Scenario may be moved to be above another Scenario in a Feature');


    // Consequences
    it('When a Design Component is reordered in a base Design Version, any related Design Updates are updated');

    it('When a Design Component is reordered in a base Design Version, any related Work Packages are updated');

});
