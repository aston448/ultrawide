
import BackupValidationApi      from '../apiValidation/apiBackupValidation.js';
import ImpExServices            from '../servicers/administration/impex_services.js';

import { Validation } from '../constants/validation_errors.js'

//======================================================================================================================
//
// Meteor Validated Methods for Backup
//
//======================================================================================================================

export const backupDesign = new ValidatedMethod({

    name: 'backup.backupDesign',

    validate: new SimpleSchema({
        designId: {type: String},
        userRole: {type: String}
    }).validator(),

    run({designId, userRole}){

        const result = BackupValidationApi.validateBackupDesign(userRole);

        if (result != Validation.VALID) {
            throw new Meteor.Error('backup.backupDesign.failValidation', result)
        }

        try {
            ImpExServices.backupDesign(designId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.error, e.stack)
        }
    }

});
