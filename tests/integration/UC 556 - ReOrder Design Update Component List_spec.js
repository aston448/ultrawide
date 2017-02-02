
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

describe('UC 556 - ReOrder Design Update Component List', function(){

    before(function(){

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
    it('A new Application in the Design Update can be moved above another Application', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationCalled('Application2');
        // Verify Application2 is below Application1 and Application99
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.APPLICATION, 'NONE', 'Application1');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application99'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.APPLICATION, 'NONE', 'Application99');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application2'));

        // Execute Move App2 above App1
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.APPLICATION, 'NONE', 'Application2');
        UpdateComponentActions.designerReordersSelectedUpdateComponentToAbove(ComponentType.APPLICATION, 'NONE', 'Application1');

        // Verify order now: 2, 1, 99
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.APPLICATION, 'NONE', 'Application2');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application1'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.APPLICATION, 'NONE', 'Application1');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application99'));
    });

    it('A new Design Section in the Design Update can be moved above another Design Section', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section3');
         // Verify order is 1, 2, 3
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.DESIGN_SECTION, 'Application1', 'Section2');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section3'));

        // Execute - move 3 above 1
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.DESIGN_SECTION, 'Application1', 'Section3');
        UpdateComponentActions.designerReordersSelectedUpdateComponentToAbove(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');

        // Verify order now 3, 1, 2
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.DESIGN_SECTION, 'Application1', 'Section3');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
    });

    it('A new Feature in the Design Update can be moved above another Feature in its Design Section', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature3');

        // Verify order is 1, 444, 3
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature444'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature444');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature3'));

        // Execute - move 3 above 444
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature3');
        UpdateComponentActions.designerReordersSelectedUpdateComponentToAbove(ComponentType.FEATURE, 'Section1', 'Feature444');

        // Verify order now 1, 3, 444
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature3'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature3');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature444'));
    });

    it('A new Feature Aspect in the Design Update can be moved above another Feature Aspect in its Feature', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        UpdateComponentActions.designerAddsFeatureAspectTo_Feature_Called('Section1', 'Feature1', 'Aspect1');

        // Verify order is Interface, Actions, Conditions, Consequences, ExtraAspect, Aspect1
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Interface');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Consequences'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Consequences');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'ExtraAspect'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'ExtraAspect');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Aspect1'));

        // Execute - move Aspect1 above Actions
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Aspect1');
        UpdateComponentActions.designerReordersSelectedUpdateComponentToAbove(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');

        // Verify order now Interface, Aspect1, Actions, Conditions, Consequences, ExtraAspect
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Interface');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Aspect1'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Aspect1');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Consequences'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Consequences');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'ExtraAspect'));
    });

    it('A new Scenario in the Design Update can be moved above another Scenario in its Feature');

    it('A new Scenario in the Design Update can be moved above another Scenario in its Feature Aspect', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature1', 'Actions', 'Scenario99');

        // Verify order is Scenario1, Scenario444, Scenario99
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario444'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Actions', 'Scenario444');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario99'));

        // Execute - move 99 above 1
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Actions', 'Scenario99');
        UpdateComponentActions.designerReordersSelectedUpdateComponentToAbove(ComponentType.SCENARIO, 'Actions', 'Scenario1');

        // Verify order now 99, 1, 444
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Actions', 'Scenario99');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario444'));
    });


    // Conditions
    it('An existing Application from the Base Design Version cannot be reordered in a Design Update', function(){

        // Setup - verify that Application1 is above Application99
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.APPLICATION, 'NONE', 'Application1');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application99'));

        // Execute
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.APPLICATION, 'NONE', 'Application99');
        UpdateComponentActions.designerReordersSelectedUpdateComponentToAbove(ComponentType.APPLICATION, 'NONE', 'Application1');

        // Verify no change
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.APPLICATION, 'NONE', 'Application1');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.APPLICATION, 'NONE', 'Application99'));
    });

    it('An existing Design Section from the Base Design Version cannot be reordered in a Design Update', function(){

        // Setup - verify that Section1 is above Section2
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));

        // Execute
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.DESIGN_SECTION, 'Application1', 'Section2');
        UpdateComponentActions.designerReordersSelectedUpdateComponentToAbove(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');

        // Verify no change
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
    });

    it('An existing Feature from the Base Design Version cannot be reordered in a Design Update', function(){

        // Setup - verify that Feature1 is above Feature444
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature444'));

        // Execute
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature444');
        UpdateComponentActions.designerReordersSelectedUpdateComponentToAbove(ComponentType.FEATURE, 'Section1', 'Feature1');

        // Verify no change
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE, 'Section1', 'Feature444'));
    });

    it('An existing Feature Aspect from the Base Design Version cannot be reordered in a Design Update', function(){

        // Setup - verify that Actions is above Conditions
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        // Verify order is Interface, Actions, Conditions, Consequences, ExtraAspect
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Interface');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Consequences'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Consequences');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'ExtraAspect'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'ExtraAspect');

        // Execute
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions');
        UpdateComponentActions.designerReordersSelectedUpdateComponentToAbove(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');

        // Verify no change
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Interface');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'Consequences'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Consequences');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.FEATURE_ASPECT, 'Feature1', 'ExtraAspect'));
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'ExtraAspect');
    });

    it('An existing Scenario from the Base Design Version cannot be reordered in a Design Update', function(){

        // Setup - verify that Scenario1 is above Scenario444
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario444'));

        // Execute
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Actions', 'Scenario444');
        UpdateComponentActions.designerReordersSelectedUpdateComponentToAbove(ComponentType.SCENARIO, 'Actions', 'Scenario1');

        // Verify no change
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        expect(UpdateComponentVerifications.designerSelectedComponentIsAboveComponent_WithParent_Called_(ComponentType.SCENARIO, 'Actions', 'Scenario444'));
    });

});
