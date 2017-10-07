
import { DomainDictionary } from '../../collections/design/domain_dictionary.js';

import { DefaultComponentNames, DefaultDetailsText }      from '../../constants/default_names.js';

class DomainDictionaryData{

    // INSERT ==========================================================================================================

    insertNewDictionaryTerm(designId, designVersionId, defaultRawText){

        DomainDictionary.insert(
            {
                designId: designId,
                designVersionId: designVersionId,
                domainTermOld: DefaultComponentNames.NEW_DICTIONARY_ENTRY_NAME,
                domainTermNew: DefaultComponentNames.NEW_DICTIONARY_ENTRY_NAME,
                domainTextRaw: defaultRawText,
                sortingName: 'AAAAA' + now,       // Will appear at start of list.  If more than one new added, in order
                markInDesign: true,
                isNew: true,
                isChanged: false
            }
        );
    }

    bulkInsertEntries(batchData){
        DomainDictionary.batchInsert(batchData);
    }

    // SELECT ==========================================================================================================

    getTermById(termId){

        return DomainDictionary.findOne({_id: termId});
    }

    getAllTerms(designId, designVersionId){

        return DomainDictionary.find(
            {
                designId: designId,
                designVersionId: designVersionId
            },
            {sort:{sortingName: 1}}     // The sorting name is the term name except when term is first created
        ).fetch();
    }


    // UPDATE ==========================================================================================================

    updateNewTermName(termId, oldName, newName, isChanged){

        // First time update, not a real change - also called on RESTORE
        return DomainDictionary.update(
            {_id: termId},
            {
                $set: {
                    domainTermOld: oldName,
                    domainTermNew: newName,
                    isChanged: isChanged
                }
            }
        );
    }

    updateExistingTermName(termId, newTermName){

        // Actual change to term name
        return DomainDictionary.update(
            {_id: termId},
            {
                $set: {
                    domainTermNew: newTermName,
                    sortingName: newTermName,       // Make sure term is correctly sorted
                    isChanged: true
                }
            }
        );
    }

    updateNewTermDefinition(termId, newTermDefinitionTextRaw){

        const term = this.getTermById(termId);

        return DomainDictionary.update(
            {_id: termId},
            {
                $set: {
                    domainTextRaw: newTermDefinitionTextRaw,
                    sortingName: term.domainTermNew,                // Once the definition is updated abandon any initial sorting name
                    isNew: false,                                   // And set a no longer new
                }
            }
        );
    }

    updateExistingTermDefinition(termId, newTermDefinitionTextRaw){

        return DomainDictionary.update(
            {_id: termId},
            {
                $set: {
                    domainTextRaw: newTermDefinitionTextRaw,
                }
            }
        );
    }

    // REMOVE ==========================================================================================================

    removeTerm(termId){

        DomainDictionary.remove({_id: termId});
    }
}

export default new DomainDictionaryData();