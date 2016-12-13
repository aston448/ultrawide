import {RoleType, ViewMode, ComponentType, DesignVersionStatus, WorkPackageType, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 557 - Edit Design Update Feature Narrative', function(){

    before(function(){

        server.call('testFixtures.clearAllData');

        // Create a Design
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        // Name and Publish a Design Version
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', 'gloria', RoleType.DESIGNER);
        // Add Basic Data to the Design Version
        server.call('testDesigns.editDesignVersion', 'Design1', 'DesignVersion1', 'gloria', RoleType.DESIGNER);
        server.call('testFixtures.AddBasicDesignData', 'Design1', 'DesignVersion1');
        // Complete the Design Version and create the next
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion2', RoleType.DESIGNER, 'gloria');
    });

    after(function(){

    });

    beforeEach(function(){

        // Remove any Design Updates before each test
        server.call('textFixtures.clearDesignUpdates');

        // And create a new update to work with
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
    });

    afterEach(function(){

    });


    // Actions
    it('A Designer may edit the Narrative of a new Design Update Feature', function(){

        const newNarrative = 'As a Designer\nI want to update my Narrative\nSo that I can clarify what my Feature is about\n';

        // Setup - add new Feature to Section1
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addFeatureToDesignSection', 'Application1', 'Section1', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE, 'Section1', DefaultComponentNames.NEW_FEATURE_NAME, 'Feature3', 'gloria', ViewMode.MODE_EDIT);
        server.call('verifyDesignUpdateComponents.featureNarrativeIs', 'Section1', 'Feature3', DefaultComponentNames.NEW_NARRATIVE_TEXT, 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.updateFeatureNarrative', 'Section1', 'Feature3', newNarrative, 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignUpdateComponents.featureNarrativeIs', 'Section1', 'Feature3', newNarrative, 'gloria');
    });

    it('A Designer may edit the Narrative of an existing Feature that is in Scope for the Design Update', function(){

        let newNarrative = 'As a Designer\nI want to update my Narrative\nSo that I can clarify what my Feature is about\n';

        // Setup - add Feature to Scope
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addComponentToUpdateScope', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);
        server.call('verifyDesignUpdateComponents.featureNarrativeIs', 'Section1', 'Feature1', DefaultComponentNames.NEW_NARRATIVE_TEXT, 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.updateFeatureNarrative', 'Section1', 'Feature1', newNarrative, 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignUpdateComponents.featureNarrativeIs', 'Section1', 'Feature1', newNarrative, 'gloria');
    });


    // Conditions
    it('A Design Update Feature Narrative cannot be edited in View Only mode', function(){

        let newNarrative = 'As a Designer\nI want to update my Narrative\nSo that I can clarify what my Feature is about\n';

        // Setup
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addComponentToUpdateScope', ComponentType.FEATURE, 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);
        server.call('verifyDesignUpdateComponents.featureNarrativeIs', 'Section1', 'Feature1', DefaultComponentNames.NEW_NARRATIVE_TEXT, 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.updateFeatureNarrative', 'Section1', 'Feature1', newNarrative, 'gloria', ViewMode.MODE_VIEW);

        // Verify unchanged
        server.call('verifyDesignUpdateComponents.featureNarrativeIs', 'Section1', 'Feature1', DefaultComponentNames.NEW_NARRATIVE_TEXT, 'gloria');
    });

    it('An existing Design Update Feature Narrative cannot be edited if the Feature is not in Scope', function(){

        let newNarrative = 'As a Designer\nI want to update my Narrative\nSo that I can clarify what my Feature is about\n';

        // Setup - don't add Feature to Scope
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('verifyDesignUpdateComponents.featureNarrativeIs', 'Section1', 'Feature1', DefaultComponentNames.NEW_NARRATIVE_TEXT, 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.updateFeatureNarrative', 'Section1', 'Feature1', newNarrative, 'gloria', ViewMode.MODE_VIEW);

        // Verify unchanged
        server.call('verifyDesignUpdateComponents.featureNarrativeIs', 'Section1', 'Feature1', DefaultComponentNames.NEW_NARRATIVE_TEXT, 'gloria');
    });

});
