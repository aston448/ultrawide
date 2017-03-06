
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
import WorkPackageActions           from '../../test_framework/test_wrappers/work_package_actions.js';
import WorkPackageVerifications     from '../../test_framework/test_wrappers/work_package_verifications.js';
import WpComponentActions           from '../../test_framework/test_wrappers/work_package_component_actions.js';
import WpComponentVerifications     from '../../test_framework/test_wrappers/work_package_component_verifications.js';

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';
import {DesignComponentValidationErrors} from '../../imports/constants/validation_errors.js';

describe('UC 145 - Move Design Component', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 145 - Move Design Component');
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
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 'Application1'));

        // Execute - move Section1 from Application1 to Application99
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application99');

        // Verify new parent
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 'Application99'));
    });

    it('A Design Section may be moved into another Design Section', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'SubSection1', 'Design1', 'DesignVersion1', 'Section1'));

        // Execute - move SubSection1 from Section1 to Section2
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection1');
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section2');

        // Verify new parent
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'SubSection1', 'Design1', 'DesignVersion1', 'Section2'));
    });

    it('A Design Section inside a Design Section may be moved to under an Application', function() {

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'SubSection1', 'Design1', 'DesignVersion1', 'Section1'));

        // Execute - move SubSection1 from Section1 to Application1
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection1');
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');

        // Verify new parent
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'SubSection1', 'Design1', 'DesignVersion1', 'Application1'));
    });

    it('A Feature may be moved from one Design Section to another Design Section', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1', 'Section1'));

        // Execute - move Feature1 from Section1 to Section2
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature1');
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section2');

        // Verify new parent
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1', 'Section2'));
        // And check feature ref is still OK for all moved components
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_FeatureRefIs_(ComponentType.FEATURE, 'Section2', 'Feature1', 'Design1', 'DesignVersion1', 'Feature1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_FeatureRefIs_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'Design1', 'DesignVersion1', 'Feature1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_FeatureRefIs_(ComponentType.SCENARIO, 'Actions', 'Scenario1', 'Design1', 'DesignVersion1', 'Feature1'));
    });

    it('A Scenario may be moved from one Feature Aspect to another Feature Aspect', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 'Actions'));

        // Execute - move Scenario1 from Feature1 Actions to Feature2 Interface
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature2', 'Interface');

        // Verify new parent
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 'Interface'));
        // And check feature ref is OK - now Feature 2
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_FeatureRefIs_(ComponentType.SCENARIO, 'Interface', 'Scenario1', 'Design1', 'DesignVersion1', 'Feature2'));
    });



    // Conditions

    it('Applications cannot be moved to other Applications or Design Sections or Features or Feature Aspects', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

        // Execute - try to move Application1 to Application99
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');
        let expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE};
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application99', expectation);

        // Verify - App still has no parent
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.APPLICATION, 'Application1', 'Design1', 'DesignVersion1', 'NONE'));

        // Execute - try to move Application1 to Section1
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');
        expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE};
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1', expectation);

        // Verify - App still has no parent
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.APPLICATION, 'Application1', 'Design1', 'DesignVersion1', 'NONE'));

        // Execute - try to move Application1 to Feature1
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');
        expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE};
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature1', expectation);

        // Verify - App still has no parent
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.APPLICATION, 'Application1', 'Design1', 'DesignVersion1', 'NONE'));

        // Execute - try to move Application1 to Aspect Actions
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');
        expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE};
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', expectation);

        // Verify - App still has no parent
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.APPLICATION, 'Application1', 'Design1', 'DesignVersion1', 'NONE'));
    });

    it('Design Sections cannot be moved to Features or Feature Aspects', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

        // Execute - try to move Section1 to Feature1
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        let expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE};
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature1', expectation);

        // Verify - Section is still under App
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 'Application1'));

        // Execute - try to move Section1 to Aspect Actions
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE};
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', expectation);

        // Verify - Section is still under App
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 'Application1'));
    });

    it('Features cannot be moved to Applications or other Features or Feature Aspects', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

        // Execute - try to move Feature1 to Application1
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature1');
        let expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE};
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1', expectation);

        // Verify - Feature is still under Section1
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1', 'Section1'));

        // Execute - try to move Feature1 to Feature2
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature1');
        expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE};
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.FEATURE, 'Section2', 'Feature2', expectation);

        // Verify - Feature is still under Section1
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1', 'Section1'));

        // Execute - try to move Feature1 to Aspect Actions of Feature2
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature1');
        expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE};
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', expectation);

        // Verify - Feature is still under Section1
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1', 'Section1'));
    });

    it('Feature Aspects cannot be moved to Applications or Design Sections or other Features or Feature Aspects', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

        // Execute - try to move Aspect Actions to Application1
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
        let expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE};
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1', expectation);

        // Verify - Aspect is still under Feature1
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 'Feature1'));

        // Execute - try to move Aspect Actions to Section1
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
        expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE};
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1', expectation);

        // Verify - Aspect is still under Feature1
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 'Feature1'));

        // Execute - try to move Aspect Actions to Feature2
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
        expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE};
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.FEATURE, 'Section2', 'Feature2', expectation);

        // Verify - Aspect is still under Feature1
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 'Feature1'));

        // Execute - try to move Aspect Actions to Aspect Conditions
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
        expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE};
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', expectation);

        // Verify - Aspect is still under Feature1
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 'Feature1'));
    });

    it('Scenarios cannot be moved to Applications or Design Sections', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

        // Execute - try to move Scenario1 to Application1
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        let expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE};
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1', expectation);

        // Verify - Scenario1 is still under Actions
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 'Actions'));

        // Execute - try to move Scenario1 to Section1
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE};
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1', expectation);

        // Verify - Scenario1 is still under Aspect1
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 'Actions'));
    });

    it('Scenarios cannot be moved to Features', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

        // Execute - try to move Scenario1 to Feature2
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        let expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE};
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.FEATURE, 'Section2', 'Feature2', expectation);

        // Verify - Scenario1 is still under Actions
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 'Actions'));

    });

    it('No Design Component can be moved to a Scenario', function(){
        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');

        // Try to move Application1 to Scenario1
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');
        let expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE};
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1', expectation);

        // Verify - not moved
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.APPLICATION, 'Application1', 'Design1', 'DesignVersion1', 'NONE'));

        // Try to move Section1 to Scenario1
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE};
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1', expectation);

        // Verify - not moved
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section1', 'Design1', 'DesignVersion1', 'Application1'));

        // Try to move Feature1 to Scenario1
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature1');
        expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE};
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1', expectation);

        // Verify - not moved
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion1', 'Section1'));

        // Try to move Aspect Actions to Scenario1
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
        expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE};
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1', expectation);

        // Verify - not moved
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE_ASPECT, 'Actions', 'Design1', 'DesignVersion1', 'Feature1'));

        // Try to move Scenario2 to Scenario1
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.SCENARIO, 'Conditions', 'Scenario2');
        expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_INVALID_MOVE};
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1', expectation);

        // Verify - not moved
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.SCENARIO, 'Scenario2', 'Design1', 'DesignVersion1', 'Conditions'));

    });

    // Consequences
    it('When a Design Section is moved its level changes according to where it is placed', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
        expect(DesignComponentVerifications.sectionComponentCalled_LevelIs_('Section1', 1));
        expect(DesignComponentVerifications.sectionComponentCalled_LevelIs_('SubSection1', 2));

        // Execute - move SubSection1 from Section1 to Application1
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection1');
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');

        // Verify
        expect(DesignComponentVerifications.sectionComponentCalled_LevelIs_('Section1', 1));
        expect(DesignComponentVerifications.sectionComponentCalled_LevelIs_('SubSection1', 1));

        // Execute - move sub section back into Section1 (its now in Application1)
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'SubSection1');
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');

        // Verify
        expect(DesignComponentVerifications.sectionComponentCalled_LevelIs_('Section1', 1));
        expect(DesignComponentVerifications.sectionComponentCalled_LevelIs_('SubSection1', 2));
    });

    it('When a Scenario is moved to a new Feature its feature reference is updated', function(){

        // Setup
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
        expect(DesignComponentVerifications.scenarioCalled_FeatureReferenceIs_('Scenario1', 'Feature1'));

        // Execute - move Feature1 Actions Scenario1 to Feature2 Actions
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions');

        // Validate - feature should now be Feature2
        expect(DesignComponentVerifications.scenarioCalled_FeatureReferenceIs_('Scenario1', 'Feature2'));
    });

    it('When a Design Component is moved in a base Design Version, any related Work Packages are updated', function(){

        // Setup
        // Publish DV1
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        // Add 2 work packages
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerAddsBaseDesignWorkPackage();
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage1');
        WorkPackageActions.managerAddsBaseDesignWorkPackage();
        WorkPackageActions.managerSelectsWorkPackage(DefaultItemNames.NEW_WORK_PACKAGE_NAME);
        WorkPackageActions.managerUpdatesSelectedWpNameTo('WorkPackage2');

        // Put Section1 in scope in WP1
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.managerEditsSelectedBaseWorkPackage();
        WpComponentActions.managerAddsDesignSectionToScopeForCurrentBaseWp('Application1', 'Section1');

        // Execute - move SubSection1 from Section1 to Application1
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerEditsDesignVersion('DesignVersion1');
        DesignComponentActions.designerSelectsComponentType_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection1');
        DesignComponentActions.designerMovesSelectedComponentToTarget_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1');

        // Validate - SubSection1 is under Application1 in both WPs
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.managerEditsSelectedBaseWorkPackage();
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'SubSection1'));

        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage2');
        WorkPackageActions.managerEditsSelectedBaseWorkPackage();
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'SubSection1'));
    });

});
