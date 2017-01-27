
import TestFixtures                 from '../../test_framework/test_wrappers/test_fixtures.js';
import DesignActions                from '../../test_framework/test_wrappers/design_actions.js';
import DesignVersionActions         from '../../test_framework/test_wrappers/design_version_actions.js';
import DesignUpdateActions          from '../../test_framework/test_wrappers/design_update_actions.js';
import DesignComponentActions       from '../../test_framework/test_wrappers/design_component_actions.js';
import UpdateComponentActions       from '../../test_framework/test_wrappers/design_update_component_actions.js';
import DesignVerifications          from '../../test_framework/test_wrappers/design_verifications.js';
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

        DesignVersionActions.designerCreateNewDesignVersionFromDraft(params);
    });

    it('A Designer can create a new Updatable Design Version from an existing Updatable Design Version with a Design Update', function(){

        const params = {
            designName: 'Design1',
            firstDesignVersion: 'DesignVersion1',
            secondDesignVersion: 'DesignVersion2',
            designUpdate: 'DesignUpdate1'
        };

        DesignVersionActions.designerCreateNewDesignVersionFromUpdatable(params);

    });


    // Conditions
    it('Only a Designer can create a new Design Version', function(){

        // Setup
        // Publish the Design Version
        DesignActions.designerSelectsDesign('Design1');
        DesignVersionActions.designerPublishesDesignVersion('DesignVersion1');

        // Execute as Developer
        DesignActions.developerSelectsDesign('Design1');
        DesignVersionActions.developerSelectsDesignVersion('DesignVersion1');
        DesignVersionActions.developerCreatesNextDesignVersionFrom('DesignVersion1');

        // Verify - new DV not created
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', 'DesignVersion1');
        server.call('verifyDesignVersions.designVersionDoesNotExistCalled', 'Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        // And DV1 status should still be Draft
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'hugh');
        server.call('verifyDesignVersions.designVersionStatusIs', 'DesignVersion1', DesignVersionStatus.VERSION_DRAFT, 'hugh');

        // Execute as Manager
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'miles');
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion1', RoleType.MANAGER, 'miles');

        // Verify - new DV not created
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', 'DesignVersion1');
        server.call('verifyDesignVersions.designVersionDoesNotExistCalled', 'Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        // And DV1 status should still be Draft
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'miles');
        server.call('verifyDesignVersions.designVersionStatusIs', 'DesignVersion1', DesignVersionStatus.VERSION_DRAFT, 'miles');

    });

    it('A new Design Version may not be created from a New Design Version', function(){

        // Setup - keep the DV as New

        // Execute
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');

        // Verify - new DV not created
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', 'DesignVersion1');
        server.call('verifyDesignVersions.designVersionDoesNotExistCalled', 'Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        // And DV1 status should still be New
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'gloria');
        server.call('verifyDesignVersions.designVersionStatusIs', 'DesignVersion1', DesignVersionStatus.VERSION_NEW, 'gloria');
    });

    it('A new Design Version may not be created from a Complete Design Version', function(){

        // Setup
        // Publish the New Design Version
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        // Create an Updatable DV from it
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion2', RoleType.DESIGNER, 'gloria');

        // Execute - try to create another new DV frm DesignVersion1
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');

        // Verify - new DV not created
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', 'DesignVersion1');
        server.call('verifyDesignVersions.designVersionDoesNotExistCalled', 'Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        // And DV1 status should still be Complete
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'gloria');
        server.call('verifyDesignVersions.designVersionStatusIs', 'DesignVersion1', DesignVersionStatus.VERSION_DRAFT_COMPLETE, 'gloria');
    });

    it('A new Design Version may not be created from an Updatable Design Version if no Design Updates are selected for inclusion', function(){

        // Setup
        // Publish initial DV
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        // Create a new Updatable DV
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        // Name it
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion2', RoleType.DESIGNER, 'gloria');
        // Add a Design Update
        server.call('testDesignUpdates.addDesignUpdate', RoleType.DESIGNER, 'gloria');
        // Name it
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        // Publish it
        server.call('testDesignUpdates.publishDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        // Set it to IGNORE
        server.call('testDesignUpdates.updateMergeAction', DesignUpdateMergeAction.MERGE_IGNORE, RoleType.DESIGNER, 'gloria');
        // Check
        server.call('verifyDesignUpdates.designUpdateMergeActionIs', 'DesignUpdate1', DesignUpdateMergeAction.MERGE_IGNORE, 'gloria');

        // Execute
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion2', RoleType.DESIGNER, 'gloria');

        // Verify - new DV not created
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', 'DesignVersion2');
        server.call('verifyDesignVersions.designVersionDoesNotExistCalled', 'Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        // And DV2 status should still be Updatable
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('verifyDesignVersions.designVersionStatusIs', 'DesignVersion2', DesignVersionStatus.VERSION_UPDATABLE, 'gloria');
    });


    // Consequences
    it('When a new Design Version is created all Design Components in the previous version are copied to it', function(){

        // Setup
        // Publish the Design Version
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');

        // Execute
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');

        // Verify - new DV created with default name as well as DV1
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', 'DesignVersion1');
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        // Select the new DV and give it a name
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion2', RoleType.DESIGNER, 'gloria');

        // Check that all Design Components now exist for both new DV and old DV
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion2', ComponentType.APPLICATION, 'Application1');
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion1', ComponentType.APPLICATION, 'Application1');
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion2', ComponentType.DESIGN_SECTION, 'Section1');
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion1', ComponentType.DESIGN_SECTION, 'Section1');
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion2', ComponentType.FEATURE, 'Feature1');
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion1', ComponentType.FEATURE, 'Feature1');
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion2', ComponentType.FEATURE_ASPECT, 'Actions');
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion1', ComponentType.FEATURE_ASPECT, 'Actions');
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion2', ComponentType.FEATURE_ASPECT, 'Conditions');
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion1', ComponentType.FEATURE_ASPECT, 'Conditions');
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion2', ComponentType.SCENARIO, 'Scenario1');
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion1', ComponentType.SCENARIO, 'Scenario1');
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion2', ComponentType.SCENARIO, 'Scenario2');
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion1', ComponentType.SCENARIO, 'Scenario2');

        // And check that they are in the right places
        server.call('verifyDesignComponents.componentInDesignVersionParentIs', 'Design1', 'DesignVersion2', ComponentType.APPLICATION, 'Application1', 'NONE');
        server.call('verifyDesignComponents.componentInDesignVersionParentIs', 'Design1', 'DesignVersion2', ComponentType.DESIGN_SECTION, 'Section1', 'Application1');
        server.call('verifyDesignComponents.componentInDesignVersionParentIs', 'Design1', 'DesignVersion2', ComponentType.FEATURE, 'Feature1', 'Section1');
        server.call('verifyDesignComponents.componentInDesignVersionParentIs', 'Design1', 'DesignVersion2', ComponentType.FEATURE_ASPECT, 'Actions', 'Feature1');
        server.call('verifyDesignComponents.componentInDesignVersionParentIs', 'Design1', 'DesignVersion2', ComponentType.FEATURE_ASPECT, 'Conditions', 'Feature1');
        server.call('verifyDesignComponents.componentInDesignVersionParentIs', 'Design1', 'DesignVersion2', ComponentType.SCENARIO, 'Scenario1', 'Actions');
        server.call('verifyDesignComponents.componentInDesignVersionParentIs', 'Design1', 'DesignVersion2', ComponentType.SCENARIO, 'Scenario2', 'Conditions');

    });

    it('When a new Design Version is created, the previous Design Version becomes Complete', function(){
        // These previous tests are actually testing this
        const params1 = {
            designName: 'Design1',
            designVersionName: 'DesignVersion1'
        };

        DesignVersionActions.designerCreateNewDesignVersionFromDraft(params1);

        const params2 = {
            designName: 'Design1',
            firstDesignVersion: 'DesignVersion1',
            secondDesignVersion: 'DesignVersion2',
            designUpdate: 'DesignUpdate1'
        };

        DesignVersionActions.designerCreateNewDesignVersionFromUpdatable(params2);
    });

    it('When a new Design Version is created Design Updates selected for Merge are included in it', function(){
        // Setup
        // Publish the New Design Version
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        // Create an Updatable DV from it
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion2', RoleType.DESIGNER, 'gloria');

        // Add a Design Update so it can be completed
        du.designerAddsAnUpdateCalled('DesignUpdate1');

        // Add new functionality to the update
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        // New section - Section99
        server.call('testDesignUpdateComponents.addDesignSectionToApplication', 'NONE', 'Application1', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.DESIGN_SECTION, 'Application1', DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section99', 'gloria', ViewMode.MODE_EDIT);
        // New Feature - Feature99
        server.call('testDesignUpdateComponents.addFeatureToDesignSection', 'Application1', 'Section99', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE, 'Section99', DefaultComponentNames.NEW_FEATURE_NAME, 'Feature99', 'gloria', ViewMode.MODE_EDIT);

        // Set update to INCLUDE
        server.call('testDesignUpdates.updateMergeAction', DesignUpdateMergeAction.MERGE_INCLUDE, RoleType.DESIGNER, 'gloria');
        // Check
        server.call('verifyDesignUpdates.designUpdateMergeActionIs', 'DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE, 'gloria');

        // Execute - create another new DV from DesignVersion2
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion2', RoleType.DESIGNER, 'gloria');

        // Verify - new DV created with default name
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', 'DesignVersion1');
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', 'DesignVersion2');
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        // Select the new DV and name it
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion3', RoleType.DESIGNER, 'gloria');
        // And status should be updatable
        server.call('verifyDesignVersions.designVersionStatusIs', 'DesignVersion3', DesignVersionStatus.VERSION_UPDATABLE, 'gloria');
        // And previous DV should be complete
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('verifyDesignVersions.designVersionStatusIs', 'DesignVersion2', DesignVersionStatus.VERSION_UPDATABLE_COMPLETE, 'gloria');

        // And new DV should include Section99 and Feature99 as well as the original stuff
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion2', ComponentType.APPLICATION, 'Application1');
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion3', ComponentType.APPLICATION, 'Application1');
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion2', ComponentType.DESIGN_SECTION, 'Section1');
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion3', ComponentType.DESIGN_SECTION, 'Section99');
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion3', ComponentType.DESIGN_SECTION, 'Section1');
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion2', ComponentType.FEATURE, 'Feature1');
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion3', ComponentType.FEATURE, 'Feature99');
        server.call('verifyDesignComponents.componentExistsInDesignVersionCalled', 'Design1', 'DesignVersion3', ComponentType.FEATURE, 'Feature1');

        // And check that they are in the right places
        server.call('verifyDesignComponents.componentInDesignVersionParentIs', 'Design1', 'DesignVersion3', ComponentType.APPLICATION, 'Application1', 'NONE');
        server.call('verifyDesignComponents.componentInDesignVersionParentIs', 'Design1', 'DesignVersion3', ComponentType.DESIGN_SECTION, 'Section99', 'Application1');
        server.call('verifyDesignComponents.componentInDesignVersionParentIs', 'Design1', 'DesignVersion3', ComponentType.FEATURE, 'Feature99', 'Section99');

    });

    it('When a new Design Version is created Design Updates selected for Carry Forward are now updates for the new Design Version', function(){

        // Setup
        // Publish the New Design Version
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        // Create an Updatable DV from it
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion2', RoleType.DESIGNER, 'gloria');

        // Add a Design Update so it can be completed
        du.designerAddsAnUpdateCalled('DesignUpdate1');

        // Add new functionality to the first update
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        // New section - Section88
        server.call('testDesignUpdateComponents.addDesignSectionToApplication', 'NONE', 'Application1', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.DESIGN_SECTION, 'Application1', DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section88', 'gloria', ViewMode.MODE_EDIT);
        // New Feature - Feature88
        server.call('testDesignUpdateComponents.addFeatureToDesignSection', 'Application1', 'Section88', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE, 'Section88', DefaultComponentNames.NEW_FEATURE_NAME, 'Feature88', 'gloria', ViewMode.MODE_EDIT);
        // Set update to INCLUDE
        server.call('testDesignUpdates.updateMergeAction', DesignUpdateMergeAction.MERGE_INCLUDE, RoleType.DESIGNER, 'gloria');
        // Check
        server.call('verifyDesignUpdates.designUpdateMergeActionIs', 'DesignUpdate1', DesignUpdateMergeAction.MERGE_INCLUDE, 'gloria');

        // Add another Design Update to roll forward
        du.designerAddsAnUpdateCalled('DesignUpdate2');

        // Add new functionality to the second update
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate2', RoleType.DESIGNER, 'gloria');
        // New section - Section99
        server.call('testDesignUpdateComponents.addDesignSectionToApplication', 'NONE', 'Application1', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.DESIGN_SECTION, 'Application1', DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section99', 'gloria', ViewMode.MODE_EDIT);
        // New Feature - Feature99
        server.call('testDesignUpdateComponents.addFeatureToDesignSection', 'Application1', 'Section99', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE, 'Section99', DefaultComponentNames.NEW_FEATURE_NAME, 'Feature99', 'gloria', ViewMode.MODE_EDIT);
        // Set update to ROLL FORWARD
        server.call('testDesignUpdates.updateMergeAction', DesignUpdateMergeAction.MERGE_ROLL, RoleType.DESIGNER, 'gloria');
        // Check
        server.call('verifyDesignUpdates.designUpdateMergeActionIs', 'DesignUpdate2', DesignUpdateMergeAction.MERGE_ROLL, 'gloria');

        // Execute - create another new DV from DesignVersion2
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion2', RoleType.DESIGNER, 'gloria');

        // Verify - new DV created with default name
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', 'DesignVersion1');
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', 'DesignVersion2');
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME);

        // Select the new DV
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');
        // Verify that DU2 exists for it and is still Draft but now defaulted to INCLUDE
        server.call('verifyDesignUpdates.designUpdateExistsCalled', 'DesignUpdate2', 'gloria');
        server.call('verifyDesignUpdates.designUpdateStatusIs', 'DesignUpdate2', DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT, 'gloria');
        server.call('verifyDesignUpdates.designUpdateMergeActionIs', 'DesignUpdate2', DesignUpdateMergeAction.MERGE_INCLUDE, 'gloria');

        // Select old DV
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        // DU no longer exists for that DV
        server.call('verifyDesignUpdates.designUpdateDoesNotExistCalled', 'DesignUpdate2', 'gloria');

    });

});
