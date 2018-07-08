
import { ImpExValidationServices } from '../../service_modules/validation/impex_validation_services';

import { DesignStatus, RoleType}     from '../../constants/constants.js';
import { Validation, ImpExValidationErrors }   from '../../constants/validation_errors.js';

import { chai } from 'meteor/practicalmeteor:chai';



describe('VAL: ImpEx', () => {

    describe('UC 822', () => {

        describe('An archived Design cannot be backed up', () => {

            it('invalid if archived', function () {

                const userRole = RoleType.DESIGNER;
                const design = {
                    _id:                'DESIGN1',
                    designStatus:       DesignStatus.DESIGN_ARCHIVED
                };

                const expectation = ImpExValidationErrors.BACKUP_DESIGN_INVALID_STATUS_ARCHIVED;
                const result = ImpExValidationServices.validateBackupDesign(userRole, design);

                chai.assert.equal(result, expectation, 'Expected invalid');
            });

            it('valid if live', function () {

                const userRole = RoleType.DESIGNER;
                const design = {
                    _id:                'DESIGN1',
                    designStatus:       DesignStatus.DESIGN_LIVE
                };

                const expectation = Validation.VALID;
                const result = ImpExValidationServices.validateBackupDesign(userRole, design);

                chai.assert.equal(result, expectation, 'Expected valid');
            });
        });
    });

    describe('UC 823', () => {

        describe('A removable Design may not be archived', () => {

            it('invalid if removable', function () {

                const user = {
                    _id:                'ADMIN',
                    userName:           'admin',
                    isAdmin:            true
                };

                const design = {
                    _id:                'DESIGN1',
                    designStatus:       DesignStatus.DESIGN_LIVE,
                    isRemovable:        true
                };

                const expectation = ImpExValidationErrors.ARCHIVE_DESIGN_INVALID_STATUS_REMOVABLE;
                const result = ImpExValidationServices.validateArchiveDesign(user, design);

                chai.assert.equal(result, expectation, 'Expected invalid');
            });

            it('valid if not removable', function () {

                const user = {
                    _id:                'ADMIN',
                    userName:           'admin',
                    isAdmin:            true
                };

                const design = {
                    _id:                'DESIGN1',
                    designStatus:       DesignStatus.DESIGN_LIVE,
                    isRemovable:        false
                };

                const expectation = Validation.VALID;
                const result = ImpExValidationServices.validateArchiveDesign(user, design);

                chai.assert.equal(result, expectation, 'Expected valid');
            });
        });

        describe('Only the admin user can archive a Design', () => {

            it('invalid if not admin', function () {

                const user = {
                    _id:                'ADMIN',
                    userName:           'admin',
                    isAdmin:            false
                };

                const design = {
                    _id:                'DESIGN1',
                    designStatus:       DesignStatus.DESIGN_LIVE,
                    isRemovable:        false
                };

                const expectation = ImpExValidationErrors.ARCHIVE_DESIGN_INVALID_ROLE;
                const result = ImpExValidationServices.validateArchiveDesign(user, design);

                chai.assert.equal(result, expectation, 'Expected invalid');
            });

            it('valid if admin', function () {

                const user = {
                    _id:                'ADMIN',
                    userName:           'admin',
                    isAdmin:            true
                };

                const design = {
                    _id:                'DESIGN1',
                    designStatus:       DesignStatus.DESIGN_LIVE,
                    isRemovable:        false
                };

                const expectation = Validation.VALID;
                const result = ImpExValidationServices.validateArchiveDesign(user, design);

                chai.assert.equal(result, expectation, 'Expected valid');
            });
        });
    });

});
