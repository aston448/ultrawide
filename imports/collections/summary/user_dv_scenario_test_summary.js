import { Mongo } from 'meteor/mongo';
import {MashTestStatus} from "../../constants/constants";

// Ephemeral user data summarising test progress for a Scenario given the current user test view.

export const UserDvScenarioTestSummary = new Mongo.Collection('userDvScenarioTestSummary');

let Schema = new SimpleSchema({
    userId:                     {type: String, index: 1},
    designVersionId:            {type: String, index: 1},
    scenarioReferenceId:        {type: String, index: 1},
    featureReferenceId:         {type: String, index: 1},
    accTestExpectedCount:       {type: Number, defaultValue: 0},
    accTestPassCount:           {type: Number, defaultValue: 0},
    accTestFailCount:           {type: Number, defaultValue: 0},
    accTestMissingCount:        {type: Number, defaultValue: 0},
    intTestExpectedCount:       {type: Number, defaultValue: 0},
    intTestPassCount:           {type: Number, defaultValue: 0},
    intTestFailCount:           {type: Number, defaultValue: 0},
    intTestMissingCount:        {type: Number, defaultValue: 0},
    unitTestExpectedCount:      {type: Number, defaultValue: 0},
    unitTestPassCount:          {type: Number, defaultValue: 0},
    unitTestFailCount:          {type: Number, defaultValue: 0},
    unitTestMissingCount:       {type: Number, defaultValue: 0},
    scenarioTestStatus:         {type: String, defaultValue: MashTestStatus.MASH_NOT_LINKED}
});

UserDvScenarioTestSummary.attachSchema(Schema);

// Publish
if(Meteor.isServer){

    Meteor.publish('userDvScenarioTestSummary', function userDvScenarioTestSummaryPublication(userId, designVersionId){
        return UserDvScenarioTestSummary.find({userId: userId, designVersionId: designVersionId});
    })
}