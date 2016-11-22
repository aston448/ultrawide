import {RoleType, DesignVersionStatus, ComponentType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 110 - Edit Design Version Name and Number', function(){

    before(function(){

    });

    after(function(){

    });

    beforeEach(function(){

        // Add  Design - Design1: will create default Design Version
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
    });

    afterEach(function(){

    });


    // Interface
    it('Each Design Version has a edit option against its name');

    it('Each Design Version has an edit option against its number');

    it('When a Design Version name or number is being edited there is a save option');

    it('When a Design Version name or number is being edited there is an undo option');


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

    it('A Design Version may not be renamed to the same name as another version in the Design');

    it('A Design Version may not be renumbered to the same number as another version in the Design');

});
