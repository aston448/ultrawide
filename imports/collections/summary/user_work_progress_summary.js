
import { Mongo } from 'meteor/mongo';

export const UserWorkProgressSummary = new Mongo.Collection('userWorkProgressSummary');

let Schema = new SimpleSchema({
    userId:                     {type: String, index: 1},
    designVersionId:            {type: String, index: 1},
    designUpdateId:             {type: String, defaultValue: 'NONE', index: 1},
    workPackageId:              {type: String, defaultValue: 'NONE', index: 1},
    workSummaryType:            {type: String, index: 1},
    name:                       {type: String},
    totalScenarios:             {type: Number, defaultValue: 0},
    scenariosInWp:              {type: Number, defaultValue: 0},
    scenariosPassing:           {type: Number, defaultValue: 0},
    scenariosFailing:           {type: Number, defaultValue: 0},
    scenariosNoTests:           {type: Number, defaultValue: 0}
});

UserWorkProgressSummary.attachSchema(Schema);

// Publish Design Updates wanted
if(Meteor.isServer){
    Meteor.publish('userWorkProgressSummary', function userWorkProgressSummaryPublication(userId){
        return UserWorkProgressSummary.find({userId: userId});
    })
}

