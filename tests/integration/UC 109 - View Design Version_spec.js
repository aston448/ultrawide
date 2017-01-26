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


    it('All roles can view a Complete Design Version', function(){

        // Setup
        // Make sure the design is in the user context and the design version isn't
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('verifyUserContext.designVersionIsNone', 'gloria', (function(error, result){expect(!error);}));
        // Publish it so its draft
        server.call('testDesignVersions.publishDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, RoleType.DESIGNER, 'gloria');
        // Create next version
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

        // Try for Designer
        // Execute
        server.call('testDesignVersions.viewDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');

        // Verify
        // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
        server.call('verifyUserContext.designVersionIs', 'DesignVersion1', 'gloria', (function(error, result){expect(!error);}));

        // Try for Developer
        server.call('testDesigns.selectDesign', 'Design1', 'hugh');
        server.call('verifyUserContext.designVersionIsNone', 'hugh', (function(error, result){expect(!error);}));

        // Execute
        server.call('testDesignVersions.viewDesignVersion', 'DesignVersion1', RoleType.DEVELOPER, 'hugh');

        // Verify
        // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
        server.call('verifyUserContext.designVersionIs', 'DesignVersion1', 'hugh', (function(error, result){expect(!error);}));

        // Try for Manager
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('verifyUserContext.designVersionIsNone', 'miles', (function(error, result){expect(!error);}));

        // Execute
        server.call('testDesignVersions.viewDesignVersion', 'DesignVersion1', RoleType.MANAGER, 'miles');

        // Verify
        // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
        server.call('verifyUserContext.designVersionIs', 'DesignVersion1', 'miles', (function(error, result){expect(!error);}));

    });

    it('All roles can view an Updatable Design Version', function(){

        // Setup
        // Make sure the design is in the user context and the design version isn't
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('verifyUserContext.designVersionIsNone', 'gloria', (function(error, result){expect(!error);}));
        // Publish it so its draft
        server.call('testDesignVersions.publishDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, RoleType.DESIGNER, 'gloria');
        // Create next version
        server.call('testDesignVersions.createNextDesignVersion', 'DesignVersion1', RoleType.DESIGNER, 'gloria');
        // Verify - new DV created with default name as well as DV1
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', 'DesignVersion1');
        server.call('verifyDesignVersions.designVersionExistsCalled', 'Design1', DefaultItemNames.NEXT_DESIGN_VERSION_NAME);
        // Select the new DV and name it
        server.call('testDesignVersions.selectDesignVersion', DefaultItemNames.NEXT_DESIGN_VERSION_NAME, 'gloria');
        server.call('testDesignVersions.updateDesignVersionName', 'DesignVersion2', RoleType.DESIGNER, 'gloria');
        // And status should be updatable
        server.call('verifyDesignVersions.designVersionStatusIs', 'DesignVersion2', DesignVersionStatus.VERSION_UPDATABLE, 'gloria');

        // Try for Designer
        // Execute
        server.call('testDesignVersions.viewDesignVersion', 'DesignVersion2', RoleType.DESIGNER, 'gloria');

        // Verify
        // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
        server.call('verifyUserContext.designVersionIs', 'DesignVersion2', 'gloria', (function(error, result){expect(!error);}));

        // Try for Developer
        server.call('testDesigns.selectDesign', 'Design1', 'hugh');
        server.call('verifyUserContext.designVersionIsNone', 'hugh', (function(error, result){expect(!error);}));

        // Execute
        server.call('testDesignVersions.viewDesignVersion', 'DesignVersion2', RoleType.DEVELOPER, 'hugh');

        // Verify
        // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
        server.call('verifyUserContext.designVersionIs', 'DesignVersion2', 'hugh', (function(error, result){expect(!error);}));

        // Try for Manager
        server.call('testDesigns.selectDesign', 'Design1', 'miles');
        server.call('verifyUserContext.designVersionIsNone', 'miles', (function(error, result){expect(!error);}));

        // Execute
        server.call('testDesignVersions.viewDesignVersion', 'DesignVersion2', RoleType.MANAGER, 'miles');

        // Verify
        // The Design version will be in the user context if now viewing - other evidence is interface specific and can only be seen in acceptance tests
        server.call('verifyUserContext.designVersionIs', 'DesignVersion2', 'miles', (function(error, result){expect(!error);}));

    });


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
