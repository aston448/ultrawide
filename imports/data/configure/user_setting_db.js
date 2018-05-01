
import { UserSettings }                 from '../../collections/configure/user_settings.js';

class UserSettingsDataClass{

    // INSERT ==========================================================================================================

    insertNewUserSetting(userId, settingName, newValue){

        return UserSettings.insert(
            {
                userId:         userId,
                settingName:    settingName,
                settingValue:   newValue
            }
        );
    }

    importUserSetting(setting, userId) {

        if (Meteor.isServer) {

            return UserSettings.insert(
                {
                    userId:         userId,
                    settingName:    setting.settingName,
                    settingValue:   setting.settingValue
                }
            );
        }
    };

    // SELECT ==========================================================================================================

    getUserSettingByName(userId, settingName){

        return UserSettings.findOne({
            userId: userId,
            settingName: settingName
        });
    }

    getAllUserSettings(){

        return UserSettings.find({}).fetch();
    }

    // UPDATE ==========================================================================================================

    updateUserSettingValue(settingId, newValue){

        return UserSettings.update(
            {_id: settingId},
            {
                $set:{
                    settingValue: newValue
                }
            }
        );
    }
}

export const UserSettingsData = new UserSettingsDataClass();