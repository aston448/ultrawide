import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DomainDictionaryVerifications{

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

export default new DomainDictionaryVerifications();
