
import { saveDesignComponentText, saveDesignUpdateComponentText } from '../apiValidatedMethods/text_editor_methods.js'

// =====================================================================================================================
// Server API for teh Text Editor
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================
class ServerTextEditorApi {

    saveDesignComponentText(userRole, designComponentId, newRawText, callback){

        saveDesignComponentText.call(
            {
                userRole: userRole,
                designComponentId: designComponentId,
                newRawText: newRawText
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    saveDesignUpdateComponentText(userRole, designUpdateComponentId, newRawText, callback){

        saveDesignUpdateComponentText.call(
            {
                userRole: userRole,
                designUpdateComponentId: designUpdateComponentId,
                newRawText: newRawText
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };


}

export default new ServerTextEditorApi();
