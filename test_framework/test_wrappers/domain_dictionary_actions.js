
class DomainDictionaryActionsClass {

    designerAddsNewTerm(expectation){
        server.call('testDomainDictionary.addNewDomainTerm', 'gloria', expectation);
    }

    designerEditsTermNameFrom_To_(oldName, newName, expectation){
        server.call('testDomainDictionary.editDomainTermName', oldName, newName, 'gloria', expectation);
    }

    designerEditsTerm_DefinitionTo_(termName, newDefinition, expectation){
        server.call('testDomainDictionary.editDomainTermDefinition', termName, newDefinition, 'gloria', expectation);
    }

    designerRemovesTerm(termName, expectation){
        server.call('testDomainDictionary.removeDomainTerm', termName, 'gloria', expectation);
    }

}

export const DomainDictionaryActions = new DomainDictionaryActionsClass();
