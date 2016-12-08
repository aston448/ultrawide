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

        if(designUpdate.updateName === designUpdateName){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected DU name to be " + designUpdateName + " but got " + designUpdate.updateName);
        }
    },

    'verifyDesignUpdates.currentDesignUpdateVersionIs'(designUpdateVersion, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designUpdate = DesignUpdates.findOne({_id: userContext.designUpdateId});

        if(designUpdate.updateVersion === designUpdateVersion){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "Expected DU version to be " + designUpdateVersion + " but got " + designUpdate.updateVersion);
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

});

