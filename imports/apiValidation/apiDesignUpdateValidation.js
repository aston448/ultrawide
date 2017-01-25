
// Ultrawide Collections
import { DesignUpdates }    from '../collections/design_update/design_updates.js';
import { DesignVersions }   from '../collections/design/design_versions.js';
import { WorkPackages }     from '../collections/work/work_packages.js';

// Ultrawide Services
import DesignUpdateValidationServices from '../service_modules/validation/design_update_validation_services.js';

//======================================================================================================================
//
// Validation API for Design Update Items
//
//======================================================================================================================

class DesignUpdateValidationApi{

    validateAddDesignUpdate(userRole, designVersionId){

        const designVersion = DesignVersions.findOne({_id: designVersionId});

        return DesignUpdateValidationServices.validateAddDesignUpdate(userRole, designVersion.designVersionStatus);

    };

    validateUpdateDesignUpdateName(userRole, designUpdateId, newName){

        // Get all other designs apart from this one
        const thisDesignUpdate = DesignUpdates.findOne({_id: designUpdateId});
        const otherDesignUpdates = DesignUpdates.find({_id: {$ne: designUpdateId}, designVersionId: thisDesignUpdate.designVersionId}).fetch();

        return DesignUpdateValidationServices.validateUpdateDesignUpdateName(userRole, newName, otherDesignUpdates);

    };

    validateUpdateDesignUpdateReference(userRole, designUpdateId, newRef){

        // Get all other designs apart from this one
        const thisDesignUpdate = DesignUpdates.findOne({_id: designUpdateId});
        const otherDesignUpdates = DesignUpdates.find({_id: {$ne: designUpdateId}, designVersionId: thisDesignUpdate.designVersionId}).fetch();

        return DesignUpdateValidationServices.validateUpdateDesignUpdateReference(userRole, newRef, otherDesignUpdates);

    };

    validateEditDesignUpdate(userRole, designUpdateId){

        const designUpdate = DesignUpdates.findOne({_id: designUpdateId});

        return DesignUpdateValidationServices.validateEditDesignUpdate(userRole, designUpdate.updateStatus)
    };

    validatePublishDesignUpdate(userRole, designUpdateId){

        const designUpdate = DesignUpdates.findOne({_id: designUpdateId});

        return DesignUpdateValidationServices.validatePublishDesignUpdate(userRole, designUpdate.updateStatus)
    };

    validateWithdrawDesignUpdate(userRole, designUpdateId){

        const designUpdate = DesignUpdates.findOne({_id: designUpdateId});
        const workPackageCount = WorkPackages.find({
            designUpdateId: designUpdateId
        }).count();

        return DesignUpdateValidationServices.validateWithdrawDesignUpdate(userRole, designUpdate.updateStatus, workPackageCount);

    };

    validateViewDesignUpdate(userRole, designUpdateId){

        const designUpdate = DesignUpdates.findOne({_id: designUpdateId});

        return DesignUpdateValidationServices.validateViewDesignUpdate(userRole, designUpdate.updateStatus)
    };

    validateRemoveDesignUpdate(userRole, designUpdateId){

        const designUpdate = DesignUpdates.findOne({_id: designUpdateId});

        return DesignUpdateValidationServices.validateRemoveDesignUpdate(userRole, designUpdate);

    };

    validateUpdateMergeAction(userRole, designUpdateId){

        const designUpdate = DesignUpdates.findOne({_id: designUpdateId});

        return DesignUpdateValidationServices.validateMergeActions(userRole, designUpdate);
    }

}
export default new DesignUpdateValidationApi();
