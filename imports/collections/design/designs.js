/**
 * Created by aston on 08/09/2016.
 */

import { Mongo } from 'meteor/mongo';

export const Designs = new Mongo.Collection('designs');

//GlobalDesigns = Designs;

let Schema = new SimpleSchema({
    designName:             {type: String},                                 // The design name - e.g. ULTRAWIDE PROJECT
    designRawText:          {type: Object, blackbox: true, optional: true}, // Text descriptive of this design
    isRemovable:            {type: Boolean, defaultValue: true}             // Design is removable until it has Features
});

Designs.attachSchema(Schema);

// Publish Design Versions wanted
if(Meteor.isServer){
    Meteor.publish('designs', function designsPublication(){
        return Designs.find({});
    })
}


