// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections

// Ultrawide Services
import ServerBackupApi      from '../apiServer/apiBackup.js';
import BackupValidationApi  from '../apiValidation/apiBackupValidation.js';

import ImpexServices        from '../servicers/administration/impex_services.js';

import { ViewType, MessageType } from '../constants/constants.js';
import { Validation } from '../constants/validation_errors.js';
import { BackupMessages } from '../constants/message_texts.js'

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

class ClientBackupServices{

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User chooses to make a backup of a Design -----------------------------------------------------------------------
    backupDesign(designId, userRole){

        // Client validation
        let result = BackupValidationApi.validateBackupDesign(userRole);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call - server actions
        ServerBackupApi.backupDesign(designId, userRole, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Remove Design client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: BackupMessages.MSG_DESIGN_BACKUP
                }));
            }
        });

        // Indicate that business validation passed
        return true;
    };


    forceRemoveDesign(designId){
        Meteor.call('fixtures.forceRemoveDesign', designId);
    }


}

export default new ClientBackupServices();

