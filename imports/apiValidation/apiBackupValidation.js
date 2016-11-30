// Ultrawide Collections

// Ultrawide Services
import BackupValidationServices from '../service_modules/validation/backup_validation_services.js';

//======================================================================================================================
//
// Validation API for Backup
//
//======================================================================================================================

class BackupValidationApi{

    validateBackupDesign(userRole){

        return BackupValidationServices.validateBackupDesign(userRole);

    };

}
export default new BackupValidationApi();
