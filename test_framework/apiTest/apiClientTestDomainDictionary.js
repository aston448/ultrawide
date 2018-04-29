import { Meteor } from 'meteor/meteor';

import { ClientDomainDictionaryServices }   from '../../imports/apiClient/apiClientDomainDictionary.js'
import { TestDataHelpers }                  from '../test_modules/test_data_helpers.js'

import {ViewType, ViewMode, RoleType} from '../../imports/constants/constants.js';

Meteor.methods({

    'testDomainDictionary.addNewDomainTerm'(userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const view = ViewType.DESIGN_NEW;
        const mode = ViewMode.MODE_EDIT;
        const userRole = RoleType.DESIGNER;
        const userContext = TestDataHelpers.getUserContext(userName);


        const outcome = ClientDomainDictionaryServices.addNewDictionaryTerm(userRole, view, mode, userContext.designId, userContext.designVersionId);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Add Dictionary Term');

    },

    'testDomainDictionary.editDomainTermName'(oldName, newName, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const view = ViewType.DESIGN_NEW;
        const mode = ViewMode.MODE_EDIT;
        const userRole = RoleType.DESIGNER;
        const userContext = TestDataHelpers.getUserContext(userName);
        const dictionaryEntry = TestDataHelpers.getDomainDictionaryTerm(userContext.designId, userContext.designVersionId, oldName);

        const outcome = ClientDomainDictionaryServices.updateDictionaryTerm(userRole, view, mode, dictionaryEntry._id, newName);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Edit Term Name');
    },

    'testDomainDictionary.editDomainTermDefinition'(termName, newDef, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const view = ViewType.DESIGN_NEW;
        const mode = ViewMode.MODE_EDIT;
        const userRole = RoleType.DESIGNER;
        const userContext = TestDataHelpers.getUserContext(userName);
        const dictionaryEntry = TestDataHelpers.getDomainDictionaryTerm(userContext.designId, userContext.designVersionId, termName);

        const rawText = TestDataHelpers.getRawTextFor(newDef);

        const outcome = ClientDomainDictionaryServices.updateDictionaryTermDefinition(userRole, view, mode, dictionaryEntry._id, rawText);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Edit Term Def');
    },


    'testDomainDictionary.removeDomainTerm'(termName, userName, expectation){

        expectation = TestDataHelpers.getExpectation(expectation);

        const view = ViewType.DESIGN_NEW;
        const mode = ViewMode.MODE_EDIT;
        const userRole = RoleType.DESIGNER;
        const userContext = TestDataHelpers.getUserContext(userName);
        const dictionaryEntry = TestDataHelpers.getDomainDictionaryTerm(userContext.designId, userContext.designVersionId, termName);

        const outcome = ClientDomainDictionaryServices.removeDictionaryTerm(userRole, view, mode, dictionaryEntry._id);

        TestDataHelpers.processClientCallOutcome(outcome, expectation, 'Remove Dictionary Term');
    },
});
