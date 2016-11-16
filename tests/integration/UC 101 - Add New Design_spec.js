
import {RoleType} from '../../imports/constants/constants.js'

describe('UC 101 - Add New Design', function() {
    it('A Designer can add a new Design to Ultrawide', function() {

        // Setup ===================================================================================================
        const expectedDesignName = 'New Design';
        server.call('testFixtures.clearAllData');

        // Execute =================================================================================================
        server.call('test.addNewDesign', RoleType.DESIGNER);

        // Verify ==================================================================================================

        // Created a new removable Design
        server.call('test.verifyNewDesign', (function(error, result){expect(!error);}));

    })
});


