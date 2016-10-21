/**
 * Created by aston on 03/07/2016.
 */

import { Mongo } from 'meteor/mongo';

import {DesignUpdateStatus, DesignUpdateMergeAction} from '../../constants/constants.js';

export const DesignUpdates = new Mongo.Collection('designUpdates');

let Schema = new SimpleSchema({
    designVersionId:            {type: String},                                                         // The design version this is a change to
    updateName:                 {type: String},                                                         // Identifier of this update - e.g. CR123
    updateVersion:              {type: String, optional: true},                                         // Update version number if required
    updateRawText:              {type: Object, blackbox: true, optional: true},                         // Text descriptive of this update
    updateStatus:               {type: String, defaultValue: DesignUpdateStatus.UPDATE_NEW},            // Indicates if this update is adoptable yet or not
    updateMergeAction:          {type: String, defaultValue: DesignUpdateMergeAction.MERGE_INCLUDE},    // Indicates what to do with this update when creating a new design version
});

DesignUpdates.attachSchema(Schema);

// Publish Design Updates wanted
if(Meteor.isServer){
    Meteor.publish('designUpdates', function designUpdatesPublication(){
        return DesignUpdates.find({});
    })
}