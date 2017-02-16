import { Mongo } from 'meteor/mongo';


export const UserDevTestSummaryData = new Mongo.Collection('userDevTestSummaryData');

let Schema = new SimpleSchema({
    // Design Identity
    userId:                         {type: String},                         // Meteor user id - must be a user
    designVersionId:                {type: String},                         // Must be a design version
    designUpdateId:                 {type: String, defaultValue: 'NONE'},
    scenarioReferenceId:            {type: String, defaultValue: 'NONE'},   // Set if known in Design
    featureReferenceId:             {type: String, defaultValue: 'NONE'},   // Set if known in Design
    accTestStatus:                  {type: String},                         // If linked, latest acceptance test results status
    intTestStatus:                  {type: String},                         // If linked, latest integration test results status
    unitTestPassCount:               {type: Number, defaultValue: 0},        // Number of module tests passing
    unitTestFailCount:               {type: Number, defaultValue: 0},        // Number of module tests failing
    featureSummaryStatus:           {type: String},                         // Summary of all tests in Feature
    featureTestPassCount:           {type: Number, defaultValue: 0},        // Number of tests passing in whole feature
    featureTestFailCount:           {type: Number, defaultValue: 0},        // Number of tests failing in whole feature
    featureNoTestCount:             {type: Number, defaultValue: 0},        // Number of scenarios with no tests
});

UserDevTestSummaryData.attachSchema(Schema);


// Publish
if(Meteor.isServer){

    Meteor.publish('userDevTestSummaryData', function userDevTestSummaryDataPublication(userId){
        return UserDevTestSummaryData.find({userId: userId});
    })
}

