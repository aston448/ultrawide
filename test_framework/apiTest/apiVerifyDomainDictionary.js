import { Meteor } from 'meteor/meteor';

import { Designs }                  from '../../imports/collections/design/designs.js'
import { DesignVersions }           from '../../imports/collections/design/design_versions.js'
import { DesignVersionComponents }         from '../../imports/collections/design/design_version_components.js';
import { DomainDictionary }         from '../../imports/collections/design/domain_dictionary.js';
import { DefaultItemNames, DefaultComponentNames }         from '../../imports/constants/default_names.js';
import { ComponentType }            from '../../imports/constants/constants.js';

import TestDataHelpers              from '../test_modules/test_data_helpers.js'

Meteor.methods({

    'verifyDomainDictionary.termExistsCalled'(termName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const dictionaryTerm = DomainDictionary.findOne({designId: userContext.designId, designVersionId: userContext.designVersionId, domainTermNew: termName});

        if(!dictionaryTerm){
            throw new Meteor.Error("FAIL", "Dictionary entry " + termName + " not found.");
        } else {
            return true;
        }
    },

    'verifyDomainDictionary.termDoesNotExistCalled'(termName, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const dictionaryTerm = DomainDictionary.findOne({designId: userContext.designId, designVersionId: userContext.designVersionId, domainTermNew: termName});

        if(dictionaryTerm){
            throw new Meteor.Error("FAIL", "Dictionary entry " + termName + " was found.");
        } else {
            return true;
        }
    },

    'verifyDomainDictionary.termDefinitionIs'(termName, termDef, userName){

        const userContext = TestDataHelpers.getUserContext(userName);

        const dictionaryTerm = TestDataHelpers.getDomainDictionaryTerm(userContext.designId, userContext.designVersionId, termName);

        if(dictionaryTerm.domainTextRaw.blocks[0].text != termDef){
            throw new Meteor.Error("FAIL", "Expecting Dictionary def " + termDef + " but got " + dictionaryTerm.domainTextRaw.blocks[0].text);
        }
    },

});