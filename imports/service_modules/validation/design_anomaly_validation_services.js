
// Ultrawide Services
import { RoleType, DesignAnomalyStatus } from '../../constants/constants.js';
import { Validation, DesignAnomalyValidationErrors } from '../../constants/validation_errors.js';

//======================================================================================================================
//
// Validation Services for Design Anomaly Items.
//
// All services should make no data-access calls so as to be module testable
//
//======================================================================================================================

class DesignAnomalyValidationServicesClass{

    validateAddDesignAnomaly(userRole){

        // Guest Viewers can't add
        if(userRole === RoleType.GUEST_VIEWER){
            return DesignAnomalyValidationErrors.DESIGN_ANOMALY_INVALID_ROLE_ADD;
        }

        return Validation.VALID;
    };

    validateUpdateDesignAnomaly(userRole){

        // Guest Viewers can't update
        if(userRole === RoleType.GUEST_VIEWER){
            return DesignAnomalyValidationErrors.DESIGN_ANOMALY_INVALID_ROLE_UPDATE
        }

        return Validation.VALID;
    };

    validateUpdateDesignAnomalyStatus(userRole, designAnomalyCurrentStatus, designAnomalyNewStatus){

        // Guest Viewers can't update
        if(userRole === RoleType.GUEST_VIEWER){
            return DesignAnomalyValidationErrors.DESIGN_ANOMALY_INVALID_ROLE_UPDATE
        }

        // Can't update status of a NEW Anomaly
        if(designAnomalyCurrentStatus === DesignAnomalyStatus.ANOMALY_NEW){
            return DesignAnomalyValidationErrors.DESIGN_ANOMALY_INVALID_STATUS_UPDATE;
        }

        // Can't update to NEW
        if(designAnomalyNewStatus === DesignAnomalyStatus.ANOMALY_NEW){
            return DesignAnomalyValidationErrors.DESIGN_ANOMALY_INVALID_STATUS_UPDATE;
        }

        return Validation.VALID;
    };

    validateRemoveDesignAnomaly(userRole, designAnomalyStatus){

        console.log('Validating DA for %s with status %s', userRole, designAnomalyStatus);

        // Guest Viewers can't remove
        if(userRole === RoleType.GUEST_VIEWER){
            return DesignAnomalyValidationErrors.DESIGN_ANOMALY_INVALID_ROLE_REMOVE
        }

        // Only a New anomaly can be removed.  Once edited it has to be closed.
        if(designAnomalyStatus !== DesignAnomalyStatus.ANOMALY_NEW){
            return DesignAnomalyValidationErrors.DESIGN_ANOMALY_INVALID_STATUS_REMOVE;
        }

        return Validation.VALID;
    };


}
export const DesignAnomalyValidationServices = new DesignAnomalyValidationServicesClass();
