
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

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction, UpdateMergeStatus, WorkPackageStatus} from '../../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../../imports/constants/default_names.js';
import {DesignUpdateComponentValidationErrors} from '../../../imports/constants/validation_errors.js';

describe('UC 550 - Add Organisational Design Update Component', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 550 - Add Organisational Design Update Component');
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
    it('An Application can be added to a Design Update', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Add Application
        UpdateComponentActions.designerAddsApplicationToCurrentUpdate();

        // Verify
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', DefaultComponentNames.NEW_APPLICATION_NAME));

    });

    it('A Design Section can be added to a Design Update Application', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Add new Section to original Application 1
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateApplication('Application1');

        // Verify
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', DefaultComponentNames.NEW_DESIGN_SECTION_NAME));
    });

    it('A Design Section can be added to a Design Update Design Section', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Add new Section to original Section 1
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section1');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateSection('Application1', 'Section1');

        // Verify
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Section1', DefaultComponentNames.NEW_DESIGN_SECTION_NAME));
    });

    it('A Feature Aspect can be added to an in Scope Design Update Feature', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Make sure Feature1 is in Scope
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');

        // Add new Feature Aspect to Feature1
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateFeature('Section1', 'Feature1');

        // Verify
        expect(UpdateComponentVerifications.componentExistsForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME));
    });


    // Conditions
    it('An organisational Design Update Component cannot be added to a component that is not in Scope for the Design Update', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Add this Scenario to the scope so the other stuff gets added as Parent Scope
        UpdateComponentActions.designerAddsScenarioToCurrentUpdateScope('Actions', 'Scenario1');

        // Add new Section to Application1 without scoping Application1
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_ADDABLE_PARENT_OUT_SCOPE};
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.APPLICATION, 'NONE', 'Application1');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateApplication('Application1', expectation);

        // Add new SubSection to Section1 without scoping Section1
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.DESIGN_SECTION, 'Application1', 'Section1');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateSection('Application1', 'Section1', expectation);

        // Add new Feature Aspect to Feature1 without scoping Feature1
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateFeature('Section1', 'Feature1', expectation);

        // Verify
        expect(UpdateComponentVerifications.componentDoesNotExistForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME));
        expect(UpdateComponentVerifications.componentDoesNotExistForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME));
    });

    it('An organisational Design Update Component cannot be added to a component removed in this Design Update', function(){

        // Setup
        // Delete Section2 in the update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application1', 'Section2');
        UpdateComponentActions.designerLogicallyDeletesUpdateSection('Application1', 'Section2');

        // Execute - try to add SubSection3 to Section2 in DU1.  Note: need to add to a non-scopable component for this failure to be possible
        // as otherwise it would not be possible to scope the parent and would fail because parent not scoped
        const expectation = {success: false, message: DesignUpdateComponentValidationErrors.DESIGN_UPDATE_COMPONENT_NOT_ADDABLE_PARENT_REMOVED};
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateSection('Application1', 'Section2', expectation);

        // Verify - no new section
        expect(UpdateComponentVerifications.componentDoesNotExistForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME));

    });

    // Consequences
    it('When an organisational Design Component is added to a Draft Design Update it is also added to any Work Package based on the update', function(){

        // Setup
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        // Create a WP based on DU1
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerAddsUpdateWorkPackageCalled('UpdateWorkPackage1');

        // Execute - Designer Adds Section3 to DU1
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section3');

        // Verify - Section3 is in the WP now too
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        WorkPackageActions.managerEditsUpdateWorkPackage('UpdateWorkPackage1');
        expect(WpComponentVerifications.componentIsAvailableForManagerCurrentWp(ComponentType.DESIGN_SECTION, 'Application1', 'Section3'));

    });

    it('When an organisational Design Component is added to a Design Update to be included in the current Design Version it becomes visible as a new item in the Design Version', function(){

        // Setup - Publish DU so that additions to it are merged
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');

        // Initial check
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.APPLICATION, 'Application3','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section3','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.FEATURE_ASPECT, 'Aspect1','Design1', 'DesignVersion2'));

        // Execute
        // New Application
        UpdateComponentActions.designerAddsApplicationCalled('Application3');

        // New Section
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application3', 'Section3');

        // New Feature Aspect
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        UpdateComponentActions.designerAddsFeatureAspectTo_Feature_Called('Section1', 'Feature1', 'Aspect1');

        // Verify new stuff is now present
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application3','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section3','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE_ASPECT, 'Aspect1','Design1', 'DesignVersion2'));

        // And it is marked as New
        DesignComponentActions.designerSelectsApplication('Application3');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_ADDED));

        DesignComponentActions.designerSelectsDesignSection('Application3', 'Section3');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_ADDED));

        DesignComponentActions.designerSelectsFeatureAspect('Feature1', 'Aspect1');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_ADDED));

    });

    it('When a new organisational Design Component is added to a Design Update its peer components are added as placeholders if not already in scope', function(){

        // Setup
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Execute
        // New Application - should add other apps as peer scope
        UpdateComponentActions.designerAddsApplicationCalled('Application3');

        // New Section - should add other sections in App1 as peer scope
        UpdateComponentActions.designerAddsApplicationToCurrentUpdateScope('Application1');
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section3');

        // New Feature Aspect - should add other Feature Aspects for Feature1 as peer scope - except Actions which we are scoping
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        UpdateComponentActions.designerAddsFeatureAspectToCurrentUpdateScope('Feature1', 'Actions');
        UpdateComponentActions.designerAddsFeatureAspectTo_Feature_Called('Section1', 'Feature1', 'Aspect1');

        // Verify
        // Peer Apps added - not App 1 because in actual scope
        expect(UpdateComponentVerifications.componentIsInPeerScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application88'));
        expect(UpdateComponentVerifications.componentIsInPeerScopeForDesignerCurrentUpdate(ComponentType.APPLICATION, 'NONE', 'Application99'));

        // Peer Sections added - not section 1 because in parent scope for Feature1
        expect(UpdateComponentVerifications.componentIsInParentScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section1'));
        expect(UpdateComponentVerifications.componentIsInPeerScopeForDesignerCurrentUpdate(ComponentType.DESIGN_SECTION, 'Application1', 'Section2'));

        // Peer Feature Aspects added as peers - except for Actions which is in scope
        expect(UpdateComponentVerifications.componentIsInPeerScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Interface'));
        expect(UpdateComponentVerifications.componentIsInScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions'));
        expect(UpdateComponentVerifications.componentIsInPeerScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions'));
        expect(UpdateComponentVerifications.componentIsInPeerScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'Consequences'));
        expect(UpdateComponentVerifications.componentIsInPeerScopeForDesignerCurrentUpdate(ComponentType.FEATURE_ASPECT, 'Feature1', 'ExtraAspect'));
    });

});
