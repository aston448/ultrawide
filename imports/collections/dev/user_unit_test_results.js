/**
 * User Module Test Results.
 */

import { Mongo } from 'meteor/mongo';

export const UserUnitTestResults = new Mongo.Collection('userUnitTestResults');

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

UserUnitTestResults.attachSchema(Schema);

// Publish
if(Meteor.isServer){

    Meteor.publish('userUnitTestResults', function userUnitTestResults(){
        return UserUnitTestResults.find({});
    })
}
