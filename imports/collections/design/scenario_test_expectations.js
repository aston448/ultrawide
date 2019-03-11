
import { Mongo } from 'meteor/mongo';
import { DefaultItemNames} from "../../constants/default_names";

export const ScenarioTestExpectations = new Mongo.Collection('scenarioTestExpectations');


let Schema = new SimpleSchema({
    designVersionId:                {type: String, index: 1},                               // Belongs to this Design Version
    scenarioReferenceId:            {type: String, index: 1},                               // Belongs to this Scenario
    testType:                       {type: String, index: 1},                               // For this category of tests
    permutationId:                  {type: String, defaultValue: 'NONE'},                   // For this permutation - 'VALUE' if value permutation
    permutationValueId:             {type: String, defaultValue: 'NONE'},                   // For this permutation value - 'VALUE' if value permutation
    valuePermutationValue:          {type: String, defaultValue: DefaultItemNames.NEW_VALUE_EXPECTATION}                    // Specific user value for test expectation
});

ScenarioTestExpectations.attachSchema(Schema);

// Publish Design Versions wanted
if(Meteor.isServer){
    Meteor.publish('scenarioTestExpectations', function scenarioTestExpectationsPublication(designVersionId){
        return ScenarioTestExpectations.find({designVersionId: designVersionId});
    })
}


