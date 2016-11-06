// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections
import { Designs } from '../collections/design/designs.js';

// Ultrawide Services
import { ViewType, RoleType } from '../constants/constants.js';
import { DesignValidationErrors } from '../constants/validation_errors.js';

import DesignValidationServices from '../service_modules/validation/design_validation_services.js';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Validation - Supports validations relating to a Design
//
// ---------------------------------------------------------------------------------------------------------------------

class DesignValidationApi{

    validateAddDesign(userRole){

    }

    validateRemoveDesign(userRole, designId){

        const design = Designs.findOne({_id: designId});

        return DesignValidationServices.validateRemoveDesign(userRole, design);

    };

}
export default new DesignValidationApi();