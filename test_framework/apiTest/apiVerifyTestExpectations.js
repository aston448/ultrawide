import { Meteor } from 'meteor/meteor';

import { TestDataHelpers }              from '../test_modules/test_data_helpers.js'
import {DefaultItemNames}               from "../../imports/constants/default_names";

Meteor.methods({


    'verifyTestExpectations.testTypeScenarioExpectationExistsFor'(scenarioName, testType, userName) {

        const userContext = TestDataHelpers.getUserContext(userName);

        const scenario = TestDataHelpers.getDesignComponent(userContext.designVersionId, userContext.designUpdateId, scenarioName);

        if (!scenario) {
            throw new Meteor.Error("FAIL", "No Scenario exists called " + scenarioName);
        }

        // This will error if not found
        const testExpectation = TestDataHelpers.getTestExpectation(userContext.designVersionId, scenario.componentReferenceId, testType, 'NONE', 'NONE', DefaultItemNames.NEW_VALUE_EXPECTATION);
    },

    'verifyTestExpectations.testTypeScenarioExpectationDoesNotExistFor'(scenarioName, testType, userName) {

        const userContext = TestDataHelpers.getUserContext(userName);

        const scenario = TestDataHelpers.getDesignComponent(userContext.designVersionId, userContext.designUpdateId, scenarioName);

        if (!scenario) {
            throw new Meteor.Error("FAIL", "No Scenario exists called " + scenarioName);
        }

        // This will error if found
        const testExpectation = TestDataHelpers.getTestExpectation(userContext.designVersionId, scenario.componentReferenceId, testType, 'NONE', 'NONE', DefaultItemNames.NEW_VALUE_EXPECTATION, true);
    },

    'verifyTestExpectations.testTypePermValueExpectationExistsFor'(scenarioName, testType, permutationName, permutationValueName, userName) {

        const userContext = TestDataHelpers.getUserContext(userName);

        const scenario = TestDataHelpers.getDesignComponent(userContext.designVersionId, userContext.designUpdateId, scenarioName);

        if (!scenario) {
            throw new Meteor.Error("FAIL", "No Scenario exists called " + scenarioName);
        }

        const permutation = TestDataHelpers.getDesignPermutation(userContext.designId, permutationName);

        if (!permutation) {
            throw new Meteor.Error("FAIL", "No Permutation exists called " + permutationName);
        }

        const permValue = TestDataHelpers.getDesignPermutationValue(userContext.designVersionId, permutation._id, permutationValueName);

        if (!permValue) {
            throw new Meteor.Error("FAIL", "No Permutation Value exists for permutation " + permutation.permutationName + " called " + permutationValueName);
        }

        // This will error if not found
        const testExpectation = TestDataHelpers.getTestExpectation(userContext.designVersionId, scenario.componentReferenceId, testType, permutation._id, permValue._id, DefaultItemNames.NEW_VALUE_EXPECTATION);
    },

    'verifyTestExpectations.testTypePermValueExpectationDoesNotExistFor'(scenarioName, testType, permutationName, permutationValueName, userName) {

        const userContext = TestDataHelpers.getUserContext(userName);

        const scenario = TestDataHelpers.getDesignComponent(userContext.designVersionId, userContext.designUpdateId, scenarioName);

        if (!scenario) {
            throw new Meteor.Error("FAIL", "No Scenario exists called " + scenarioName);
        }

        const permutation = TestDataHelpers.getDesignPermutation(userContext.designId, permutationName);

        if (!permutation) {
            throw new Meteor.Error("FAIL", "No Permutation exists called " + permutationName);
        }

        const permValue = TestDataHelpers.getDesignPermutationValue(userContext.designVersionId, permutation._id, permutationValueName);

        if (!permValue) {
            throw new Meteor.Error("FAIL", "No Permutation Value exists for permutation " + permutation.permutationName + " called " + permutationValueName);
        }

        // This will error if found
        const testExpectation = TestDataHelpers.getTestExpectation(userContext.designVersionId, scenario.componentReferenceId, testType, permutation._id, permValue._id, DefaultItemNames.NEW_VALUE_EXPECTATION, true);
    },

    'verifyTestExpectations.testTypeSpecificValueExpectationExistsFor'(scenarioName, testType, specificValue, userName) {

        const userContext = TestDataHelpers.getUserContext(userName);

        const scenario = TestDataHelpers.getDesignComponent(userContext.designVersionId, userContext.designUpdateId, scenarioName);

        if (!scenario) {
            throw new Meteor.Error("FAIL", "No Scenario exists called " + scenarioName);
        }

        // This will error if not found
        const testExpectation = TestDataHelpers.getTestExpectation(userContext.designVersionId, scenario.componentReferenceId, testType, 'VALUE', 'VALUE', specificValue);
    },

    'verifyTestExpectations.testTypeSpecificValueExpectationDoesNotExistFor'(scenarioName, testType, specificValue, userName) {

        const userContext = TestDataHelpers.getUserContext(userName);

        const scenario = TestDataHelpers.getDesignComponent(userContext.designVersionId, userContext.designUpdateId, scenarioName);

        if (!scenario) {
            throw new Meteor.Error("FAIL", "No Scenario exists called " + scenarioName);
        }

        // This will error if found
        const testExpectation = TestDataHelpers.getTestExpectation(userContext.designVersionId, scenario.componentReferenceId, testType, 'VALUE', 'VALUE', specificValue, true);
    },
});