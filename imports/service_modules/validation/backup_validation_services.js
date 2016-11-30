
// Ultrawide Services
import { RoleType } from '../../constants/constants.js';
import { Validation, BackupValidationErrors } from '../../constants/validation_errors.js';

//======================================================================================================================
//
// Validation Services for Backup.
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class BackupValidationServices{

    validateBackupDesign(userRole){

        // To backup a Design, user must be a Designer or Manager
        if(!(userRole === RoleType.DESIGNER || userRole === RoleType.MANAGER)){ return BackupValidationErrors.BACKUP_DESIGN_INVALID_ROLE }

        return Validation.VALID;
    };
}

export default new BackupValidationServices();
