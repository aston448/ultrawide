/**
 * User Acceptance Test Results.
 */

import { Mongo } from 'meteor/mongo';

export const UserAccTestResults = new Mongo.Collection('userAccTestResults');

let Schema = new SimpleSchema({
    userId:             {type: String},                 // This user's results
    testName:           {type: String},                 // Maps to Scenario name
    testFullName:       {type: String},                 // For mocha type tests
    testResult:         {type: String},                 // Pass, Fail, Pending
    testError:          {type: String, optional: true}, // If fail
    testErrorReason:    {type: String, optional: true}, // If fail
    testDuration:       {type: String, optional: true}, // If present
    stackTrace:         {type: String, optional: true}, // If fail
});

UserAccTestResults.attachSchema(Schema);

// Publish
if(Meteor.isServer){

    Meteor.publish('userAccTestResults', function userAccTestResults(){
        return UserAccTestResults.find({});
    })
}
