import { Mongo } from 'meteor/mongo';

export const UserTestExpectationResults = new Mongo.Collection('userTestExpectationResults');

let Schema = new SimpleSchema({
    // Identity
    userId:                     {type: String, index: 1},               // Meteor user id
    designVersionId:            {type: String, index: 1},               // Current design version
    designScenarioReferenceId:  {type: String, index: 1},               // Reference to matching scenario in design
    scenarioTestExpectationId:  {type: String, index: 1},               // Test Expectation - for test type amd permutation
    testType:                   {type: String},
    // Data
    permValue:                  {type: String},
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

UserTestExpectationResults.attachSchema(Schema);

// Publish
if(Meteor.isServer){

    Meteor.publish('userTestExpectationResults', function userTestExpectationResultsPublication(userId, designVersionId){
        return UserTestExpectationResults.find({userId: userId, designVersionId: designVersionId});
    });
}