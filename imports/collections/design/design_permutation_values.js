
import { Mongo } from 'meteor/mongo';
import {  } from '../../constants/constants.js';

export const DesignPermutationValues = new Mongo.Collection('designPermutationValues');


let Schema = new SimpleSchema({
    permutationId:          {type: String},                                         // The permutation title for which this is a value
    designVersionId:        {type: String},                                         // Valid in this Design Version
    permutationValueName:   {type: String},                                         // Value
});

DesignPermutationValues.attachSchema(Schema);

// Publish Design Versions wanted
if(Meteor.isServer){
    Meteor.publish('designPermutationValues', function designPermutationValuesPublication(designVersionId){
        return DesignPermutationValues.find({designVersionId: designVersionId});
    })
}


