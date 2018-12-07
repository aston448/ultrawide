
// Ultrawide Services
import { DesignAnomalyValidationServices }  from '../service_modules/validation/design_anomaly_validation_services.js';

// Data Access


//======================================================================================================================
//
// Validation API for Design Anomaly Items
//
//======================================================================================================================

class DesignAnomalyValidationApiClass{

    validateAddDesignAnomaly(userRole){

        return DesignAnomalyValidationServices.validateAddDesignAnomaly(userRole);
    };

    validateUpdateDesignAnomaly(userRole){

        return DesignAnomalyValidationServices.validateUpdateDesignAnomaly(userRole);
    };

    validateUpdateDesignAnomalyStatus(userRole, designAnomalyCurrentStatus, designAnomalyNewStatus){

        return DesignAnomalyValidationServices.validateUpdateDesignAnomalyStatus(userRole, designAnomalyCurrentStatus, designAnomalyNewStatus)
    };

    validateRemoveDesignAnomaly(userRole, designAnomalyStatus){

        return DesignAnomalyValidationServices.validateRemoveDesignAnomaly(userRole, designAnomalyStatus);
    };

}
export const DesignAnomalyValidationApi = new DesignAnomalyValidationApiClass();