import {RoleType, ViewMode, ComponentType, DesignVersionStatus, WorkPackageType, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 559 - Remove New Design Update Component', function(){

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
    it('A new Application with no children in a Design Update can be removed', function(){

        // Setup - add new Application
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.addApplication', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.APPLICATION, 'NONE', DefaultComponentNames.NEW_APPLICATION_NAME, 'Application2', 'gloria', ViewMode.MODE_EDIT);

        // Remove Application
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.APPLICATION, 'NONE', 'Application2', 'gloria', ViewMode.MODE_EDIT);

        // Verify completely gone
        server.call('verifyDesignUpdateComponents.componentDoesNotExistCalled', ComponentType.APPLICATION, 'Application2', 'gloria');
    });

    it('A new Design Section with no children in a Design Update can be removed', function(){

        // Setup - add new Section
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.addDesignSectionToApplication', 'NONE', 'Application1', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.DESIGN_SECTION, 'Application1', DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section3', 'gloria', ViewMode.MODE_EDIT);

        // Remove Section
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.DESIGN_SECTION, 'Application1', 'Section3', 'gloria', ViewMode.MODE_EDIT);

        // Verify completely gone
        server.call('verifyDesignUpdateComponents.componentDoesNotExistCalled', ComponentType.DESIGN_SECTION, 'Section3', 'gloria');
    });

    it('A new Feature with no children in a Design Update can be removed', function(){

        // Setup - add new Feature - need to remove default Feature Aspects
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.addFeatureToDesignSection', 'Application1', 'Section1', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE, 'Section1', DefaultComponentNames.NEW_FEATURE_NAME, 'Feature3', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.FEATURE_ASPECT, 'Feature3', 'Interface', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.FEATURE_ASPECT, 'Feature3', 'Actions', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.FEATURE_ASPECT, 'Feature3', 'Conditions', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.FEATURE_ASPECT, 'Feature3', 'Consequences', 'gloria', ViewMode.MODE_EDIT);

        // Remove Feature
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.FEATURE, 'Section1', 'Feature3', 'gloria', ViewMode.MODE_EDIT);

        // Verify completely gone
        server.call('verifyDesignUpdateComponents.componentDoesNotExistCalled', ComponentType.FEATURE, 'Feature3', 'gloria');
    });

    it('A new Feature Aspect with no children in a Design Update can be removed', function(){

        // Setup - add new Feature Aspect
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.addComponentToUpdateScope', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.addFeatureAspectToFeature', 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE_ASPECT, 'Feature1', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect1', 'gloria', ViewMode.MODE_EDIT);

        // Remove Feature Aspect
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.FEATURE_ASPECT, 'Feature1', 'Aspect1', 'gloria', ViewMode.MODE_EDIT);

        // Verify completely gone
        server.call('verifyDesignUpdateComponents.componentDoesNotExistCalled', ComponentType.FEATURE_ASPECT, 'Aspect1', 'gloria');
    });

    it('A new Scenario with no Scenario Steps in a Design Update can be removed');


    // Conditions
    it('A new Application cannot be removed from a Design Update if it has children', function(){

        // Setup - add new Application
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.addApplication', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.APPLICATION, 'NONE', DefaultComponentNames.NEW_APPLICATION_NAME, 'Application2', 'gloria', ViewMode.MODE_EDIT);
        // And add a Section to it
        server.call('testDesignUpdateComponents.addDesignSectionToApplication', 'NONE', 'Application2', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.DESIGN_SECTION, 'Application2', DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section3', 'gloria', ViewMode.MODE_EDIT);

        // Remove Application
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.APPLICATION, 'NONE', 'Application2', 'gloria', ViewMode.MODE_EDIT);

        // Verify not removed
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.APPLICATION, 'NONE', 'Application2', 'gloria');
    });

    it('A new Design Section cannot be removed from a Design Update if it has children', function(){

        // Setup - add new Section
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.addDesignSectionToApplication', 'NONE', 'Application1', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.DESIGN_SECTION, 'Application1', DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section3', 'gloria', ViewMode.MODE_EDIT);
        // Add Feature to it
        server.call('testDesignUpdateComponents.addFeatureToDesignSection', 'Application1', 'Section3', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE, 'Section3', DefaultComponentNames.NEW_FEATURE_NAME, 'Feature3', 'gloria', ViewMode.MODE_EDIT);

        // Remove Section
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.DESIGN_SECTION, 'Application1', 'Section3', 'gloria', ViewMode.MODE_EDIT);

        // Verify not removed
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.DESIGN_SECTION, 'Application1', 'Section3', 'gloria');
    });

    it('A new Feature cannot be removed from a Design Update if it has children', function(){

        // Setup - add new Feature - automatically adds aspects as children
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.addFeatureToDesignSection', 'Application1', 'Section1', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE, 'Section1', DefaultComponentNames.NEW_FEATURE_NAME, 'Feature3', 'gloria', ViewMode.MODE_EDIT);

        // Remove Feature
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.FEATURE, 'Section1', 'Feature3', 'gloria', ViewMode.MODE_EDIT);

        // Verify not removed
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.FEATURE, 'Section1', 'Feature3', 'gloria');
    });

    it('A new Feature Aspect cannot be removed from a Design Update if it has children', function(){

        // Setup - add new Feature - automatically adds aspects as children
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.addFeatureToDesignSection', 'Application1', 'Section1', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE, 'Section1', DefaultComponentNames.NEW_FEATURE_NAME, 'Feature3', 'gloria', ViewMode.MODE_EDIT);
        // Add Scenario to Actions aspect
        server.call('testDesignUpdateComponents.addScenarioToFeatureAspect', 'Feature3', 'Actions', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.SCENARIO, 'Actions', DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario99', 'gloria', ViewMode.MODE_EDIT);

        // Remove Feature Aspect
        server.call('testDesignUpdateComponents.removeDesignComponent', ComponentType.FEATURE_ASPECT, 'Feature3', 'Actions', 'gloria', ViewMode.MODE_EDIT);

        // Verify not removed
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.FEATURE_ASPECT, 'Feature3', 'Actions', 'gloria');

    });

    it('A new Scenario cannot be removed from a Design Update if it has Scenario Steps');

});
