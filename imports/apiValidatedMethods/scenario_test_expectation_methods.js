import { Validation } from '../constants/validation_errors.js'

import { ScenarioTestExpectationValidationApi }      from '../apiValidation/apiScenarioTestExpectationValidation.js';
import { ScenarioTestExpectationServices }           from '../servicers/design/scenario_test_expectation_services.js';

//======================================================================================================================
//
// Meteor Validated Methods for Design Permutations
//
//======================================================================================================================

export const selectTestType = new ValidatedMethod({

    name: 'scenarioTestExpectations.selectTestType',

    validate: new SimpleSchema({
        designVersionId:        {type: String},
        scenarioReferenceId:    {type: String},
        testType:               {type: String}
    }).validator(),

    run({designVersionId, scenarioReferenceId, testType}){

        const result = ScenarioTestExpectationValidationApi.validateAddTestTypeExpectation();

        if (result !== Validation.VALID) {
            throw new Meteor.Error('scenarioTestExpectations.selectTestType.failValidation', result)
        }

        try {
            ScenarioTestExpectationServices.selectTestType(designVersionId, scenarioReferenceId, testType);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const unselectTestType = new ValidatedMethod({

    name: 'scenarioTestExpectations.unselectTestType',

    validate: new SimpleSchema({
        designVersionId:        {type: String},
        scenarioReferenceId:    {type: String},
        testType:               {type: String}
    }).validator(),

    run({designVersionId, scenarioReferenceId, testType}){

        const result = ScenarioTestExpectationValidationApi.validateRemoveTestTypeExpectation();

        if (result !== Validation.VALID) {
            throw new Meteor.Error('scenarioTestExpectations.unselectTestType.failValidation', result)
        }

        try {
            ScenarioTestExpectationServices.unselectTestType(designVersionId, scenarioReferenceId, testType);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const unselectTestTypePermutation = new ValidatedMethod({

    name: 'scenarioTestExpectations.unselectTestTypePermutation',

    validate: new SimpleSchema({
        designVersionId:        {type: String},
        scenarioReferenceId:    {type: String},
        testType:               {type: String},
        permutationId:          {type: String}
    }).validator(),

    run({designVersionId, scenarioReferenceId, testType, permutationId}){

        const result = ScenarioTestExpectationValidationApi.validateRemoveTestTypePermutationExpectation();

        if (result !== Validation.VALID) {
            throw new Meteor.Error('scenarioTestExpectations.unselectTestTypePermutation.failValidation', result)
        }

        try {
            ScenarioTestExpectationServices.unselectTestTypePermutation(designVersionId, scenarioReferenceId, testType, permutationId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const selectTestTypePermutationValue = new ValidatedMethod({

    name: 'scenarioTestExpectations.selectTestTypePermutationValue',

    validate: new SimpleSchema({
        designVersionId:        {type: String},
        scenarioReferenceId:    {type: String},
        testType:               {type: String},
        permutationId:          {type: String},
        permutationValueId:     {type: String}
    }).validator(),

    run({designVersionId, scenarioReferenceId, testType, permutationId, permutationValueId}){

        const result = ScenarioTestExpectationValidationApi.validateAddTestTypePermutationValueExpectation();

        if (result !== Validation.VALID) {
            throw new Meteor.Error('scenarioTestExpectations.selectTestTypePermutationValue.failValidation', result)
        }

        try {
            ScenarioTestExpectationServices.selectTestTypePermutationValue(designVersionId, scenarioReferenceId, testType, permutationId, permutationValueId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const unselectTestTypePermutationValue = new ValidatedMethod({

    name: 'scenarioTestExpectations.unselectTestTypePermutationValue',

    validate: new SimpleSchema({
        designVersionId:        {type: String},
        scenarioReferenceId:    {type: String},
        testType:               {type: String},
        permutationId:          {type: String},
        permutationValueId:     {type: String}
    }).validator(),

    run({designVersionId, scenarioReferenceId, testType, permutationId, permutationValueId}){

        const result = ScenarioTestExpectationValidationApi.validateRemoveTestTypePermutationValueExpectation();

        if (result !== Validation.VALID) {
            throw new Meteor.Error('scenarioTestExpectations.unselectTestTypePermutationValue.failValidation', result)
        }

        try {
            ScenarioTestExpectationServices.unselectTestTypePermutationValue(designVersionId, scenarioReferenceId, testType, permutationId, permutationValueId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});