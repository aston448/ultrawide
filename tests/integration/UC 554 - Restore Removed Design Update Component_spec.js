import {RoleType, ViewMode, ComponentType, DesignVersionStatus, WorkPackageType, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 554 - Restore Removed Design Update Component', function(){

    before(function(){

        server.call('testFixtures.clearAllData');

        // Create a Design
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        // Name and Publish a Design Version
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        // Add Basic Data to the Design Version
        server.call('testDesigns.editDesignVersion', 'Design1', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        server.call('testFixtures.AddBasicDesignData', 'Design1', 'DesignVersion1');
        // Complete the Design Version and create the next
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion2', RoleType.DESIGNER, 'gloria');
    });

    after(function(){

    });

    beforeEach(function(){

        // Remove any Design Updates before each test
        server.call('textFixtures.clearDesignUpdates');

        // And create a new update to work with
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
    });

    afterEach(function(){

    });


    // Actions
    it('A removed existing Application and all its child Design Components can be restored', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria', ViewMode.MODE_EDIT);
        // Verify - all stuff removed
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.restoreDesignComponent', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');
    });

    it('A removed existing Design Section and all its child Design Components can be restored', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria', ViewMode.MODE_EDIT);
        // Verify - all stuff removed
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.restoreDesignComponent', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');
    });

    it('A removed existing Feature and all its child Design Components can be restored', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);
        // Verify - all stuff removed
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.restoreDesignComponent', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');
    });

    it('A removed existing Feature Aspect and all its child Design Components can be restored', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria', ViewMode.MODE_EDIT);
        // Verify - all stuff removed
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.restoreDesignComponent', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');
    });

    it('A removed existing Scenario can be restored', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria', ViewMode.MODE_EDIT);
        // Verify - all stuff removed
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.restoreDesignComponent', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');
    });


    // Conditions

    it('A Design Update Component that is the child of a removed Design Update Component cannot be restored', function(){

        // Setup - remove everything
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria', ViewMode.MODE_EDIT);

        // Try to restore Section1
        server.call('testDesignUpdateComponents.restoreDesignComponent', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria', ViewMode.MODE_EDIT);

        // Everything still removed
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');

        // Try to restore Feature 1
        server.call('testDesignUpdateComponents.restoreDesignComponent', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);

        // Everything still removed
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');

        // Try to restore Feature1 Actions
        server.call('testDesignUpdateComponents.restoreDesignComponent', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria', ViewMode.MODE_EDIT);

        // Everything still removed
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');

        // Try to restore Scenario1
        server.call('testDesignUpdateComponents.restoreDesignComponent', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria', ViewMode.MODE_EDIT);

        // Everything still removed
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');

    });


    // Consequences
    it('Restoring an existing Design Update Component updates it as no longer removed in the Design Update Scope');

    it('Restoring an existing Design Component updates it as no longer removed in other Design Updates for the current Design Version');

});
