import {Designs} from '../../collections/design/designs.js';

import DesignValidationServices from '../../service_modules/validation/design_validation_services.js';

import { RoleType, DesignStatus }     from '../../constants/constants.js';
import { Validation }   from '../../constants/validation_errors.js';

//import StubCollections from 'meteor/hwillson:stub-collections';
import { chai } from 'meteor/practicalmeteor:chai';

//
// beforeEach(function(){
//
//     StubCollections.add([Designs]);
//     StubCollections.stub();
//
//     Designs.insert({
//         designName: 'New Design',
//         isRemovable: true
//     });
//
//     Designs.insert({
//         designName: 'Active Design',
//         isRemovable: false
//     });
//
// });
//
// afterEach(function(){
//
//     StubCollections.restore();
//
// });

describe('VAL: Design', function () {

    const activeDesign = {
        _id: 'DDD',
        designName:             'Design1',
        isRemovable:            false,
        designStatus:           DesignStatus.DESIGN_LIVE
    };

    const newDesign = {
        _id: 'DDD',
        designName:             'Design2',
        isRemovable:            true,
        designStatus:           DesignStatus.DESIGN_LIVE
    };



    describe('A new Design can only be added by a Designer', function () {

        it('returns VALID when a Designer adds a Design', function () {

            const role = RoleType.DESIGNER;
            chai.assert.equal(DesignValidationServices.validateAddDesign(role), Validation.VALID, 'Attempt to add a design by a Designer returned INVALID!');

        });

        it('returns INVALID when a Developer adds a Design', function () {

            const role = RoleType.DEVELOPER;
            chai.assert.notEqual(DesignValidationServices.validateAddDesign(role), Validation.VALID, 'Attempt to add a design by a Developer returned VALID!');

        });

        it('returns INVALID when a Manager adds a Design', function () {

            const role = RoleType.MANAGER;
            chai.assert.notEqual(DesignValidationServices.validateAddDesign(role), Validation.VALID, 'Attempt to add a design by a Manager returned VALID!');

        });
    });

    describe('Only a Designer can update a Design name', function () {

        it('returns VALID when a Designer updates a Design name', function () {

            const otherDesigns = [activeDesign];
            const role = RoleType.DESIGNER;
            chai.assert.equal(DesignValidationServices.validateUpdateDesignName(role, 'New Name', otherDesigns), Validation.VALID, 'Attempt to add a design by a Designer returned INVALID!');
        });

        it('returns INVALID when a Developer updates a Design name', function () {

            const otherDesigns = [activeDesign];
            const role = RoleType.DEVELOPER;
            chai.assert.notEqual(DesignValidationServices.validateUpdateDesignName(role, 'New Name', otherDesigns), Validation.VALID, 'Attempt to add a design by a Developer returned VALID!');
        });

        it('returns INVALID when a Manager updates a Design name', function () {

            const otherDesigns = [activeDesign];
            const role = RoleType.MANAGER;
            chai.assert.notEqual(DesignValidationServices.validateUpdateDesignName(role, 'New Name', otherDesigns), Validation.VALID, 'Attempt to add a design by a Manager returned VALID!');
        });
    });

    describe('A Design cannot be given the same name as another existing Design', function () {

        it('returns VALID when a Designer updates a Design name to a new name', function () {

            const otherDesigns = [activeDesign];
            const role = RoleType.DESIGNER;
            chai.assert.equal(DesignValidationServices.validateUpdateDesignName(role, 'New Name', otherDesigns), Validation.VALID, 'Attempt to update name to new name returned INVALID!');
        });

        it('returns INVALID when a Designer updates a Design name to an existing name', function () {

            const otherDesigns = [activeDesign];
            const role = RoleType.DESIGNER;
            chai.assert.notEqual(DesignValidationServices.validateUpdateDesignName(role, 'Active Design', otherDesigns), Validation.VALID, 'Attempt to update name to existing name returned VALID!');
        });
    });

    describe('A Designer can remove a Design that is removable', function () {

        it('returns VALID for a Designer if the Design is removable', function () {

            const design = newDesign;
            const role = RoleType.DESIGNER;
            chai.assert.equal(DesignValidationServices.validateRemoveDesign(role, design), Validation.VALID, 'Attempt to remove a removable design by a Designer returned INVALID!');

        });

        it('returns INVALID for a Designer if the Design is NOT removable', function () {

            const design = activeDesign;
            const role = RoleType.DESIGNER;
            chai.assert.notEqual(DesignValidationServices.validateRemoveDesign(role, design), Validation.VALID, 'Attempt to remove a non-removable design by a Designer returned VALID!');

        });
    });

    describe('A Design can only be removed by a Designer', function () {

        it('returns INVALID for a Manager if the Design is removable', function () {

            const design = newDesign;
            const role = RoleType.MANAGER;
            chai.assert.notEqual(DesignValidationServices.validateRemoveDesign(role, design), Validation.VALID, 'Attempt to remove a removable design by a Manager returned VALID!')

        });

        it('returns INVALID for a Developer if the Design is removable', function () {

            const design = newDesign;
            const role = RoleType.DEVELOPER;
            chai.assert.notEqual(DesignValidationServices.validateRemoveDesign(role, design), Validation.VALID, 'Attempt to remove a removable design by a Developer returned VALID!')

        });
    });

});


