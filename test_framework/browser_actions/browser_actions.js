import {ComponentType, MenuAction}      from "../../imports/constants/constants";
import {replaceAll}                     from "../../imports/common/utils";
import {AddActionIds}                   from "../../imports/constants/ui_context_ids";

class BrowserActions{

    loginAs(userName, password){

        browser.url('http://localhost:3000/');

        browser.waitForExist('#loginUserName', 1000);

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

        browser.waitForExist('#main-page-tab-1', 1000);
        browser.click('#main-page-tab-1');
    }

    addNewDesign(){

        const uiComponentId = '#' + AddActionIds.UI_CONTEXT_ADD_DESIGN;

        browser.waitForVisible(uiComponentId);
        browser.click(uiComponentId);

    }

    selectNamedItem(itemName){

        const uiItemId = replaceAll(itemName, ' ', '_');

        browser.waitForExist('#' + uiItemId);
        browser.click('#' + uiItemId);
    }

    editItem(){

        browser.waitForExist('#butEdit');
        browser.click('#butEdit');
    }


    addApplication(){

        this.addComponentTo('', ComponentType.APPLICATION)
    }

    addDesignSectionTo(context){

        this.addComponentTo(context, ComponentType.DESIGN_SECTION);
    }

    addFeatureTo(context){

        this.addComponentTo(context, ComponentType.FEATURE);
    }

    addFeatureAspectTo(context){

        this.addComponentTo(context, ComponentType.FEATURE_ASPECT);
    }

    addScenarioTo(context){

        this.addComponentTo(context, ComponentType.SCENARIO);
    }

    addComponentTo(context, componentType){

        const uiContext = replaceAll(context, ' ', '_');
        let itemId = '';

        switch(componentType){

            case ComponentType.APPLICATION:
                itemId = '#' + AddActionIds.UI_CONTEXT_ADD_APPLICATION;
                break;
            case ComponentType.DESIGN_SECTION:
                itemId = '#' + AddActionIds.UI_CONTEXT_ADD_DESIGN_SECTION_TO + uiContext;
                break;
            case ComponentType.FEATURE:
                itemId = '#' + AddActionIds.UI_CONTEXT_ADD_FEATURE_TO + uiContext;
                break;
            case ComponentType.FEATURE_ASPECT:
                itemId = '#' + AddActionIds.UI_CONTEXT_ADD_FEATURE_ASPECT_TO + uiContext;
                break;
            case ComponentType.SCENARIO:
                itemId = '#' + AddActionIds.UI_CONTEXT_ADD_SCENARIO_TO + uiContext;
                break;
        }

        //browser.waitForVisible(itemId);
        browser.click(itemId);
    }



    openComponent(componentName){

        const uiComponentName = replaceAll(componentName, ' ', '_');

        if (browser.isVisible('#openClose_' + uiComponentName + '_open-status-closed')){

            // Component is currently closed so click it to open it
            browser.click('#openClose_' + uiComponentName + '_open-status-closed');
        }
    }

    closeComponent(componentName){

        const uiComponentName = replaceAll(componentName, ' ', '_');

        if (browser.isVisible('#openClose_' + uiComponentName + '_open-status-open')){

            // Component is currently open so click it to close it
            browser.click('#openClose_' + uiComponentName + '_open-status-open');
        }
    }

    editComponent(componentName){

        const editButtonId = '#Edit_' + replaceAll(componentName, ' ', '_');

        browser.waitForVisible(editButtonId);
        browser.click(editButtonId);

    }

    saveComponent(componentName){

        const editButtonId = '#Save_' + replaceAll(componentName, ' ', '_');

        browser.waitForVisible(editButtonId);
        browser.click(editButtonId);

    }

    undoComponent(componentName){

        const editButtonId = '#Undo_' + replaceAll(componentName, ' ', '_');

        browser.waitForVisible(editButtonId);
        browser.click(editButtonId);

    }

    removeComponent(componentName){


        const editButtonId = '#Remove_' + replaceAll(componentName, ' ', '_');

        browser.waitForVisible(editButtonId);
        browser.click(editButtonId);
    }

    moveComponent(component, newParent){

        const componentId = '#Move_' + replaceAll(component, ' ', '_');
        const newParentId = '#Target_' + replaceAll(newParent, ' ', '_');

        //browser.dragAndDrop(componentId, newParentId);
        browser.moveToObject(componentId);
        browser.pause(2000);
        browser.buttonDown(0);
        browser.pause(2000);
        browser.moveToObject(newParentId);
        browser.pause(2000);
        browser.buttonUp(0);
        browser.pause(2000);

    }
}

export default new BrowserActions();