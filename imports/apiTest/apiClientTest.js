import { Meteor } from 'meteor/meteor';

// import { Designs }                  from '../collections/design/designs.js';
// import { UserRoles }                from '../collections/users/user_roles.js';
// import { UserCurrentEditContext }   from '../collections/context/user_current_edit_context.js';

import  ClientLoginServices     from '../apiClient/apiClientLogin.js';
import  ClientDesignServices    from '../apiClient/apiClientDesign.js'

Meteor.methods({

    'test.createMeteorUser'(role){
        ClientLoginServices.createMeteorUser(role);
    },

    'test.addNewDesign'(){
        ClientDesignServices.addNewDesign();
    }

});