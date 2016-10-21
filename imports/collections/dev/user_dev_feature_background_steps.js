/**
 * User Features Background Steps Data Store.  This represents background steps defined for feature files in development
 */

import { Mongo } from 'meteor/mongo';

import {ComponentType} from '../../constants/constants.js';

export const UserDevFeatureBackgroundSteps = new Mongo.Collection('userDevFeatureBackgroundSteps');

let Schema = new SimpleSchema({
    // Identity
    userId:                 {type: String},                         // Meteor user id
    userDevFeatureId:       {type: String},
    stepReferenceId:        {type: String, optional: true},         // A unique ID that persists across design updates - populated if linked
    stepType:               {type: String},                         // GIVEN, WHEN, THEN etc
    stepText:               {type: String},                         // Unique functional text - plain text
    stepStatus:             {type: String}
});

UserDevFeatureBackgroundSteps.attachSchema(Schema);


// Publish
if(Meteor.isServer){

    Meteor.publish('userDevFeatureBackgroundSteps', function userDevFeatureBackgroundStepsPublication(){
        return UserDevFeatureBackgroundSteps.find({});
    })
}

