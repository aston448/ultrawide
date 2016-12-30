/**
 * Represents the specific feature mash data for Acceptance Test Scenario Steps.  It is ephemeral data that is calculated as needed
 */

import { Mongo } from 'meteor/mongo';

import { DevTestTag } from '../../constants/constants.js';

export const UserWorkPackageFeatureStepData = new Mongo.Collection('userWorkPackageFeatureStepData');

let Schema = new SimpleSchema({
    // Design Identity
    userId:                         {type: String},                                         // Meteor user id - must be a user
    designVersionId:                {type: String},                                         // Must be a design version
    designUpdateId:                 {type: String, defaultValue: 'NONE'},
    workPackageId:                  {type: String, defaultValue: 'NONE'},
    designComponentId:              {type: String, defaultValue: 'NONE'},                   // Set if known in Design
    mashComponentType:              {type: String},                                         // Feature, Aspect, Scenario, Step
    designComponentName:            {type: String},                                         // For Scenarios is the match for the test name
    designComponentReferenceId:     {type: String, defaultValue: 'NONE'},                   // Set if known in Design
    designFeatureReferenceId:       {type: String, defaultValue: 'NONE'},                   // Set if known in Design
    designFeatureAspectReferenceId: {type: String, defaultValue: 'NONE'},                   // Set if known in Design
    designScenarioReferenceId:      {type: String, defaultValue: 'NONE'},                   // Set if known in Design
    mashItemIndex:                  {type: Number, decimal: true, defaultValue: 100000},    // Used for ordering - follows ordering in Design
    mashItemFeatureIndex:           {type: Number, decimal: true, defaultValue: 100000},    // Used for ordering - follows ordering in Design
    // Step Data
    stepContext:                    {type: String},                                         // For steps whether a Background or Scenario step
    stepType:                       {type: String},                                         // For Scenario Steps used in Editor
    stepText:                       {type: String},                                         // For Scenario Steps used in Editor
    stepTextRaw:                    {type: Object, blackbox: true, optional: true},         // For Scenario Steps used in Editor
    // Test Data
    mashItemName:                   {type: String, optional: true},                         // Set to same as design component name if linked.  Also used for additional 'not in design' elements
    // Test Results
    accMashStatus:                  {type: String, optional: true},                         // Whether linked to dev or not and where originating - Acceptance Tests
    accMashTestStatus:              {type: String, optional: true},                         // If linked, latest test results status - Acceptance Tests
});

UserWorkPackageFeatureStepData.attachSchema(Schema);


// Publish
if(Meteor.isServer){

    Meteor.publish('userWorkPackageFeatureStepData', function userWorkPackageFeatureStepDataPublication(){
        return UserWorkPackageFeatureStepData.find({});
    })
}
