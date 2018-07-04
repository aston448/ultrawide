import React from 'react';


import { render } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';


import { ViewMode, ViewType, DisplayContext, RoleType, ItemType, DetailsViewType} from '../../../constants/constants.js'

import { AddActionIds} from "../../../constants/ui_context_ids";


import {UI} from "../../../constants/ui_context_ids";
import {hashID} from "../../../common/utils";
import {DomainDictionaryTerm} from "./DomainDictionaryTerm";
import {DomainDictUiServices} from "../../../ui_modules/domain_dictionary";


describe('JSX: DetailsViewFooter', () => {

    function decoratorFunction(){};

    function testDomainDictionaryTerm(dictionaryTerm, view, mode, userRole) {

        const userContext = {
            designId: 'DESIGN1',
            designVersionId: 'DESIGN_VERSION1'
        };

        return render(
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