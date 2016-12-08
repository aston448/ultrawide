// == IMPORTS ==========================================================================================================

// Ultrawide Collections
import {DesignUpdateComponents} from '../collections/design_update/design_update_components.js';

// Ultrawide Services
import { ViewType, ViewMode, ComponentType, MessageType } from '../constants/constants.js';
import { Validation } from '../constants/validation_errors.js';
import { DesignUpdateMessages } from '../constants/message_texts.js';

import DesignUpdateValidationApi    from '../apiValidation/apiDesignUpdateValidation.js';
import ServerDesignUpdateApi        from '../apiServer/apiDesignUpdate.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentView, changeApplicationMode, setCurrentUserOpenDesignUpdateItems, updateUserMessage} from '../redux/actions';

// =====================================================================================================================
// Client API for Design Update Items
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================
class ClientDesignUpdateServices {

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User clicks Add New Update in Design Updates list for a Design Version ------------------------------------------
    addNewDesignUpdate(userRole, designVersionId){

        // Client validation
        let result = DesignUpdateValidationApi.validateAddDesignUpdate(userRole, designVersionId);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call - server actions
        ServerDesignUpdateApi.addDesignUpdate(userRole, designVersionId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
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
        return true;
    };

    // User saves an update to a Design Update name --------------------------------------------------------------------
    updateDesignUpdateName(userRole, designUpdateId, newName){

        // Client validation
        let result = DesignUpdateValidationApi.validateUpdateDesignUpdateName(userRole, designUpdateId, newName);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call - server actions
        ServerDesignUpdateApi.updateDesignUpdateName(userRole, designUpdateId, newName, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
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
        return true;
    };

    // User saves an update to a Design Update version -----------------------------------------------------------------
    updateDesignUpdateReference(userRole, designUpdateId, newRef){

        // Client validation
        let result = DesignUpdateValidationApi.validateUpdateDesignUpdateReference(userRole, designUpdateId, newRef);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call - server actions
        ServerDesignUpdateApi.updateDesignUpdateRef(userRole, designUpdateId, newRef, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
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
        return true;
    }



    // User chose to publish a design update to make it available in draft form ----------------------------------------
    publishDesignUpdate(userRole, userContext, designUpdateToPublishId){

        // Client validation
        let result = DesignUpdateValidationApi.validatePublishDesignUpdate(userRole, designUpdateToPublishId);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call - server actions
        ServerDesignUpdateApi.publishDesignUpdate(userRole, designUpdateToPublishId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:
                // Ensure that the current update is the update we chose to publish
                this.setDesignUpdate(userContext, designUpdateToPublishId);

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignUpdateMessages.MSG_DESIGN_UPDATE_PUBLISHED
                }));
            }
        });

        // Indicate that business validation passed
        return true;
    };


    // User chose to delete a design update ----------------------------------------------------------------------------
    deleteDesignUpdate(userRole, userContext, designUpdateToDeleteId){

        // Client validation
        let result = DesignUpdateValidationApi.validateRemoveDesignUpdate(userRole, designUpdateToDeleteId);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call - server actions
        ServerDesignUpdateApi.removeDesignUpdate(userRole, designUpdateToDeleteId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
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
                    scenarioStepId:                 'NONE',
                    featureFilesLocation:           userContext.featureFilesLocation,
                    acceptanceTestResultsLocation:  userContext.acceptanceTestResultsLocation,
                    integrationTestResultsLocation: userContext.integrationTestResultsLocation,
                    moduleTestResultsLocation:      userContext.moduleTestResultsLocation
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
        return true;
    };

    // LOCAL CLIENT ACTIONS ============================================================================================

    // Sets the currently selected design update as part of the global state -------------------------------------------
    setDesignUpdate(userContext, newDesignUpdateId){

        if(newDesignUpdateId != userContext.designUpdateId) {

            const context = {
                userId:                         userContext.userId,
                designId:                       userContext.designId,           // Must be the same design
                designVersionId:                userContext.designVersionId,    // Must be same design version
                designUpdateId:                 newDesignUpdateId,              // Update selected
                workPackageId:                  'NONE',
                designComponentId:              'NONE',
                designComponentType:            'NONE',
                featureReferenceId:             'NONE',
                featureAspectReferenceId:       'NONE',
                scenarioReferenceId:            'NONE',
                scenarioStepId:                 'NONE',
                featureFilesLocation:           userContext.featureFilesLocation,
                acceptanceTestResultsLocation:  userContext.acceptanceTestResultsLocation,
                integrationTestResultsLocation: userContext.integrationTestResultsLocation,
                moduleTestResultsLocation:      userContext.moduleTestResultsLocation
            };

            store.dispatch(setCurrentUserItemContext(context, true));

            return true;
        }

        // Not an error - just indicates no update needed
        return false;
    };

    // User chose to edit a design update ------------------------------------------------------------------------------
    editDesignUpdate(userRole, userContext, designUpdateToEditId){

        // Client validation
        let result = DesignUpdateValidationApi.validateEditDesignUpdate(userRole, designUpdateToEditId);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Open the update scope down to the Feature level
        const designUpdateOpenComponents = DesignUpdateComponents.find(
            {
                designUpdateId: designUpdateToEditId,
                componentType: {$in:[ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]}
            },
            {fields: {_id: 1}}
        );

        let duArr = [];
        designUpdateOpenComponents.forEach((component) => {
            duArr.push(component._id);
        });

        store.dispatch(setCurrentUserOpenDesignUpdateItems(
            userContext.userId,
            duArr,
            null,
            true
        ));

        // Ensure that the current update is the update we chose to edit
        this.setDesignUpdate(userContext, designUpdateToEditId);

        // Edit mode
        store.dispatch(changeApplicationMode(ViewMode.MODE_EDIT));

        // Switch to update edit view
        store.dispatch(setCurrentView(ViewType.DESIGN_UPDATE_EDIT));

        return true;

    };

    // User chose to view a Design Update ------------------------------------------------------------------------------
    viewDesignUpdate(userRole, userContext, designUpdateToViewId){

        // Client validation
        let result = DesignUpdateValidationApi.validateViewDesignUpdate(userRole, designUpdateToViewId);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Ensure that the current update is the update we chose to view
        this.setDesignUpdate(userContext, designUpdateToViewId);

        // View mode
        store.dispatch(changeApplicationMode(ViewMode.MODE_VIEW));

        // Switch to update view-only
        store.dispatch(setCurrentView(ViewType.DESIGN_UPDATE_VIEW));

        return true;

    };

}

export default new ClientDesignUpdateServices();