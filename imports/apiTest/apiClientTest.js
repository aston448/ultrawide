import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../collections/design/designs.js';
// import { UserRoles }                from '../collections/users/user_roles.js';
// import { UserCurrentEditContext }   from '../collections/context/user_current_edit_context.js';

import  ClientLoginServices     from '../apiClient/apiClientLogin.js';
import  ClientDesignServices    from '../apiClient/apiClientDesign.js'

Meteor.methods({

    'test.createMeteorUser'(role){
        ClientLoginServices.createMeteorUser(role);
    },

    'test.addNewDesign'(role){
        ClientDesignServices.addNewDesign(role);
    },

    'test.verifyNewDesign'(){

        const newDesign = Designs.findOne({designName: 'New Design'});

        if(newDesign){
            if(!newDesign.isRemovable){
                throw new Meteor.Error("FAIL", "New design is not removable");
            }
            return true
        } else {
            throw new Meteor.Error("FAIL", "No new design was created");
        }
    }

});