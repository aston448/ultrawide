
// Ultrawide Services
import { RoleType, DesignVersionStatus, DesignUpdateStatus } from '../../constants/constants.js';
import { Validation, DesignUpdateValidationErrors } from '../../constants/validation_errors.js';

//======================================================================================================================
//
// Validation Services for Design Update Items.
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class DesignUpdateValidationServices{

    validateAddDesignUpdate(userRole, designVersionStatus){

        // To add a Design Update, user must be a Designer
        if(userRole != RoleType.DESIGNER){
            return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_ADD;
        }

        // The Design Version must be Updatable
        if(designVersionStatus != DesignVersionStatus.VERSION_UPDATABLE){
            return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_ADD;
        }

        return Validation.VALID;

    };

    validateUpdateDesignUpdateName(userRole, newName, otherDesignUpdates){

        // To update a Design Update Name, user must be a Designer
        if(userRole != RoleType.DESIGNER){
            return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_UPDATE;
        }

        // The new name must not be the same as other Design Updates for the Design Version
        let duplicate = false;
        otherDesignUpdates.forEach((designUpdate) => {
            if(designUpdate.updateName === newName){
                duplicate = true;
            }
        });

        if(duplicate){
            return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_NAME_DUPLICATE;
        } else {
            return Validation.VALID;
        }

    };

    validateUpdateDesignUpdateReference(userRole){

        // To update a Design Update Name, user must be a Designer
        if(userRole != RoleType.DESIGNER){
            return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_UPDATE;
        }



        return Validation.VALID;
    };

    validateEditDesignUpdate(userRole, designUpdateStatus){

        // Only a designer can edit Design Updates
        if(userRole != RoleType.DESIGNER){
            return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_EDIT;
        }

        // Completed or Ignored Design Updates cannot be edited
        if(designUpdateStatus === DesignUpdateStatus.UPDATE_MERGED || designUpdateStatus === DesignUpdateStatus.UPDATE_IGNORED){
            return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_EDIT;
        }

        return Validation.VALID;
    };

    validateViewDesignUpdate(userRole, designUpdateStatus){

        // New Design Updates cannot be viewed unless you are a Designer
        if(designUpdateStatus === DesignUpdateStatus.UPDATE_NEW && userRole != RoleType.DESIGNER){
            return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_VIEW_NEW;
        }

        return Validation.VALID;
    };

    validatePublishDesignUpdate(userRole, designUpdateStatus){

        // Only a designer can publish Design Updates
        if(userRole != RoleType.DESIGNER){
            return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_PUBLISH;
        }

        // Only new Design Updates can be published
        if(designUpdateStatus != DesignUpdateStatus.UPDATE_NEW){
            return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_PUBLISH;
        }

        return Validation.VALID;
    }

    validateWithdrawDesignUpdate(userRole, designUpdateStatus, workPackageCount){

        // Only a designer can withdraw Design Updates
        if(userRole != RoleType.DESIGNER){
            return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_WITHDRAW;
        }

        // Only new Design Updates can be published
        if(designUpdateStatus != DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT){
            return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_WITHDRAW;
        }

        // Cannot withdraw if Update related to any WPs
        if(workPackageCount > 0) {
            return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_WPS_WITHDRAW;
        }

        return Validation.VALID;
    }

    validateRemoveDesignUpdate(userRole, designUpdateStatus){

        // The user must be a Designer
        if(userRole != RoleType.DESIGNER){ return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_REMOVE }

        // The Design Update must be removable - i.e. new
        if(designUpdateStatus != DesignUpdateStatus.UPDATE_NEW){ return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_REMOVE }

        return Validation.VALID;

    };

    validateMergeActions(userRole, designUpdate){

        // User must be a Designer
        if(userRole != RoleType.DESIGNER){
            return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_MERGE_ACTION;
        }

        // Design Update must be Draft
        if(designUpdate.updateStatus != DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT){
            return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_STATE_MERGE_ACTION;
        }

        return Validation.VALID;
    }

}
export default new DesignUpdateValidationServices();

