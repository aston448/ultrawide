
import { Mongo } from 'meteor/mongo';
import { DesignStatus } from '../../constants/constants.js';

export const DesignBackups = new Mongo.Collection('designBackups');

let Schema = new SimpleSchema({
    backupName:             {type: String},         // What is displayed in the list
    backupFileName:         {type: String},         // The actual file
    backupDataVersion:      {type: String}          // The Ultrawide data version at time of backup
});

DesignBackups.attachSchema(Schema);

// Publish Design Versions wanted
if(Meteor.isServer){
    Meteor.publish('designBackups', function designBackupsPublication(){
        return DesignBackups.find({});
    })
}

