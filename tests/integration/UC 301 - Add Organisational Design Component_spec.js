import {RoleType, DesignVersionStatus, ComponentType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 301 - Add Organisational Design Component', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

        server.call('testFixtures.clearAllData');

        // Add  Design - Design1: will create default Design Version
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
    });

    afterEach(function(){

    });


    // Interface
    it('An Application has an option to add a new Design Section to it');

    it('A Design Section has an option to add a new Design Section to it as a sub section');

    it('A Feature has an option to add a new Feature Aspect to it');

    it('When about to add a new organisational component the parent component is highlighted');


    // Actions
    it('A Design Section may be added to an Application', function(){

        // Setup
        // Edit the default Design Version
        server.call('testDesigns.editDesignVersion', 'Design1', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria', RoleType.DESIGNER);
        // Add an Application
        server.call('testDesignComponents.addApplication', 'gloria');

        // Execute
        // Add a Design Section
        server.call('testDesignComponents.addDesignSectionToApplication', DefaultComponentNames.NEW_APPLICATION_NAME);

        // Verify
        server.call('verifyDesignComponents.componentExistsCalled', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME);
        server.call('verifyDesignComponents.componentParentIs', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, DefaultComponentNames.NEW_APPLICATION_NAME);
    });


    it('A Design Section may be added to another Design Section as a subsection', function(){

        // Setup
        // Edit the default Design Version
        server.call('testDesigns.editDesignVersion', 'Design1', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria', RoleType.DESIGNER);
        // Add an Application
        server.call('testDesignComponents.addApplication', 'gloria');
        // Add a Design Section - update name to remove ambiguity
        server.call('testDesignComponents.addDesignSectionToApplication', DefaultComponentNames.NEW_APPLICATION_NAME);
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');

        // Execute - add new section to 'Section1'
        server.call('testDesignComponents.addDesignSectionToDesignSection', 'Section1');

        // Verify - new component added
        server.call('verifyDesignComponents.componentExistsCalled', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME);
        server.call('verifyDesignComponents.componentParentIs', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
    });

    it('A Feature Aspect may be added to a Feature', function(){

        // Setup
        // Edit the default Design Version
        server.call('testDesigns.editDesignVersion', 'Design1', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria', RoleType.DESIGNER);
        // Add an Application
        server.call('testDesignComponents.addApplication', 'gloria');
        // Add a Design Section - update name to remove ambiguity
        server.call('testDesignComponents.addDesignSectionToApplication', DefaultComponentNames.NEW_APPLICATION_NAME);
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        // Add a Feature
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');

        // Execute - add new section to 'Section1'
        server.call('testDesignComponents.addFeatureAspectToFeature', 'Feature1');

        // Verify - new component added
        server.call('verifyDesignComponents.componentExistsCalled', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
        server.call('verifyDesignComponents.componentParentIs', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Feature1');
    });


    // Conditions
    it('Only a Designer may add organisational components');

    it('Organisational components may only be added when in edit mode');


    // Consequences
    it('Adding an organisational component to a base Design Version makes it available in any Design Updates based on that version');

    it('Adding an organisational component to a base Design Version makes it available in any Work Packages based on that version');

});
