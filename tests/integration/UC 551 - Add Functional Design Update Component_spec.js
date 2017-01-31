import {RoleType, ViewMode, ComponentType, DesignVersionStatus, WorkPackageType, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 551 - Add Functional Design Update Component', function(){

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
    });

    afterEach(function(){

    });


    // Actions
    it('A Feature can be added to a Design Update Design Section', function(){

        //Setup - add a new Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');

        // Add new Feature to original Section 1
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.addFeatureToDesignSection', 'Application1', 'Section1', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.FEATURE, 'Section1', DefaultComponentNames.NEW_FEATURE_NAME, 'gloria');
    });

    it('A Scenario can be added to an in Scope Design Update Feature', function(){

        //Setup - add a new Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        // Make sure Feature1 is in Scope
        server.call('testDesignUpdateComponents.addComponentToUpdateScope', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);

        // Add new Scenario to original Feature 1
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.addScenarioToFeature', 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.SCENARIO, 'Feature1', DefaultComponentNames.NEW_SCENARIO_NAME, 'gloria');
    });

    it('A Scenario can be added to an in Scope Design Update Feature Aspect', function(){

        //Setup - add a new Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        // Make sure Feature1 Actions is in Scope
        server.call('testDesignUpdateComponents.addComponentToUpdateScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria', ViewMode.MODE_EDIT);

        // Add new Scenario to original Feature 1 Actions
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.addScenarioToFeatureAspect', 'Feature1', 'Actions', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.SCENARIO, 'Actions', DefaultComponentNames.NEW_SCENARIO_NAME, 'gloria');
    });


    // Conditions
    it('A Scenario cannot be added to a Feature that is not in Scope for the Design Update', function(){

        //Setup - add a new Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        // Feature1 not in scope

        // Add new Scenario to original Feature 1
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.addScenarioToFeature', 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignUpdateComponents.componentDoesNotExistCalled', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'gloria');
    });

    it('A Scenario cannot be added to a Feature Aspect that is not in Scope for the Design Update', function(){

        //Setup - add a new Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        // Actions is not in scope

        // Add new Scenario to original Feature 1 Actions
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.addScenarioToFeatureAspect', 'Feature1', 'Actions', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignUpdateComponents.componentDoesNotExistCalled', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'gloria');
    });

    it('A functional Design Update Component cannot be added to a component removed in this or another Design Update');


    // Consequences
    it('When a functional Design Component is added to a Design Update it is also added to the Design Update Scope');

    it('When a functional Design Component is added to a Draft Design Update it is also added to generic Design Update Work Package scope');

    it('A functional Design Component added to a Design Update appears as a functional addition in the Design Update summary');

});
