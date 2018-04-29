// == IMPORTS ==========================================================================================================

// Ultrawide Services
import { ViewType, ViewMode, MessageType, LogLevel } from '../constants/constants.js';
import { Validation } from '../constants/validation_errors.js';
import { DesignUpdateMessages } from '../constants/message_texts.js';
import { log } from '../common/utils.js';

import { DesignUpdateValidationApi }        from '../apiValidation/apiDesignUpdateValidation.js';
import { ServerDesignUpdateApi }            from '../apiServer/apiDesignUpdate.js';
import { ClientDesignUpdateSummary }        from '../apiClient/apiClientDesignUpdateSummary.js';
import { ClientTestIntegrationServices }    from '../apiClient/apiClientTestIntegration.js';
import { ClientUserContextServices }        from '../apiClient/apiClientUserContext.js';
import { ClientDesignVersionServices }      from '../apiClient/apiClientDesignVersion.js';

// Data Access
import { DesignUpdateData }                 from '../data/design_update/design_update_db.js';
import { DesignComponentData }              from '../data/design/design_component_db.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentView, setCurrentViewMode, updateUserMessage, setUpdateScopeItems} from '../redux/actions';

// =====================================================================================================================
// Client API for Design Update Items
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================
class ClientDesignUpdateServicesClass {

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User clicks Add New Update in Design Updates list for a Design Version ------------------------------------------
    addNewDesignUpdate(userRole, designVersionId){

        // Client validation
        let result = DesignUpdateValidationApi.validateAddDesignUpdate(userRole, designVersionId);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignUpdateApi.addDesignUpdate(userRole, designVersionId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 1: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignUpdateMessages.MSG_DESIGN_UPDATE_ADDED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User saves an update to a Design Update name --------------------------------------------------------------------
    updateDesignUpdateName(userRole, designUpdateId, newName){

        // Client validation
        let result = DesignUpdateValidationApi.validateUpdateDesignUpdateName(userRole, designUpdateId, newName);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignUpdateApi.updateDesignUpdateName(userRole, designUpdateId, newName, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 2: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignUpdateMessages.MSG_DESIGN_UPDATE_NAME_UPDATED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User saves an update to a Design Update version -----------------------------------------------------------------
    updateDesignUpdateReference(userRole, designUpdateId, newRef){

        // Client validation
        let result = DesignUpdateValidationApi.validateUpdateDesignUpdateReference(userRole, designUpdateId, newRef);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignUpdateApi.updateDesignUpdateRef(userRole, designUpdateId, newRef, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 3: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignUpdateMessages.MSG_DESIGN_UPDATE_VERSION_UPDATED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User chose to publish a design update to make it available in draft form ----------------------------------------
    publishDesignUpdate(userRole, userContext, designUpdateToPublishId){

        // Client validation
        let result = DesignUpdateValidationApi.validatePublishDesignUpdate(userRole, designUpdateToPublishId);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignUpdateApi.publishDesignUpdate(userRole, designUpdateToPublishId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 4: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:
                // Ensure that the current update is the update we chose to publish
                this.setDesignUpdate(userContext, designUpdateToPublishId);

                // Should now appear in Work Progress
                ClientDesignVersionServices.updateWorkProgress(userContext);

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignUpdateMessages.MSG_DESIGN_UPDATE_PUBLISHED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User chose to withdraw a published design update  ---------------------------------------------------------------
    withdrawDesignUpdate(userRole, userContext, designUpdateToWithdrawId){

        // Client validation
        let result = DesignUpdateValidationApi.validateWithdrawDesignUpdate(userRole, designUpdateToWithdrawId);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignUpdateApi.withdrawDesignUpdate(userRole, designUpdateToWithdrawId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 5: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:
                // Ensure that the current update is the update we chose to withdraw
                this.setDesignUpdate(userContext, designUpdateToWithdrawId);

                // Should now disappear in Work Progress
                ClientDesignVersionServices.updateWorkProgress(userContext);

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignUpdateMessages.MSG_DESIGN_UPDATE_WITHDRAWN
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User chose to delete a design update ----------------------------------------------------------------------------
    deleteDesignUpdate(userRole, userContext, designUpdateToDeleteId){

        // Client validation
        let result = DesignUpdateValidationApi.validateRemoveDesignUpdate(userRole, designUpdateToDeleteId);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignUpdateApi.removeDesignUpdate(userRole, designUpdateToDeleteId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 6: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:
                // Clear DU from user context
                const context = {
                    userId:                         userContext.userId,
                    designId:                       userContext.designId,
                    designVersionId:                userContext.designVersionId,
                    designUpdateId:                 'NONE',
                    workPackageId:                  'NONE',
                    designComponentId:              'NONE',
                    designComponentType:            'NONE',
                    featureReferenceId:             'NONE',
                    featureAspectReferenceId:       'NONE',
                    scenarioReferenceId:            'NONE',
                    scenarioStepId:                 'NONE'
                };

                store.dispatch(setCurrentUserItemContext(context, true));

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignUpdateMessages.MSG_DESIGN_UPDATE_REMOVED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User changed the merge action on the Design Update --------------------------------------------------------------
    updateMergeAction(userRole, designUpdateId, newAction){

        const userContext = store.getState().currentUserItemContext;

        // Client validation
        let result = DesignUpdateValidationApi.validateUpdateMergeAction(userRole, designUpdateId);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignUpdateApi.updateMergeAction(userRole, designUpdateId, newAction, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 7: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Should now appear or disappear in Work Progress
                ClientDesignVersionServices.updateWorkProgress(userContext);

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignUpdateMessages.MSG_DESIGN_UPDATE_MERGE_ACTION_SET
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};

    }

    // Called when Design Update list is displayed ---------------------------------------------------------------------
    updateDesignUpdateStatuses(userContext){

        log((msg) => console.log(msg), LogLevel.DEBUG, "UPDATE DU STATUSES...");

        ServerDesignUpdateApi.updateDesignUpdateStatuses(userContext, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 8: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignUpdateMessages.MSG_DESIGN_UPDATE_STATUS_REFRESHED
                }));
            }
        });
    }

    // LOCAL CLIENT ACTIONS ============================================================================================

    // Sets the currently selected design update as part of the global state -------------------------------------------
    setDesignUpdate(userContext, newDesignUpdateId){

        let newContext = userContext;

        //if(newDesignUpdateId !== userContext.designUpdateId) {

            // Also clears current WP selection when DU selected if not changing
            newContext = {
                userId: userContext.userId,
                designId: userContext.designId,           // Must be the same design
                designVersionId: userContext.designVersionId,    // Must be same design version
                designUpdateId: newDesignUpdateId,              // Update selected
                workPackageId: 'NONE',
                designComponentId: 'NONE',
                designComponentType: 'NONE',
                featureReferenceId: 'NONE',
                featureAspectReferenceId: 'NONE',
                scenarioReferenceId: 'NONE',
                scenarioStepId: 'NONE'
            };

            store.dispatch(setCurrentUserItemContext(newContext, true));

        //}

        // Open default items
        newContext = ClientUserContextServices.setOpenDesignUpdateItems(newContext);

        // Load or refresh DU Summary data - if necessary
        ClientDesignUpdateSummary.getDesignUpdateSummary(false);

        if(newDesignUpdateId !== userContext.designUpdateId) {

            // Update test summary if changing DU
            ClientTestIntegrationServices.updateTestSummaryData(newContext);
        }

        return newContext;

    };

    // User chose to edit a design update ------------------------------------------------------------------------------
    editDesignUpdate(userRole, userContext, viewOptions, designUpdateToEditId){

        // Client validation
        let result = DesignUpdateValidationApi.validateEditDesignUpdate(userRole, designUpdateToEditId);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Ensure that the current update is the update we chose to edit
        const newContext = this.setDesignUpdate(userContext, designUpdateToEditId);

        // Edit mode
        store.dispatch(setCurrentViewMode(ViewMode.MODE_EDIT));

        // Switch to update edit view
        store.dispatch(setCurrentView(ViewType.DESIGN_UPDATE_EDIT));


        // Set up the scope items as the current in scope items
        const updateItems = DesignUpdateData.getAllComponents(designUpdateToEditId);

        let updateItemsArr = [];
        let designItem = null;

        updateItems.forEach((item) => {

            designItem = DesignComponentData.getDesignComponentByRef(item.designVersionId, item.componentReferenceId);

            // The design item won't exist if a new item in a non-merged update
            if(designItem) {
                updateItemsArr.push(designItem._id);
            }
        });

        store.dispatch(setUpdateScopeItems(
            {
                flag:       0,
                current:    updateItemsArr,
                added:      [],
                removed:    []
            }
        ));

        return {success: true, message: ''};

    };

    // User chose to view a Design Update ------------------------------------------------------------------------------
    viewDesignUpdate(userRole, userContext, viewOptions, designUpdateToViewId, testDataFlag, testIntegrationDataContext){

        // Client validation
        let result = DesignUpdateValidationApi.validateViewDesignUpdate(userRole, designUpdateToViewId);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Ensure that the current update is the update we chose to view
        const newContext = this.setDesignUpdate(userContext, designUpdateToViewId);

        // View mode
        store.dispatch(setCurrentViewMode(ViewMode.MODE_VIEW));

        // Just switch to the design editor view
        store.dispatch(setCurrentView(ViewType.DESIGN_UPDATE_VIEW));

        return {success: true, message: ''};

    };

    getDesignUpdateRef(designUpdateId){

        const designUpdate = DesignUpdateData.getDesignUpdateById(designUpdateId);

        if(designUpdate){
            if(designUpdate.updateReference.length > 0){
                return designUpdate.updateReference;
            } else {
                return designUpdate.updateName;
            }

        } else {
            return '';
        }
    }

    getDesignUpdate(designUpdateId){

        return DesignUpdateData.getDesignUpdateById(designUpdateId);
    }

}

export const ClientDesignUpdateServices = new ClientDesignUpdateServicesClass();