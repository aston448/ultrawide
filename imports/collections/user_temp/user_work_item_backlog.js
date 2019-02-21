
import { Mongo } from 'meteor/mongo';
import {MashTestStatus} from "../../constants/constants";

export const UserWorkItemBacklog = new Mongo.Collection('userWorkItemBacklog');

let Schema = new SimpleSchema({
    userId:                         {type: String, index: 1},
    dvId:                           {type: String, index: 1},
    inId:                           {type: String, defaultValue: 'NONE', index: 1},
    itId:                           {type: String, defaultValue: 'NONE', index: 1},
    duId:                           {type: String, defaultValue: 'NONE', index: 1},
    wpId:                           {type: String, defaultValue: 'NONE', index: 1},
    summaryType:                    {type: String, defaultValue: 'NONE', index: 1},
    backlogType:                    {type: String, defaultValue: 'NONE', index: 1},
    featureRefId:                   {type: String, defaultValue: 'NONE', index: 1},
    featureName:                    {type: String, defaultValue: 'NONE'},
    scenarioCount:                  {type: Number, defaultValue: 0},
    backlogItemCount:               {type: Number, defaultValue: 0}
});

UserWorkItemBacklog.attachSchema(Schema);

if(Meteor.isServer){
    Meteor.publish('userWorkItemBacklog', function userWorkItemBacklogPublication(userId, designVersionId){
        return UserWorkItemBacklog.find({userId: userId, dvId: designVersionId});
    })
}
