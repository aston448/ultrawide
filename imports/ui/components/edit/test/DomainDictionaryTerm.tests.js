import React from 'react';


import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';


import { ViewMode, ViewType, DisplayContext, RoleType, ItemType, DetailsViewType} from '../../../../constants/constants.js'

import { AddActionIds} from "../../../../constants/ui_context_ids";


import {UI} from "../../../../constants/ui_context_ids";
import {hashID} from "../../../../common/utils";
import {DomainDictionaryTerm} from "../DomainDictionaryTerm";
import {DomainDictUiServices} from "../../../../ui_modules/domain_dictionary";


describe('JSX: DetailsViewFooter', () => {

    function decoratorFunction(){};

    function testDomainDictionaryTerm(dictionaryTerm, view, mode, userRole) {

        const userContext = {
            designId: 'DESIGN1',
            designVersionId: 'DESIGN_VERSION1'
        };

        return shallow(
            <DomainDictionaryTerm
                dictionaryTerm={dictionaryTerm}
                domainTermDecorator={decoratorFunction}
                view={view}
                mode={mode}
                userRole={userRole}
                userContext={userContext}
            />
        );
    }

    describe('UC 701', () => {

        describe('When a new term is added to the Domain Dictionary the term name is editable', () => {

            it('new term is editable', () =>{

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_EDIT;
                const dictionaryTerm = {
                    designId:               'DESIGN1',
                    designVersionId:        'DESIGN_VERSION1',
                    domainTermOld:          'Term',
                    domainTermNew:          'Term',
                    sortingName:            'Term',
                    markInDesign:           true,
                    isNew:                  true,
                    isChanged:              false
                };

                const editable = DomainDictUiServices.isTermAutoEditable(dictionaryTerm, view, mode);

                chai.assert.isTrue(editable, 'Term was not editable');
            });

            it('existing term is not editable', () =>{

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_EDIT;
                const role = RoleType.DESIGNER;
                const dictionaryTerm = {
                    designId:               'DESIGN1',
                    designVersionId:        'DESIGN_VERSION1',
                    domainTermOld:          'Term',
                    domainTermNew:          'Term',
                    sortingName:            'Term',
                    markInDesign:           true,
                    isNew:                  false,
                    isChanged:              false
                };

                const editable = DomainDictUiServices.isTermAutoEditable(dictionaryTerm, view, mode);

                chai.assert.isFalse(editable, 'Term was editable');
            });

            it('new changed term term is not editable', () =>{

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_EDIT;
                const role = RoleType.DESIGNER;
                const dictionaryTerm = {
                    designId:               'DESIGN1',
                    designVersionId:        'DESIGN_VERSION1',
                    domainTermOld:          'Term',
                    domainTermNew:          'Term',
                    sortingName:            'Term',
                    markInDesign:           true,
                    isNew:                  true,
                    isChanged:              true
                };

                const editable = DomainDictUiServices.isTermAutoEditable(dictionaryTerm, view, mode);

                chai.assert.isFalse(editable, 'Term was editable');
            });

        });
    });

    describe('UC 702', () => {

        describe('A Domain Dictionary term has an option to edit its name', () => {

            it('edit option exists for designer', () => {

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_EDIT;
                const userRole = RoleType.DESIGNER;
                const dictionaryTerm = {
                    designId: 'DESIGN1',
                    designVersionId: 'DESIGN_VERSION1',
                    domainTermOld: 'Term',
                    domainTermNew: 'Term',
                    sortingName: 'Term',
                    markInDesign: true,
                    isNew: true,
                    isChanged: false
                };

                const item = testDomainDictionaryTerm(dictionaryTerm, view, mode, userRole);

                const uiName = dictionaryTerm.domainTermNew + '-term';
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName);

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        describe('A term name being edited has an option to save changes', () => {

            it('save option exists for designer when editing', () => {

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_EDIT;
                const userRole = RoleType.DESIGNER;
                const dictionaryTerm = {
                    designId: 'DESIGN1',
                    designVersionId: 'DESIGN_VERSION1',
                    domainTermOld: 'Term',
                    domainTermNew: 'Term',
                    sortingName: 'Term',
                    markInDesign: true,
                    isNew: true,
                    isChanged: false
                };

                const item = testDomainDictionaryTerm(dictionaryTerm, view, mode, userRole);

                item.setState({termEditable: true});

                const uiName = dictionaryTerm.domainTermNew + '-term';
                const expectedUiItem = hashID(UI.OPTION_SAVE, uiName);

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('no edit option when editing', () => {

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_EDIT;
                const userRole = RoleType.DESIGNER;
                const dictionaryTerm = {
                    designId: 'DESIGN1',
                    designVersionId: 'DESIGN_VERSION1',
                    domainTermOld: 'Term',
                    domainTermNew: 'Term',
                    sortingName: 'Term',
                    markInDesign: true,
                    isNew: true,
                    isChanged: false
                };

                const item = testDomainDictionaryTerm(dictionaryTerm, view, mode, userRole);

                item.setState({termEditable: true});

                const uiName = dictionaryTerm.domainTermNew + '-term';
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName);

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('A term name being edited has an option to discard changes', () => {

            it('undo option exists for designer when editing', () => {

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_EDIT;
                const userRole = RoleType.DESIGNER;
                const dictionaryTerm = {
                    designId: 'DESIGN1',
                    designVersionId: 'DESIGN_VERSION1',
                    domainTermOld: 'Term',
                    domainTermNew: 'Term',
                    sortingName: 'Term',
                    markInDesign: true,
                    isNew: true,
                    isChanged: false
                };

                const item = testDomainDictionaryTerm(dictionaryTerm, view, mode, userRole);

                item.setState({termEditable: true});

                const uiName = dictionaryTerm.domainTermNew + '-term';
                const expectedUiItem = hashID(UI.OPTION_UNDO, uiName);

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        describe('A term name cannot be edited in View Only mode', () => {

            it('no edit for designer', () => {

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_VIEW;
                const userRole = RoleType.DESIGNER;
                const dictionaryTerm = {
                    designId: 'DESIGN1',
                    designVersionId: 'DESIGN_VERSION1',
                    domainTermOld: 'Term',
                    domainTermNew: 'Term',
                    sortingName: 'Term',
                    markInDesign: true,
                    isNew: true,
                    isChanged: false
                };

                const item = testDomainDictionaryTerm(dictionaryTerm, view, mode, userRole);

                const uiName = dictionaryTerm.domainTermNew + '-term';
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName);

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('Only a Designer can edit a Domain Dictionary term name', () => {

            it('no edit for developer', () => {

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_EDIT;
                const userRole = RoleType.DEVELOPER;
                const dictionaryTerm = {
                    designId: 'DESIGN1',
                    designVersionId: 'DESIGN_VERSION1',
                    domainTermOld: 'Term',
                    domainTermNew: 'Term',
                    sortingName: 'Term',
                    markInDesign: true,
                    isNew: true,
                    isChanged: false
                };

                const item = testDomainDictionaryTerm(dictionaryTerm, view, mode, userRole);

                const uiName = dictionaryTerm.domainTermNew + '-term';
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName);

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no edit for manager', () => {

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_EDIT;
                const userRole = RoleType.MANAGER;
                const dictionaryTerm = {
                    designId: 'DESIGN1',
                    designVersionId: 'DESIGN_VERSION1',
                    domainTermOld: 'Term',
                    domainTermNew: 'Term',
                    sortingName: 'Term',
                    markInDesign: true,
                    isNew: true,
                    isChanged: false
                };

                const item = testDomainDictionaryTerm(dictionaryTerm, view, mode, userRole);

                const uiName = dictionaryTerm.domainTermNew + '-term';
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName);

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

        });

        describe('When a term name is saved for a new term added the term definition becomes editable', () => {

            it('new term definition is editable', () => {

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_EDIT;
                const dictionaryTerm = {
                    designId: 'DESIGN1',
                    designVersionId: 'DESIGN_VERSION1',
                    domainTermOld: 'Term',
                    domainTermNew: 'Term',
                    sortingName: 'Term',
                    markInDesign: true,
                    isNew: true,
                    isChanged: true
                };

                const editable = DomainDictUiServices.isDefinitionAutoEditable(dictionaryTerm, view, mode);

                chai.assert.isTrue(editable, 'Definition was not editable');
            });


        });

    });

    describe('UC 703', () => {

        describe('A Domain Dictionary term has an option to edit is definition', () => {

            it('edit option exists for designer', () => {

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_EDIT;
                const userRole = RoleType.DESIGNER;
                const dictionaryTerm = {
                    designId: 'DESIGN1',
                    designVersionId: 'DESIGN_VERSION1',
                    domainTermOld: 'Term',
                    domainTermNew: 'Term',
                    sortingName: 'Term',
                    markInDesign: true,
                    isNew: true,
                    isChanged: false
                };

                const item = testDomainDictionaryTerm(dictionaryTerm, view, mode, userRole);

                const uiName = dictionaryTerm.domainTermNew + '-def';
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName);

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        describe('A term definition being edited has an option to save changes', () => {

            it('save option exists for designer when editing', () => {

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_EDIT;
                const userRole = RoleType.DESIGNER;
                const dictionaryTerm = {
                    designId: 'DESIGN1',
                    designVersionId: 'DESIGN_VERSION1',
                    domainTermOld: 'Term',
                    domainTermNew: 'Term',
                    sortingName: 'Term',
                    markInDesign: true,
                    isNew: true,
                    isChanged: false
                };

                const item = testDomainDictionaryTerm(dictionaryTerm, view, mode, userRole);

                item.setState({definitionEditable: true});

                const uiName = dictionaryTerm.domainTermNew + '-def';
                const expectedUiItem = hashID(UI.OPTION_SAVE, uiName);

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });

            it('no edit option when editing', () => {

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_EDIT;
                const userRole = RoleType.DESIGNER;
                const dictionaryTerm = {
                    designId: 'DESIGN1',
                    designVersionId: 'DESIGN_VERSION1',
                    domainTermOld: 'Term',
                    domainTermNew: 'Term',
                    sortingName: 'Term',
                    markInDesign: true,
                    isNew: true,
                    isChanged: false
                };

                const item = testDomainDictionaryTerm(dictionaryTerm, view, mode, userRole);

                item.setState({termEditable: true});

                const uiName = dictionaryTerm.domainTermNew + '-term';
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName);

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('A term definition being edited has an option to discard changes', () => {

            it('undo option exists for designer when editing', () => {

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_EDIT;
                const userRole = RoleType.DESIGNER;
                const dictionaryTerm = {
                    designId: 'DESIGN1',
                    designVersionId: 'DESIGN_VERSION1',
                    domainTermOld: 'Term',
                    domainTermNew: 'Term',
                    sortingName: 'Term',
                    markInDesign: true,
                    isNew: true,
                    isChanged: false
                };

                const item = testDomainDictionaryTerm(dictionaryTerm, view, mode, userRole);

                item.setState({definitionEditable: true});

                const uiName = dictionaryTerm.domainTermNew + '-def';
                const expectedUiItem = hashID(UI.OPTION_UNDO, uiName);

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        describe('A term definition cannot be edited in View Only mode', () => {

            it('no edit for designer', () => {

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_VIEW;
                const userRole = RoleType.DESIGNER;
                const dictionaryTerm = {
                    designId: 'DESIGN1',
                    designVersionId: 'DESIGN_VERSION1',
                    domainTermOld: 'Term',
                    domainTermNew: 'Term',
                    sortingName: 'Term',
                    markInDesign: true,
                    isNew: true,
                    isChanged: false
                };

                const item = testDomainDictionaryTerm(dictionaryTerm, view, mode, userRole);

                const uiName = dictionaryTerm.domainTermNew + '-def';
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName);

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('Only a Designer can edit a Domain Dictionary definition name', () => {

            it('no edit for developer', () => {

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_EDIT;
                const userRole = RoleType.DEVELOPER;
                const dictionaryTerm = {
                    designId: 'DESIGN1',
                    designVersionId: 'DESIGN_VERSION1',
                    domainTermOld: 'Term',
                    domainTermNew: 'Term',
                    sortingName: 'Term',
                    markInDesign: true,
                    isNew: true,
                    isChanged: false
                };

                const item = testDomainDictionaryTerm(dictionaryTerm, view, mode, userRole);

                const uiName = dictionaryTerm.domainTermNew + '-def';
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName);

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no edit for manager', () => {

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_EDIT;
                const userRole = RoleType.MANAGER;
                const dictionaryTerm = {
                    designId: 'DESIGN1',
                    designVersionId: 'DESIGN_VERSION1',
                    domainTermOld: 'Term',
                    domainTermNew: 'Term',
                    sortingName: 'Term',
                    markInDesign: true,
                    isNew: true,
                    isChanged: false
                };

                const item = testDomainDictionaryTerm(dictionaryTerm, view, mode, userRole);

                const uiName = dictionaryTerm.domainTermNew + '-def';
                const expectedUiItem = hashID(UI.OPTION_EDIT, uiName);

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

        });
    });

    describe('UC 704', () => {

        describe('A Domain Dictionary term has an option to remove it', () => {

            it('remove option exists for designer', () => {

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_EDIT;
                const userRole = RoleType.DESIGNER;
                const dictionaryTerm = {
                    designId: 'DESIGN1',
                    designVersionId: 'DESIGN_VERSION1',
                    domainTermOld: 'Term',
                    domainTermNew: 'Term',
                    sortingName: 'Term',
                    markInDesign: true,
                    isNew: false,
                    isChanged: true
                };

                const item = testDomainDictionaryTerm(dictionaryTerm, view, mode, userRole);

                const uiName = dictionaryTerm.domainTermNew + '-term';
                const expectedUiItem = hashID(UI.OPTION_REMOVE, uiName);

                chai.assert.equal(item.find(expectedUiItem).length, 1, expectedUiItem + ' not found');
            });
        });

        describe('A term definition cannot be removed in View Only mode', () => {

            it('no remove for designer', () => {

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_VIEW;
                const userRole = RoleType.DESIGNER;
                const dictionaryTerm = {
                    designId: 'DESIGN1',
                    designVersionId: 'DESIGN_VERSION1',
                    domainTermOld: 'Term',
                    domainTermNew: 'Term',
                    sortingName: 'Term',
                    markInDesign: true,
                    isNew: true,
                    isChanged: false
                };

                const item = testDomainDictionaryTerm(dictionaryTerm, view, mode, userRole);

                const uiName = dictionaryTerm.domainTermNew + '-term';
                const expectedUiItem = hashID(UI.OPTION_REMOVE, uiName);

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });
        });

        describe('Only a Designer can remove a Domain Dictionary term', () => {

            it('no remove for developer', () => {

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_EDIT;
                const userRole = RoleType.DEVELOPER;
                const dictionaryTerm = {
                    designId: 'DESIGN1',
                    designVersionId: 'DESIGN_VERSION1',
                    domainTermOld: 'Term',
                    domainTermNew: 'Term',
                    sortingName: 'Term',
                    markInDesign: true,
                    isNew: true,
                    isChanged: false
                };

                const item = testDomainDictionaryTerm(dictionaryTerm, view, mode, userRole);

                const uiName = dictionaryTerm.domainTermNew + '-term';
                const expectedUiItem = hashID(UI.OPTION_REMOVE, uiName);

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

            it('no remove for manager', () => {

                const view = ViewType.DESIGN_NEW;
                const mode = ViewMode.MODE_EDIT;
                const userRole = RoleType.MANAGER;
                const dictionaryTerm = {
                    designId: 'DESIGN1',
                    designVersionId: 'DESIGN_VERSION1',
                    domainTermOld: 'Term',
                    domainTermNew: 'Term',
                    sortingName: 'Term',
                    markInDesign: true,
                    isNew: true,
                    isChanged: false
                };

                const item = testDomainDictionaryTerm(dictionaryTerm, view, mode, userRole);

                const uiName = dictionaryTerm.domainTermNew + '-term';
                const expectedUiItem = hashID(UI.OPTION_REMOVE, uiName);

                chai.assert.equal(item.find(expectedUiItem).length, 0, expectedUiItem + ' was found');
            });

        });
    });

});