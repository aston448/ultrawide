import { Mongo } from 'meteor/mongo';
import { TestLocationType, TestLocationAccessType } from '../../constants/constants.js';

export const TestOutputLocations = new Mongo.Collection('testOutputLocations');

let Schema = new SimpleSchema({
    locationName:           {type: String},                                                 // Location identifier
    locationRawText:        {type: Object, blackbox: true, optional: true},                 // Text descriptive of this location
    locationType:           {type: String, defaultValue: TestLocationType.NONE},            // REMOTE or LOCAL.  Local means on the same filesystem as Ultrawide
    locationAccessType:     {type: String, defaultValue: TestLocationAccessType.NONE},      // How to reach the location
    locationIsShared:       {type: Boolean, defaultValue: false},                           // Determines if location available to all users
    locationUserId:         {type: String, defaultValue: 'NONE'},                           // Set for non-shared locations
    // locationServerName:     {type: String, defaultValue: 'NONE'},                           // Name or IP of server if non-local
    // serverLogin:            {type: String, defaultValue: 'NONE'},                           // User name to log in to on server - if required
    // serverPassword:         {type: String, defaultValue: 'NONE'},                           // Password to log in with on server - if required
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

