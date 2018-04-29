
// Ultrawide Services
import { WorkPackageValidationServices }    from '../service_modules/validation/work_package_validation_services.js';

// Data Access
import { DesignVersionData }                from '../data/design/design_version_db.js';
import { DesignUpdateData }                 from '../data/design_update/design_update_db.js';
import { WorkPackageData }                  from '../data/work/work_package_db.js';
import {Validation} from "../constants/validation_errors";

//======================================================================================================================
//
// Validation API for Work Package Items
//
//======================================================================================================================

class WorkPackageValidationApiClass {

    validateAddWorkPackage(userRole, designVersionId, designUpdateId, workPackageType){

        const dv = DesignVersionData.getDesignVersionById(designVersionId);

        let du = null;
        if(designUpdateId !== 'NONE'){
            du = DesignUpdateData.getDesignUpdateById(designUpdateId);
        }

        return WorkPackageValidationServices.validateAddWorkPackage(userRole, dv, du, workPackageType)
    };

    validateUpdateWorkPackageName(userRole, workPackageId, newName){

        // Get other WPs that should not have the same name
        const thisWp = WorkPackageData.getWorkPackageById(workPackageId);

        const existingWps = WorkPackageData.getOtherWorkPackagesForContext(workPackageId, thisWp.designVersionId, thisWp.designUpdateId);

        return WorkPackageValidationServices.validateUpdateWorkPackageName(userRole, newName, existingWps);
    };

    validateUpdateWorkPackageLink(workPackageId, newLink){

        return Validation.VALID;
    }

    validatePublishWorkPackage(userRole, workPackageId){

        const wp = WorkPackageData.getWorkPackageById(workPackageId);

        return WorkPackageValidationServices.validatePublishWorkPackage(userRole, wp.workPackageStatus);
    };

    validateWithdrawWorkPackage(userRole, workPackageId){

        const wp = WorkPackageData.getWorkPackageById(workPackageId);

        return WorkPackageValidationServices.validateWithdrawWorkPackage(userRole, wp.workPackageStatus);
    };

    validateAdoptWorkPackage(userRole, workPackageId){

        const wp = WorkPackageData.getWorkPackageById(workPackageId);

        return WorkPackageValidationServices.validateAdoptWorkPackage(userRole, wp.workPackageStatus);
    };

    validateReleaseWorkPackage(userRole, userId, workPackageId){

        const wp = WorkPackageData.getWorkPackageById(workPackageId);

        return WorkPackageValidationServices.validateReleaseWorkPackage(userRole, userId, wp);
    };

    validateRemoveWorkPackage(userRole, workPackageId){

        const wp = WorkPackageData.getWorkPackageById(workPackageId);

        return WorkPackageValidationServices.validateRemoveWorkPackage(userRole, wp.workPackageStatus);
    };

    validateEditWorkPackage(userRole, workPackageId){

        const wp = WorkPackageData.getWorkPackageById(workPackageId);

        return WorkPackageValidationServices.validateEditWorkPackage(userRole, wp.workPackageStatus);
    };

    validateViewWorkPackage(userRole, workPackageId){

        const wp = WorkPackageData.getWorkPackageById(workPackageId);

        return WorkPackageValidationServices.validateViewWorkPackage(userRole, wp.workPackageStatus);
    };

    validateDevelopWorkPackage(userRole, userId, workPackageId){

        const wp = WorkPackageData.getWorkPackageById(workPackageId);

        return WorkPackageValidationServices.validateDevelopWorkPackage(userRole, userId, wp);
    };
}

export const WorkPackageValidationApi = new WorkPackageValidationApiClass();