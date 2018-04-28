// == IMPORTS ==========================================================================================================

// Ultrawide Services
import { MessageType } from '../constants/constants.js';
import { Validation } from '../constants/validation_errors.js';
import { DomainDictionaryMessages } from '../constants/message_texts.js';

import ClientDomainDictionaryServices   from '../service_modules/design/client_domain_dictionary.js';
import DomainDictionaryValidationApi    from '../apiValidation/apiDomainDictionaryValidation.js';
import ServerDomainDictionaryApi        from '../apiServer/apiDomainDictionary.js';

// Data Access
import { DesignVersionData }                from '../data/design/design_version_db.js';

// REDUX services
import store from '../redux/store'
import {updateUserMessage} from '../redux/actions';

// =====================================================================================================================
// Client API for Domain Dictionary
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================

class ClientDomainDictionaryApi {

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // Designer adds a new Domain Dictionary Term ----------------------------------------------------------------------
    addNewDictionaryTerm(userRole, view, mode, designId, designVersionId) {

        // Client validation
        let result = DomainDictionaryValidationApi.validateAddNewTerm(userRole, view, mode);

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDomainDictionaryApi.addNewTerm(userRole, view, mode, designId, designVersionId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Remove Design client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DomainDictionaryMessages.MSG_DICTIONARY_ENTRY_CREATED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // Designer sets or changes a term name ----------------------------------------------------------------------------
    updateDictionaryTerm(userRole, view, mode, termId, termTextNew) {

        // Client validation
        let result = DomainDictionaryValidationApi.validateUpdateTermName(userRole, view, mode, termId, termTextNew);

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDomainDictionaryApi.updateTermName(userRole, view, mode, termId, termTextNew, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DomainDictionaryMessages.MSG_DICTIONARY_TERM_UPDATED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // Designer sets or updates a term definition ----------------------------------------------------------------------
    updateDictionaryTermDefinition(userRole, view, mode, termId, termDefinitionTextRaw) {

        // Client validation
        let result = DomainDictionaryValidationApi.validateUpdateTermDefinition(userRole, view, mode);

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDomainDictionaryApi.updateTermDefinition(userRole, view, mode, termId, termDefinitionTextRaw, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DomainDictionaryMessages.MSG_DICTIONARY_DEF_UPDATED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // Designer removes a term from the Dictionary ---------------------------------------------------------------------
    removeDictionaryTerm(userRole, view, mode, termId) {

        // Client validation
        let result = DomainDictionaryValidationApi.validateRemoveTerm(userRole, view, mode);

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDomainDictionaryApi.removeTerm(userRole, view, mode, termId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DomainDictionaryMessages.MSG_DICTIONARY_TERM_REMOVED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // LOCAL CLIENT ACTIONS ============================================================================================

    // Get function to decorate Feature Narratives
    getNarrativeDecoratorFunction(){

        return ClientDomainDictionaryServices.getNarrativeDecoratorFunction();

    }

    // Get function to highlight Domain Terms in various test fields
    getDomainTermDecoratorFunction(designVersionId) {

        // Get the current list of Domain Terms
        const domainTerms = DesignVersionData.getDomainDictionaryEntries(designVersionId);

        return ClientDomainDictionaryServices.getDomainTermDecoratorFunction(domainTerms)

    };

}

export default new ClientDomainDictionaryApi();
