import { Mongo } from 'meteor/mongo';
import {MashTestStatus} from "../../constants/constants";

// Ephemeral user data summarising test progress for a Design Version given the current user test view.

export const UserDvTestSummary = new Mongo.Collection('userDvTestSummary');

let Schema = new SimpleSchema({
    userId:                     {type: String, index: 1},
    designVersionId:            {type: String, index: 1},
    dvFeatureCount:             {type: Number, defaultValue: 0},
    dvScenarioCount:            {type: Number, defaultValue: 0},
    dvExpectedTestCount:        {type: Number, defaultValue: 0},
    dvPassingTestCount:         {type: Number, defaultValue: 0},
    dvFailingTestCount:         {type: Number, defaultValue: 0},
    dvMissingTestCount:         {type: Number, defaultValue: 0}
});

UserDvTestSummary.attachSchema(Schema);

// Publish
if(Meteor.isServer){

    Meteor.publish('userDvTestSummary', function userDvTestSummaryPublication(userId, designVersionId){
        return UserDvTestSummary.find({userId: userId, designVersionId: designVersionId});
    })
}