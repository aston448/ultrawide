
import { Mongo } from 'meteor/mongo';
import {  } from '../../constants/constants.js';
import {MashTestStatus} from "../../constants/constants";

export const ScenarioTestExpectations = new Mongo.Collection('scenarioTestExpectations');


let Schema = new SimpleSchema({
    designVersionId:                {type: String, index: 1},                               // Belongs to this Design Version
    scenarioReferenceId:            {type: String, index: 1},                               // Belongs to this Scenario
    testType:                       {type: String, index: 1},                               // For this category of tests
    permutationId:                  {type: String, defaultValue: 'NONE'},                   // For this permutation
    permutationValueId:             {type: String, defaultValue: 'NONE'}                    // For this permutation value
});

ScenarioTestExpectations.attachSchema(Schema);

// Publish Design Versions wanted
if(Meteor.isServer){
    Meteor.publish('scenarioTestExpectations', function scenarioTestExpectationsPublication(designVersionId){
        return ScenarioTestExpectations.find({designVersionId: designVersionId});
    })
}


