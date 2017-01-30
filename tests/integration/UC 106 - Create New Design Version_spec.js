
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

import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


describe('UC 106 - Create New Design Version', function(){

    before(function(){

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

        const params = {
            designName: 'Design1',
            designVersionName: 'DesignVersion1'
        };

        DesignVersionActions.designerCreateNextDesignVersionFromNew(params);
    });

    it('A Designer can create a new Updatable Design Version from an existing Updatable Design Version with a Design Update', function(){

        const params = {
            designName: 'Design1',
            firstDesignVersion: 'DesignVersion1',
            secondDesignVersion: 'DesignVersion2',
            designUpdate: 'DesignUpdate1'
        };

        DesignVersionActions.designerCreateNextDesignVersionFromUpdatable(params);

    });


    // Conditions
    it('Only a Designer can create a new Design Version', function(){

        // Setup
        // Publish the Design Version
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');

        // Execute as Developer
        DesignActions.developerSelectsDesign('Design1');
        DesignVersionActions.developerCreatesNextDesignVersionFrom('DesignVersion1');

        // Verify - new DV not created
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion1'));
        expect(DesignVersionVerifications.designVersionDoesNotExistForDesign_Called('Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME));
        // And DV1 status should still be Draft
        expect(DesignVersionVerifications.designVersion_StatusForDeveloperIs('DesignVersion1', DesignVersionStatus.VERSION_DRAFT));

        // Execute as Manager
        DesignActions.managerSelectsDesign('Design1');
        DesignVersionActions.managerCreatesNextDesignVersionFrom('DesignVersion1');

        // Verify - new DV not created
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion1'));
        expect(DesignVersionVerifications.designVersionDoesNotExistForDesign_Called('Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME));
        // And DV1 status should still be Draft
        expect(DesignVersionVerifications.designVersion_StatusForManagerIs('DesignVersion1', DesignVersionStatus.VERSION_DRAFT));

    });

    it('A new Design Version may not be created from a New Design Version', function(){

        // Setup - keep the DV as New
        DesignActions.designerSelectsDesign('Design1');

        // Execute
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');

        // Verify - new DV not created
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion1'));
        expect(DesignVersionVerifications.designVersionDoesNotExistForDesign_Called('Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME));
        // And DV1 status should still be New
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion1', DesignVersionStatus.VERSION_NEW));
    });

    it('A new Design Version may not be created from a Complete Design Version', function(){

        // Setup - create new DV from original
        const params = {
            designName: 'Design1',
            designVersionName: 'DesignVersion1'
        };

        DesignVersionActions.designerCreateNextDesignVersionFromNew(params);

        // Name the new version so we don't confuse it with the next attempt
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');

        // Execute - try to create another new DV from old DesignVersion1
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion1');

        // Verify - new DV not created
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion1'));
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion2'));
        expect(DesignVersionVerifications.designVersionDoesNotExistForDesign_Called('Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME));
        // And DV1 status should still be Complete
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion1', DesignVersionStatus.VERSION_DRAFT_COMPLETE));
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion2', DesignVersionStatus.VERSION_UPDATABLE));
    });

    it('A new Design Version may not be created from an Updatable Design Version if no Design Updates are selected for inclusion', function(){

        // Setup - create new DV from original
        const params = {
            designName: 'Design1',
            designVersionName: 'DesignVersion1'
        };

        DesignVersionActions.designerCreateNextDesignVersionFromNew(params);

        // Name it
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');
        // Add a Design Update
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');
        // Publish it
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        // Set it to IGNORE
        DesignUpdateActions.designerSetsUpdateActionTo(DesignUpdateMergeAction.MERGE_IGNORE);
        // Check
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate1',DesignUpdateMergeAction.MERGE_IGNORE));

        // Execute - try to create new DV from DV2 which has only one update set to IGNORE
        DesignVersionActions.designerCreatesNextDesignVersionFrom('DesignVersion2');

        // Verify - new DV not created
        expect(DesignVersionVerifications.designVersionExistsForDesign_Called('Design1', 'DesignVersion2'));
        expect(DesignVersionVerifications.designVersionDoesNotExistForDesign_Called('Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME));
        // And DV2 status should still be Updatable
        expect(DesignVersionVerifications.designVersion_StatusForDesignerIs('DesignVersion2', DesignVersionStatus.VERSION_UPDATABLE));
    });


    // Consequences
    it('When a new Design Version is created all Design Components in the previous version are copied to it', function(){

        // Setup - create new DV from original
        const params = {
            designName: 'Design1',
            designVersionName: 'DesignVersion1'
        };

        DesignVersionActions.designerCreateNextDesignVersionFromNew(params);

        // Name it
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');

        // Check that all Design Components now exist for both new DV and old DV
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application1','Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application1','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section1','Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section1','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature1','Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature1','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE_ASPECT, 'Actions','Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE_ASPECT, 'Actions','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE_ASPECT, 'Conditions','Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE_ASPECT, 'Conditions','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'Scenario1','Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'Scenario1','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'Scenario2','Design1', 'DesignVersion1'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.SCENARIO, 'Scenario2','Design1', 'DesignVersion2'));

        // And check that they are in the right places
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.APPLICATION, 'Application1','Design1', 'DesignVersion1', 'NONE'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section1','Design1', 'DesignVersion1', 'Application1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature1','Design1', 'DesignVersion1', 'Section1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE_ASPECT, 'Actions','Design1', 'DesignVersion1', 'Feature1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE_ASPECT, 'Conditions','Design1', 'DesignVersion1', 'Feature1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.SCENARIO, 'Scenario1','Design1', 'DesignVersion1', 'Actions'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.SCENARIO, 'Scenario2','Design1', 'DesignVersion1', 'Conditions'));
    });

    it('When a new Design Version is created, the previous Design Version becomes Complete', function(){
        // These previous tests are actually testing this
        const params1 = {
            designName: 'Design1',
            designVersionName: 'DesignVersion1'
        };

        DesignVersionActions.designerCreateNextDesignVersionFromNew(params1);

        const params2 = {
            designName: 'Design1',
            firstDesignVersion: 'DesignVersion1',
            secondDesignVersion: 'DesignVersion2',
            designUpdate: 'DesignUpdate1'
        };

        DesignVersionActions.designerCreateNextDesignVersionFromUpdatable(params2);
    });

    it('When a new Design Version is created Design Updates selected for Merge are included in it', function(){
        // Setup - create updatable DV
        const params1 = {
            designName: 'Design1',
            designVersionName: 'DesignVersion1'
        };

        DesignVersionActions.designerCreateNextDesignVersionFromNew(params1);

        const params2 = {
            designName: 'Design1',
            firstDesignVersion: 'DesignVersion1',
            secondDesignVersion: 'DesignVersion2',
            designUpdate: 'DesignUpdate1'
        };

        // Name it
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');

        // Add a Design Update so it can be completed
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');

        // Add new functionality to the update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');

        // New section - Section99
        UpdateComponentActions.designerAddDesignSectionToApplication_Called('Application1', 'Section99');
        // New Feature - Feature99
        UpdateComponentActions.designerAddFeatureTo_Section_Called('Application1', 'Section99', 'Feature99');

        // Set update to INCLUDE
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        DesignUpdateActions.designerSetsUpdateActionTo(DesignUpdateMergeAction.MERGE_INCLUDE);

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

        // And new DV should include Section99 and Feature99 as well as the original stuff
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application1','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.APPLICATION, 'Application1','Design1', 'DesignVersion3'));

        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section1','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section1','Design1', 'DesignVersion3'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.DESIGN_SECTION, 'Section99','Design1', 'DesignVersion3'));

        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature1','Design1', 'DesignVersion2'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature1','Design1', 'DesignVersion3'));
        expect(DesignComponentVerifications.componentOfType_Called_ExistsInDesign_Version_(ComponentType.FEATURE, 'Feature99','Design1', 'DesignVersion3'));

        // And check that they are in the right places
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.APPLICATION, 'Application1','Design1', 'DesignVersion3', 'NONE'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.DESIGN_SECTION, 'Section99','Design1', 'DesignVersion3', 'Application1'));
        expect(DesignComponentVerifications.componentOfType_Called_InDesign_Version_ParentIs_(ComponentType.FEATURE, 'Feature99','Design1', 'DesignVersion3', 'Section99'));


    });

    it('When a new Design Version is created Design Updates selected for Carry Forward are now updates for the new Design Version', function(){

        // Setup - create updatable DV
        const params1 = {
            designName: 'Design1',
            designVersionName: 'DesignVersion1'
        };

        DesignVersionActions.designerCreateNextDesignVersionFromNew(params1);

        // Name it
        DesignVersionActions.designerUpdatesDesignVersionNameFrom_To_(DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'DesignVersion2');

        // Add a Design Update so it can be completed
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate1');

        // Add new functionality to the first update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate1');
        // New section - Section99
        UpdateComponentActions.designerAddDesignSectionToApplication_Called('Application1', 'Section88');
        // New Feature - Feature99
        UpdateComponentActions.designerAddFeatureTo_Section_Called('Application1', 'Section88', 'Feature88');
        // Set update to INCLUDE
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate1');
        DesignUpdateActions.designerSetsUpdateActionTo(DesignUpdateMergeAction.MERGE_INCLUDE);
        // Check
        expect(DesignUpdateVerifications.updateMergeActionForUpdate_ForDesignerIs('DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE));

        // Add another Design Update to roll forward
        DesignUpdateActions.designerAddsAnUpdateCalled('DesignUpdate2');

        // Add new functionality to the second update
        DesignUpdateActions.designerEditsUpdate('DesignUpdate2');
        // New section - Section99
        UpdateComponentActions.designerAddDesignSectionToApplication_Called('Application1', 'Section99');
        // New Feature - Feature99
        UpdateComponentActions.designerAddFeatureTo_Section_Called('Application1', 'Section99', 'Feature99');
        // Set update to ROLL FORWARD
        DesignUpdateActions.designerPublishesUpdate('DesignUpdate2');
        DesignUpdateActions.designerSetsUpdateActionTo(DesignUpdateMergeAction.MERGE_ROLL);
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

});
