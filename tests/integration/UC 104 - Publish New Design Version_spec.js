import {RoleType, DesignVersionStatus, ComponentType} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';

describe('UC 103 - Remove Design', function() {

    beforeEach(function(){
        server.call('testFixtures.clearAllData');

        // Add  Design - Design1: will create default Design Version
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Design1');
    });

    afterEach(function(){

    });

    it('A Designer can update a Design Version from New to Published', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        // Make sure the design is in the user context
        server.call('testDesigns.selectDesign', 'Design1', 'gloria');

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesignVersions.publishDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'gloria', RoleType.DESIGNER);

        // Verify ------------------------------------------------------------------------------------------------------
        server.call('verifyDesignVersions.designVersionStatusIs', DefaultItemNames.NEW_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_PUBLISHED_DRAFT, 'gloria', (function(error, result){expect(!error);}))
    });

    it('Only a Designer can publish a Design Version', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        // Make sure the design is in the user context
        server.call('testDesigns.selectDesign', 'Design1', 'hugh');

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesignVersions.publishDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'hugh', RoleType.DEVELOPER);

        // Verify ------------------------------------------------------------------------------------------------------
        server.call('verifyDesignVersions.designVersionStatusIsNot', DefaultItemNames.NEW_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_PUBLISHED_DRAFT, 'hugh', (function(error, result){expect(!error);}))

        // Setup -------------------------------------------------------------------------------------------------------
        // Make sure the design is in the user context
        server.call('testDesigns.selectDesign', 'Design1', 'miles');

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesignVersions.publishDesignVersion', DefaultItemNames.NEW_DESIGN_VERSION_NAME, 'hugh', RoleType.MANAGER);

        // Verify ------------------------------------------------------------------------------------------------------
        server.call('verifyDesignVersions.designVersionStatusIsNot', DefaultItemNames.NEW_DESIGN_VERSION_NAME, DesignVersionStatus.VERSION_PUBLISHED_DRAFT, 'miles', (function(error, result){expect(!error);}))

    });

    it('Only a New Design Version can be published');

});
