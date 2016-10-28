/**
 * User Features Data Store.  This represents all features in feature files added to the actual application in development
 */

import { Mongo } from 'meteor/mongo';

import {ComponentType} from '../../constants/constants.js';

export const UserDevFeatures = new Mongo.Collection('userDevFeatures');

let Schema = new SimpleSchema({
    // Identity
    userId:                 {type: String},                         // Meteor user id
    featureFile:            {type: String},                         // Name of physical file
    // Data
    featureName:            {type: String},                         // Name of Feature found in the file - will have to match Design name to link up
    featureNarrative:       {type: String, optional: true},         // Narrative with feature (if any)
    featureTag:             {type: String, optional: true},
    // Status
    featureFileStatus:      {type: String},                         // Stat us of feature file - where it came from or invalid
    featureStatus:          {type: String},                         // Status of feature - implemented or unknown and if in current WP
});

UserDevFeatures.attachSchema(Schema);


// Publish
if(Meteor.isServer){

    Meteor.publish('userDevFeatures', function userDevFeaturesPublication(){
        return UserDevFeatures.find({});
    })
}
