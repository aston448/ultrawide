
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
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2')

        // Add a new Design Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdate();
        DesignUpdateActions.designerSelectsUpdate(DefaultItemNames.NEW_DESIGN_UPDATE_NAME);
        DesignUpdateActions.designerEditsSelectedUpdateNameTo('DesignUpdate1');
    });

    afterEach(function(){

    });


    // Actions
    it('An existing Application can be removed from Design Update Scope', function(){

        // Setup - add Application1 to scope
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));

        // Execute
        UpdateComponentActions.designerRemovesApplicationFromCurrentUpdateScope('Application1');

        // Verify
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));
    });

    it('An existing Design Section can be removed from Design Update Scope', function(){

        // Setup - add Section1 to scope
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section1');
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));

        // Execute
        UpdateComponentActions.designerRemovesDesignSectionFromCurrentUpdateScope('Application1', 'Section1');

        // Verify
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
    });

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
    it('An existing component cannot be removed from Design Update Scope if new child components have been added to it', function(){

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

    it('An existing component cannot be removed from Design Update Scope if child components have been removed from it', function(){

        // Setup - remove a Scenario from Feature1 Actions
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');
        UpdateComponentActions.designerLogicallyDeletesUpdateScenario('Actions', 'Scenario1');

        // Execute - try to descope Feature1
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_UNSCOPABLE_NEW_CHILDREN};
        UpdateComponentActions.designerRemovesFeatureFromCurrentUpdateScope('Section1', 'Feature1', expectation);

        // Verify still in scope
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
    });

    it('An existing component that has been removed cannot be removed from the Design Update Scope', function(){

        // Setup - remove a Scenario from Feature1 Actions
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');
        UpdateComponentActions.designerLogicallyDeletesUpdateScenario('Actions', 'Scenario1');

        // Execute - try to descope Scenario1
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_UNSCOPABLE_REMOVED};
        UpdateComponentActions.designerRemovesScenarioFromCurrentUpdateScope('Actions', 'Scenario1', expectation);

        // Verify still in scope
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
    });

    it('An existing component cannot be removed from Design Update Scope if it has been modified', function(){

        // Setup - modify a Scenario in Feature1 Actions
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('NewScenario');

        // Execute - try to descope New Scenario
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_UNSCOPABLE_CHANGED};
        UpdateComponentActions.designerRemovesScenarioFromCurrentUpdateScope('Actions', 'NewScenario', expectation);

        // Verify still in scope
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'NewScenario'));
    });

    // Consequences
    it('When a scopable Design Component is removed from Design Update Scope it disappears from the Design Update editor', function(){

        // FEATURE
        // Setup - Add Feature1 to the scope
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        // Confirm that feature is now included in editor data
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(ContainerDataVerifications.featureIsSeenInUpdateEditorForDesigner('Application1', 'Section1', 'Feature1'));

        // Execute
        UpdateComponentActions.designerRemovesFeatureFromCurrentUpdateScope('Section1', 'Feature1');

        // Verify
        expect(ContainerDataVerifications.featureNotSeenInUpdateEditorForDesigner('Application1', 'Section1', 'Feature1'));

        // FEATURE ASPECT
        // Setup - Add Feature1 Actions to the scope
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        // Confirm that feature aspect is now included in editor data
        expect(ContainerDataVerifications.featureAspectIsSeenInUpdateEditorForDesigner('Section1', 'Feature1', 'Actions'));

        // Execute
        UpdateComponentActions.designerRemovesFeatureAspectFromCurrentUpdateScope('Feature1', 'Actions');

        // Verify
        expect(ContainerDataVerifications.featureAspectNotSeenInUpdateEditorForDesigner('Section1', 'Feature1', 'Actions'));

        // SCENARIO
        // Setup - Add Feature1 Actions Scenario1 to the scope
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');
        // Confirm that scenario is now included in editor data
        expect(ContainerDataVerifications.scenarioIsSeenInUpdateEditorForDesigner('Feature1', 'Actions', 'Scenario1'));

        // Execute
        UpdateComponentActions.designerRemovesScenarioFromCurrentUpdateScope('Actions', 'Scenario1');

        // Verify
        expect(ContainerDataVerifications.scenarioNotSeenInUpdateEditorForDesigner('Feature1', 'Actions', 'Scenario1'));
    });

    it('When a scopable Design Component is removed from Design Update any scopable parents it has that are not themselves in scope also disappear from the Design Update editor', function(){

        // Setup - add Scenario1 to scope...
        // Setup - Add Feature1 Actions Scenario1 to the scope
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');
        // Confirm that scenario is now included in editor data
        expect(ContainerDataVerifications.scenarioIsSeenInUpdateEditorForDesigner('Feature1', 'Actions', 'Scenario1'));
        // And Aspect Actions
        expect(ContainerDataVerifications.featureAspectIsSeenInUpdateEditorForDesigner('Section1', 'Feature1', 'Actions'));
        // And Feature1
        expect(ContainerDataVerifications.featureIsSeenInUpdateEditorForDesigner('Application1', 'Section1', 'Feature1'));

        // Execute - remove Scenario1 from scope
        UpdateComponentActions.designerRemovesScenarioFromCurrentUpdateScope('Actions', 'Scenario1');

        // Verify - all 3 components gone
        expect(ContainerDataVerifications.featureNotSeenInUpdateEditorForDesigner('Application1', 'Section1', 'Feature1'));
        expect(ContainerDataVerifications.featureAspectNotSeenInUpdateEditorForDesigner('Section1', 'Feature1', 'Actions'));
        expect(ContainerDataVerifications.scenarioNotSeenInUpdateEditorForDesigner('Feature1', 'Actions', 'Scenario1'));
    });

    it('Non scopable Design Components always remain in the Design Update editor even when scopable children are removed', function() {

        // Setup - Add Feature1 to the scope
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        // Confirm Section1 is seen as well
        expect(ContainerDataVerifications.featureIsSeenInUpdateEditorForDesigner('Application1', 'Section1', 'Feature1'));
        expect(ContainerDataVerifications.designSectionIsSeenInUpdateEditorForDesigner('Application1', 'Section1'));

        // Execute
        UpdateComponentActions.designerRemovesFeatureFromCurrentUpdateScope('Section1', 'Feature1');

        // Verify - feature gone but section remains
        expect(ContainerDataVerifications.featureNotSeenInUpdateEditorForDesigner('Application1', 'Section1', 'Feature1'));
        expect(ContainerDataVerifications.designSectionIsSeenInUpdateEditorForDesigner('Application1', 'Section1'));

    });
});
