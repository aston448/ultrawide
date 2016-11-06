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

    }

    validateRemoveDesign(userRole, design){

        // To remove a design:
        // The Design must exist
        // The user must be a Designer
        // The Design must be removable

        if(!design){ return DesignValidationErrors.DESIGN_NOT_EXIST }

        if(!userRole === RoleType.DESIGNER){ return DesignValidationErrors.DESIGN_INVALID_ROLE_REMOVE }

        if(!design.isRemovable){ return DesignValidationErrors.DESIGN_NOT_REMOVABLE }

        return 'VALID';

    };

}
export default new DesignValidationServices();
