
import React from 'react';
import { chai } from 'meteor/practicalmeteor:chai';

import { ViewMode, ViewType, RoleType, MenuDropdown, MenuAction} from '../constants/constants.js'

import ClientContainerServices from '../apiClient/apiClientContainerServices.js';

describe('API: ClientContainer', () => {

    function testGetDropdownMenuItems(menuType, view, mode, userRole=RoleType.DESIGNER){

        const userViewOptions = {
            designDetailsVisible:       true,
            designTestSummaryVisible:   false,
            designDomainDictVisible:    true,
            updateDetailsVisible:       true,
            updateTestSummaryVisible:   false,
            updateDomainDictVisible:    false,
            wpDetailsVisible:           true,
            wpDomainDictVisible:        false,
            devDetailsVisible:          false,
            devAccTestsVisible:         false,
            devIntTestsVisible:         false,
            devUnitTestsVisible:        false,
            devTestSummaryVisible:      false,
            devFeatureFilesVisible:     false,
            devDomainDictVisible:       false
        };

        return ClientContainerServices.getDropdownMenuItems(menuType, view, mode, userRole, userViewOptions);
    }

    function menuContains(menu, key){

        let found = false;

        menu.forEach((item) => {

            if(item.key === key){
                found = true;
            }
        });

        return found;
    }

    // Design Version Editor -------------------------------------------------------------------------------------------

    describe('The Design Version editor has an option to show or hide the Details pane', () => {

        it('is available when editing a design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_DETAILS), 'Details option not found');
        });

        it('is available when viewing a design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_DETAILS), 'Details option not found');
        });
    });

    describe('The Design Version editor has an option to show or hide the Domain Dictionary', () => {

        it('is available when editing a design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_DICT), 'Dictionary option not found');
        });

        it('is available when viewing a design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_DICT), 'Dictionary option not found');
        });
    });

    describe('The Design Version editor has an option to show or hide the Test Summary', () => {

        it('is available when editing a design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_TEST_SUMM), 'Test Summary option not found');
        });

        it('is available when viewing a design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_TEST_SUMM), 'Test Summary option not found');
        });
    });

    describe('The Design Version editor does not have options to show or hide Developer test results', () => {

        it('test results not available when editing a design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW_EDIT;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isFalse(menuContains(menu, MenuAction.MENU_ACTION_VIEW_ACC_TESTS), 'Acc Tests option was found');
            chai.assert.isFalse(menuContains(menu, MenuAction.MENU_ACTION_VIEW_INT_TESTS), 'Int Tests option was found');
            chai.assert.isFalse(menuContains(menu, MenuAction.MENU_ACTION_VIEW_UNIT_TESTS), 'Unit Tests option was found');
            chai.assert.isFalse(menuContains(menu, MenuAction.MENU_ACTION_VIEW_ACC_FILES), 'Acc Files option was found');
        });

        it('test results not available when viewing a design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED_VIEW;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isFalse(menuContains(menu, MenuAction.MENU_ACTION_VIEW_ACC_TESTS), 'Acc Tests option was found');
            chai.assert.isFalse(menuContains(menu, MenuAction.MENU_ACTION_VIEW_INT_TESTS), 'Int Tests option was found');
            chai.assert.isFalse(menuContains(menu, MenuAction.MENU_ACTION_VIEW_UNIT_TESTS), 'Unit Tests option was found');
            chai.assert.isFalse(menuContains(menu, MenuAction.MENU_ACTION_VIEW_ACC_FILES), 'Acc Files option was found');
        });
    });

    // Design Update editor --------------------------------------------------------------------------------------------

    describe('The Design Update editor has an option to show or hide the Details pane', () => {

        it('is available when editing a design update', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_DETAILS), 'Details option not found');
        });

        it('is available when in view only mode', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_DETAILS), 'Details option not found');
        });

        it('is available when viewing a design update', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_DETAILS), 'Details option not found');
        });
    });

    describe('The Design Update editor has an option to show or hide the Domain Dictionary', () => {

        it('is available when editing a design update', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_DICT), 'Dictionary option not found');
        });

        it('is available when in view only mode', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_DICT), 'Dictionary option not found');
        });

        it('is available when viewing a design update', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_DICT), 'Dictionary option not found');
        });
    });


    describe('The Design Update editor has an option to show or hide the Test Summary when in View Only mode', () => {

        it('is available when viewing a design update', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_TEST_SUMM), 'Test Summary option not found');
        });

        it('is available for design update in edit mode with view only option', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_TEST_SUMM), 'Test Summary option not found');
        });
    });

    describe('The Test Summary cannot be displayed in edit mode', () => {

        it('is not available when editing a design update', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isFalse(menuContains(menu, MenuAction.MENU_ACTION_VIEW_TEST_SUMM), 'Test Summary option was found');
        });
    });


});
