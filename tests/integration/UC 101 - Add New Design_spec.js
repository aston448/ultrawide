
import {RoleType} from '../../imports/constants/constants.js'

beforeEach(function(){
    server.call('testFixtures.clearAllData');
});

afterEach(function(){
    server.call('testLogout');
});

describe('UC 101 - Add New Design', function() {

    it('A new Design can only be added by a Designer', function() {
        // Setup -------------------------------------------------------------------------------------------------------
        server.call('testLoginAs', RoleType.DEVELOPER);

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesigns.addNewDesign', RoleType.DEVELOPER);

        // Verify ------------------------------------------------------------------------------------------------------
        // No new design created
        server.call('verifyDesigns.noNewDesign', (function(error, result){expect(!error);}));

        // Setup -------------------------------------------------------------------------------------------------------
        server.call('testLogout');
        server.call('testLoginAs', RoleType.MANAGER);

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesigns.addNewDesign', RoleType.MANAGER);

        // Verify ------------------------------------------------------------------------------------------------------
        // No new design created
        server.call('verifyDesigns.noNewDesign', (function(error, result){expect(!error);}));

    });

    it('A Designer can add a new Design to Ultrawide', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        server.call('testLoginAs', RoleType.DESIGNER);

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);

        // Verify ------------------------------------------------------------------------------------------------------
        // Created a new removable Design
        server.call('verifyDesigns.newDesign', (function(error, result){expect(!error);}));

    });

    it('When a new Design is added an initial Design Version is created for it', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        server.call('testLoginAs', RoleType.DESIGNER);

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);

        // Verify ------------------------------------------------------------------------------------------------------
        // Created a new Design and a new Design Version linked to it
        server.call('verifyDesigns.newDesign', (function(error, result){expect(!error);}));
        server.call('verifyDesigns.newDesignVersion', (function(error, result){expect(!error);}));

    })
});


