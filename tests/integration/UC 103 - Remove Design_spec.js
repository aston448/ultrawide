import {RoleType, ComponentType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 103 - Remove Design', function() {

    beforeEach(function(){
        server.call('testFixtures.clearAllData');

        // Add  Design - Design1
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
    });

    afterEach(function(){

    });

    it('A Designer can remove a Design that is removable', function() {
        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesigns.removeDesign', 'Design1', 'gloria', RoleType.DESIGNER);

        // Verify ------------------------------------------------------------------------------------------------------
        // Design should not exist
        server.call('verifyDesigns.designDoesNotExistCalled', 'Design1', (function(error, result){expect(!error);}));
    });

    it('A Design can only be removed if it has no Features', function() {
        // Setup -------------------------------------------------------------------------------------------------------
        // Work on Design1
        server.call('testDesigns.workDesign', 'Design1', 'gloria');
        // And edit the default Design Version
        server.call('testDesigns.editDesignVersion', 'Design1', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria', RoleType.DESIGNER);
        // Add an Application - Application1
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        // Add a Design Section - Section1
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        // Add a Feature - Feature1
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesigns.removeDesign', 'Design1', 'gloria', RoleType.DESIGNER);

        // Verify ------------------------------------------------------------------------------------------------------
        // Design should still exist
        server.call('verifyDesigns.designExistsCalled', 'Design1', (function(error, result){expect(!error);}));


    });

    it('A Design can only be removed by a Designer', function() {
        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesigns.removeDesign', 'Design1', 'hugh', RoleType.DEVELOPER);

        // Verify ------------------------------------------------------------------------------------------------------
        // Design should still exist
        server.call('verifyDesigns.designExistsCalled', 'Design1', (function(error, result){expect(!error);}));

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesigns.removeDesign', 'Design1', 'miles', RoleType.MANAGER);

        // Verify ------------------------------------------------------------------------------------------------------
        // Design should still exist
        server.call('verifyDesigns.designExistsCalled', 'Design1', (function(error, result){expect(!error);}));

    });

    it('A Design without Features cannot be removed if it contains a Design Update with Features', function() {
        // Setup -------------------------------------------------------------------------------------------------------
        // Work on Design1
        server.call('testDesigns.workDesign', 'Design1', 'gloria');
        // Name and Publish a Design Version
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', 'gloria', RoleType.DESIGNER);
        // Complete the Design Version and create the next Updatable version
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion2', RoleType.DESIGNER, 'gloria');
        // And edit the new Design Version
        server.call('testDesigns.editDesignVersion', 'Design1', 'DesignVersion2', 'gloria', RoleType.DESIGNER);
        // Add an Application - Application1
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        // Add a Design Section - Section1
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        // Add a Feature - Feature1
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesigns.removeDesign', 'Design1', 'gloria', RoleType.DESIGNER);

        // Verify ------------------------------------------------------------------------------------------------------
        // Design should still exist
        server.call('verifyDesigns.designExistsCalled', 'Design1', (function(error, result){expect(!error);}));
    });


    it('When a Design is removed, all subcomponents of that Design are deleted', function() {
        // Setup -------------------------------------------------------------------------------------------------------
        // Work on Design1
        server.call('testDesigns.workDesign', 'Design1', 'gloria');
        // And edit the default Design Version
        server.call('testDesigns.editDesignVersion', 'Design1', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria', RoleType.DESIGNER);
        // Add an Application - Application1
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        // Add a Design Section - Section1
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesigns.removeDesign', 'Design1', 'gloria', RoleType.DESIGNER);

        // Verify ------------------------------------------------------------------------------------------------------
        // Design should not exist
        server.call('verifyDesigns.designDoesNotExistCalled', 'Design1', (function(error, result){expect(!error);}));
        // Application should not exist
        server.call('verifyDesignComponents.componentDoesNotExistCalled', ComponentType.APPLICATION, 'Application1');
        // Design Section should not exist
        server.call('verifyDesignComponents.componentDoesNotExistCalled', ComponentType.DESIGN_SECTION, 'Section1');



    });

});

