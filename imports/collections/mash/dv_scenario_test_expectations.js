
import { Mongo } from 'meteor/mongo';

export const DvScenarioTestExpectations = new Mongo.Collection('dvScenarioTestExpectations');

let Schema = new SimpleSchema({
    designVersionId:            {type: String},                         // Current design version
    designScenarioReferenceId:  {type: String, defaultValue: 'NONE'},   // Reference to matching scenario in design
    testType:                   {type: String},                         // Type of test this expectation relates to
    permutationId:              {type: String, defaultValue: 'NONE'},   // Related Design Permutation
    permutationValueId:         {type: String, defaultValue: 'NONE'},   // Related Permutation Value

    designAspectReferenceId:    {type: String, defaultValue: 'NONE'},   // Reference to parent Feature Aspect in design
    designFeatureReferenceId:   {type: String, defaultValue: 'NONE'},   // Reference to parent Feature in design
    
});

DvScenarioTestExpectations.attachSchema(Schema);

// Publish
if(Meteor.isServer){

    Meteor.publish('dvScenarioTestExpectations', function dvScenarioTestExpectationsPublication(designVersionId){
        return DvScenarioTestExpectations.find({designVersionId: designVersionId});
    })
}
