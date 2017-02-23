// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections
import {UserRoles}    from '../collections/users/user_roles.js';

// Ultrawide Services
import {RoleType, ViewType, MessageType} from '../constants/constants.js'
import ClientUserContextServices from './apiClientUserContext.js'

// REDUX services
import store from '../redux/store'
import {setCurrentUserName, setCurrentView, toggleDomainDictionary, updateUserMessage} from '../redux/actions'


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

    userLogin(userName, password){

        //console.log("Attempting login with : " + userName);

        if(Meteor.isClient) {

            Meteor.loginWithPassword(userName, password, (error) => {

                if (error) {
                    store.dispatch(updateUserMessage({
                        messageType: MessageType.ERROR,
                        messageText: 'Invalid login credentials'
                    }));
                } else {
                    let userId = Meteor.userId();
                    //console.log("LOGGED IN AS METEOR USER: " + userId);

                    const user = UserRoles.findOne({userId: userId});
                    if (user) {
                        // Properly logged in so retrieve user settings - stored to REDUX
                        const userContext = ClientUserContextServices.getUserContext(userId);
                        ClientUserContextServices.getUserViewOptions(userId);
                        store.dispatch(setCurrentUserName(user.displayName));

                        // Having got these go to a WAIT screen until the design data is loaded...
                        ClientUserContextServices.loadMainData(userContext);

                    } else {
                        store.dispatch(updateUserMessage({
                            messageType: MessageType.ERROR,
                            messageText: 'User not recognised'
                        }));

                    }
                }
            });
        }

    }

}

export default new ClientLoginServices();

