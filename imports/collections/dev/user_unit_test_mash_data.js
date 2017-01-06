/**
 * User Features Data Store.  This represents all features in feature files added to the actual application in development
 */

import { Mongo } from 'meteor/mongo';

export const UserUnitTestMashData = new Mongo.Collection('userUnitTestMashData');

let Schema = new SimpleSchema({
    // Identity
    userId:                     {type: String},                         // Meteor user id
    suiteName:                  {type: String},                         // Name top level "describe"
    testGroupName:              {type: String, optional: true},         // Name of second level "describe" (if any)
    designScenarioReferenceId:  {type: String, defaultValue: 'NONE'},   // Reference to matching scenario in design (if any)
    designAspectReferenceId:    {type: String, defaultValue: 'NONE'},   // Reference to parent Feature Aspect in design (if any)
    designFeatureReferenceId:   {type: String, defaultValue: 'NONE'},   // Reference to parent Feature in design (if any)
    // Data
    testName:                   {type: String},                         // Text in the "it" part
    // Status
    mashStatus:                 {type: String},                         // Whether linked or not
    testOutcome:                {type: String},                         // Pending / Pass  Fail
});

UserUnitTestMashData.attachSchema(Schema);

// Publish
if(Meteor.isServer){

    Meteor.publish('userUnitTestMashData', function userUnitTestMashDataPublication(){
        return UserUnitTestMashData.find({});
    })
}

