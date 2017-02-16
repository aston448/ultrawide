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
    featureReferenceId:     {type: String, defaultValue: 'NONE'},         // A unique ID that persists across design updates - populated if linked
    scenarioReferenceId:    {type: String, defaultValue: 'NONE'},
    scenarioStepReferenceId:{type: String, defaultValue: 'NONE'},
    previousStepId:         {type: String, defaultValue: 'NONE'},                   // Mechanism for placing dev-only steps that have not been put in design
    stepIndex:              {type: Number, decimal: true, defaultValue: 100000},
    // Data
    stepType:               {type: String},                         // GIVEN, WHEN, THEN etc
    stepText:               {type: String},                         // Unique functional text - plain text
    stepFullName:           {type: String},
    // Status
    stepContext:            {type: String},
    stepStatus:             {type: String},
    isRemoved:              {type: Boolean, defaultValue: false}        // Indicates that user has indicated this item should be removed from the Dev file
});

UserDevFeatureScenarioSteps.attachSchema(Schema);


// Publish
if(Meteor.isServer){

    Meteor.publish('userDevFeatureScenarioSteps', function userDevFeatureScenarioStepsPublication(userId){
        return UserDevFeatureScenarioSteps.find({userId: userId});
    })
}
