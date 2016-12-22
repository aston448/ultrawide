/**
 * User Acceptance Test Results.
 */

import { Mongo } from 'meteor/mongo';

export const UserModTestResults = new Mongo.Collection('userModTestResults');

let Schema = new SimpleSchema({
    userId:             {type: String},                 // This user's results
    testName:           {type: String},                 // Tests within Scenario scope
    testFullName:       {type: String},                 // Includes Scenario Name
    testResult:         {type: String},                 // Pass, Fail, Pending
    testError:          {type: String, optional: true}, // If fail
    testErrorReason:    {type: String, optional: true}, // If fail
    testDuration:       {type: String, optional: true}, // If present
    stackTrace:         {type: String, optional: true}, // If fail
});

UserModTestResults.attachSchema(Schema);

// Publish
if(Meteor.isServer){

    Meteor.publish('userModTestResults', function userModTestResults(){
        return UserModTestResults.find({});
    })
}
