import { Mongo } from 'meteor/mongo';

export const UserUnitTestResults = new Mongo.Collection('userUnitTestResults');
export const UserIntegrationTestResults = new Mongo.Collection('userIntegrationTestResults');
export const UserAcceptanceTestResults = new Mongo.Collection('userAcceptanceTestResults');

// All test results have the same structure so there can be a common way of reporting them

let Schema = new SimpleSchema({
    userId:             {type: String, index: -1},      // This user's results
    testFullName:       {type: String, index: 1},       // for results where suite / group not separated
    testSuite:          {type: String},                 // e.g a Module
    testGroup:          {type: String},                 // Scenario if multiple tests
    testName:           {type: String},                 // Test if multiple tests or Scenario if just one test
    testResult:         {type: String},                 // Pass, Fail, Pending
    testError:          {type: String, optional: true}, // If fail
    testErrorReason:    {type: String, optional: true}, // If fail
    testDuration:       {type: String, optional: true}, // If present
    testStackTrace:     {type: String, optional: true}, // If fail
});


// Publish
UserUnitTestResults.attachSchema(Schema);

if(Meteor.isServer){

    Meteor.publish('userUnitTestResults', function userUnitTestResults(userId){
        return UserUnitTestResults.find({userId: userId});
    })
}


UserIntegrationTestResults.attachSchema(Schema);

if(Meteor.isServer){

    Meteor.publish('userIntegrationTestResults', function userIntegrationTestResults(userId){
        return UserIntegrationTestResults.find({userId: userId});
    })
}


UserAcceptanceTestResults.attachSchema(Schema);

if(Meteor.isServer){

    Meteor.publish('userAcceptanceTestResults', function userAcceptanceTestResults(userId){
        return UserAcceptanceTestResults.find({userId: userId});
    })
}

