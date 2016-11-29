// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections

// Ultrawide Services
import { ViewType, RoleType, DesignVersionStatus, DesignUpdateStatus } from '../../constants/constants.js';
import { Validation, DesignUpdateValidationErrors } from '../../constants/validation_errors.js';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Update Validation - Supports validations relating to a Design Update
//
// ---------------------------------------------------------------------------------------------------------------------

class DesignValidationServices{

    validateAddDesignUpdate(userRole, designVersionStatus){

        // To add a Design Update, user must be a Designer
        if(userRole != RoleType.DESIGNER){
            return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_ADD;
        }

        // The Design Version must be Published and still Draft
        if(designVersionStatus != DesignVersionStatus.VERSION_PUBLISHED_DRAFT){
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

    validateUpdateDesignUpdateVersion(userRole, newVersion, otherDesignUpdates){

        // To update a Design Update Name, user must be a Designer
        if(userRole != RoleType.DESIGNER){
            return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_UPDATE;
        }

        // The new name must not be the same as other Design Updates for the Design Version
        let duplicate = false;
        otherDesignUpdates.forEach((designUpdate) => {
            if(designUpdate.updateVersion === newVersion){
                duplicate = true;
            }
        });

        if(duplicate){
            return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_VERSION_DUPLICATE;
        } else {
            return Validation.VALID;
        }

    };

    validateEditDesignUpdate(userRole, designUpdateStatus){

        // Only a designer can edit Design Updates
        if(userRole != RoleType.DESIGNER){
            return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_EDIT;
        }

        // Completed Design Updates cannot be edited
        if(designUpdateStatus === DesignUpdateStatus.UPDATE_MERGED){
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

    validateRemoveDesignUpdate(userRole, designUpdate){

        // To remove a design:
        // The Design Update must exist
        // The user must be a Designer
        // The Design Update must be removable - i.e. new TODO - add remove empty updates

        if(!designUpdate){ return DesignUpdateValidationErrors.DESIGN_UPDATE_NOT_EXIST }

        if(userRole != RoleType.DESIGNER){ return DesignUpdateValidationErrors.DESIGN_UPDATE_INVALID_ROLE_REMOVE }

        if(designUpdate.updateStatus != DesignUpdateStatus.UPDATE_NEW){ return DesignUpdateValidationErrors.DESIGN_UPDATE_NOT_REMOVABLE }

        return Validation.VALID;

    };

}
export default new DesignValidationServices();

