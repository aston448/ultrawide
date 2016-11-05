//import {Designs} from '../../imports/collections/design/designs.js'
//import ClientDesignServices from '../../imports/apiClient/apiClientDesign.js';



describe('UC 101 - Add New Design', function() {
    it('A new Design can be added to Ultrawide by a Designer', function() {

        // Setup ===================================================================================================
        const expectedDesignName = 'New Design';



        // Execute =================================================================================================
        server.call('test.addNewDesign');


        // Verify ==================================================================================================

        // Created 1 Design
        let result = server.execute(() => {
            const {Designs} = require('/imports/collections/design/designs.js');
            return Designs.findOne({designName: 'New Design'});
        });

        expect(result);

        // With correct data
        expect(result.isRemovable).to.equal(true);

    })
});
