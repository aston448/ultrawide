
import { Mongo } from 'meteor/mongo';
import {  } from '../../constants/constants.js';

export const ScenarioTestExpectations = new Mongo.Collection('scenarioTestExpectations');


let Schema = new SimpleSchema({
    designVersionId:                {type: String},                                         // Belongs to this Design Version
    scenarioReferenceId:            {type: String},                                         // Belongs to this Scenario
    permutationId:                  {type: String},                                         // Is this type of permutation
    permutationValueId:             {type: String},                                         // Is this particular permutation
    requiresAcceptanceTest:         {type: Boolean, defaultValue: false},                   // Required for Acceptance Tests
    requiresIntegrationTest:        {type: Boolean, defaultValue: false},                   // Required for Integration Tests
    requiresUnitTest:               {type: Boolean, defaultValue: false},                   // Required for Unit Tests
});

ScenarioTestExpectations.attachSchema(Schema);

// Publish Design Versions wanted
if(Meteor.isServer){
    Meteor.publish('scenarioTestExpectations', function scenarioTestExpectationsPublication(designId, designVersionId){
        return ScenarioTestExpectations.find({designId: designId, designVersionId: designVersionId});
    })
}


