/**
 * Created by aston on 19/09/2016.
 */
import { Meteor } from 'meteor/meteor';

import  UserContextServices     from '../servicers/user_context_services.js';

// Meteor methods
Meteor.methods({

    'userContext.setCurrentUserContext'(context){

        UserContextServices.saveUserContext(context);
    },

    'userContext.setCurrentUserViewOptions'(viewOptions){
        UserContextServices.saveUserViewOptions(viewOptions);
    }

});