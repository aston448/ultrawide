// == IMPORTS ==========================================================================================================

// Ultrawide Collections

// Ultrawide Services
import { ViewType, MessageType } from '../constants/constants.js';
import { Validation } from '../constants/validation_errors.js';
import { DesignMessages } from '../constants/message_texts.js'

import ServerDesignApi      from '../apiServer/apiDesign.js';
import DesignValidationApi  from '../apiValidation/apiDesignValidation.js';
import ClientUserContextServices from '../apiClient/apiClientUserContext.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentView, updateUserMessage} from '../redux/actions'

// =====================================================================================================================
// Client API for Design Items
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================
class ClientDesignServices{

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User adds a new Design to Ultrawide -----------------------------------------------------------------------------
    addNewDesign(userRole){

        // Client validation
        let result = DesignValidationApi.validateAddDesign(userRole);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call - server actions
        ServerDesignApi.addDesign(userRole, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Remove Design client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignMessages.MSG_DESIGN_ADDED
                }));
            }
        });

        // Indicate that business validation passed
        return true;
    };

    // User saves an update to a Design name ---------------------------------------------------------------------------
    updateDesignName(userRole, designId, newName){

        // Client validation
        let result = DesignValidationApi.validateUpdateDesignName(userRole, newName, designId);

        if(result != Validation.VALID){
            console.log("Save Design Name validation failed: " + result);
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call - server actions
        ServerDesignApi.updateDesignName(userRole, designId, newName, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Remove Design client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignMessages.MSG_DESIGN_NAME_UPDATED
                }));
            }
        });


        // Indicate that business validation passed
        return true;
    };

    // User chooses to remove a Design ---------------------------------------------------------------------------------
    removeDesign(userContext, userRole, designId){

        // Client validation
        let result = DesignValidationApi.validateRemoveDesign(userRole, designId);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call - server actions
        ServerDesignApi.removeDesign(userRole, designId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Remove Design client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignMessages.MSG_DESIGN_REMOVED
                }));

                // Set no current user item context but keep locations
                const context = {
                    userId: userContext.userId,
                    designId: 'NONE',
                    designVersionId: 'NONE',
                    designUpdateId: 'NONE',
                    workPackageId: 'NONE',
                    designComponentId: 'NONE',
                    designComponentType: 'NONE',
                    featureReferenceId: 'NONE',
                    featureAspectReferenceId: 'NONE',
                    scenarioReferenceId: 'NONE',
                    scenarioStepId: 'NONE',
                    featureFilesLocation: userContext.featureFilesLocation,
                    acceptanceTestResultsLocation: userContext.acceptanceTestResultsLocation,
                    integrationTestResultsLocation: userContext.integrationTestResultsLocation,
                    unitTestResultsLocation: userContext.unitTestResultsLocation
                };

                store.dispatch(setCurrentUserItemContext(context, true));

                // Reset the user context of other users where this Design is selected (if any)
                ClientUserContextServices.resetContextsOnDesignRemoval(designId)

            }
        });


        // Indicate that business validation passed
        return true;
    }

    // LOCAL CLIENT ACTIONS ============================================================================================

    setDesign(userContext, newDesignId){
        // Set a new design as the current design if a new one chosen

        // if(newDesignId != userContext.designId) {

            const context = {
                userId:                         userContext.userId,
                designId:                       newDesignId,
                designVersionId:                'NONE',
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
                unitTestResultsLocation:      userContext.unitTestResultsLocation
            };

            store.dispatch(setCurrentUserItemContext(context, true));

            return true;
        // }
        //
        // // Not an error - just indicates no change
        // return false;
    }

    workDesign(userContext, userRole, newDesignId){

        // Make sure the current design is set
        this.setDesign(userContext, newDesignId);

        // Design set - go to selection screen
        store.dispatch(setCurrentView(ViewType.SELECT));
    }

}

export default new ClientDesignServices();
