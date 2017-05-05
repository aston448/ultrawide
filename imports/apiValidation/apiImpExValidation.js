// Ultrawide Collections
import { UserRoles }            from '../collections/users/user_roles.js';

// Ultrawide Services
import ImpExValidationServices  from '../service_modules/validation/impex_validation_services.js';

//======================================================================================================================
//
// Validation API for Backup
//
//======================================================================================================================

class ImpExValidationApi{

    validateBackupDesign(userRole){

        return ImpExValidationServices.validateBackupDesign(userRole);

    };

    validateRestoreDesign(userId){

        const user = UserRoles.findOne({userId: userId});

        return ImpExValidationServices.validateRestoreDesign(user);

    };

}
export default new ImpExValidationApi();
