
// Ultrawide Services
import { RoleType, WorkPackageType, DesignVersionStatus, DesignUpdateStatus, WorkPackageStatus } from '../../constants/constants.js';
import { Validation, WorkPackageValidationErrors } from '../../constants/validation_errors.js';

//======================================================================================================================
//
// Validation Services for Work Package Items.
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class WorkPackageValidationServicesClass {

    validateAddWorkPackage(userRole, designVersion, designUpdate, workPackageType){

        // Only a Manager can add Work Packages
        if(userRole !== RoleType.MANAGER){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_ADD;
        }

        switch(workPackageType){
            case WorkPackageType.WP_BASE:

                // Work Packages can only be added to a Draft Design Version
                if(designVersion.designVersionStatus !== DesignVersionStatus.VERSION_DRAFT){
                    return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_STATE_ADD;
                }
                break;

            case WorkPackageType.WP_UPDATE:

                // Work Packages can only be added to a Draft Design Update
                if(designUpdate.updateStatus !== DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT){
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
        if(userRole !== RoleType.MANAGER){
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
        if(userRole !== RoleType.MANAGER){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_PUBLISH;
        }

        // Work Package must be New
        if(wpStatus !== WorkPackageStatus.WP_NEW){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_STATE_PUBLISH;
        }

        return Validation.VALID;
    };

    validateWithdrawWorkPackage(userRole, wpStatus){

        // To withdraw a WP, user must be a Manager
        if(userRole !== RoleType.MANAGER){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_WITHDRAW;
        }

        // Work Package must be Available
        if(wpStatus !== WorkPackageStatus.WP_AVAILABLE){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_STATE_WITHDRAW;
        }

        return Validation.VALID;
    };

    validateAdoptWorkPackage(userRole, wpStatus){

        // Adopter must be a Developer
        if(userRole !== RoleType.DEVELOPER){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_ADOPT;
        }

        // WP must be Available
        if(wpStatus !== WorkPackageStatus.WP_AVAILABLE){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_STATE_ADOPT;
        }

        return Validation.VALID;
    }

    validateReleaseWorkPackage(userRole, userId, wp){

        // Releaser must be a Developer or Manager
        if(!(userRole === RoleType.DEVELOPER || userRole === RoleType.MANAGER)){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_RELEASE;
        }

        // WP must be Adopted
        if(wp.workPackageStatus !== WorkPackageStatus.WP_ADOPTED){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_STATE_RELEASE;
        }

        // If Developer and Adopted, must be adopted by them
        if(userRole === RoleType.DEVELOPER){
            if(wp.adoptingUserId !== userId){
                return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_USER_RELEASE;
            }
        }


        return Validation.VALID;
    }

    validateRemoveWorkPackage(userRole, wpStatus){

        // To remove a WP, user must be a Manager
        if(userRole !== RoleType.MANAGER){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_REMOVE;
        }

        // Work Package must be New
        if(wpStatus !== WorkPackageStatus.WP_NEW){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_STATE_REMOVE;
        }

        return Validation.VALID;
    };

    validateEditWorkPackage(userRole, wpStatus){

        // To edit a WP, user must be a Manager
        if(userRole !== RoleType.MANAGER){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_EDIT;
        }

        return Validation.VALID;
    };

    validateViewWorkPackage(userRole, wpStatus){

        // To view a WP, user must be a Manager if WP is New
        if(userRole !== RoleType.MANAGER && wpStatus === WorkPackageStatus.WP_NEW){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_VIEW_NEW;
        }

        return Validation.VALID;
    };

    validateDevelopWorkPackage(userRole, userId, wp){

        // To develop a WP, user must be a Developer
        if(userRole !== RoleType.DEVELOPER){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_DEVELOP;
        }

        //Work Package must be Adopted
        if(wp.workPackageStatus !== WorkPackageStatus.WP_ADOPTED){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_STATE_DEVELOP;
        }

        // And the Adoption must be by the current user
        if(wp.adoptingUserId !== userId){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_USER_DEVELOP;
        }

        return Validation.VALID;
    };

    validateCloseWorkPackage(userRole, wpStatus){

        // To close a WP, user must be a Manager
        if(userRole !== RoleType.MANAGER){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_CLOSE;
        }

        // Must be an adopted WP
        if(wpStatus !== WorkPackageStatus.WP_ADOPTED){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_STATE_CLOSE;
        }

        return Validation.VALID;
    };

    validateReopenWorkPackage(userRole, wpStatus){

        // To reopen a WP, user must be a Manager
        if(userRole !== RoleType.MANAGER){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_ROLE_REOPEN;
        }

        // Must be a closed WP
        if(wpStatus !== WorkPackageStatus.WP_CLOSED){
            return WorkPackageValidationErrors.WORK_PACKAGE_INVALID_STATE_REOPEN;
        }

        return Validation.VALID;
    };
}

export const WorkPackageValidationServices = new WorkPackageValidationServicesClass();
