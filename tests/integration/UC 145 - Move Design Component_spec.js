
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

describe('UC 145 - Move Design Component', function(){

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
    it('A Design Section may be moved from one Application to another Application', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 'Application1'));

        // Execute - move Section1 from Application1 to Application99
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application99');

        // Verify new parent
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 'Application99'));
    });

    it('A Design Section may be moved into another Design Section', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'SubSection1', 'Design1', 'DesignVersion1', 'Section1'));

        // Execute - move SubSection1 from Section1 to Section2
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section2');

        // Verify new parent
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'SubSection1', 'Design1', 'DesignVersion1', 'Section2'));
    });

    it('A Design Section inside a Design Section may be moved to under an Application', function() {

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'SubSection1', 'Design1', 'DesignVersion1', 'Section1'));

        // Execute - move SubSection1 from Section1 to Application1
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');

        // Verify new parent
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'SubSection1', 'Design1', 'DesignVersion1', 'Application1'));
    });

    it('A Feature may be moved from one Design Section to another Design Section', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1', 'Section1'));

        // Execute - move Feature1 from Section1 to Section2
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section2');

        // Verify new parent
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1', 'Section2'));
    });

    it('A Feature Aspect may be moved from one Feature to another Feature', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE_ASPECT, 'ExtraAspect', 'Design1', 'DesignVersion1', 'Feature1'));

        // Execute - move ExtraAspect from Feature1 to Feature2
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'ExtraAspect');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.FEATURE, 'Section2', 'Feature2');

        // Verify new parent
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE_ASPECT, 'ExtraAspect', 'Design1', 'DesignVersion1', 'Feature2'));

    });

    it('A Scenario may be moved from a Feature to a Feature Aspect');

    it('A Scenario may be moved from a Feature Aspect to a Feature');

    it('A Scenario may be moved from one Feature Aspect to another Feature Aspect', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 'Actions'));

        // Execute - move Scenario1 from Feature1 Actions to Feature2 Interface
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature2', 'Interface');

        // Verify new parent
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 'Interface'));
    });

    it('A Scenario may be moved from one Feature to another Feature');


    // Conditions
    it('Design Components can only be moved when in edit mode');

    it('Applications cannot be moved to other Applications or Design Sections or Features or Feature Aspects', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

        // Execute - try to move Application1 to Application99
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application99');

        // Verify - App still has no parent
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.APPLICATION, 'Application1', 'Design1', 'DesignVersion1', 'NONE'));

        // Execute - try to move Application1 to Section1
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');

        // Verify - App still has no parent
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.APPLICATION, 'Application1', 'Design1', 'DesignVersion1', 'NONE'));

        // Execute - try to move Application1 to Feature1
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature1');

        // Verify - App still has no parent
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.APPLICATION, 'Application1', 'Design1', 'DesignVersion1', 'NONE'));

        // Execute - try to move Application1 to Aspect Actions
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');

        // Verify - App still has no parent
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.APPLICATION, 'Application1', 'Design1', 'DesignVersion1', 'NONE'));
    });

    it('Design Sections cannot be moved to Features or Feature Aspects', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

        // Execute - try to move Section1 to Feature1
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature1');

        // Verify - Section is still under App
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 'Application1'));

        // Execute - try to move Section1 to Aspect Actions
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');

        // Verify - Section is still under App
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 'Application1'));
    });

    it('Features cannot be moved to Applications or other Features or Feature Aspects', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

        // Execute - try to move Feature1 to Application1
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');

        // Verify - Feature is still under Section1
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1', 'Section1'));

        // Execute - try to move Feature1 to Feature2
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.FEATURE, 'Section2', 'Feature2');

        // Verify - Feature is still under Section1
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1', 'Section1'));

        // Execute - try to move Feature1 to Aspect Actions of Feature2
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions');

        // Verify - Feature is still under Section1
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1', 'Section1'));
    });

    it('Feature Aspects cannot be moved to Applications or Design Sections or other Feature Aspects', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

        // Execute - try to move Aspect Actions to Application1
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');

        // Verify - Aspect is still under Feature1
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 'Feature1'));

        // Execute - try to move Aspect Actions to Section1
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');

        // Verify - Aspect is still under Feature1
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 'Feature1'));

        // Execute - try to move Aspect Actions to Aspect Conditions
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions');

        // Verify - Aspect is still under Feature1
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 'Feature1'));
    });

    it('Scenarios cannot be moved to Applications or Design Sections', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

        // Execute - try to move Scenario1 to Application1
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');

        // Verify - Scenario1 is still under Actions
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 'Actions'));

        // Execute - try to move Aspect1 to Section1
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');

        // Verify - Scenario1 is still under Aspect1
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 'Actions'));
    });

    it('No Design Component can be moved to a Scenario', function(){
        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');

        // Try to move Application1 to Scenario1
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1');

        // Verify - not moved
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.APPLICATION, 'Application1', 'Design1', 'DesignVersion1', 'NONE'));

        // Try to move Section1 to Scenario1
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1');

        // Verify - not moved
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 'Application1'));

        // Try to move Feature1 to Scenario1
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1');

        // Verify - not moved
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1', 'Section1'));

        // Try to move Aspect Actions to Scenario1
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1');

        // Verify - not moved
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 'Feature1'));

        // Try to move Scenario2 to Scenario1
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.SCENARIO, 'Conditions', 'Scenario2');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1');

        // Verify - not moved
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.SCENARIO, 'Scenario2', 'Design1', 'DesignVersion1', 'Conditions'));

    });

    // Consequences
    it('When a Design Section is moved its level changes according to where it is placed', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        expect(DesignComponentVerifications.sectionComponentCalled_LevelIs_('Section1', 1));
        expect(DesignComponentVerifications.sectionComponentCalled_LevelIs_('SubSection1', 2));

        // Execute - move SubSection1 from Section1 to Application1
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');

        // Verify
        expect(DesignComponentVerifications.sectionComponentCalled_LevelIs_('Section1', 1));
        expect(DesignComponentVerifications.sectionComponentCalled_LevelIs_('SubSection1', 1));

        // Execute - move sub section back into Section1 (its now in Application1)
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'SubSection1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');

        // Verify
        expect(DesignComponentVerifications.sectionComponentCalled_LevelIs_('Section1', 1));
        expect(DesignComponentVerifications.sectionComponentCalled_LevelIs_('SubSection1', 2));
    });

    it('When a Feature Aspect is moved to a new Feature the feature reference for all its children is updated');

    it('When a Scenario is moved to a new Feature its feature reference is updated', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditDesignVersion('DesignVersion1');
        expect(DesignComponentVerifications.scenarioCalled_FeatureReferenceIs_('Scenario1', 'Feature1'));

        // Execute - move Feature1 Actions Scenario1 to Feature2 Actions
        DesignComponentActions.designerSelectComponentType_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        DesignComponentActions.designerMoveSelectedComponentToTarget_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions');

        // Validate - feature should now be Feature2
        expect(DesignComponentVerifications.scenarioCalled_FeatureReferenceIs_('Scenario1', 'Feature2'));


    });

    it('When a Design Component is moved in a base Design Version, any related Design Updates are updated');

    it('When a Design Component is moved in a base Design Version, any related Work Packages are updated');

});
