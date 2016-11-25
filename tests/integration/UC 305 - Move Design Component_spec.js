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
        // Check Section1 position
        server.call('verifyDesignComponents.componentParentIs', ComponentType.DESIGN_SECTION, 'Section1', 'Application1');
        // Add a second app
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application2');

        // Execute - move Section1 to Application2
        server.call('testDesignComponents.moveComponent', ComponentType.DESIGN_SECTION, 'Section1', ComponentType.APPLICATION, 'Application2', ViewMode.MODE_EDIT);

        // Verify new parent
        server.call('verifyDesignComponents.componentParentIs', ComponentType.DESIGN_SECTION, 'Section1', 'Application2');
    });

    it('A Design Section may be moved into another Design Section', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section2');
        server.call('testDesignComponents.addDesignSectionToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'SubSection1');
        // Check SubSection1 initial position
        server.call('verifyDesignComponents.componentParentIs', ComponentType.DESIGN_SECTION, 'SubSection1', 'Section1');

        // Execute - move SubSection1 to Section2
        server.call('testDesignComponents.moveComponent', ComponentType.DESIGN_SECTION, 'SubSection1', ComponentType.DESIGN_SECTION, 'Section2', ViewMode.MODE_EDIT);

        // Verify new parent
        server.call('verifyDesignComponents.componentParentIs', ComponentType.DESIGN_SECTION, 'SubSection1', 'Section2');
    });

    it('A Design Section inside a Design Section may be moved to under an Application', function() {

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addDesignSectionToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'SubSection1');
        // Check SubSection1 initial position
        server.call('verifyDesignComponents.componentParentIs', ComponentType.DESIGN_SECTION, 'SubSection1', 'Section1');

        // Execute - move SubSection1 to Application1
        server.call('testDesignComponents.moveComponent', ComponentType.DESIGN_SECTION, 'SubSection1', ComponentType.APPLICATION, 'Application1', ViewMode.MODE_EDIT);

        // Verify new parent
        server.call('verifyDesignComponents.componentParentIs', ComponentType.DESIGN_SECTION, 'SubSection1', 'Application1');
    });

    it('A Feature may be moved from one Design Section to another Design Section', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section2');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        // Check Feature1 initial position
        server.call('verifyDesignComponents.componentParentIs', ComponentType.FEATURE, 'Feature1', 'Section1');

        // Execute - move Feature1 to Section2
        server.call('testDesignComponents.moveComponent', ComponentType.FEATURE, 'Feature1', ComponentType.DESIGN_SECTION, 'Section2', ViewMode.MODE_EDIT);

        // Verify new parent
        server.call('verifyDesignComponents.componentParentIs', ComponentType.FEATURE, 'Feature1', 'Section2');
    });

    it('A Feature Aspect may be moved from one Feature to another Feature', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature2');
        server.call('testDesignComponents.addFeatureAspectToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect1');


        // Check Aspect1 initial position
        server.call('verifyDesignComponents.componentParentIs', ComponentType.FEATURE_ASPECT, 'Aspect1', 'Feature1');

        // Execute - move Aspect1 to Feature2
        server.call('testDesignComponents.moveComponent', ComponentType.FEATURE_ASPECT, 'Aspect1', ComponentType.FEATURE, 'Feature2', ViewMode.MODE_EDIT);

        // Verify new parent
        server.call('verifyDesignComponents.componentParentIs', ComponentType.FEATURE_ASPECT, 'Aspect1', 'Feature2');

    });

    it('A Scenario may be moved from a Feature to a Feature Aspect', function() {

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('testDesignComponents.addScenarioToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario1');
        server.call('testDesignComponents.addFeatureAspectToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect1');
        // Check Scenario1 initial position
        server.call('verifyDesignComponents.componentParentIs', ComponentType.SCENARIO, 'Scenario1', 'Feature1');

        // Execute - move Scenario1 to Aspect1
        server.call('testDesignComponents.moveComponent', ComponentType.SCENARIO, 'Scenario1', ComponentType.FEATURE_ASPECT, 'Aspect1', ViewMode.MODE_EDIT);

        // Verify new parent
        server.call('verifyDesignComponents.componentParentIs', ComponentType.SCENARIO, 'Scenario1', 'Aspect1');
    });

    it('A Scenario may be moved from a Feature Aspect to a Feature', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('testDesignComponents.addFeatureAspectToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect1');
        server.call('testDesignComponents.addScenarioToFeatureAspect', 'Feature1', 'Aspect1');
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario1');
        // Check Scenario1 initial position
        server.call('verifyDesignComponents.componentParentIs', ComponentType.SCENARIO, 'Scenario1', 'Aspect1');

        // Execute - move Scenario1 to Feature1
        server.call('testDesignComponents.moveComponent', ComponentType.SCENARIO, 'Scenario1', ComponentType.FEATURE, 'Feature1', ViewMode.MODE_EDIT);

        // Verify new parent
        server.call('verifyDesignComponents.componentParentIs', ComponentType.SCENARIO, 'Scenario1', 'Feature1');
    });

    it('A Scenario may be moved from one Feature Aspect to another Feature Aspect', function(){

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
        server.call('testDesignComponents.addScenarioToFeatureAspect', 'Feature1', 'Aspect1');
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario1');
        // Check Scenario1 initial position
        server.call('verifyDesignComponents.componentParentIs', ComponentType.SCENARIO, 'Scenario1', 'Aspect1');

        // Execute - move Scenario1 to Aspect2
        server.call('testDesignComponents.moveComponent', ComponentType.SCENARIO, 'Scenario1', ComponentType.FEATURE_ASPECT, 'Aspect2', ViewMode.MODE_EDIT);

        // Verify new parent
        server.call('verifyDesignComponents.componentParentIs', ComponentType.SCENARIO, 'Scenario1', 'Aspect2');
    });

    it('A Scenario may be moved from one Feature to another Feature', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature2');
        server.call('testDesignComponents.addScenarioToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario1');
        // Check Scenario1 initial position
        server.call('verifyDesignComponents.componentParentIs', ComponentType.SCENARIO, 'Scenario1', 'Feature1');

        // Execute - move Scenario1 to Feature2
        server.call('testDesignComponents.moveComponent', ComponentType.SCENARIO, 'Scenario1', ComponentType.FEATURE, 'Feature2', ViewMode.MODE_EDIT);

        // Verify new parent
        server.call('verifyDesignComponents.componentParentIs', ComponentType.SCENARIO, 'Scenario1', 'Feature2');
    });


    // Conditions
    it('Design Components can only be moved when in edit mode', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        // Check Section1 position
        server.call('verifyDesignComponents.componentParentIs', ComponentType.DESIGN_SECTION, 'Section1', 'Application1');
        // Add a second app
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application2');

        // Execute - move Section1 to Application2 in View Only mode
        server.call('testDesignComponents.moveComponent', ComponentType.DESIGN_SECTION, 'Section1', ComponentType.APPLICATION, 'Application2', ViewMode.MODE_VIEW);

        // Verify move failed
        server.call('verifyDesignComponents.componentParentIs', ComponentType.DESIGN_SECTION, 'Section1', 'Application1');
    });

    it('Applications cannot be moved to other Applications or Design Sections or Features or Feature Aspects', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application2');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('testDesignComponents.addFeatureAspectToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect1');
        server.call('verifyDesignComponents.componentParentIs', ComponentType.APPLICATION, 'Application1', 'NONE');

        // Execute - try to move Application1 to Application2
        server.call('testDesignComponents.moveComponent', ComponentType.APPLICATION, 'Application1', ComponentType.APPLICATION, 'Application2', ViewMode.MODE_EDIT);

        // Verify - App still has no parent
        server.call('verifyDesignComponents.componentParentIs', ComponentType.APPLICATION, 'Application1', 'NONE');

        // Execute - try to move Application1 to Section1
        server.call('testDesignComponents.moveComponent', ComponentType.APPLICATION, 'Application1', ComponentType.DESIGN_SECTION, 'Section1', ViewMode.MODE_EDIT);

        // Verify - App still has no parent
        server.call('verifyDesignComponents.componentParentIs', ComponentType.APPLICATION, 'Application1', 'NONE');

        // Execute - try to move Application1 to Feature1
        server.call('testDesignComponents.moveComponent', ComponentType.APPLICATION, 'Application1', ComponentType.FEATURE, 'Feature1', ViewMode.MODE_EDIT);

        // Verify - App still has no parent
        server.call('verifyDesignComponents.componentParentIs', ComponentType.APPLICATION, 'Application1', 'NONE');

        // Execute - try to move Application1 to Aspect1
        server.call('testDesignComponents.moveComponent', ComponentType.APPLICATION, 'Application1', ComponentType.FEATURE_ASPECT, 'Aspect1', ViewMode.MODE_EDIT);

        // Verify - App still has no parent
        server.call('verifyDesignComponents.componentParentIs', ComponentType.APPLICATION, 'Application1', 'NONE');
    });

    it('Design Sections cannot be moved to Features or Feature Aspects', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('testDesignComponents.addFeatureAspectToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect1');
        server.call('verifyDesignComponents.componentParentIs', ComponentType.DESIGN_SECTION, 'Section1', 'Application1');

        // Execute - try to move Section1 to Feature1
        server.call('testDesignComponents.moveComponent', ComponentType.DESIGN_SECTION, 'Section1', ComponentType.FEATURE, 'Feature1', ViewMode.MODE_EDIT);

        // Verify - Section is still under App
        server.call('verifyDesignComponents.componentParentIs', ComponentType.DESIGN_SECTION, 'Section1', 'Application1');

        // Execute - try to move Section1 to Aspect1
        server.call('testDesignComponents.moveComponent', ComponentType.DESIGN_SECTION, 'Section1', ComponentType.FEATURE_ASPECT, 'Aspect1', ViewMode.MODE_EDIT);

        // Verify - Section is still under App
        server.call('verifyDesignComponents.componentParentIs', ComponentType.DESIGN_SECTION, 'Section1', 'Application1');
    });

    it('Features cannot be moved to Applications or other Features or Feature Aspects', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature2');
        server.call('testDesignComponents.addFeatureAspectToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect1');
        server.call('verifyDesignComponents.componentParentIs', ComponentType.FEATURE, 'Feature1', 'Section1');

        // Execute - try to move Feature1 to Application1
        server.call('testDesignComponents.moveComponent', ComponentType.FEATURE, 'Feature1', ComponentType.APPLICATION, 'Application1', ViewMode.MODE_EDIT);

        // Verify - Feature is still under Section1
        server.call('verifyDesignComponents.componentParentIs', ComponentType.FEATURE, 'Feature1', 'Section1');

        // Execute - try to move Feature1 to Feature2
        server.call('testDesignComponents.moveComponent', ComponentType.FEATURE, 'Feature1', ComponentType.FEATURE, 'Feature2', ViewMode.MODE_EDIT);

        // Verify - Feature is still under Section1
        server.call('verifyDesignComponents.componentParentIs', ComponentType.FEATURE, 'Feature1', 'Section1');

        // Execute - try to move Feature1 to Aspect1
        server.call('testDesignComponents.moveComponent', ComponentType.FEATURE, 'Feature1', ComponentType.FEATURE_ASPECT, 'Aspect1', ViewMode.MODE_EDIT);

        // Verify - Feature is still under Section1
        server.call('verifyDesignComponents.componentParentIs', ComponentType.FEATURE, 'Feature1', 'Section1');
    });

    it('Feature Aspects cannot be moved to Applications or Design Sections or other Feature Aspects', function(){

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
        server.call('verifyDesignComponents.componentParentIs', ComponentType.FEATURE_ASPECT, 'Aspect1', 'Feature1');

        // Execute - try to move Aspect1 to Application1
        server.call('testDesignComponents.moveComponent', ComponentType.FEATURE_ASPECT, 'Aspect1', ComponentType.APPLICATION, 'Application1', ViewMode.MODE_EDIT);

        // Verify - Aspect is still under Feature1
        server.call('verifyDesignComponents.componentParentIs', ComponentType.FEATURE_ASPECT, 'Aspect1', 'Feature1');

        // Execute - try to move Aspect1 to Section1
        server.call('testDesignComponents.moveComponent', ComponentType.FEATURE_ASPECT, 'Aspect1', ComponentType.DESIGN_SECTION, 'Section1', ViewMode.MODE_EDIT);

        // Verify - Aspect is still under Feature1
        server.call('verifyDesignComponents.componentParentIs', ComponentType.FEATURE_ASPECT, 'Aspect1', 'Feature1');

        // Execute - try to move Aspect1 to Aspect2
        server.call('testDesignComponents.moveComponent', ComponentType.FEATURE_ASPECT, 'Aspect1', ComponentType.FEATURE_ASPECT, 'Aspect2', ViewMode.MODE_EDIT);

        // Verify - Aspect is still under Feature1
        server.call('verifyDesignComponents.componentParentIs', ComponentType.FEATURE_ASPECT, 'Aspect1', 'Feature1');
    });

    it('Scenarios cannot be moved to Applications or Design Sections', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('testDesignComponents.addFeatureAspectToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect1');
        server.call('testDesignComponents.addScenarioToFeatureAspect', 'Feature1', 'Aspect1');
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario1');
        server.call('verifyDesignComponents.componentParentIs', ComponentType.SCENARIO, 'Scenario1', 'Aspect1');

        // Execute - try to move Scenario1 to Application1
        server.call('testDesignComponents.moveComponent', ComponentType.SCENARIO, 'Scenario1', ComponentType.APPLICATION, 'Application1', ViewMode.MODE_EDIT);

        // Verify - Scenario1 is still under Aspect1
        server.call('verifyDesignComponents.componentParentIs', ComponentType.SCENARIO, 'Scenario1', 'Aspect1');

        // Execute - try to move Aspect1 to Section1
        server.call('testDesignComponents.moveComponent', ComponentType.SCENARIO, 'Scenario1', ComponentType.DESIGN_SECTION, 'Section1', ViewMode.MODE_EDIT);

        // Verify - Scenario1 is still under Aspect1
        server.call('verifyDesignComponents.componentParentIs', ComponentType.SCENARIO, 'Scenario1', 'Aspect1');
    });

    it('No Design Component can be moved to a Scenario', function(){
        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('testDesignComponents.addFeatureAspectToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect1');
        server.call('testDesignComponents.addScenarioToFeatureAspect', 'Feature1', 'Aspect1');
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario1');
        server.call('testDesignComponents.addScenarioToFeatureAspect', 'Feature1', 'Aspect1');
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario2');
        server.call('verifyDesignComponents.componentParentIs', ComponentType.APPLICATION, 'Application1', 'NONE');
        server.call('verifyDesignComponents.componentParentIs', ComponentType.DESIGN_SECTION, 'Section1', 'Application1');
        server.call('verifyDesignComponents.componentParentIs', ComponentType.FEATURE, 'Feature1', 'Section1');
        server.call('verifyDesignComponents.componentParentIs', ComponentType.FEATURE_ASPECT, 'Aspect1', 'Feature1');
        server.call('verifyDesignComponents.componentParentIs', ComponentType.SCENARIO, 'Scenario1', 'Aspect1');
        server.call('verifyDesignComponents.componentParentIs', ComponentType.SCENARIO, 'Scenario2', 'Aspect1');

        // Try to move Application1 to Scenario1
        server.call('testDesignComponents.moveComponent', ComponentType.APPLICATION, 'Application1', ComponentType.SCENARIO, 'Scenario1', ViewMode.MODE_EDIT);

        // Verify - not moved
        server.call('verifyDesignComponents.componentParentIs', ComponentType.APPLICATION, 'Application1', 'NONE');

        // Try to move Section1 to Scenario1
        server.call('testDesignComponents.moveComponent', ComponentType.DESIGN_SECTION, 'Section1', ComponentType.SCENARIO, 'Scenario1', ViewMode.MODE_EDIT);

        // Verify - not moved
        server.call('verifyDesignComponents.componentParentIs', ComponentType.DESIGN_SECTION, 'Section1', 'Application1');

        // Try to move Feature1 to Scenario1
        server.call('testDesignComponents.moveComponent', ComponentType.FEATURE, 'Feature1', ComponentType.SCENARIO, 'Scenario1', ViewMode.MODE_EDIT);

        // Verify - not moved
        server.call('verifyDesignComponents.componentParentIs', ComponentType.FEATURE, 'Feature1', 'Section1');

        // Try to move Aspect1 to Scenario1
        server.call('testDesignComponents.moveComponent', ComponentType.FEATURE_ASPECT, 'Aspect1', ComponentType.SCENARIO, 'Scenario1', ViewMode.MODE_EDIT);

        // Verify - not moved
        server.call('verifyDesignComponents.componentParentIs', ComponentType.FEATURE_ASPECT, 'Aspect1', 'Feature1');

        // Try to move Scenario1 to Scenario2
        server.call('testDesignComponents.moveComponent', ComponentType.SCENARIO, 'Scenario1', ComponentType.SCENARIO, 'Scenario2', ViewMode.MODE_EDIT);

        // Verify - not moved
        server.call('verifyDesignComponents.componentParentIs', ComponentType.SCENARIO, 'Scenario1', 'Aspect1');

    });

    // Consequences
    it('When a Design Section is moved its level changes according to where it is placed', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addDesignSectionToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'SubSection1');
        server.call('verifyDesignComponents.componentLevelIs', ComponentType.DESIGN_SECTION, 'Section1', 1);
        server.call('verifyDesignComponents.componentLevelIs', ComponentType.DESIGN_SECTION, 'SubSection1', 2);

        // Execute - move sub section up to top level
        server.call('testDesignComponents.moveComponent', ComponentType.DESIGN_SECTION, 'SubSection1', ComponentType.APPLICATION, 'Application1', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignComponents.componentLevelIs', ComponentType.DESIGN_SECTION, 'Section1', 1);
        server.call('verifyDesignComponents.componentLevelIs', ComponentType.DESIGN_SECTION, 'SubSection1', 1);

        // Execute - move sub section back into Section1
        server.call('testDesignComponents.moveComponent', ComponentType.DESIGN_SECTION, 'SubSection1', ComponentType.DESIGN_SECTION, 'Section1', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignComponents.componentLevelIs', ComponentType.DESIGN_SECTION, 'Section1', 1);
        server.call('verifyDesignComponents.componentLevelIs', ComponentType.DESIGN_SECTION, 'SubSection1', 2);
    });

    it('When a Feature Aspect is moved to a new Feature the feature reference for all its children is updated');

    it('When a Scenario is moved to a new Feature its feature reference is updated', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature2');
        server.call('testDesignComponents.addFeatureAspectToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect1');
        server.call('testDesignComponents.addScenarioToFeatureAspect', 'Aspect1', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario1');
        server.call('testDesignComponents.addFeatureAspectToFeature', 'Feature2');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect2');
        server.call('verifyDesignComponents.componentFeatureIs', ComponentType.SCENARIO, 'Scenario1', 'Feature1');

        // Execute - move Scenario1 to Aspect2
        server.call('testDesignComponents.moveComponent', ComponentType.SCENARIO, 'Scenario1', ComponentType.FEATURE_ASPECT, 'Aspect2', ViewMode.MODE_EDIT);

        // Validate - feature should now be Feature2
        server.call('verifyDesignComponents.componentFeatureIs', ComponentType.SCENARIO, 'Scenario1', 'Feature2');

    });

    it('When a Design Component is moved in a base Design Version, any related Design Updates are updated');

    it('When a Design Component is moved in a base Design Version, any related Work Packages are updated');

});
