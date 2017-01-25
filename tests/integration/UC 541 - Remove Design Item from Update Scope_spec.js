import {RoleType, ViewMode, ComponentType, DesignVersionStatus, WorkPackageType, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 541 - Remove Design Item from Update Scope', function(){

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
    it('An existing Feature can be removed from Design Update Scope', function(){

        //Setup - add a new Update and add Feature1 to scope
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.addComponentToUpdateScope', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.removeComponentFromUpdateScope', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');

    });

    it('An existing Feature Aspect can be removed from Design Update Scope', function(){

        //Setup - add a new Update and add Feature1 Actions to scope
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.addComponentToUpdateScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria', ViewMode.MODE_EDIT);
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.removeComponentFromUpdateScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE_ASPECT, 'Feature1', 'Actions', 'gloria');
    });

    it('An existing Scenario can be removed from Design Update Scope', function(){

        //Setup - add a new Update and add Scenario1 to scope
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdateComponents.addComponentToUpdateScope', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria', ViewMode.MODE_EDIT);
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.removeComponentFromUpdateScope', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.SCENARIO, 'Actions', 'Scenario1', 'gloria');
    });


    // Conditions
    it('A new Feature in the Design Update cannot be removed from the Design Update Scope');

    it('A new Feature Aspect in the Design Update cannot be removed from the Design Update Scope');

    it('A new Scenario in the Design Update cannot be removed from the Design Update Scope');

    it('An existing Feature cannot be removed from Design Update Scope if new Scenarios have been added to it');

    it('An existing Feature Aspect cannot be removed from Design Update Scope if new Scenarios have been added to it');


    // Consequences
    it('When a Design Component is removed from Design Update Scope it disappears from the Design Update editor');

    it('When a Design Component that is the parent of an in scope Design Component in the Design Update is removed from scope it becomes non-editable in the Design Update editor');

});
