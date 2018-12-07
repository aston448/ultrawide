
import {
    addDesignAnomaly,
    updateDesignAnomaly,
    updateDesignAnomalyStatus,
    removeDesignAnomaly

} from '../apiValidatedMethods/design_anomaly_methods.js'

// =====================================================================================================================
// Server API for Design Anomaly Items
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================
class ServerDesignAnomalyApiClass {

    addDesignAnomaly(userRole, designVersionId, featureReferenceId, scenarioReferenceId, callback){

        addDesignAnomaly.call(
            {
                userRole:               userRole,
                designVersionId:        designVersionId,
                featureReferenceId:     featureReferenceId,
                scenarioReferenceId:    scenarioReferenceId
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateDesignAnomaly(userRole, designAnomalyId, newDaName, newDaLink, newDaText, callback){

        updateDesignAnomaly.call(
            {
                userRole:               userRole,
                designAnomalyId:        designAnomalyId,
                newDaName:              newDaName,
                newDaLink:              newDaLink,
                newDaText:              newDaText
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateDesignAnomalyStatus(userRole, designAnomalyId, currentStatus, newStatus, callback){

        updateDesignAnomalyStatus.call(
            {
                userRole:               userRole,
                designAnomalyId:        designAnomalyId,
                currentStatus:          currentStatus,
                newStatus:              newStatus
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    removeDesignAnomaly(userRole, designAnomalyId, designAnomalyStatus, callback){

        removeDesignAnomaly.call(
            {
                userRole:               userRole,
                designAnomalyId:        designAnomalyId,
                designAnomalyStatus:    designAnomalyStatus
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

}

export const ServerDesignAnomalyApi = new ServerDesignAnomalyApiClass();