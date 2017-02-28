/**
 * Created by aston on 09/09/2016.
 */

import { Mongo } from 'meteor/mongo';

export const UserRoles = new Mongo.Collection('userRoles');

let Schema = new SimpleSchema({
    userId:             {type: String},                 // Meteor user id
    userName:           {type: String},                 // Login
    password:           {type: String, defaultValue: 'password'},
    displayName:        {type: String},                 // Actual Name
    isDesigner:         {type: Boolean},                // Developer role
    isDeveloper:        {type: Boolean},
    isManager:          {type: Boolean},
    isAdmin:            {type: Boolean, defaultValue: false},   // Only for the startup admin user
    isActive:           {type: Boolean, defaultValue: true}     // Determines whether this user can be used or not
});

UserRoles.attachSchema(Schema);

// Publish Design Versions wanted
if(Meteor.isServer){
    Meteor.publish('userRoles', function userRolesPublication(){
        return UserRoles.find({});
    })
}
