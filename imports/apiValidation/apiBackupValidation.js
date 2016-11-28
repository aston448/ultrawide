// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections
import { Designs } from '../collections/design/designs.js';

// Ultrawide Services
import { ViewType, RoleType } from '../constants/constants.js';
import { DesignValidationErrors } from '../constants/validation_errors.js';

import BackupValidationServices from '../service_modules/validation/backup_validation_services.js';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Backup Validation - Supports validations relating to a backups, restores and archiving
//
// ---------------------------------------------------------------------------------------------------------------------

class BackupValidationApi{

    validateBackupDesign(userRole){

        return BackupValidationServices.validateBackupDesign(userRole);

    };

}
export default new BackupValidationApi();
