import { Mongo } from 'meteor/mongo';

export const TestOutputLocations = new Mongo.Collection('testOutputLocations');

let Schema = new SimpleSchema({
    locationName:           {type: String},                                         // Location identifier
    locationRawText:        {type: Object, blackbox: true, optional: true},         // Text descriptive of this location
    locationType:           {type: String},                                         // SHARED or LOCAL
    locationUserId:         {type: String, defaultValue: 'NONE'},                   // Set for LOCAL locations only
    locationServerName:     {type: String, defaultValue: 'NONE'},                   // Name or IP of server if non-local
    serverLogin:            {type: String, defaultValue: 'NONE'},                   // User name to log in to on server - if required
    serverPassword:         {type: String, defaultValue: 'NONE'},                   // Password to log in with on server - if required
    locationPath:           {type: String, defaultValue: 'NONE'}                    // Path where files will be found on this server
});

TestOutputLocations.attachSchema(Schema);

// Publish Test Output Locations wanted
if(Meteor.isServer){
    Meteor.publish('testOutputLocations', function testOutputLocationsPublication(){
        return TestOutputLocations.find({});
    })
}

