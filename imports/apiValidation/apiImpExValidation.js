
// Ultrawide Services
import { ImpExValidationServices }          from '../service_modules/validation/impex_validation_services.js';

// Data Access
import { UserRoleData }                     from '../data/users/user_role_db.js';
import { DesignData}                        from "../data/design/design_db";

//======================================================================================================================
//
// Validation API for Backup
//
//======================================================================================================================

class ImpExValidationApiClass{

    validateBackupDesign(userRole, designId){

        const design = DesignData.getDesignById(designId);

        return ImpExValidationServices.validateBackupDesign(userRole, design);

    };

    validateRestoreDesign(userId){

        const user = UserRoleData.getRoleByUserId(userId);

        return ImpExValidationServices.validateRestoreDesign(user);

    };

    validateArchiveDesign(userId, designId){

        const user = UserRoleData.getRoleByUserId(userId);
        const design = DesignData.getDesignById(designId);

        return ImpExValidationServices.validateArchiveDesign(user, design);
    }

    validateRebaseDesignVersion(userId){

        const user = UserRoleData.getRoleByUserId(userId);

        return ImpExValidationServices.validateRebaseDesignVersion(user);
    }

}
export const ImpExValidationApi = new ImpExValidationApiClass();
