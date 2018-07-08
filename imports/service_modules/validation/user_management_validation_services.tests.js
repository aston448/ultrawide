
import { UserManagementValidationServices } from '../../service_modules/validation/user_management_validation_services.js';

import { }     from '../../constants/constants.js';
import { Validation, UserManagementValidationErrors }   from '../../constants/validation_errors.js';


import { chai } from 'meteor/practicalmeteor:chai';


describe('VAL: User Management', () => {

    describe('UC 805', () => {

        describe('The new password and password confirmation must match', () => {

            it('valid if matching', function () {

                const expectation = Validation.VALID;
                const result = UserManagementValidationServices.validateChangeUserPassword('newPassword', 'newPassword');

                chai.assert.equal(result, expectation, 'Expected password match to be valid');
            });

            it('invalid if not matching', function () {

                const expectation = UserManagementValidationErrors.USER_MANAGEMENT_INVALID_NEW_PASSWORDS;
                const result = UserManagementValidationServices.validateChangeUserPassword('newPassword', 'wrongPassword');

                chai.assert.equal(result, expectation, 'Expected password match to be invalid');
            });
        });
    });

    describe('UC 806', () => {

        describe('The new admin password and admin password confirmation must match', () => {

            it('valid if matching', function () {

                const user = {
                    _id:        'USER1',
                    userName:   'admin',
                    isAdmin:    true
                };

                const expectation = Validation.VALID;
                const result = UserManagementValidationServices.validateChangeAdminPassword(user, 'newPassword', 'newPassword');

                chai.assert.equal(result, expectation, 'Expected password match to be valid');
            });

            it('invalid if not matching', function () {

                const user = {
                    _id:        'USER1',
                    userName:   'admin',
                    isAdmin:    true
                };

                const expectation = UserManagementValidationErrors.USER_MANAGEMENT_INVALID_NEW_PASSWORDS;
                const result = UserManagementValidationServices.validateChangeAdminPassword(user, 'newPassword', 'wrongPassword');

                chai.assert.equal(result, expectation, 'Expected password match to be invalid');
            });
        });

        describe('Only the admin user can change the admin password', () => {

            it('valid if admin', function () {

                const user = {
                    _id:        'USER1',
                    userName:   'admin',
                    isAdmin:    true
                };

                const expectation = Validation.VALID;
                const result = UserManagementValidationServices.validateChangeAdminPassword(user, 'newPassword', 'newPassword');

                chai.assert.equal(result, expectation, 'Expected password match to be valid');
            });

            it('invalid if not admin', function () {

                const user = {
                    _id:        'USER1',
                    userName:   'admin',
                    isAdmin:    false
                };

                const expectation = UserManagementValidationErrors.USER_MANAGEMENT_INVALID_USER_CHANGE_ADMIN_PASSWD;
                const result = UserManagementValidationServices.validateChangeAdminPassword(user, 'newPassword', 'newPassword');

                chai.assert.equal(result, expectation, 'Expected user to be invalid');
            });
        });
    });
});
