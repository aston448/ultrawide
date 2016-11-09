// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections

// Ultrawide Services
import { ViewType, RoleType } from '../../constants/constants.js';
import { DesignValidationErrors } from '../../constants/validation_errors.js';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Validation - Supports validations relating to a Design
//
// ---------------------------------------------------------------------------------------------------------------------

class DesignValidationServices{

    validateAddDesign(userRole){

        // To add a Design, user must be a Designer
        if(!(userRole === RoleType.DESIGNER)){ return DesignValidationErrors.DESIGN_INVALID_ROLE_ADD }

        return 'VALID';

    };

    validateUpdateDesignName(userRole, newName, otherDesigns){

        // To update a Design Name, user must be a Designer
        if(!(userRole === RoleType.DESIGNER)){ return DesignValidationErrors.DESIGN_INVALID_ROLE_UPDATE }

        // The new name must not be the same as other Designs
        otherDesigns.forEach((design) => {
            if(design.designName === newName){ return DesignValidationErrors.DESIGN_INVALID_NAME_DUPLICATE}
        });

        return 'VALID';

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

        return 'VALID';

    };

}
export default new DesignValidationServices();
