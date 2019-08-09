
import { DesignPermutationValidationServices } from '../design_permutation_validation_services';

import { RoleType }     from '../../../constants/constants.js';
import { Validation, DesignPermutationValidationErrors }   from '../../../constants/validation_errors.js';

import { chai } from 'meteor/practicalmeteor:chai';


describe('VAL: Design Permutations', function () {

    describe('UC 840', function () {

        describe('Conditions', function () {

            describe('Only a Designer may add new Design Permutations', function () {

                it('User Role - Designer', function () {

                    const result = DesignPermutationValidationServices.validateAddPermutation(RoleType.DESIGNER);

                    chai.assert.equal(result, Validation.VALID, 'Expected validation success')
                });

                it('User Role - Developer', function () {

                    const result = DesignPermutationValidationServices.validateAddPermutation(RoleType.DEVELOPER);

                    chai.assert.equal(result, DesignPermutationValidationErrors.PERMUTATION_ADD_INVALID_ROLE, 'Expected validation failure')
                });


                it('User Role - Manager', function () {

                    const result = DesignPermutationValidationServices.validateAddPermutation(RoleType.MANAGER);

                    chai.assert.equal(result, DesignPermutationValidationErrors.PERMUTATION_ADD_INVALID_ROLE, 'Expected validation failure')
                });


                it('User Role - Guest', function () {

                    const result = DesignPermutationValidationServices.validateAddPermutation(RoleType.GUEST_VIEWER);

                    chai.assert.equal(result, DesignPermutationValidationErrors.PERMUTATION_ADD_INVALID_ROLE, 'Expected validation failure')
                });

            });
        });
    });

    describe('UC 841', function(){

        describe('Conditions', function(){

            describe('Only a Designer can edit a Design Permutation name', function(){

                const thisPermutation = {
                    _id:                'PERMUTATION1',
                    designId:           'DESIGN1',
                    permutationName:    'Permutation1'
                };

                const otherPermutations = [];

                it('User Role - Designer', function () {

                    const result = DesignPermutationValidationServices.validateSavePermutation(RoleType.DESIGNER, thisPermutation, otherPermutations);

                    chai.assert.equal(result, Validation.VALID, 'Expected validation success')
                });

                it('User Role - Developer', function(){

                    const result = DesignPermutationValidationServices.validateSavePermutation(RoleType.DEVELOPER, thisPermutation, otherPermutations);

                    chai.assert.equal(result, DesignPermutationValidationErrors.PERMUTATION_SAVE_INVALID_ROLE, 'Expected validation failure')
                });


                it('User Role - Manager', function(){

                    const result = DesignPermutationValidationServices.validateSavePermutation(RoleType.MANAGER, thisPermutation, otherPermutations);

                    chai.assert.equal(result, DesignPermutationValidationErrors.PERMUTATION_SAVE_INVALID_ROLE, 'Expected validation failure')
                });


                it('User Role - Guest', function(){

                    const result = DesignPermutationValidationServices.validateSavePermutation(RoleType.GUEST_VIEWER, thisPermutation, otherPermutations);

                    chai.assert.equal(result, DesignPermutationValidationErrors.PERMUTATION_SAVE_INVALID_ROLE, 'Expected validation failure')
                });

            });

            it('A Design Permutation name cannot be the same as an existing Design Permutation name in the Design', function(){

                const thisPermutation = {
                    _id:                'PERMUTATION1',
                    designId:           'DESIGN1',
                    permutationName:    'FavyName'
                };

                const otherPermutations = [];

                const perm1 = {
                    _id:                'PERMUTATION2',
                    designId:           'DESIGN1',
                    permutationName:    'UniqueName'
                };

                const perm2 = {
                    _id:                'PERMUTATION3',
                    designId:           'DESIGN1',
                    permutationName:    'FavyName'
                };

                otherPermutations.push(perm1);
                otherPermutations.push(perm2);

                const result = DesignPermutationValidationServices.validateSavePermutation(RoleType.DESIGNER, thisPermutation, otherPermutations);

                chai.assert.equal(result, DesignPermutationValidationErrors.PERMUTATION_SAVE_DUPLICATE_NAME, 'Expected validation failure')
            });
        });
    });

    describe('UC 842', function(){

        describe('Conditions', function(){

            describe('Only a Designer can remove a Design Permutation', function(){

                const expectationsCount = 0;

                it('User Role - Designer', function () {

                    const result = DesignPermutationValidationServices.validateRemovePermutation(RoleType.DESIGNER, expectationsCount);

                    chai.assert.equal(result, Validation.VALID, 'Expected validation success')
                });

                it('User Role - Developer', function(){

                    const result = DesignPermutationValidationServices.validateRemovePermutation(RoleType.DEVELOPER, expectationsCount);

                    chai.assert.equal(result, DesignPermutationValidationErrors.PERMUTATION_REMOVE_INVALID_ROLE, 'Expected validation failure')
                });


                it('User Role - Manager', function(){

                    const result = DesignPermutationValidationServices.validateRemovePermutation(RoleType.MANAGER, expectationsCount);

                    chai.assert.equal(result, DesignPermutationValidationErrors.PERMUTATION_REMOVE_INVALID_ROLE, 'Expected validation failure')
                });


                it('User Role - Guest', function(){

                    const result = DesignPermutationValidationServices.validateRemovePermutation(RoleType.GUEST_VIEWER, expectationsCount);

                    chai.assert.equal(result, DesignPermutationValidationErrors.PERMUTATION_REMOVE_INVALID_ROLE, 'Expected validation failure')
                });

            });

            it('A Design Permutation cannot be removed if any of its values are in use for Scenario test requirements', function(){

                const expectationsCount = 1;

                const result = DesignPermutationValidationServices.validateRemovePermutation(RoleType.DESIGNER, expectationsCount);

                chai.assert.equal(result, DesignPermutationValidationErrors.PERMUTATION_REMOVE_IN_USE, 'Expected validation failure')
            });

        });
    });
});