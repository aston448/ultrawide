/**
 * User Features Scenarios Data Store.  This represents scenarios defined in feature files in development
 */

import { Mongo } from 'meteor/mongo';


export const UserDevFeatureScenarios = new Mongo.Collection('userDevFeatureScenarios');

let Schema = new SimpleSchema({
    // Identity
    userId:                 {type: String},                         // Meteor user id
    userDevFeatureId:       {type: String},
    featureReferenceId:     {type: String, optional: true},         // A unique ID that persists across design updates - populated if linked
    scenarioReferenceId:    {type: String, optional: true},         // A unique ID that persists across design updates - populated if linked
    scenarioText:           {type: String},                         // Unique functional text - plain text
    scenarioStatus:         {type: String}
});

UserDevFeatureScenarios.attachSchema(Schema);


// Publish
if(Meteor.isServer){

    Meteor.publish('userDevFeatureScenarios', function userDevFeatureScenariosPublication(){
        return UserDevFeatureScenarios.find({});
    })
}

