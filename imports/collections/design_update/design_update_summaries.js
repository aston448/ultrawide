/**
 * Created by aston on 11/09/2016.
 */

import { Mongo } from 'meteor/mongo';

export const DesignUpdateSummaries = new Mongo.Collection('designUpdateSummaries');

let Schema = new SimpleSchema({
    designVersionId:            {type: String},
    designUpdateId:             {type: String},                                 // The design update this is the summary for
    summaryType:                {type: String},                                 // ADD, REMOVE, MODIFY
    summaryComponentType:       {type: String},                                 // Describes the item being changed
    itemType:                   {type: String},                                 // Feature, Scenario etc
    itemName:                   {type: String},
    itemNameOld:                {type: String},
    itemParentName:             {type: String},
    itemFeatureName:            {type: String}
});

DesignUpdateSummaries.attachSchema(Schema);

// Publish Design Updates wanted
if(Meteor.isServer){
    Meteor.publish('designUpdateSummaries', function designUpdateSummariesPublication(designVersionId){
        return DesignUpdateSummaries.find({designVersionId: designVersionId});
    })
}