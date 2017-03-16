
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
import DomainDictionaryActions      from '../../test_framework/test_wrappers/domain_dictionary_actions.js';
import DomainDictionaryVerifications from '../../test_framework/test_wrappers/domain_dictionary_verifications.js';

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, UpdateMergeStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';
import {DesignVersionValidationErrors} from '../../imports/constants/validation_errors.js';

describe('UC 106 - Create New Design Version', function(){

    before(function(){
        TestFixtures.logTestSuite('UC 106 - Create New Design Version');
    });

    after(function(){

    });

    beforeEach(function(){

        TestFixtures.clearAllData();

        TestFixtures.addDesignWithDefaultData();
    });

    afterEach(function(){

    });


    // Actions
    it('A Designer can create a new Updatable Design Version from an existing Draft Design Version', function(){

        // Setup
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');

        // Execute
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');

        // Verify
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME));
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion1', DesignVersionStatus.VERSION_DRAFT_COMPLETE));
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_UPDATABLE));

    });

    it('A Designer can create a new Updatable Design Version from an existing Updatable Design Version with a Design Update', function(){

        // Setup - create updatable design version
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        DesignVersionActions.designerUpdatesDesignVersionNameTo('DesignVersion2');
        // Check
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion2', DesignVersionStatus.VERSION_UPDATABLE));
        // Add a Design Update so that new version can be created - defaults to INCLUDE
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');

        // Execute
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion2');

        // Verify
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME));
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion1', DesignVersionStatus.VERSION_DRAFT_COMPLETE));
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion2', DesignVersionStatus.VERSION_UPDATABLE_COMPLETE));
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_UPDATABLE));

    });


    // Conditions

    it('A new Design Version may not be created from a New Design Version', function(){

        // Setup - keep the DV as New
        DesignActions.designerSelectsDesign('Design1');

        // Execute
        const expectation = {success: false, message: DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_NEXT};
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1', expectation);

        // Verify - new DV not created
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion1'));
        expect(DesignVersionVerifications.designVersionDoesNotExistForDesign_Called('Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME));
        // And DV1 status should still be New
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion1', DesignVersionStatus.VERSION_NEW));
    });

    it('A new Design Version may not be created from a Complete Design Version', function(){

        // Setup
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');

        // Name the new version so we don't confuse it with the next attempt
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');

        // Execute - try to create another new DV from old DesignVersion1
        const expectation = {success: false, message: DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_NEXT};
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1', expectation);

        // Verify - new DV not created
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion1'));
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion2'));
        expect(DesignVersionVerifications.designVersionDoesNotExistForDesign_Called('Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME));
        // And DV1 status should still be Complete
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion1', DesignVersionStatus.VERSION_DRAFT_COMPLETE));
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion2', DesignVersionStatus.VERSION_UPDATABLE));
    });

    it('A new Design Version may not be created from an Updatable Design Version if no Design Updates are selected for inclusion', function(){

        // Setup
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');

        // Name it
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');
        // Add a Design Update
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');
        // Publish it
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        // Set it to IGNORE
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_IGNORE);
        // Check
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate1',DesignUpdateMergeAction.MERGE_IGNORE));

        // Execute - try to create new DV from DV2 which has only one update set to IGNORE
        const expectation = {success: false, message: DesignVersionValidationErrors.DESIGN_VERSION_INVALID_UPDATE_NEXT};
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion2', expectation);

        // Verify - new DV not created
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion2'));
        expect(DesignVersionVerifications.designVersionDoesNotExistForDesign_Called('Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME));
        // And DV2 status should still be Updatable
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion2', DesignVersionStatus.VERSION_UPDATABLE));
    });


    // Consequences
    // it('When a new Design Version is created all Design Components in the previous version are copied to it', function(){
    //
    //     // Setup
    //     DesignActions.designerSelectsDesign('Design1');
    //     DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
    //     DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
    //     DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
    //
    //     // Name it
    //     DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');
    //
    //     // Check that all Design Components now exist for both new DV and old DV
    //     expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application1','Design1', 'DesignVersion1'));
    //     expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application1','Design1', 'DesignVersion2'));
    //     expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section1','Design1', 'DesignVersion1'));
    //     expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section1','Design1', 'DesignVersion2'));
    //     expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature1','Design1', 'DesignVersion1'));
    //     expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature1','Design1', 'DesignVersion2'));
    //     expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE_ASPECT, 'Actions','Design1', 'DesignVersion1'));
    //     expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE_ASPECT, 'Actions','Design1', 'DesignVersion2'));
    //     expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE_ASPECT, 'Conditions','Design1', 'DesignVersion1'));
    //     expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE_ASPECT, 'Conditions','Design1', 'DesignVersion2'));
    //     expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'Scenario1','Design1', 'DesignVersion1'));
    //     expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'Scenario1','Design1', 'DesignVersion2'));
    //     expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'Scenario2','Design1', 'DesignVersion1'));
    //     expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'Scenario2','Design1', 'DesignVersion2'));
    //
    //     // And check that they are in the right places
    //     expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.APPLICATION, 'Application1','Design1', 'DesignVersion1', 'NONE'));
    //     expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section1','Design1', 'DesignVersion1', 'Application1'));
    //     expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature1','Design1', 'DesignVersion1', 'Section1'));
    //     expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE_ASPECT, 'Actions','Design1', 'DesignVersion1', 'Feature1'));
    //     expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE_ASPECT, 'Conditions','Design1', 'DesignVersion1', 'Feature1'));
    //     expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.SCENARIO, 'Scenario1','Design1', 'DesignVersion1', 'Actions'));
    //     expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.SCENARIO, 'Scenario2','Design1', 'DesignVersion1', 'Conditions'));
    // });

    it('When a new Design Version is created, the previous Design Version becomes Complete', function(){

        // Setup - create updatable design version
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        DesignVersionActions.designerUpdatesDesignVersionNameTo('DesignVersion2');
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion2');
        DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        DesignVersionActions.designerUpdatesDesignVersionNameTo('DesignVersion3');

        // Verify
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion1', DesignVersionStatus.VERSION_DRAFT_COMPLETE));
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion2', DesignVersionStatus.VERSION_UPDATABLE_COMPLETE));
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion3', DesignVersionStatus.VERSION_UPDATABLE));
    });

    it('When a new Design Version is created Design Updates selected for Merge are included in the previous Design Version', function(){

        // Setup - create updatable design version
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        DesignVersionActions.designerUpdatesDesignVersionNameTo('DesignVersion2');

        // Add a Design Update so it can be completed
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');

        // Add new functionality to the update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // New section - Section3
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section3');
        // New Feature - Feature3
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section3', 'Feature3');
        // New Sceario - Scenario8
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature3', 'Actions', 'Scenario8');

        // Set update to INCLUDE
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_INCLUDE);

        // Check
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE));

        // Execute - create another new DV from DesignVersion2
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion2');

        // Verify - new DV created with default name
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion1'));
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion2'));
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME));

        // Select the new DV and name it
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion3');

        // And status should be updatable
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion3', DesignVersionStatus.VERSION_UPDATABLE));

        // And previous DV should be complete
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion2', DesignVersionStatus.VERSION_UPDATABLE_COMPLETE));

        // Both the previous and new DV should contain the new items merged into the previous version
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application1','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application1','Design1', 'DesignVersion3'));

        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section1','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section1','Design1', 'DesignVersion3'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section3','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section3','Design1', 'DesignVersion3'));

        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature1','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature1','Design1', 'DesignVersion3'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature3','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature3','Design1', 'DesignVersion3'));

        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'Scenario8', 'Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'Scenario8', 'Design1', 'DesignVersion3'));

        // And check that they are in the right places
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.APPLICATION, 'Application1','Design1', 'DesignVersion2', 'NONE'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section3','Design1', 'DesignVersion2', 'Application1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature3','Design1', 'DesignVersion2', 'Section3'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.SCENARIO, 'Scenario8','Design1', 'DesignVersion2', 'Actions'));

        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.APPLICATION, 'Application1','Design1', 'DesignVersion3', 'NONE'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section3','Design1', 'DesignVersion3', 'Application1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature3','Design1', 'DesignVersion3', 'Section3'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.SCENARIO, 'Scenario8','Design1', 'DesignVersion3', 'Actions'));

        // But the new items should not be in the base design version
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section3','Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.FEATURE, 'Feature3','Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.SCENARIO, 'Scenario8','Design1', 'DesignVersion1'));
    });

    it('When a new Design Version is created Design Updates selected for Carry Forward are now updates for the new Design Version', function(){

        // Setup - create updatable design version
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        DesignVersionActions.designerUpdatesDesignVersionNameTo('DesignVersion2');

        // Add a Design Update so it can be completed
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');

        // Add new functionality to the first update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        // New section - Section4
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section4');
        // New Feature - Feature4
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section4', 'Feature4');
        // Set update to INCLUDE
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_INCLUDE);
        // Check
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE));

        // Add another Design Update to roll forward
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');

        // Add new functionality to the second update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        // New section - Section5
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section5');
        // New Feature - Feature5
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section5', 'Feature5');
        // Set update to ROLL FORWARD
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate2');
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_ROLL);
        // Check
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate2', DesignUpdateMergeAction.MERGE_ROLL));

        // Execute - create another new DV from DesignVersion2
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion2');

        // Verify - new DV created with default name
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion1'));
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion2'));
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME));

        // Select the new DV
        DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);

        // Verify that DU2 exists for it and is still Draft but now defaulted to INCLUDE
        expect(DesignUpdateVerifications.updateExistsForDesignerCalled('DesignUpdate2'));
        expect(DesignUpdateVerifications.updateStatusForUpdate_ForDesignerIs('DesignUpdate2', DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT));
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate2', DesignUpdateMergeAction.MERGE_INCLUDE));

        // Select old DV
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        // DU no longer exists for that DV
        expect(DesignUpdateVerifications.updateDoesNotExistForDesignerCalled('DesignUpdate2'));

    });

    it('When a new Design Version is created all Domain Dictionary entries from the previous Design Version are carried forward', function(){

        // Setup
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        // Add Dictionary entries
        DomainDictionaryActions.designerAddsNewTerm();
        DomainDictionaryActions.designerEditsTermNameFrom_To_(DefaultComponentNames.NEW_DICTIONARY_ENTRY_NAME, 'Term1');
        DomainDictionaryActions.designerEditsTerm_DefinitionTo_('Term1', 'Term1 Definition');
        DomainDictionaryActions.designerAddsNewTerm();
        DomainDictionaryActions.designerEditsTermNameFrom_To_(DefaultComponentNames.NEW_DICTIONARY_ENTRY_NAME, 'Term2');
        DomainDictionaryActions.designerEditsTerm_DefinitionTo_('Term2', 'Term2 Definition');

        // Execute
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');

        // Verification
        DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        expect(DomainDictionaryVerifications.termExistsForDesignerCalled('Term1'));
        expect(DomainDictionaryVerifications.termDefinitionForTerm_ForDesignerIs('Term1', 'Term1 Definition'));
        expect(DomainDictionaryVerifications.termExistsForDesignerCalled('Term2'));
        expect(DomainDictionaryVerifications.termDefinitionForTerm_ForDesignerIs('Term2', 'Term2 Definition'));
    });

    it('When a new Design Version is created Design Updates selected as Ignore are neither merged nor carried forward', function(){

        // Setup - create updatable design version
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        DesignVersionActions.designerUpdatesDesignVersionNameTo('DesignVersion2');

        // Add a Design Update so it can be completed
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');

        // Add new functionality to the first update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        // New section - Section4
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section4');
        // New Feature - Feature4
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section4', 'Feature4');
        // Set update to INCLUDE
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_INCLUDE);
        // Check
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE));

        // Add another Design Update to IGNORE
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');

        // Add new functionality to the second update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        // New section - Section5
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section5');
        // New Feature - Feature5
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section5', 'Feature5');
        // Set update to IGNORE
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate2');
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_IGNORE);
        // Check
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate2', DesignUpdateMergeAction.MERGE_IGNORE));

        // Execute - create another new DV from DesignVersion2
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion2');

        // Verify - new DV created with default name
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion1'));
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion2'));
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME));

        // Select the new DV
        DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);

        // Verify that DU2 does not exist for new DV
        expect(DesignUpdateVerifications.updateDoesNotExistForDesignerCalled('DesignUpdate2'));

        // And that its components are not merged into it - no Feature5 should exist
        DesignVersionActions.designerViewsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.FEATURE, 'Feature5', 'Design1', 'DesignVersion2'));
    });

    it('An ignored Design Update remains at state Ignore in the previous Design Version', function(){

        // Setup - create updatable design version
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        DesignVersionActions.designerUpdatesDesignVersionNameTo('DesignVersion2');

        // Add a Design Update so it can be completed
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');

        // Add new functionality to the first update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        // New section - Section4
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section4');
        // New Feature - Feature4
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section4', 'Feature4');
        // Set update to INCLUDE
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_INCLUDE);
        // Check
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE));

        // Add another Design Update to IGNORE
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');

        // Add new functionality to the second update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        // New section - Section5
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section5');
        // New Feature - Feature5
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section5', 'Feature5');
        // Set update to IGNORE
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate2');
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_IGNORE);
        // Check
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate2', DesignUpdateMergeAction.MERGE_IGNORE));

        // Execute - create another new DV from DesignVersion2
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion2');

        // Verify
        // Select old DV
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        // DU still exists but at state IGNORED
        expect(DesignUpdateVerifications.updateExistsForDesignerCalled('DesignUpdate2'));
        expect(DesignUpdateVerifications.updateStatusForUpdate_ForDesignerIs('DesignUpdate2', DesignUpdateStatus.UPDATE_IGNORED));
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate2', DesignUpdateMergeAction.MERGE_IGNORE));
    });

    it('When a new Design Version is created any Design Components marked as removed in a merged Design Update are removed completely from the previous Design Version', function(){

        // Setup - create updatable design version
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        DesignVersionActions.designerUpdatesDesignVersionNameTo('DesignVersion2');

        // Add a Design Update so it can be completed
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');

        // Add new functionality to the update - actually a removal
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // Remove Section2.  Will also Remove Feature2 and its Scenarios and SubSection1
        UpdateComponentActions.designerLogicallyDeletesUpdateSection('Application1', 'Section2');

        // Set update to INCLUDE
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_INCLUDE);

        // Check
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE));

        // Execute - create another new DV from DesignVersion2
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion2');

        // Verify - new DV created with default name
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion1'));
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion2'));
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME));

        // Select the new DV and name it
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion3');

        // And status should be updatable
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion3', DesignVersionStatus.VERSION_UPDATABLE));

        // And previous DV should be complete
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion2');
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion2', DesignVersionStatus.VERSION_UPDATABLE_COMPLETE));

        // Both the previous and new DV should not contain the removed items at all
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section2','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section2','Design1', 'DesignVersion3'));

        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.DESIGN_SECTION, 'SubSection1','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.DESIGN_SECTION, 'SubSection1','Design1', 'DesignVersion3'));

        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.FEATURE, 'Feature2','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.FEATURE, 'Feature2','Design1', 'DesignVersion3'));

        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.SCENARIO, 'Scenario3','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.SCENARIO, 'Scenario3','Design1', 'DesignVersion3'));
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.SCENARIO, 'Scenario4','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.SCENARIO, 'Scenario4','Design1', 'DesignVersion3'));

        // But they remain in the base design version
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section2','Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'SubSection1','Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature2','Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'Scenario3','Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'Scenario4','Design1', 'DesignVersion1'));
    });

    it('The new Design Version is an identical copy of the previous Design Version with all items shown as base version items when it is viewed', function(){

        // Setup - create updatable design version
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');
        DesignVersionActions.designerSelectsDesignVersion(DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        DesignVersionActions.designerUpdatesDesignVersionNameTo('DesignVersion2');

        // Add a Design Update
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');

        // Add new functionality to the update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // New section - Section3
        UpdateComponentActions.designerAddsDesignSectionToApplication_Called('Application1', 'Section3');
        // New Feature - Feature3
        UpdateComponentActions.designerAddsFeatureTo_Section_Called('Application1', 'Section3', 'Feature3');
        // New Sceario - Scenario8
        UpdateComponentActions.designerAddsScenarioTo_FeatureAspect_Called('Feature3', 'Actions', 'Scenario8');

        // Set update to INCLUDE
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_INCLUDE);

        // Add a Design Update
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');

        // Modify Functionality in the Update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');

        // Modify a Scenario Name
        UpdateComponentActions.designerSelectsUpdateComponent(ComponentType.SCENARIO, 'Actions', 'Scenario1');
        UpdateComponentActions.designerUpdatesSelectedUpdateComponentNameTo('New Scenario Name');

        // Set update to INCLUDE
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate2');
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_INCLUDE);

        // Add a Design Update
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate3');

        // Remove Functionality in the Update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate3');

        // Remove Section2.  Will also Remove Feature2 and its Scenarios and SubSection1
        UpdateComponentActions.designerLogicallyDeletesUpdateSection('Application1', 'Section2');

        // Set update to INCLUDE
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate3');
        DesignUpdateActions.designerSetsUpdateMergeActionTo(DesignUpdateMergeAction.MERGE_INCLUDE);


        // Execute - create another new DV from DesignVersion2
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion2');

        // Verify - new DV created with default name
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion1'));
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion2'));
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME));

        // Select the new DV and name it
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion3');

        // And status should be updatable
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion3', DesignVersionStatus.VERSION_UPDATABLE));

        // Verify - both previous version and new version should be the same and all of new version should have baseline status

        // Existing stuff
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application1','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application1','Design1', 'DesignVersion3'));

        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application88','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application88','Design1', 'DesignVersion3'));

        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application99','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application99','Design1', 'DesignVersion3'));

        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section1','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section1','Design1', 'DesignVersion3'));

        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature1','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature1','Design1', 'DesignVersion3'));

        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature444','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature444','Design1', 'DesignVersion3'));

        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature99','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature99','Design1', 'DesignVersion3'));

        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'Scenario7', 'Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'Scenario7', 'Design1', 'DesignVersion3'));

        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'Scenario2', 'Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'Scenario2', 'Design1', 'DesignVersion3'));

        // New Stuff
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section3','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section3','Design1', 'DesignVersion3'));

        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature3','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature3','Design1', 'DesignVersion3'));

        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'Scenario8', 'Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'Scenario8', 'Design1', 'DesignVersion3'));

        // Modified Stuff
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'New Scenario Name', 'Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'New Scenario Name', 'Design1', 'DesignVersion3'));
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.SCENARIO, 'Scenario1','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.SCENARIO, 'Scenario1','Design1', 'DesignVersion3'));

        // Removed stuff gone
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section2','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section2','Design1', 'DesignVersion3'));

        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.DESIGN_SECTION, 'SubSection1','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.DESIGN_SECTION, 'SubSection1','Design1', 'DesignVersion3'));

        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.FEATURE, 'Feature2','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.FEATURE, 'Feature2','Design1', 'DesignVersion3'));

        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.SCENARIO, 'Scenario3','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.SCENARIO, 'Scenario3','Design1', 'DesignVersion3'));
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.SCENARIO, 'Scenario4','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_DoesNotExistInDesign_Version_(ComponentType.SCENARIO, 'Scenario4','Design1', 'DesignVersion3'));

        // And all stuff remaining in DV3 is at baseline status
        DesignVersionActions.designerSelectsDesignVersion('DesignVersion3');
        DesignVersionActions.designerViewsDesignVersion('DesignVersion3');

        DesignComponentActions.designerSelectsApplication('Application1');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_BASE));

        DesignComponentActions.designerSelectsApplication('Application88');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_BASE));

        DesignComponentActions.designerSelectsApplication('Application99');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_BASE));

        DesignComponentActions.designerSelectsDesignSection('Application1', 'Section1');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_BASE));

        DesignComponentActions.designerSelectsFeature('Section1', 'Feature1');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_BASE));

        DesignComponentActions.designerSelectsFeature('Section1', 'Feature444');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_BASE));

        DesignComponentActions.designerSelectsFeature('Section99', 'Feature99');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_BASE));

        DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'New Scenario Name');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_BASE));

        DesignComponentActions.designerSelectsScenario('Feature1', 'Actions', 'Scenario7');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_BASE));

        DesignComponentActions.designerSelectsScenario('Feature1', 'Conditions', 'Scenario2');
        expect(DesignComponentVerifications.designerSelectedComponentMergeStatusIs_(UpdateMergeStatus.COMPONENT_BASE));
    })
});
