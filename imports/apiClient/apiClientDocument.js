// == IMPORTS ==========================================================================================================

// Ultrawide Collections

// Ultrawide Services
import { UserSettingValue} from '../constants/constants.js';

// REDUX services
import store from '../redux/store'
import {setDocSectionTextOption, setDocFeatureTextOption, setDocNarrativeTextOption, setDocScenarioTextOption} from '../redux/actions'

// =====================================================================================================================
// Client API for Design Items
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================
class ClientDocumentServices {

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User exports Design Version as word doc -------------------------------------------------------------------------
    exportWordDocument(designId, designVersionId, options){

        // // Client validation
        // let result = DesignValidationApi.validateAddDesign(userRole);
        //
        // if(result !== Validation.VALID){
        //     // Business validation failed - show error on screen
        //     store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
        //     return {success: false, message: result};
        // }

        // Update store with latest user options
        if(options.includeSectionText){
            store.dispatch(setDocSectionTextOption(UserSettingValue.DOC_INCLUDE_TEXT))
        } else {
            store.dispatch(setDocSectionTextOption(UserSettingValue.DOC_EXCLUDE_TEXT))
        }

        if(options.includeFeatureText){
            store.dispatch(setDocFeatureTextOption(UserSettingValue.DOC_INCLUDE_TEXT))
        } else {
            store.dispatch(setDocFeatureTextOption(UserSettingValue.DOC_EXCLUDE_TEXT))
        }

        if(options.includeNarrativeText){
            store.dispatch(setDocNarrativeTextOption(UserSettingValue.DOC_INCLUDE_TEXT))
        } else {
            store.dispatch(setDocNarrativeTextOption(UserSettingValue.DOC_EXCLUDE_TEXT))
        }

        if(options.includeScenarioText){
            store.dispatch(setDocScenarioTextOption(UserSettingValue.DOC_INCLUDE_TEXT))
        } else {
            store.dispatch(setDocScenarioTextOption(UserSettingValue.DOC_EXCLUDE_TEXT))
        }

        // Real action call - server actions
        Meteor.call('document.exportWordDocument', designId, designVersionId, options, (err, result) => {

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