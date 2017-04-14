
import { Mongo } from 'meteor/mongo';

export const DesignUpdateSummary = new Mongo.Collection('designUpdateSummary');

let Schema = new SimpleSchema({
    designVersionId:            {type: String},
    designUpdateId:             {type: String},                                 // The design update this is the summary for
    summaryCategory:            {type: String},                                 // Functional Changes, Organisational changes
    summaryType:                {type: String},                                 // ADD_TO ADD, REMOVE_FROM, REMOVE, MODIFY_IN, MODIFY
    itemType:                   {type: String},                                 // Component type of changed item
    itemName:                   {type: String},
    itemNameOld:                {type: String, defaultValue: 'NONE'},
    itemFeatureName:            {type: String, defaultValue: 'NONE'},
    itemHeaderId:               {type: String, defaultValue: 'NONE'},
    headerComponentId:          {type: String, defaultValue: 'NONE'},
    itemIndex:                  {type: Number, decimal: true, defaultValue: 1000000},
    itemHeaderName:             {type: String, defaultValue: 'NONE'},
    scenarioTestStatus:         {type: String, defaultValue: 'NONE'}
});

DesignUpdateSummary.attachSchema(Schema);

// Publish Design Updates wanted
if(Meteor.isServer){
    Meteor.publish('designUpdateSummary', function designUpdateSummaryPublication(designVersionId){
        return DesignUpdateSummary.find({designVersionId: designVersionId});
    })
}
