
import React from 'react';
import { chai } from 'meteor/practicalmeteor:chai';

import { ViewMode, ViewType, RoleType, MenuDropdown, MenuAction} from '../constants/constants.js'

import { ClientDataServices } from './apiClientDataServices.js';

describe('API: ClientData', () => {

    function testGetDropdownMenuItems(menuType, view, mode, userRole=RoleType.DESIGNER){

        const userViewOptions = {
            designDetailsVisible:       true,
            testSummaryVisible:         false,
            designDomainDictVisible:    true,
            devDetailsVisible:          false,
            devAccTestsVisible:         false,
            devIntTestsVisible:         false,
            devUnitTestsVisible:        false,
            devFeatureFilesVisible:     false,
            devDomainDictVisible:       false
        };

        return ClientDataServices.getDropdownMenuItems(menuType, view, mode, userRole, userViewOptions);
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
            const view = ViewType.DESIGN_NEW;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_DETAILS), 'Details option not found');
        });

        it('is available when viewing a design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_DETAILS), 'Details option not found');
        });
    });

    describe('The Design Version editor has an option to show or hide the Domain Dictionary', () => {

        it('is available when editing a design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_DICT), 'Dictionary option not found');
        });

        it('is available when viewing a design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_DICT), 'Dictionary option not found');
        });
    });

    describe('The Design Version editor has an option to show or hide the Test Summary', () => {

        it('is available when editing a design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_TEST_SUMM), 'Test Summary option not found');
        });

        it('is available when viewing a design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_TEST_SUMM), 'Test Summary option not found');
        });
    });

    describe('An option exists to refresh test data when a Design Version is being edited', () => {

        it('is available when in edit mode', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_REFRESH;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_REFRESH_TESTS), 'Refresh Test Data option not found');
        });

        it('is available when in view only mode', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_REFRESH;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_REFRESH_TESTS), 'Refresh Test Data option not found');
        });
    });

    describe('An option exists to refresh test data when a Design Version is being viewed', () => {

        it('is available when in view mode', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_REFRESH;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_REFRESH_TESTS), 'Refresh Test Data option not found');
        });
    });

    describe('An option exists to refresh test data when an Updatable Design Version is being viewed', () => {

        it('is available when in the design progress view', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_REFRESH;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATABLE;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_REFRESH_TESTS), 'Refresh Test Data option not found');
        });
    });

    describe('The Design Version editor has options to show or hide Developer test results', () => {

        it('test results are available when editing a new design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_INT_TESTS), 'Int Tests option was found');
            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_UNIT_TESTS), 'Unit Tests option was found');
        });

        it('test results are available when viewing a new design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_INT_TESTS), 'Int Tests option not found');
            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_UNIT_TESTS), 'Unit Tests option not found');

        });

        it('test results are available when editing a published design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_PUBLISHED;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_INT_TESTS), 'Int Tests option was found');
            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_UNIT_TESTS), 'Unit Tests option was found');
        });

        it('test results are available when viewing a published design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_INT_TESTS), 'Int Tests option not found');
            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_UNIT_TESTS), 'Unit Tests option not found');

        });
    });

    describe('The Design Version editor has an option to show all panes as tabs', () => {

        it('is available when editing a new design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_NEW;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_ALL_TABS), 'View All as Tabs option not found');
        });

        it('is available when editing a published design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_PUBLISHED;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_ALL_TABS), 'View All as Tabs option not found');
        });

        it('is available when editing an updatable design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATABLE;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_ALL_TABS), 'View All as Tabs option not found');
        });

        it('is available when viewing a new design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_NEW;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_ALL_TABS), 'View All as Tabs option not found');
        });

        it('is available when viewing a published design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_PUBLISHED;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_ALL_TABS), 'View All as Tabs option not found');
        });

        it('is available when viewing an updatable design', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATABLE;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_ALL_TABS), 'View All as Tabs option not found');
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

    describe('The Design Update editor has an option to show or hide the working Design Version', () => {

        it('is available when editing a design update', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_PROGRESS), 'Working design option not found');
        });

        it('is available when in view only mode', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_PROGRESS), 'Working design option not found');
        });

        it('is available when viewing a design update', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_PROGRESS), 'Working design option not found');
        });
    });

    describe('The Design Update editor has an option to show or hide the Design Update Summary', () => {

        it('is available when editing a design update', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_UPD_SUMM), 'Update summary option not found');
        });

        it('is available when in view only mode', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_UPD_SUMM), 'Update summary option not found');
        });

        it('is available when viewing a design update', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_UPD_SUMM), 'Update summary option not found');
        });
    });

    describe('The Design Update editor has an option to show or hide the Test Summary', () => {

        it('is available when editing a design update', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_VIEW;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_VIEW_TEST_SUMM), 'Test Summary option not found');
        });

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

    describe('An option exists to refresh test data when a Design Update is being viewed', () => {

        it('is available when viewing a design update', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_REFRESH;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DESIGN_UPDATE_VIEW;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_REFRESH_TESTS), 'Refresh Test Data option not found');
        });
    });

    describe('An option exists to refresh test data when a Design Update is being edited', () => {

        it('is available when editing a design update', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_REFRESH;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DESIGN_UPDATE_EDIT;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_REFRESH_TESTS), 'Refresh Test Data option not found');
        });
    });

    // Work Package Editor ---------------------------------------------------------------------------------------------

    describe('An option exists to refresh Ultrawide test data when a Work Package is being developed', function(){

        it('is available when developing a base work package', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_REFRESH;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DEVELOP_BASE_WP;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_REFRESH_TESTS), 'Refresh Test Data option not found');
        });

        it('is available when developing an update work package', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_REFRESH;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.DEVELOP_UPDATE_WP;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_REFRESH_TESTS), 'Refresh Test Data option not found');
        });

        it('is available when developing a base work package with edit', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_REFRESH;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DEVELOP_BASE_WP;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_REFRESH_TESTS), 'Refresh Test Data option not found');
        });

        it('is available when developing an update work package with edit', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_REFRESH;
            const mode = ViewMode.MODE_EDIT;
            const view = ViewType.DEVELOP_UPDATE_WP;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_REFRESH_TESTS), 'Refresh Test Data option not found');
        });
    });

    describe('An option exists to refresh test data when a Work Package is being viewed', () => {

        it('is available when viewing a base work package', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_REFRESH;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.WORK_PACKAGE_BASE_VIEW;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_REFRESH_TESTS), 'Refresh Test Data option not found');
        });

        it('is available when viewing an update work package', () => {

            const menuType = MenuDropdown.MENU_DROPDOWN_REFRESH;
            const mode = ViewMode.MODE_VIEW;
            const view = ViewType.WORK_PACKAGE_UPDATE_VIEW;

            const menu = testGetDropdownMenuItems(menuType, view, mode);

            chai.assert.isTrue(menuContains(menu, MenuAction.MENU_ACTION_REFRESH_TESTS), 'Refresh Test Data option not found');
        });
    });

});
