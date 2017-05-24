import { Mongo } from 'meteor/mongo';
import { TestLocationType, TestLocationAccessType } from '../../constants/constants.js';

export const TestOutputLocations = new Mongo.Collection('testOutputLocations');

let Schema = new SimpleSchema({
    locationName:           {type: String},                                                 // Location identifier
    locationIsShared:       {type: Boolean, defaultValue: false},                           // Determines if location available to all users
    locationUserId:         {type: String, defaultValue: 'NONE'},                           // Set for non-shared locations
    locationPath:           {type: String, defaultValue: 'NONE'},                           // Path where files will be found under the application base data path
    locationFullPath:       {type: String, defaultValue: 'NONE'},                           // Full path on application server
});

TestOutputLocations.attachSchema(Schema);

// Publish Test Output Locations wanted
if(Meteor.isServer){
    Meteor.publish('testOutputLocations', function testOutputLocationsPublication(){
        return TestOutputLocations.find({});
    })
}

