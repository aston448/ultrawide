
// Ultrawide Services
import {  }      from '../../constants/constants.js';

// Ultrawide Data
import { DesignAnomalyData }                   from '../../data/design/design_anomaly_db.js';


//======================================================================================================================
//
// Server Code for Design Anomaly Items.
//
// Methods called directly by Server API
//
//======================================================================================================================

class DesignAnomalyServicesClass {

    addNewDesignAnomaly(designVersionId, featureReferenceId, scenarioReferenceId) {

        if (Meteor.isServer) {

            DesignAnomalyData.insertNewDesignAnomaly(designVersionId, featureReferenceId, scenarioReferenceId);

        }
    };

    updateDesignAnomalyDetails(designAnomalyId, newName, newLink, newText) {

        if (Meteor.isServer) {

            DesignAnomalyData.updateDesignAnomalyDetails(designAnomalyId, newName, newLink, newText);
        }
    }

    removeDesignAnomaly(designAnomalyId) {

        if (Meteor.isServer) {

            DesignAnomalyData.removeDesignAnomaly(designAnomalyId);
        }
    }

    updateDesignAnomalyStatus(designAnomalyId, newStatus) {

        if (Meteor.isServer) {

            DesignAnomalyData.updateDesignAnomalyStatus(designAnomalyId, newStatus);
        }
    }

}

export const DesignAnomalyServices = new DesignAnomalyServicesClass();