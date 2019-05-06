import { Validation } from '../constants/validation_errors.js'

import { ScenarioTestExpectationValidationApi }      from '../apiValidation/apiScenarioTestExpectationValidation.js';
import { ScenarioTestExpectationServices }           from '../servicers/design/scenario_test_expectation_services.js';

//======================================================================================================================
//
// Meteor Validated Methods for Test Expectations
//
//======================================================================================================================

export const addNewSpecificValueTestExpectation = new ValidatedMethod({

    name: 'scenarioTestExpectations.addNewSpecificValueTestExpectation',

    validate: new SimpleSchema({
        userRole:               {type: String},
        userContext:            {type: Object, blackbox: true},
        scenarioReferenceId:    {type: String},
        testType:               {type: String}
    }).validator(),

    run({userRole, userContext, scenarioReferenceId, testType}){

        const result = ScenarioTestExpectationValidationApi.validateAddTestTypeExpectation(userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('scenarioTestExpectations.addNewSpecificValueTestExpectation.failValidation', result)
        }

        try {
            ScenarioTestExpectationServices.addNewSpecificValueTestExpectation(userContext, scenarioReferenceId, testType);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const updateSpecificValueTestExpectation = new ValidatedMethod({

    name: 'scenarioTestExpectations.updateSpecificValueTestExpectation',

    validate: new SimpleSchema({
        userRole:               {type: String},
        expectationId:          {type: String},
        newValue:               {type: String}
    }).validator(),

    run({userRole, expectationId, newValue}){

        const result = ScenarioTestExpectationValidationApi.validateUpdateTestTypeExpectation(userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('scenarioTestExpectations.updateSpecificValueTestExpectation.failValidation', result)
        }

        try {
            ScenarioTestExpectationServices.updateSpecificValueTestExpectation(expectationId, newValue);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const removeSpecificValueTestExpectation = new ValidatedMethod({

    name: 'scenarioTestExpectations.removeSpecificValueTestExpectation',

    validate: new SimpleSchema({
        userRole:               {type: String},
        expectationId:          {type: String}
    }).validator(),

    run({userRole, expectationId, newValue}){

        const result = ScenarioTestExpectationValidationApi.validateRemoveTestTypeExpectation(userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('scenarioTestExpectations.removeSpecificValueTestExpectation.failValidation', result)
        }

        try {
            ScenarioTestExpectationServices.removeSpecificValueTestExpectation(expectationId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const selectTestType = new ValidatedMethod({

    name: 'scenarioTestExpectations.selectTestType',

    validate: new SimpleSchema({
        userRole:               {type: String},
        userContext:            {type: Object, blackbox: true},
        scenarioReferenceId:    {type: String},
        testType:               {type: String}
    }).validator(),

    run({userRole, userContext, scenarioReferenceId, testType}){

        const result = ScenarioTestExpectationValidationApi.validateAddTestTypeExpectation(userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('scenarioTestExpectations.selectTestType.failValidation', result)
        }

        try {
            ScenarioTestExpectationServices.selectTestType(userContext, scenarioReferenceId, testType);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const unselectTestType = new ValidatedMethod({

    name: 'scenarioTestExpectations.unselectTestType',

    validate: new SimpleSchema({
        userRole:               {type: String},
        userContext:            {type: Object, blackbox: true},
        scenarioReferenceId:    {type: String},
        testType:               {type: String}
    }).validator(),

    run({userRole, userContext, scenarioReferenceId, testType}){

        const result = ScenarioTestExpectationValidationApi.validateRemoveTestTypeExpectation(userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('scenarioTestExpectations.unselectTestType.failValidation', result)
        }

        try {
            ScenarioTestExpectationServices.unselectTestType(userContext, scenarioReferenceId, testType);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const unselectTestTypePermutation = new ValidatedMethod({

    name: 'scenarioTestExpectations.unselectTestTypePermutation',

    validate: new SimpleSchema({
        userRole:               {type: String},
        userContext:            {type: Object, blackbox: true},
        scenarioReferenceId:    {type: String},
        testType:               {type: String},
        permutationId:          {type: String}
    }).validator(),

    run({userRole, userContext, scenarioReferenceId, testType, permutationId}){

        const result = ScenarioTestExpectationValidationApi.validateRemoveTestTypePermutationExpectation(userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('scenarioTestExpectations.unselectTestTypePermutation.failValidation', result)
        }

        try {
            ScenarioTestExpectationServices.unselectTestTypePermutation(userContext, scenarioReferenceId, testType, permutationId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const selectTestTypePermutationValue = new ValidatedMethod({

    name: 'scenarioTestExpectations.selectTestTypePermutationValue',

    validate: new SimpleSchema({
        userRole:               {type: String},
        userContext:            {type: Object, blackbox: true},
        scenarioReferenceId:    {type: String},
        testType:               {type: String},
        permutationId:          {type: String},
        permutationValueId:     {type: String}
    }).validator(),

    run({userRole, userContext, scenarioReferenceId, testType, permutationId, permutationValueId}){

        const result = ScenarioTestExpectationValidationApi.validateAddTestTypePermutationValueExpectation(userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('scenarioTestExpectations.selectTestTypePermutationValue.failValidation', result)
        }

        try {
            ScenarioTestExpectationServices.selectTestTypePermutationValue(userContext, scenarioReferenceId, testType, permutationId, permutationValueId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const unselectTestTypePermutationValue = new ValidatedMethod({

    name: 'scenarioTestExpectations.unselectTestTypePermutationValue',

    validate: new SimpleSchema({
        userRole:               {type: String},
        userContext:            {type: Object, blackbox: true},
        scenarioReferenceId:    {type: String},
        testType:               {type: String},
        permutationId:          {type: String},
        permutationValueId:     {type: String}
    }).validator(),

    run({userRole, userContext, scenarioReferenceId, testType, permutationId, permutationValueId}){

        const result = ScenarioTestExpectationValidationApi.validateRemoveTestTypePermutationValueExpectation(userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('scenarioTestExpectations.unselectTestTypePermutationValue.failValidation', result)
        }

        try {
            ScenarioTestExpectationServices.unselectTestTypePermutationValue(userContext, scenarioReferenceId, testType, permutationId, permutationValueId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

