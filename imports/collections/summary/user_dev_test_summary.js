import { Mongo } from 'meteor/mongo';

export const UserDevTestSummary = new Mongo.Collection('userDevTestSummary');

let Schema = new SimpleSchema({
    // Design Identity
    userId:                         {type: String},                         // Meteor user id - must be a user
    designVersionId:                {type: String},                         // Must be a design version
    scenarioReferenceId:            {type: String, defaultValue: 'NONE'},   // Set if known in Design
    featureReferenceId:             {type: String, defaultValue: 'NONE'},   // Set if known in Design
    accTestStatus:                  {type: String},                         // If linked, latest acceptance test results status
    intTestStatus:                  {type: String},                         // If linked, latest integration test results status
    unitTestPassCount:              {type: Number, defaultValue: 0},        // Number of module tests passing
    unitTestFailCount:              {type: Number, defaultValue: 0},        // Number of module tests failing
    featureScenarioCount:           {type: Number, defaultValue: 0},
    featureExpectedTestCount:       {type: Number, defaultValue: 0},
    featureFulfilledTestCount:      {type: Number, defaultValue: 0},
    featureSummaryStatus:           {type: String},                         // Summary of all tests in Feature
    featureTestPassCount:           {type: Number, defaultValue: 0},        // Number of tests passing in whole feature
    featureTestFailCount:           {type: Number, defaultValue: 0},        // Number of tests failing in whole feature
    featureNoTestCount:             {type: Number, defaultValue: 0},        // Number of scenarios with no tests
    featureAllTestsFulfilled:       {type: Boolean, defaultValue: false},   // Set to TRUE when expected tests = fulfilled tests
    duFeatureScenarioCount:         {type: Number, defaultValue: 0},
    duFeatureExpectedTestCount:     {type: Number, defaultValue: 0},
    duFeatureFulfilledTestCount:    {type: Number, defaultValue: 0},
    duFeatureSummaryStatus:         {type: String},                         // Summary of all tests in Feature for current DU
    duFeatureTestPassCount:         {type: Number, defaultValue: 0},        // Number of tests passing in whole feature for current DU
    duFeatureTestFailCount:         {type: Number, defaultValue: 0},        // Number of tests failing in whole feature for current DU
    duFeatureNoTestCount:           {type: Number, defaultValue: 0},        // Number of scenarios with no tests for current DU
    wpFeatureScenarioCount:         {type: Number, defaultValue: 0},
    wpFeatureExpectedTestCount:     {type: Number, defaultValue: 0},
    wpFeatureFulfilledTestCount:    {type: Number, defaultValue: 0},
    wpFeatureSummaryStatus:         {type: String},                         // Summary of all tests in Feature for current WP
    wpFeatureTestPassCount:         {type: Number, defaultValue: 0},        // Number of tests passing in whole feature for current WP
    wpFeatureTestFailCount:         {type: Number, defaultValue: 0},        // Number of tests failing in whole feature for current WP
    wpFeatureNoTestCount:           {type: Number, defaultValue: 0},        // Number of scenarios with no tests for current WP

});

UserDevTestSummary.attachSchema(Schema);


// Publish
if(Meteor.isServer){

    Meteor.publish('userDevTestSummary', function userDevTestSummaryDataPublication(userId){
        return UserDevTestSummary.find({userId: userId});
    })
}

