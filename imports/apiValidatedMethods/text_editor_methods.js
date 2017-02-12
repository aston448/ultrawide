import { Validation } from '../constants/validation_errors.js'

import TextEditorValidationApi      from '../apiValidation/apiTextEditorValidation.js';
import TextEditorServices           from '../servicers/design/text_editor_services.js';

//======================================================================================================================
//
// Meteor Validated Methods for the Text Editor
//
//======================================================================================================================

export const saveDesignComponentText = new ValidatedMethod({

    name: 'textEditor.saveDesignComponentText',

    validate: new SimpleSchema({
        userRole:           {type: String},
        designComponentId:  {type: String},
        newRawText:         {type: Object, blackbox: true}
    }).validator(),

    run({userRole, designComponentId, newRawText}){

        const result = TextEditorValidationApi.validateSaveDesignComponentDetails(userRole);

        if (result != Validation.VALID) {
            throw new Meteor.Error('textEditor.saveDesignComponentText.failValidation', result)
        }

        try {
            TextEditorServices.saveText(designComponentId, newRawText);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('textEditor.saveDesignComponentText.fail', e)
        }
    }

});

export const saveDesignUpdateComponentText = new ValidatedMethod({

    name: 'textEditor.saveDesignUpdateComponentText',

    validate: new SimpleSchema({
        userRole:                   {type: String},
        designUpdateComponentId:    {type: String},
        newRawText:                 {type: Object, blackbox: true}
    }).validator(),

    run({userRole, designUpdateComponentId, newRawText}){

        const result = TextEditorValidationApi.validateSaveDesignUpdateComponentDetails(userRole);

        if (result != Validation.VALID) {
            throw new Meteor.Error('textEditor.saveDesignUpdateComponentText.failValidation', result)
        }

        try {
            TextEditorServices.saveUpdateText(designUpdateComponentId, newRawText);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('textEditor.saveDesignUpdateComponentText.fail', e)
        }
    }

});
