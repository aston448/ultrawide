import { Meteor } from 'meteor/meteor';

import { UserWorkPackageMashData }      from '../../imports/collections/dev/user_work_package_mash_data.js';

import { MashTestStatus, ComponentType, WorkSummaryType } from '../../imports/constants/constants.js';

import TestDataHelpers              from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'verifyWorkProgress.summaryContainsItem'(itemType, itemName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        // This will error if not found
        const workProgress = TestDataHelpers.getWorkProgressDataFor(userContext.userId, itemType, itemName);

        return true;
    },

    'verifyWorkProgress.summaryDoesNotContainItem'(itemType, itemName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        // This will error if not found
        try {
            const workProgress = TestDataHelpers.getWorkProgressDataFor(userContext.userId, itemType, itemName);
        } catch (e){
            if(e.error === 'NOT_FOUND'){
                return true;
            } else {
                throw new Meteor.Error("FAIL", e.reason);
            }
        }

        throw new Meteor.Error("FAIL", itemType + " called " + itemName + " was found in Work Progress Summary");
    },

    'verifyWorkProgress.summaryForWorkItemIs'(itemType, itemName, expectedSummary, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        // This will error if not found
        const workProgress = TestDataHelpers.getWorkProgressDataFor(userContext.userId, itemType, itemName);

        if(workProgress.totalScenarios === expectedSummary.totalScenarios){
            if(workProgress.scenariosInWp === expectedSummary.scenariosInWp){
                if(workProgress.scenariosPassing === expectedSummary.scenariosPassing){
                    if(workProgress.scenariosFailing === expectedSummary.scenariosFailing){
                        if(workProgress.scenariosNoTests === expectedSummary.scenariosNoTests){
                            return true;
                        } else {
                            throw new Meteor.Error("FAIL", "Expected untested scenarios to be " + expectedSummary.scenariosNoTests + " but got " + workProgress.scenariosNoTests + " for " + itemName);
                        }
                    } else {
                        throw new Meteor.Error("FAIL", "Expected failing scenarios to be " + expectedSummary.scenariosFailing + " but got " + workProgress.scenariosFailing + " for " + itemName);
                    }
                } else {
                    throw new Meteor.Error("FAIL", "Expected passing scenarios to be " + expectedSummary.scenariosPassing + " but got " + workProgress.scenariosPassing + " for " + itemName);
                }
            } else {
                throw new Meteor.Error("FAIL", "Expected scenarios in WP to be " + expectedSummary.scenariosInWp + " but got " + workProgress.scenariosInWp + " for " + itemName);
            }
        } else {
            throw new Meteor.Error("FAIL", "Expected total scenarios to be " + expectedSummary.totalScenarios + " but got " + workProgress.totalScenarios + " for " + itemName);
        }
    }

});