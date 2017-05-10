
import { Mongo } from 'meteor/mongo';

export const AppGlobalData = new Mongo.Collection('appGlobalData');

let Schema = new SimpleSchema({
    versionKey:         {type: String},
    appVersion:         {type: Number},     // Version of Ultrawide
    dataVersion:        {type: Number},     // DB Version of Ultrawide
    versionDate:        {type: String},     // Date this version introduced
    dataStore:          {type: String}      // Location of Ultrawide Server data
});

AppGlobalData.attachSchema(Schema);

// Publish
if(Meteor.isServer){
    Meteor.publish('appGlobalData', function appGlobalDataPublication(){
        return AppGlobalData.find({});
    })
}
