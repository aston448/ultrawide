// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections
import { DesignUpdates } from '../collections/design_update/design_updates.js';
import { DesignVersions } from '../collections/design/design_versions.js';

// Ultrawide Services
import { ViewType, RoleType } from '../constants/constants.js';

import DesignUpdateValidationServices from '../service_modules/validation/design_update_validation_services.js';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Update Validation - Supports validations relating to a Design Update
//
// ---------------------------------------------------------------------------------------------------------------------

class DesignUpdateValidationApi{

    validateAddDesignUpdate(userRole, designVersionId){

        const designVersion = DesignVersions.findOne({_id: designVersionId});

        return DesignUpdateValidationServices.validateAddDesignUpdate(userRole, designVersion.designVersionStatus);

    };

    validateUpdateDesignUpdateName(userRole, designUpdateId, newName){

        // Get all other designs apart from this one
        const thisDesignUpdate = DesignUpdates.findOne({_id: designUpdateId});
        const otherDesignUpdates = DesignUpdates.find({_id: {$ne: designUpdateId}, designVersionId: thisDesignUpdate.designVersionId}).fetch();

        return DesignUpdateValidationServices.validateUpdateDesignUpdateName(userRole, newName, otherDesignUpdates);

    };

    validateUpdateDesignUpdateVersion(userRole, designUpdateId, newVersion){

        // Get all other designs apart from this one
        const thisDesignUpdate = DesignUpdates.findOne({_id: designUpdateId});
        const otherDesignUpdates = DesignUpdates.find({_id: {$ne: designUpdateId}, designVersionId: thisDesignUpdate.designVersionId}).fetch();

        return DesignUpdateValidationServices.validateUpdateDesignUpdateVersion(userRole, newVersion, otherDesignUpdates);

    };

    validateEditDesignUpdate(userRole, designUpdateId){

        const designUpdate = DesignUpdates.findOne({_id: designUpdateId});

        return DesignUpdateValidationServices.validateEditDesignUpdate(userRole, designUpdate.updateStatus)
    };

    validatePublishDesignUpdate(userRole, designUpdateId){

        const designUpdate = DesignUpdates.findOne({_id: designUpdateId});

        return DesignUpdateValidationServices.validatePublishDesignUpdate(userRole, designUpdate.updateStatus)
    };

    validateViewDesignUpdate(userRole, designUpdateId){

        const designUpdate = DesignUpdates.findOne({_id: designUpdateId});

        return DesignUpdateValidationServices.validateViewDesignUpdate(userRole, designUpdate.updateStatus)
    };

    validateRemoveDesignUpdate(userRole, designUpdateId){

        const designUpdate = DesignUpdates.findOne({_id: designUpdateId});

        return DesignUpdateValidationServices.validateRemoveDesignUpdate(userRole, designUpdate);

    };

}
export default new DesignUpdateValidationApi();
