
import { Mongo } from 'meteor/mongo';
import {  } from '../../constants/constants.js';

export const DesignPermutations = new Mongo.Collection('designPermutations');


let Schema = new SimpleSchema({
    designId:               {type: String},                                         // Belongs to this Design
    permutationName:        {type: String},                                         // Title for permutation values
});

DesignPermutations.attachSchema(Schema);

// Publish Design Versions wanted
if(Meteor.isServer){
    Meteor.publish('designPermutations', function designPermutationsPublication(designId){
        return DesignPermutations.find({designId: designId});
    })
}


