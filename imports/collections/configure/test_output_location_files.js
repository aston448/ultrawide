import { Mongo } from 'meteor/mongo';

import { TestLocationFileStatus } from '../../constants/constants.js';

export const TestOutputLocationFiles = new Mongo.Collection('testOutputLocationFiles');

let Schema = new SimpleSchema({
    locationId:             {type: String},                                         // Reference to Location
    fileAlias:              {type: String},                                         // Short identifying name for this file
    fileDescription:        {type: Object, blackbox: true, optional: true},         // Text descriptive of this location
    fileType:               {type: String, defaultValue: 'NONE'},                   // UNIT, INTEGRATION or ACCEPTANCE
    testRunner:             {type: String, defaultValue: 'NONE'},                   // Which plugin needed to read the test output
    fileName:               {type: String, defaultValue: 'NONE'},                   // Name of actual file
    allFilesOfType:         {type: String, defaultValue: 'NONE'},                   // Alternative to a name - *.xxx
    fileStatus:             {type: String, defaultValue: TestLocationFileStatus.FILE_NOT_UPLOADED},                   // Present or not present on the server
    lastUpdated:            {type: Date, optional: true},                           // Last modified date for tests
});

TestOutputLocationFiles.attachSchema(Schema);

// Publish Test Output Locations wanted
if(Meteor.isServer){
    Meteor.publish('testOutputLocationFiles', function testOutputLocationFilesPublication(){
        return TestOutputLocationFiles.find({});
    })
}
