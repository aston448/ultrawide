/**
 * Created by aston on 03/07/2016.
 */

import { Mongo } from 'meteor/mongo';

export const DesignUpdateScope = new Mongo.Collection('designUpdateScope');

let Schema = new SimpleSchema({
    designVersionId:            {type: String},
    designUpdateId:             {type: String},
    updateItemType:             {type: String},         // Feature or Scenario
    updateItemId:               {type: String},         // Design Component
    updateItemParentId:         {type: String}
});

DesignUpdateScope.attachSchema(Schema);

// Publish Design Update Scope wanted
if(Meteor.isServer){
    Meteor.publish('designUpdateScope', function designUpdateScopePublication(){
        return DesignUpdateScope.find({});
    })
}