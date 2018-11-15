
import { Mongo } from 'meteor/mongo';

export const UserDvWorkSummary = new Mongo.Collection('userDvWorkSummary');

let Schema = new SimpleSchema({
    userId:                 {type: String, index: 1},
    summaryType:            {type: String, index: 1},
    dvId:                   {type: String, index: 1},
    dvName:                 {type: String, optional: true},
    inId:                   {type: String, index: 1},
    inName:                 {type: String, optional: true},
    itId:                   {type: String, index: 1},
    itName:                 {type: String, optional: true},
    duId:                   {type: String, index: 1},
    duName:                 {type: String, optional: true},
    wpId:                   {type: String, index: 1},
    wpName:                 {type: String, optional: true},
    scenarioCount:          {type: Number, defaultValue: 0},
    noExpectationsCount:    {type: Number, defaultValue: 0},
    expectedTestCount:      {type: Number, defaultValue: 0},
    passingTestCount:       {type: Number, defaultValue: 0},
    failingTestCount:       {type: Number, defaultValue: 0},
    missingTestCount:       {type: Number, defaultValue: 0},
    noWorkPackage:          {type: Boolean}
});

UserDvWorkSummary.attachSchema(Schema);

if(Meteor.isServer){
    Meteor.publish('userDvWorkSummary', function userDvWorkSummaryPublication(userId, designVersionId){
        return UserDvWorkSummary.find({userId: userId, dvId: designVersionId});
    })
}
