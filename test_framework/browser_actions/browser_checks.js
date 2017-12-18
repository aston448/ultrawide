import TextLookups from "../../imports/common/lookups";
import {ViewType} from "../../imports/constants/constants";
import {LoginMessages} from "../../imports/constants/message_texts";

class BrowserChecks{


    isLoggedIn(){

        browser.waitForExist('#home-page');
    }

    isOnScreen(view){

        browser.waitUntil(function () {
            return browser.getText('#headerView') === TextLookups.viewText(view)
        }, 2000, 'expected ' + view + ' screen after 2s');
    }

    hasUserMessage(message){

        browser.waitUntil(function () {
            return browser.getText('#headerMessage') === message
        }, 2000, 'expected rejection after 2s');
    }

}

export default new BrowserChecks();