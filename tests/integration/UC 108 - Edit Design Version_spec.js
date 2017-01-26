import {RoleType, DesignVersionStatus, ComponentType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 108 - Edit Design Version', function(){

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


    // Interface
    it('An editable Design Version contains an Edit option');


    // Actions
    it('A Designer can edit a New Design Version', function(){

        // Setup
        // Make sure the design is in the user context and the design version isn't
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('verifyUserContext.designVersionIsNone', 'gloria', (function(error, result){expect(!error);}));

        // Execute
        server.call('testDesignVersions.editDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, RoleType.DESIGNER, 'gloria');

        // Verify
        // The Design version will be in the user context if now editing - other evidence is interface specific and can only be seen in acceptance tests
        server.call('verifyUserContext.designVersionIs', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria', (function(error, result){expect(!error);}));
    });

    it('A Designer can edit a Draft Design Version', function(){
        // Setup
        // Make sure the design is in the user context
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        // Publish it so its draft
        server.call('testDesignVersions.publishDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, RoleType.DESIGNER, 'gloria');
        // Go back and select the Design so that no Design Version in user context
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('verifyUserContext.designVersionIsNone', 'gloria', (function(error, result){expect(!error);}));

        // Execute
        server.call('testDesignVersions.editDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, RoleType.DESIGNER, 'gloria');

        // Verify
        // The Design version will be in the user context if now editing - other evidence is interface specific and can only be seen in acceptance tests
        server.call('verifyUserContext.designVersionIs', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria', (function(error, result){expect(!error);}));
    });


    // Conditions
    it('Only a Designer can edit a Design Version', function(){

        // Try for Developer
        // Setup
        // Make sure the design is in the user context and the design version isn't
        server.call('testDesigns.selectDesign', 'Design1', 'hugh');
        server.call('verifyUserContext.designVersionIsNone', 'hugh', (function(error, result){expect(!error);}));

        // Execute
        server.call('testDesignVersions.editDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, RoleType.DEVELOPER, 'hugh');

        // Verify
        // The Design version should not be in the context
        server.call('verifyUserContext.designVersionIsNone', 'hugh', (function(error, result){expect(!error);}));

        // Try for Manager
        // Setup
        // Make sure the design is in the user context and the design version isn't
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('verifyUserContext.designVersionIsNone', 'miles', (function(error, result){expect(!error);}));

        // Execute
        server.call('testDesignVersions.editDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, RoleType.MANAGER, 'miles');

        // Verify
        // The Design version should not be in the context
        server.call('verifyUserContext.designVersionIsNone', 'miles', (function(error, result){expect(!error);}));
    });


    it('A Final Design Version cannot be edited');


    // Consequences
    it('When a Design Version is edited it is opened in edit mode with an option to view only');

});
