
import TestFixtures                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                from '../../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions         from '../../../test_framework/test_wrappers/design_version_actions.js';
import DesignUpdateActions          from '../../../test_framework/test_wrappers/design_update_actions.js';
import DesignComponentActions       from '../../../test_framework/test_wrappers/design_component_actions.js';
import UpdateComponentActions       from '../../../test_framework/test_wrappers/design_update_component_actions.js';
import DesignVerifications          from '../../../test_framework/test_wrappers/design_verifications.js';
import DesignUpdateVerifications    from '../../../test_framework/test_wrappers/design_update_verifications.js';
import DesignVersionVerifications   from '../../../test_framework/test_wrappers/design_version_verifications.js';
import DesignComponentVerifications from '../../../test_framework/test_wrappers/design_component_verifications.js';
import UserContextVerifications     from '../../../test_framework/test_wrappers/user_context_verifications.js';
import WorkPackageActions           from '../../../test_framework/test_wrappers/work_package_actions.js';
import WorkPackageVerifications     from '../../../test_framework/test_wrappers/work_package_verifications.js';
import WpComponentActions           from '../../../test_framework/test_wrappers/work_package_component_actions.js';
import WpComponentVerifications     from '../../../test_framework/test_wrappers/work_package_component_verifications.js';
import UpdateComponentVerifications from '../../../test_framework/test_wrappers/design_update_component_verifications.js';

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, UpdateMergeStatus, WorkPackageStatus} from '../../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../../imports/constants/default_names.js';
import {DesignUpdateComponentValidationErrors} from '../../../imports/constants/validation_errors.js';

describe('UC 554 - Restore Removed Design Update Component', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 554 - Restore Removed Design Update Component');
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
    it('A removed existing Application and all its child Design Components can be restored', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        UpdateComponentActions.designerLogicallyDeletesUpdateApplication('Application1');
        
        // Verify - all stuff removed
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Execute
        UpdateComponentActions.designerRestoresDeletedUpdateApplication('Application1');

        // Verify
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('A removed existing Design Section and all its child Design Components can be restored', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section1');
        UpdateComponentActions.designerLogicallyDeletesUpdateSection('Application1', 'Section1');

        // Verify - all stuff removed for Section
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Execute
        UpdateComponentActions.designerRestoresDeletedUpdateSection('Application1', 'Section1');

        // Verify
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('A removed existing Feature and all its child Design Components can be restored', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        UpdateComponentActions.designerLogicallyDeletesUpdateFeature('Section1', 'Feature1');

        // Verify - all stuff removed for Feature
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Execute
        UpdateComponentActions.designerRestoresDeletedUpdateFeature('Section1', 'Feature1');

        // Verify
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('A removed existing Feature Aspect and all its child Design Components can be restored', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerLogicallyDeletesUpdateFeatureAspect('Feature1', 'Actions');
        
        // Verify - all stuff removed for Aspect
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Execute
        UpdateComponentActions.designerRestoresDeletedUpdateFeatureAspect('Feature1', 'Actions');
 
        // Verify
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('A removed existing Scenario can be restored', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');
        UpdateComponentActions.designerLogicallyDeletesUpdateScenario('Actions', 'Scenario1');
        
        // Verify - all stuff removed for Scenario
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Execute
        UpdateComponentActions.designerRestoresDeletedUpdateScenario('Actions', 'Scenario1');

        // Verify
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });


    // Conditions

    it('A Design Update Component that is the child of a removed Design Update Component cannot be restored', function(){

        // Setup - remove everything
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        UpdateComponentActions.designerLogicallyDeletesUpdateApplication('Application1');
 
        // Try to restore Section1
        let expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_RESTORABLE_PARENT};
        UpdateComponentActions.designerRestoresDeletedUpdateSection('Application1', 'Section1', expectation);
        
        // Everything still removed
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Try to restore Feature 1
        UpdateComponentActions.designerRestoresDeletedUpdateFeature('Section1', 'Feature1', expectation);

        // Everything still removed
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Try to restore Feature1 Actions
        UpdateComponentActions.designerRestoresDeletedUpdateFeatureAspect('Feature1', 'Actions', expectation);
        
        // Everything still removed
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Try to restore Scenario1
        UpdateComponentActions.designerRestoresDeletedUpdateScenario('Actions', 'Scenario1', expectation);
        
        // Everything still removed
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

    });


    // Consequences
    it('Restoring an existing Design Update Component removes it from the Design Update Scope', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        UpdateComponentActions.designerLogicallyDeletesUpdateApplication('Application1');

        // Check
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Execute
        UpdateComponentActions.designerRestoresDeletedUpdateApplication('Application1');

        // Verify
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('Restoring an existing Design Update Component updates it as no longer removed in the Design Update Scope', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        UpdateComponentActions.designerLogicallyDeletesUpdateApplication('Application1');

        // Verify - all stuff removed
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Execute
        UpdateComponentActions.designerRestoresDeletedUpdateApplication('Application1');

        // Verify
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));
    });

    it('Restoring an existing Design Component updates it as no longer removed in other Design Updates for the current Design Version', function(){

        // Setup Add a second Design Update...
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');

        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');  // Make sure published so data is shared
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        UpdateComponentActions.designerLogicallyDeletesUpdateApplication('Application1');

        // Verify - all stuff removed elsewhere in DU2
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        expect(UpdateComponentVerifications.componentIsRemovedElsewhereForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsRemovedElsewhereForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsRemovedElsewhereForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsRemovedElsewhereForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedElsewhereForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsRemovedElsewhereForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedElsewhereForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsRemovedElsewhereForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsRemovedElsewhereForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsRemovedElsewhereForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsRemovedElsewhereForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsRemovedElsewhereForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsRemovedElsewhereForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

        // Execute - Restore in DU1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerRestoresDeletedUpdateApplication('Application1');

        // Verify - no longer removed elsewhere in DU2
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        expect(UpdateComponentVerifications.componentIsNotRemovedElsewhereForDesigner(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedElsewhereForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedElsewhereForDesigner(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedElsewhereForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedElsewhereForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsNotRemovedElsewhereForDesigner(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedElsewhereForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedElsewhereForDesigner(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedElsewhereForDesigner(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotRemovedElsewhereForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedElsewhereForDesigner(ComponentType.SCENARIO, 'Actions', 'Scenario3'));
        expect(UpdateComponentVerifications.componentIsNotRemovedElsewhereForDesigner(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsNotRemovedElsewhereForDesigner(ComponentType.SCENARIO, 'Conditions', 'Scenario4'));

    });

    it('Restoring an existing Design Component updates it as no longer removed in any Work Packages that include the Design Update Component', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        UpdateComponentActions.designerLogicallyDeletesUpdateApplication('Application1');
        // Publish so WP can be added
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');

        // Manager add a WP
        DesignActions.managerSelectsDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('WorkPackage1');
        WorkPackageActions.managerEditsUpdateWorkPackage('WorkPackage1');
        WpComponentActions.managerAddsApplicationToScopeForCurrentWp('Application1');

        // Check
        expect(WpComponentVerifications.componentIsRemovedForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsRemovedForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsRemovedForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsRemovedForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsRemovedForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));

        // Execute - Restore in DU1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerRestoresDeletedUpdateApplication('Application1');

        // Verify - nothing in scope for WP any more as nothing in scope for update
        WorkPackageActions.managerSelectsWorkPackage('WorkPackage1');
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(WpComponentVerifications.componentIsNotInScopeForManagerCurrentWp(ComponentType.SCENARIO, 'Actions', 'Scenario1'));

    });

    it('When a removed component is restored in a Design Update to be included in the current Design Version it reverts to a base item in the Design Version', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        UpdateComponentActions.designerLogicallyDeletesUpdateApplication('Application1');
        // Publish so merges to current working Design Version
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');

        // Check
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

        // Execute
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerRestoresDeletedUpdateApplication('Application1');

        // Verify
        DesignComponentActions.designerSelectsApplication('Application1');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_BASE));
        DesignComponentActions.designerSelectsDesignSection('Application1', 'Section1');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_BASE));
        DesignComponentActions.designerSelectsFeature('Section1', 'Feature1');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_BASE));
        DesignComponentActions.designerSelectsFeatureAspect('Feature1', 'Actions');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_BASE));
        DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario1');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_BASE));
    })
});
