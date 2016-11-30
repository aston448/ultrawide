// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections

// Ultrawide Services
import { ViewType, ViewMode, RoleType, WorkPackageType, DesignVersionStatus, DesignUpdateStatus, WorkPackageStatus } from '../../constants/constants.js';
import { Validation, WorkPackageValidationErrors } from '../../constants/validation_errors.js';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Work Package Validation - Supports validations relating to Work Packages
//
// ---------------------------------------------------------------------------------------------------------------------

class WorkPackageValidationServices{

    validateAddWorkPackage(userRole, designVersion, designUpdate, workPackageType){

        // Only a Manager can add Work Packages
        if(userRole != RoleType.MANAGER){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_ADD;
        }

        switch(workPackageType){
            case WorkPackageType.WP_BASE:

                // Work Packages can only be added to a Draft Design Version
                if(designVersion.designVersionStatus != DesignVersionStatus.VERSION_PUBLISHED_DRAFT){
                    return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_STATE_ADD;
                }
                break;

            case WorkPackageType.WP_UPDATE:

                // Work Packages can only be added to a Draft Design Update
                if(designUpdate.updateStatus != DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT){
                    return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_STATE_ADD;
                }
                break;

            default:
                return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_TYPE;
        }

        return Validation.VALID;
    };

    validateUpdateWorkPackageName(userRole, newName, otherWorkPackages){

        // To edit a WP Name, user must be a Manager
        if(userRole != RoleType.MANAGER){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_EDIT;
        }

        // New Name must not be an existing one
        let duplicate = false;
        otherWorkPackages.forEach((wp) => {

            if (wp.workPackageName === newName){
                duplicate = true;
            }
        });

        if(duplicate){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_NAME_DUPLICATE;
        }

        return Validation.VALID;
    };

    validatePublishWorkPackage(userRole, wpStatus){

        // To publish a WP, user must be a Manager
        if(userRole != RoleType.MANAGER){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_PUBLISH;
        }

        // Work Package must be New
        if(wpStatus != WorkPackageStatus.WP_NEW){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_STATE_PUBLISH;
        }

        return Validation.VALID;
    };

    validateRemoveWorkPackage(userRole, wpStatus){

        // To remove a WP, user must be a Manager
        if(userRole != RoleType.MANAGER){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_REMOVE;
        }

        // Work Package must be New
        if(wpStatus != WorkPackageStatus.WP_NEW){
            return WorkPackageValidationErrors.WORK_PACKAGE_NOT_REMOVABLE;
        }

        return Validation.VALID;
    };

    validateEditWorkPackage(userRole, wpStatus){

        // To edit a WP, user must be a Manager
        if(userRole != RoleType.MANAGER){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_EDIT;
        }

        // Work Package must not be Complete
        if(wpStatus === WorkPackageStatus.WP_COMPLETE){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_STATE_EDIT;
        }

        return Validation.VALID;
    };

    validateViewWorkPackage(userRole, wpStatus){

        // To view a WP, user must be a Manager if WP is New
        if(userRole != RoleType.MANAGER && wpStatus === WorkPackageStatus.WP_NEW){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_VIEW_NEW;
        }

        return Validation.VALID;
    };

    validateDevelopWorkPackage(userRole, wpStatus){

        // To develop a WP, user must be a Developer
        if(userRole != RoleType.DESIGNER){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_DEVELOP;
        }

        // Work Package must be Adopted TODO - add in by who
        if(wpStatus != WorkPackageStatus.WP_ADOPTED){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_STATE_DEVELOP;
        }

        return Validation.VALID;
    };
}

export default new WorkPackageValidationServices();
