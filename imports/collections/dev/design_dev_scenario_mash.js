/**
 * User Scenario Mash.  This represents the collation of Scenarios in a mashed Feature
 */

import { Mongo } from 'meteor/mongo';


export const DesignDevScenarioMash = new Mongo.Collection('designDevScenarioMash');

let Schema = new SimpleSchema({
    // Identity
    userId:                     {type: String},                         // Meteor user id
    designVersionId:            {type: String},
    designUpdateId:             {type: String, optional: true},
    workPackageId:              {type: String, optional: true},
    designFeatureReferenceId:   {type: String},
    userDevScenarioId:          {type: String, optional: true},
    designScenarioReferenceId:  {type: String, optional: true},
    // Data
    scenarioName:               {type: String},
    // Status
    scenarioMashStatus:         {type: String},
    scenarioTestStatus:         {type: String},
});

DesignDevScenarioMash.attachSchema(Schema);


// Publish
if(Meteor.isServer){

    Meteor.publish('designDevScenarioMash', function designDevScenarioMashPublication(){
        return DesignDevScenarioMash.find({});
    })
}

