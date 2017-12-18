import {MenuAction} from "../../imports/constants/constants";

class BrowserActions{

    loginAs(userName, password){

        browser.url('http://localhost:3000/');

        browser.waitForExist('#loginUserName');

        browser.setValue('#loginUserName', userName);
        browser.setValue('#loginPassword', password);

        browser.click('#loginSubmit');

    }

    loginAsDesigner(){
        this.loginAs('gloria', 'gloria123');
    }


    selectMenuItem(menuAction){

        // One stop place to handle changed ids in GUI code
        let item = '';

        switch (menuAction) {

            case MenuAction.MENU_ACTION_GOTO_CONFIG:
                item = '#SETTINGS';
                break;
            case MenuAction.MENU_ACTION_LOGOUT:
                item = '#Logout';
                break;
        }

        // Click the menu item
        browser.waitForExist(item);
        browser.click(item);

    }


    selectMySettingsTab(){

        browser.waitForExist('#config-view_tabs-tab-3');
        browser.click('#config-view_tabs-tab-3');
    }

    updatePassword(oldPassword, newPassword){

        // Set new values
        browser.waitForVisible('#configOldPassword');
        browser.setValue('#configOldPassword', oldPassword);
        browser.waitForVisible('#configNewPassword1');
        browser.setValue('#configNewPassword1', newPassword);
        browser.waitForVisible('#configNewPassword2');
        browser.setValue('#configNewPassword2', newPassword);

        // Execute
        browser.waitForVisible('#configChangePassword');
        browser.click('#configChangePassword');
    }


    selectDesignsTab(){

        browser.waitForExist('#main-page-tab-1');
        browser.click('#main-page-tab-1');
    }

    addNewDesign(){

        browser.waitForVisible('#Add-Design');
        browser.click('#Add-Design');
    }
}

export default new BrowserActions();