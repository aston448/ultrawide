/**
 * User Scenario Step Mash.  This represents the collation of Scenario Steps in a mashed Scenario
 */

import { Mongo } from 'meteor/mongo';


export const DesignDevScenarioStepMash = new Mongo.Collection('designDevScenarioStepMash');

let Schema = new SimpleSchema({
    // Identity
    userId:                         {type: String},                         // Meteor user id
    designVersionId:                {type: String},
    designUpdateId:                 {type: String, optional: true},
    workPackageId:                  {type: String, optional: true},
    designFeatureReferenceId:       {type: String},
    designScenarioReferenceId:      {type: String},
    userDevScenarioStepId:          {type: String, optional: true},
    designScenarioStepReferenceId:  {type: String, optional: true},
    // Data
    stepType:                       {type: String},
    stepText:                       {type: String},
    // Status
    scenarioStepMashStatus:         {type: String},
    scenarioStepTestStatus:         {type: String},
});

DesignDevScenarioStepMash.attachSchema(Schema);


// Publish
if(Meteor.isServer){

    Meteor.publish('designDevScenarioStepMash', function designDevScenarioStepMashPublication(){
        return DesignDevScenarioStepMash.find({});
    })
}
