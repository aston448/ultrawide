
import {
    saveSetting
} from '../apiValidatedMethods/user_settings_methods.js'

// =====================================================================================================================
// Server API for User Settings
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================

class ServerUserSettingsApiClass {

    saveSetting(userId, settingName, newValue, callback) {

        saveSetting.call(
            {
                userId: userId,
                settingName: settingName,
                newValue: newValue
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };
}

export const ServerUserSettingsApi = new ServerUserSettingsApiClass();

