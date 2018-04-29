
// Ultrawide Services
import { ViewType, ViewMode, RoleType } from '../../constants/constants.js';
import { Validation, DomainDictionaryValidationErrors } from '../../constants/validation_errors.js';

//======================================================================================================================
//
// Validation Services for Domain Dictionary.
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================
class DomainDictionaryValidationServicesClass {

    validateAddNewTerm(userRole, view, mode){

        // To add a Term, user must be a Designer
        if(userRole !== RoleType.DESIGNER){
            return DomainDictionaryValidationErrors.DICTIONARY_INVALID_ROLE_ADD;
        }

        // View must be a Design Edit
        if(!(view === ViewType.DESIGN_NEW || view === ViewType.DESIGN_PUBLISHED || view === ViewType.DESIGN_UPDATE_EDIT)){
            return DomainDictionaryValidationErrors.DICTIONARY_INVALID_VIEW_ADD;
        }

        // Must be in edit mode
        if(mode !== ViewMode.MODE_EDIT){
            return DomainDictionaryValidationErrors.DICTIONARY_INVALID_MODE_ADD;
        }

        return Validation.VALID;
    };

    validateUpdateTermName(userRole, view, mode, newTermName, otherTerms){

        // To edit a Term, user must be a Designer
        if(userRole !== RoleType.DESIGNER){
            return DomainDictionaryValidationErrors.DICTIONARY_INVALID_ROLE_EDIT;
        }

        // View must be a Design Edit
        if(!(view === ViewType.DESIGN_NEW || view === ViewType.DESIGN_PUBLISHED || view === ViewType.DESIGN_UPDATE_EDIT)){
            return DomainDictionaryValidationErrors.DICTIONARY_INVALID_VIEW_EDIT;
        }

        // Must be in edit mode
        if(mode !== ViewMode.MODE_EDIT){
            return DomainDictionaryValidationErrors.DICTIONARY_INVALID_MODE_EDIT;
        }

        // New Term must not be an existing one
        let duplicate = false;
        otherTerms.forEach((term) => {

            if (term.domainTermNew === newTermName){
                duplicate = true;
            }
        });

        if(duplicate){
            return DomainDictionaryValidationErrors.DICTIONARY_INVALID_TERM_DUPLICATE;
        }

        return Validation.VALID;
    };

    validateUpdateTermDefinition(userRole, view, mode){

        // To edit a Term, user must be a Designer
        if(userRole !== RoleType.DESIGNER){
            return DomainDictionaryValidationErrors.DICTIONARY_INVALID_ROLE_EDIT;
        }

        // View must be a Design Edit
        if(!(view === ViewType.DESIGN_NEW || view === ViewType.DESIGN_PUBLISHED || view === ViewType.DESIGN_UPDATE_EDIT)){
            return DomainDictionaryValidationErrors.DICTIONARY_INVALID_VIEW_EDIT;
        }

        // Must be in edit mode
        if(mode !== ViewMode.MODE_EDIT){
            return DomainDictionaryValidationErrors.DICTIONARY_INVALID_MODE_EDIT;
        }

        return Validation.VALID;
    };

    validateRemoveTerm(userRole, view, mode){

        // To remove a Term, user must be a Designer
        if(userRole !== RoleType.DESIGNER){
            return DomainDictionaryValidationErrors.DICTIONARY_INVALID_ROLE_EDIT;
        }

        // View must be a Design Edit
        if(!(view === ViewType.DESIGN_NEW || view === ViewType.DESIGN_PUBLISHED || view === ViewType.DESIGN_UPDATE_EDIT)){
            return DomainDictionaryValidationErrors.DICTIONARY_INVALID_VIEW_EDIT;
        }

        // Must be in edit mode
        if(mode !== ViewMode.MODE_EDIT){
            return DomainDictionaryValidationErrors.DICTIONARY_INVALID_MODE_EDIT;
        }

        return Validation.VALID;
    }


}
export const DomainDictionaryValidationServices = new DomainDictionaryValidationServicesClass();
