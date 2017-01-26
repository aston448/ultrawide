import {RoleType, DesignVersionStatus, ComponentType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 109 - View Design Version', function(){

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
    it('A Design Version contains a View option');


    // Actions
    it('A Designer can view an New Design Version', function(){

        // Setup
        // Make sure the design is in the user context and the design version isn't
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('verifyUserContext.designVersionIsNone', 'gloria', (function(error, result){expect(!error);}));

        // Execute
        server.call('testDesignVersions.viewDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, RoleType.DESIGNER, 'gloria');

        // Verify
        // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
        server.call('verifyUserContext.designVersionIs', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria', (function(error, result){expect(!error);}));
    });

    it('All roles can view a Draft Design Version', function(){
        // Setup
        // Make sure the design is in the user context and the design version isn't
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('verifyUserContext.designVersionIsNone', 'gloria', (function(error, result){expect(!error);}));
        // Publish it so its draft
        server.call('testDesignVersions.publishDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, RoleType.DESIGNER, 'gloria');

        // Try for Designer
        // Execute
        server.call('testDesignVersions.viewDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, RoleType.DESIGNER, 'gloria');

        // Verify
        // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
        server.call('verifyUserContext.designVersionIs', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria', (function(error, result){expect(!error);}));

        // Try for Developer
        server.call('testDesigns.selectDesign', 'Design1', 'hugh');
        server.call('verifyUserContext.designVersionIsNone', 'hugh', (function(error, result){expect(!error);}));

        // Execute
        server.call('testDesignVersions.viewDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, RoleType.DEVELOPER, 'hugh');

        // Verify
        // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
        server.call('verifyUserContext.designVersionIs', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'hugh', (function(error, result){expect(!error);}));

        // Try for Manager
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('verifyUserContext.designVersionIsNone', 'miles', (function(error, result){expect(!error);}));

        // Execute
        server.call('testDesignVersions.viewDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, RoleType.MANAGER, 'miles');

        // Verify
        // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
        server.call('verifyUserContext.designVersionIs', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'miles', (function(error, result){expect(!error);}));
    });


    it('All roles can view a Final Design Version');


    // Conditions
    it('Only a Designer can view an New Design Version', function(){
        // Try for Developer
        // Setup
        // Make sure the design is in the user context and the design version isn't
        server.call('testDesigns.selectDesign', 'Design1', 'hugh');
        server.call('verifyUserContext.designVersionIsNone', 'hugh', (function(error, result){expect(!error);}));

        // Execute
        server.call('testDesignVersions.viewDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, RoleType.DEVELOPER, 'hugh');

        // Verify
        // The Design version should not be set
        server.call('verifyUserContext.designVersionIsNone', 'hugh', (function(error, result){expect(!error);}));

        // Try for Manager
        // Setup
        // Make sure the design is in the user context and the design version isn't
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('verifyUserContext.designVersionIsNone', 'miles', (function(error, result){expect(!error);}));

        // Execute
        server.call('testDesignVersions.viewDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, RoleType.MANAGER, 'miles');

        // Verify
        // The Design version should not be set
        server.call('verifyUserContext.designVersionIsNone', 'miles', (function(error, result){expect(!error);}));
    });


    // Consequences
    it('When a non-editable Design Version is viewed it is opened View Only with no option to edit');

    it('When an editable Design Version is opened by a Designer it is opened View Only with an option to edit');

});
