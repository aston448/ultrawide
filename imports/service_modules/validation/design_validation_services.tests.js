
import DesignValidationServices from '../../service_modules/validation/design_validation_services.js';

import { RoleType, DesignStatus }     from '../../constants/constants.js';
import { Validation, DesignValidationErrors }   from '../../constants/validation_errors.js';


import { chai } from 'meteor/practicalmeteor:chai';

describe('VAL: Design', function () {

    const activeDesign = {
        _id: 'DDD',
        designName:             'Active Design',
        isRemovable:            false,
        designStatus:           DesignStatus.DESIGN_LIVE
    };

    const newDesign = {
        _id: 'DDD',
        designName:             'New Design',
        isRemovable:            true,
        designStatus:           DesignStatus.DESIGN_LIVE
    };


    describe('A new Design can only be added by a Designer', function () {

        it('returns VALID when a Designer adds a Design', function () {

            const role = RoleType.DESIGNER;
            const expectation = Validation.VALID;

            const result = DesignValidationServices.validateAddDesign(role);

            chai.assert.equal(result, expectation);

        });

        it('returns INVALID when a Developer adds a Design', function () {

            const role = RoleType.DEVELOPER;
            const expectation = DesignValidationErrors.DESIGN_INVALID_ROLE_ADD;

            const result = DesignValidationServices.validateAddDesign(role);

            chai.assert.equal(result, expectation);

        });

        it('returns INVALID when a Manager adds a Design', function () {

            const role = RoleType.MANAGER;
            const expectation = DesignValidationErrors.DESIGN_INVALID_ROLE_ADD;

            const result = DesignValidationServices.validateAddDesign(role);

            chai.assert.equal(result, expectation);

        });
    });

    describe('Only a Designer can update a Design name', function () {

        it('returns VALID when a Designer updates a Design name', function () {

            const otherDesigns = [activeDesign];
            const role = RoleType.DESIGNER;
            const expectation = Validation.VALID;

            const result = DesignValidationServices.validateUpdateDesignName(role, 'New Name', otherDesigns);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID when a Developer updates a Design name', function () {

            const otherDesigns = [activeDesign];
            const role = RoleType.DEVELOPER;
            const expectation = DesignValidationErrors.DESIGN_INVALID_ROLE_UPDATE;

            const result = DesignValidationServices.validateUpdateDesignName(role, 'New Name', otherDesigns);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID when a Manager updates a Design name', function () {

            const otherDesigns = [activeDesign];
            const role = RoleType.MANAGER;
            const expectation = DesignValidationErrors.DESIGN_INVALID_ROLE_UPDATE;

            const result = DesignValidationServices.validateUpdateDesignName(role, 'New Name', otherDesigns);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A Design cannot be given the same name as another existing Design', function () {

        it('returns VALID when a Designer updates a Design name to a new name', function () {

            const otherDesigns = [activeDesign];
            const role = RoleType.DESIGNER;
            const expectation = Validation.VALID;

            const result = DesignValidationServices.validateUpdateDesignName(role, 'New Name', otherDesigns);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID when a Designer updates a Design name to an existing name', function () {

            const otherDesigns = [activeDesign];
            const role = RoleType.DESIGNER;
            const expectation = DesignValidationErrors.DESIGN_INVALID_NAME_DUPLICATE;

            const result = DesignValidationServices.validateUpdateDesignName(role, 'Active Design', otherDesigns);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A Designer can remove a Design that is removable', function () {

        it('returns VALID for a Designer if the Design is removable', function () {

            const design = newDesign;
            const role = RoleType.DESIGNER;
            const expectation = Validation.VALID;

            const result = DesignValidationServices.validateRemoveDesign(role, design);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Designer if the Design is NOT removable', function () {

            const design = activeDesign;
            const role = RoleType.DESIGNER;
            const expectation = DesignValidationErrors.DESIGN_NOT_REMOVABLE;

            const result = DesignValidationServices.validateRemoveDesign(role, design);

            chai.assert.equal(result, expectation);
        });
    });

    describe('A Design can only be removed by a Designer', function () {

        it('returns INVALID for a Manager if the Design is removable', function () {

            const design = newDesign;
            const role = RoleType.MANAGER;
            const expectation = DesignValidationErrors.DESIGN_INVALID_ROLE_REMOVE;

            const result = DesignValidationServices.validateRemoveDesign(role, design);

            chai.assert.equal(result, expectation);
        });

        it('returns INVALID for a Developer if the Design is removable', function () {

            const design = newDesign;
            const role = RoleType.DEVELOPER;
            const expectation = DesignValidationErrors.DESIGN_INVALID_ROLE_REMOVE;

            const result = DesignValidationServices.validateRemoveDesign(role, design);

            chai.assert.equal(result, expectation);
        });
    });

});


