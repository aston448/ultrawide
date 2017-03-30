
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
import UpdateComponentVerifications from '../../test_framework/test_wrappers/design_update_component_verifications.js';

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';
import {DesignUpdateComponentValidationErrors} from '../../imports/constants/validation_errors.js';

describe('UC 551 - Add Functional Design Update Component', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 551 - Add Functional Design Update Component');

        TestFixtures.clearAllData();

        // Add  Design1 / DesignVersion1 + basic data
        TestFixtures.addDesignWithDefaultData();

        // Complete the Design Version and create the next
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2')
    });

    after(function(){

    });

    beforeEach(function(){

        // Remove any Design Updates before each test
        TestFixtures.clearDesignUpdates();

        // Add a new Design Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdate();
        DesignUpdateActions.designerSelectsUpdate(DefaultItemNames.NEW_DESIGN_UPDATE_NAME);
        DesignUpdateActions.designerEditsSelectedUpdateNameTo('DesignUpdate1');
    });

    afterEach(function(){

    });


    // Actions
    it('A Feature can be added to a Design Update Design Section', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Add new Feature to original Section 1
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateSection('Application1', 'Section1');

        // Verify
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', DefaultComponentNames.NEW_FEATURE_NAME));
    });

    it('A Scenario can be added to an in Scope Design Update Feature');

    it('A Scenario can be added to an in Scope Design Update Feature Aspect', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        // Make sure Feature1 Actions is in Scope
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');

        // Add new Scenario to original Feature 1 Actions
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateFeatureAspect('Feature1', 'Actions');

        // Verify
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', DefaultComponentNames.NEW_SCENARIO_NAME));
    });


    // Conditions
    it('A Scenario cannot be added to a Feature that is not in Scope for the Design Update');

    it('A Scenario cannot be added to a Feature Aspect that is not in Scope for the Design Update', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        // Actions is not in scope

        // Add new Scenario to original Feature 1 Actions
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_COMPONENT_ADD};
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateFeatureAspect('Feature1', 'Actions', expectation);

        // Verify
        expect(UpdateComponentVerifications.componentDoesNotExistForDesignerCurrentUpdate(ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME));
    });

    it('A functional Design Update Component cannot be added to a component removed in this Design Update', function(){

        // Setup - Remove Section1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section1');
        UpdateComponentActions.designerLogicallyDeletesUpdateSection('Application1', 'Section1');

        // Execute - try to add new Feature to Section1
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_ADDABLE_PARENT_REMOVED};
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateSection('Application1', 'Section1', expectation);

        // Verify - no new Feature
        expect(UpdateComponentVerifications.componentDoesNotExistForDesignerCurrentUpdate(ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME));

    });


    // Consequences
    it('When a functional Design Component is added to a Design Update it is also added to the Design Update Scope', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Add new Feature to original Section 1
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateSection('Application1', 'Section1');

        // Verify - new Feature in scope
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', DefaultComponentNames.NEW_FEATURE_NAME));
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', DefaultComponentNames.NEW_FEATURE_NAME));
    });

    it('When a functional Design Component is added to a Draft Design Update it is also added to any Work Package based on the update', function(){

        // Setup
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        // Create a WP based on DU1
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('UpdateWorkPackage1');

        // Execute - Designer Adds Feature3 to DU1
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section1');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature3');

        // Verify - Feature3 is in the WP now too
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage1');
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature3'));
    });

    it('When a Feature is added to a Design Update default Feature Aspects are also added as new Design Update Components', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Add new Feature to original Section 1
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateSection('Application1', 'Section1');

        // Verify - new Feature in scope
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', DefaultComponentNames.NEW_FEATURE_NAME));
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', DefaultComponentNames.NEW_FEATURE_NAME));

        // And new Aspects are there with status New and Changed - i.e. new but already have names set
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_NAME, 'Interface'));
        expect(UpdateComponentVerifications.componentIsNewForDesigner(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_NAME, 'Interface'));
        expect(UpdateComponentVerifications.componentIsChangedForDesigner(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_NAME, 'Interface'));

        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_NAME, 'Actions'));
        expect(UpdateComponentVerifications.componentIsNewForDesigner(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_NAME, 'Actions'));
        expect(UpdateComponentVerifications.componentIsChangedForDesigner(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_NAME, 'Actions'));

        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_NAME, 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNewForDesigner(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_NAME, 'Conditions'));
        expect(UpdateComponentVerifications.componentIsChangedForDesigner(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_NAME, 'Conditions'));

        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_NAME, 'Consequences'));
        expect(UpdateComponentVerifications.componentIsNewForDesigner(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_NAME, 'Consequences'));
        expect(UpdateComponentVerifications.componentIsChangedForDesigner(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_NAME, 'Consequences'));

    });

    it('A functional Design Component added to a Design Update appears as a functional addition in the Design Update summary');

});
