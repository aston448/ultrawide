/**
 * Created by aston on 09/09/2016.
 */

import { Mongo } from 'meteor/mongo';

export const UserRoles = new Mongo.Collection('userRoles');

let Schema = new SimpleSchema({
    userId:             {type: String},                 // Meteor user id
    userName:           {type: String},                 // Login
    displayName:        {type: String},                 // Actual Name
    isDesigner:         {type: Boolean},                // Developer role
    isDeveloper:        {type: Boolean},
    isManager:          {type: Boolean}
});

UserRoles.attachSchema(Schema);

// Publish Design Versions wanted
if(Meteor.isServer){
    Meteor.publish('userRoles', function userRolesPublication(){
        return UserRoles.find({});
    })
}
