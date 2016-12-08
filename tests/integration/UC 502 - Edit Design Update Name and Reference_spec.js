import {RoleType, ViewMode, ComponentType, DesignVersionStatus, WorkPackageType, WorkPackageStatus} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 502 - Edit Design Update Name and Reference', function(){

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
    it('A Designer may update a Design Update name', function(){

        // Setup - create a new Design Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('verifyDesignUpdates.designUpdateExistsCalled', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');

        // Execute
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');

        // Verify
        server.call('verifyDesignUpdates.currentDesignUpdateNameIs', 'DesignUpdate1', 'gloria');

    });

    it('A Designer may update a Design Update reference', function(){

        // Setup - create a new Design Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('verifyDesignUpdates.designUpdateExistsCalled', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');

        // Execute
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateRef', 'CR999', RoleType.DESIGNER, 'gloria');

        // Verify
        server.call('verifyDesignUpdates.currentDesignUpdateRefIs', 'CR999', 'gloria');
    });


    // Conditions
    it('Only a Designer may edit a Design Update name', function(){

        // Setup - create a new Design Update and publish it
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('verifyDesignUpdates.designUpdateExistsCalled', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.publishDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria', RoleType.DESIGNER);

        // Try as Developer
        server.call('testDesigns.selectDesign', 'Design1', 'hugh');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'hugh');
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'hugh');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DEVELOPER, 'hugh');

        // Verify no change
        server.call('verifyDesignUpdates.currentDesignUpdateNameIs', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'hugh');

        // Try as Manager
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'miles');
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'miles');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.MANAGER, 'miles');

        // Verify no change
        server.call('verifyDesignUpdates.currentDesignUpdateNameIs', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'miles');
    });

    it('Only a Designer may edit a Design Update reference', function(){

        // Setup - create a new Design Update and publish it
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('verifyDesignUpdates.designUpdateExistsCalled', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.publishDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria', RoleType.DESIGNER);

        // Try as Developer
        server.call('testDesigns.selectDesign', 'Design1', 'hugh');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'hugh');
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'hugh');
        server.call('testDesignUpdates.updateDesignUpdateRef', 'CR999', RoleType.DEVELOPER, 'hugh');

        // Verify no change
        server.call('verifyDesignUpdates.currentDesignUpdateRefIs', DefaultItemNames.NEW_DESIGN_UPDATE_REF, 'hugh');

        // Try as Manager
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'miles');
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'miles');
        server.call('testDesignUpdates.updateDesignUpdateRef', 'CR999', RoleType.MANAGER, 'miles');

        // Verify no change
        server.call('verifyDesignUpdates.currentDesignUpdateRefIs', DefaultItemNames.NEW_DESIGN_UPDATE_REF, 'miles');
    });

    it('A Design Update name must be unique for the Base Design Version', function(){

        // Setup - create a new Design Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('verifyDesignUpdates.designUpdateExistsCalled', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('verifyDesignUpdates.currentDesignUpdateNameIs', 'DesignUpdate1', 'gloria');
        // And now a second Update....
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('verifyDesignUpdates.designUpdateExistsCalled', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');

        // Execute - try to give it same name as before
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');

        // Verify - name has not changed
        server.call('verifyDesignUpdates.currentDesignUpdateNameIs', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
    });

    it('The same Design Update reference may be used on more than one Design Update for a Base Design Version', function(){
        // Setup - create a new Design Update
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion2', 'gloria');
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('verifyDesignUpdates.designUpdateExistsCalled', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate1', RoleType.DESIGNER, 'gloria');
        server.call('verifyDesignUpdates.currentDesignUpdateNameIs', 'DesignUpdate1', 'gloria');
        // And now a second Update....
        server.call('testDesignUpdates.addDesignUpdate', 'gloria', RoleType.DESIGNER);
        server.call('verifyDesignUpdates.designUpdateExistsCalled', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.selectDesignUpdate', DefaultItemNames.NEW_DESIGN_UPDATE_NAME, 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateName', 'DesignUpdate2', RoleType.DESIGNER, 'gloria');

        // Execute - set same ref on both
        server.call('testDesignUpdates.selectDesignUpdate', 'DesignUpdate1', 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateRef', 'CR999', RoleType.DESIGNER, 'gloria');
        server.call('testDesignUpdates.selectDesignUpdate', 'DesignUpdate2', 'gloria');
        server.call('testDesignUpdates.updateDesignUpdateRef', 'CR999', RoleType.DESIGNER, 'gloria');

        // Verify both changed
        server.call('testDesignUpdates.selectDesignUpdate', 'DesignUpdate1', 'gloria');
        server.call('verifyDesignUpdates.currentDesignUpdateNameIs', 'DesignUpdate1', 'gloria');
        server.call('verifyDesignUpdates.currentDesignUpdateRefIs', 'CR999', 'gloria');

        server.call('testDesignUpdates.selectDesignUpdate', 'DesignUpdate2', 'gloria');
        server.call('verifyDesignUpdates.currentDesignUpdateNameIs', 'DesignUpdate2', 'gloria');
        server.call('verifyDesignUpdates.currentDesignUpdateRefIs', 'CR999', 'gloria');

    });

});
