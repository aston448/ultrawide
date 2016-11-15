/**
 * User Feature Background Step Mash.  This represents the collation of Background Steps in a mashed Feature
 */

import { Mongo } from 'meteor/mongo';


export const DesignDevFeatureBackgroundStepMash = new Mongo.Collection('designDevFeatureBackgroundStepMash');

let Schema = new SimpleSchema({
    // Identity
    userId:                         {type: String},                         // Meteor user id
    designVersionId:                {type: String},
    designUpdateId:                 {type: String, optional: true},
    workPackageId:                  {type: String, optional: true},
    featureMashId:                  {type: String},
    userDevBackgroundStepId:        {type: String, optional: true},
    designBackgroundStepReferenceId:{type: String, optional: true},
    // Data
    stepType:                       {type: String},
    stepText:                       {type: String},
    // Status
    scenarioStepMashStatus:         {type: String},
    scenarioStepTestStatus:         {type: String},
});

DesignDevFeatureBackgroundStepMash.attachSchema(Schema);


// Publish
if(Meteor.isServer){

    Meteor.publish('designDevFeatureBackgroundStepMash', function designDevFeatureBackgroundStepMashPublication(){
        return DesignDevFeatureBackgroundStepMash.find({});
    })
}

