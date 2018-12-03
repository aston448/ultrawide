
import { Mongo } from 'meteor/mongo';

export const UserDesignUpdateSummary = new Mongo.Collection('userDesignUpdateSummary');

let Schema = new SimpleSchema({
    userId:                     {type: String},
    designVersionId:            {type: String},
    designUpdateId:             {type: String},                                 // The design update this is the summary for
    summaryCategory:            {type: String},                                 // Functional Changes, Organisational changes
    summaryType:                {type: String},                                 // ADD_TO ADD, REMOVE_FROM, REMOVE, MODIFY_IN, MODIFY
    itemType:                   {type: String},                                 // Component type of changed item
    itemComponentReferenceId:   {type: String},                                 // Component ref in Design
    itemName:                   {type: String},
    itemNameOld:                {type: String, defaultValue: 'NONE'},
    itemFeatureName:            {type: String, defaultValue: 'NONE'},
    itemHeaderId:               {type: String, defaultValue: 'NONE'},
    headerComponentId:          {type: String, defaultValue: 'NONE'},
    itemIndex:                  {type: Number, decimal: true, defaultValue: 1000000},
    itemHeaderName:             {type: String, defaultValue: 'NONE'},
    scenarioTestStatus:         {type: String, defaultValue: 'NONE'},
    scenarioWorkPackageId:      {type: String, defaultValue: 'NONE'}
});

UserDesignUpdateSummary.attachSchema(Schema);

// Publish Design Updates wanted
if(Meteor.isServer){
    Meteor.publish('userDesignUpdateSummary', function userDesignUpdateSummaryPublication(userId){
        return UserDesignUpdateSummary.find({userId: userId});
    })
}
