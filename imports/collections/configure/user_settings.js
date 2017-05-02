import { Mongo } from 'meteor/mongo';

export const UserSettings = new Mongo.Collection('userSettings');

let Schema = new SimpleSchema({
    userId:                 {type: String},                                         // User with this config
    settingName:            {type: String},
    settingValue:           {type: String}
});

UserSettings.attachSchema(Schema);

// Publish Settings wanted
if(Meteor.isServer){
    Meteor.publish('userSettings', function userSettingsPublication(){
        return UserSettings.find({});
    })
}
