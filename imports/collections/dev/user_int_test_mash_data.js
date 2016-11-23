/**
 * Represents the mash of data between the Design and the Dev Integration tests.  It is ephemeral data that is calculated as needed
 */

import { Mongo } from 'meteor/mongo';

import { DevTestTag } from '../../constants/constants.js';

export const UserIntTestMashData = new Mongo.Collection('userIntTestMashData');

let Schema = new SimpleSchema({
    // Design Identity
    userId:                         {type: String},                         // Meteor user id - must be a user
    designVersionId:                {type: String},                         // Must be a design version
    designUpdateId:                 {type: String, defaultValue: 'NONE'},
    workPackageId:                  {type: String, defaultValue: 'NONE'},
    designComponentId:              {type: String, defaultValue: 'NONE'},   // Set if known in Design
    mashComponentType:              {type: String},                         // Feature, Aspect, Scenario, Step
    designComponentName:            {type: String},
    designComponentReferenceId:     {type: String, defaultValue: 'NONE'},   // Set if known in Design
    designFeatureReferenceId:       {type: String, defaultValue: 'NONE'},   // Set if known in Design
    designFeatureAspectReferenceId: {type: String, defaultValue: 'NONE'},   // Set if known in Design and relevant
    designScenarioReferenceId:      {type: String, defaultValue: 'NONE'},   // Set if known in Design and relevant
    mashItemIndex:                  {type: Number, decimal: true, defaultValue: 100000},  // Used for ordering - follows ordering in Design
    mashItemFeatureIndex:           {type: Number, decimal: true, defaultValue: 100000},  // Used for ordering - follows ordering in Design
    // Actual Dev Tests
    suiteName:                      {type: String},                         // Name top level "describe" - should map to a Feature
    testGroupName:                  {type: String, optional: true},         // Name of second level "describe" (if any)
    testName:                       {type: String},                         // Text in the "it" part - should map to a Scenario
    // Status
    hasChildren:                    {type: Boolean, defaultValue: false},
    mashStatus:                     {type: String},                         // Whether linked to dev or not and where originating
    mashTestStatus:                 {type: String},                         // If linked, latest test results status
});

UserIntTestMashData.attachSchema(Schema);


// Publish
if(Meteor.isServer){

    Meteor.publish('userIntTestMashData', function userIntTestMashDataPublication(){
        return UserIntTestMashData.find({});
    })
}

