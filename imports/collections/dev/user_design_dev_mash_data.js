/**
 * Represents the mash of data between the Design and the Dev Build tests.  It is ephemeral data that is calculated as needed
 */

import { Mongo } from 'meteor/mongo';


export const UserDesignDevMashData = new Mongo.Collection('userDesignDevMashData');

let Schema = new SimpleSchema({
    // Identity
    userId:                         {type: String},                         // Meteor user id - must be a user
    designVersionId:                {type: String},                         // Must be a design version
    designUpdateId:                 {type: String, defaultValue: 'NONE'},
    workPackageId:                  {type: String, defaultValue: 'NONE'},
    designComponentId:              {type: String, defaultValue: 'NONE'},   // Set if known in Design
    mashComponentType:              {type: String},                         // Feature, Aspect, Scenario, Step
    designFeatureReferenceId:       {type: String, defaultValue: 'NONE'},   // Set if known in Design
    designScenarioReferenceId:      {type: String, defaultValue: 'NONE'},   // Set if known in Design and relevant
    designScenarioStepReferenceId:  {type: String, defaultValue: 'NONE'},   // Set if known in Design and relevant
    // Links
    devFeatureId:                   {type: String, defaultValue: 'NONE'},   // Id of the Dev Feature where this item has been found
    devScenarioId:                  {type: String, defaultValue: 'NONE'},   // Id of the Dev Scenario if a Step
    // Data
    mashItemName:                   {type: String},                         // Name of Feature, Aspect, Scenario or Step Text
    // Status
    mashStatus:                     {type: String},                         // Whether linked to dev or not and where originating
    mashTestStatus:                 {type: String},                         // If linked, latest test results status
});

UserDesignDevMashData.attachSchema(Schema);


// Publish
if(Meteor.isServer){

    Meteor.publish('userDesignDevMashData', function userDesignDevMashDataPublication(){
        return UserDesignDevMashData.find({});
    })
}

