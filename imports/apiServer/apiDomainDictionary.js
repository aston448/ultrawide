import { Meteor } from 'meteor/meteor';

import  DomainDictionaryServices        from '../servicers/domain_dictionary_services.js';


Meteor.methods({

    // Add a new term to the domain dictionary
    'domainDictionary.addNewTerm'(designId, designVersionId){

        console.log('Adding new Domain Dictionary Term');
        DomainDictionaryServices.addNewTerm(designId, designVersionId);

    },

    'domainDictionary.updateTermName'(termId, newTermName){

        console.log('Updating Dictionary Term to ' + newTermName);
        DomainDictionaryServices.updateTermName(termId, newTermName);

    },

    'domainDictionary.updateTermDefinition'(termId, newTermDefinitionTextRaw){

        console.log('Updating Dictionary Term Definition');
        DomainDictionaryServices.updateTermDefinition(termId, newTermDefinitionTextRaw)

    },

    // Move a step to a new position in its current scenario
    'domainDictionary.removeTerm'(termId){

        console.log('Removing Dictionary Term ' + termId);
        DomainDictionaryServices.removeTerm(termId);

    },

});
