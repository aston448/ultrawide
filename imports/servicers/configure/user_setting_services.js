
// Ultrawide Services
import { log } from '../../common/utils.js';
import { LogLevel} from '../../constants/constants.js';

// Data Access
import UserSettingData from '../../service_modules_db/configure/user_setting_db.js';

//======================================================================================================================
//
// Server Code for Test Output Locations.
//
// Methods called directly by Server API
//
//======================================================================================================================

class UserSettingServices {


    saveUserSetting(userId, settingName, newValue){

        if (Meteor.isServer) {

            const setting = UserSettingData.getUserSettingByName(userId, settingName);


            if(setting){

                UserSettingData.updateUserSettingValue(setting._id, newValue);

            } else {

                UserSettingData.insertNewUserSetting(userId, settingName, newValue);

            }
        }
    }
}

export default new UserSettingServices();