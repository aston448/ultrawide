/**
 * User Feature Aspect Mash  This represents the Feature Aspects in a mashed Feature
 */

import { Mongo } from 'meteor/mongo';


export const DesignDevFeatureAspectMash = new Mongo.Collection('designDevFeatureAspectMash');

let Schema = new SimpleSchema({
    // Identity
    userId:                         {type: String},                         // Meteor user id
    designVersionId:                {type: String},
    designUpdateId:                 {type: String, optional: true},
    workPackageId:                  {type: String, optional: true},
    designFeatureReferenceId:       {type: String},
    designFeatureAspectReferenceId: {type: String, optional: true},
    userDevFeatureId:               {type: String, optional: true},         // This could be related to a feature file

    // Data
    aspectName:                     {type: String},
    // Status
    aspectMashStatus:               {type: String},
    aspectTestStatus:               {type: String},
});

DesignDevFeatureAspectMash.attachSchema(Schema);

// Publish
if(Meteor.isServer){

    Meteor.publish('designDevFeatureAspectMash', function designDevFeatureAspectMashPublication(){
        return DesignDevFeatureAspectMash.find({});
    })
}
