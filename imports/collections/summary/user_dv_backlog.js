
import { Mongo } from 'meteor/mongo';
import {MashTestStatus} from "../../constants/constants";

export const UserDvBacklog = new Mongo.Collection('userDvBacklog');

let Schema = new SimpleSchema({
    userId:                         {type: String, index: 1},
    dvId:                           {type: String, index: 1},
    inId:                           {type: String, index: 1},
    itId:                           {type: String, index: 1},
    duId:                           {type: String, index: 1},
    wpId:                           {type: String, index: 1},
    backlogType:                    {type: String, index: 1},
    featureRefId:                   {type: String, index: 1},
    scenarioCount:                  {type: Number, defaultValue: 0},
    scenarioTestCount:              {type: Number, defaultValue: 0},
    scenarioAnomalyCount:           {type: Number, defaultValue: 0},
    summaryType:                    {type: String},
    featureScenarioCount:           {type: Number, defaultValue: 0},
    featureExpectedTestCount:       {type: Number, defaultValue: 0},
    featurePassingTestCount:        {type: Number, defaultValue: 0},
    featureFailingTestCount:        {type: Number, defaultValue: 0},
    featureMissingTestCount:        {type: Number, defaultValue: 0},
    featureMissingExpectationCount: {type: Number, defaultValue: 0},
    featureTestStatus:              {type: String, defaultValue: MashTestStatus.MASH_NOT_LINKED},
    featureAnomalyCount:            {type: Number, defaultValue: 0}
});

UserDvBacklog.attachSchema(Schema);

if(Meteor.isServer){
    Meteor.publish('userDvBacklog', function userDvBacklogPublication(userId, designVersionId){
        return UserDvBacklog.find({userId: userId, dvId: designVersionId});
    })
}
