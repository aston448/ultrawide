import { Mongo } from 'meteor/mongo';
import {MashTestStatus} from "../../constants/constants";

// Ephemeral user data summarising test progress for a Feature given the current user test view.

export const UserDvFeatureTestSummary = new Mongo.Collection('userDvFeatureTestSummary');

let Schema = new SimpleSchema({
    userId:                     {type: String, index: 1},
    designVersionId:            {type: String, index: 1},
    featureReferenceId:         {type: String, index: 1},
    featureScenarioCount:       {type: Number, defaultValue: 0},
    featureExpectedTestCount:   {type: Number, defaultValue: 0},
    featurePassingTestCount:    {type: Number, defaultValue: 0},
    featureFailingTestCount:    {type: Number, defaultValue: 0},
    featureMissingTestCount:    {type: Number, defaultValue: 0},
    featureTestStatus:          {type: String, defaultValue: MashTestStatus.MASH_NOT_LINKED}
});

UserDvFeatureTestSummary.attachSchema(Schema);

// Publish
if(Meteor.isServer){

    Meteor.publish('userDvFeatureTestSummary', function userDvFeatureTestSummaryPublication(userId, designVersionId){
        return UserDvFeatureTestSummary.find({userId: userId, designVersionId: designVersionId});
    })
}