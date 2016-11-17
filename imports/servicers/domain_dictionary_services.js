
import {DomainDictionary} from '../collections/design/domain_dictionary.js';

import {LogLevel} from '../constants/constants.js';
import {log} from '../common/utils.js';

class DomainDictionaryServices{

    addNewTerm(designId, designVersionId){

        const now = new Date().getTime();

        const domainTermId = DomainDictionary.insert(
            {
                designId:               designId,
                designVersionId:        designVersionId,
                domainTermOld:          'New Domain Term',
                domainTermNew:          'New Domain Term',
                domainTextRaw:          this.getDefaultDomainDefinitionTextRaw(),
                sortingName:            'ZZZZZ' + now,       // Will appear at end of list.  If more than one new added, in order
                markInDesign:           true,
                isNew:                  true,
                isChanged:              false
            }
        );

        return domainTermId;

    };

    updateTermName(termId, newTermName, oldTermName){
        // RESTORE: All terms will be NEW as just been created with default values

        const domainTerm = DomainDictionary.findOne({_id: termId});

        // Don't count an update that makes no change
        if(domainTerm.domainTermNew === newTermName){
            return;
        }

        if(domainTerm.isNew){
            // First time update - not a real update
            let oldName = newTermName;

            if(oldTermName){
                // Only passed in on a restore of data
                oldName = oldTermName;
            }

            DomainDictionary.update(
                {_id: termId},
                {
                    $set:{
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
                    $set:{
                        domainTermNew: newTermName,
                        sortingName: newTermName,       // Make sure term is correctly sorted
                        isChanged: true
                    }
                }
            )
        }
    };

    updateTermDefinition(termId, newTermDefinitionTextRaw){
        // RESTORE: All terms will still be NEW

        const term = DomainDictionary.findOne({_id: termId});

        if(term.isNew){
            // New term having definition set for first time
            DomainDictionary.update(
                {_id: termId},
                {
                    $set:{
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
                    $set:{
                        domainTextRaw: newTermDefinitionTextRaw,
                    }
                }
            );
        }


    };

    removeTerm(termId){

        DomainDictionary.remove({_id: termId});
    };

    getDefaultDomainDefinitionTextRaw(){

        return {
            "entityMap" : {  },
            "blocks" : [
                { "key" : "5efv7", "text" : "Enter definition for Domain Term here...",
                    "type" : "unstyled",
                    "depth" : 0,
                    "inlineStyleRanges" : [ ],
                    "entityRanges" : [ ],
                    "data" : {  }
                }
            ]
        };
    }
}

export default new DomainDictionaryServices();