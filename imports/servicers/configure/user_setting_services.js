
// Ultrawide Services
import { log } from '../../common/utils.js';
import { LogLevel} from '../../constants/constants.js';

// Data Access
import { UserSettingsData } from '../../data/configure/user_setting_db.js';

//======================================================================================================================
//
// Server Code for Test Output Locations.
//
// Methods called directly by Server API
//
//======================================================================================================================

class UserSettingsServicesClass {


    saveUserSetting(userId, settingName, newValue){

        if (Meteor.isServer) {

            //console.log('Saving setting ' + settingName + ' as ' + newValue);

            const setting = UserSettingsData.getUserSettingByName(userId, settingName);


            if(setting){

                UserSettingsData.updateUserSettingValue(setting._id, newValue);

            } else {

                UserSettingsData.insertNewUserSetting(userId, settingName, newValue);

            }
        }
    }
}

export const UserSettingsServices = new UserSettingsServicesClass();