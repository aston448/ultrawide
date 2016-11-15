/**
 * Created by aston on 19/09/2016.
 */

//import { Mongo } from 'meteor/mongo';

export const UserCurrentEditContext = new Mongo.Collection('userCurrentEditContext');

// This represents the current / last thing the user was editing / working with

let Schema = new SimpleSchema({
    userId:                         {type: String},                             // Meteor user id
    designId:                       {type: String, defaultValue: 'NONE'},       // Current Design (if any)
    designVersionId:                {type: String, defaultValue: 'NONE'},       // Current design version (if any)
    designUpdateId:                 {type: String, defaultValue: 'NONE'},       // Current design update (if any)
    workPackageId:                  {type: String, defaultValue: 'NONE'},       // Current work package (if any)
    designComponentId:              {type: String, defaultValue: 'NONE'},       // The actual component (if any)
    designComponentType:            {type: String, defaultValue: 'NONE'},       // Useful information when displaying DEV Mash

    featureReferenceId:             {type: String, defaultValue: 'NONE'},       // DEV Mash Feature Ref (if any)
    featureAspectReferenceId:       {type: String, defaultValue: 'NONE'},       // DEV Mash Feature Aspect Ref (if any)
    scenarioReferenceId:            {type: String, defaultValue: 'NONE'},       // DEV Mash Scenario Ref (if any)
    scenarioStepId:                 {type: String, defaultValue: 'NONE'},       // DEV Mash Step Ref (if any)

    featureFilesLocation:           {type: String, defaultValue: 'NONE'},       // Location of feature files in application being tested
    acceptanceTestResultsLocation:  {type: String, defaultValue: 'NONE'},       // Name of JSON output file for acceptance tests
    integrationTestResultsLocation: {type: String, defaultValue: 'NONE'},       // Name of JSON output file for integration tests
    moduleTestResultsLocation:      {type: String, defaultValue: 'NONE'},       // Name of JSON output file for module tests
});

UserCurrentEditContext.attachSchema(Schema);

// Publish
if(Meteor.isServer){
    Meteor.publish('userCurrentEditContext', function userCurrentEditContextPublication(){
        return UserCurrentEditContext.find({});
    })
}