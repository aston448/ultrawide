
// Ultrawide Services
import DesignUpdateValidationServices   from '../service_modules/validation/design_update_validation_services.js';

// Data Access
import { DesignVersionData }                from '../data/design/design_version_db.js';
import { DesignUpdateData }                 from '../data/design_update/design_update_db.js';


//======================================================================================================================
//
// Validation API for Design Update Items
//
//======================================================================================================================

class DesignUpdateValidationApiClass{

    validateAddDesignUpdate(userRole, designVersionId){

        const designVersion = DesignVersionData.getDesignVersionById(designVersionId);

        return DesignUpdateValidationServices.validateAddDesignUpdate(userRole, designVersion.designVersionStatus);

    };

    validateUpdateDesignUpdateName(userRole, designUpdateId, newName){

        // Get all other designs apart from this one
        const thisDesignUpdate = DesignUpdateData.getDesignUpdateById(designUpdateId);

        const otherDesignUpdates = DesignVersionData.getOtherUpdates(designUpdateId, thisDesignUpdate.designVersionId);

        return DesignUpdateValidationServices.validateUpdateDesignUpdateName(userRole, newName, otherDesignUpdates);
    };

    validateUpdateDesignUpdateReference(userRole, designUpdateId, newRef){

        // Currently there is no restriction on duplicate references so other params not needed

        return DesignUpdateValidationServices.validateUpdateDesignUpdateReference(userRole);

    };

    validateEditDesignUpdate(userRole, designUpdateId){

        const designUpdate = DesignUpdateData.getDesignUpdateById(designUpdateId);

        return DesignUpdateValidationServices.validateEditDesignUpdate(userRole, designUpdate.updateStatus)
    };

    validatePublishDesignUpdate(userRole, designUpdateId){

        const designUpdate = DesignUpdateData.getDesignUpdateById(designUpdateId);

        return DesignUpdateValidationServices.validatePublishDesignUpdate(userRole, designUpdate.updateStatus)
    };

    validateWithdrawDesignUpdate(userRole, designUpdateId){

        const designUpdate = DesignUpdateData.getDesignUpdateById(designUpdateId);
        const workPackageCount = DesignUpdateData.getWorkPackageCount(designUpdateId);

        return DesignUpdateValidationServices.validateWithdrawDesignUpdate(userRole, designUpdate.updateStatus, workPackageCount);

    };

    validateViewDesignUpdate(userRole, designUpdateId){

        const designUpdate = DesignUpdateData.getDesignUpdateById(designUpdateId);

        return DesignUpdateValidationServices.validateViewDesignUpdate(userRole, designUpdate.updateStatus)
    };

    validateRemoveDesignUpdate(userRole, designUpdateId){

        const designUpdate = DesignUpdateData.getDesignUpdateById(designUpdateId);

        return DesignUpdateValidationServices.validateRemoveDesignUpdate(userRole, designUpdate.updateStatus);

    };

    validateUpdateMergeAction(userRole, designUpdateId){

        const designUpdate = DesignUpdateData.getDesignUpdateById(designUpdateId);

        return DesignUpdateValidationServices.validateMergeActions(userRole, designUpdate);
    }

}
export const DesignUpdateValidationApi = new DesignUpdateValidationApiClass();
