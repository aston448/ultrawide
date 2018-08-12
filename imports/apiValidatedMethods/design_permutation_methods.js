import { Validation } from '../constants/validation_errors.js'

import { DesignPermutationValidationApi }      from '../apiValidation/apiDesignPermutationValidation.js';
import { DesignPermutationServices }           from '../servicers/design/design_permutation_services.js';

//======================================================================================================================
//
// Meteor Validated Methods for Design Permutations
//
//======================================================================================================================

export const addPermutation = new ValidatedMethod({

    name: 'designPermutations.addDesignPermutation',

    validate: new SimpleSchema({
        userRole:   {type: String},
        designId:   {type: String}
    }).validator(),

    run({userRole, designId}){

        const result = DesignPermutationValidationApi.validateAddPermutation(userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designPermutations.addDesignPermutation.failValidation', result)
        }

        try {
            DesignPermutationServices.addPermutation(designId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});

export const savePermutation = new ValidatedMethod({

    name: 'designPermutations.savePermutation',

    validate: new SimpleSchema({
        userRole:   {type: String},
        permutation:{type: Object, blackbox: true}
    }).validator(),

    run({userRole, permutation}){

        const result = DesignPermutationValidationApi.validateSavePermutation(userRole, permutation);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designPermutations.savePermutation.failValidation', result)
        }

        try {
            DesignPermutationServices.savePermutation(permutation);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});

export const addPermutationValue = new ValidatedMethod({

    name: 'designPermutations.addPermutationValue',

    validate: new SimpleSchema({
        userRole:           {type: String},
        permutationId:      {type: String},
        designVersionId:    {type: String}
    }).validator(),

    run({userRole, permutationId, designVersionId}){

        const result = DesignPermutationValidationApi.validateAddPermutationValue(userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designPermutations.addPermutationValue.failValidation', result)
        }

        try {
            DesignPermutationServices.addPermutationValue(permutationId, designVersionId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});

export const savePermutationValue = new ValidatedMethod({

    name: 'designPermutations.savePermutationValue',

    validate: new SimpleSchema({
        userRole:           {type: String},
        permutationValue:   {type: Object, blackbox: true}
    }).validator(),

    run({userRole, permutationValue}){

        const result = DesignPermutationValidationApi.validateSavePermutationValue(userRole, permutationValue);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designPermutations.savePermutationValue.failValidation', result)
        }

        try {
            DesignPermutationServices.savePermutationValue(permutationValue);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});