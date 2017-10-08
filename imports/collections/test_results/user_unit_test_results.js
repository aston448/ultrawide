// /**
//  * User Module Test Results.
//  */
//
// import { Mongo } from 'meteor/mongo';
//
// import { TestDataStatus } from '../../constants/constants.js';
//
// export const UserUnitTestResults = new Mongo.Collection('userUnitTestResults');
//
// let Schema = new SimpleSchema({
//     userId:             {type: String},                 // This user's results
//     testFullName:       {type: String},                 // for results where suite / group not separated
//     testSuite:          {type: String},                 // e.g a Module
//     testGroup:          {type: String},                 // Scenario if multiple tests
//     testName:           {type: String},                 // Test if multiple tests or Scenario if just one test
//     testResult:         {type: String},                 // Pass, Fail, Pending
//     testError:          {type: String, optional: true}, // If fail
//     testErrorReason:    {type: String, optional: true}, // If fail
//     testDuration:       {type: String, optional: true}, // If present
//     testStackTrace:     {type: String, optional: true}, // If fail
// });
//
// UserUnitTestResults.attachSchema(Schema);
//
// // Publish
// if(Meteor.isServer){
//
//     Meteor.publish('userUnitTestResults', function userUnitTestResults(userId){
//         return UserUnitTestResults.find({userId: userId});
//     })
// }
