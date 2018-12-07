// == IMPORTS ==========================================================================================================

// Ultrawide Collections

// Ultrawide Services
import { ViewType, MessageType } from '../constants/constants.js';
import { Validation } from '../constants/validation_errors.js';
import { DesignAnomalyMessages } from '../constants/message_texts.js'

import { ServerDesignAnomalyApi }      from '../apiServer/apiDesignAnomaly.js';
import { DesignAnomalyValidationApi }  from '../apiValidation/apiDesignAnomalyValidation.js';
import { ClientUserContextServices } from '../apiClient/apiClientUserContext.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentView, updateUserMessage} from '../redux/actions'

// =====================================================================================================================
// Client API for Design Anomaly Items
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================
class ClientDesignAnomalyServicesClass{

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User adds a new Design Anomaly to Feature or Scenario -----------------------------------------------------------
    addNewDesignAnomaly(userRole, designVersionId, featureReferenceId, scenarioReferenceId){

        // Client validation
        let result = DesignAnomalyValidationApi.validateAddDesignAnomaly(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignAnomalyApi.addDesignAnomaly(userRole, designVersionId, featureReferenceId, scenarioReferenceId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 1: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignAnomalyMessages.MSG_DESIGN_ANOMALY_ADDED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };


    // User updates details of a Design Anomaly
    updateDesignAnomalyDetails(userRole, designAnomalyId, designAnomalyName, designAnomalyLink, rawText){

        // Client validation
        let result = DesignAnomalyValidationApi.validateUpdateDesignAnomaly(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignAnomalyApi.updateDesignAnomaly(userRole, designAnomalyId, designAnomalyName, designAnomalyLink, rawText, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 1: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignAnomalyMessages.MSG_DESIGN_ANOMALY_UPDATED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    }

    // User updates status of a Design Anomaly
    updateDesignAnomalyStatus(userRole, designAnomalyId, currentStatus, newStatus){

        // Client validation
        let result = DesignAnomalyValidationApi.validateUpdateDesignAnomalyStatus(userRole, currentStatus, newStatus);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignAnomalyApi.updateDesignAnomalyStatus(userRole, designAnomalyId, currentStatus, newStatus, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 1: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignAnomalyMessages.MSG_DESIGN_ANOMALY_STATUS_UPDATED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    }

    // User removes a new Design Anomaly from a Feature or Scenario ----------------------------------------------------
    removeDesignAnomaly(userRole, designAnomalyId, designAnomalyStatus){

        // Client validation
        let result = DesignAnomalyValidationApi.validateRemoveDesignAnomaly(userRole, designAnomalyStatus);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignAnomalyApi.removeDesignAnomaly(userRole, designAnomalyId, designAnomalyStatus, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 1: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignAnomalyMessages.MSG_DESIGN_ANOMALY_REMOVED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // LOCAL CLIENT ACTIONS ============================================================================================



}

export const ClientDesignAnomalyServices = new ClientDesignAnomalyServicesClass();
