
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
import ContainerDataVerifications   from '../../test_framework/test_wrappers/container_data_verifications.js';

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';
import {DesignUpdateComponentValidationErrors} from '../../imports/constants/validation_errors.js';

describe('UC 541 - Remove Design Item from Update Scope', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 541 - Remove Design Item from Update Scope');

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
    it('An existing Feature can be removed from Design Update Scope', function(){

        // Setup - add Feature1 to scope
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));

        // Execute
        UpdateComponentActions.designerRemovesFeatureFromCurrentUpdateScope('Section1', 'Feature1');

        // Verify
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));

    });

    it('An existing Feature Aspect can be removed from Design Update Scope', function(){

        // Setup - add Feature1 Actions to scope
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));

        // Execute
        UpdateComponentActions.designerRemovesFeatureAspectFromCurrentUpdateScope('Feature1', 'Actions');

        // Verify
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
    });

    it('An existing Scenario can be removed from Design Update Scope', function(){

        // Setup - add Scenario1 to scope
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));

        // Execute
        UpdateComponentActions.designerRemovesScenarioFromCurrentUpdateScope('Actions', 'Scenario1');

        // Verify
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
    });


    // Conditions
    it('A new Feature in the Design Update cannot be removed from the Design Update Scope', function(){

        // Setup - Add a new Feature to DU1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature3');

        // Execute - try to descope Feature 3
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_UNSCOPABLE_NEW};
        UpdateComponentActions.designerRemovesFeatureFromCurrentUpdateScope('Section1', 'Feature3', expectation);

        // Verify still in scope
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature3'));
    });

    it('A new Feature Aspect in the Design Update cannot be removed from the Design Update Scope', function(){

        // Setup - Add a new Feature Aspect to DU1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        UpdateComponentActions.designerAddsFeatureAspectTo_Feature_Called('Section1', 'Feature1', 'Aspect1');

        // Execute - try to descope Aspect1
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_UNSCOPABLE_NEW};
        UpdateComponentActions.designerRemovesFeatureAspectFromCurrentUpdateScope('Feature1', 'Aspect1', expectation);

        // Verify still in scope
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Aspect1'));
    });

    it('A new Scenario in the Design Update cannot be removed from the Design Update Scope', function(){

        // Setup - Add a new Scenario to DU1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature1', 'Actions', 'Scenario8');

        // Execute - try to descope Scenario8
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_UNSCOPABLE_NEW};
        UpdateComponentActions.designerRemovesScenarioFromCurrentUpdateScope('Actions', 'Scenario8', expectation);

        // Verify still in scope
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario8'));
    });

    it('An existing Feature cannot be removed from Design Update Scope if new Scenarios have been added to it', function(){

        // Setup - Add a new Feature Aspect to existing Feature1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        UpdateComponentActions.designerAddsFeatureAspectTo_Feature_Called('Section1', 'Feature1', 'Aspect1');

        // Execute - try to descope Feature1
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_UNSCOPABLE_NEW_CHILDREN};
        UpdateComponentActions.designerRemovesFeatureFromCurrentUpdateScope('Section1', 'Feature1', expectation);

        // Verify still in scope
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));

    });

    it('An existing Feature Aspect cannot be removed from Design Update Scope if new Scenarios have been added to it', function(){

        // Setup - Add a new Scenario to existing Feature Aspect
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature1', 'Actions', 'Scenario8');

        // Execute - try to descope Actions
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_UNSCOPABLE_NEW_CHILDREN};
        UpdateComponentActions.designerRemovesFeatureAspectFromCurrentUpdateScope('Feature1', 'Actions', expectation);

        // Verify still in scope
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
    });

    // Consequences
    it('When a scopable Design Component is removed from Design Update Scope it disappears from the Design Update editor', function(){

        // FEATURE
        // Setup - Add Feature1 to the scope
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        // Confirm that feature is now included in editor data
        expect(ContainerDataVerifications.featureIsSeenInUpdateEditorForDesigner('Section1', 'Feature1'));

        // Execute
        UpdateComponentActions.designerRemovesFeatureFromCurrentUpdateScope('Section1', 'Feature1');

        // Verify
        expect(ContainerDataVerifications.featureNotSeenInUpdateEditorForDesigner('Section1', 'Feature1'));

        // FEATURE ASPECT
        // Setup - Add Feature1 Actions to the scope
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        // Confirm that feature aspect is now included in editor data
        expect(ContainerDataVerifications.featureAspectIsSeenInUpdateEditorForDesigner('Feature1', 'Actions'));

        // Execute
        UpdateComponentActions.designerRemovesFeatureAspectFromCurrentUpdateScope('Feature1', 'Actions');

        // Verify
        expect(ContainerDataVerifications.featureAspectNotSeenInUpdateEditorForDesigner('Feature1', 'Actions'));

        // SCENARIO
        // Setup - Add Feature1 Actions Scenario1 to the scope
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');
        // Confirm that scenario is now included in editor data
        expect(ContainerDataVerifications.scenarioIsSeenInUpdateEditorForDesigner('Actions', 'Scenario1'));

        // Execute
        UpdateComponentActions.designerRemovesScenarioFromCurrentUpdateScope('Actions', 'Scenario1');

        // Verify
        expect(ContainerDataVerifications.scenarioNotSeenInUpdateEditorForDesigner('Actions', 'Scenario1'));
    })
});
