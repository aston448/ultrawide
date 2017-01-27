import {RoleType, DesignVersionStatus, ComponentType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 110 - Edit Design Version Name and Number', function(){

    let createNewDesignVersionFromDraft = function(){
        // Setup
        // Publish the Design Version
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.publishDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');

        // Execute
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');

        // Verify - new DV created with default name as well as DV1
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', 'DesignVersion1');
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        // Select the new DV
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');
        // And status should be updatable
        server.call('verifyDesignVersions.designVersionStatusIs', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_UPDATABLE, 'gloria');
        // And previous DV should be complete
        server.call('testDesignVersions.selectDesignVersion', 'DesignVersion1', 'gloria');
        server.call('verifyDesignVersions.designVersionStatusIs', 'DesignVersion1', DesignVersionStatus.VERSION_DRAFT_COMPLETE, 'gloria');
    };

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

        server.call('testFixtures.clearAllData');

        // Add  Design - Design1: will create default Design Version
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
    });

    afterEach(function(){

    });


    // Actions
    it('A Designer may update the name of a Design Version', function(){

        // Setup
        // Make sure the design and design version is in the user context
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria');

        // Execute
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion1', RoleType.DESIGNER, 'gloria');

        // Verify
        server.call('verifyDesignVersions.currentDesignVersionNameIs', 'DesignVersion1', 'gloria');
    });

    it('A Designer may update the number of a Design Version', function(){

        // Setup
        // Make sure the design and design version is in the user context
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria');

        // Execute
        server.call('testDesignVersions.updateDesignVersionNumber', '1', RoleType.DESIGNER, 'gloria');

        // Verify
        server.call('verifyDesignVersions.currentDesignVersionNumberIs', '1', 'gloria');
    });


    // Conditions
    it('Only a Designer may update a Design Version Name', function(){

        // Try Developer
        // Setup
        // Make sure the design and design version is in the user context
        server.call('testDesigns.selectDesign', 'Design1', 'hugh');
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'hugh');

        // Execute
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion1', RoleType.DEVELOPER, 'hugh');

        // Verify that name has not in fact changed
        server.call('verifyDesignVersions.currentDesignVersionNameIs', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'hugh');

        // Try Manager
        // Setup
        // Make sure the design and design version is in the user context
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'miles');

        // Execute
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion1', RoleType.MANAGER, 'miles');

        // Verify that name has not in fact changed
        server.call('verifyDesignVersions.currentDesignVersionNameIs', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'miles');

    });

    it('Only a Designer may update a Design Version number', function(){

        // Try Developer
        // Setup
        // Make sure the design and design version is in the user context
        server.call('testDesigns.selectDesign', 'Design1', 'hugh');
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'hugh');

        // Execute
        server.call('testDesignVersions.updateDesignVersionNumber', '1', RoleType.DEVELOPER, 'hugh');

        // Verify that number has not in fact changed
        server.call('verifyDesignVersions.currentDesignVersionNumberIs', DefaultItemNames.NEW_DESIGN_VERSION_NUMBER, 'hugh');

        // Try Manager
        // Setup
        // Make sure the design and design version is in the user context
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'miles');

        // Execute
        server.call('testDesignVersions.updateDesignVersionNumber', '1', RoleType.MANAGER, 'miles');

        // Verify that number has not in fact changed
        server.call('verifyDesignVersions.currentDesignVersionNumberIs', DefaultItemNames.NEW_DESIGN_VERSION_NUMBER, 'miles');
    });

    it('A Design Version may not be renamed to the same name as another version in the Design', function(){
        // Setup
        // Make sure the design and design version is in the user context
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria');
        // Call it DesignVersion1
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        // Create new Design Version
        createNewDesignVersionFromDraft();

        // Execute - try to rename new version to DesignVersion1
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion1', RoleType.DESIGNER, 'gloria');

        // Verify
        // Check that still retains default Name
        server.call('verifyDesignVersions.currentDesignVersionNameIs', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');

    });

    it('A Design Version may not be renumbered to the same number as another version in the Design', function(){
        // Setup
        // Make sure the design and design version is in the user context
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria');
        // Call it DesignVersion1 with number 1.0
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        server.call('testDesignVersions.updateDesignVersionNumber', '1.0', RoleType.DESIGNER, 'gloria');
        // Create new Design Version
        createNewDesignVersionFromDraft();

        // Execute - try to rename new version to DesignVersion1
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionNumber', '1.0', RoleType.DESIGNER, 'gloria');

        // Verify
        // Check that still retains default Number
        server.call('verifyDesignVersions.currentDesignVersionNumberIs', DefaultItemNames.NEXT_DESIGN_VERSION_NUMBER, 'hugh');
    });

});
