// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections

// Ultrawide Services
import { ViewType, RoleType } from '../../constants/constants.js';
import { Validation, BackupValidationErrors } from '../../constants/validation_errors.js';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Backup Validation - Supports validations relating to backups, restores and archiving
//
// ---------------------------------------------------------------------------------------------------------------------

class BackupValidationServices{

    validateBackupDesign(userRole){

        // To backup a Design, user must be a Designer or Manager
        if(!(userRole === RoleType.DESIGNER || userRole === RoleType.MANAGER)){ return BackupValidationErrors.BACKUP_DESIGN_INVALID_ROLE }

        return Validation.VALID;

    };



}
export default new BackupValidationServices();
