import { Meteor } from 'meteor/meteor';

import { ClientScenarioTestExpectationServices } from '../../imports/apiClient/apiClientScenarioTestExpectation.js';

import { TestDataHelpers }                  from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'testExpectations.selectScenarioTestTypeExpectation'(userName, scenarioName, testType, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userRole = TestDataHelpers.getUserRole(userName);
        const userContext = TestDataHelpers.getUserContext(userName);
        const scenario = TestDataHelpers.getDesignComponent(userContext.designVersionId, 'NONE', scenarioName);

        const outcome = ClientScenarioTestExpectationServices.selectTestTypeExpectation(userRole, userContext, scenario.componentReferenceId, testType);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Select Scenario Test Type Expectation');
    },

    'testExpectations.unselectScenarioTestTypeExpectation'(userName, scenarioName, testType, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userRole = TestDataHelpers.getUserRole(userName);
        const userContext = TestDataHelpers.getUserContext(userName);
        const scenario = TestDataHelpers.getDesignComponent(userContext.designVersionId, 'NONE', scenarioName);

        const outcome = ClientScenarioTestExpectationServices.unselectTestTypeExpectation(userRole, userContext, scenario.componentReferenceId, testType);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Unselect Scenario Test Type Expectation');
    },

    'testExpectations.addSpecificValueTestTypeExpectation'(userName, scenarioName, testType, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userRole = TestDataHelpers.getUserRole(userName);
        const userContext = TestDataHelpers.getUserContext(userName);
        const scenario = TestDataHelpers.getDesignComponent(userContext.designVersionId, 'NONE', scenarioName);

        const outcome = ClientScenarioTestExpectationServices.addNewSpecificValueTestExpectation(userRole, userContext, scenario.componentReferenceId, testType);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Add Value Test Type Expectation');
    },

    'testExpectations.updateSpecificValueTestTypeExpectation'(userName, scenarioName, testType, oldValue, newValue, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userRole = TestDataHelpers.getUserRole(userName);
        const userContext = TestDataHelpers.getUserContext(userName);
        const scenario = TestDataHelpers.getDesignComponent(userContext.designVersionId, 'NONE', scenarioName);
        const testExpectation = TestDataHelpers.getTestExpectation(userContext.designVersionId, scenario.componentReferenceId, testType, 'VALUE', 'VALUE', oldValue);

        const outcome = ClientScenarioTestExpectationServices.updateSpecificValueTestExpectation(userRole, testExpectation._id, newValue);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Update Value Test Type Expectation');
    },

    'testExpectations.removeSpecificValueTestTypeExpectation'(userName, scenarioName, testType, value, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userRole = TestDataHelpers.getUserRole(userName);
        const userContext = TestDataHelpers.getUserContext(userName);
        const scenario = TestDataHelpers.getDesignComponent(userContext.designVersionId, 'NONE', scenarioName);
        const testExpectation = TestDataHelpers.getTestExpectation(userContext.designVersionId, scenario.componentReferenceId, testType, 'VALUE', 'VALUE', value);

        const outcome = ClientScenarioTestExpectationServices.removeSpecificValueTestExpectation(userRole, testExpectation._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Remove Value Test Type Expectation');
    },

    'testExpectations.unselectTestTypePermutationExpectation'(userName, scenarioName, testType, permutationName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userRole = TestDataHelpers.getUserRole(userName);
        const userContext = TestDataHelpers.getUserContext(userName);
        const scenario = TestDataHelpers.getDesignComponent(userContext.designVersionId, 'NONE', scenarioName);
        const permutation = TestDataHelpers.getDesignPermutation(userContext.designId, permutationName);

        const outcome = ClientScenarioTestExpectationServices.unselectTestTypePermutationExpectation(userRole, userContext, scenario.componentReferenceId, testType, permutation._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Unselect Test Type Permutation Expectation');
    },

    'testExpectations.selectTestTypePermutationValueExpectation'(userName, scenarioName, testType, permutationName, permutationValueName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userRole = TestDataHelpers.getUserRole(userName);
        const userContext = TestDataHelpers.getUserContext(userName);
        const scenario = TestDataHelpers.getDesignComponent(userContext.designVersionId, 'NONE', scenarioName);
        const permutation = TestDataHelpers.getDesignPermutation(userContext.designId, permutationName);
        const permutationValue = TestDataHelpers.getDesignPermutationValue(userContext.designVersionId, permutation._id, permutationValueName);

        const outcome = ClientScenarioTestExpectationServices.selectTestTypePermutationValueExpectation(userRole, userContext, scenario.componentReferenceId, testType, permutation._id, permutationValue._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Select Test Type Permutation Value Expectation');
    },

    'testExpectations.unselectTestTypePermutationValueExpectation'(userName, scenarioName, testType, permutationName, permutationValueName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userRole = TestDataHelpers.getUserRole(userName);
        const userContext = TestDataHelpers.getUserContext(userName);
        const scenario = TestDataHelpers.getDesignComponent(userContext.designVersionId, 'NONE', scenarioName);
        const permutation = TestDataHelpers.getDesignPermutation(userContext.designId, permutationName);
        const permutationValue = TestDataHelpers.getDesignPermutationValue(userContext.designVersionId, permutation._id, permutationValueName);

        const outcome = ClientScenarioTestExpectationServices.unselectTestTypePermutationValueExpectation(userRole, userContext, scenario.componentReferenceId, testType, permutation._id, permutationValue._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Unselect Test Type Permutation Value Expectation');
    },

});