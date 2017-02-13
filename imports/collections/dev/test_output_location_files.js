import { Mongo } from 'meteor/mongo';

export const TestOutputLocationFiles = new Mongo.Collection('testOutputLocationFiles');

let Schema = new SimpleSchema({
    locationId:             {type: String},                                         // Reference to Location
    fileAlias:              {type: String},                                         // Short identifying name for this file
    fileDescription:        {type: Object, blackbox: true, optional: true},         // Text descriptive of this location
    fileType:               {type: String},                                         // UNIT TEST, INTEGRATION TEST or ACCEPTANCE TEST
    fileUserId:             {type: String, defaultValue: 'NONE'},                   // Set for LOCAL location files only
    fileName:               {type: String, defaultValue: 'NONE'},                   // Name of actual file
    allFilesOfType:         {type: String, defaultValue: 'NONE'},                   // Alternative to a name - *.xxx
});

TestOutputLocationFiles.attachSchema(Schema);

// Publish Test Output Locations wanted
if(Meteor.isServer){
    Meteor.publish('testOutputLocationFiles', function testOutputLocationFilesPublication(){
        return TestOutputLocationFiles.find({});
    })
}
