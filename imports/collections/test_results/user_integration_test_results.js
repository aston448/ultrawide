// import { Mongo } from 'meteor/mongo';
//
// export const UserIntegrationTestResults = new Mongo.Collection('userIntegrationTestResults');
//
// let Schema = new SimpleSchema({
//     userId:             {type: String},                 // This user's results
//     testFullName:       {type: String},                 // for results where suite / group not separated
//     testSuite:          {type: String},                 // e.g a Feature
//     testGroup:          {type: String},                 // Scenario if multiple tests
//     testName:           {type: String},                 // Test if multiple tests or Scenario if just one test
//     testResult:         {type: String},                 // Pass, Fail, Pending
//     testError:          {type: String, optional: true}, // If fail
//     testErrorReason:    {type: String, optional: true}, // If fail
//     testDuration:       {type: String, optional: true}, // If present
//     testStackTrace:     {type: String, optional: true}, // If fail
// });
//
// UserIntegrationTestResults.attachSchema(Schema);
//
// // Publish
// if(Meteor.isServer){
//
//     Meteor.publish('userIntegrationTestResults', function userIntegrationTestResults(userId){
//         return UserIntegrationTestResults.find({userId: userId});
//     })
// }

