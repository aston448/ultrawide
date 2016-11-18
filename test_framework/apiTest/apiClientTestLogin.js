import { Meteor } from 'meteor/meteor';

import  ClientLoginServices     from '../../imports/apiClient/apiClientLogin.js'
import  AppHeaderServices       from '../../imports/apiClient/apiClientAppHeader.js'
import {RoleType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testLogin.loginAsUser'(username, password){

        ClientLoginServices.userLogin(username, password);

    },

    'testLogin.loginAs'(role){
        switch(role){
            case RoleType.DESIGNER:
                ClientLoginServices.userLogin('gloria', 'gloria');
                break;
            case RoleType.DEVELOPER:
                ClientLoginServices.userLogin('hugh', 'hugh');
                break;
            case RoleType.MANAGER:
                ClientLoginServices.userLogin('miles', 'miles');
                break;
        }
    },

    'testLogin.logout'(){
        AppHeaderServices.setViewLogin();
    }

});
