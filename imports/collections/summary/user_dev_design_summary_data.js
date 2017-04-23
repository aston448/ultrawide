import { Mongo } from 'meteor/mongo';


export const UserDevDesignSummaryData = new Mongo.Collection('userDevDesignSummaryData');

let Schema = new SimpleSchema({
    // Design Identity
    userId:                         {type: String},                         // Meteor user id - must be a user
    designVersionId:                {type: String},                         // Must be a design version
    designUpdateId:                 {type: String, defaultValue: 'NONE'},
    featureCount:                   {type: Number, defaultValue: 0},        // Number of features in Design
    scenarioCount:                  {type: Number, defaultValue: 0},        // Number of scenarios in Design
    untestedScenarioCount:          {type: Number, defaultValue: 0},        // Number of untested scenarios in Design
    failingScenarioCount:           {type: Number, defaultValue: 0},        // Number of scenarios with one or more failing tests
    passingScenarioCount:           {type: Number, defaultValue: 0},        // Number of scenarios with one or more passing tests and no failures
    unitTestPassCount:              {type: Number, defaultValue: 0},        // Number of unit tests passing
    unitTestFailCount:              {type: Number, defaultValue: 0},        // Number of unit tests failing
    unitTestPendingCount:           {type: Number, defaultValue: 0},        // Number of unit tests pending
    intTestPassCount:               {type: Number, defaultValue: 0},        // Number of integration tests passing
    intTestFailCount:               {type: Number, defaultValue: 0},        // Number of integration tests failing
    intTestPendingCount:            {type: Number, defaultValue: 0},        // Number of integration tests pending
    accTestPassCount:               {type: Number, defaultValue: 0},        // Number of acceptance tests passing
    accTestFailCount:               {type: Number, defaultValue: 0},        // Number of acceptance tests failing
    accTestPendingCount:            {type: Number, defaultValue: 0},        // Number of acceptance tests pending
});

UserDevDesignSummaryData.attachSchema(Schema);


// Publish
if(Meteor.isServer){

    Meteor.publish('userDevDesignSummaryData', function userDevDesignSummaryDataPublication(userId){
        return UserDevDesignSummaryData.find({userId: userId});
    })
}

