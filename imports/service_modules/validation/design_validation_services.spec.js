import {Designs} from '../../collections/design/designs.js';

import DesignServices from '../../servicers/design_services.js';
import DesignValidationServices from '../../service_modules/validation/design_validation_services.js';

import { RoleType } from '../../constants/constants.js';

//import { Factory } from 'meteor/factory';
import StubCollections from 'meteor/hwillson:stub-collections';
import { chai } from 'meteor/practicalmeteor:chai';

// describe('A Designer can remove an empty Design', function () {
//     it('rejects an attempt by a Developer', function () {
//
//         // Manager is not valid
//         chai.assert.notEqual(DesignValidation.validateRemoveDesign(RoleType.DEVELOPER, designId), 'VALID', 'Attempt to remove a design by a Developer returned VALID!')
//     });
//

beforeEach(function(){

    StubCollections.add([Designs]);
    StubCollections.stub();

    Designs.insert({
        designName: 'New Design',
        isRemovable: true
    });

    Designs.insert({
        designName: 'Active Design',
        isRemovable: false
    });

});

afterEach(function(){

    StubCollections.restore();

});

describe('A Designer can remove a Design that is removable', function () {

    describe('DesignValidationServices unit tests', function () {

        it('returns VALID for a Designer if the Design is removable', function () {

            const design = Designs.findOne({designName: 'New Design'});
            const role = RoleType.DESIGNER;
            chai.assert.equal(DesignValidationServices.validateRemoveDesign(role, design), 'VALID', 'Attempt to remove a removable design by a Designer returned INVALID!');

        });

        it('returns INVALID for a Designer if the Design is NOT removable', function () {

            const design = Designs.findOne({designName: 'Active Design'});
            const role = RoleType.DESIGNER;
            chai.assert.notEqual(DesignValidationServices.validateRemoveDesign(role, design), 'VALID', 'Attempt to remove a non-removable design by a Designer returned VALID!');

        });

    });


});

describe('A Design can only be removed by a Designer', function () {

    describe('DesignValidationServices unit tests', function () {

        it('returns INVALID for a Manager if the Design is removable', function () {

            const design = Designs.findOne({designName: 'New Design'});
            const role = RoleType.MANAGER;
            chai.assert.notEqual(DesignValidationServices.validateRemoveDesign(role, design), 'VALID', 'Attempt to remove a removable design by a Manager returned VALID!')

        });

        it('returns INVALID for a Developer if the Design is removable', function () {

            const design = Designs.findOne({designName: 'New Design'});
            const role = RoleType.DEVELOPER;
            chai.assert.notEqual(DesignValidationServices.validateRemoveDesign(role, design), 'VALID', 'Attempt to remove a removable design by a Developer returned VALID!')

        });
    });
});


