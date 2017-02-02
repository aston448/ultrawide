
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

describe('UC 554 - Restore Removed Design Update Component', function(){

    before(function(){

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
        TestFixtures.clearDesgnUpdates();

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
        UpdateComponentActions.designerLogicallyDeletesUpdateApplication('Application1');
 
        // Try to restore Section1
        UpdateComponentActions.designerRestoresDeletedUpdateSection('Application1', 'Section1');
        
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
        UpdateComponentActions.designerRestoresDeletedUpdateFeature('Section1', 'Feature1');

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
        UpdateComponentActions.designerRestoresDeletedUpdateFeatureAspect('Feature1', 'Actions');
        
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
        UpdateComponentActions.designerRestoresDeletedUpdateScenario('Actions', 'Scenario1');
        
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
    it('Restoring an existing Design Update Component updates it as no longer removed in the Design Update Scope');

    it('Restoring an existing Design Component updates it as no longer removed in other Design Updates for the current Design Version');

});
