
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

describe('UC 552 - Edit Design Update Component Name', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 552 - Edit Design Update Component Name');
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
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');
    });

    afterEach(function(){

    });


    // Actions
    it('A Design Update Component name can be edited and saved', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        // Add new Feature to original Section 1
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateSection('Application1', 'Section1');
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', DefaultComponentNames.NEW_FEATURE_NAME));

        // Execute
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', DefaultComponentNames.NEW_FEATURE_NAME);
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('Feature3');

        // Verify
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature3'));
    });


    // Conditions

    it('An Application name may not be changed to the same name as another Application in the Design Update or Base Design Version', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        // Add Application
        UpdateComponentActions.designerAddsApplicationToCurrentUpdate();

        // Try to call it Application1
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.APPLICATION, 'NONE', DefaultComponentNames.NEW_APPLICATION_NAME);
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_NAME_DUPLICATE};
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('Application1', expectation);

        // Verify - still default name
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 1));
    });

    it('An Application name may not be changed to the same name as another Application added in another Design Update for the Design Version', function(){

        // Setup
        // Add another Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');
        // Add an application to it
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        UpdateComponentActions.designerAddsApplicationCalled('New Application');
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.APPLICATION, 'New Application', 1));

        // Meanwhile in Update1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.APPLICATION, 'NONE', 'Application1');

        // Execute - try to rename as 'New Application'
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_NAME_DUPLICATE};
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('New Application', expectation);

        // Verify not changed
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.APPLICATION, 'New Application', 0));
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.APPLICATION, 'Application1', 1));
    });

    it('A Feature name may not be changed to the same name as another Feature in the Design Update or Base Design Version', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        // Add Feature
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateSection('Application1', 'Section1');
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 1));

        // Try to call it Feature1
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', DefaultComponentNames.NEW_FEATURE_NAME);
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_NAME_DUPLICATE};
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('Feature1', expectation);

        // Verify - still default
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 1));
    });

    it('A Feature name may not be changed to the same name as another Feature added in another Design Update for the Design Version', function(){

        // Setup
        // Add another Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');
        // Add new feature
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section2');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section2', 'New Feature');
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.FEATURE, 'New Feature', 1));

        // Meanwhile in Update1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature1');

        // Execute - try to rename as 'New Feature'
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_NAME_DUPLICATE};
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('New Feature', expectation);

        // Verify not changed
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.FEATURE, 'New Feature', 0));
    });

    it('A Scenario name may not be changed to the same name as another Scenario in the Design Update or Base Design Version', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        // Add Scenario
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Interface');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateFeatureAspect('Feature1', 'Interface');
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 1));

        // Try to call it Scenario1
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Interface', DefaultComponentNames.NEW_SCENARIO_NAME);
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_NAME_DUPLICATE};
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('Scenario1', expectation);

        // Verify - still default
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 1));
    });

    it('A Scenario name may not be changed to the same name as another Scenario added in another Design Update for the Design Version', function() {

        // Setup
        // Add another Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');
        // Add new scenario
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature1', 'Actions', 'New Scenario');
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.SCENARIO, 'New Scenario', 1));

        // Meanwhile in Update1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Actions', 'Scenario1');

        // Execute - try to rename as 'New Scenario'
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_NAME_DUPLICATE};
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('New Scenario', expectation);

        // Verify not changed
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.SCENARIO, 'New Scenario', 0));
    });

    it('A Design Section name may not be changed to the same name as another Design Section under the same parent section in the Design Update', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        // Add Design Section
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateApplication('Application1');
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 1));

        // Try to call it Section1
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.DESIGN_SECTION, 'Application1', DefaultComponentNames.NEW_DESIGN_SECTION_NAME);
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_NAME_DUPLICATE_FOR_PARENT};
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('Section1', expectation);

        // Verify - still default name
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 1));
    });

    it('A Design Section name may not be changed to the same name as another Design Section added under the same parent section in another Design Update for the Design Version', function(){

        // Setup
        // Add another Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');
        // Add new scenario
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section1');
        UpdateComponentActions.designerAddsDesignSectionTo_Section_Called('Application1', 'Section1', 'New Section');

        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.DESIGN_SECTION, 'New Section', 1));

        // Meanwhile in Update1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Section1', 'SubSection1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection1');

        // Execute - try to rename as 'New Section'
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_NAME_DUPLICATE_FOR_PARENT};
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('New Section', expectation);

        // Verify not changed
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.DESIGN_SECTION, 'New Section', 0));
    });

    it('A Feature Aspect name may not be changed to the same name as another Feature Aspect in the same Feature in the Design Update', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        // Add Feature Aspect
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateFeature('Section1', 'Feature1');
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 1));

        // Try to call it Actions
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_NAME_DUPLICATE_FOR_PARENT};
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('Actions', expectation);

        // Verify - still default
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 1));
    });

    it('A Feature Aspect name may not be changed to the same name as another Feature Aspect added in the same Feature in another Design Update for the Design Version', function(){

        // Setup
        // Add another Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');
        // Add new scenario
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        UpdateComponentActions.designerAddsFeatureAspectTo_Feature_Called('Section1', 'Feature1', 'New Aspect');
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.FEATURE_ASPECT, 'New Aspect', 1));

        // Meanwhile in Update1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions');

        // Execute - try to rename as 'New Aspect'
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_NAME_DUPLICATE_FOR_PARENT};
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('New Aspect', expectation);

        // Verify not changed
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.FEATURE_ASPECT, 'New Aspect', 0));
    });

    it('A Design Section name may be changed to the same name as a Design Section in a different parent in the Design Update', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Execute - add a new Section1 under Application99
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application99');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateApplication('Application99');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.DESIGN_SECTION, 'Application99', DefaultComponentNames.NEW_DESIGN_SECTION_NAME);
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('Section1');

        // Verify - new Section 1
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.DESIGN_SECTION, 'Section1', 1));
    });

    it('A Feature Aspect name may be changed to the same name as a Feature Aspect in another Feature in the Design Update', function(){

        // Setup - Feature1 has Aspect ExtraAspect already
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Add New Feature Aspect to Feature2
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section2', 'Feature2');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateFeature('Section2', 'Feature2');

        // Execute - call new Aspect ExtraAspect
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE_ASPECT, 'Feature2', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('ExtraAspect');

        // Verify - new Extra Aspect
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.FEATURE_ASPECT, 'ExtraAspect', 1));
    });

    it('An update Scenario name may not be part of an existing Scenario name in the Design Update or Base Design Version', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        // Add Scenario
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Interface');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateFeatureAspect('Feature1', 'Interface');
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 1));

        // Try to call it Scenar
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Interface', DefaultComponentNames.NEW_SCENARIO_NAME);
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_NAME_SUBSET};
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('Scenar', expectation);

        // Verify - still default
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 1));
    });

    it('An update Scenario name may not include an existing Scenario name in the Design Update or Base Design Version', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        // Add Scenario
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Interface');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateFeatureAspect('Feature1', 'Interface');
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 1));

        // Try to call it Scenario1 Extra
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Interface', DefaultComponentNames.NEW_SCENARIO_NAME);
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_INVALID_NAME_SUPERSET};
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('Scenario1 Extra', expectation);

        // Verify - still default
        expect(UpdateComponentVerifications.countOf_ComponentsCalled_InDesignerCurrentUpdateIs_(ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 1));
    });


    // Consequences
    it('Updating the name of a Design Update Component updates it in any Work Package that includes the Design Update Component', function(){

        // Setup - put Feature1 in scope of DU1
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');

        // Create a WP based on DU1
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('UpdateWorkPackage1');
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage1');
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));

        // Execute - Designer now updates Feature1 name in DU1
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('Feature100');

        // Verify - WP has Feature100 but not Feature1 any more
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage1');
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature100'));
        expect(WpComponentVerifications.componentIsNotAvailableForManagerCurrentWp(ComponentType.FEATURE, 'Section1', 'Feature1'));
    });

    it('When a Base Design Version component name is edited in a Design update both the original and new names are stored for the Design Update', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Execute
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('Feature100');

        // Verify
        expect(UpdateComponentVerifications.designerSelectedComponentOldNameIs('Feature1'));
        expect(UpdateComponentVerifications.designerSelectedComponentNewNameIs('Feature100'));
        expect(UpdateComponentVerifications.componentIsChangedForDesigner(ComponentType.FEATURE, 'Section1', 'Feature100'));

    });

    it('A change to a Feature or Scenario name appears as a functional modification in the Design Update summary')

});
