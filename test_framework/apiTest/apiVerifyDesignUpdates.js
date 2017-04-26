import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js';
import { DesignUpdates }           from '../../imports/collections/design_update/design_updates.js';

import TestDataHelpers              from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'verifyDesignUpdates.designUpdateStatusIs'(designUpdateName, newStatus, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designUpdate = TestDataHelpers.getDesignUpdate(userContext.designVersionId, designUpdateName);

        if(designUpdate.updateStatus === newStatus){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected DU status " + newStatus + " but has status " + designUpdate.updateStatus);
        }
    },

    'verifyDesignUpdates.designUpdateStatusIsNot'(designUpdateName, newStatus, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designUpdate = TestDataHelpers.getDesignUpdate(userContext.designVersionId, designUpdateName);

        if(designUpdate.updateStatus != newStatus){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected DU status not to be " + newStatus);
        }
    },

    'verifyDesignUpdates.currentDesignUpdateNameIs'(designUpdateName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designUpdate = DesignUpdates.findOne({_id: userContext.designUpdateId});

        if(designUpdate){
            if(designUpdate.updateName === designUpdateName){
                return true;
            } else {
                throw new Meteor.Error("FAIL", "Expected DU name to be " + designUpdateName + " but got " + designUpdate.updateName);
            }
        } else {
            // OK if NONE expected
            if (designUpdateName === 'NONE') {
                return true;
            } else {
                throw new Meteor.Error("FAIL", "Not expecting no Design Update found");
            }
        }

    },

    'verifyDesignUpdates.currentDesignUpdateRefIs'(designUpdateRef, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designUpdate = DesignUpdates.findOne({_id: userContext.designUpdateId});

        if(designUpdate.updateReference === designUpdateRef){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected DU version to be " + designUpdateRef + " but got " + designUpdate.updateReference);
        }
    },

    'verifyDesignUpdates.designUpdateExistsCalled'(designUpdateName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designUpdate = DesignUpdates.findOne({designVersionId: userContext.designVersionId, updateName: designUpdateName});

        if(designUpdate){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "No Design Update found with name " + designUpdateName);
        }

    },

    'verifyDesignUpdates.designUpdateDoesNotExistCalled'(designUpdateName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designUpdate = DesignUpdates.findOne({designVersionId: userContext.designVersionId, updateName: designUpdateName});

        if(designUpdate){
            throw new Meteor.Error("FAIL", "Not expecting to find Design Update with name " + designUpdateName);
        } else {
            return true;
        }
    },

    'verifyDesignUpdates.designUpdateMergeActionIs'(designUpdateName, newMergeAction, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designUpdate = TestDataHelpers.getDesignUpdate(userContext.designVersionId, designUpdateName);

        if(designUpdate.updateMergeAction === newMergeAction){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected DU merge action " + newMergeAction + " but has action " + designUpdate.updateMergeAction);
        }
    },

    'verifyDesignUpdates.designUpdateWpStatusIs'(designUpdateName, wpStatus, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designUpdate = TestDataHelpers.getDesignUpdate(userContext.designVersionId, designUpdateName);

        if(designUpdate.updateWpStatus === wpStatus){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected DU WP Status " + wpStatus + " but has status " + designUpdate.updateWpStatus);
        }
    },

    'verifyDesignUpdates.designUpdateTestStatusIs'(designUpdateName, testStatus, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designUpdate = TestDataHelpers.getDesignUpdate(userContext.designVersionId, designUpdateName);

        if(designUpdate.updateTestStatus === testStatus){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected DU test Status " + testStatus + " but has status " + designUpdate.updateTestStatus);
        }
    },

});

