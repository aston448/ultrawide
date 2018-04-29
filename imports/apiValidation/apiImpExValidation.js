
// Ultrawide Services
import { ImpExValidationServices }          from '../service_modules/validation/impex_validation_services.js';

// Data Access
import { UserRoleData }                     from '../data/users/user_role_db.js';

//======================================================================================================================
//
// Validation API for Backup
//
//======================================================================================================================

class ImpExValidationApiClass{

    validateBackupDesign(userRole){

        return ImpExValidationServices.validateBackupDesign(userRole);

    };

    validateRestoreDesign(userId){

        const user = UserRoleData.getRoleByUserId(userId);

        return ImpExValidationServices.validateRestoreDesign(user);

    };

    validateArchiveDesign(userId){

        const user = UserRoleData.getRoleByUserId(userId);

        return ImpExValidationServices.validateArchiveDesign(user);
    }

}
export const ImpExValidationApi = new ImpExValidationApiClass();
