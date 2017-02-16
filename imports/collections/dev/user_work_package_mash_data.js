/**
 * Represents the mash of data between the Design and the Dev tests for a work package.  It is ephemeral data that is calculated as needed
 */

import { Mongo } from 'meteor/mongo';

import { DevTestTag } from '../../constants/constants.js';

export const UserWorkPackageMashData = new Mongo.Collection('userWorkPackageMashData');

let Schema = new SimpleSchema({
    // Design Identity
    userId:                         {type: String},                         // Meteor user id - must be a user
    designVersionId:                {type: String},                         // Must be a design version
    designUpdateId:                 {type: String, defaultValue: 'NONE'},
    workPackageId:                  {type: String, defaultValue: 'NONE'},
    designComponentId:              {type: String, defaultValue: 'NONE'},   // Set if known in Design
    mashComponentType:              {type: String},                         // Feature, Aspect, Scenario, Step
    designComponentName:            {type: String},                         // For Scenarios is the match for the test name
    designComponentReferenceId:     {type: String, defaultValue: 'NONE'},   // Set if known in Design
    designFeatureReferenceId:       {type: String, defaultValue: 'NONE'},   // Set if known in Design
    designFeatureAspectReferenceId: {type: String, defaultValue: 'NONE'},   // Set if known in Design and relevant
    designScenarioReferenceId:      {type: String, defaultValue: 'NONE'},   // Set if known in Design and relevant
    mashItemIndex:                  {type: Number, decimal: true, defaultValue: 100000},  // Used for ordering - follows ordering in Design
    mashItemFeatureIndex:           {type: Number, decimal: true, defaultValue: 100000},  // Used for ordering - follows ordering in Design
    // Status
    hasChildren:                    {type: Boolean, defaultValue: false},
    // Test Data
    mashItemName:                   {type: String, optional: true},                     // Set to same as design component name if linked.  Also used for additional 'not in design' elements
    mashItemTag:                    {type: String, defaultValue: DevTestTag.TEST_TEST}, // Where appropriate used to control test execution
    // Test Results
    accMashStatus:                  {type: String, optional: true},                     // Whether linked to dev or not and where originating - Acceptance Tests
    accMashTestStatus:              {type: String, optional: true},                     // If linked, latest test results status - Acceptance Tests
    intMashStatus:                  {type: String, optional: true},                     // Whether linked to dev or not and where originating - Integration Tests
    intMashTestStatus:              {type: String, optional: true},                     // If linked, latest test results status - Integration Tests
    unitMashStatus:                 {type: String, optional: true},                     // Whether linked to dev or not and where originating - Module Tests
    unitMashTestStatus:             {type: String, optional: true},                     // If linked, latest test results status - Module Tests
    accErrorMessage:                {type: String, optional: true},
    intErrorMessage:                {type: String, optional: true},
    accDuration:                    {type: Number, optional: true},
    intDuration:                    {type: Number, optional: true},
});

UserWorkPackageMashData.attachSchema(Schema);


// Publish
if(Meteor.isServer){

    Meteor.publish('userWorkPackageMashData', function userWorkPackageMashDataPublication(userId){
        return UserWorkPackageMashData.find({userId: userId});
    })
}
