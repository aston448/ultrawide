
import { Mongo } from 'meteor/mongo';

import { IterationStatus } from '../../constants/constants.js';

// An iteration is a unit by which Updates and Work packages can be grouped.  Iterations can be nested.

export const Iterations = new Mongo.Collection('iterations');

let Schema = new SimpleSchema({
    designVersionId:            {type: String},                                         // The Design Version this iteration relates to
    iterationReferenceId:       {type: String},                                         // Unique reference to this iteration
    iterationParentReferenceId: {type: String, defaultValue: 'NONE'},                   // Reference of parent iteration (if any)
    iterationName:              {type: String},                                         // Identifying name
    iterationStatus:            {type: String, defaultValue: IterationStatus.IT_NEW},   // Current status of iteration
    iterationLevel:             {type: Number, defaultValue: 0},                        // Level if iterations are nested
    iterationIndex:             {type: Number, decimal: true, defaultValue: 100000},    // Index so that iterations can be ordered
    iterationLink:              {type: String, defaultValue: 'NONE'},                   // Link to external data if required
});

Iterations.attachSchema(Schema);

// Publish Iterations for current DV
if(Meteor.isServer){
    Meteor.publish('iterations', function iterationsPublication(designVersionId){
        return Iterations.find({designVersionId: designVersionId});
    })
}
