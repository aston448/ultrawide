import {RoleType, ViewMode, ComponentType, DesignVersionStatus, WorkPackageType, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 555 - Move Design Update Component', function(){

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

        // Create some new data in the Design Update
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        // App 2
        server.call('testDesignUpdateComponents.addApplication', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.APPLICATION, 'NONE', DefaultComponentNames.NEW_APPLICATION_NAME, 'Application2', 'gloria', ViewMode.MODE_EDIT);

    });

    afterEach(function(){

    });


    // Actions
    it('A new Design Section for a Design Update can be moved to a different Application', function(){

        // Setup - add new Design section to Application1
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addDesignSectionToApplication', 'NONE', 'Application1', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.DESIGN_SECTION, 'Application1', DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section3', 'gloria', ViewMode.MODE_EDIT);

        // Execute - move it to Application2
        server.call(
            'testDesignUpdateComponents.moveDesignComponent',
            ComponentType.DESIGN_SECTION, 'Application1', 'Section3',
            ComponentType.APPLICATION, 'NONE', 'Application2',
            'gloria', ViewMode.MODE_EDIT
        );

        // Verify parent now Application2
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.DESIGN_SECTION, 'Application2', 'Section3', 'gloria');
    });

    it('A new Design Section for a Design Update can be moved to a different Design Section', function(){

        // Setup - add new Design section to Section1
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addSectionToDesignSection', 'Application1', 'Section1', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.DESIGN_SECTION, 'Section1', DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'SubSection1', 'gloria', ViewMode.MODE_EDIT);

        // Execute - move it to Section2
        server.call(
            'testDesignUpdateComponents.moveDesignComponent',
            ComponentType.DESIGN_SECTION, 'Section1', 'SubSection1',
            ComponentType.DESIGN_SECTION, 'Application1', 'Section2',
            'gloria', ViewMode.MODE_EDIT
        );

        // Verify parent now Section2
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.DESIGN_SECTION, 'Section2', 'SubSection1', 'gloria');
    });

    it('A new Feature for a Design Update can be moved to a different Design Section', function(){

        // Setup - add new Feature to Section1
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addFeatureToDesignSection', 'Application1', 'Section1', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE, 'Section1', DefaultComponentNames.NEW_FEATURE_NAME, 'Feature3', 'gloria', ViewMode.MODE_EDIT);

        // Execute - move it to Section2
        server.call(
            'testDesignUpdateComponents.moveDesignComponent',
            ComponentType.FEATURE, 'Section1', 'Feature3',
            ComponentType.DESIGN_SECTION, 'Application1', 'Section2',
            'gloria', ViewMode.MODE_EDIT
        );

        // Verify parent now Section2
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.FEATURE, 'Section2', 'Feature3', 'gloria');
    });

    it('A new Scenario for a Design Update can be moved to a different Feature', function(){

        // Setup - add new Scenario to Feature1
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addScenarioToFeature', 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.SCENARIO, 'Feature1', DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario99', 'gloria', ViewMode.MODE_EDIT);
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.SCENARIO, 'Feature1', 'Scenario99', 'gloria');

        // Execute - move it to Feature2
        server.call(
            'testDesignUpdateComponents.moveDesignComponent',
            ComponentType.SCENARIO, 'Feature1', 'Scenario99',
            ComponentType.FEATURE, 'Section2', 'Feature2',
            'gloria', ViewMode.MODE_EDIT
        );

        // Verify parent now Feature2
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.SCENARIO, 'Feature2', 'Scenario99', 'gloria');
    });

    it('A new Scenario for a Design Update can be moved to a different Feature Aspect', function(){

        // Setup - add new Scenario to Feature1 Actions
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addScenarioToFeatureAspect', 'Feature1', 'Actions', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.SCENARIO, 'Actions', DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario99', 'gloria', ViewMode.MODE_EDIT);

        // Execute - move it to Feature2 Conditions
        server.call(
            'testDesignUpdateComponents.moveDesignComponent',
            ComponentType.SCENARIO, 'Actions', 'Scenario99',
            ComponentType.FEATURE_ASPECT, 'Feature2', 'Conditions',
            'gloria', ViewMode.MODE_EDIT
        );

        // Verify parent now Feature2 Conditions
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.SCENARIO, 'Conditions', 'Scenario99', 'gloria');
    });

    it('A new Feature Aspect for a Design Update can be moved to a different Feature');


    // Conditions
    it('An existing Design Section from the Base Design Version cannot be moved', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);

        // Execute - Try to move existing Section1 to Application2
        server.call(
            'testDesignUpdateComponents.moveDesignComponent',
            ComponentType.DESIGN_SECTION, 'Application1', 'Section1',
            ComponentType.APPLICATION, 'NONE', 'Application2',
            'gloria', ViewMode.MODE_EDIT
        );

        // Verify parent still Application1
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
    });

    it('An existing Feature from the Base Design Version cannot be moved', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);

        // Execute - Try to move existing Feature1 to Section2
        server.call(
            'testDesignUpdateComponents.moveDesignComponent',
            ComponentType.FEATURE, 'Section1', 'Feature1',
            ComponentType.DESIGN_SECTION, 'Application1', 'Section2',
            'gloria', ViewMode.MODE_EDIT
        );

        // Verify parent still Section1
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
    });

    it('An existing Feature Aspect from the Base Design Version cannot be moved', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        // Rename Feature2 Actions to rule out any duplicate name problems
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE_ASPECT, 'Feature2', 'Actions', 'Actions1', 'gloria', ViewMode.MODE_EDIT);

        // Execute - Try to move existing Feature1 Actions to Feature2
        server.call(
            'testDesignUpdateComponents.moveDesignComponent',
            ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions',
            ComponentType.FEATURE, 'Section2', 'Feature2',
            'gloria', ViewMode.MODE_EDIT
        );

        // Verify parent still Feature1
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
    });

    it('An existing Scenario from the Base Design Version cannot be moved', function(){

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);

        // Execute - Try to move existing Scenario1 to Feature1 Conditions
        server.call(
            'testDesignUpdateComponents.moveDesignComponent',
            ComponentType.SCENARIO, 'Actions', 'Scenario1',
            ComponentType.FEATURE_ASPECT, 'Feature1', 'Conditions',
            'gloria', ViewMode.MODE_EDIT
        );

        // Verify parent still Application1
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
    });

});
