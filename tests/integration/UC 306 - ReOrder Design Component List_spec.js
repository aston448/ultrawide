import {RoleType, ViewMode, ComponentType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 306 - ReOrder Design Component List', function(){

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
    it('Each Design Component has an option to move that component to another position within its parent component');

    it('Design Components are always shown in the order they have been given by the Designer');


    // Actions
    it('An Application may be moved to above another Application in a Design Version', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application2');
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application3');
        // Check ordering is as created
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.APPLICATION, 'Application1', 'Application2');
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.APPLICATION, 'Application2', 'Application3');

        // Execute - move Application3 to above Application1
        server.call('testDesignComponents.reorderComponent', ComponentType.APPLICATION, 'Application3', 'Application1', ViewMode.MODE_EDIT);

        // Verify - order should now be 3, 1, 2
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.APPLICATION, 'Application3', 'Application1');
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.APPLICATION, 'Application1', 'Application2');
    });

    it('A Design Section may be moved to above another Design Section in an Application', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section2');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section3');
        // Check ordering is as created
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.DESIGN_SECTION, 'Section1', 'Section2');
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.DESIGN_SECTION, 'Section2', 'Section3');

        // Execute - move Section3 to above Section1
        server.call('testDesignComponents.reorderComponent', ComponentType.DESIGN_SECTION, 'Section3', 'Section1', ViewMode.MODE_EDIT);

        // Verify - order should now be 3, 1, 2
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.DESIGN_SECTION, 'Section3', 'Section1');
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.DESIGN_SECTION, 'Section1', 'Section2');
    });

    it('A Design Section may be moved to be above another Design Section in its parent Design Section', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addDesignSectionToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'SubSection1');
        server.call('testDesignComponents.addDesignSectionToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'SubSection2');
        server.call('testDesignComponents.addDesignSectionToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'SubSection3');
        // Check ordering is as created
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.DESIGN_SECTION, 'SubSection1', 'SubSection2');
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.DESIGN_SECTION, 'SubSection2', 'SubSection3');

        // Execute - move SubSection3 to above SubSection1
        server.call('testDesignComponents.reorderComponent', ComponentType.DESIGN_SECTION, 'SubSection3', 'SubSection1', ViewMode.MODE_EDIT);

        // Verify - order should now be 3, 1, 2
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.DESIGN_SECTION, 'SubSection3', 'SubSection1');
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.DESIGN_SECTION, 'SubSection1', 'SubSection2');
    });

    it('A Feature may be moved to be above another Feature in a Design Section', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature2');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature3');
        // Check ordering is as created
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.FEATURE, 'Feature1', 'Feature2');
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.FEATURE, 'Feature2', 'Feature3');

        // Execute - move Feature3 to above Feature1
        server.call('testDesignComponents.reorderComponent', ComponentType.FEATURE, 'Feature3', 'Feature1', ViewMode.MODE_EDIT);

        // Verify - order should now be 3, 1, 2
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.FEATURE, 'Feature3', 'Feature1');
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.FEATURE, 'Feature1', 'Feature2');
    });

    it('A Feature aspect may be moved to be above another Feature Aspect in a Feature', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('testDesignComponents.addFeatureAspectToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect1');
        server.call('testDesignComponents.addFeatureAspectToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect2');
        server.call('testDesignComponents.addFeatureAspectToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect3');
        // Check ordering is as created
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.FEATURE_ASPECT, 'Aspect1', 'Aspect2');
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.FEATURE_ASPECT, 'Aspect2', 'Aspect3');

        // Execute - move Aspect3 to above Aspect1
        server.call('testDesignComponents.reorderComponent', ComponentType.FEATURE_ASPECT, 'Aspect3', 'Aspect1', ViewMode.MODE_EDIT);

        // Verify - order should now be 3, 1, 2
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.FEATURE_ASPECT, 'Aspect3', 'Aspect1');
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.FEATURE_ASPECT, 'Aspect1', 'Aspect2');
    });

    it('A Scenario may be moved to be above another Scenario in a Feature', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('testDesignComponents.addScenarioToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario1');
        server.call('testDesignComponents.addScenarioToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario2');
        server.call('testDesignComponents.addScenarioToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario3');
        // Check ordering is as created
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.SCENARIO, 'Scenario1', 'Scenario2');
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.SCENARIO, 'Scenario2', 'Scenario3');

        // Execute - move Scenario3 to above Scenario1
        server.call('testDesignComponents.reorderComponent', ComponentType.SCENARIO, 'Scenario3', 'Scenario1', ViewMode.MODE_EDIT);

        // Verify - order should now be 3, 1, 2
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.SCENARIO, 'Scenario3', 'Scenario1');
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.SCENARIO, 'Scenario1', 'Scenario2');
    });

    it('A Scenario may be moved to be above another Scenario in a Feature Aspect', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('testDesignComponents.addFeatureAspectToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect1');
        server.call('testDesignComponents.addScenarioToFeatureAspect', 'Feature1, Aspect1');
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario1');
        server.call('testDesignComponents.addScenarioToFeatureAspect', 'Feature1, Aspect1');
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario2');
        server.call('testDesignComponents.addScenarioToFeatureAspect', 'Feature1, Aspect1');
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario3');
        // Check ordering is as created
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.SCENARIO, 'Scenario1', 'Scenario2');
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.SCENARIO, 'Scenario2', 'Scenario3');

        // Execute - move Scenario3 to above Scenario1
        server.call('testDesignComponents.reorderComponent', ComponentType.SCENARIO, 'Scenario3', 'Scenario1', ViewMode.MODE_EDIT);

        // Verify - order should now be 3, 1, 2
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.SCENARIO, 'Scenario3', 'Scenario1');
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.SCENARIO, 'Scenario1', 'Scenario2');
    });


    // Conditions
    it('Design Components may only be reordered when in edit mode', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application2');
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application3');
        // Check ordering is as created
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.APPLICATION, 'Application1', 'Application2');
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.APPLICATION, 'Application2', 'Application3');

        // Execute - move Application3 to above Application1 - but in View Only mode
        server.call('testDesignComponents.reorderComponent', ComponentType.APPLICATION, 'Application3', 'Application1', ViewMode.MODE_VIEW);

        // Verify - order should not be changed
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.APPLICATION, 'Application1', 'Application2');
        server.call('verifyDesignComponents.componentIsAboveComponent', ComponentType.APPLICATION, 'Application2', 'Application3');
    });


    // Consequences
    it('When a Design Component is reordered in a base Design Version, any related Design Updates are updated');

    it('When a Design Component is reordered in a base Design Version, any related Work Packages are updated');

});
