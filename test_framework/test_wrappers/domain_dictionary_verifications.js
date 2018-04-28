
class DomainDictionaryVerificationsClass {

    termExistsForDesignerCalled(termName){
        server.call('verifyDomainDictionary.termExistsCalled', termName, 'gloria',
            (function(error, result){
                return(error === null);
            })
        );
    }

    termDoesNotExistForDesignerCalled(termName){
        server.call('verifyDomainDictionary.termDoesNotExistCalled', termName, 'gloria',
            (function(error, result){
                return(error === null);
            })
        );
    }

    termDefinitionForTerm_ForDesignerIs(termName, termDefinition){
        server.call('verifyDomainDictionary.termDefinitionIs', termName, termDefinition, 'gloria',
            (function(error, result){
                return(error === null);
            })
        );
    }

}

export const DomainDictionaryVerifications = new DomainDictionaryVerificationsClass();
