
// Ultrawide Collections
import { DomainDictionary } from '../collections/design/domain_dictionary.js';

// Ultrawide Services
import DomainDictionaryValidationServices from '../service_modules/validation/domain_dictionary_validation_services.js';

//======================================================================================================================
//
// Validation API for Domain Dictionary
//
//======================================================================================================================

class DomainDictionaryValidationApi{

    validateAddNewTerm(userRole, view, mode){

        return DomainDictionaryValidationServices.validateAddNewTerm(userRole, view, mode);
    };

    validateUpdateTermName(userRole, view, mode, termId, newTermName){

        // Get other terms that should not have the same name
        const thisTerm = DomainDictionary.findOne({_id: termId});

        const existingTerms = DomainDictionary.find({
            _id:                {$ne: termId},
            designId:           thisTerm.designId,
            designVersionId:    thisTerm.designVersionId,
        }).fetch();

        return DomainDictionaryValidationServices.validateUpdateTermName(userRole, view, mode, newTermName, existingTerms);
    };

    validateUpdateTermDefinition(userRole, view, mode){

        return DomainDictionaryValidationServices.validateUpdateTermDefinition(userRole, view, mode);
    };

    validateRemoveTerm(userRole, view, mode){

        return DomainDictionaryValidationServices.validateRemoveTerm(userRole, view, mode);
    }
}
export default new DomainDictionaryValidationApi();
