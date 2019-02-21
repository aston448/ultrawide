
import { Mongo } from 'meteor/mongo';

export const UserScenarioTestSummary = new Mongo.Collection('userScenarioTestSummary');

let Schema = new SimpleSchema({
    // Identity
    userId:                     {type: String, index: 1},               // Meteor user id
    designVersionId:            {type: String, index: 1},               // Current design version
    designFeatureReferenceId:   {type: String, index: 1},               // Feature to which scenario belongs
    designScenarioReferenceId:  {type: String, index: 1},               // Reference to matching scenario in design
    // Data
    totalExpectations:          {type: Number, defaultValue: 0},        // Expected tests for this Scenario
    totalTests:                 {type: Number, defaultValue: 0},        // Actual tests for this Scenario
    totalPassing:               {type: Number, defaultValue: 0},        // Passing tests for this Scenario
    totalFailing:               {type: Number, defaultValue: 0},        // Failing tests for this Scenario
    totalMissing:               {type: Number, defaultValue: 0},        // Missing tests for this Scenario
    totalAccExpectations:       {type: Number, defaultValue: 0},        // Expected Acc tests for this Scenario
    totalAccTests:              {type: Number, defaultValue: 0},        // Actual Acc tests for this Scenario
    totalAccPassing:            {type: Number, defaultValue: 0},        // Passing Acc tests for this Scenario
    totalAccFailing:            {type: Number, defaultValue: 0},        // Failing Acc tests for this Scenario
    totalAccMissing:            {type: Number, defaultValue: 0},        // Missing Acc tests for this Scenario
    totalIntExpectations:       {type: Number, defaultValue: 0},        // Expected Int tests for this Scenario
    totalIntTests:              {type: Number, defaultValue: 0},        // Actual Int tests for this Scenario
    totalIntPassing:            {type: Number, defaultValue: 0},        // Passing Int tests for this Scenario
    totalIntFailing:            {type: Number, defaultValue: 0},        // Failing Int tests for this Scenario
    totalIntMissing:            {type: Number, defaultValue: 0},        // Missing Int tests for this Scenario
    totalUnitExpectations:      {type: Number, defaultValue: 0},        // Expected Unit tests for this Scenario
    totalUnitTests:             {type: Number, defaultValue: 0},        // Actual Unit tests for this Scenario
    totalUnitPassing:           {type: Number, defaultValue: 0},        // Passing Unit tests for this Scenario
    totalUnitFailing:           {type: Number, defaultValue: 0},        // Failing Unit tests for this Scenario
    totalUnitMissing:           {type: Number, defaultValue: 0},        // Missing Unit tests for this Scenario
});

UserScenarioTestSummary.attachSchema(Schema);

// Publish
if(Meteor.isServer){

    Meteor.publish('userScenarioTestSummary', function userScenarioTestSummaryPublication(userId, designVersionId){
        return UserScenarioTestSummary.find({userId: userId, designVersionId: designVersionId});
    });
}