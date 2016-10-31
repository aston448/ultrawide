/**
 * Represents the mash of data between the Design and the Dev Build tests.  It is ephemeral data that is calculated as needed
 */

import { Mongo } from 'meteor/mongo';

import { DevTestTag } from '../../constants/constants.js';

export const UserDesignDevMashData = new Mongo.Collection('userDesignDevMashData');

let Schema = new SimpleSchema({
    // Identity
    userId:                         {type: String},                         // Meteor user id - must be a user
    designVersionId:                {type: String},                         // Must be a design version
    designUpdateId:                 {type: String, defaultValue: 'NONE'},
    workPackageId:                  {type: String, defaultValue: 'NONE'},
    designComponentId:              {type: String, defaultValue: 'NONE'},   // Set if known in Design
    mashComponentType:              {type: String},                         // Feature, Aspect, Scenario, Step
    designComponentReferenceId:     {type: String, defaultValue: 'NONE'},   // Set if known in Design
    designFeatureReferenceId:       {type: String, defaultValue: 'NONE'},   // Set if known in Design
    designFeatureAspectReferenceId: {type: String, defaultValue: 'NONE'},   // Set if known in Design and relevant
    designScenarioReferenceId:      {type: String, defaultValue: 'NONE'},   // Set if known in Design and relevant
    designScenarioStepReferenceId:  {type: String, defaultValue: 'NONE'},   // Set if known in Design and relevant
    mashItemIndex:                  {type: Number, decimal: true, defaultValue: 100000},  // Used for ordering - follows ordering in Design
    // Links
    devFeatureId:                   {type: String, defaultValue: 'NONE'},   // Id of the Dev Feature
    devScenarioId:                  {type: String, defaultValue: 'NONE'},   // Id of the Dev Scenario
    devScenarioStepId:              {type: String, defaultValue: 'NONE'},   // Id of the Dev Scenario Step
    // Data
    mashItemName:                   {type: String},                         // Name of Feature, Aspect, Scenario or Step Text
    mashItemTag:                    {type: String, defaultValue: DevTestTag.TEST_TEST},     // Test tag related to this item
    stepType:                       {type: String, defaultValue: 'NONE'},                   // For Scenario Steps used in Editor
    stepText:                       {type: String, defaultValue: 'NONE'},                   // For Scenario Steps used in Editor
    stepTextRaw:                    {type: Object, blackbox: true, optional: true},         // For Scenario Steps used in Editor
    // Status
    stepContext:                    {type: String, defaultValue: 'NONE'},   // For steps whether a Background or Scenario step
    mashStatus:                     {type: String},                         // Whether linked to dev or not and where originating
    mashTestStatus:                 {type: String},                         // If linked, latest test results status
});

UserDesignDevMashData.attachSchema(Schema);


// Publish
if(Meteor.isServer){

    Meteor.publish('userDesignDevMashData', function userDesignDevMashDataPublication(){
        return UserDesignDevMashData.find({});
    })
}

