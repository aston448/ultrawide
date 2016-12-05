
import {RoleType, DesignVersionStatus, ComponentType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 106 - Create New Design Version', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

        server.call('testFixtures.clearAllData');

        // Add  Design - Design1: will create default Design Version
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion1', RoleType.DESIGNER, 'gloria');

        // Add Data to the Design Version
        server.call('testDesigns.editDesignVersion', 'Design1', 'DesignVersion1', 'gloria', RoleType.DESIGNER);
        // Application
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        // Design Section
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        // Feature - has 4 default Aspects
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        // Add Scenarios
        server.call('testDesignComponents.addScenarioToFeatureAspect', 'Feature1', 'Actions');
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario1');
        server.call('testDesignComponents.addScenarioToFeatureAspect', 'Feature1', 'Conditions');
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario2');

    });

    afterEach(function(){

    });


    // Interface
    it('A Design Version in a Draft or Updatable state has an option to create a new Design Version');

    it('A confirmation screen shows the Design Updates to Merge and Carry Forward in the new Design Version');


    // Actions
    it('A Designer can create a new Updatable Design Version from an existing Draft Design Version', function(){

        // Setup
        // Publish the Design Version
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', 'gloria', RoleType.DESIGNER);

        // Execute
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');

        // Verify - new DV created with default name as well as DV1
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', 'DesignVersion1');
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        // Select the new DV
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');
        // And status should be updatable
        server.call('verifyDesignVersions.designVersionStatusIs', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_PUBLISHED_UPDATABLE, 'gloria');
        // And previous DV should be complete
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'gloria');
        server.call('verifyDesignVersions.designVersionStatusIs', 'DesignVersion1', DesignVersionStatus.VERSION_PUBLISHED_COMPLETE, 'gloria');
    });

    it('A Designer can create a new Updatable Design Version from an existing Updatable Design Version', function(){

        // Setup
        // Publish the New Design Version
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', 'gloria', RoleType.DESIGNER);
        // Create an Updatable DV from it
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion2', RoleType.DESIGNER, 'gloria');

        // Execute - create another new DV frm DesignVersion2
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion2', RoleType.DESIGNER, 'gloria');

        // Verify - new DV created with default name
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', 'DesignVersion1');
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', 'DesignVersion2');
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        // Select the new DV
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');
        // And status should be updatable
        server.call('verifyDesignVersions.designVersionStatusIs', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_PUBLISHED_UPDATABLE, 'gloria');
        // And previous DV should be complete
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'gloria');
        server.call('verifyDesignVersions.designVersionStatusIs', 'DesignVersion1', DesignVersionStatus.VERSION_PUBLISHED_COMPLETE, 'gloria');
    });


    // Conditions
    it('Only a Designer can create a new Design Version', function(){

        // Setup
        // Publish the Design Version
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', 'gloria', RoleType.DESIGNER);

        // Execute as Developer
        server.call('testDesigns.selectDesign', 'Design1', 'hugh');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'hugh');
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion1', RoleType.DEVELOPER, 'hugh');

        // Verify - new DV not created
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', 'DesignVersion1');
        server.call('verifyDesignVersions.designVersionDoesNotExistCalled', 'Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        // And DV1 status should still be Draft
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'hugh');
        server.call('verifyDesignVersions.designVersionStatusIs', 'DesignVersion1', DesignVersionStatus.VERSION_PUBLISHED_DRAFT, 'hugh');

        // Execute as Manager
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'miles');
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion1', RoleType.MANAGER, 'miles');

        // Verify - new DV not created
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', 'DesignVersion1');
        server.call('verifyDesignVersions.designVersionDoesNotExistCalled', 'Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        // And DV1 status should still be Draft
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'miles');
        server.call('verifyDesignVersions.designVersionStatusIs', 'DesignVersion1', DesignVersionStatus.VERSION_PUBLISHED_DRAFT, 'miles');

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
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', 'gloria', RoleType.DESIGNER);
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
        server.call('verifyDesignVersions.designVersionStatusIs', 'DesignVersion1', DesignVersionStatus.VERSION_PUBLISHED_COMPLETE, 'gloria');
    });

    it('A new Design Version may not be created from an Updatable Design Version if no Design Updates are selected for inclusion');


    // Consequences
    it('When a new Design Version is created all Design Components in the previous version are copied to it', function(){

        // Setup
        // Publish the Design Version
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', 'gloria', RoleType.DESIGNER);

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

    it('When a new Design Version is created, the previous Design Version becomes Complete');

    it('When a new Design Version is created Design Updates selected for Merge are included in it');

    it('When a new Design Version is created Design Updates selected for Carry Forward are now updates for the new Design Version');

});