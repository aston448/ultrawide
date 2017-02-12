
// Ultrawide Services
import { RoleType } from '../../constants/constants.js';
import { Validation, TextEditorValidationErrors } from '../../constants/validation_errors.js';

//======================================================================================================================
//
// Validation Services for the Text Editor.
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class TextEditorValidationServices{

    validateSaveDesignComponentDetails(userRole){

        // User must be a Designer
        if(!(userRole === RoleType.DESIGNER)){ return TextEditorValidationErrors.TEXT_EDITOR_INVALID_ROLE_SAVE }

        return Validation.VALID;
    };

    validateSaveDesignUpdateComponentDetails(userRole){

        // User must be a Designer
        if(!(userRole === RoleType.DESIGNER)){ return TextEditorValidationErrors.TEXT_EDITOR_INVALID_ROLE_SAVE }

        return Validation.VALID;
    };



}
export default new TextEditorValidationServices();
