
// Ultrawide Collections
import { DesignVersions }   from '../collections/design/design_versions.js';
import { DesignUpdates }    from '../collections/design_update/design_updates.js';
import { WorkPackages }     from '../collections/work/work_packages.js';

// Ultrawide Services
import WorkPackageValidationServices from '../service_modules/validation/work_package_validation_services.js';

//======================================================================================================================
//
// Validation API for Work Package Items
//
//======================================================================================================================

class WorkPackageValidationApi {

    validateAddWorkPackage(userRole, designVersionId, designUpdateId, workPackageType){

        const dv = DesignVersions.findOne({_id: designVersionId});

        let du = null;
        if(designUpdateId != 'NONE'){
            du = DesignUpdates.findOne({_id: designUpdateId});
        }

        return WorkPackageValidationServices.validateAddWorkPackage(userRole, dv, du, workPackageType)
    };

    validateUpdateWorkPackageName(userRole, workPackageId, newName){

        // Get other WPs that should not have the same name
        const thisWp = WorkPackages.findOne({_id: workPackageId});

        const existingWps = WorkPackages.find({
            _id:                {$ne: workPackageId},
            designVersionId:    thisWp.designVersionId,
            designUpdateId:     thisWp.designUpdateId
        }).fetch();

        return WorkPackageValidationServices.validateUpdateWorkPackageName(userRole, newName, existingWps);
    };

    validatePublishWorkPackage(userRole, workPackageId){

        const wp = WorkPackages.findOne({_id: workPackageId});

        return WorkPackageValidationServices.validatePublishWorkPackage(userRole, wp.workPackageStatus);
    };

    validateRemoveWorkPackage(userRole, workPackageId){

        const wp = WorkPackages.findOne({_id: workPackageId});

        return WorkPackageValidationServices.validateRemoveWorkPackage(userRole, wp.workPackageStatus);
    };

    validateEditWorkPackage(userRole, workPackageId){

        const wp = WorkPackages.findOne({_id: workPackageId});

        return WorkPackageValidationServices.validateEditWorkPackage(userRole, wp.workPackageStatus);
    };

    validateViewWorkPackage(userRole, workPackageId){

        const wp = WorkPackages.findOne({_id: workPackageId});

        return WorkPackageValidationServices.validateViewWorkPackage(userRole, wp.workPackageStatus);
    };

    validateDevelopWorkPackage(userRole, workPackageId){

        //TODO add in adoption validation
        const wp = WorkPackages.findOne({_id: workPackageId});

        return WorkPackageValidationServices.validateDevelopWorkPackage(userRole, wp.workPackageStatus);
    };
}

export default new WorkPackageValidationApi();