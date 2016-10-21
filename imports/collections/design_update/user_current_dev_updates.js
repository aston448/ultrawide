
import { Mongo } from 'meteor/mongo';

export const UserCurrentDevUpdates = new Mongo.Collection('userCurrentDevUpdates');

// This represents the current design updates adopted by a developer for a design version

let Schema = new SimpleSchema({
    userId:                 {type: String},                         // Meteor user id
    userDevContextId:       {type: String, defaultValue: 'NONE'},   // Current design version being worked on
    designUpdateId:         {type: String, defaultValue: 'NONE'},   // Design Update adopted
});

UserCurrentDevUpdates.attachSchema(Schema);

// Publish
if(Meteor.isServer){
    Meteor.publish('userCurrentDevUpdates', function userCurrentDevUpdatesPublication(){
        return UserCurrentDevUpdates.find({});
    })
}
