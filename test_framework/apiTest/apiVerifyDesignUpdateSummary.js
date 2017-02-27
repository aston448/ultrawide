import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js';
import { DesignUpdates }            from '../../imports/collections/design_update/design_updates.js';
import { DesignUpdateSummaries }    from '../../imports/collections/design_update/design_update_summaries.js'

import TestDataHelpers              from '../test_modules/test_data_helpers.js'

import { DesignUpdateSummaryType, DesignUpdateSummaryItem, ComponentType } from '../../imports/constants/constants.js';

Meteor.methods({

    'verifyDesignUpdateSummary.additionsListContains'(itemType, itemName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        let summaryItem = null;

        switch(itemType){
            case ComponentType.FEATURE:
                summaryItem = DesignUpdateSummaries.findOne({
                    designUpdateId: userContext.designUpdateId,
                    summaryType:    DesignUpdateSummaryType.SUMMARY_ADD,
                    itemName:       itemName
                });
                break;
            case ComponentType.SCENARIO:
                summaryItem = DesignUpdateSummaries.findOne({
                    designUpdateId: userContext.designUpdateId,
                    summaryType:    DesignUpdateSummaryType.SUMMARY_ADD_TO,
                    itemName:       itemName
                });
                break;
        }

        if(summaryItem){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected to find Design Update Summary item " + itemName + " in the additions list");
        }
    },

    'verifyDesignUpdateSummary.additionsListDoesNotContain'(itemType, itemName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        let summaryItem = null;

        switch(itemType){
            case ComponentType.FEATURE:
                summaryItem = DesignUpdateSummaries.findOne({
                    designUpdateId: userContext.designUpdateId,
                    summaryType:    DesignUpdateSummaryType.SUMMARY_ADD,
                    itemName:       itemName
                });
                break;
            case ComponentType.SCENARIO:
                summaryItem = DesignUpdateSummaries.findOne({
                    designUpdateId: userContext.designUpdateId,
                    summaryType:    DesignUpdateSummaryType.SUMMARY_ADD_TO,
                    itemName:       itemName
                });
                break;
        }

        if(summaryItem){
            throw new Meteor.Error("FAIL", "Expected NOT to find Design Update Summary item " + itemName + " in the additions list");
        } else {
            return true;
        }
    },

    'verifyDesignUpdateSummary.removalsListContains'(itemType, itemName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        let summaryItem = null;

        switch(itemType){
            case ComponentType.FEATURE:
                summaryItem = DesignUpdateSummaries.findOne({
                    designUpdateId: userContext.designUpdateId,
                    summaryType:    DesignUpdateSummaryType.SUMMARY_REMOVE,
                    itemName:       itemName
                });
                break;
            case ComponentType.SCENARIO:
                summaryItem = DesignUpdateSummaries.findOne({
                    designUpdateId: userContext.designUpdateId,
                    summaryType:    DesignUpdateSummaryType.SUMMARY_REMOVE_FROM,
                    itemName:       itemName
                });
                break;
        }

        if(summaryItem){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected to find Design Update Summary item " + itemName + " in the removals list");
        }
    },

    'verifyDesignUpdateSummary.removalsListDoesNotContain'(itemType, itemName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        let summaryItem = null;

        switch(itemType){
            case ComponentType.FEATURE:
                summaryItem = DesignUpdateSummaries.findOne({
                    designUpdateId: userContext.designUpdateId,
                    summaryType:    DesignUpdateSummaryType.SUMMARY_REMOVE,
                    itemName:       itemName
                });
                break;
            case ComponentType.SCENARIO:
                summaryItem = DesignUpdateSummaries.findOne({
                    designUpdateId: userContext.designUpdateId,
                    summaryType:    DesignUpdateSummaryType.SUMMARY_REMOVE_FROM,
                    itemName:       itemName
                });
                break;
        }

        if(summaryItem){
            throw new Meteor.Error("FAIL", "Expected NOT to find Design Update Summary item " + itemName + " in the removals list");
        } else {
            return true;
        }
    },

    'verifyDesignUpdateSummary.changesListContains'(itemType, itemName, itemNameNew, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        let summaryItem = null;

        switch(itemType){
            case ComponentType.FEATURE:
                summaryItem = DesignUpdateSummaries.findOne({
                    designUpdateId: userContext.designUpdateId,
                    summaryType:    DesignUpdateSummaryType.SUMMARY_CHANGE,
                    itemNameOld:    itemName,
                    itemName:       itemNameNew
                });
                break;
            case ComponentType.SCENARIO:
                summaryItem = DesignUpdateSummaries.findOne({
                    designUpdateId: userContext.designUpdateId,
                    summaryType:    DesignUpdateSummaryType.SUMMARY_CHANGE_IN,
                    itemNameOld:    itemName,
                    itemName:       itemNameNew
                });
                break;
        }

        if(summaryItem){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected to find Design Update Summary item " + itemName + " in the changes list with new name " + itemNameNew);
        }
    },

    'verifyDesignUpdateSummary.changesListDoesNotContain'(itemType, itemName, itemNameNew, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        let summaryItem = null;

        switch(itemType){
            case ComponentType.FEATURE:
                summaryItem = DesignUpdateSummaries.findOne({
                    designUpdateId: userContext.designUpdateId,
                    summaryType:    DesignUpdateSummaryType.SUMMARY_CHANGE,
                    itemNameOld:    itemName,
                    itemName:       itemNameNew
                });
                break;
            case ComponentType.SCENARIO:
                summaryItem = DesignUpdateSummaries.findOne({
                    designUpdateId: userContext.designUpdateId,
                    summaryType:    DesignUpdateSummaryType.SUMMARY_CHANGE_IN,
                    itemNameOld:    itemName,
                    itemName:       itemNameNew
                });
                break;
        }

        if(summaryItem){
            throw new Meteor.Error("FAIL", "Expected NOT to find Design Update Summary item " + itemName + " in the changes list with new name " + itemNameNew);
        } else {
            return true;
        }
    },

});
