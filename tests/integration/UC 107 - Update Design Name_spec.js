import {RoleType} from '../../imports/constants/constants.js'

beforeEach(function(){
    server.call('testFixtures.clearAllData');
});

afterEach(function(){
    server.call('testLogout');
});

describe('UC 107 - Update Design Name', function() {

    it('Only a Designer can update a Design name', function() {
        // Setup -------------------------------------------------------------------------------------------------------
        server.call('testLoginAs', RoleType.DESIGNER);
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);

        // Execute -----------------------------------------------------------------------------------------------------
        // Give Developer a go...
        server.call('testLogout');
        server.call('testLoginAs', RoleType.DEVELOPER);
        server.call('testDesigns.updateDesignName', RoleType.DEVELOPER, 'New Design', 'Updated Name');

        // Verify ------------------------------------------------------------------------------------------------------
        // No update to name
        server.call('verifyDesigns.designDoesNotExistCalled', 'Updated Name', (function(error, result){expect(!error);}));
        server.call('verifyDesigns.designExistsCalled', 'New Design', (function(error, result){expect(!error);}));
        // And there is only one design
        server.call('verifyDesigns.designCountIs', 1, (function(error, result){expect(!error);}));

        // Execute -----------------------------------------------------------------------------------------------------
        // Give Manager a go...
        server.call('testLogout');
        server.call('testLoginAs', RoleType.MANAGER);
        server.call('testDesigns.updateDesignName', RoleType.MANAGER, 'New Design', 'Updated Name');

        // Verify ------------------------------------------------------------------------------------------------------
        // No update to name
        server.call('verifyDesigns.designDoesNotExistCalled', 'Updated Name', (function(error, result){expect(!error);}));
        server.call('verifyDesigns.designExistsCalled', 'New Design', (function(error, result){expect(!error);}));
        // And there is only one design
        server.call('verifyDesigns.designCountIs', 1, (function(error, result){expect(!error);}));
    });

    it('A Design cannot be given the same name as another existing Design', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        server.call('testLoginAs', RoleType.DESIGNER);
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, 'New Design', 'Unique Name');
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, 'New Design', 'Unique Name');

        // Verify ------------------------------------------------------------------------------------------------------
        // A Design still exists called new name
        server.call('verifyDesigns.designExistsCalled', 'New Design', (function(error, result){expect(!error);}));
        // As well as the one we called Unique name
        server.call('verifyDesigns.designExistsCalled', 'Unique Name', (function(error, result){expect(!error);}));
        // And there are only 2 designs
        server.call('verifyDesigns.designCountIs', 2, (function(error, result){expect(!error);}));
    });

    it('A Designer can edit a Design name to a new value', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        server.call('testLoginAs', RoleType.DESIGNER);
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, 'New Design', 'My Name');

        // Verify ------------------------------------------------------------------------------------------------------
        // Design name has changed
        server.call('verifyDesigns.designExistsCalled', 'My Name', (function(error, result){expect(!error);}));
        server.call('verifyDesigns.designDoesNotExistCalled', 'New Design', (function(error, result){expect(!error);}));
        // And there is only one design
        server.call('verifyDesigns.designCountIs', 1, (function(error, result){expect(!error);}));

    });

});
