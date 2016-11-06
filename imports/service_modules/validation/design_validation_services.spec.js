import Designs from '../../collections/design/designs.js';

import DesignServices from '../../servicers/design_services.js';
import DesignValidation from '../../apiValidation/apiDesignValidation.js';
import { RoleType } from '../../constants/constants.js';

import { chai } from 'meteor/practicalmeteor:chai';

// describe('A Designer can remove an empty Design', function () {
//     it('rejects an attempt by a Developer', function () {
//
//         // Manager is not valid
//         chai.assert.notEqual(DesignValidation.validateRemoveDesign(RoleType.DEVELOPER, designId), 'VALID', 'Attempt to remove a design by a Developer returned VALID!')
//     });
//

beforeEach(function(){
    // Create a new empty Design
    let designId = DesignServices.addDesign(false);
});

afterEach(function(){
    // Remove new designs
    Designs.remove({designName: 'New Design'});
});

describe('A Designer can remove an empty Design', function () {
    it('returns VALID for a Designer if the Design has no features', function () {

        // Get new empty Design
        let designId = DesignServices.findOne({designName: 'New Design'})._id;

        chai.assert.equal(DesignValidation.validateRemoveDesign(RoleType.DEVELOPER, designId), 'VALID', 'Attempt to remove an empty design by a Designer returned INVALID!')
    });
});

