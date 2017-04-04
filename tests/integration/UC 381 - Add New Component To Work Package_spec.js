
import TestFixtures                     from '../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                from '../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions         from '../../test_framework/test_wrappers/design_version_actions.js';
import DesignUpdateActions          from '../../test_framework/test_wrappers/design_update_actions.js';
import DesignComponentActions       from '../../test_framework/test_wrappers/design_component_actions.js';
import UpdateComponentActions       from '../../test_framework/test_wrappers/design_update_component_actions.js';
import UpdateComponentVerifications from '../../test_framework/test_wrappers/design_update_component_verifications.js';
import DesignVerifications          from '../../test_framework/test_wrappers/design_verifications.js';
import DesignUpdateVerifications    from '../../test_framework/test_wrappers/design_update_verifications.js';
import DesignVersionVerifications   from '../../test_framework/test_wrappers/design_version_verifications.js';
import DesignComponentVerifications from '../../test_framework/test_wrappers/design_component_verifications.js';
import UserContextVerifications     from '../../test_framework/test_wrappers/user_context_verifications.js';
import WorkPackageActions           from '../../test_framework/test_wrappers/work_package_actions.js';
import WorkPackageVerifications     from '../../test_framework/test_wrappers/work_package_verifications.js';
import WpComponentActions           from '../../test_framework/test_wrappers/work_package_component_actions.js';
import WpComponentVerifications     from '../../test_framework/test_wrappers/work_package_component_verifications.js';
import OutputLocationsActions       from '../../test_framework/test_wrappers/output_locations_actions.js';
import OutputLocationsVerifications from '../../test_framework/test_wrappers/output_locations_verifications.js';
import TestResultActions            from '../../test_framework/test_wrappers/test_integration_actions.js';
import TestResultVerifications      from '../../test_framework/test_wrappers/test_result_verifications.js';
import ViewOptionsActions           from '../../test_framework/test_wrappers/view_options_actions.js';
import ViewOptionsVerifications     from '../../test_framework/test_wrappers/view_options_verifications.js';

import {DefaultLocationText, DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';
import {WorkPackageComponentValidationErrors, DesignComponentValidationErrors, DesignUpdateComponentValidationErrors}   from '../../imports/constants/validation_errors.js';
import { ComponentType, WorkPackageStatus } from '../../imports/constants/constants.js';

describe('UC 381 - Add New Component To Work Package - Base Design', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 381 - Add New Component To Work Package - Base Design');
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
    it('A Developer can add a new Feature Aspect to a Feature in a Base Design Version Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        WpComponentActions.developerAddsFeatureAspectToSelectedFeature();

        // Verify - can select new Feature Aspect
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature1', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
    });

    it('A Developer can add a new Scenario to a Base Design Version Work Package Feature Aspect', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
        WpComponentActions.developerAddsScenarioToSelectedFeatureAspect();

        // Verify - can select new Scenario
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.SCENARIO, 'Actions', DefaultComponentNames.NEW_SCENARIO_NAME);
    });


    // Conditions
    it('A Developer cannot add a Feature to a Base Design Version Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - expect failure
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_NOT_WP_ADDABLE};
        WpComponentActions.developerAddsFeatureToSelectedDesignSection(expectation);
    });

    it('A Developer cannot add a Design Section to a Base Design Version Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - expect failure (Section to Section)
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_NOT_WP_ADDABLE};
        WpComponentActions.developerAddsDesignSectionToSelectedComponent(expectation);

        // Execute - expect failure (Section to Application)
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.APPLICATION, 'NONE', 'Application1');
        WpComponentActions.developerAddsDesignSectionToSelectedComponent(expectation);
    });

    it('A Developer cannot add an Application to a Base Design Version Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - expect failure
        const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_NOT_WP_ADDABLE};
        WpComponentActions.developerAddsApplicationToWorkPackage(expectation);
    });


    // Consequences
    it('When a Base Design Version Work Package Feature Aspect is added by a Developer it appears in the Base Design Version', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();
        // Check
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Design1', 'DesignVersion1', 0));

        // Execute
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        WpComponentActions.developerAddsFeatureAspectToSelectedFeature();

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Design1', 'DesignVersion1', 1));
    });

    it('When a Base Design Version Work Package Scenario is added by a Developer it appears in the Base Design Version', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();
        // Check
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Design1', 'DesignVersion1', 0));

        // Execute
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
        WpComponentActions.developerAddsScenarioToSelectedFeatureAspect();

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_CountIs_(ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Design1', 'DesignVersion1', 1));
    });

});

describe('UC 381 - Add New Component To Work Package - Design Update', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 381 - Add New Component To Work Package - Design Update');


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
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
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
        // Manager creates Update WP that includes Application1
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('UpdateWorkPackage2');
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage2');
        WpComponentActions.managerAddsApplicationToScopeForCurrentWp('Application1');
        WorkPackageActions.managerPublishesSelectedWorkPackage();
    });

    afterEach(function(){

    });


    // Actions
    it('A Developer can add a new Feature Aspect to a Feature in a Design Update Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE, 'Section1', 'Feature3');
        WpComponentActions.developerAddsFeatureAspectToSelectedFeature();

        // Verify - can select new Feature Aspect
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature3', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
    });

    it('A Developer can add a new Scenario to a Design Update Work Package Feature Aspect', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature3', 'Actions');
        WpComponentActions.developerAddsScenarioToSelectedFeatureAspect();

        // Verify - can select new Scenario
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.SCENARIO, 'Actions', DefaultComponentNames.NEW_SCENARIO_NAME);
    });


    // Conditions
    it('A Developer cannot add a Feature to a Design Update Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - expect failure
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_WP_ADDABLE};
        WpComponentActions.developerAddsFeatureToSelectedDesignSection(expectation);
    });

    it('A Developer cannot add a Design Section to a Design Update Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        // Select the WP that contains Section1
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage2');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - expect failure (Section to Section)
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_WP_ADDABLE};
        WpComponentActions.developerAddsDesignSectionToSelectedComponent(expectation);

        // Execute - expect failure (Section to Application)
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.APPLICATION, 'NONE', 'Application1');
        WpComponentActions.developerAddsDesignSectionToSelectedComponent(expectation);
    });

    it('A Developer cannot add an Application to a Design Update Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - expect failure
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_WP_ADDABLE};
        WpComponentActions.developerAddsApplicationToWorkPackage(expectation);
    });


    // Consequences
    it('When a Design Update Work Package Feature Aspect is added by a Developer it appears in the Design Update',function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();
        // Check
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 0));

        // Execute
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE, 'Section1', 'Feature3');
        WpComponentActions.developerAddsFeatureAspectToSelectedFeature();

        // Verify
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 1));

    });

    it('When a Design Update Work Package Scenario is added by a Developer it appears in the Design Update', function(){
        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();
        // Check
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 0));

        // Execute
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature3', 'Actions');
        WpComponentActions.developerAddsScenarioToSelectedFeatureAspect();

        // Verify
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 1));

    });

});
