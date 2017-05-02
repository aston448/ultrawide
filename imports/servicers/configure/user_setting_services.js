
// Ultrawide Collections
import { UserSettings }      from '../../collections/configure/user_settings.js'


// Ultrawide Services
import { log } from '../../common/utils.js';
import { TestLocationType, ComponentType, LogLevel} from '../../constants/constants.js';


//======================================================================================================================
//
// Server Code for Test Output Locations.
//
// Methods called directly by Server API
//
//======================================================================================================================

class UserSettingServices {

    importUserSetting(setting, userId) {

        if (Meteor.isServer) {

            const settingId = UserSettings.insert(
                {
                    userId:         userId,
                    settingName:    setting.settingName,
                    settingValue:   setting.settingValue
                }
            );

            return settingId;
        }
    };

    saveUserSetting(userId, settingName, newValue){

        if (Meteor.isServer) {

            const setting = UserSettings.findOne({
                userId:         userId,
                settingName:    settingName
            });

            if(setting){

                UserSettings.update(
                    {_id: setting._id},
                    {
                        $set:{
                            settingValue: newValue
                        }
                    }
                );

            } else {

                UserSettings.insert(
                    {
                        userId:         userId,
                        settingName:    settingName,
                        settingValue:   newValue
                    }
                );
            }
        }
    }
}

export default new UserSettingServices();