// == IMPORTS ==========================================================================================================

// Ultrawide Services
import { ServerWorkItemApi }       from '../apiServer/apiWorkItem.js';
import { WorkItemValidationApi }   from '../apiValidation/apiWorkItemValidation.js';

import { MessageType }              from '../constants/constants.js';
import { Validation }               from '../constants/validation_errors.js';
import { WorkItemMessages }        from '../constants/message_texts.js'

// REDUX services
import store from '../redux/store'
import {setCurrentView, updateTestDataFlag, updateUserMessage} from '../redux/actions'
import {LogLevel, ViewType} from "../constants/constants";
import {ServerTestIntegrationApi} from "../apiServer/apiTestIntegration";
import {log} from "../common/utils";
import {ClientDesignUpdateServices} from "./apiClientDesignUpdate";


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Work Item Services - Supports client calls for actions relating to Creating, Updating and Organising Work
//
// This class is the test entry point when not testing through the GUI.
// Most functions validate and return true / false according to business rules even if there is implicit validation in the GUI
// (E.g. buttons not being visible if action invalid)
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientWorkItemServicesClass{

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User chooses to add a new Increment -----------------------------------------------------------------------------
    addNewIncrement(designVersionId, userRole){

        // Client validation
        let result = WorkItemValidationApi.validateAddNewIncrement(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerWorkItemApi.addNewIncrement(designVersionId, userRole, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Remove Design client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: WorkItemMessages.MSG_INCREMENT_ADDED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User chooses to add a new Iteration -----------------------------------------------------------------------------
    addNewIteration(designVersionId, parentRefId, userRole){

        // Client validation
        let result = WorkItemValidationApi.validateAddNewIteration(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerWorkItemApi.addNewIteration(designVersionId, parentRefId, userRole, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Remove Design client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: WorkItemMessages.MSG_ITERATION_ADDED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User saves a work item
    saveWorkItemDetails(workItem, newName, newLink, userRole){

        // Client validation
        let result = WorkItemValidationApi.validateSaveWorkItemDetails(workItem, newName, userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerWorkItemApi.saveWorkItemDetails(workItem, newName, newLink, userRole, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Remove Design client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: WorkItemMessages.MSG_WORK_ITEM_UPDATED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    }

    // User chooses to remove a Work Item -----------------------------------------------------------------------------
    removeWorkItem(workItemId, userRole){

        // Client validation
        let result = WorkItemValidationApi.validateRemoveWorkItem(workItemId, userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerWorkItemApi.removeWorkItem(workItemId, userRole, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Remove Design client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: WorkItemMessages.MSG_ITERATION_REMOVED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User chooses to reorder a Work Item to above the target ---------------------------------------------------------
    reorderWorkItem(movingWorkItem, targetWorkItem, userRole){

        // Client validation
        let result = WorkItemValidationApi.validateReorderWorkItem(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerWorkItemApi.reorderWorkItem(movingWorkItem, targetWorkItem, userRole, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Remove Design client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: WorkItemMessages.MSG_WORK_ITEM_REORDERED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User chooses to move a Work Item to a new parent ----------------------------------------------------------------
    moveWorkItem(movingWorkItem, targetParentItem, userRole){

        // Client validation
        let result = WorkItemValidationApi.validateMoveWorkItem(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerWorkItemApi.moveWorkItem(movingWorkItem, targetParentItem, userRole, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Remove Design client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: WorkItemMessages.MSG_WORK_ITEM_MOVED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User dragged a WP back from an iteration to the unassigned list
    unassignWorkPackage(movingWorkPackage, userRole){

        // Client validation - can use move here
        let result = WorkItemValidationApi.validateMoveWorkItem(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerWorkItemApi.moveWorkItem(movingWorkPackage, null, userRole, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Remove Design client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: WorkItemMessages.MSG_WORK_ITEM_MOVED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };
}

export const ClientWorkItemServices = new ClientWorkItemServicesClass();

