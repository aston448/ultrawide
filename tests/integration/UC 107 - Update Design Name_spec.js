import {RoleType} from '../../imports/constants/constants.js';
import {DefaultItemNames} from '../../imports/constants/default_names.js';

beforeEach(function(){
    server.call('testFixtures.clearAllData');
});

afterEach(function(){

});

describe('UC 107 - Update Design Name', function() {

    it('Only a Designer can update a Design name', function() {
        // Setup -------------------------------------------------------------------------------------------------------
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);

        // Execute -----------------------------------------------------------------------------------------------------
        // Give Developer a go...
        server.call('testDesigns.updateDesignName', RoleType.DEVELOPER, DefaultItemNames.NEW_DESIGN_NAME, 'Updated Name');

        // Verify ------------------------------------------------------------------------------------------------------
        // No update to name
        server.call('verifyDesigns.designDoesNotExistCalled', 'Updated Name', (function(error, result){expect(!error);}));
        server.call('verifyDesigns.designExistsCalled', DefaultItemNames.NEW_DESIGN_NAME, (function(error, result){expect(!error);}));
        // And there is only one design
        server.call('verifyDesigns.designCountIs', 1, (function(error, result){expect(!error);}));

        // Execute -----------------------------------------------------------------------------------------------------
        // Give Manager a go...
        server.call('testDesigns.updateDesignName', RoleType.MANAGER, DefaultItemNames.NEW_DESIGN_NAME, 'Updated Name');

        // Verify ------------------------------------------------------------------------------------------------------
        // No update to name
        server.call('verifyDesigns.designDoesNotExistCalled', 'Updated Name', (function(error, result){expect(!error);}));
        server.call('verifyDesigns.designExistsCalled', DefaultItemNames.NEW_DESIGN_NAME, (function(error, result){expect(!error);}));
        // And there is only one design
        server.call('verifyDesigns.designCountIs', 1, (function(error, result){expect(!error);}));
    });

    it('A Designer can edit a Design name to a new value', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'My Name');

        // Verify ------------------------------------------------------------------------------------------------------
        // Design name has changed
        server.call('verifyDesigns.designExistsCalled', 'My Name', (function(error, result){expect(!error);}));
        server.call('verifyDesigns.designDoesNotExistCalled', DefaultItemNames.NEW_DESIGN_NAME, (function(error, result){expect(!error);}));
        // And there is only one design
        server.call('verifyDesigns.designCountIs', 1, (function(error, result){expect(!error);}));

    });

    it('A Design cannot be given the same name as another existing Design', function() {

        // Setup -------------------------------------------------------------------------------------------------------
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Unique Name');
        server.call('testDesigns.addNewDesign', RoleType.DESIGNER);

        // Execute -----------------------------------------------------------------------------------------------------
        server.call('testDesigns.updateDesignName', RoleType.DESIGNER, DefaultItemNames.NEW_DESIGN_NAME, 'Unique Name');

        // Verify ------------------------------------------------------------------------------------------------------
        // A Design still exists called new name
        server.call('verifyDesigns.designExistsCalled', DefaultItemNames.NEW_DESIGN_NAME, (function(error, result){expect(!error);}));
        // As well as the one we called Unique name
        server.call('verifyDesigns.designExistsCalled', 'Unique Name', (function(error, result){expect(!error);}));
        // And there are only 2 designs
        server.call('verifyDesigns.designCountIs', 2, (function(error, result){expect(!error);}));
    });

});
