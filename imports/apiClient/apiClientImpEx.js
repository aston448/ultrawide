// == IMPORTS ==========================================================================================================

// Ultrawide Services
import { ServerImpExApi }     from '../apiServer/apiImpEx.js';
import { ImpExValidationApi }  from '../apiValidation/apiImpExValidation.js';

import { MessageType } from '../constants/constants.js';
import { Validation } from '../constants/validation_errors.js';
import { ImpexMessages } from '../constants/message_texts.js'

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentView, updateUserMessage} from '../redux/actions'
import {DesignData} from "../data/design/design_db";


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

class ClientImpExServicesClass{

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User chooses to make a backup of a Design -----------------------------------------------------------------------
    backupDesign(designId, userRole){

        // Client validation
        let result = ImpExValidationApi.validateBackupDesign(userRole, designId);

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
        let result = ImpExValidationApi.validateRestoreDesign(userId);

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
        let result = ImpExValidationApi.validateArchiveDesign(userId, designId);

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

    rebaseDesignVersion(designId, userId){

        // TEMP - Design Version is always the latest design version
        const dvs = DesignData.getDesignVersions(designId);
        let latestDvId = 'NONE';
        let maxIndex = -1;

        console.log('Found %i DVs', dvs.length);

        dvs.forEach((dv) => {
            if(dv.designVersionIndex > maxIndex){
                console.log('Updating index %i', dv.designVersionIndex);
                maxIndex = dv.designVersionIndex;
                latestDvId = dv._id
            }
        });

        // Client validation
        let result = ImpExValidationApi.validateRebaseDesignVersion(userId);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        console.log('Rebasing DV %s', latestDvId);

        // Real action call - server actions
        ServerImpExApi.rebaseDesignVersion(designId, latestDvId, userId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Rebase Design client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: ImpexMessages.MSG_DESIGN_REBASE
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

export const ClientImpExServices = new ClientImpExServicesClass();

