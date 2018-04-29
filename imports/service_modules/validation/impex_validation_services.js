
// Ultrawide Services
import { RoleType } from '../../constants/constants.js';
import { Validation, ImpExValidationErrors } from '../../constants/validation_errors.js';

//======================================================================================================================
//
// Validation Services for Backup.
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class ImpExValidationServicesClass{

    validateBackupDesign(userRole){

        return Validation.VALID;
    };

    validateRestoreDesign(user){

        if(!user){
            return ImpExValidationErrors.BACKUP_DESIGN_INVALID_ROLE_RESTORE;
        }

        if(!(user.isAdmin)){
            return ImpExValidationErrors.BACKUP_DESIGN_INVALID_ROLE_RESTORE;
        }

        return Validation.VALID;
    };

    validateArchiveDesign(user){

        if(!user){
            return ImpExValidationErrors.BACKUP_DESIGN_INVALID_ROLE_ARCHIVE;
        }

        if(!(user.isAdmin)){
            return ImpExValidationErrors.BACKUP_DESIGN_INVALID_ROLE_ARCHIVE;
        }

        return Validation.VALID;
    }
}

export const ImpExValidationServices = new ImpExValidationServicesClass();
