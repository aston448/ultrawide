
import {RoleType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, DesignUpdateMergeAction} from '../../imports/constants/constants.js'
import {DefaultItemNames, DefaultComponentNames} from '../../imports/constants/default_names.js';


class DomainDictionaryActions{

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

export default new DomainDictionaryActions();
