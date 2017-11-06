import { Validation } from '../../constants/validation_errors.js'


import DocumentExportServices   from '../../server/doc/document_export_services.js';

//======================================================================================================================
//
// Meteor Validated Methods for Document Export
//
//======================================================================================================================

export const exportWordDoc = new ValidatedMethod({

    name: 'doc.exportWord',

    validate: new SimpleSchema({

    }).validator(),

    run({}){

        // const result = DesignValidationApi.validateAddDesign(userRole);
        //
        // if (result != Validation.VALID) {
        //     throw new Meteor.Error('design.addDesign.failValidation', result)
        // }

        try {
            if(Meteor.isServer) {
                DocumentExportServices.exportWordDocument();
            }
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});
