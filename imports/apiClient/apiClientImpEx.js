// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections

// Ultrawide Services
import ServerImpExApi      from '../apiServer/apiImpEx.js';
import BackupValidationApi  from '../apiValidation/apiImpExValidation.js';

import ImpexServices        from '../servicers/administration/impex_services.js';

import { ViewType, MessageType } from '../constants/constants.js';
import { Validation } from '../constants/validation_errors.js';
import { ImpexMessages } from '../constants/message_texts.js'

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentView, updateUserMessage} from '../redux/actions'


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Backup Services - Supports client calls for actions relating to backups, restores and archiving
//
// This class is the test entry point when not testing through the GUI.
// Most functions validate and return true / false according to business rules even if there is implicit validation in the GUI
// (E.g. buttons not being visible if action invalid)
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientImpExServices{

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User chooses to make a backup of a Design -----------------------------------------------------------------------
    backupDesign(designId, userRole){

        // Client validation
        let result = BackupValidationApi.validateBackupDesign(userRole);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerImpExApi.backupDesign(designId, userRole, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Remove Design client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: ImpexMessages.MSG_DESIGN_BACKUP
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User chooses to restore a Design from a backup ------------------------------------------------------------------
    restoreDesign(backupFileName, userId){

        // Client validation
        let result = BackupValidationApi.validateRestoreDesign(userId);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerImpExApi.restoreDesign(backupFileName, userId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Restore Design client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: ImpexMessages.MSG_DESIGN_RESTORE
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User chooses to archive a Design --------------------------------------------------------------------------------
    archiveDesign(designId, userId){

        // Client validation
        let result = BackupValidationApi.validateArchiveDesign(userId);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerImpExApi.archiveDesign(designId, userId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Restore Design client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: ImpexMessages.MSG_DESIGN_ARCHIVE
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    forceRemoveDesign(designId){
        Meteor.call('fixtures.forceRemoveDesign', designId);
    }


}

export default new ClientImpExServices();

