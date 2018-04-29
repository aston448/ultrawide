
// Ultrawide Services
import { RoleType } from '../../constants/constants.js';
import { Validation, DesignValidationErrors } from '../../constants/validation_errors.js';

//======================================================================================================================
//
// Validation Services for Design Items.
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class DesignValidationServicesClass{

    validateAddDesign(userRole){

        // To add a Design, user must be a Designer
        if(!(userRole === RoleType.DESIGNER)){ return DesignValidationErrors.DESIGN_INVALID_ROLE_ADD }

        return Validation.VALID;
    };

    validateUpdateDesignName(userRole, newName, otherDesigns){

        // To update a Design Name, user must be a Designer
        if(!(userRole === RoleType.DESIGNER)){ return DesignValidationErrors.DESIGN_INVALID_ROLE_UPDATE }

        // The new name must not be the same as other Designs
        let duplicate = false;
        otherDesigns.forEach((design) => {
            if(design.designName === newName){
                duplicate = true;
            }
        });

        if(duplicate){
            return DesignValidationErrors.DESIGN_INVALID_NAME_DUPLICATE
        } else {
            return Validation.VALID;
        }
    };

    validateRemoveDesign(userRole, design){

        // To remove a design:
        // The Design must exist
        // The user must be a Designer
        // The Design must be removable

        //console.log("DESIGN REMOVE VALDATTION: Removable " + design.isRemovable + " Role: " + userRole);

        if(!design){ return DesignValidationErrors.DESIGN_NOT_EXIST }

        if(!(userRole === RoleType.DESIGNER)){ return DesignValidationErrors.DESIGN_INVALID_ROLE_REMOVE }

        if(!design.isRemovable){ return DesignValidationErrors.DESIGN_NOT_REMOVABLE }

        return Validation.VALID;
    };

    validateUpdateDefaultAspectName(userRole, newName, otherDefaults){

        // Role must be Designer
        if(!(userRole === RoleType.DESIGNER)){
            return DesignValidationErrors.DEFAULT_INVALID_ROLE_UPDATE;
        }

        // New name cannot be same as another default
        let duplicate = false;
        otherDefaults.forEach((defaultAspect) => {
            if(defaultAspect.defaultAspectName === newName){
                duplicate = true;
            }
        });

        if(duplicate){
            return DesignValidationErrors.DEFAULT_INVALID_NAME_DUPLICATE;
        } else {
            return Validation.VALID;
        }
    };

    validateUpdateDefaultAspectIncluded(userRole){

        // Role must be Designer
        if(!(userRole === RoleType.DESIGNER)){
            return DesignValidationErrors.DEFAULT_INVALID_ROLE_INCLUDE;
        }

        return Validation.VALID;
    }

}
export const DesignValidationServices = new DesignValidationServicesClass();
