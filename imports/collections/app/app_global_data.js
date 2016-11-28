
import { Mongo } from 'meteor/mongo';

export const AppGlobalData = new Mongo.Collection('appGlobalData');

let Schema = new SimpleSchema({
    appVersion:         {type: String},     // Version of Ultrawide
    dataVersion:        {type: String},     // DB Version of Ultrawide
    versionDate:        {type: Number},     // Date this version introduced: YYYYMMDD
});

AppGlobalData.attachSchema(Schema);

// Publish
if(Meteor.isServer){
    Meteor.publish('appGlobalData', function appGlobalDataPublication(){
        return AppGlobalData.find({});
    })
}
