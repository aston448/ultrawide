
import { Mongo } from 'meteor/mongo';

import { WorkItemStatus } from '../../constants/constants.js';

// Work Items are Increments, Iterations, Work Packages and Design Update Work Packages

export const WorkItems = new Mongo.Collection('workItems');

let Schema = new SimpleSchema({
    designVersionId:            {type: String},                                         // The Design Version this item relates to
    wiReferenceId:              {type: String},                                         // Unique reference to this item
    wiParentReferenceId:        {type: String, defaultValue: 'NONE'},                   // Reference of parent item (if any)
    wiDuId:                     {type: String, defaultValue: 'NONE'},                   // Reference to Design Update
    wiWpId:                     {type: String, defaultValue: 'NONE'},                   // Reference to Work Package
    wiType:                     {type: String},
    wiName:                     {type: String},                                         // Identifying name
    wiStatus:                   {type: String, defaultValue: WorkItemStatus.WI_NEW},    // Current status of item
    wiLevel:                    {type: Number, defaultValue: 0},                        // Level if items are nested
    wiIndex:                    {type: Number, decimal: true, defaultValue: 100000},    // Index so that items can be ordered
    wiLink:                     {type: String, defaultValue: 'NONE'},                   // Link to external data if required
});

WorkItems.attachSchema(Schema);

// Publish Iterations for current DV
if(Meteor.isServer){
    Meteor.publish('workItems', function workItemsPublication(designVersionId){
        return WorkItems.find({designVersionId: designVersionId});
    })
}
