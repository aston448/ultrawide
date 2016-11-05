// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections
import { Designs } from '../collections/design/designs.js';

// Ultrawide Services
import { ViewType, RoleType } from '../constants/constants.js';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Validation - Supports validations relating to a Design
//
// ---------------------------------------------------------------------------------------------------------------------

class DesignValidation{

    validateRemoveDesign(userRole, designId){

        // To remove a design:
        // The Design must exist
        // The user must be a Designer
        // The Design must be removable

        const design = Designs.findOne({_id: designId});

        if(!design){ return 'Design does not exist!' }

        if(!userRole === RoleType.DESIGNER){ return 'Only a Designer can remove Designs '}

        if(!design.isRemovable){ return 'This Design is not removable' }

        return 'VALID';

    };

}
export default new DesignValidation();