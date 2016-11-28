import {RoleType, ViewMode, ComponentType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 143 - Edit Design Component Name', function(){

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
    it('Each Design Component has an option to edit its name');

    it('A Design Component name being edited has an option to save the changes');

    it('A Design Component name being edited has an option to discard the changes');


    // Actions
    it('A Design Component name can be edited and saved', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('verifyDesignComponents.componentExistsCalled', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME);

        // Execute
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');

        // Verify
        server.call('verifyDesignComponents.componentExistsCalled', ComponentType.APPLICATION, 'Application1');

    });

    it('A Design Component name can be edited but then the changes discarded');


    // Conditions
    it('Design Component names can only be edited when in edit mode', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('verifyDesignComponents.componentExistsCalled', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME);

        // Execute
        server.call('testDesignComponents.updateComponentNameInMode', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1', ViewMode.MODE_VIEW);

        // Verify - not changed to Application1
        server.call('verifyDesignComponents.componentDoesNotExistCalled', ComponentType.APPLICATION, 'Application1');
    });

    it('An Application name may not be changed to the same name as another Application in the Design', function(){

        // Setup
        // Add an App and call it Application1
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.APPLICATION, 'Application1', 1);
        // Add another App
        server.call('testDesignComponents.addApplication', 'gloria');
        // Should be one with the default name too now
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.APPLICATION, 'Application1', 1);
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 1);

        // Execute
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');

        // Verify - not changed to Application1 - should still be the default
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.APPLICATION, 'Application1', 1);
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 1);
    });

    it('A Feature name may not be changed to the same name as another Feature in the Design', function(){

        // Setup
        // Add an App
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        // Add design Section and Feature
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        // Add another Feature in a DIFFERENT design section (to make sure it applies outside parent)
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section2');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section2');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature2');
        // Check both features are there
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE, 'Feature1', 1);
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE, 'Feature2', 1);

        // Execute - try to update Feature2 to Feature1
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, 'Feature2', 'Feature1');

        // Verify - not changed to Feature1 - should still be Feature2
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE, 'Feature1', 1);
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE, 'Feature2', 1);
    });

    it('A Scenario name may not be changed to the same name as another Scenario in the Design', function(){

        // Setup
        // Add an App
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        // Add design Section and Feature and Scenario
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('testDesignComponents.addScenarioToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario1');
        // Add another Scenario in a DIFFERENT design section and Feature (to make sure it applies outside parent)
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section2');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section2');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature2');
        server.call('testDesignComponents.addScenarioToFeature', 'Feature2');
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario2');
        // Check both scenarios are there
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.SCENARIO, 'Scenario1', 1);
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.SCENARIO, 'Scenario2', 1);

        // Execute - try to update Scenario2 to Scenario1
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, 'Scenario2', 'Scenario1');

        // Verify - not changed to Scenario1 - should still be Scenario2
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.SCENARIO, 'Scenario1', 1);
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.SCENARIO, 'Scenario2', 1);
    });

    it('A Design Section name may not be changed to the same name as another Design Section under the same parent section', function(){

        // Setup
        // Add an App
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        // Add Design Section
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        // Add another Design Section
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section2');
        // Check both Sections are there
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.DESIGN_SECTION, 'Section1', 1);
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.DESIGN_SECTION, 'Section2', 1);

        // Execute - try to update Section2 to Section1
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, 'Section2', 'Section1');

        // Verify - not changed to Section1 - should still be Section2
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.DESIGN_SECTION, 'Section1', 1);
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.DESIGN_SECTION, 'Section2', 1);


    });

    it('A Feature Aspect name may not be changed to the same name as another Feature Aspect in the same Feature', function(){

        // Setup
        // Add an App
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        // Add design Section and Feature and Feature Aspect
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('testDesignComponents.addFeatureAspectToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect1');
        // Add another Feature Aspect in SAME Feature
        server.call('testDesignComponents.addFeatureAspectToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect2');
        // Check both feature aspects are there
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE_ASPECT, 'Aspect1', 1);
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE_ASPECT, 'Aspect2', 1);

        // Execute - try to update Aspect2 to Aspect1
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, 'Aspect2', 'Aspect1');

        // Verify - not changed to Aspect1 - should still be Aspect2
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE_ASPECT, 'Aspect1', 1);
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE_ASPECT, 'Aspect2', 1);
    });

    it('A Design Section name may be changed to the same name as a Design Section in a different parent', function(){
        // Setup
        // Add two Apps
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application2');
        // Add Design Section to Application1
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        // Add Design Section to Application2
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application2');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section2');
        // Check both Sections are there
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.DESIGN_SECTION, 'Section1', 1);
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.DESIGN_SECTION, 'Section2', 1);

        // Execute - update Section2 to Section1
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, 'Section2', 'Section1');

        // Verify - now 2 Section1s
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.DESIGN_SECTION, 'Section1', 2);
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.DESIGN_SECTION, 'Section2', 0);
    });

    it('A Feature Aspect name may be changed to the same name as a Feature Aspect in another Feature', function(){

        // Setup
        // Add an App
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        // Add design Section and Feature and Feature Aspect
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('testDesignComponents.addFeatureAspectToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect1');
        // Add another Feature Aspect in a DIFFERENT Feature
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature2');
        server.call('testDesignComponents.addFeatureAspectToFeature', 'Feature2');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect2');
        // Check both feature aspects are there
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE_ASPECT, 'Aspect1', 1);
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE_ASPECT, 'Aspect2', 1);

        // Execute - update Aspect2 to Aspect1
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, 'Aspect2', 'Aspect1');

        // Verify - now 2 Aspect1s
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE_ASPECT, 'Aspect1', 2);
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE_ASPECT, 'Aspect2', 0);
    });


    // Consequences
    it('Updating the name of a Design Component in a base Design Version updates it in any related Design Update');

    it('Updating the name of a Design Component in a base Design Version updates it in any related Work Package');

});
