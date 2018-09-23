
// Ultrawide Services
import { DesignStatus } from '../../constants/constants.js';
import { Validation, ImpExValidationErrors } from '../../constants/validation_errors.js';

//======================================================================================================================
//
// Validation Services for Backup.
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class ImpExValidationServicesClass{

    validateBackupDesign(userRole, design){

        // Cannot backup archived Design
        if(design.designStatus === DesignStatus.DESIGN_ARCHIVED){
            return ImpExValidationErrors.BACKUP_DESIGN_INVALID_STATUS_ARCHIVED;
        }

        return Validation.VALID;
    };

    validateRestoreDesign(user){

        if(!user){
            return ImpExValidationErrors.RESTORE_DESIGN_INVALID_ROLE;
        }

        if(!(user.isAdmin)){
            return ImpExValidationErrors.RESTORE_DESIGN_INVALID_ROLE;
        }

        return Validation.VALID;
    };

    validateArchiveDesign(user, design){

        // Cannot archive a removable design
        if(design.isRemovable){
            return ImpExValidationErrors.ARCHIVE_DESIGN_INVALID_STATUS_REMOVABLE;
        }

        if(!user){
            return ImpExValidationErrors.ARCHIVE_DESIGN_INVALID_ROLE;
        }

        // Only admin user can archive
        if(!(user.isAdmin)){
            return ImpExValidationErrors.ARCHIVE_DESIGN_INVALID_ROLE;
        }

        return Validation.VALID;
    }

    validateRebaseDesignVersion(user){


        if(!user){
            return ImpExValidationErrors.REBASE_DESIGN_INVALID_ROLE;
        }

        // Only admin user can rebase
        if(!(user.isAdmin)){
            return ImpExValidationErrors.REBASE_DESIGN_INVALID_ROLE;
        }

        return Validation.VALID;
    }
}

export const ImpExValidationServices = new ImpExValidationServicesClass();
