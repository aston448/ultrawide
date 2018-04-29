
// Ultrawide Services
import { DomainDictionaryValidationServices }   from '../service_modules/validation/domain_dictionary_validation_services.js';

// Data Access
import { DesignVersionData }                    from '../data/design/design_version_db.js';
import { DomainDictionaryData }                from '../data/design/domain_dictionary_db.js';


//======================================================================================================================
//
// Validation API for Domain Dictionary
//
//======================================================================================================================

class DomainDictionaryValidationApiClass {

    validateAddNewTerm(userRole, view, mode){

        return DomainDictionaryValidationServices.validateAddNewTerm(userRole, view, mode);
    };

    validateUpdateTermName(userRole, view, mode, termId, newTermName){

        // Get other terms that should not have the same name
        const thisTerm = DomainDictionaryData.getTermById(termId);

        const existingTerms = DesignVersionData.getOtherDomainDictionaryEntries(
            termId,
            thisTerm.designId,
            thisTerm.designVersionId
        );

        return DomainDictionaryValidationServices.validateUpdateTermName(userRole, view, mode, newTermName, existingTerms);
    };

    validateUpdateTermDefinition(userRole, view, mode){

        return DomainDictionaryValidationServices.validateUpdateTermDefinition(userRole, view, mode);
    };

    validateRemoveTerm(userRole, view, mode){

        return DomainDictionaryValidationServices.validateRemoveTerm(userRole, view, mode);
    }
}
export const DomainDictionaryValidationApi = new DomainDictionaryValidationApiClass();
