
// Ultrawide Collections

// Ultrawide Services
import TextEditorValidationServices from '../service_modules/validation/text_editor_validation_services.js';

//======================================================================================================================
//
// Validation API for the Text Editor
//
//======================================================================================================================

class TextEditorValidationApi{

    validateSaveDesignComponentDetails(userRole){

        return TextEditorValidationServices.validateSaveDesignComponentDetails(userRole);
    };

    validateSaveDesignUpdateComponentDetails(userRole){

        return TextEditorValidationServices.validateSaveDesignUpdateComponentDetails(userRole);
    };

}
export default new TextEditorValidationApi();
