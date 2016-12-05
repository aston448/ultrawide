import {RoleType, DesignVersionStatus, ComponentType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 105 - Unpublish Design Version', function(){

    beforeEach(function(){

        server.call('testFixtures.clearAllData');

        // Add  Design - Design1: will create default Design Version
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design1');

    });

    afterEach(function(){

    });


    // Interface
    it('A Design Version in a Draft state has an Unpublish option on it');


    // Actions
    it('A Designer can revert a Design Version from Draft published to New unpublished', function() {

        // Setup
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.publishDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria', RoleType.DESIGNER);
        server.call('verifyDesignVersions.designVersionStatusIs', DefaultItemNames.NEW_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_PUBLISHED_DRAFT, 'gloria', (function(error, result){expect(!error);}));

        // Execute
        server.call('testDesignVersions.unpublishDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria', RoleType.DESIGNER);

        // Validate
        server.call('verifyDesignVersions.designVersionStatusIs', DefaultItemNames.NEW_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_NEW, 'gloria', (function(error, result){expect(!error);}));

    });


    // Conditions
    it('Only a Draft Design Version can be unpublished');

    it('Only a Designer can unpublish a Design Version', function(){

        // Setup -------------------------------------------------------------------------------------------------------
        // Get Designer to publish it...
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');
        server.call('testDesignVersions.publishDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria', RoleType.DESIGNER);
        server.call('verifyDesignVersions.designVersionStatusIs', DefaultItemNames.NEW_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_PUBLISHED_DRAFT, 'gloria', (function(error, result){expect(!error);}));

        // See if Developer can unpublish
        // Make sure the design is in the user context
        server.call('testDesigns.selectDesign', 'Design1', 'hugh');

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesignVersions.unpublishDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'hugh', RoleType.DEVELOPER);

        // Verify ------------------------------------------------------------------------------------------------------
        server.call('verifyDesignVersions.designVersionStatusIsNot', DefaultItemNames.NEW_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_NEW, 'hugh', (function(error, result){expect(!error);}));
        server.call('verifyDesignVersions.designVersionStatusIs', DefaultItemNames.NEW_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_PUBLISHED_DRAFT, 'hugh', (function(error, result){expect(!error);}));

        // See if Manager can unpublish
        // Make sure the design is in the user context
        server.call('testDesigns.selectDesign', 'Design1', 'miles');

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesignVersions.unpublishDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'miles', RoleType.MANAGER);

        // Verify ------------------------------------------------------------------------------------------------------
        server.call('verifyDesignVersions.designVersionStatusIsNot', DefaultItemNames.NEW_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_NEW, 'miles', (function(error, result){expect(!error);}));
        server.call('verifyDesignVersions.designVersionStatusIs', DefaultItemNames.NEW_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_PUBLISHED_DRAFT, 'miles', (function(error, result){expect(!error);}));
    });

    it('A Design Version that has Design Updates cannot be unpublished');

});