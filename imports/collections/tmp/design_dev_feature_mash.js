/**
 * User Feature Mash.  This represents the collation of features in the design the developer is working on and the code the developer is writing
 */

import { Mongo } from 'meteor/mongo';


export const DesignDevFeatureMash = new Mongo.Collection('designDevFeatureMash');

let Schema = new SimpleSchema({
    // Identity
    userId:                     {type: String},                         // Meteor user id
    designVersionId:            {type: String},
    designUpdateId:             {type: String, optional: true},
    workPackageId:              {type: String, optional: true},
    userDevFeatureId:           {type: String, optional: true},         // Id of this feature in test file data
    designFeatureReferenceId:   {type: String, optional: true},         // Id of this feature in the Design
    // Data
    featureName:                {type: String},
    // Status
    featureMashStatus:          {type: String},                         // Indicates whether Feature is linked across Design / Dev
    featureTestStatus:          {type: String},                         // Once linked, indicates test status

});

DesignDevFeatureMash.attachSchema(Schema);


// Publish
if(Meteor.isServer){

    Meteor.publish('designDevFeatureMash', function designDevFeatureMashPublication(){
        return DesignDevFeatureMash.find({});
    })
}

