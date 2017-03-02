
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

describe('UC 383 - Remove New Work Package Component - Base Design', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 383 - Remove New Work Package Component - Base Design');
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
        // Make sure WP scope covers everything we want to play with
        WpComponentActions.managerAddsApplicationToScopeForCurrentBaseWp('Application1');
        WpComponentActions.managerAddsApplicationToScopeForCurrentBaseWp('Application99');
        WorkPackageActions.managerPublishesSelectedWorkPackage();
    });

    afterEach(function(){

    });


    // Actions
    it('A Developer can remove a Scenario that has been added to a Base Design Version Work Package', function(){

        // Setup - add a new Scenario
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
        WpComponentActions.developerAddsScenarioToSelectedFeatureAspect();
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.SCENARIO, 'Actions', DefaultComponentNames.NEW_SCENARIO_NAME);

        // Execute - Remove it again
        WpComponentActions.developerRemovesSelectedScenario();

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExist(ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME));
    });

    it('A Developer can remove a Feature Aspect that has been added to a Base Design Version Work Package', function(){

        // Setup - add a new Feature Aspect
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        WpComponentActions.developerAddsFeatureAspectToSelectedFeature();
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature1', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);

        // Execute - Remove it again
        WpComponentActions.developerRemovesSelectedFeatureAspect();

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExist(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME));

    });


    // Conditions
    it('A Developer cannot remove an existing Scenario from a Base Design Version Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - Remove existing Scenario
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_NOT_REMOVABLE_DEV};
        WpComponentActions.developerRemovesSelectedScenario(expectation);

        // Verify - can still select
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.SCENARIO, 'Actions', 'Scenario1');

    });

    it('A Developer cannot remove an existing Feature Aspect from a Base Design Version Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - Remove existing Scenario - must be a removable one
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Interface');
        const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_NOT_REMOVABLE_DEV};
        WpComponentActions.developerRemovesSelectedFeatureAspect(expectation);

        // Verify - can still select
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
    });

    it('A Developer cannot remove an existing Feature from a Base Design Version Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - Remove existing Feature - the removable one
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE, 'Section99', 'Feature99');
        const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_NOT_REMOVABLE_DEV};
        WpComponentActions.developerRemovesSelectedFeature(expectation);

        // Verify - can still select
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE, 'Section99', 'Feature99');
    });

    it('A new Feature Aspect cannot be removed from a Base Design Version Work Package if it has a child Scenario', function(){

        // Setup - add a new Feature Aspect
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        WpComponentActions.developerAddsFeatureAspectToSelectedFeature();
        // And add a Scenario to it
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature1', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
        WpComponentActions.developerAddsScenarioToSelectedFeatureAspect();

        // Execute - try to remove new Feature Aspect
        const expectation = {success: false, message: DesignComponentValidationErrors.DESIGN_COMPONENT_NOT_REMOVABLE};
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature1', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
        WpComponentActions.developerRemovesSelectedFeatureAspect(expectation);

        // Validate - can still select both
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature1', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.SCENARIO, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, DefaultComponentNames.NEW_SCENARIO_NAME);
    });


    // Consequences
    it('When a Base Design Version Work Package Scenario is removed by a Developer it is no longer in the Base Design Version', function(){

        // Setup - add a new Scenario
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
        WpComponentActions.developerAddsScenarioToSelectedFeatureAspect();
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.SCENARIO, 'Actions', DefaultComponentNames.NEW_SCENARIO_NAME);

        // Execute - Remove it again
        WpComponentActions.developerRemovesSelectedScenario();

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExist(ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME));
    });

    it('When a Base Design Version Work Package Feature Aspect is removed by a Developer it is no longer in the Base Design Version', function(){

        // Setup - add a new Feature Aspect
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        WorkPackageActions.developerSelectsWorkPackage('WorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        WpComponentActions.developerAddsFeatureAspectToSelectedFeature();
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature1', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);

        // Execute - Remove it again
        WpComponentActions.developerRemovesSelectedFeatureAspect();

        // Verify
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExist(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME));
    });

});

describe('UC 383 - Remove New Work Package Component - Design Update', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 383 - Remove New Work Package Component - Design Update');

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        // Complete the Design Version and create the next
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');
    });

    after(function(){

    });

    beforeEach(function(){

        // Clear WPs and Design Updates and start again...
        TestFixtures.clearDesignUpdates();
        TestFixtures.clearWorkPackages();

        // Add a new Design Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');
        // Add some new functionality to it and publish.  Add other existing stuff we need into scope
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature3');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature3', 'Actions', 'Scenario8');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section99', 'Feature99');
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        // Manager creates Update WP
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('UpdateWorkPackage1');
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage1');
        // Make sure WP scope covers everything we want to play with
        WpComponentActions.managerAddsApplicationToScopeForCurrentUpdateWp('Application1');
        WpComponentActions.managerAddsApplicationToScopeForCurrentUpdateWp('Application99');
        WorkPackageActions.managerPublishesSelectedWorkPackage();
    });

    afterEach(function(){

    });


    // Actions
    it('A Developer can remove a Scenario that has been added to a Design Update Work Package', function(){

        // Setup - add a new Scenario
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature3', 'Actions');
        WpComponentActions.developerAddsScenarioToSelectedFeatureAspect();

        // Execute
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.SCENARIO, 'Actions', DefaultComponentNames.NEW_SCENARIO_NAME);
        WpComponentActions.developerRemovesSelectedScenario();

        // Verify
        expect(UpdateComponentVerifications.componentDoesNotExistForDesignerCurrentUpdate(ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME));
    });

    it('A Developer can remove a Feature Aspect that has been added to a Design Update Work Package', function(){

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
        WpComponentActions.developerRemovesSelectedFeatureAspect();

        // Verify
        expect(UpdateComponentVerifications.componentDoesNotExistForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME));
    });


    // Conditions
    it('A Developer cannot remove an existing Scenario from a Design Update Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.SCENARIO, 'Actions', 'Scenario8');
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_REMOVABLE_DEV};
        WpComponentActions.developerRemovesSelectedScenario(expectation);

        // Verify - still there
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.SCENARIO, 'Actions', 'Scenario8');
    });

    it('A Developer cannot remove an existing Feature Aspect from a Design Update Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature3', 'Interface');
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_REMOVABLE_DEV};
        WpComponentActions.developerRemovesSelectedFeatureAspect(expectation);

        // Verify - still there
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature3', 'Actions');
    });

    it('A Developer cannot remove an existing Feature from a Design Update Work Package', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();

        // Execute - remove removable feature
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE, 'Section99', 'Feature99');
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_REMOVABLE_DEV};
        WpComponentActions.developerRemovesSelectedFeature();

        // Verify - still there
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE, 'Section99', 'Feature99');
    });


    it('A new Feature Aspect cannot be removed from a Design Update Work Package if it has a child Scenario', function(){

        // Setup
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE, 'Section1', 'Feature3');
        WpComponentActions.developerAddsFeatureAspectToSelectedFeature();
        // And add a Scenario to it
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature3', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
        WpComponentActions.developerAddsScenarioToSelectedFeatureAspect();

        // Execute - try to remove new Feature Aspect
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_REMOVABLE};
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature3', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
        WpComponentActions.developerRemovesSelectedFeatureAspect(expectation);

        // Validate - can still select both
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature3', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.SCENARIO, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, DefaultComponentNames.NEW_SCENARIO_NAME);

    });


    // Consequences
    it('When a Design Update Work Package Scenario is removed by a Developer it is no longer in the Design Update', function(){

        // Setup - add a new Scenario
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.developerSelectsWorkPackage('UpdateWorkPackage1');
        WorkPackageActions.developerAdoptsSelectedWorkPackage();
        WorkPackageActions.developerDevelopsSelectedWorkPackage();
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.FEATURE_ASPECT, 'Feature3', 'Actions');
        WpComponentActions.developerAddsScenarioToSelectedFeatureAspect();

        // Execute
        WpComponentActions.developerSelectsWorkPackageComponent(ComponentType.SCENARIO, 'Actions', DefaultComponentNames.NEW_SCENARIO_NAME);
        WpComponentActions.developerRemovesSelectedScenario();

        // Verify
        expect(UpdateComponentVerifications.componentDoesNotExistForDesignerCurrentUpdate(ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME));
    });

    it('When a Design Update Work Package Feature Aspect is removed by a Developer it is no longer in the Design Update', function(){

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
        WpComponentActions.developerRemovesSelectedFeatureAspect();

        // Verify
        expect(UpdateComponentVerifications.componentDoesNotExistForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME));
    });

});
