
import { Mongo } from 'meteor/mongo';

export const UserMashScenarioTests = new Mongo.Collection('userMashScenarioTests');

let Schema = new SimpleSchema({
    // Identity
    userId:                     {type: String},                         // Meteor user id
    designVersionId:            {type: String},                         // Current design version
    designScenarioReferenceId:  {type: String, defaultValue: 'NONE'},   // Reference to matching scenario in design (if any)
    designAspectReferenceId:    {type: String, defaultValue: 'NONE'},   // Reference to parent Feature Aspect in design (if any)
    designFeatureReferenceId:   {type: String, defaultValue: 'NONE'},   // Reference to parent Feature in design (if any)
    testType:                   {type: String},                         // Type of test this result relates to
    // Data
    suiteName:                  {type: String},                         // Feature or Module
    groupName:                  {type: String, optional: true},         // Scenario or Group
    testName:                   {type: String},                         // Scenario or Test
    testFullName:               {type: String},                         // The original full name
    // Status
    testOutcome:                {type: String},                         // Pending / Pass / Fail
    testError:                  {type: String, optional: true},         // Error if Failure
    testErrorReason:            {type: String, optional: true},         // Error Reason if Failure
    testStack:                  {type: String, optional: true},         // Stack if Failure
    testDuration:               {type: Number, optional: true},         // Duration if test run successfully
});

UserMashScenarioTests.attachSchema(Schema);

// Publish
if(Meteor.isServer){

    Meteor.publish('userMashScenarioTests', function userMashScenarioTestsPublication(userId){
        return UserMashScenarioTests.find({userId: userId});
    })
}
