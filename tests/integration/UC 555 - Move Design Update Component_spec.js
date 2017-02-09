
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

describe('UC 555 - Move Design Update Component', function(){

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
        TestFixtures.clearDesignUpdates();

        // Add a new Design Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdate();
        DesignUpdateActions.designerSelectsUpdate(DefaultItemNames.NEW_DESIGN_UPDATE_NAME);
        DesignUpdateActions.designerEditsSelectedUpdateNameTo('DesignUpdate1');

        // Create some new data in the Design Update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        // App 2
        UpdateComponentActions.designerAddsApplicationCalled('Application2');
 
    });

    afterEach(function(){

    });


    // Actions
    it('A new Design Section for a Design Update can be moved to a different Application', function(){

        // Setup - add new Design section to Application1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section3');

        // Execute - move it to Application2
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.DESIGN_SECTION, 'Application1', 'Section3');
        UpdateComponentActions.designerMovesSelectedUpdateComponentTo(ComponentType.APPLICATION, 'NONE', 'Application2');

        // Verify parent now Application2
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application2', 'Section3'));
    });

    it('A new Design Section for a Design Update can be moved to a different Design Section', function(){

        // Setup - add new Design section to Section1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsDesignSectionTo_Section_Called('Application1', 'Section1', 'SubSection2');
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection2'));

        // Execute - move it to Section2
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection2');
        UpdateComponentActions.designerMovesSelectedUpdateComponentTo(ComponentType.DESIGN_SECTION, 'Application1', 'Section2');

        // Verify parent now Section2
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Section2', 'SubSection2'));
    });

    it('A new Feature for a Design Update can be moved to a different Design Section', function(){

        // Setup - add new Feature to Section1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature3');

        // Execute - move it to Section2
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature3');
        UpdateComponentActions.designerMovesSelectedUpdateComponentTo(ComponentType.DESIGN_SECTION, 'Application1', 'Section2');

        // Verify parent now Section2
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section2', 'Feature3'));
    });

    it('A new Scenario for a Design Update can be moved to a different in Scope Feature');

    it('A new Scenario for a Design Update can be moved to a different in Scope Feature Aspect', function(){

        // Setup - add new Scenario to Feature1 Actions
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature1', 'Actions', 'Scenario99');

        // Make sure the target is in scope
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature2', 'Conditions');

        // Execute - move it to Feature2 Conditions
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Actions', 'Scenario99');
        UpdateComponentActions.designerMovesSelectedUpdateComponentTo(ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions');

        // Verify parent now Feature2 Conditions
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario99'));

    });

    it('A new Feature Aspect for a Design Update can be moved to a different in Scope Feature');


    // Conditions
    it('An existing Design Section from the Base Design Version cannot be moved', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Execute - Try to move existing Section1 to Application2
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_COMPONENT_MOVE};
        UpdateComponentActions.designerMovesSelectedUpdateComponentTo(ComponentType.APPLICATION, 'NONE', 'Application2', expectation);

        // Verify parent still Application1
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
    });

    it('An existing Feature from the Base Design Version cannot be moved', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Execute - Try to move existing Feature1 to Section2
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_COMPONENT_MOVE};
        UpdateComponentActions.designerMovesSelectedUpdateComponentTo(ComponentType.DESIGN_SECTION, 'Application1', 'Section2', expectation);

        // Verify parent still Section1
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
    });

    it('An existing Feature Aspect from the Base Design Version cannot be moved', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Make sure the target is in scope
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section2', 'Feature2');

        // Execute - Try to move existing Feature1 ExtraAspect to Feature2
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'ExtraAspect');
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_COMPONENT_MOVE};
        UpdateComponentActions.designerMovesSelectedUpdateComponentTo(ComponentType.FEATURE, 'Section2', 'Feature2', expectation);

        // Verify parent still Feature1
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'ExtraAspect'));
    });

    it('An existing Scenario from the Base Design Version cannot be moved', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        // Make sure the target is in scope
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Conditions');

        // Execute - Try to move existing Scenario1 to Feature1 Conditions
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_COMPONENT_MOVE};
        UpdateComponentActions.designerMovesSelectedUpdateComponentTo(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', expectation);

        // Verify parent still Actions
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
    });

    // Consequences
    it('When a new Design Update Component is moved it is also moved in any Work Package based on the Design Update', function(){

        // Setup - Add some new Sections to DU1...
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section3');
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section4');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section3', 'Feature8');
        // Add a WP and add Sections to WP scope
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('UpdateWorkPackage1');
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage1');
        WpComponentActions.managerAddsDesignSectionToScopeForCurrentUpdateWp('Application1', 'Section3');
        WpComponentActions.managerAddsDesignSectionToScopeForCurrentUpdateWp('Application1', 'Section4');
        // Feature8 is in Section3
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.FEATURE, 'Section3', 'Feature8'));

        // Execute - move Feature8 to Section4
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section3', 'Feature8');
        UpdateComponentActions.designerMovesSelectedUpdateComponentTo(ComponentType.DESIGN_SECTION, 'Application1', 'Section4');

        // Verify
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage1');
        // Feature8 is in Section4
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.FEATURE, 'Section4', 'Feature8'));
    });

});
