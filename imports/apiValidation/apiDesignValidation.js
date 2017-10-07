
// Ultrawide Services
import DesignValidationServices         from '../service_modules/validation/design_validation_services.js';

// Data Access
import DesignData                       from '../data/design/design_db.js';


//======================================================================================================================
//
// Validation API for Design Items
//
//======================================================================================================================

class DesignValidationApi{

    validateAddDesign(userRole){

        return DesignValidationServices.validateAddDesign(userRole);
    };

    validateUpdateDesignName(userRole, newName, designId){

        // Get all other designs apart from this one
        const otherDesigns = DesignData.getOtherDesigns(designId);

        return DesignValidationServices.validateUpdateDesignName(userRole, newName, otherDesigns);
    }

    validateRemoveDesign(userRole, designId){

        const design = DesignData.getDesignById(designId);

        return DesignValidationServices.validateRemoveDesign(userRole, design);
    };

}
export default new DesignValidationApi();