import {RoleType, ViewMode, ComponentType, DesignVersionStatus, WorkPackageType, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 501 - Add New Design Update', function(){

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
    it('A Designer may add a Design Update to an Updatable Design Version', function(){

        // Setup
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');

        // Execute
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);

        // Verify
        server.call('verifyDesignUpdates.designUpdateExistsCalled', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
    });


    // Conditions
    it('Only a Designer may add Design Updates', function(){

        // Setup - Developer
        server.call('testDesigns.selectDesign', 'Design1', 'hugh');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'hugh');

        // Execute
        server.call('testDesignUpdates.addDesignUpdate', 'hugh', RoleType.DEVELOPER);

        // Verify
        server.call('verifyDesignUpdates.designUpdateDoesNotExistCalled', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'hugh');

        // Setup - Manager
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'miles');

        // Execute
        server.call('testDesignUpdates.addDesignUpdate', 'miles', RoleType.MANAGER);

        // Verify
        server.call('verifyDesignUpdates.designUpdateDoesNotExistCalled', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'miles');
    });

    it('A Design Update cannot be added to a New Design Version', function(){

        // Setup
        // Create a Design
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design2');
        server.call('testDesigns.selectDesign', 'Design2', 'gloria');
        // Name default new Design Version
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion21', RoleType.DESIGNER, 'gloria');
        // Check status is New
        server.call('verifyDesignVersions.designVersionStatusIs', 'DesignVersion21', DesignVersionStatus.VERSION_NEW, 'gloria');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion21', 'gloria');

        // Execute
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);

        // Verify
        server.call('verifyDesignUpdates.designUpdateDoesNotExistCalled', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
    });

    it('A Design Update cannot be added to a Draft Design Version', function(){

        // Setup - following on from previous test
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion21', 'gloria');
        // Publish New DV to to Draft
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion21', 'gloria', RoleType.DESIGNER);
        // Check status is Draft
        server.call('verifyDesignVersions.designVersionStatusIs', 'DesignVersion21', DesignVersionStatus.VERSION_PUBLISHED_DRAFT, 'gloria');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion21', 'gloria');

        // Execute
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);

        // Verify
        server.call('verifyDesignUpdates.designUpdateDoesNotExistCalled', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
    });

    it('A Design Update cannot be added to a Complete Design Version', function(){

        // DesignVersion1 is now Complete
        // Check status is Complete
        server.call('verifyDesignVersions.designVersionStatusIs', 'DesignVersion1', DesignVersionStatus.VERSION_PUBLISHED_COMPLETE, 'gloria');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'gloria');

        // Execute
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);

        // Verify
        server.call('verifyDesignUpdates.designUpdateDoesNotExistCalled', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');

    });

});
