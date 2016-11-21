// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections
import { DesignVersions } from '../collections/design/design_versions.js';
import { DesignUpdates } from '../collections/design_update/design_updates.js';

// Ultrawide Services
import { ViewType, RoleType } from '../constants/constants.js';

import DesignVersionValidationServices from '../service_modules/validation/design_version_validation_services.js';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Version Validation - Supports validations relating to a Design Version
//
// ---------------------------------------------------------------------------------------------------------------------

class DesignValidationApi{

    validateUpdateDesignVersionName(userRole, designVersionId, newName){

        const thisVersion = DesignVersions.findOne({_id: designVersionId});
        const otherVersions = DesignVersions.find({_id: {$ne: thisVersion._id}, designId: thisVersion.designId}).fetch();

        return DesignVersionValidationServices.validateUpdateDesignVersionName(userRole, newName, otherVersions);
    };

    validateUpdateDesignVersionNumber(userRole, designVersionId, newNumber){

        const thisVersion = DesignVersions.findOne({_id: designVersionId});
        const otherVersions = DesignVersions.find({_id: {$ne: thisVersion._id}, designId: thisVersion.designId}).fetch();

        return DesignVersionValidationServices.validateUpdateDesignVersionName(userRole, newNumber, otherVersions);
    };

    validateEditDesignVersion(userRole, designVersionId){

        const thisVersion = DesignVersions.findOne({_id: designVersionId});

        return DesignVersionValidationServices.validateEditDesignVersion(userRole, thisVersion);
    };

    validateViewDesignVersion(){

        return DesignVersionValidationServices.validateViewDesignVersion();
    }

    validatePublishDesignVersion(userRole, designVersionId){

        const thisVersion = DesignVersions.findOne({_id: designVersionId});

        return DesignVersionValidationServices.validatePublishDesignVersion(userRole, thisVersion);
    };

    validateUnpublishDesignVersion(userRole, designVersionId){

        const thisVersion = DesignVersions.findOne({_id: designVersionId});
        const dvUpdates = DesignUpdates.find({designVersionId: designVersionId}).fetch();

        return DesignVersionValidationServices.validateUnpublishDesignVersion(userRole, thisVersion, dvUpdates);
    }



}
export default new DesignValidationApi();
