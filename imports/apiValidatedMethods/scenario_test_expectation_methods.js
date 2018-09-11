import { Validation } from '../constants/validation_errors.js'

import { ScenarioTestExpectationValidationApi }      from '../apiValidation/apiScenarioTestExpectationValidation.js';
import { ScenarioTestExpectationServices }           from '../servicers/design/scenario_test_expectation_services.js';
import {TestIntegrationServices} from "../servicers/dev/test_integration_services";

//======================================================================================================================
//
// Meteor Validated Methods for Test Expectations
//
//======================================================================================================================

export const selectTestType = new ValidatedMethod({

    name: 'scenarioTestExpectations.selectTestType',

    validate: new SimpleSchema({
        userContext:            {type: Object, blackbox: true},
        scenarioReferenceId:    {type: String},
        testType:               {type: String}
    }).validator(),

    run({userContext, scenarioReferenceId, testType}){

        const result = ScenarioTestExpectationValidationApi.validateAddTestTypeExpectation();

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
        userContext:            {type: Object, blackbox: true},
        scenarioReferenceId:    {type: String},
        testType:               {type: String}
    }).validator(),

    run({userContext, scenarioReferenceId, testType}){

        const result = ScenarioTestExpectationValidationApi.validateRemoveTestTypeExpectation();

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
        userContext:            {type: Object, blackbox: true},
        scenarioReferenceId:    {type: String},
        testType:               {type: String},
        permutationId:          {type: String}
    }).validator(),

    run({userContext, scenarioReferenceId, testType, permutationId}){

        const result = ScenarioTestExpectationValidationApi.validateRemoveTestTypePermutationExpectation();

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
        userContext:            {type: Object, blackbox: true},
        scenarioReferenceId:    {type: String},
        testType:               {type: String},
        permutationId:          {type: String},
        permutationValueId:     {type: String}
    }).validator(),

    run({userContext, scenarioReferenceId, testType, permutationId, permutationValueId}){

        const result = ScenarioTestExpectationValidationApi.validateAddTestTypePermutationValueExpectation();

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
        userContext:            {type: Object, blackbox: true},
        scenarioReferenceId:    {type: String},
        testType:               {type: String},
        permutationId:          {type: String},
        permutationValueId:     {type: String}
    }).validator(),

    run({userContext, scenarioReferenceId, testType, permutationId, permutationValueId}){

        const result = ScenarioTestExpectationValidationApi.validateRemoveTestTypePermutationValueExpectation();

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

