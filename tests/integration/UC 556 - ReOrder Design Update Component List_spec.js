import {RoleType, ViewMode, ComponentType, DesignVersionStatus, WorkPackageType, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 556 - ReOrder Design Update Component List', function(){

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
    it('A new Application in the Design Update can be moved above another Application', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addApplication', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.APPLICATION, 'NONE', DefaultComponentNames.NEW_APPLICATION_NAME, 'Application2', 'gloria', ViewMode.MODE_EDIT);
        // Verify Application2 is below Application1
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.APPLICATION, 'NONE', 'Application1', 'NONE', 'Application2', 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.reorderDesignComponent', ComponentType.APPLICATION, 'NONE', 'Application2', 'NONE', 'Application1', 'gloria', ViewMode.MODE_EDIT);

        // Verify Application 2 now above Application1
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.APPLICATION, 'NONE', 'Application2', 'NONE', 'Application1', 'gloria');
    });

    it('A new Design Section in the Design Update can be moved above another Design Section', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addDesignSectionToApplication', 'NONE', 'Application1', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.DESIGN_SECTION, 'Application1', DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section3', 'gloria', ViewMode.MODE_EDIT);
        // Verify Section3 is below Section2
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'Application1', 'Section3', 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.reorderDesignComponent', ComponentType.DESIGN_SECTION, 'Application1', 'Section3', 'Application1', 'Section2', 'gloria', ViewMode.MODE_EDIT);

        // Verify Section3 now above Section2
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.DESIGN_SECTION, 'Application1', 'Section3', 'Application1', 'Section2', 'gloria');
    });

    it('A new Feature in the Design Update can be moved above another Feature in its Design Section', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addFeatureToDesignSection', 'Application1', 'Section1', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE, 'Section1', DefaultComponentNames.NEW_FEATURE_NAME, 'Feature3', 'gloria', ViewMode.MODE_EDIT);
        // Verify Feature3 is below Feature1
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.FEATURE, 'Section1', 'Feature1', 'Section1', 'Feature3', 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.reorderDesignComponent', ComponentType.FEATURE, 'Section1', 'Feature3', 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);

        // Verify Section3 now above Section2
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.FEATURE, 'Section1', 'Feature3', 'Section1', 'Feature1', 'gloria');
    });

    it('A new Feature Aspect in the Design Update can be moved above another Feature Aspect in its Feature', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addFeatureAspectToFeature', 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE_ASPECT, 'Feature1', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect1', 'gloria', ViewMode.MODE_EDIT);
        // Verify Aspect1 is below Actions
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'Feature1', 'Aspect1', 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.reorderDesignComponent', ComponentType.FEATURE_ASPECT, 'Feature1', 'Aspect1', 'Feature1', 'Actions', 'gloria', ViewMode.MODE_EDIT);

        // Verify Aspect1 now above Actions
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.FEATURE_ASPECT, 'Feature1', 'Aspect1', 'Feature1', 'Actions', 'gloria');
    });

    it('A new Scenario in the Design Update can be moved above another Scenario in its Feature', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addScenarioToFeature', 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.SCENARIO, 'Feature1', DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario99', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.addScenarioToFeature', 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.SCENARIO, 'Feature1', DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario55', 'gloria', ViewMode.MODE_EDIT);

        // Verify Scenario55 is below Scenario99
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.SCENARIO, 'Feature1', 'Scenario99', 'Feature1', 'Scenario55', 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.reorderDesignComponent', ComponentType.SCENARIO, 'Feature1', 'Scenario55', 'Feature1', 'Scenario99', 'gloria', ViewMode.MODE_EDIT);

        // Verify Scenario55 now above Scenario99
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.SCENARIO, 'Feature1', 'Scenario55', 'Feature1', 'Scenario99', 'gloria');
    });

    it('A new Scenario in the Design Update can be moved above another Scenario in its Feature Aspect', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addScenarioToFeatureAspect', 'Feature1', 'Actions', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.SCENARIO, 'Actions', DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario99', 'gloria', ViewMode.MODE_EDIT);

        // Verify Scenario99 is below Scenario1
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'Actions', 'Scenario99', 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.reorderDesignComponent', ComponentType.SCENARIO, 'Actions', 'Scenario99', 'Actions', 'Scenario1', 'gloria', ViewMode.MODE_EDIT);

        // Verify Scenario99 now above Scenario1
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.SCENARIO, 'Actions', 'Scenario99', 'Actions', 'Scenario1', 'gloria');
    });


    // Conditions
    it('An existing Application from the Base Design Version cannot be reordered in a Design Update', function(){

        // Setup - verify that Application1 is above Application99
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.APPLICATION, 'NONE', 'Application1', 'NONE', 'Application99', 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.reorderDesignComponent', ComponentType.APPLICATION, 'NONE', 'Application99', 'NONE', 'Application1', 'gloria', ViewMode.MODE_EDIT);

        // Verify no change
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.APPLICATION, 'NONE', 'Application1', 'NONE', 'Application99', 'gloria');
    });

    it('An existing Design Section from the Base Design Version cannot be reordered in a Design Update', function(){

        // Setup - verify that Section1 is above Section2
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'Application1', 'Section2', 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.reorderDesignComponent', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'Application1', 'Section1', 'gloria', ViewMode.MODE_EDIT);

        // Verify no change
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'Application1', 'Section2', 'gloria');
    });

    it('An existing Feature from the Base Design Version cannot be reordered in a Design Update', function(){

        // Setup - verify that Feature1 is above Feature2
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.FEATURE, 'Section1', 'Feature1', 'Section1', 'Feature2', 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.reorderDesignComponent', ComponentType.FEATURE, 'Section1', 'Feature2', 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);

        // Verify no change
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.FEATURE, 'Section1', 'Feature1', 'Section1', 'Feature2', 'gloria');
    });

    it('An existing Feature Aspect from the Base Design Version cannot be reordered in a Design Update', function(){

        // Setup - verify that Actions is above Conditions
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'Feature1', 'Conditions', 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.reorderDesignComponent', ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions', 'Feature1', 'Actions', 'gloria', ViewMode.MODE_EDIT);

        // Verify no change
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'Feature1', 'Conditions', 'gloria');
    });

    it('An existing Scenario from the Base Design Version cannot be reordered in a Design Update', function(){

        // Setup - verify that Scenario1 is above Scenario444
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'Actions', 'Scenario444', 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.reorderDesignComponent', ComponentType.SCENARIO, 'Actions', 'Scenario444', 'Actions', 'Scenario1', 'gloria', ViewMode.MODE_EDIT);

        // Verify no change
        server.call('verifyDesignUpdateComponents.componentIsAboveComponent', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'Actions', 'Scenario444', 'gloria');
    });

});
