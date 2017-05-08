import { Mongo } from 'meteor/mongo';

import { DevTestTag, MashStatus } from '../../constants/constants.js';

export const UserDesignVersionMashScenarios = new Mongo.Collection('userDesignVersionMashScenarios');

let Schema = new SimpleSchema({
    // Design Identity
    userId:                         {type: String},                         // Meteor user id - must be a user
    designVersionId:                {type: String},                         // Must be a design version
    scenarioName:                   {type: String},                         // For Scenarios is the match for the test name
    designFeatureReferenceId:       {type: String, defaultValue: 'NONE'},   // Set if known in Design
    designFeatureAspectReferenceId: {type: String, defaultValue: 'NONE'},   // Set if known in Design and relevant
    designScenarioReferenceId:      {type: String, defaultValue: 'NONE'},   // Set if known in Design and relevant
    mashItemIndex:                  {type: Number, decimal: true, defaultValue: 100000},  // Used for ordering - follows ordering in Design
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
    unitPassCount:                  {type: Number, optional: true},
    unitFailCount:                  {type: Number, optional: true},
    accErrorMessage:                {type: String, optional: true},
    intErrorMessage:                {type: String, optional: true},
    accStackTrace:                  {type: String, optional: true},
    intStackTrace:                  {type: String, optional: true},
    accDuration:                    {type: Number, optional: true},
    intDuration:                    {type: Number, optional: true},
    dataStatus:                     {type: String, defaultValue: MashStatus.MASH_NOT_IMPLEMENTED} // Indicates latest changes to this data
});

UserDesignVersionMashScenarios.attachSchema(Schema);


// Publish
if(Meteor.isServer){

    Meteor.publish('userDesignVersionMashScenarios', function userDesignVersionMashScenariosPublication(userId){
        return UserDesignVersionMashScenarios.find({userId: userId});
    })
}
