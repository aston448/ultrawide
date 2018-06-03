import { TextLookups } from "../../imports/common/lookups";

import {replaceAll} from "../../imports/common/utils";

class BrowserChecksClass{


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

    componentIsVisible(componentName){

        const uiComponentName = replaceAll(componentName, ' ', '_');

        browser.waitForExist('#' + uiComponentName, 1000)
    }

    componentIsNotVisible(componentName){

        if(browser.isVisible(componentName)){

            return false;
        }
    }

    componentExists(componentName){

        const uiComponentId = '#' + replaceAll(componentName, ' ', '_');

        return browser.isExisting(uiComponentId);
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