
import { ImpExValidationApi }      from '../apiValidation/apiImpExValidation.js';
import { ImpexServices }            from '../servicers/administration/impex_services.js';

import { Validation } from '../constants/validation_errors.js'

//======================================================================================================================
//
// Meteor Validated Methods for Import-Export
//
//======================================================================================================================

export const backupDesign = new ValidatedMethod({

    name: 'impex.backupDesign',

    validate: new SimpleSchema({
        designId: {type: String},
        userRole: {type: String}
    }).validator(),

    run({designId, userRole}){

        const result = ImpExValidationApi.validateBackupDesign(userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('impex.backupDesign.failValidation', result)
        }

        try {
            ImpExServices.backupDesign(designId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const restoreDesign = new ValidatedMethod({

    name: 'impex.restoreDesign',

    validate: new SimpleSchema({
        backupFileName: {type: String},
        userId:         {type: String}
    }).validator(),

    run({backupFileName, userId}){

        const result = ImpExValidationApi.validateRestoreDesign(userId);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('impex.restoreDesign.failValidation', result)
        }

        try {
            ImpExServices.restoreDesign(backupFileName);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const archiveDesign = new ValidatedMethod({

    name: 'impex.archiveDesign',

    validate: new SimpleSchema({
        designId:   {type: String},
        userId:     {type: String}
    }).validator(),

    run({designId, userId}){

        const result = ImpExValidationApi.validateArchiveDesign(userId);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('impex.archiveDesign.failValidation', result)
        }

        try {
            ImpExServices.archiveDesign(designId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});