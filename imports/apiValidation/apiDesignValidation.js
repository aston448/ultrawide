
// Ultrawide Collections
import { Designs } from '../collections/design/designs.js';

// Ultrawide Services
import DesignValidationServices from '../service_modules/validation/design_validation_services.js';

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
        const otherDesigns = Designs.find({_id: {$ne: designId}}).fetch();

        return DesignValidationServices.validateUpdateDesignName(userRole, newName, otherDesigns);
    }

    validateRemoveDesign(userRole, designId){

        const design = Designs.findOne({_id: designId});

        return DesignValidationServices.validateRemoveDesign(userRole, design);
    };

}
export default new DesignValidationApi();