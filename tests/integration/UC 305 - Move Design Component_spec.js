import {RoleType, ViewMode, ComponentType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 305 - Move Design Component', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

        server.call('testFixtures.clearAllData');

        // Add  Design - Design1: will create default Design Version
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
        // Edit the default Design Version
        server.call('testDesigns.editDesignVersion', 'Design1', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria', RoleType.DESIGNER);
    });

    afterEach(function(){

    });


    // Interface
    it('Each Design Component has an option to move that component to another location in the Design');

    it('Valid target components for a Design Component move are highlighted');


    // Actions
    it('A Design Section may be moved from one Application to another Application', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        // Check Section1 position
        server.call('verifyDesignComponents.componentParentIs', ComponentType.DESIGN_SECTION, 'Section1', 'Application1');
        // Add a second app
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application2');

        // Execute - move Section1 from Application1 to Application2
        server.call('testDesignComponents.moveComponent', ComponentType.DESIGN_SECTION, 'Section1', ComponentType.APPLICATION, 'Application2', ViewMode.MODE_EDIT);

        // Verify new parent
        server.call('verifyDesignComponents.componentParentIs', ComponentType.DESIGN_SECTION, 'Section1', 'Application2');
    });

    it('A Design Section may be moved into another Design Section');

    it('A Design Section inside a Design Section may be moved to under an Application');

    it('A Feature may be moved form one Design Section to another Design Section');

    it('A Feature Aspect may be moved from one Feature to another Feature');

    it('A Scenario may be moved from a Feature to a Feature Aspect');

    it('A Scenario may be moved from a Feature Aspect to a Feature');

    it('A Scenario may be moved from one Feature Aspect to another Feature Aspect');

    it('A Scenario may be moved from one Feature to another Feature');


    // Conditions
    it('Design Components can only be moved when in edit mode');

    it('Applications cannot be moved to another location');

    it('Design Sections can only be moved to be inside other Design Sections or to be under an Application');

    it('Features can only be moved to be inside a Design Section');

    it('Feature Aspects can only be moved to be under a Feature');

    it('Scenarios can only be moved to be under a Feature or Feature Aspect');


    // Consequences
    it('When a Design Section is moved its level changes according to where it is placed');

    it('When a Design Component is moved in a base Design Version, any related Design Updates are updated');

    it('When a Design Component is moved in a base Design Version, any related Work Packages are updated');

});
