/**
 * User Acceptance Test Results.
 */

import { Mongo } from 'meteor/mongo';

// TODO - update this to test results standard when adding ACC test functionality

export const UserAccTestResults = new Mongo.Collection('userAccTestResults');

let Schema = new SimpleSchema({
    userId:             {type: String},                 // This user's results
    componentType:      {type: String},                 // Scenario or Step
    featureName:        {type: String},
    scenarioName:       {type: String},                 // 
    stepName:           {type: String},
    testResult:         {type: String},                 // Pass, Fail, Pending
    testError:          {type: String, optional: true}, // If fail
    testErrorReason:    {type: String, optional: true}, // If fail
    testDuration:       {type: String, optional: true}, // If present
    stackTrace:         {type: String, optional: true}, // If fail
});

UserAccTestResults.attachSchema(Schema);

// Publish
if(Meteor.isServer){

    Meteor.publish('userAccTestResults', function userAccTestResults(userId){
        return UserAccTestResults.find({userId: userId});
    })
}
