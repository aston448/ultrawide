/**
 * Created by aston on 08/09/2016.
 */

import { Mongo } from 'meteor/mongo';
import { DesignStatus } from '../../constants/constants.js';

export const Designs = new Mongo.Collection('designs');

//GlobalDesigns = Designs;

let Schema = new SimpleSchema({
    designName:             {type: String},                                         // The design name - e.g. ULTRAWIDE PROJECT
    designRawText:          {type: Object, blackbox: true, optional: true},         // Text descriptive of this design
    isRemovable:            {type: Boolean, defaultValue: true},                    // Design is removable until it has Features
    designStatus:           {type: String, defaultValue: DesignStatus.DESIGN_LIVE}  // Design Live or Archived
});

Designs.attachSchema(Schema);

// Publish Design Versions wanted
if(Meteor.isServer){
    Meteor.publish('designs', function designsPublication(){
        return Designs.find({});
    })
}


