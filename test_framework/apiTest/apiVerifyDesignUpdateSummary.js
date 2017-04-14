import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js';
import { DesignUpdates }            from '../../imports/collections/design_update/design_updates.js';
import { DesignUpdateSummary }      from '../../imports/collections/design_update/design_update_summary.js'

import TestDataHelpers              from '../test_modules/test_data_helpers.js'

import { DesignUpdateSummaryType, DesignUpdateSummaryItem, ComponentType } from '../../imports/constants/constants.js';

Meteor.methods({

    'verifyDesignUpdateSummary.additionsListContains'(itemType, itemName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const summaryItem = DesignUpdateSummary.findOne({
            designUpdateId: userContext.designUpdateId,
            summaryType: DesignUpdateSummaryType.SUMMARY_ADD,
            itemType: itemType,
            itemName: itemName
        });

        if(summaryItem){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected to find Design Update Summary item " + itemName + " in the additions list");
        }
    },

    'verifyDesignUpdateSummary.additionsListDoesNotContain'(itemType, itemName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const summaryItem = DesignUpdateSummary.findOne({
            designUpdateId: userContext.designUpdateId,
            summaryType: DesignUpdateSummaryType.SUMMARY_ADD,
            itemType: itemType,
            itemName: itemName
        });

        if(summaryItem){
            throw new Meteor.Error("FAIL", "Expected NOT to find Design Update Summary item " + itemName + " in the additions list");
        } else {
            return true;
        }
    },

    'verifyDesignUpdateSummary.removalsListContains'(itemType, itemName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const summaryItem = DesignUpdateSummary.findOne({
            designUpdateId: userContext.designUpdateId,
            summaryType: DesignUpdateSummaryType.SUMMARY_REMOVE,
            itemType: itemType,
            itemName: itemName
        });

        if(summaryItem){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected to find Design Update Summary item " + itemName + " in the removals list");
        }
    },

    'verifyDesignUpdateSummary.removalsListDoesNotContain'(itemType, itemName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const summaryItem = DesignUpdateSummary.findOne({
            designUpdateId: userContext.designUpdateId,
            summaryType: DesignUpdateSummaryType.SUMMARY_REMOVE,
            itemType: itemType,
            itemName: itemName
        });

        if(summaryItem){
            throw new Meteor.Error("FAIL", "Expected NOT to find Design Update Summary item " + itemName + " in the removals list");
        } else {
            return true;
        }
    },

    'verifyDesignUpdateSummary.changesListContains'(itemType, itemName, itemNameNew, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const summaryItem = DesignUpdateSummary.findOne({
            designUpdateId: userContext.designUpdateId,
            summaryType: DesignUpdateSummaryType.SUMMARY_CHANGE,
            itemType: itemType,
            itemNameOld: itemName,
            itemName: itemNameNew
        });

        if(summaryItem){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected to find Design Update Summary item " + itemName + " in the changes list with new name " + itemNameNew);
        }
    },

    'verifyDesignUpdateSummary.changesListDoesNotContain'(itemType, itemName, itemNameNew, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const summaryItem = DesignUpdateSummary.findOne({
            designUpdateId: userContext.designUpdateId,
            summaryType: DesignUpdateSummaryType.SUMMARY_CHANGE,
            itemType: itemType,
            itemNameOld: itemName,
            itemName: itemNameNew
        });

        if(summaryItem){
            throw new Meteor.Error("FAIL", "Expected NOT to find Design Update Summary item " + itemName + " in the changes list with new name " + itemNameNew);
        } else {
            return true;
        }
    },

    'verifyDesignUpdateSummary.movesListContains'(itemType, itemName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const summaryItem = DesignUpdateSummary.findOne({
            designUpdateId: userContext.designUpdateId,
            summaryType: DesignUpdateSummaryType.SUMMARY_MOVE,
            itemType: itemType,
            itemName: itemName
        });

        if(summaryItem){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected to find Design Update Summary item " + itemName + " in the moves list with name " + itemName);
        }
    },

    'verifyDesignUpdateSummary.movesListDoesNotContain'(itemType, itemName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const summaryItem = DesignUpdateSummary.findOne({
            designUpdateId: userContext.designUpdateId,
            summaryType: DesignUpdateSummaryType.SUMMARY_MOVE,
            itemType: itemType,
            itemName: itemName,
        });

        if(summaryItem){
            throw new Meteor.Error("FAIL", "Expected NOT to find Design Update Summary item " + itemName + " in the moves list with name " + itemName);
        } else {
            return true;
        }
    },

    'verifyDesignUpdateSummary.queriesListContains'(itemType, itemName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const summaryItem = DesignUpdateSummary.findOne({
            designUpdateId: userContext.designUpdateId,
            summaryType: DesignUpdateSummaryType.SUMMARY_QUERY,
            itemType: itemType,
            itemName: itemName
        });

        if(summaryItem){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected to find Design Update Summary item " + itemName + " in the queries list with name " + itemName);
        }
    },

    'verifyDesignUpdateSummary.queriesListDoesNotContain'(itemType, itemName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const summaryItem = DesignUpdateSummary.findOne({
            designUpdateId: userContext.designUpdateId,
            summaryType: DesignUpdateSummaryType.SUMMARY_QUERY,
            itemType: itemType,
            itemName: itemName,
        });

        if(summaryItem){
            throw new Meteor.Error("FAIL", "Expected NOT to find Design Update Summary item " + itemName + " in the queries list with name " + itemName);
        } else {
            return true;
        }
    },
});
