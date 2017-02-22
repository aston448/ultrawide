import { Meteor } from 'meteor/meteor';

import { UserWorkPackageMashData }      from '../../imports/collections/dev/user_work_package_mash_data.js';

import { MashTestStatus, ComponentType } from '../../imports/constants/constants.js';

import TestDataHelpers              from '../test_modules/test_data_helpers.js'

Meteor.methods({

    // LOCATIONS -------------------------------------------------------------------------------------------------------

    'verifyTestResults.scenarioIntTestResultIs'(scenarioName, result, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const testResult = TestDataHelpers.getMashTestResult(userContext, scenarioName);


        if (testResult.intMashTestStatus != result) {
            throw new Meteor.Error("FAIL", "Expecting test result " + result + " but got " + testResult.intMashTestStatus + " for Scenario " + scenarioName);
        } else {
            return true;
        }
    },

    'verifyTestResults.scenarioUnitTestResultIs'(scenarioName, result, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const testResult = TestDataHelpers.getMashTestResult(userContext, scenarioName);


        if (testResult.unitMashTestStatus != result) {
            throw new Meteor.Error("FAIL", "Expecting test result " + result + " but got " + testResult.unitMashTestStatus + " for Scenario " + scenarioName);
        } else {
            return true;
        }
    },

    'verifyTestResults.unitTestResultIs'(scenarioName, unitTestName, result, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const testResult = TestDataHelpers.getUnitTestResult(userContext, scenarioName, unitTestName);

        if (testResult.testOutcome != result) {
            throw new Meteor.Error("FAIL", "Expecting unit test result " + result + " but got " + testResult.testOutcome + " for Scenario " + scenarioName + " unit test " + unitTestName);
        } else {
            return true;
        }
    },

    'verifyTestResults.testMashWindowContainsComponent'(componentType, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const mashComponent = UserWorkPackageMashData.findOne({
            userId:                 userContext.userId,
            designVersionId:        userContext.designVersionId,
            designUpdateId:         userContext.designUpdateId,
            workPackageId:          userContext.workPackageId,
            mashComponentType:      componentType,
            designComponentName:    componentName
        });

        if(mashComponent){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Component " + componentName + " not found in Test Mash for user context DV: " + userContext.designVersionId + " DU: " + userContext.designUpdateId + " WP: " + userContext.workPackageId);
        }
    },

    'verifyTestResults.testMashWindowContainsUnitTest'(scenarioName, unitTestName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        // This will error if not found
        const testResult = TestDataHelpers.getUnitTestResult(userContext, scenarioName, unitTestName);
    },

    'verifyTestResults.testMashWindowDoesNotContainComponent'(componentType, componentName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const mashComponent = UserWorkPackageMashData.findOne({
            userId:                 userContext.userId,
            designVersionId:        userContext.designVersionId,
            designUpdateId:         userContext.designUpdateId,
            workPackageId:          userContext.workPackageId,
            mashComponentType:      componentType,
            designComponentName:    componentName
        });

        if(mashComponent){
            throw new Meteor.Error("FAIL", "Component " + componentName + " IS FOUND in Test Mash for user context DV: " + userContext.designVersionId + " DU: " + userContext.designUpdateId + " WP: " + userContext.workPackageId);
        } else {
            return true;
        }
    },

    'verifyTestResults.testMashWindowDoesNotContainUnitTest'(scenarioName, unitTestName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        // This will error if not found so pass in expect failure
        const testResult = TestDataHelpers.getUnitTestResult(userContext, scenarioName, unitTestName, true);
    },

    'verifyTestResults.testMashWindowContainsFeatureAspect'(featureName, aspectName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const wpComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, userContext.workPackageId, ComponentType.FEATURE_ASPECT, featureName, aspectName);

        if(wpComponent){
            const mashComponent = UserWorkPackageMashData.findOne({
                userId:                 userContext.userId,
                designVersionId:        userContext.designVersionId,
                designUpdateId:         userContext.designUpdateId,
                workPackageId:          userContext.workPackageId,
                mashComponentType:      ComponentType.FEATURE_ASPECT,
                designComponentId:      wpComponent.componentId
            });

            if(mashComponent){
                return true;
            } else {
                throw new Meteor.Error("FAIL", "Feature Aspect " + aspectName + " not found in Test Mash for Feature " + featureName + " in user context DV: " + userContext.designVersionId + " DU: " + userContext.designUpdateId + " WP: " + userContext.workPackageId);
            }
        }

    },

    'verifyTestResults.testMashWindowDoesNotContainFeatureAspect'(featureName, aspectName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const wpComponent = TestDataHelpers.getWorkPackageComponentWithParent(userContext.designVersionId, userContext.designUpdateId, userContext.workPackageId, ComponentType.FEATURE_ASPECT, featureName, aspectName);

        if(wpComponent){
            const mashComponent = UserWorkPackageMashData.findOne({
                userId:                 userContext.userId,
                designVersionId:        userContext.designVersionId,
                designUpdateId:         userContext.designUpdateId,
                workPackageId:          userContext.workPackageId,
                mashComponentType:      ComponentType.FEATURE_ASPECT,
                designComponentId:      wpComponent.componentId
            });

            if(mashComponent){
                throw new Meteor.Error("FAIL", "Feature Aspect " + aspectName + " IS FOUND in Test Mash for Feature " + featureName + " in user context DV: " + userContext.designVersionId + " DU: " + userContext.designUpdateId + " WP: " + userContext.workPackageId);
            } else {
                return true;
            }
        }
    },
});
