import {RoleType, ViewMode, ComponentType, DesignVersionStatus, WorkPackageType, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 552 - Edit Design Update Component Name', function(){

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
        server.call('textFixtures.clearDesignUpdates')
    });

    afterEach(function(){

    });


    // Actions
    it('A Design Update Component name can be edited and saved', function(){

        //Setup - add a new Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        // Add new Feature to original Section 1
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addFeatureToDesignSection', 'Application1', 'Section1', 'gloria', ViewMode.MODE_EDIT);
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.FEATURE, 'Section1', DefaultComponentNames.NEW_FEATURE_NAME, 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE, 'Section1', DefaultComponentNames.NEW_FEATURE_NAME, 'Feature99', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.FEATURE, 'Section1', 'Feature99', 'gloria');
    });


    // Conditions
    it('Design Update Component names can only be edited when in edit mode', function(){

        //Setup - add a new Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        // Add new Feature to original Section 1
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addFeatureToDesignSection', 'Application1', 'Section1', 'gloria', ViewMode.MODE_EDIT);
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.FEATURE, 'Section1', DefaultComponentNames.NEW_FEATURE_NAME, 'gloria');

        // Execute
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE, 'Section1', DefaultComponentNames.NEW_FEATURE_NAME, 'Feature99', 'gloria', ViewMode.MODE_VIEW);

        // Verify - name not changed
        server.call('verifyDesignUpdateComponents.componentDoesNotExistCalled', ComponentType.FEATURE, 'Feature99', 'gloria');
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.FEATURE, 'Section1', DefaultComponentNames.NEW_FEATURE_NAME, 'gloria');
    });

    it('An Application name may not be changed to the same name as another Application in the Design Update or Base Design Version', function(){

        //Setup - add a new Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        // Add Application
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addApplication', 'gloria', ViewMode.MODE_EDIT);
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.APPLICATION, 'Application1', 1, 'gloria');
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 1, 'gloria');

        // Try to call it Application1
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.APPLICATION, 'NONE', DefaultComponentNames.NEW_APPLICATION_NAME, 'Application1', 'gloria', ViewMode.MODE_EDIT);

        // Verify - still 1 of each
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.APPLICATION, 'Application1', 1, 'gloria');
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 1, 'gloria');
    });

    it('A Feature name may not be changed to the same name as another Feature in the Design Update or Base Design Version', function(){

        //Setup - add a new Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        // Add Feature
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addFeatureToDesignSection', 'Application1', 'Section1','gloria', ViewMode.MODE_EDIT);
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.FEATURE, 'Feature1', 1, 'gloria');
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 1, 'gloria');

        // Try to call it Feature1
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE, 'Section1', DefaultComponentNames.NEW_FEATURE_NAME, 'Feature1', 'gloria', ViewMode.MODE_EDIT);

        // Verify - still 1 of each
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.FEATURE, 'Feature1', 1, 'gloria');
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.FEATURE, DefaultComponentNames.NEW_FEATURE_NAME, 1, 'gloria');
    });

    it('A Scenario name may not be changed to the same name as another Scenario in the Design Update or Base Design Version', function(){

        //Setup - add a new Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        // Add Scenario
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addScenarioToFeature', 'Section1', 'Feature1','gloria', ViewMode.MODE_EDIT);
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.SCENARIO, 'Scenario1', 1, 'gloria');
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 1, 'gloria');

        // Try to call it Scenario1
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.SCENARIO, 'Feature1', DefaultComponentNames.NEW_SCENARIO_NAME, 'Scenario1', 'gloria', ViewMode.MODE_EDIT);

        // Verify - still 1 of each
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.SCENARIO, 'Scenario1', 1, 'gloria');
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.SCENARIO, DefaultComponentNames.NEW_SCENARIO_NAME, 1, 'gloria');
    });

    it('A Design Section name may not be changed to the same name as another Design Section under the same parent section in the Design Update', function(){

        //Setup - add a new Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        // Add Design Section
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addDesignSectionToApplication', 'NONE', 'Application1','gloria', ViewMode.MODE_EDIT);
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.DESIGN_SECTION, 'Section1', 1, 'gloria');
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 1, 'gloria');

        // Try to call it Section1
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.DESIGN_SECTION, 'Application1', DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1', 'gloria', ViewMode.MODE_EDIT);

        // Verify - still 1 of each
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.DESIGN_SECTION, 'Section1', 1, 'gloria');
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.DESIGN_SECTION, DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 1, 'gloria');
    });

    it('A Feature Aspect name may not be changed to the same name as another Feature Aspect in the same Feature in the Design Update', function(){

        //Setup - add a new Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        // Add Feature Aspect
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addFeatureAspectToFeature', 'Section1', 'Feature1','gloria', ViewMode.MODE_EDIT);
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.FEATURE_ASPECT, 'Actions', 1, 'gloria');
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 1, 'gloria');

        // Try to call it Actions
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE_ASPECT, 'Feature1', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Actions', 'gloria', ViewMode.MODE_EDIT);

        // Verify - still 1 of each
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.FEATURE_ASPECT, 'Actions', 1, 'gloria');
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.FEATURE_ASPECT, DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 1, 'gloria');
    });

    it('A Design Section name may be changed to the same name as a Design Section in a different parent in the Design Update', function(){

        //Setup - add a new Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        // Add Application
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addApplication', 'gloria', ViewMode.MODE_EDIT);
        // Call it Application2
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.APPLICATION, 'NONE', DefaultComponentNames.NEW_APPLICATION_NAME, 'Application2', 'gloria', ViewMode.MODE_EDIT);
        // Currently 1 Section1
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.DESIGN_SECTION, 'Section1', 1, 'gloria');

        // Execute - add a new Section1 under Application2
        server.call('testDesignUpdateComponents.addDesignSectionToApplication', 'NONE', 'Application2','gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.DESIGN_SECTION, 'Application2', DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'Section1', 'gloria', ViewMode.MODE_EDIT);

        // Verify - 2 Section1s
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.DESIGN_SECTION, 'Section1', 2, 'gloria');
    });

    it('A Feature Aspect name may be changed to the same name as a Feature Aspect in another Feature in the Design Update', function(){

        //Setup - add a new Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        // Add New Feature Aspect to Feature1
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addFeatureAspectToFeature', 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);
        // Call it Aspect1
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE_ASPECT, 'Feature1', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect1', 'gloria', ViewMode.MODE_EDIT);
        // Currently 1 Aspect1
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.FEATURE_ASPECT, 'Aspect1', 1, 'gloria');

        // Execute - add a new Feature Aspect to Feature 2
        server.call('testDesignUpdateComponents.addFeatureAspectToFeature', 'Section2', 'Feature2', 'gloria', ViewMode.MODE_EDIT);
        server.call('testDesignUpdateComponents.updateComponentName', ComponentType.FEATURE_ASPECT, 'Feature2', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'Aspect1', 'gloria', ViewMode.MODE_EDIT);

        // Verify - 2 Aspect1s
        server.call('verifyDesignUpdateComponents.componentCountWithNameIs', ComponentType.FEATURE_ASPECT, 'Aspect1', 2, 'gloria');
    });


    // Consequences
    it('Updating the name of a Design Update Component updates it in any Work Package that includes the Design Update Component');

});
