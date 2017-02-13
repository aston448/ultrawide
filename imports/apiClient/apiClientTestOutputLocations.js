// == IMPORTS ==========================================================================================================

// Ultrawide Collections

// Ultrawide Services
import { ViewType, MessageType }            from '../constants/constants.js';
import { Validation }                       from '../constants/validation_errors.js';
import { TestOutputLocationMessages }       from '../constants/message_texts.js'

import ServerTestOutputLocationApi          from '../apiServer/apiTestOutputLocations';
import TestOutputLocationValidationApi      from '../apiValidation/apiTestOutputLocationValidation.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentView, updateUserMessage} from '../redux/actions'

// =====================================================================================================================
// Client API for Test Output Locations
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================
class ClientTestOutputLocationServices{

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User adds a new Location ----------------------------------------------------------------------------------------
    addLocation(userRole){

        // Client validation
        let result = TestOutputLocationValidationApi.validateAddLocation(userRole);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerTestOutputLocationApi.addLocation(userRole, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: TestOutputLocationMessages.MSG_LOCATION_ADDED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };


    // LOCAL CLIENT ACTIONS ============================================================================================


}

export default new ClientTestOutputLocationServices();

