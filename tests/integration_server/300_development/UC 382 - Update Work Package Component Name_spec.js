
import TestFixtures                     from '../../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                from '../../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions         from '../../../test_framework/test_wrappers/design_version_actions.js';
import DesignUpdateActions          from '../../../test_framework/test_wrappers/design_update_actions.js';
import DesignComponentActions       from '../../../test_framework/test_wrappers/design_component_actions.js';
import UpdateComponentActions       from '../../../test_framework/test_wrappers/design_update_component_actions.js';
import UpdateComponentVerifications from '../../../test_framework/test_wrappers/design_update_component_verifications.js';
import DesignVerifications          from '../../../test_framework/test_wrappers/design_verifications.js';
import DesignUpdateVerifications    from '../../../test_framework/test_wrappers/design_update_verifications.js';
import DesignVersionVerifications   from '../../../test_framework/test_wrappers/design_version_verifications.js';
import DesignComponentVerifications from '../../../test_framework/test_wrappers/design_component_verifications.js';
import UserContextVerifications     from '../../../test_framework/test_wrappers/user_context_verifications.js';
import WorkPackageActions           from '../../../test_framework/test_wrappers/work_package_actions.js';
import WorkPackageVerifications     from '../../../test_framework/test_wrappers/work_package_verifications.js';
import WpComponentActions           from '../../../test_framework/test_wrappers/work_package_component_actions.js';
import WpComponentVerifications     from '../../../test_framework/test_wrappers/work_package_component_verifications.js';
import OutputLocationsActions       from '../../../test_framework/test_wrappers/output_locations_actions.js';
import OutputLocationsVerifications from '../../../test_framework/test_wrappers/output_locations_verifications.js';
import TestResultActions            from '../../../test_framework/test_wrappers/test_integration_actions.js';
import TestResultVerifications      from '../../../test_framework/test_wrappers/test_result_verifications.js';
import ViewOptionsActions           from '../../../test_framework/test_wrappers/view_options_actions.js';
import ViewOptionsVerifications     from '../../../test_framework/test_wrappers/view_options_verifications.js';

import {DefaultLocationText, DefaultItemNames, DefaultComponentNames} from '../../../imports/constants/default_names.js';
import {WorkPackageComponentValidationErrors, DesignComponentValidationErrors, DesignUpdateComponentValidationErrors}   from '../../../imports/constants/validation_errors.js';
import { ComponentType, WorkPackageStatus } from '../../../imports/constants/constants.js';

describe('UC 382 - Update Work Package Component Name - Base Design', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 382 - Update Work Package Component Name - Base Design');
    });

    after(function(){

    });

    beforeEach(function(){

        // Basic Design Version Data
        TestFixtures.clearAllData();
        TestFixtures.addDesignWithDefaultData();

        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');

        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.managerAddsBaseDesignWorkPackageCalled('WorkPackage1');
        WorkPackageActions.managerEditsBaseWorkPackage('WorkPackage1');
        WpComponentActions.managerAddsFeatureToScopeForCurrentWp('Section1', 'Feature1');
        WpComponentActions.managerAddsFeatureToScopeForCurrentWp('Section2', 'Feature2');
        WorkPackageActions.managerPublishesSelectedWorkPackage();
    });

    afterEach(function(){

    });


    // Actions
    it('A Developer can edit the name of a Base Design Version Work Package Scenario and save changes', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        WpComponentActions.developerUpdatesSelectedComponentNameTo('New Scenario Name');

        // Verify
        expect(WpComponentVerifications.developerSelectedComponentNameIs('New Scenario Name'));
    });

    it('A Developer can edit the name of a new Base Design Version Work Package Feature Aspect and save changes', function(){

        // Setup - add new Feature Aspect
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        WpComponentActions.developerAddsFeatureAspectToSelectedFeature();

        // Execute
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature1', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
        WpComponentActions.developerUpdatesSelectedComponentNameTo('Aspect1');

        // Verify
        expect(WpComponentVerifications.developerSelectedComponentNameIs('Aspect1'));
    });


    // Conditions
    it('Feature Aspects not added by a Developer are not editable in a Base Design Version Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - select existing Aspect
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
        const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_NOT_WP_UPDATABLE};
        WpComponentActions.developerUpdatesSelectedComponentNameTo('Aspect1', expectation);

        // Verify - not changed
        expect(WpComponentVerifications.developerSelectedComponentNameIs('Actions'));

    });

    it('Features are not editable in a Base Design Version Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - select existing Feature
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_NOT_WP_UPDATABLE};
        WpComponentActions.developerUpdatesSelectedComponentNameTo('New Feature Name', expectation);

        // Verify - not changed
        expect(WpComponentVerifications.developerSelectedComponentNameIs('Feature1'));
    });

    it('Design Sections are not editable in a Base Design Version Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - select existing Feature
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_NOT_WP_UPDATABLE};
        WpComponentActions.developerUpdatesSelectedComponentNameTo('New Section Name', expectation);

        // Verify - not changed
        expect(WpComponentVerifications.developerSelectedComponentNameIs('Section1'));
    });

    it('Applications are not editable in a Base Design Version Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - select existing Feature
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.APPLICATION, 'NONE', 'Application1');
        const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_NOT_WP_UPDATABLE};
        WpComponentActions.developerUpdatesSelectedComponentNameTo('New Application Name', expectation);

        // Verify - not changed
        expect(WpComponentVerifications.developerSelectedComponentNameIs('Application1'));
    });


    // Consequences
    it('When a Base Design Version Work Package Scenario is edited by a Developer the new version appears in the Base Design Version', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        WpComponentActions.developerUpdatesSelectedComponentNameTo('New Scenario Name');

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'New Scenario Name', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, 'Scenario1', 'Design1', 'DesignVersion1', 0));

    });

    it('When a new Base Design Version Work Package Feature Aspect is edited by a Developer the new version appears in the Base Design Version', function(){

        // Setup - add new Feature Aspect
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        WpComponentActions.developerAddsFeatureAspectToSelectedFeature();

        // Execute
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature1', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
        WpComponentActions.developerUpdatesSelectedComponentNameTo('Aspect1');

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, 'Aspect1', 'Design1', 'DesignVersion1', 1));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Design1', 'DesignVersion1', 0));

    });

});

describe('UC 382 - Update Work Package Component Name - Design Update', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 382 - Update Work Package Component Name - Design Update');
    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        // Complete the Design Version and create the next
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');

        // Add a new Design Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');
        // Add some new functionality to it and publish
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section1');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature3');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature3', 'Actions', 'Scenario8');
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        // Manager creates Update WP that includes the new Feature3
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('UpdateWorkPackage1');
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage1');
        WpComponentActions.managerAddsFeatureToScopeForCurrentWp('Section1', 'Feature3');
        WorkPackageActions.managerPublishesSelectedWorkPackage();
    });

    afterEach(function(){

    });


    // Actions
    it('A Developer can edit the name of a Design Update Work Package Scenario and save changes', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.SCENARIO, 'Actions', 'Scenario8');
        WpComponentActions.developerUpdatesSelectedComponentNameTo('New Scenario Name');

        // Verify
        expect(WpComponentVerifications.developerSelectedComponentNameIs('New Scenario Name'));
    });

    it('A Developer can edit the name of a new Design Update Work Package Feature Aspect and save changes', function(){

        // Setup - add a new Feature aspect
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE, 'Section1', 'Feature3');
        WpComponentActions.developerAddsFeatureAspectToSelectedFeature();

        // Execute
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature3', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
        WpComponentActions.developerUpdatesSelectedComponentNameTo('Aspect1');

        // Verify
        expect(WpComponentVerifications.developerSelectedComponentNameIs('Aspect1'));
    });


    // Conditions
    it('Feature Aspects not added by a Developer are not editable in a Design Update Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - expect failure
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature3', 'Actions');
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_WP_UPDATABLE};
        WpComponentActions.developerUpdatesSelectedComponentNameTo('Aspect1', expectation);

        // Verify - not changed
        expect(WpComponentVerifications.developerSelectedComponentNameIs('Actions'));
    });

    it('Features are not editable in a Design Update Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - expect failure
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE, 'Section1', 'Feature3');
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_WP_UPDATABLE};
        WpComponentActions.developerUpdatesSelectedComponentNameTo('New Feature Name', expectation);

        // Verify - not changed
        expect(WpComponentVerifications.developerSelectedComponentNameIs('Feature3'));
    });

    it('Design Sections are not editable in a Design Update Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - expect failure
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_WP_UPDATABLE};
        WpComponentActions.developerUpdatesSelectedComponentNameTo('New Section Name', expectation);

        // Verify - not changed
        expect(WpComponentVerifications.developerSelectedComponentNameIs('Section1'));
    });

    it('Applications are not editable in a Design Update Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - expect failure
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.APPLICATION, 'NONE', 'Application1');
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_WP_UPDATABLE};
        WpComponentActions.developerUpdatesSelectedComponentNameTo('New Application Name', expectation);

        // Verify - not changed
        expect(WpComponentVerifications.developerSelectedComponentNameIs('Application1'));
    });


    // Consequences
    it('When a Design Update Work Package Scenario is edited by a Developer the new version appears in the Design Update', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.SCENARIO, 'Actions', 'Scenario8');
        WpComponentActions.developerUpdatesSelectedComponentNameTo('New Scenario Name');

        // Verify
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.SCENARIO, 'New Scenario Name', 1));
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.SCENARIO, 'Scenario8', 0));

    });

    it('When a new Design Update Work Package Feature Aspect is edited by a Developer the new version appears in the Design Update', function(){

        // Setup - add a new Feature aspect
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE, 'Section1', 'Feature3');
        WpComponentActions.developerAddsFeatureAspectToSelectedFeature();

        // Execute
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature3', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
        WpComponentActions.developerUpdatesSelectedComponentNameTo('Aspect1');

        // Verify
        DesignActions.designerWorksOnDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.FEATURE_ASPECT, 'Aspect1', 1));
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 0));
    });

});
