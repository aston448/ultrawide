
import { Mongo } from 'meteor/mongo';
import {  } from '../../constants/constants.js';
import {MashTestStatus} from "../../constants/constants";

export const ScenarioTestExpectations = new Mongo.Collection('scenarioTestExpectations');


let Schema = new SimpleSchema({
    designVersionId:                {type: String},                                         // Belongs to this Design Version
    scenarioReferenceId:            {type: String},                                         // Belongs to this Scenario
    testType:                       {type: String},                                         // For this category of tests
    permutationId:                  {type: String, defaultValue: 'NONE'},                   // For this permutation
    permutationValueId:             {type: String, defaultValue: 'NONE'},                   // For this permutation value
    expectationStatus:              {type: String, defaultValue: MashTestStatus.MASH_NOT_LINKED},
});

ScenarioTestExpectations.attachSchema(Schema);

// Publish Design Versions wanted
if(Meteor.isServer){
    Meteor.publish('scenarioTestExpectations', function scenarioTestExpectationsPublication(designVersionId){
        return ScenarioTestExpectations.find({designVersionId: designVersionId});
    })
}


