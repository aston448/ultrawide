
// Ultrawide Collections
import { DomainDictionary } from '../../collections/design/domain_dictionary.js';

// Ultrawide services
import { DefaultComponentNames, DefaultDetailsText } from '../../constants/default_names.js'
import DesignComponentServices from '../../service_modules/design/design_component_service_modules.js';

//======================================================================================================================
//
// Server Code for Domain Dictionary.
//
// Methods called directly by Server API
//
//======================================================================================================================

class DomainDictionaryServices{

    addNewTerm(designId, designVersionId){

        if(Meteor.isServer) {

            const now = new Date().getTime();

            const domainTermId = DomainDictionary.insert(
                {
                    designId: designId,
                    designVersionId: designVersionId,
                    domainTermOld: DefaultComponentNames.NEW_DICTIONARY_ENTRY_NAME,
                    domainTermNew: DefaultComponentNames.NEW_DICTIONARY_ENTRY_NAME,
                    domainTextRaw: DesignComponentServices.getRawTextFor(DefaultDetailsText.NEW_DICTIONARY_ENTRY_TEXT),
                    sortingName: 'AAAAA' + now,       // Will appear at start of list.  If more than one new added, in order
                    markInDesign: true,
                    isNew: true,
                    isChanged: false
                }
            );

            return domainTermId;
        }

    };

    updateTermName(termId, newTermName, oldTermName){
        if(Meteor.isServer) {
            // RESTORE: All terms will be NEW as just been created with default values

            const domainTerm = DomainDictionary.findOne({_id: termId});

            // Don't count an update that makes no change
            if (domainTerm.domainTermNew === newTermName) {
                return;
            }

            if (domainTerm.isNew) {
                // First time update - not a real update
                let oldName = newTermName;

                if (oldTermName) {
                    // Only passed in on a restore of data
                    oldName = oldTermName;
                }

                DomainDictionary.update(
                    {_id: termId},
                    {
                        $set: {
                            domainTermOld: oldName,
                            domainTermNew: newTermName,
                            isChanged: (newTermName != oldName)  // Only will be true for restored data
                        }
                    }
                )

            } else {
                // Real update
                DomainDictionary.update(
                    {_id: termId},
                    {
                        $set: {
                            domainTermNew: newTermName,
                            sortingName: newTermName,       // Make sure term is correctly sorted
                            isChanged: true
                        }
                    }
                )
            }
        }
    };

    updateTermDefinition(termId, newTermDefinitionTextRaw){
        if(Meteor.isServer) {
            // RESTORE: All terms will still be NEW

            const term = DomainDictionary.findOne({_id: termId});

            if (term.isNew) {
                // New term having definition set for first time
                DomainDictionary.update(
                    {_id: termId},
                    {
                        $set: {
                            domainTextRaw: newTermDefinitionTextRaw,
                            sortingName: term.domainTermNew,                // Once the definition is updated abandon any initial sorting name
                            isNew: false,                                   // And set a no longer new
                        }
                    }
                );
            } else {
                // Just a regular change to the text
                DomainDictionary.update(
                    {_id: termId},
                    {
                        $set: {
                            domainTextRaw: newTermDefinitionTextRaw,
                        }
                    }
                );
            }
        }
    };

    removeTerm(termId){
        if(Meteor.isServer) {
            DomainDictionary.remove({_id: termId});
        }
    };
}

export default new DomainDictionaryServices();