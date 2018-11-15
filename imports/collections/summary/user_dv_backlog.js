
import { Mongo } from 'meteor/mongo';

export const UserDvBacklog = new Mongo.Collection('userDvBacklog');

let Schema = new SimpleSchema({
    userId:                 {type: String, index: 1},
    dvId:                   {type: String, index: 1},
    inId:                   {type: String, index: 1},
    itId:                   {type: String, index: 1},
    duId:                   {type: String, index: 1},
    wpId:                   {type: String, index: 1},
    backlogType:            {type: String, index: 1},
    featureRefId:           {type: String, index: 1},
    scenarioCount:          {type: Number, defaultValue: 0},
    scenarioTestCount:      {type: Number, defaultValue: 0},
    noWorkPackage:          {type: Boolean}
});

UserDvBacklog.attachSchema(Schema);

if(Meteor.isServer){
    Meteor.publish('userDvBacklog', function userDvBacklogPublication(userId, designVersionId){
        return UserDvBacklog.find({userId: userId, dvId: designVersionId});
    })
}
