import {RoleType, ViewMode, ComponentType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 304 - Remove Design Component', function(){

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
    it('Each Design Component has a remove option');


    // Actions
    it('A Scenario with no Scenario Steps may be removed from a Design Version', function(){

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
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.SCENARIO, 'Scenario1', 1);

        // Execute
        server.call('testDesignComponents.removeComponent', ComponentType.SCENARIO, 'Scenario1', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.SCENARIO, 'Scenario1', 0);
    });

    it('A Feature Aspect with no Scenarios may be removed from a Design Version', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('testDesignComponents.addFeatureAspectToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect1');
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE_ASPECT, 'Aspect1', 1);

        // Execute
        server.call('testDesignComponents.removeComponent', ComponentType.FEATURE_ASPECT, 'Aspect1', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE_ASPECT, 'Aspect1', 0);
    });

    it('A Feature with no Feature Aspects or Scenarios may be removed from a Design Version', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE, 'Feature1', 1);
        // Need to remove the default Feature Aspects
        server.call('testDesignComponents.removeComponent', ComponentType.FEATURE_ASPECT, 'Interface', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignComponents.removeComponent', ComponentType.FEATURE_ASPECT, 'Actions', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignComponents.removeComponent', ComponentType.FEATURE_ASPECT, 'Conditions', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignComponents.removeComponent', ComponentType.FEATURE_ASPECT, 'Consequences', 'gloria', ViewMode.MODE_EDIT);

        // Execute
        server.call('testDesignComponents.removeComponent', ComponentType.FEATURE, 'Feature1', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE, 'Feature1', 0);

    });

    it('A Design Section with no Features or sub sections may be removed from a Design Version', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.DESIGN_SECTION, 'Section1', 1);

        // Execute
        server.call('testDesignComponents.removeComponent', ComponentType.DESIGN_SECTION, 'Section1', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.DESIGN_SECTION, 'Section1', 0);
    });

    it('An Application with no Design sections may be removed from a Design Version', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.APPLICATION, 'Application1', 1);

        // Execute
        server.call('testDesignComponents.removeComponent', ComponentType.APPLICATION, 'Application1', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.APPLICATION, 'Application1', 0);
    });


    // Conditions
    it('Design Components can only be removed when in edit mode', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.APPLICATION, 'Application1', 1);

        // Execute - but in View mode
        server.call('testDesignComponents.removeComponent', ComponentType.APPLICATION, 'Application1', 'gloria', ViewMode.MODE_VIEW);

        // Verify - not removed
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.APPLICATION, 'Application1', 1);
    });

    it('An Application may only be removed if it has no Design Sections', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.DESIGN_SECTION, 'Section1', 1);

        // Execute
        server.call('testDesignComponents.removeComponent', ComponentType.APPLICATION, 'Application1', 'gloria', ViewMode.MODE_EDIT);

        // Verify - not removed
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.APPLICATION, 'Application1', 1);

    });

    it('A Design Section may only be removed if it has no sub sections', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addDesignSectionToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'SubSection1');
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.DESIGN_SECTION, 'Section1', 1);
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.DESIGN_SECTION, 'SubSection1', 1);

        // Execute
        server.call('testDesignComponents.removeComponent', ComponentType.DESIGN_SECTION, 'Section1', 'gloria', ViewMode.MODE_EDIT);

        // Verify - not removed
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.DESIGN_SECTION, 'Section1', 1);

    });

    it ('A Design Section may only be removed if it has no Features', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.DESIGN_SECTION, 'Section1', 1);
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE, 'Feature1', 1);

        // Execute
        server.call('testDesignComponents.removeComponent', ComponentType.DESIGN_SECTION, 'Section1', 'gloria', ViewMode.MODE_EDIT);

        // Verify - not removed
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.DESIGN_SECTION, 'Section1', 1);
    });

    it('A Feature may only be removed if it has no Feature Aspects', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('testDesignComponents.addFeatureAspectToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect1');
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE, 'Feature1', 1);
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE_ASPECT, 'Aspect1', 1);

        // Execute
        server.call('testDesignComponents.removeComponent', ComponentType.FEATURE, 'Feature1', 'gloria', ViewMode.MODE_EDIT);

        // Verify - not removed
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE, 'Feature1', 1);
    });

    it('A Feature may only be removed if it has no Scenarios', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');
        server.call('testDesignComponents.addScenarioToFeature', 'Feature1');
        server.call('testDesignComponents.updateComponentName', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario1');
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE, 'Feature1', 1);
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.SCENARIO, 'Scenario1', 1);

        // Execute
        server.call('testDesignComponents.removeComponent', ComponentType.FEATURE, 'Feature1', 'gloria', ViewMode.MODE_EDIT);

        // Verify - not removed
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE, 'Feature1', 1);
    });

    it('A Feature Aspect may only be removed if it has no Scenarios', function(){

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
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE_ASPECT, 'Aspect1', 1);
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.SCENARIO, 'Scenario1', 1);

        // Execute
        server.call('testDesignComponents.removeComponent', ComponentType.FEATURE_ASPECT, 'Aspect1', 'gloria', ViewMode.MODE_EDIT);

        // Verify - not removed
        server.call('verifyDesignComponents.componentCountCalledIs', ComponentType.FEATURE_ASPECT, 'Aspect1', 1);
    });

    it('A Scenario may only be removed if it has no Scenario Steps');



    // Consequences
    it('Removing a Design Component in a base Design Version removes it from any related Design Update');

    it('Removing a Design Component in a base Design Version removes it from any related Work Package');

});
