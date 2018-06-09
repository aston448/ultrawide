import { TextLookups } from "../../imports/common/lookups";

import {replaceAll, hashID, uiName} from "../../imports/common/utils";

class BrowserChecksClass{

    // Generic checks using constant items plus component name format --------------------------------------------------

    componentIsVisible(item, itemName){

        const uiComponentName = hashID(item, uiName(itemName));

        browser.waitForExist(uiComponentName, 1000)
    }

    componentWithParentIsVisible(item, parentName, itemName){

        const uiComponentName = hashID(item, uiName(parentName + ' ' + itemName));

        browser.waitForExist(uiComponentName, 1000)
    }

    componentIsNotVisible(item, itemName){

        const uiComponentName = hashID(item, uiName(itemName));

        if(browser.isVisible(uiComponentName)){

            return false;
        }
    }

    componentWithParentIsNotVisible(item, parentName, itemName){

        const uiComponentName = hashID(item, uiName(parentName + ' ' + itemName));

        if(browser.isVisible(uiComponentName)){

            return false;
        }
    }

    componentExists(item, itemName){

        const uiComponentName = hashID(item, uiName(itemName));

        return browser.isExisting(uiComponentName);
    }

    componentWithParentExists(item, parentName, itemName){

        const uiComponentName = hashID(item, uiName(parentName + ' ' + itemName));

        return browser.isExisting(uiComponentName);
    }


    // Specific checks -------------------------------------------------------------------------------------------------

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



    editorIsActive(componentName){

        const uiComponentName = '#ActiveEditor_' + replaceAll(componentName, ' ', '_');

        browser.waitForExist(uiComponentName, 1000)
    }

    editorIsPassive(componentName){

        const uiComponentName = '#PassiveEditor_' + replaceAll(componentName, ' ', '_');

        browser.waitForExist(uiComponentName, 1000)
    }

}

export const BrowserChecks = new BrowserChecksClass();