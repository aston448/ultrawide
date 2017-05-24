import { Meteor } from 'meteor/meteor';

import TestDataHelpers                  from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'verifyLogin.loggedInUserIs'(userName){

        const userContext = TestDataHelpers.getStore().currentUserItemContext;

        const user = TestDataHelpers.getUser(userName);

        if(userContext.userId === user.userId){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "User " + userName + " is not the currently logged in user.");
        }
    },

    'verifyLogin.noUserLoggedIn'(){

        const userContext = TestDataHelpers.getStore().currentUserItemContext;

        if(userContext.userId === 'NONE'){
            return true;
        } else {
            throw new Meteor.Error("FAIL", "User " + userContext.userId + " is still logged in.");
        }
    },
});

