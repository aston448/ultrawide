import {RoleType, ViewMode, ComponentType, DesignVersionStatus, WorkPackageType, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 553 - Mark Existing Design Update Component as Removed', function(){

    before(function(){

        server.call('testFixtures.clearAllData');

        // Create a Design
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        // Name and Publish a Design Version
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', 'gloria', RoleType.DESIGNER);
        // Add Basic Data to the Design Version
        server.call('testDesigns.editDesignVersion', 'Design1', 'DesignVersion1', 'gloria', RoleType.DESIGNER);
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
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');

    });

    afterEach(function(){

    });


    // Actions
    it('An existing Application and all Design Components below it can be removed in a Design Update', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);

        // Execute
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria', ViewMode.MODE_EDIT);

        // Verify - everything in the design update should be in scope or parent scope and removed
        // Application1
        server.call('verifyDesignUpdateComponents.componentIsInParentScope', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        // Section1
        server.call('verifyDesignUpdateComponents.componentIsInParentScope', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        // Feature1
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        // Feature1 Actions
        server.call('verifyDesignUpdateComponents.componentIsInParentScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        // Scenario1
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        // Feature1 Conditions
        server.call('verifyDesignUpdateComponents.componentIsInParentScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        // Scenario2
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        // Section2
        server.call('verifyDesignUpdateComponents.componentIsInParentScope', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        // Feature2
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        // Feature2 Actions
        server.call('verifyDesignUpdateComponents.componentIsInParentScope', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        // Scenario3
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        // Feature2 Conditions
        server.call('verifyDesignUpdateComponents.componentIsInParentScope', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        // Scenario4
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');
    });

    it('An existing Design Section and all Design Components below it can be removed in a Design Update', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);

        // Execute
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria', ViewMode.MODE_EDIT);

        // Verify - everything in the design update below Section1 should be in scope or parent scope and removed

        // Application1 is not removed and not in scope
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');

        // Section1 and all below it are removed and in scope
        server.call('verifyDesignUpdateComponents.componentIsInParentScope', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        // Feature1
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        // Feature1 Actions
        server.call('verifyDesignUpdateComponents.componentIsInParentScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        // Scenario1
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        // Feature1 Conditions
        server.call('verifyDesignUpdateComponents.componentIsInParentScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        // Scenario2
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');

        // Section2 and all below it are not removed and not in scope
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        // Feature2
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        // Feature2 Actions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        // Scenario3
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        // Feature2 Conditions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        // Scenario4
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');
    });

    it('An existing Feature and all Design Components below it can be removed in a Design Update', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);

        // Execute
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);

        // Verify - everything in the design update below Feature1 should be in scope or parent scope and removed

        // Application1 is not removed and not in scope
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');

        // Section1 is not removed and not in scope
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');

        // Feature1 and all below it is in scope and removed
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        // Feature1 Actions
        server.call('verifyDesignUpdateComponents.componentIsInParentScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        // Scenario1
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        // Feature1 Conditions
        server.call('verifyDesignUpdateComponents.componentIsInParentScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        // Scenario2
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');

        // Section2 and all below it are not removed and not in scope
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        // Feature2
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        // Feature2 Actions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        // Scenario3
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        // Feature2 Conditions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        // Scenario4
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');
    });

    it('An existing Feature Aspect and all Design Components below it can be removed in a Design Update', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);

        // Execute
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria', ViewMode.MODE_EDIT);

        // Verify - everything in the design update below Feature1 Actions should be in scope or parent scope and removed

        // Application1 is not removed and not in scope
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');

        // Section1 is not removed and not in scope
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');

        // Feature1 is not removed and not in scope
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');

        // Feature1 Actions is removed and scenarios below it
        server.call('verifyDesignUpdateComponents.componentIsInParentScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        // Scenario1
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');

        // Feature1 Conditions is not removed
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        // Scenario2
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');

        // Section2 and all below it are not removed and not in scope
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        // Feature2
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        // Feature2 Actions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        // Scenario3
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        // Feature2 Conditions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        // Scenario4
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');
    });

    it('An existing Scenario can be removed in a Design Update', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);

        // Execute
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria', ViewMode.MODE_EDIT);

        // Verify - only Scenario1 is in scope and removed

        // Application1 is not removed and not in scope
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');

        // Section1 is not removed and not in scope
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');

        // Feature1 is not removed and not in scope
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');

        // Feature1 Actions is not removed and not in scope
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');

        // Scenario1 is removed and in scope
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');

        // Feature1 Conditions is not removed
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        // Scenario2
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');

        // Section2 and all below it are not removed and not in scope
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        // Feature2
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        // Feature2 Actions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        // Scenario3
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        // Feature2 Conditions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        // Scenario4
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');
    });


    // Conditions
    it('A existing Design Update Component can only be removed in a Design Update in edit mode', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);

        // Execute - remove Scenario 1 in view mode
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria', ViewMode.MODE_VIEW);

        // Verify - nothing is removed or in scope

        // Application1
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        // Section1
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        // Feature1
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        // Feature1 Actions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        // Scenario1
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        // Feature1 Conditions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        // Scenario2
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        // Section2
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        // Feature2
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        // Feature2 Actions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        // Scenario3
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        // Feature2 Conditions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        // Scenario4
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');
    });

    it('An existing Design Update Component cannot be removed if any new Design Update Components have been added inside it in the current Design Update', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        // Add a new Scenario to Feature1 Actions
        server.call('testDesignUpdateComponents.addScenarioToFeatureAspect', 'Feature1', 'Actions', 'gloria', ViewMode.MODE_EDIT);

        // Execute - Try to remove the whole Application
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria', ViewMode.MODE_EDIT);

        // Verify - nothing existing is removed - stuff could be in scope

        // Application1
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        // Section1
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        // Feature1
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        // Feature1 Actions
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        // Scenario1
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        // Feature1 Conditions
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        // Scenario2
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        // Section2
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        // Feature2
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        // Feature2 Actions
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        // Scenario3
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        // Feature2 Conditions
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        // Scenario4
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');

        // Except the new Scenario which is in scope
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.SCENARIO, 'Actions', DefaultComponentNames.NEW_SCENARIO_NAME, 'gloria');
    });

    it('An existing Design Update Component cannot be removed if any new Design Update Components have been added inside it in another Design Update', function(){

        // Setup Add a second Design Update...
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate2', RoleType.DESIGNER, 'gloria');

        // Add a new Scenario to Feature1 Actions in DesignUpdate2
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate2', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addScenarioToFeatureAspect', 'Feature1', 'Actions', 'gloria', ViewMode.MODE_EDIT);
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.SCENARIO, 'Actions', DefaultComponentNames.NEW_SCENARIO_NAME, 'gloria');

        // Execute - Try to remove the whole Application from DesignUpdate1
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria', ViewMode.MODE_EDIT);

        // Verify - nothing existing is removed

        // Application1
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        // Section1
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        // Feature1
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        // Feature1 Actions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        // Scenario1
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        // Feature1 Conditions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        // Scenario2
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        // Section2
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        // Feature2
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        // Feature2 Actions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        // Scenario3
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        // Feature2 Conditions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        // Scenario4
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');

        // And the new Scenario is still in scope for DesignUpdate2
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate2', 'gloria', RoleType.DESIGNER);
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.SCENARIO, 'Actions', DefaultComponentNames.NEW_SCENARIO_NAME, 'gloria');
    });

    it('An existing Design Update Component cannot be removed if any Design Update Components inside it are in Scope in another Design Update', function(){

        // Setup Add a second Design Update...
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate2', RoleType.DESIGNER, 'gloria');

        // Add Scenario1 to the Scope of DesignUpdate2
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate2', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addComponentToUpdateScope', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria', ViewMode.MODE_EDIT);
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');

        // Execute - Try to remove the whole Application from DesignUpdate1
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria', ViewMode.MODE_EDIT);

        // Verify - nothing existing is removed or in scope

        // Application1
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        // Section1
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        // Feature1
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        // Feature1 Actions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        // Scenario1
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        // Feature1 Conditions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        // Scenario2
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        // Section2
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        // Feature2
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
        // Feature2 Actions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'gloria');
        // Scenario3
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario3', 'gloria');
        // Feature2 Conditions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions', 'gloria');
        // Scenario4
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario4', 'gloria');
    });


    // Consequences
    it('Removing an existing Design Update Component sets it and all of its children as removed in the Design Update Scope');

    it('Removing an existing Design Update Component updates it as removed in other Design Updates for the current Design Version', function(){

        // Setup Add a second Design Update...
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate2', RoleType.DESIGNER, 'gloria');

        // Execute - remove Feature1 from DesignUpdate1
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.logicallyDeleteDesignComponent', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);

        // Feature1 and all below it is in scope and removed
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        // Feature1 Actions
        server.call('verifyDesignUpdateComponents.componentIsInParentScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        // Scenario1
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        // Feature1 Conditions
        server.call('verifyDesignUpdateComponents.componentIsInParentScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        // Scenario2
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');

        // And in DesignUpdate2 same stuff is removed but not in scope
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate2', 'gloria', RoleType.DESIGNER);

        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        // Feature1 Actions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        // Scenario1
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
        // Feature1 Conditions
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'gloria');
        // Scenario2
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsRemoved', ComponentType.SCENARIO, 'Conditions', 'Scenario2', 'gloria');

    });

    it('Removing an existing Design Update Component sets it and any children as in Scope for the Design Update where it is removed');

});
