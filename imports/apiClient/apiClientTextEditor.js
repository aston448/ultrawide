// == IMPORTS ==========================================================================================================

// Ultrawide Collections

// Ultrawide Services
import { MessageType } from '../constants/constants.js';
import { Validation } from '../constants/validation_errors.js';
import { TextEditorMessages } from '../constants/message_texts.js'

import ServerTextEditorApi      from '../apiServer/apiTextEditor.js';
import TextEditorValidationApi  from '../apiValidation/apiTextEditorValidation.js';

// REDUX services
import store from '../redux/store'
import {updateUserMessage} from '../redux/actions'

// =====================================================================================================================
// Client API for The Details Text Editor
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================
class ClientTextEditorServices{

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User saves Details Text for an Initial Design Version -----------------------------------------------------------
    saveDesignComponentText(userRole, designComponentId, newRawText){

        // Client validation
        let result = TextEditorValidationApi.validateSaveDesignComponentDetails(userRole);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerTextEditorApi.saveDesignComponentText(userRole, designComponentId, newRawText, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Remove Design client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: TextEditorMessages.MSG_TEXT_EDITOR_DETAILS_UPDATED
                }));
            }
        });


        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User saves Details Text for an Design Update --------------------------------------------------------------------
    saveDesignUpdateComponentText(userRole, designUpdateComponentId, newRawText){

        // Client validation
        let result = TextEditorValidationApi.validateSaveDesignUpdateComponentDetails(userRole);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerTextEditorApi.saveDesignUpdateComponentText(userRole, designUpdateComponentId, newRawText, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Remove Design client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: TextEditorMessages.MSG_TEXT_EDITOR_DETAILS_UPDATED
                }));
            }
        });


        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // LOCAL CLIENT ACTIONS ============================================================================================

    getColourMap(){
        return {
            'RED': {
                color: 'rgba(255, 0, 0, 1.0)',
            },
            'ORANGE': {
                color: 'rgba(255, 127, 0, 1.0)',
            },
            'YELLOW': {
                color: 'rgba(180, 180, 0, 1.0)',
            },
            'GREEN': {
                color: 'rgba(0, 180, 0, 1.0)',
            },
            'BLUE': {
                color: 'rgba(0, 0, 255, 1.0)',
            },
            'INDIGO': {
                color: 'rgba(75, 0, 130, 1.0)',
            },
            'VIOLET': {
                color: 'rgba(127, 0, 255, 1.0)',
            },
        };
    }
}

export default new ClientTextEditorServices();