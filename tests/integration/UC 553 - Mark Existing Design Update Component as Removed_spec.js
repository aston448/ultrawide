
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

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, UpdateMergeStatus, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';
import {DesignUpdateComponentValidationErrors} from '../../imports/constants/validation_errors.js';

describe('UC 553 - Mark Existing Design Update Component as Removed', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 553 - Mark Existing Design Update Component as Removed');


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
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
    });

    afterEach(function(){

    });


    // Actions
    it('An existing Application and all Design Components below it can be removed in a Design Update', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Execute
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        UpdateComponentActions.designerLogicallyDeletesUpdateApplication('Application1');

        // Verify - everything in the design update under Application1 should be in scope or parent scope and removed
        // Application1
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        // Section1
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        // Feature1
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        // Feature1 Actions
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        // Scenario1
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        // Feature1 Conditions
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        // Scenario2
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        // Section2
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        // Feature2
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        // Feature2 Actions
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        // Scenario3
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // But Application99 unaffected
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application99'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application99'));

    });

    it('An existing Design Section and all Design Components below it can be removed in a Design Update', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Execute
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section1');
        UpdateComponentActions.designerLogicallyDeletesUpdateSection('Application1', 'Section1');

        // Verify - everything in the design update below Section1 should be in scope or parent scope and removed

        // Application1 is not removed but in parent scope
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));

        // Section1 and all below it are removed and in scope
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        // Feature1
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        // Feature1 Actions
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        // Scenario1
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        // Feature1 Conditions
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        // Scenario2
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));

        // Section2 and all below it are not removed and not in scope
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        // Feature2
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        // Feature2 Actions
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        // Scenario3
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('An existing Feature and all Design Components below it can be removed in a Design Update', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Execute
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        UpdateComponentActions.designerLogicallyDeletesUpdateFeature('Section1', 'Feature1');

        // Verify - everything in the design update below Feature1 should be in scope or parent scope and removed

        // Application1 is not removed but in parent scope
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));

        // Section1 is not removed but in parent scope
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));

        // Feature1 and all below it is in scope and removed
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        // Feature1 Actions
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        // Scenario1
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        // Feature1 Conditions
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        // Scenario2
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));

        // Section2 and all below it are not removed and not in scope
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        // Feature2
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        // Feature2 Actions
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        // Scenario3
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('An existing Feature Aspect and all Design Components below it can be removed in a Design Update', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Execute
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerLogicallyDeletesUpdateFeatureAspect('Feature1', 'Actions');

        // Verify - everything in the design update below Feature1 Actions should be in scope or parent scope and removed

        // Application1 is not removed but in parent scope
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));

        // Section1 is not removed but in parent scope
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));

        // Feature1 is not removed but in parent scope
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));

        // Feature1 Actions is removed and scenarios below it
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        // Scenario1
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));

        // Feature1 Conditions is not removed
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        // Scenario2
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));

        // Section2 and all below it are not removed and not in scope
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        // Feature2
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        // Feature2 Actions
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        // Scenario3
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('An existing Scenario can be removed in a Design Update', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Execute
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');
        UpdateComponentActions.designerLogicallyDeletesUpdateScenario('Actions', 'Scenario1');

        // Verify - only Scenario1 is in scope and removed

        // Application1 is not removed and in parent scope
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));

        // Section1 is not removed and in parent scope
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));

        // Feature1 is not removed and in parent scope
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));

        // Feature1 Actions is not removed and in parent scope
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));

        // Scenario1 is removed and in scope
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));

        // Feature1 Conditions is not removed
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        // Scenario2
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));

        // Section2 and all below it are not removed and not in scope
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        // Feature2
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        // Feature2 Actions
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        // Scenario3
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });


    // Conditions

    it('An existing Design Update Component cannot be removed if any new Design Update Components have been added inside it in the current Design Update', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        // Add a new Scenario to Feature1 Actions
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateFeatureAspect('Feature1', 'Actions');

        // Execute - Try to remove the whole Application
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_DELETABLE_NEW};
        UpdateComponentActions.designerLogicallyDeletesUpdateApplication('Application1', expectation);

        // Verify - nothing existing is removed - stuff could be in scope

        // Application1
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        // Section1
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        // Feature1
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        // Feature1 Actions
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        // Scenario1
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        // Feature1 Conditions
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        // Scenario2
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        // Section2
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        // Feature2
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        // Feature2 Actions
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        // Scenario3
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Except the new Scenario which is in scope
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', DefaultComponentNames.NEW_SCENARIO_NAME));
    });

    it('An existing Design Update Component cannot be removed if any new Design Update Components have been added inside it in another Design Update', function(){

        // Setup - Add a second Design Update...
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdate();
        DesignUpdateActions.designerSelectsUpdate(DefaultItemNames.NEW_DESIGN_UPDATE_NAME);
        DesignUpdateActions.designerEditsSelectedUpdateNameTo('DesignUpdate2');

        // Add a new Scenario to Feature1 Actions in DesignUpdate2
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateFeatureAspect('Feature1', 'Actions');
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', DefaultComponentNames.NEW_SCENARIO_NAME));

        // Execute - Try to remove the whole Application from DesignUpdate1
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_DELETABLE_NEW};
        UpdateComponentActions.designerLogicallyDeletesUpdateApplication('Application1', expectation);

        // Verify - nothing existing is removed

        // Application1
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        // Section1
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        // Feature1
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        // Feature1 Actions
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        // Scenario1
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        // Feature1 Conditions
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        // Scenario2
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        // Section2
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        // Feature2
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        // Feature2 Actions
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        // Scenario3
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // And the new Scenario is still in scope for DesignUpdate2
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', DefaultComponentNames.NEW_SCENARIO_NAME));
    });

    it('An existing Design Update Component cannot be removed if any Design Update Components inside it are in Scope in another Design Update', function(){

        // Setup Add a second Design Update...
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdate();
        DesignUpdateActions.designerSelectsUpdate(DefaultItemNames.NEW_DESIGN_UPDATE_NAME);
        DesignUpdateActions.designerEditsSelectedUpdateNameTo('DesignUpdate2');

        // Add Scenario1 to the Scope of DesignUpdate2
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));

        // Execute - Try to remove the whole Application from DesignUpdate1
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_DELETABLE_SCOPE};
        UpdateComponentActions.designerLogicallyDeletesUpdateApplication('Application1', expectation);
        
        // Verify - nothing existing is removed or in scope

        // Application1
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        // Section1
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        // Feature1
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        // Feature1 Actions
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        // Scenario1
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        // Feature1 Conditions
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        // Scenario2
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        // Section2
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        // Feature2
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        // Feature2 Actions
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        // Scenario3
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });


    // Consequences
    it('Removing an existing Design Update Component sets it and all of its children as removed in the Design Update Scope', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Execute
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        UpdateComponentActions.designerLogicallyDeletesUpdateApplication('Application1');

        // Verify - everything in the design update under Application1 should be in scope and removed
        // Application1
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        // Section1
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        // Feature1
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        // Feature1 Actions
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        // Scenario1
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        // Feature1 Conditions
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        // Scenario2
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        // Section2
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        // Feature2
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        // Feature2 Actions
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        // Scenario3
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // But Application99 unaffected
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application99'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application99'));
    });

    it('Removing an existing Design Update Component updates it as removed in other Design Updates for the current Design Version', function(){

        // Setup Add a second Design Update...
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');

        // Execute - remove Feature1 from DesignUpdate1
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        UpdateComponentActions.designerLogicallyDeletesUpdateFeature('Section1', 'Feature1');

        // Feature1 and all below it is in scope and removed
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        // Feature1 Actions
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        // Scenario1
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        // Feature1 Conditions
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        // Scenario2
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));

        // And in DesignUpdate2 same stuff is removed elsewhere but not in scope
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');

        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsRemovedElsewhereForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        // Feature1 Actions
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedElsewhereForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        // Scenario1
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsRemovedElsewhereForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        // Feature1 Conditions
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedElsewhereForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        // Scenario2
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsRemovedElsewhereForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));

    });

    it('Removing an existing Design Update Component sets it and any children as in Scope for the Design Update where it is removed', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Execute
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        UpdateComponentActions.designerLogicallyDeletesUpdateApplication('Application1');

        // Verify - everything in the design update under Application1 should be in scope or parent scope and removed
        // Application1
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        // Section1
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        // Feature1
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        // Feature1 Actions
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        // Scenario1
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        // Feature1 Conditions
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        // Scenario2
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        // Section2
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        // Feature2
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        // Feature2 Actions
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        // Scenario3
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        // Feature2 Conditions
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        // Scenario4
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // But Application99 unaffected
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application99'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application99'));
    });

    it('Removing an existing Design Update Component updates it as removed in any Work Packages that include the Design Update Component', function(){

        // Setup - add Update WP that includes Application1
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');

        DesignActions.managerSelectsDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('WorkPackage1');
        WorkPackageActions.managerEditsUpdateWorkPackage('WorkPackage1');
        WpComponentActions.managerAddsApplicationToScopeForCurrentWp('Application1');

        // Check - Only scoped Update Item is there
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsNotRemovedForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));

        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));


        // Remove the App in the update.  This brings stuff below into scope
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerLogicallyDeletesUpdateApplication('Application1');

        // Verify - WP now contains all the removed items
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsRemovedForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsRemovedForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsRemovedForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsRemovedForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(WpComponentVerifications.componentIsRemovedForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
    });

    it('When an existing component is removed in a Design Update to be included in the current Design Version it becomes visible as a removed item in the Design Version', function(){
        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Execute
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        UpdateComponentActions.designerLogicallyDeletesUpdateApplication('Application1');

        // Verify everything below the App is shown as removed in the DV
        DesignComponentActions.designerSelectsApplication('Application1');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_REMOVED));
        DesignComponentActions.designerSelectsDesignSection('Application1', 'Section1');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_REMOVED));
        DesignComponentActions.designerSelectsFeature('Section1', 'Feature1');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_REMOVED));
        DesignComponentActions.designerSelectsFeatureAspect('Feature1', 'Actions');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_REMOVED));
        DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_REMOVED));

        // Stuff not below not removed
        DesignComponentActions.designerSelectsApplication('Application88');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_BASE));
        DesignComponentActions.designerSelectsApplication('Application99');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_BASE));
    })
});
