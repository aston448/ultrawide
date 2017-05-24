
import { Validation } from '../constants/validation_errors.js'

import DomainDictionaryServices         from '../servicers/design/domain_dictionary_services.js';
import DomainDictionaryValidationApi    from '../apiValidation/apiDomainDictionaryValidation.js';

//======================================================================================================================
//
// Meteor Validated Methods for Domain Dictionary
//
//======================================================================================================================

export const addNewTerm = new ValidatedMethod({

    name: 'domainDictionary.addNewTerm',

    validate: new SimpleSchema({
        userRole:           {type: String},
        view:               {type: String},
        mode:               {type: String},
        designId:           {type: String},
        designVersionId:    {type: String}
    }).validator(),

    run({userRole, view, mode, designId, designVersionId}){

        // Server validation
        const result = DomainDictionaryValidationApi.validateAddNewTerm(userRole, view, mode);

        if (result != Validation.VALID) {
            throw new Meteor.Error('domainDictionary.addNewTerm.failValidation', result)
        }

        // Server action
        try {
            DomainDictionaryServices.addNewTerm(designId, designVersionId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const updateTermName = new ValidatedMethod({

    name: 'domainDictionary.updateTermName',

    validate: new SimpleSchema({
        userRole:           {type: String},
        view:               {type: String},
        mode:               {type: String},
        termId:             {type: String},
        newName:            {type: String}
    }).validator(),

    run({userRole, view, mode, termId, newName}){

        // Server validation
        const result = DomainDictionaryValidationApi.validateUpdateTermName(userRole, view, mode, termId, newName);

        if (result != Validation.VALID) {
            throw new Meteor.Error('domainDictionary.updateTermName.failValidation', result)
        }

        // Server action
        try {
            DomainDictionaryServices.updateTermName(termId, newName, null);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const updateTermDefinition = new ValidatedMethod({

    name: 'domainDictionary.updateTermDefinition',

    validate: new SimpleSchema({
        userRole:           {type: String},
        view:               {type: String},
        mode:               {type: String},
        termId:             {type: String},
        newDefinitionRaw:   {type: Object, blackbox: true}
    }).validator(),

    run({userRole, view, mode, termId, newDefinitionRaw}){

        // Server validation
        const result = DomainDictionaryValidationApi.validateUpdateTermDefinition(userRole, view, mode);

        if (result != Validation.VALID) {
            throw new Meteor.Error('domainDictionary.updateTermDefinition.failValidation', result)
        }

        // Server action
        try {
            DomainDictionaryServices.updateTermDefinition(termId, newDefinitionRaw);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const removeTerm = new ValidatedMethod({

    name: 'domainDictionary.removeTerm',

    validate: new SimpleSchema({
        userRole:           {type: String},
        view:               {type: String},
        mode:               {type: String},
        termId:             {type: String}
    }).validator(),

    run({userRole, view, mode, termId}){

        // Server validation
        const result = DomainDictionaryValidationApi.validateRemoveTerm(userRole, view, mode);

        if (result != Validation.VALID) {
            throw new Meteor.Error('domainDictionary.removeTerm.failValidation', result)
        }

        // Server action
        try {
            DomainDictionaryServices.removeTerm(termId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});
