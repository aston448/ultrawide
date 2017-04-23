
import { Mongo } from 'meteor/mongo';

export const UserWorkProgressSummary = new Mongo.Collection('userWorkProgressSummary');

let Schema = new SimpleSchema({
    userId:                     {type: String},
    designVersionId:            {type: String},
    designUpdateId:             {type: String, defaultValue: 'NONE'},
    workPackageId:              {type: String, defaultValue: 'NONE'},
    workSummaryType:            {type: String},
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

