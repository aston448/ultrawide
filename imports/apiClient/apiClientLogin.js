// == IMPORTS ==========================================================================================================

// Meteor / React Services


// Ultrawide Services
import {RoleType} from '../constants/constants.js'
import ClientUserContextServices from '../apiClient/apiClientUserContext.js'

// REDUX services
import store from '../redux/store'
import {changeApplicationMode, setCurrentView, toggleDomainDictionary} from '../redux/actions'


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Login Services - Supports client calls for actions originating in the login screen
//
// This class is the test entry point when not testing through the GUI.
// Most functions validate and return true / false according to business rules even if there is implicit validation in the GUI
// (E.g. buttons not being visible if action invalid)
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientLoginServices{

    createMeteorUser(role){
        if(Meteor.isClient) {
            console.log("CLIENT: Login");
            switch (role) {
                case RoleType.DESIGNER:
                    Meteor.loginWithPassword('user1', 'user1', (error) => {this.initialise(error, role)});
                    break;
                case RoleType.DEVELOPER:
                    Meteor.loginWithPassword('user2', 'user2', (error) => {this.initialise(error, role)});
                    break;
                case RoleType.MANAGER:
                    Meteor.loginWithPassword('user3', 'user3', (error) => {this.initialise(error, role)});
                    break;

            }
        } else {
            console.log("SERVER: Login");
        }
    };

    initialise(error, role){
        if(error){
            console.log("LOGIN FAILURE: " + error);
        } else {

            let userId = Meteor.userId();
            console.log("LOGGED IN AS METEOR USER: " + userId);

            // Update the redux current item settings from the stored DB data
            const userContext = ClientUserContextServices.setInitialSelectionSettings(role, userId);

            ClientUserContextServices.setViewFromUserContext(role, userContext);
        }

    }

}

export default new ClientLoginServices();

