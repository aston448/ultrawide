import { Meteor } from 'meteor/meteor';

import { UserWorkPackageMashData }      from '../../imports/collections/dev/user_work_package_mash_data.js';

import { MashTestStatus, ComponentType } from '../../imports/constants/constants.js';

import TestDataHelpers              from '../test_modules/test_data_helpers.js'

Meteor.methods({


    'verifyTestSummary.featureTestStatusIs'(featureParent, featureName, testStatus, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designFeature = TestDataHelpers.getDesignComponentWithParent(userContext.designVersionId, ComponentType.FEATURE, featureParent, featureName);
        const summaryData = TestDataHelpers.getTestSummaryFeatureData(userContext.userId, userContext.designVersionId, designFeature.componentReferenceId, featureName);

        let result = true;
        let actual = '';

        if(userContext.workPackageId !== 'NONE'){
            actual = summaryData.wpFeatureSummaryStatus;
            result = (actual === testStatus);
        } else {
            if(userContext.designUpdateId !== 'NONE'){
                actual = summaryData.duFeatureSummaryStatus;
                result = (actual === testStatus);
            } else {
                actual = summaryData.featureSummaryStatus;
                result = (actual === testStatus);
            }
        }

        if (!result) {
            throw new Meteor.Error("FAIL", "Expecting Feature to be " + testStatus + " but got " + actual + " for Feature " + featureName);
        } else {
            return true;
        }
    },

    'verifyTestSummary.featurePassingTestsCountIs'(featureParent, featureName, testCount, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designFeature = TestDataHelpers.getDesignComponentWithParent(userContext.designVersionId, ComponentType.FEATURE, featureParent, featureName);
        const summaryData = TestDataHelpers.getTestSummaryFeatureData(userContext.userId, userContext.designVersionId, designFeature.componentReferenceId, featureName);

        let result = true;
        let actual = 0;

        if(userContext.workPackageId !== 'NONE'){
            actual = summaryData.wpFeatureTestPassCount;
            result = (actual === testCount);
        } else {
            if(userContext.designUpdateId !== 'NONE'){
                actual = summaryData.duFeatureTestPassCount;
                result = (actual === testCount);
            } else {
                actual = summaryData.featureTestPassCount;
                result = (actual === testCount);
            }
        }

        if (!result) {
            throw new Meteor.Error("FAIL", "Expecting Feature to have " + testCount + " passing tests but got " + actual + " for Feature " + featureName);
        } else {
            return true;
        }
    },

    'verifyTestSummary.featureFailingTestsCountIs'(featureParent, featureName, testCount, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designFeature = TestDataHelpers.getDesignComponentWithParent(userContext.designVersionId, ComponentType.FEATURE, featureParent, featureName);
        const summaryData = TestDataHelpers.getTestSummaryFeatureData(userContext.userId, userContext.designVersionId, designFeature.componentReferenceId, featureName);

        let result = true;
        let actual = 0;

        if(userContext.workPackageId !== 'NONE'){
            actual = summaryData.wpFeatureTestFailCount;
            result = (actual === testCount);
        } else {
            if(userContext.designUpdateId !== 'NONE'){
                actual = summaryData.duFeatureTestFailCount;
                result = (actual === testCount);
            } else {
                actual = summaryData.featureTestFailCount;
                result = (actual === testCount);
            }
        }

        if (!result) {
            throw new Meteor.Error("FAIL", "Expecting Feature to have " + testCount + " failing tests but got " + actual + " for Feature " + featureName);
        } else {
            return true;
        }
    },

    'verifyTestSummary.featureUntestedCountIs'(featureParent, featureName, testCount, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designFeature = TestDataHelpers.getDesignComponentWithParent(userContext.designVersionId, ComponentType.FEATURE, featureParent, featureName);
        const summaryData = TestDataHelpers.getTestSummaryFeatureData(userContext.userId, userContext.designVersionId, designFeature.componentReferenceId, featureName);

        let result = true;
        let actual = 0;

        if(userContext.workPackageId !== 'NONE'){
            actual = summaryData.wpFeatureNoTestCount;
            result = (actual === testCount);
        } else {
            if(userContext.designUpdateId !== 'NONE'){
                actual = summaryData.duFeatureNoTestCount;
                result = (actual === testCount);
            } else {
                actual = summaryData.featureNoTestCount;
                result = (actual === testCount);
            }
        }

        if (!result) {
            throw new Meteor.Error("FAIL", "Expecting Feature to have " + testCount + " scenarios not tested but got " + actual + " for Feature " + featureName);
        } else {
            return true;
        }
    },

    'verifyTestSummary.scenarioTestStatusIs'(scenarioParent, scenarioName, testStatus, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designScenario = TestDataHelpers.getDesignComponentWithParent(userContext.designVersionId, ComponentType.SCENARIO, scenarioParent, scenarioName);
        const summaryData = TestDataHelpers.getTestSummaryScenarioData(userContext.userId, userContext.designVersionId, designScenario.componentReferenceId, scenarioName);

        let actualTestStatus = MashTestStatus.MASH_NOT_LINKED;

        if(summaryData.accTestStatus === MashTestStatus.MASH_FAIL || summaryData.intTestStatus === MashTestStatus.MASH_FAIL || summaryData.unitTestFailCount > 0){
            actualTestStatus = MashTestStatus.MASH_FAIL;
        } else{
            if(summaryData.accTestStatus === MashTestStatus.MASH_PASS || summaryData.intTestStatus === MashTestStatus.MASH_PASS || summaryData.unitTestPassCount > 0){
                actualTestStatus = MashTestStatus.MASH_PASS;
            }
        }
        if (actualTestStatus !== testStatus) {
            throw new Meteor.Error("FAIL", "Expecting Scenario to be " + testStatus + " but got " + actualTestStatus + " for Scenario " + scenarioName);
        } else {
            return true;
        }

    },

    'verifyTestSummary.scenarioUnitTestPassCountIs'(scenarioParent, scenarioName, testCount, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designScenario = TestDataHelpers.getDesignComponentWithParent(userContext.designVersionId, ComponentType.SCENARIO, scenarioParent, scenarioName);
        const summaryData = TestDataHelpers.getTestSummaryScenarioData(userContext.userId, userContext.designVersionId, designScenario.componentReferenceId, scenarioName);

        if (summaryData.unitTestPassCount !== testCount) {
            throw new Meteor.Error("FAIL", "Expecting Unit Test pass count to be " + testCount + " but got " + summaryData.unitTestPassCount + " for Scenario " + scenarioName);
        } else {
            return true;
        }
    },

    'verifyTestSummary.scenarioUnitTestFailCountIs'(scenarioParent, scenarioName, testCount, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designScenario = TestDataHelpers.getDesignComponentWithParent(userContext.designVersionId, ComponentType.SCENARIO, scenarioParent, scenarioName);
        const summaryData = TestDataHelpers.getTestSummaryScenarioData(userContext.userId, userContext.designVersionId, designScenario.componentReferenceId, scenarioName);

        if (summaryData.unitTestFailCount !== testCount) {
            throw new Meteor.Error("FAIL", "Expecting Unit Test fail count to be " + testCount + " but got " + summaryData.unitTestFailCount + " for Scenario " + scenarioName);
        } else {
            return true;
        }
    },

    'verifyTestSummary.scenarioIntTestResultIs'(scenarioParent, scenarioName, testStatus, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designScenario = TestDataHelpers.getDesignComponentWithParent(userContext.designVersionId, ComponentType.SCENARIO, scenarioParent, scenarioName);
        const summaryData = TestDataHelpers.getTestSummaryScenarioData(userContext.userId, userContext.designVersionId, designScenario.componentReferenceId, scenarioName);

        if (summaryData.intTestStatus !== testStatus) {
            throw new Meteor.Error("FAIL", "Expecting Scenario Int Test to be " + testStatus + " but got " + summaryData.intTestStatus + " for Scenario " + scenarioName);
        } else {
            return true;
        }
    },

});
