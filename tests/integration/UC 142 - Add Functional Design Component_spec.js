import {RoleType, ViewMode, ComponentType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 142 - Add Functional Design Component', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

        server.call('testFixtures.clearAllData');

        // Add  Design - Design1: will create default Design Version
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
        server
    });

    afterEach(function(){

    });


    // Interface
    it('A Design Version has an option to add a new Application to it');

    it('A Design Section has an option to add a new Feature to it');

    it('A Feature has an option to add a new Scenario to it');

    it('A Feature Aspect has an option to add a new Scenario to it');

    it('When about to add a new functional component the parent component is highlighted');


    // Actions
    it('An Application may be added to a Design Version', function() {

        // Setup
        // Edit the default Design Version
        server.call('testDesigns.editDesignVersion', 'Design1', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria', RoleType.DESIGNER);

        // Execute
        // Add an Application
        server.call('testDesignComponents.addApplication', 'gloria');

        // Verify
        server.call('verifyDesignComponents.componentExistsCalled', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME);
        server.call('verifyDesignComponents.componentParentIs', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'NONE');
    });

    it('A Feature may be added to a Design Section', function(){

        // Setup
        // Edit the default Design Version
        server.call('testDesigns.editDesignVersion', 'Design1', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria', RoleType.DESIGNER);
        // Add an Application
        server.call('testDesignComponents.addApplication', 'gloria');
        // Add a Design Section
        server.call('testDesignComponents.addDesignSectionToApplication', DefaultComponentNames.NEW_APPLICATION_NAME);

        // Execute
        // Add a Feature
        server.call('testDesignComponents.addFeatureToDesignSection', DefaultComponentNames.NEW_DESIGN_SECTION_NAME);

        // Verify
        server.call('verifyDesignComponents.componentExistsCalled', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME);
        server.call('verifyDesignComponents.componentParentIs', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, DefaultComponentNames.NEW_DESIGN_SECTION_NAME);
    });

    it('A Scenario may be added to a Feature', function(){

        // Setup
        // Edit the default Design Version
        server.call('testDesigns.editDesignVersion', 'Design1', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria', RoleType.DESIGNER);
        // Add an Application
        server.call('testDesignComponents.addApplication', 'gloria');
        // Add a Design Section
        server.call('testDesignComponents.addDesignSectionToApplication', DefaultComponentNames.NEW_APPLICATION_NAME);
        // Add a Feature
        server.call('testDesignComponents.addFeatureToDesignSection', DefaultComponentNames.NEW_DESIGN_SECTION_NAME);

        // Execute
        // Add a Scenario
        server.call('testDesignComponents.addScenarioToFeature', DefaultComponentNames.NEW_FEATURE_NAME);

        // Verify
        server.call('verifyDesignComponents.componentExistsCalled', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME);
        server.call('verifyDesignComponents.componentParentIs', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, DefaultComponentNames.NEW_FEATURE_NAME);
    });


    it('A Scenario may be added to a Feature Aspect', function(){

        // Setup
        // Edit the default Design Version
        server.call('testDesigns.editDesignVersion', 'Design1', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria', RoleType.DESIGNER);
        // Add an Application
        server.call('testDesignComponents.addApplication', 'gloria');
        // Add a Design Section
        server.call('testDesignComponents.addDesignSectionToApplication', DefaultComponentNames.NEW_APPLICATION_NAME);
        // Add a Feature
        server.call('testDesignComponents.addFeatureToDesignSection', DefaultComponentNames.NEW_DESIGN_SECTION_NAME);
        // Add a Feature Aspect
        server.call('testDesignComponents.addFeatureAspectToFeature', DefaultComponentNames.NEW_FEATURE_NAME);

        // Execute
        // Add a Scenario
        server.call('testDesignComponents.addScenarioToFeatureAspect', DefaultComponentNames.NEW_FEATURE_NAME, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);

        // Verify
        server.call('verifyDesignComponents.componentExistsCalled', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME);
        server.call('verifyDesignComponents.componentParentIs', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME);
    });


    // Conditions
    it('Design Components may only be added when in edit mode', function(){

        // Setup
        // Edit the default Design Version
        server.call('testDesigns.editDesignVersion', 'Design1', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria', RoleType.DESIGNER);

        // Execute
        // Add an Application - should fail in view mode
        server.call('testDesignComponents.addApplicationInMode', 'gloria', ViewMode.MODE_VIEW);

        // Verify no App created
        server.call('verifyDesignComponents.componentDoesNotExistCalled', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME);
    });


    // Consequences
    it('Adding a functional component to a base Design Version makes it available in any Design Updates based on that version');

    it('Adding a functional component to a base Design Version makes it available in any Work Packages based on that version');

});
