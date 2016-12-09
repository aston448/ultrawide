import {RoleType, ViewMode, ComponentType, DesignVersionStatus, WorkPackageType, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 550 - Add Organisational Design Update Component', function(){

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
    });

    afterEach(function(){

    });


    // Actions
    it('An Application can be added to a Design Update', function(){

        //Setup - add a new Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);

        // Add Application
        server.call('testDesignUpdateComponents.addApplication', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.APPLICATION, 'NONE', DefaultComponentNames.NEW_APPLICATION_NAME, 'gloria');

    });

    it('A Design Section can be added to a Design Update Application', function(){

        //Setup - add a new Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);

        // Add new Section to original Application 1
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addDesignSectionToApplication', 'NONE', 'Application1', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.DESIGN_SECTION, 'Application1', DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'gloria');
    });

    it('A Design Section can be added to a Design Update Design Section', function(){

        //Setup - add a new Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);

        // Add new Section to original Section 1
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addSectionToDesignSection', 'Application1', 'Section1', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.DESIGN_SECTION, 'Section1', DefaultComponentNames.NEW_DESIGN_SECTION_NAME, 'gloria');
    });

    it('A Feature Aspect can be added to a Design Update Feature', function(){

        //Setup - add a new Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);

        // Add new Section to original Section 1
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdateComponents.addFeatureAspectToFeature', 'Section1', 'Feature1', 'gloria', ViewMode.MODE_EDIT);

        // Verify
        server.call('verifyDesignUpdateComponents.componentExistsInDesignUpdateWithParentCalled', ComponentType.FEATURE_ASPECT, 'Feature1', DefaultComponentNames.NEW_FEATURE_ASPECT_NAME, 'gloria');
    });


    // Conditions
    it('An organisational Design Update Component can only be added in edit mode', function(){

        //Setup - add a new Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdates.editDesignUpdate', 'DesignUpdate1', 'gloria', RoleType.DESIGNER);

        // Add Application
        server.call('testDesignUpdateComponents.addApplication', 'gloria', ViewMode.MODE_VIEW);

        // Verify
        server.call('verifyDesignUpdateComponents.componentDoesNotExistCalled', ComponentType.APPLICATION, DefaultComponentNames.NEW_APPLICATION_NAME, 'gloria');
    });

    it('An organisational Design Update Component cannot be added to a component removed in this or another Design Update');


    // Consequences
    it('When an organisational Design Component is added to a Design Update it is also added to the Design Update Scope');

    it('When an organisational Design Component is added to a Draft Design Update is is also added to any Work Package including the update');

    it('An organisational Design Component added to a Design Update appears as an organisational addition in the Design Update summary');

});
