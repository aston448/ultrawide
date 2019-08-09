// == IMPORTS ==========================================================================================================

// Ultrawide Services
import { MessageType }                      from '../constants/constants.js';
import { Validation }                       from '../constants/validation_errors.js';
import { DesignPermutationMessages }        from '../constants/message_texts.js'

import { ServerDesignPermutationApi }          from '../apiServer/apiDesignPermutation.js';
import { DesignPermutationValidationApi }      from '../apiValidation/apiDesignPermutationValidation.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserDesignPermutation, setCurrentUserPermutationValue, updateUserMessage} from '../redux/actions'


// =====================================================================================================================
// Client API for Design Permutations
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================
class ClientDesignPermutationServicesClass {

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User adds a new Permutation -------------------------------------------------------------------------------------
    addDesignPermutation(userRole, userContext){

        // Client validation
        let result = DesignPermutationValidationApi.validateAddPermutation(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignPermutationApi.addPermutation(userRole, userContext.designId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignPermutationMessages.MSG_PERMUTATION_ADDED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User removes a Permutation --------------------------------------------------------------------------------------
    removeDesignPermutation(userRole, permutationId){

        // Client validation
        let result = DesignPermutationValidationApi.validateRemovePermutation(userRole, permutationId);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignPermutationApi.removePermutation(userRole, permutationId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignPermutationMessages.MSG_PERMUTATION_REMOVED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User saves Permutation name -------------------------------------------------------------------------------------
    saveDesignPermutation(userRole, permutation){

        // Client validation
        let result = DesignPermutationValidationApi.validateSavePermutation(userRole, permutation);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignPermutationApi.savePermutation(userRole, permutation, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignPermutationMessages.MSG_PERMUTATION_SAVED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User adds a new Permutation Value -------------------------------------------------------------------------------
    addPermutationValue(userRole, permutationId, designVersionId){

        // Client validation
        let result = DesignPermutationValidationApi.validateAddPermutationValue(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignPermutationApi.addPermutationValue(userRole, permutationId, designVersionId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignPermutationMessages.MSG_PERMUTATION_VALUE_ADDED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User removes a Permutation Value -------------------------------------------------------------------------------
    removePermutationValue(userRole, permutationValueId){

        // Client validation
        let result = DesignPermutationValidationApi.validateRemovePermutationValue(userRole, permutationValueId);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignPermutationApi.removePermutationValue(userRole, permutationValueId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignPermutationMessages.MSG_PERMUTATION_VALUE_REMOVED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User saves Permutation Value name -------------------------------------------------------------------------------
    savePermutationValue(userRole, permutationValue){

        // Client validation
        let result = DesignPermutationValidationApi.validateSavePermutationValue(userRole, permutationValue);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignPermutationApi.savePermutationValue(userRole, permutationValue, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignPermutationMessages.MSG_PERMUTATION_VALUE_SAVED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // LOCAL CLIENT ACTIONS ============================================================================================

    // Keep track of the currently selected permutation
    selectDesignPermutation(permutationId){

        store.dispatch(setCurrentUserDesignPermutation(permutationId));

    };

    // Keep track of the currently selected permutation value
    selectPermutationValue(permutationValueId){

        store.dispatch(setCurrentUserPermutationValue(permutationValueId));

    };
}

export const ClientDesignPermutationServices = new ClientDesignPermutationServicesClass();

