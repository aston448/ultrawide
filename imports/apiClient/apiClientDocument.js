// == IMPORTS ==========================================================================================================

// Ultrawide Collections

// Ultrawide Services
import { ViewType, MessageType } from '../constants/constants.js';
import { Validation } from '../constants/validation_errors.js';
import { DesignMessages } from '../constants/message_texts.js'

//import ServerDocumentApi      from '../apiServer/server/apiDocument.js';


// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentView, updateUserMessage} from '../redux/actions'

// =====================================================================================================================
// Client API for Design Items
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================
class ClientDocumentServices {

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User exports Design Version as word doc -------------------------------------------------------------------------
    exportWordDocument(designId, designVersionId){

        // // Client validation
        // let result = DesignValidationApi.validateAddDesign(userRole);
        //
        // if(result !== Validation.VALID){
        //     // Business validation failed - show error on screen
        //     store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
        //     return {success: false, message: result};
        // }

        // Real action call - server actions
        Meteor.call('document.exportWordDocument', designId, designVersionId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 1: ' + err.reason + '.  Contact support if persists!');
            } else {
                // // Remove Design client actions:
                //
                // // Show action success on screen
                // store.dispatch(updateUserMessage({
                //     messageType: MessageType.INFO,
                //     messageText: DesignMessages.MSG_DESIGN_ADDED
                // }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };
}

export default new ClientDocumentServices();