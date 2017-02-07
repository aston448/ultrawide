import { Meteor } from 'meteor/meteor';

import ClientDesignUpdateServices       from '../../imports/apiClient/apiClientDesignUpdate.js';
import TestDataHelpers                  from '../test_modules/test_data_helpers.js'

import {RoleType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testDesignUpdates.selectDesignUpdate'(designUpdateName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);
        const designUpdate = TestDataHelpers.getDesignUpdate(userContext.designVersionId, designUpdateName);

        // This is not a validated action
        ClientDesignUpdateServices.setDesignUpdate(userContext, designUpdate._id);

    },

    'testDesignUpdates.addDesignUpdate'(userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);

        const outcome = ClientDesignUpdateServices.addNewDesignUpdate(userRole, userContext.designVersionId);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Add Update');
    },

    'testDesignUpdates.publishDesignUpdate'(designUpdateName, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const designUpdate = TestDataHelpers.getDesignUpdate(userContext.designVersionId, designUpdateName);

        const outcome = ClientDesignUpdateServices.publishDesignUpdate(userRole, userContext, designUpdate._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Publish Update');
    },

    'testDesignUpdates.withdrawDesignUpdate'(designUpdateName, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const designUpdate = TestDataHelpers.getDesignUpdate(userContext.designVersionId, designUpdateName);

        const outcome = ClientDesignUpdateServices.withdrawDesignUpdate(userRole, userContext, designUpdate._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Withdraw Update');

    },

    'testDesignUpdates.editDesignUpdate'(designUpdateName, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const viewOptions = TestDataHelpers.getViewOptions(userName);
        const designUpdate = TestDataHelpers.getDesignUpdate(userContext.designVersionId, designUpdateName);

        const outcome = ClientDesignUpdateServices.editDesignUpdate(userRole, userContext, viewOptions, designUpdate._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Edit Update');
    },

    'testDesignUpdates.viewDesignUpdate'(designUpdateName, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const viewOptions = TestDataHelpers.getViewOptions(userName);
        const designUpdate = TestDataHelpers.getDesignUpdate(userContext.designVersionId, designUpdateName);

        const outcome = ClientDesignUpdateServices.viewDesignUpdate(userRole, userContext, viewOptions, designUpdate._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'View Update');
    },

    'testDesignUpdates.updateDesignUpdateName'(newName, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assumption that DU is selected before name updated
        const userContext = TestDataHelpers.getUserContext(userName);

        const outcome = ClientDesignUpdateServices.updateDesignUpdateName(userRole, userContext.designUpdateId, newName);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Edit Update Name');
    },

    'testDesignUpdates.updateDesignUpdateRef'(newRef, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assumption that DU is always selected before it can be updated
        const userContext = TestDataHelpers.getUserContext(userName);

        const outcome = ClientDesignUpdateServices.updateDesignUpdateReference(userRole, userContext.designUpdateId, newRef);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Edit Update Ref');
    },

    'testDesignUpdates.updateMergeAction'(newAction, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        // Assumption that DU is always selected before it can be updated
        const userContext = TestDataHelpers.getUserContext(userName);

        const outcome = ClientDesignUpdateServices.updateMergeAction(userRole, userContext.designUpdateId, newAction);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Set Update Merge Action');
    },

    'testDesignUpdates.removeDesignUpdate'(designUpdateName, userRole, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const userContext = TestDataHelpers.getUserContext(userName);
        const designUpdate = TestDataHelpers.getDesignUpdate(userContext.designVersionId, designUpdateName);

        const outcome = ClientDesignUpdateServices.deleteDesignUpdate(userRole, userContext, designUpdate._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Remove Update');
    }

});
