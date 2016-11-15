//import {Designs} from '../../imports/collections/design/designs.js'
//import ClientDesignServices from '../../imports/apiClient/apiClientDesign.js';



describe('UC 101 - Add New Design', function() {
    it('A Designer can add a new Design to Ultrawide', function() {

        // Setup ===================================================================================================
        const expectedDesignName = 'New Design';

        // Execute =================================================================================================
        server.call('test.addNewDesign', 'DESIGNER');


        // Verify ==================================================================================================

        // Created a new removable Design
        server.call('test.verifyNewDesign', (function(error, result){expect(!error);}));

    })
});


