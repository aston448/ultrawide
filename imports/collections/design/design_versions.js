/**
 *
 * A design version represents one iteration of one design.  Its _id is used as a key for child components
 *
 */

import { Mongo } from 'meteor/mongo';

export const DesignVersions = new Mongo.Collection('designVersions');

let Schema = new SimpleSchema({
    designId:               {type: String},                                 // The overall Design to which this version belongs
    designVersionName:      {type: String},                                 // The design version name - e.g. Dev Release
    designVersionNumber:    {type: String},                                 // The number - e.g 1.0
    designVersionRawText:   {type: Object, blackbox: true, optional: true}, // Text descriptive of this version
    designVersionStatus:    {type: String, defaultValue: 'NEW'},            // Stage of development of this DV
    baseDesignVersionId:    {type: String, defaultValue: 'NONE'},           // The design version from which this version was created
    designVersionIndex:     {type: Number, defaultValue: 0}                 // Non user editable index to keep versions in strict order created
});

DesignVersions.attachSchema(Schema);

// Publish Design Versions wanted
if(Meteor.isServer){
    Meteor.publish('designVersions', function designVersionsPublication(){
        return DesignVersions.find({});
    })
}
