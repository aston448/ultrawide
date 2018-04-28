
// Ultrawide services
import { DefaultDetailsText } from '../../constants/default_names.js'

import { DesignComponentModules }  from '../../service_modules/design/design_component_service_modules.js';

import { DomainDictionaryData }    from '../../data/design/domain_dictionary_db.js';

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

            return DomainDictionaryData.insertNewDictionaryTerm(designId, designVersionId, DesignComponentModules.getRawTextFor(DefaultDetailsText.NEW_DICTIONARY_ENTRY_TEXT));
        }

    };

    updateTermName(termId, newTermName, oldTermName){

        if(Meteor.isServer) {
            // RESTORE: All terms will still be NEW

            const domainTerm = DomainDictionaryData.getTermById(termId);

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

                DomainDictionaryData.updateNewTermName(termId, oldName, newTermName, (newTermName !== oldName));

            } else {

                // Real update
                DomainDictionaryData.updateExistingTermName(termId, newTermName);
            }
        }
    };

    updateTermDefinition(termId, newTermDefinitionTextRaw){

        if(Meteor.isServer) {
            // RESTORE: All terms will still be NEW

            const term = DomainDictionaryData.getTermById(termId);

            if (term.isNew) {

                // New term having definition set for first time
                DomainDictionaryData.updateNewTermDefinition(termId, newTermDefinitionTextRaw);

            } else {

                // Just a regular change to the text
                DomainDictionaryData.updateExistingTermDefinition(termId, newTermDefinitionTextRaw);

            }
        }
    };

    removeTerm(termId){

        if(Meteor.isServer) {

            DomainDictionaryData.removeTerm(termId);
        }
    };
}

export default new DomainDictionaryServices();