/**
 * Created by aston on 11/09/2016.
 */

import { Mongo } from 'meteor/mongo';

export const DesignUpdateSummaries = new Mongo.Collection('designUpdateSummaries');

let Schema = new SimpleSchema({
    designUpdateId:             {type: String},                                 // The design update this is the summary for
    summaryItemType:            {type: String},                                 // E.g. ADD, REMOVE, MODIFY
    modifiedItemId:             {type: String},                                 // The ID of the design component modified
    modifiedItem:               {type: String},                                 // The name of the design component modified
    modifiedItemParentId:       {type: String, optional: true}                  // The parent item if required

});

DesignUpdateSummaries.attachSchema(Schema);

// Publish Design Updates wanted
if(Meteor.isServer){
    Meteor.publish('designUpdateSummaries', function designUpdateSummariesPublication(){
        return DesignUpdateSummaries.find({});
    })
}