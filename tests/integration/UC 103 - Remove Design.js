import {RoleType, ComponentType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 103 - Remove Design', function() {

    beforeEach(function(){
        server.call('testFixtures.clearAllData');
    });

    afterEach(function(){

    });

    it('A Design can only be removed if it has no Features', function() {
        // Setup -------------------------------------------------------------------------------------------------------
        // Add  Design - Design1
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
        // Work on it
        server.call('testDesigns.workDesign', 'Design1', 'gloria');
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

    it('A Design can only be removed by a Designer');

    it('A Design without Features cannot be removed if it contains a Design Update with Features');

    it('A Designer can remove a Design that is removable');


});

