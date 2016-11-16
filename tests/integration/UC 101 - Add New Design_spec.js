
import {RoleType} from '../../imports/constants/constants.js'

describe('UC 101 - Add New Design', function() {

    it('A new Design can only be added by a Designer', function() {
        // Setup -------------------------------------------------------------------------------------------------------
        server.call('testFixtures.clearAllData');

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('test.addNewDesign', RoleType.DEVELOPER);

        // Verify ------------------------------------------------------------------------------------------------------
        // No new design created
        server.call('test.verifyNoNewDesign', (function(error, result){expect(!error);}));

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('test.addNewDesign', RoleType.MANAGER);

        // Verify ------------------------------------------------------------------------------------------------------
        // No new design created
        server.call('test.verifyNoNewDesign', (function(error, result){expect(!error);}));

    });

    it('A Designer can add a new Design to Ultrawide', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        server.call('testFixtures.clearAllData');

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('test.addNewDesign', RoleType.DESIGNER);

        // Verify ------------------------------------------------------------------------------------------------------
        // Created a new removable Design
        server.call('test.verifyNewDesign', (function(error, result){expect(!error);}));

    });

    it('When a new Design is added an initial Design Version is created for it', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        server.call('testFixtures.clearAllData');

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('test.addNewDesign', RoleType.DESIGNER);

        // Verify ------------------------------------------------------------------------------------------------------
        // Created a new Design and a new Design Version linked to it
        server.call('test.verifyNewDesign', (function(error, result){expect(!error);}));
        server.call('test.verifyNewDesignVersion', (function(error, result){expect(!error);}));

    })
});


