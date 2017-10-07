// == IMPORTS ==========================================================================================================

// Ultrawide Services
import { UserSettingValue, MessageType }    from '../constants/constants.js';
import { UserSettingMessages }              from '../constants/message_texts.js'

import ServerUserSettingsApi                from '../apiServer/apiUserSettings';

// Data Access
import UserSettingsData                     from '../data/configure/user_setting_db.js';

// REDUX services
import store from '../redux/store'
import {setCurrentWindowSize, setIntTestOutputDir, updateUserMessage} from '../redux/actions'

// =====================================================================================================================
// Client API for User Management
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================
class ClientUserSettingServices {

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User Saves a Setting --------------------------------------------------------------------------------------------

    saveUserSetting(settingName, newValue){

        const userContext = store.getState().currentUserItemContext;

        // Real action call - server actions
        ServerUserSettingsApi.saveSetting(userContext.userId, settingName, newValue, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: UserSettingMessages.MSG_USER_SETTING_SAVED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    }

    // LOCAL CLIENT ACTIONS ============================================================================================

    // Get a setting value ---------------------------------------------------------------------------------------------

    getUserSetting(settingName){

        const userContext = store.getState().currentUserItemContext;

        const setting = UserSettingsData.getUserSettingByName(userContext.userId, settingName);

        if(setting){
            return setting.settingValue;
        } else {
            return null;
        }
    }


    // Get specific settings related data ------------------------------------------------------------------------------
    getWindowSizeClassForDesignEditor(){

        const windowSize = store.getState().currentWindowSize;

        switch(windowSize){
            case UserSettingValue.SCREEN_SIZE_SMALL:
                return 'design-editor-small';
            case UserSettingValue.SCREEN_SIZE_LARGE:
                return 'design-editor-large';

        }
    }

    getWindowSizeClassForDesignItemList(){

        const windowSize = store.getState().currentWindowSize;

        switch(windowSize){
            case UserSettingValue.SCREEN_SIZE_SMALL:
                return 'scroll-col-small';
            case UserSettingValue.SCREEN_SIZE_LARGE:
                return 'scroll-col-large';
        }
    }


    // Set specific settings related data ------------------------------------------------------------------------------

    setWindowSize(newSize){
        store.dispatch(setCurrentWindowSize(newSize));
    }

    setIntTestOutputDir(newPath){
        store.dispatch(setIntTestOutputDir(newPath));
    }
}

export default new ClientUserSettingServices();


