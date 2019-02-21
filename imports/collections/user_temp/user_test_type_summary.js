
import { Mongo } from 'meteor/mongo';

export const UserTestTypeSummary = new Mongo.Collection('userTestTypeSummary');

let Schema = new SimpleSchema({
    // Identity
    userId:                     {type: String, index: 1},               // Meteor user id
    designVersionId:            {type: String, index: 1},               // Current design version
    designScenarioReferenceId:  {type: String, index: 1},               // Reference to matching scenario in design
    testType:                   {type: String, index: 1},               // Acceptance / Integration / Unit
    // Data
    totalExpectations:          {type: Number, defaultValue: 0},        // Expected tests of this type
    totalTests:                 {type: Number, defaultValue: 0},        // Actual tests of this type found
    totalPassing:               {type: Number, defaultValue: 0},        // Passing tests of this type found
    totalFailing:               {type: Number, defaultValue: 0},        // Failing tests of this type found
    totalMissing:               {type: Number, defaultValue: 0},        // Missing tests of this type
});

UserTestTypeSummary.attachSchema(Schema);

// Publish
if(Meteor.isServer){

    Meteor.publish('userTestTypeSummary', function userTestTypeSummaryPublication(userId, designVersionId){
        return UserTestTypeSummary.find({userId: userId, designVersionId: designVersionId});
    });
}