
//import { Validation } from '../constants/validation_errors.js'

//import UserSettingsValidationApi        from '../apiValidation/apiUserSettingsValidation.js';
import UserSettingsServices             from '../servicers/configure/user_setting_services.js';

//======================================================================================================================
//
// Meteor Validated Methods for User Settings
//
//======================================================================================================================

export const saveSetting = new ValidatedMethod({

    name: 'userSettings.saveSetting',

    validate: new SimpleSchema({
        userId:         {type: String},
        settingName:    {type: String},
        newValue:       {type: String}
    }).validator(),

    run({userId, settingName, newValue}){

        try {
            UserSettingsServices.saveUserSetting(userId, settingName, newValue);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.error, e.stack)
        }
    }
});
