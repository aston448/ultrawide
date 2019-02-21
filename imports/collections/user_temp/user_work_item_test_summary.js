
import { Mongo } from 'meteor/mongo';

export const UserWorkItemTestSummary = new Mongo.Collection('userWorkItemTestSummary');

let Schema = new SimpleSchema({
    // Identity
    userId:                     {type: String, index: 1},               // Meteor user id
    designVersionId:            {type: String, index: 1},               // Current design version
    workItemId:                 {type: String, index: 1},               // ID of WP, Iteration or Increment
    workItemType:               {type: String, index: 1},               // Iteration, DV Assigned, Unassigned etc
    // Data
    workItemName:               {type: String},
    totalFeatures:              {type: Number, defaultValue: 0},        // Features in this work item (where relevant)
    totalScenarios:             {type: Number, defaultValue: 0},        // Scenarios in this work item
    totalExpectations:          {type: Number, defaultValue: 0},        // Expected tests in this work item
    totalTests:                 {type: Number, defaultValue: 0},        // Actual tests in this work item
    totalPassing:               {type: Number, defaultValue: 0},        // Passing tests in this work item
    totalFailing:               {type: Number, defaultValue: 0},        // Failing tests in this work item
    totalMissing:               {type: Number, defaultValue: 0},        // Missing tests in this work item
    totalNoExpectations:        {type: Number, defaultValue: 0},        // Scenarios in this work item with no expectations
    totalScenarioAnomalies:     {type: Number, defaultValue: 0},        // Open Scenario Anomalies in this Work Item
    totalFeatureAnomalies:      {type: Number, defaultValue: 0},        // Open Feature Anomalies - only populated for whole DV
    totalScenariosUnassigned:   {type: Number, defaultValue: 0}         // Scenarios not assigned to a WP
});

UserWorkItemTestSummary.attachSchema(Schema);

// Publish
if(Meteor.isServer){

    Meteor.publish('userWorkItemTestSummary', function userWorkItemTestSummaryPublication(userId, designVersionId){
        return UserWorkItemTestSummary.find({userId: userId, designVersionId: designVersionId});
    });
}