
import { TestFixtures }                 from '../../../test_framework/test_wrappers/test_fixtures.js';
import { DesignActions }                from '../../../test_framework/test_wrappers/design_actions.js';
import { DesignVersionActions }         from '../../../test_framework/test_wrappers/design_version_actions.js';
import { DesignUpdateActions }          from '../../../test_framework/test_wrappers/design_update_actions.js';
import { DesignComponentActions }       from '../../../test_framework/test_wrappers/design_component_actions.js';
import { UpdateComponentActions }       from '../../../test_framework/test_wrappers/design_update_component_actions.js';
import { DesignUpdateVerifications }    from '../../../test_framework/test_wrappers/design_update_verifications.js';
import { DesignComponentVerifications } from '../../../test_framework/test_wrappers/design_component_verifications.js';

import {ComponentType, DesignUpdateMergeAction, UpdateMergeStatus} from '../../../imports/constants/constants.js'
import {DefaultItemNames} from '../../../imports/constants/default_names.js';
import {DesignUpdateValidationErrors} from '../../../imports/constants/validation_errors.js';

describe('UC 507 - Set Design Update Action for Next Design Version', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 507 - Set Design Update Action for Next Design Version');
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

        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');
    });

    afterEach(function(){

    });


    // Actions
    it('A Designer may set a Draft Design Update as Merge', function(){

        // Setup - Draft DU is merge by default so change it back first
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_IGNORE);
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_IGNORE));

        // Execute
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_INCLUDE);

        // Verify
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE));
    });

    it('A Designer may set a Draft Design Update as Carry Forward', function(){

        // Setup
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE));

        // Execute
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_ROLL);

        // Verify
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_ROLL));
    });

    it('A Designer may set a Draft Design Update as Ignore', function(){

        // Setup
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE));

        // Execute
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_IGNORE);

        // Verify
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_IGNORE));
    });


    // Conditions
    it('A Designer cannot set Design Update actions for a New Design Update', function(){

        // Setup
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate2');
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate2', DesignUpdateMergeAction.MERGE_IGNORE));

        // Execute
        const expectation = {success: false, message: DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_MERGE_ACTION};
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_INCLUDE, expectation);

        // Verify
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate2', DesignUpdateMergeAction.MERGE_IGNORE));
    });

    it('A Designer cannot set Design Update actions for a Complete Design Update');

    it('A Developer cannot set Design Update actions', function(){

        // Setup
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        DesignActions.developerWorksOnDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.developerSelectsUpdate('DesignUpdate1');
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDeveloperIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE));

        // Execute
        const expectation = {success: false, message: DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_MERGE_ACTION};
        DesignUpdateActions.developerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_IGNORE, expectation);

        // Validate
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDeveloperIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE));
    });

    it('A Manager cannot set Design Update actions', function(){

        // Setup
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        DesignActions.managerWorksOnDesign('Design1');
        DesignVersionActions.managerSelectsDesignVersion('DesignVersion2');
        DesignUpdateActions.managerSelectsUpdate('DesignUpdate1');
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForManagerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE));

        // Execute
        const expectation = {success: false, message: DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_MERGE_ACTION};
        DesignUpdateActions.managerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_IGNORE, expectation);

        // Validate
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForManagerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE));
    });

    // Consequences
    it('When a Design Update is set to Merge all changes in the update are merged into the current Design Version', function(){

        // Setup
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        // Make an addition, modification and removal - on unpublished Update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        // Addition
        UpdateComponentActions.designerAddsApplicationCalled('Application2');
        // Modification
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('FeatureNew');
        // Remove
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application99', 'Section99');
        UpdateComponentActions.designerLogicallyDeletesUpdateSection('Application99', 'Section99');

        // Check
        // No Application2
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.APPLICATION, 'Application2', 'Design1', 'DesignVersion2'));
        // Feature1 is still Feature1
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.FEATURE, 'FeatureNew', 'Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion2'));
        // Section99 not removed yet
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section99', 'Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature99', 'Design1', 'DesignVersion2'));

        // Execute - publish to merge with DV
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');

        // Verify all changes now present in the DV...
        // Has Application2
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application2', 'Design1', 'DesignVersion2'));
        // Feature1 is now FeatureNew
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'FeatureNew', 'Design1', 'DesignVersion2'));
        // Section99 is removed
        DesignComponentActions.designerSelectsDesignSection('Application99', 'Section99');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_REMOVED));
        DesignComponentActions.designerSelectsFeature('Section99', 'Feature99');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_REMOVED));
    });

    it('When a Design Update set to Merge is set to Ignore or Carry Forward all changes in the update are removed from the current Design Version', function(){
        // Setup - publish update s changes are erged as made
        DesignUpdateActions.designerSelectsUpdate('DesignUpdate1');
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');

        // Make an addition, modification and removal - on unpublished Update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        // Addition
        UpdateComponentActions.designerAddsApplicationCalled('Application2');
        // Modification
        UpdateComponentActions.designerAddsFeatureToCurrentUpdateScope('Section1', 'Feature1');
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.FEATURE, 'Section1', 'Feature1');
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('FeatureNew');
        // Remove
        UpdateComponentActions.designerAddsDesignSectionToCurrentUpdateScope('Application99', 'Section99');
        UpdateComponentActions.designerLogicallyDeletesUpdateSection('Application99', 'Section99');

        // Check all changes are there
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application2', 'Design1', 'DesignVersion2'));
        // Feature1 is now FeatureNew
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'FeatureNew', 'Design1', 'DesignVersion2'));
        // Section99 is removed
        DesignComponentActions.designerSelectsDesignSection('Application99', 'Section99');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_REMOVED));
        DesignComponentActions.designerSelectsFeature('Section99', 'Feature99');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_REMOVED));

        // Execute - withdraw the update (sets to Ignore)
        DesignUpdateActions.designerWithdrawsUpdate('DesignUpdate1');

        // Verify changes removed
        // No Application2
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.APPLICATION, 'Application2', 'Design1', 'DesignVersion2'));
        // Feature1 is still Feature1
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.FEATURE, 'FeatureNew', 'Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion2'));
        // Section99 not removed yet
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section99', 'Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature99', 'Design1', 'DesignVersion2'));

        // Publish it again
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');

        // Check all changes are there
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application2', 'Design1', 'DesignVersion2'));
        // Feature1 is now FeatureNew
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'FeatureNew', 'Design1', 'DesignVersion2'));
        // Section99 is removed
        DesignComponentActions.designerSelectsDesignSection('Application99', 'Section99');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_REMOVED));
        DesignComponentActions.designerSelectsFeature('Section99', 'Feature99');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_REMOVED));

        // Execute - set to roll forward
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_ROLL);

        // Verify changes removed
        // No Application2
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.APPLICATION, 'Application2', 'Design1', 'DesignVersion2'));
        // Feature1 is still Feature1
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.FEATURE, 'FeatureNew', 'Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion2'));
        // Section99 not removed yet
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section99', 'Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature99', 'Design1', 'DesignVersion2'));

        // Just check that can get changes back again from here
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_INCLUDE);

        // Check all changes are there
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application2', 'Design1', 'DesignVersion2'));
        // Feature1 is now FeatureNew
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.FEATURE, 'Feature1', 'Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'FeatureNew', 'Design1', 'DesignVersion2'));
        // Section99 is removed
        DesignComponentActions.designerSelectsDesignSection('Application99', 'Section99');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_REMOVED));
        DesignComponentActions.designerSelectsFeature('Section99', 'Feature99');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_REMOVED));
    });
});
