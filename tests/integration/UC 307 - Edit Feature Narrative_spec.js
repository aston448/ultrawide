import {RoleType, ViewMode, ComponentType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 307 - Edit Feature Narrative', function(){

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
    it('Each Feature has a default Narrative template');

    it('Each Narrative has an option to edit it');

    it('A Narrative being edited has an option to save changes');

    it('A Narrative being edited has an option to discard any changes');


    // Actions
    it('A Designer can edit and save a Feature Narrative', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');

        let oldNarrative = DefaultComponentNames.NEW_NARRATIVE_TEXT;
        let newNarrative = 'As a hen\nI want to peck\nSo that I can eat';
        // Check
        server.call('verifyDesignComponents.featureNarrativeIs', 'Feature1', oldNarrative);

        // Execute
        server.call('testDesignComponents.updateFeatureNarrative', 'Feature1', newNarrative, ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignComponents.featureNarrativeIs', 'Feature1', newNarrative);

    });

    it('A designer can edit but then discard changes to a Feature Narrative');


    // Conditions
    it('A Feature Narrative can only be edited when in edit mode', function(){

        // Setup
        server.call('testDesignComponents.addApplication', 'gloria');
        server.call('testDesignComponents.updateComponentName', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1');
        server.call('testDesignComponents.addDesignSectionToApplication', 'Application1');
        server.call('testDesignComponents.updateComponentName', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1');
        server.call('testDesignComponents.addFeatureToDesignSection', 'Section1');
        server.call('testDesignComponents.updateComponentName', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1');

        let oldNarrative = DefaultComponentNames.NEW_NARRATIVE_TEXT;
        let newNarrative = 'As a hen\nI want to peck\nSo that I can eat';
        // Check
        server.call('verifyDesignComponents.featureNarrativeIs', 'Feature1', oldNarrative);

        // Execute
        server.call('testDesignComponents.updateFeatureNarrative', 'Feature1', newNarrative, ViewMode.MODE_VIEW);

        // Verify - not changed
        server.call('verifyDesignComponents.featureNarrativeIs', 'Feature1', oldNarrative);
    });


    // Consequences
    it('When a Narrative is updated in a base Design Version, any related Design Updates are updated');

    it('When a Narrative is updated in a base Design Version, any related Work Packages are updated');

});
