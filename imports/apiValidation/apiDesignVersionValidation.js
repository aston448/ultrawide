
// Ultrawide Services
import DesignVersionValidationServices  from '../service_modules/validation/design_version_validation_services.js';

// Data Access
import { DesignData }                       from '../data/design/design_db.js';
import { DesignVersionData }                from '../data/design/design_version_db.js';

//======================================================================================================================
//
// Validation API for Design Version Items
//
//======================================================================================================================

class DesignVersionValidationApi{

    validateUpdateDesignVersionName(userRole, designVersionId, newName){

        const thisVersion = DesignVersionData.getDesignVersionById(designVersionId);
        const otherVersions = DesignData.getOtherDesignVersions(thisVersion.designId, designVersionId);

        return DesignVersionValidationServices.validateUpdateDesignVersionName(userRole, newName, otherVersions);
    };

    validateUpdateDesignVersionNumber(userRole, designVersionId, newNumber){

        const thisVersion = DesignVersionData.getDesignVersionById(designVersionId);
        const otherVersions = DesignData.getOtherDesignVersions(thisVersion.designId, designVersionId);

        return DesignVersionValidationServices.validateUpdateDesignVersionNumber(userRole, newNumber, otherVersions);
    };

    validateEditDesignVersion(userRole, designVersionId){

        const thisVersion = DesignVersionData.getDesignVersionById(designVersionId);

        return DesignVersionValidationServices.validateEditDesignVersion(userRole, thisVersion);
    };

    validateViewDesignVersion(userRole, designVersionId){

        const thisVersion = DesignVersionData.getDesignVersionById(designVersionId);

        return DesignVersionValidationServices.validateViewDesignVersion(userRole, thisVersion);
    }

    validatePublishDesignVersion(userRole, designVersionId){

        const thisVersion = DesignVersionData.getDesignVersionById(designVersionId);

        return DesignVersionValidationServices.validatePublishDesignVersion(userRole, thisVersion);
    };

    validateWithdrawDesignVersion(userRole, designVersionId){

        const thisVersion = DesignVersionData.getDesignVersionById(designVersionId);

        return DesignVersionValidationServices.validateWithdrawDesignVersion(userRole, thisVersion);
    };

    validateCreateNextDesignVersion(userRole, designVersionId){

        const thisVersion = DesignVersionData.getDesignVersionById(designVersionId);
        const mergeIncludeUpdatesCount = DesignVersionData.getMergeIncludeUpdatesCount(designVersionId);

        return DesignVersionValidationServices.validateCreateNextDesignVersion(userRole, thisVersion, mergeIncludeUpdatesCount);
    }
}
export default new DesignVersionValidationApi();
