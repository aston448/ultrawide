
import { Mongo } from 'meteor/mongo';
import {MashTestStatus} from "../../constants/constants";

// Ephemeral user data on the status of test expectations given the current user test view.

export const UserDvScenarioTestExpectationStatus = new Mongo.Collection('userDvScenarioTestExpectationStatus');

let Schema = new SimpleSchema({
    userId:                     {type: String, index: 1},
    designVersionId:            {type: String, index: 1},
    scenarioTestExpectationId:  {type: String, index: 1},
    expectationStatus:          {type: String, defaultValue: MashTestStatus.MASH_NOT_LINKED},
    
});

UserDvScenarioTestExpectationStatus.attachSchema(Schema);

// Publish
if(Meteor.isServer){

    Meteor.publish('userDvScenarioTestExpectationStatus', function userDvScenarioTestExpectationStatusPublication(userId, designVersionId){
        return UserDvScenarioTestExpectationStatus.find({userId: userId, designVersionId: designVersionId});
    })
}
