
import { Mongo } from 'meteor/mongo';

export const UserCurrentDevContext = new Mongo.Collection('userCurrentDevContext');

// This represents the current work package under development by a Developer

let Schema = new SimpleSchema({
    userId:                     {type: String},                         // Meteor user id
    featureFilesLocation:       {type: String, defaultValue: 'NONE'},   // Location of feature files in application being tested
    acceptanceTestResultsLocation: {type: String, defaultValue: 'NONE'},   // Location of JSON output file(s) for feature tests
});

UserCurrentDevContext.attachSchema(Schema);

// Publish
if(Meteor.isServer){
    Meteor.publish('userCurrentDevContext', function userCurrentDevContextPublication(){
        return UserCurrentDevContext.find({});
    })
}