/**
 * User Features Scenario Steps Data Store.  This represents scenario steps defined for scenarios in feature files in development
 */

import { Mongo } from 'meteor/mongo';


export const UserDevFeatureScenarioSteps = new Mongo.Collection('userDevFeatureScenarioSteps');

let Schema = new SimpleSchema({
    // Identity
    userId:                 {type: String},                         // Meteor user id
    userDevFeatureId:       {type: String},
    userDevScenarioId:      {type: String},
    featureReferenceId:     {type: String, optional: true},         // A unique ID that persists across design updates - populated if linked
    stepReferenceId:        {type: String, optional: true},         // A unique ID that persists across design updates - populated if linked
    stepType:               {type: String},                         // GIVEN, WHEN, THEN etc
    stepText:               {type: String},                         // Unique functional text - plain text
    stepStatus:             {type: String}
});

UserDevFeatureScenarioSteps.attachSchema(Schema);


// Publish
if(Meteor.isServer){

    Meteor.publish('userDevFeatureScenarioSteps', function userDevFeatureScenarioStepsPublication(){
        return UserDevFeatureScenarioSteps.find({});
    })
}
