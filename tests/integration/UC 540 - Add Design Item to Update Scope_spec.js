
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

describe('UC 540 - Add Design Item to Update Scope', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 540 - Add Design Item to Update Scope');


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

    });

    afterEach(function(){

    });


    // Actions
    it('An Application can be added to the Design Update Scope', function(){

        // Setup
        // Verify that Application1 is not in the scope yet
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));

        // Execute
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');

        // Verify

        // In Scope
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));

        // Out of Scope
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));

    });

    it('A Design Section can be added to the Design Update Scope', function(){

        // Setup
        // Verify that Section1 is not in the scope yet
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));

        // Execute
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section1');

        // Verify

        // In Scope
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));

        // In Parent scope
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));

        // Out of Scope
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));

    });

    it('A Feature can be added to the Design Update Scope', function(){

        // Setup
        // Verify that Feature1 is not in the scope yet
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));

        // Execute
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');

        // Verify
        // Feature1 now in scope
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));

        // In Parent Scope
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));

        // Out of Scope
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));

    });

    it('A Feature Aspect can be added to the Design Update Scope', function(){

        // Setup
        // Verify that Feature1 Actions is not in the scope yet
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));

        // Execute
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');

        // Verify
        // Actions now in scope
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));

        // In Parent Scope
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));

        // Out of scope
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
    });

    it('A Scenario can be added to the Design Update Scope', function(){

        // Setup
        // Verify that Feature1 Actions is not in the scope yet
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));

        // Execute
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');

        // Verify
        // Scenario1 now in scope
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));

        // In Parent Scope
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));

        // Out of scope
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section2', 'Feature2'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Conditions', 'Scenario2'));
    });

    it('An Application can be added to the Scope of more than one Design Update', function(){

        // Setup
        // Add a new Design Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');

        // Add Application 1 to both DU1 and DU2 - no errors
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');

        // Verify in scope for both
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));

        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));
    });

    it('A Design Section can be added to the Scope of more than one Design Update', function(){

        // Setup
        // Add a new Design Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');

        // Add Application 1 to both DU1 and DU2 - no errors
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section1');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section1');

        // Verify in scope for both
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));

        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
    });

    it('A Feature can be added to the Scope of more than one Design Update', function(){

        // Setup
        // Add a new Design Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');

        // Add Application 1 to both DU1 and DU2 - no errors
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');

        // Verify in scope for both
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));

        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
    });

    it('A Feature Aspect can be added to the Scope of more than one Design Update', function(){

        // Setup
        // Add a new Design Update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');

        // Add Application 1 to both DU1 and DU2 - no errors
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');

        // Verify in scope for both
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));

        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
    });

    // Conditions
    it('A Scenario cannot be added to Design Update Scope if it is in scope for another Design Update for the current Design Version', function(){

        // Setup
        // And another update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');

        // Add Scenario1 to first update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));

        // Execute - try to add Scenario1 to second update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');

        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_SCOPABLE_IN_SCOPE};
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1', expectation);

        // Verify - Scenario and parent not in scope
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
    });

    it('A Feature cannot be added to Design Update Scope if it has been changed in another Design Update for the current Design Version', function(){

        // Setup
        // And another update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');

        // Put Feature1 in scope for DU1 and then edit it
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('New Feature Name');

        // Now edit DU2
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');

        // Execute - Try to add Feature1 to scope
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_SCOPABLE_CHANGED};
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1', expectation);

        // Verify - not in scope
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
    });

    it('A Feature cannot be added to Design Update Scope if it has been removed in another Design Update for the current Design Version', function(){

        // Setup
        // And another update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');

        // Put Feature1 in scope for DU1 and then delete it
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        UpdateComponentActions.designerLogicallyDeletesUpdateFeature('Section1', 'Feature1');

        // Now edit DU2
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');

        // Execute - Try to add Feature1 to scope
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_SCOPABLE_REMOVED};
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1', expectation);

        // Verify - not in scope
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));

    });

    it('A Feature Aspect cannot be added to Design Update Scope if it has been removed in another Design Update for the current Design Version', function(){

        // Setup
        // And another update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');

        // Put Feature Aspect in scope for DU1 and then delete it
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerLogicallyDeletesUpdateFeatureAspect('Feature1', 'Actions');

        // Now edit DU2
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');

        // Execute - Try to add Actions to scope
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_SCOPABLE_REMOVED};
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions', expectation);

        // Verify - not in scope
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
    });

    it('A Scenario cannot be added to Design Update Scope if it has been removed in another Design Update for the current Design Version', function(){

        // Setup
        // And another update
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');

        // Put Scenario in scope for DU1 and then delete it
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');
        UpdateComponentActions.designerLogicallyDeletesUpdateScenario('Actions', 'Scenario1');

        // Now edit DU2
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');

        // Execute - Try to add Scenario1 to scope
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_SCOPABLE_REMOVED};
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1', expectation);

        // Verify - not in scope
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario1'));
    });

    it('All Applications are in scope by default so that new Design Sections can be added', function(){

        // Setup - edit DU1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Add a new Section to Application1 without scoping it first
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section3');

        // Verify - organisational items will have parent scope
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));
        // Design Sections are not Scopable so won't be specifically in scope
        expect(UpdateComponentVerifications.componentIsNotInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section3'));

    });

    it('All Design Sections are in scope by default so that new Design Sections and Features can be added', function(){

        // Setup - edit DU1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Add a new Feature to Section1 without scoping it first
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section1', 'Feature3');

        // Verify - organisational items will have parent scope and new functional in scope
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        // Feature is a scopable item so goes in scope
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature3'));
    });


    // Consequences
    it('When an Application is added to Design Update Scope it is possible to add new Design Sections to it', function(){

        // Setup - edit DU1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');

        // Execute
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section4');

        // Verify
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application1'));
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section4'));
    });

    it('When a Design Section is added to Design Update Scope it is possible to add new Design Sections or Features to it', function(){

        // Setup - edit DU1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section1');

        // Execute
        UpdateComponentActions.designerAddsDesignSectionToDesignSection_Called('Section1', 'SubSection4');
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Section1', 'Feature4');

        // Verify
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature4'));
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Section1', 'SubSection4'));
    });

    it('When a Feature is added to Design Update Scope it is possible to add new Feature Aspects to it', function(){

        // Setup - edit DU1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');

        // Execute
        UpdateComponentActions.designerAddsFeatureAspectTo_Feature_Called('Section1', 'Feature1', 'Aspect1');

        // Verify
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Aspect1'));
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE, 'Section1', 'Feature1'));
    });

    it('When a Feature Aspect is added to Design Update Scope it is possible to add new Scenarios to it', function(){

        // Setup - edit DU1
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');

        // Execute
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature1', 'Actions', 'Scenario8');

        // Verify
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.SCENARIO, 'Actions', 'Scenario8'));
    });

});
