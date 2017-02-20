import { Mongo } from 'meteor/mongo';

export const UserTestTypeLocations = new Mongo.Collection('userTestTypeLocations');

let Schema = new SimpleSchema({
    locationId:             {type: String},                                         // Location identifier
    locationName:           {type: String},                                         // Denormalised
    locationType:           {type: String},                                         // SHARED or LOCAL
    userId:                 {type: String},                                         // User with this config
    isUnitLocation:         {type: Boolean, defaultValue: false},                   // This location has unit tests
    isIntLocation:          {type: Boolean, defaultValue: false},                   // This location has integration tests
    isAccLocation:          {type: Boolean, defaultValue: false},                   // This location has acceptance tests
});

UserTestTypeLocations.attachSchema(Schema);

// Publish Test Output Locations wanted
if(Meteor.isServer){
    Meteor.publish('userTestTypeLocations', function userTestTypeLocationsPublication(){
        return UserTestTypeLocations.find({});
    })
}

