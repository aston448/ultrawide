
import { Mongo } from 'meteor/mongo';

export const AppGlobal = new Mongo.Collection('appGlobal');

let Schema = new SimpleSchema({
    versionKey:         {type: String},
    appVersion:         {type: Number},     // Version of Ultrawide
    dataVersion:        {type: Number},     // DB Version of Ultrawide
    versionDate:        {type: String},     // Date this version introduced
    dataStore:          {type: String}      // Location of Ultrawide Server data
});

AppGlobal.attachSchema(Schema);

// Publish
if(Meteor.isServer){
    Meteor.publish('appGlobal', function appGlobalDataPublication(){
        return AppGlobal.find({});
    })
}
