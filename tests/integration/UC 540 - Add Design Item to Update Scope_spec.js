import {RoleType, ViewMode, ComponentType, DesignVersionStatus, WorkPackageType, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 540 - Add Design Item to Update Scope', function(){

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
    });

    afterEach(function(){

    });


    // Actions
    it('A Feature can be added to a Design Update Scope', function(){

        // Setup - add a new update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        // Verify that Feature1 is not in the scope yet
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.addComponentToUpdateScope', ComponentType.FEATURE, 'Section1', 'Feature1', ViewMode.MODE_EDIT, 'gloria');

        // Verify
        // Feature1 now in scope
        server.call('verifyDesignUpdateComponents.componentIsInScope', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria');
        // Section1 and Application1 in Parent Scope
        server.call('verifyDesignUpdateComponents.componentIsInParentScope', ComponentType.DESIGN_SECTION, 'Application1', 'Section1', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsInParentScope', ComponentType.APPLICATION, 'NONE', 'Application1', 'gloria');
        // And just confirm Section2, Feature2 still out of scope
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.DESIGN_SECTION, 'Application1', 'Section2', 'gloria');
        server.call('verifyDesignUpdateComponents.componentIsNotInScope', ComponentType.FEATURE, 'Section2', 'Feature2', 'gloria');
    });

    it('A Feature Aspect can be added to a Design Update Scope');

    it('A Scenario can be added to a Design Update Scope');


    // Conditions
    it('A Scenario cannot be added to Design Update Scope if it is in scope for another Design Update for the current Design Version');

    it('A Design Update Component cannot be added to Design Update Scope if it has been removed in another Design Update');

    it('An Application cannot be directly added to Design Update Scope');

    it('A Design Section cannot be directly added to Design Update Scope');

    it('All Applications are in scope by default so that new Design Sections can be added');

    it('All Design Sections are in scope by default so that new Design Sections and Features can be added');

    it('A Design Update Component cannot be added to Design Update Scope if it has been removed in another Design Update for the current Design Version');


    // Consequences
    it('When a Feature is added to Design Update Scope it becomes editable in the Design Update editor');

    it('When a Feature is added to Design Update Scope it is possible to add new Feature Aspects or Scenarios to it');

    it('When a Feature Aspect is added to Design Update Scope it becomes editable in the Design Update editor');

    it('When a Feature Aspect is added to Design Update Scope it is possible to add new Scenarios to it');

    it('When a Scenario is added to Design Update Scope it becomes editable in the Design Update editor');

});
