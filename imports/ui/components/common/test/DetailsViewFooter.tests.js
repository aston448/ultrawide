import React from 'react';


import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';


import { ViewMode, ViewType, DisplayContext, RoleType, ItemType, DetailsViewType} from '../../../../constants/constants.js'

import { AddActionIds} from "../../../../constants/ui_context_ids";

import {DetailsViewFooter} from "../DetailsViewFooter";
import {UI} from "../../../../constants/ui_context_ids";
import {hashID} from "../../../../common/utils";


describe('JSX: DetailsViewFooter', () => {

    function testDetailsViewFooter(detailsType, actionsVisible, view, mode, userRole) {

        const userContext = {designId: 'NONE', designVersionId: 'NONE', designUpdateId: 'NONE', workPackageId: 'NONE'};

        return shallow(
            <DetailsViewFooter
                detailsType={detailsType}
                actionsVisible={actionsVisible}
                view={view}
                mode={mode}
                userContext={userContext}
                userRole={userRole}
            />
        );
    }

    describe('DOM', () =>{

        describe('The Domain Dictionary has an option to add new terms', () => {

            it('has option when editing a new design', () =>{

                const detailsType = DetailsViewType.VIEW_DOM_DICT;
                const actionsVisible = true;
                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_EDIT;
                const role = RoleType.DESIGNER;

                const item = testDetailsViewFooter(detailsType, actionsVisible, view, mode, role);

                const expectedUiItem = hashID(AddActionIds.UI_CONTEXT_ADD_DOMAIN_TERM, '');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('has option when editing a published design', () =>{

                const detailsType = DetailsViewType.VIEW_DOM_DICT;
                const actionsVisible = true;
                const view = ViewType.DESIGN_PUBLISHED;
                const mode = ViewMode.MODE_EDIT;
                const role = RoleType.DESIGNER;

                const item = testDetailsViewFooter(detailsType, actionsVisible, view, mode, role);

                const expectedUiItem = hashID(AddActionIds.UI_CONTEXT_ADD_DOMAIN_TERM, '');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });

            it('has option when editing a design update', () =>{

                const detailsType = DetailsViewType.VIEW_DOM_DICT;
                const actionsVisible = true;
                const view = ViewType.DESIGN_UPDATE_EDIT;
                const mode = ViewMode.MODE_EDIT;
                const role = RoleType.DESIGNER;

                const item = testDetailsViewFooter(detailsType, actionsVisible, view, mode, role);

                const expectedUiItem = hashID(AddActionIds.UI_CONTEXT_ADD_DOMAIN_TERM, '');

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' was not found');
            });
        });

        describe('A term cannot be added to the Domain Dictionary in View Only mode', () => {

            it('no option when editing a new design', () =>{

                const detailsType = DetailsViewType.VIEW_DOM_DICT;
                const actionsVisible = true;
                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_VIEW;
                const role = RoleType.DESIGNER;

                const item = testDetailsViewFooter(detailsType, actionsVisible, view, mode, role);

                const expectedUiItem = hashID(AddActionIds.UI_CONTEXT_ADD_DOMAIN_TERM, '');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no option when editing a published design', () =>{

                const detailsType = DetailsViewType.VIEW_DOM_DICT;
                const actionsVisible = true;
                const view = ViewType.DESIGN_PUBLISHED;
                const mode = ViewMode.MODE_VIEW;
                const role = RoleType.DESIGNER;

                const item = testDetailsViewFooter(detailsType, actionsVisible, view, mode, role);

                const expectedUiItem = hashID(AddActionIds.UI_CONTEXT_ADD_DOMAIN_TERM, '');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no option when editing a design update', () =>{

                const detailsType = DetailsViewType.VIEW_DOM_DICT;
                const actionsVisible = true;
                const view = ViewType.DESIGN_UPDATE_EDIT;
                const mode = ViewMode.MODE_VIEW;
                const role = RoleType.DESIGNER;

                const item = testDetailsViewFooter(detailsType, actionsVisible, view, mode, role);

                const expectedUiItem = hashID(AddActionIds.UI_CONTEXT_ADD_DOMAIN_TERM, '');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('Only a Designer can add a new term to the Domain Dictionary', () => {

            it('no option for developer when viewing a published design', () =>{

                const detailsType = DetailsViewType.VIEW_DOM_DICT;
                const actionsVisible = true;
                const view = ViewType.DESIGN_PUBLISHED;
                const mode = ViewMode.MODE_VIEW;
                const role = RoleType.DEVELOPER;

                const item = testDetailsViewFooter(detailsType, actionsVisible, view, mode, role);

                const expectedUiItem = hashID(AddActionIds.UI_CONTEXT_ADD_DOMAIN_TERM, '');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no option for manager when viewing a published design', () =>{

                const detailsType = DetailsViewType.VIEW_DOM_DICT;
                const actionsVisible = true;
                const view = ViewType.DESIGN_PUBLISHED;
                const mode = ViewMode.MODE_VIEW;
                const role = RoleType.MANAGER;

                const item = testDetailsViewFooter(detailsType, actionsVisible, view, mode, role);

                const expectedUiItem = hashID(AddActionIds.UI_CONTEXT_ADD_DOMAIN_TERM, '');

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

    });


});