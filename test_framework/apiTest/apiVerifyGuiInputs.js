import { Meteor } from 'meteor/meteor';

import {  } from '../../imports/constants/constants.js';

import { TestDataHelpers }      from '../test_modules/test_data_helpers.js'
import {MashTestStatus, TestType} from "../../imports/constants/constants";
import {ClientDataServices} from "../../imports/apiClient/apiClientDataServices";

Meteor.methods({

    'verifyGuiInputs.featureTestSummaryInputsAre'(userName, featureName, expectedTests, passingTests, failingTests, missingTests){

        // Assumption that Feature is selected so in the User Context

        const userContext = TestDataHelpers.getUserContext(userName);

        const feature = TestDataHelpers.getDesignComponent(userContext.designVersionId, userContext.designUpdateId, featureName);

        const testSummary = ClientDataServices.getFeatureTestSummaryData(userContext, feature.componentReferenceId);

        if(testSummary) {

            if(testSummary.featureExpectedTestCount === expectedTests){

                if(testSummary.featurePassingTestCount === passingTests){

                    if(testSummary.featureFailingTestCount === failingTests){

                        if(testSummary.featureMissingTestCount === missingTests){

                            return true;

                        } else {
                            throw new Meteor.Error("FAIL", "Expected missing test count of " + missingTests + " but got " + testSummary.featureMissingTestCount + " for Feature " + featureName);
                        }
                    } else {
                        throw new Meteor.Error("FAIL", "Expected failing test count of " + failingTests + " but got " + testSummary.featureFailingTestCount + " for Feature " + featureName);
                    }
                } else {
                    throw new Meteor.Error("FAIL", "Expected passing test count of " + passingTests + " but got " + testSummary.featurePassingTestCount + " for Feature " + featureName);
                }
            } else {
                throw new Meteor.Error("FAIL", "Expected expected test count of " + expectedTests + " but got " + testSummary.featureExpectedTestCount + " for Feature " + featureName);
            }
        } else {
            throw new Meteor.Error("FAIL", "No test summary data found for Feature " + featureName);
        }
    },

    'verifyGuiInputs.scenarioTestResultsInputsInclude'(userName, scenarioName, testType, testName, testResult){

        const userContext = TestDataHelpers.getUserContext(userName);

        if(userContext.designVersionId === 'NONE'){
            throw new Meteor.Error("FAIL", "Design Version is undefined for  " + userName);
        }

        const scenario = TestDataHelpers.getDesignComponent(userContext.designVersionId, userContext.designUpdateId, scenarioName);

        const permutationResults = ClientDataServices.getScenarioPermutationTestResults(userContext, scenario);

        let found = false;

        if(permutationResults.scenarioName !== scenarioName){
            throw new Meteor.Error("FAIL", "Test result data has scenario name " + permutationResults.scenarioName + " but expecting " + scenarioName);
        }

        permutationResults.scenarioTestResults.forEach((result) => {

            if(result.testType === testType && result.testName === testName && result.testOutcome === testResult){
                 found = true;
            }
        });

        if(found){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Test result for " + testType + " test  called " + testName + " with result " + testResult + " not found");
        }
    },

    'verifyGuiInputs.scenarioOverallTestResultIs'(userName, scenarioName, testResult){

        const userContext = TestDataHelpers.getUserContext(userName);

        const scenario = TestDataHelpers.getDesignComponent(userContext.designVersionId, userContext.designUpdateId, scenarioName);

        const scenarioResult = ClientDataServices.getScenarioOverallTestResult(userContext, scenario);

        if(scenarioResult.scenarioName !== scenarioName){
            throw new Meteor.Error("FAIL", "Test result data has scenario name " + scenarioResult.scenarioName + " but expecting " + scenarioName);
        }

        if(scenarioResult.scenarioTestResult !== testResult){
            throw new Meteor.Error("FAIL", "Test result data has test result " + scenarioResult.scenarioTestResult + " but expecting " + testResult);
        }

        return true;
    },

});