
import { Meteor } from 'meteor/meteor';

import  UserContextServices     from '../servicers/context/user_context_services.js';

// Meteor methods
Meteor.methods({

    'userContext.setCurrentUserContext'(context){

        UserContextServices.saveUserContext(context);
    },

    'userContext.setCurrentUserViewOptions'(viewOptions){
        UserContextServices.saveUserViewOptions(viewOptions);
    },

    'userContext.setCurrentUserRole'(userId, role){
        UserContextServices.saveUserRole(userId, role);
    }

});