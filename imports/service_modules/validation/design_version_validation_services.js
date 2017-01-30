
// Ultrawide Services
import { RoleType, DesignVersionStatus } from '../../constants/constants.js';
import { Validation, DesignVersionValidationErrors } from '../../constants/validation_errors.js';

//======================================================================================================================
//
// Validation Services for Design Version Items.
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class DesignVersionValidationServices{

    validateUpdateDesignVersionName(userRole, newName, otherVersions){

        // User must be Designer
        if(userRole != RoleType.DESIGNER){
            return DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_UPDATE;
        }

        // Name must not be same as other versions for this Design
        let duplicate = false;
        otherVersions.forEach((version) => {

            if(version.designVersionName === newName){
                duplicate = true;
            }
        });

        if(duplicate){
            return DesignVersionValidationErrors.DESIGN_VERSION_INVALID_NAME_DUPLICATE;
        }

        return Validation.VALID;
    };

    validateUpdateDesignVersionNumber(userRole, newNumber, otherVersions){

        // User must be Designer
        if(userRole != RoleType.DESIGNER){
            return DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_UPDATE;
        }

        // Number must not be same as other versions for this Design
        let duplicate = false;
        otherVersions.forEach((version) => {

            if(version.designVersionNumber === newNumber){
                duplicate = true;
            }
        });

        if(duplicate){
            return DesignVersionValidationErrors.DESIGN_VERSION_INVALID_NUMBER_DUPLICATE;
        }

        return Validation.VALID;
    };

    validateEditDesignVersion(userRole, designVersion){

        // User must be Designer
        if(userRole != RoleType.DESIGNER){
            return DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_EDIT ;
        }

        // Design Version must not be Final
        if(designVersion.designVersionStatus === DesignVersionStatus.VERSION_DRAFT_COMPLETE){
            return DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_EDIT;
        }

        return Validation.VALID;
    };

    validateViewDesignVersion(userRole, designVersion){

        // User must be a Designer for New versions
        if(designVersion.designVersionStatus === DesignVersionStatus.VERSION_NEW){
            if((userRole != RoleType.DESIGNER)){ return DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_VIEW_NEW }
        }

        return Validation.VALID;
    }

    validatePublishDesignVersion(userRole, designVersion){

        // User must be Designer
        if(userRole != RoleType.DESIGNER){
            return DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_PUBLISH;
        }

        // Design Version must be New
        if(designVersion.designVersionStatus != DesignVersionStatus.VERSION_NEW){
            return DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_PUBLISH;
        }

        return Validation.VALID;
    };

    validateWithdrawDesignVersion(userRole, designVersion, dvUpdates){

        // User must be Designer
        if(userRole != RoleType.DESIGNER){
            return DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_WITHDRAW;
        }

        // Design Version must be Draft
        if(designVersion.designVersionStatus != DesignVersionStatus.VERSION_DRAFT){
            return DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_WITHDRAW;
        }

        // Design Version must have no updates
        if(dvUpdates.length > 0){
            return DesignVersionValidationErrors.DESIGN_VERSION_UPDATES_UNPUBLISH;
        }

        // TODO - Add adoption validation

        return Validation.VALID;
    };

    validateCreateNextDesignVersion(userRole, designVersion, mergeIncludeCount){

        // User must be Designer
        if(userRole != RoleType.DESIGNER){
            return DesignVersionValidationErrors.DESIGN_VERSION_INVALID_ROLE_NEXT
        }

        // Design Version that new is based on must be Draft or Updatable
        if(!(designVersion.designVersionStatus === DesignVersionStatus.VERSION_DRAFT || designVersion.designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE)){
            return DesignVersionValidationErrors.DESIGN_VERSION_INVALID_STATE_NEXT;
        }

        // For an updatable version there must be at lease one update to merge
        if(designVersion.designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE && mergeIncludeCount === 0){
            return DesignVersionValidationErrors.DESIGN_VERSION_INVALID_UPDATE_NEXT;
        }

        return Validation.VALID;
    }

}
export default new DesignVersionValidationServices();

