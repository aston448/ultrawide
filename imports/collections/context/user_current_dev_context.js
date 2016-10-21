
import { Mongo } from 'meteor/mongo';

export const UserCurrentDevContext = new Mongo.Collection('userCurrentDevContext');

// This represents the current work package under development by a Developer

let Schema = new SimpleSchema({
    userId:                 {type: String},                         // Meteor user id
    designId:               {type: String, defaultValue: 'NONE'},   // Current Design
    designVersionId:        {type: String, defaultValue: 'NONE'},   // Current design version
    workPackageId:          {type: String, defaultValue: 'NONE'},   // Current work package
    featureFilesLocation:   {type: String, defaultValue: 'NONE'},   // Location of feature files in current user build
});

UserCurrentDevContext.attachSchema(Schema);

// Publish
if(Meteor.isServer){
    Meteor.publish('userCurrentDevContext', function userCurrentDevContextPublication(){
        return UserCurrentDevContext.find({});
    })
}