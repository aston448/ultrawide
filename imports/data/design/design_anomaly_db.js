import {DesignAnomalies}            from '../../collections/design/design_anomalies.js'

import { DesignAnomalyStatus }      from '../../constants/constants.js';
import { DefaultItemNames }         from '../../constants/default_names.js';


class DesignAnomalyDataClass {

    // INSERT ==========================================================================================================
    insertNewDesignAnomaly(designVersionId, featureReferenceId, scenarioReferenceId){

        return DesignAnomalies.insert(
            {
                designVersionId:                designVersionId,
                featureReferenceId:             featureReferenceId,
                scenarioReferenceId:            scenarioReferenceId,
                designAnomalyName:              DefaultItemNames.NEW_DESIGN_ANOMALY_NAME
            }
        );
    }

    importDesignAnomaly(designVersionId, designAnomaly){

        if(Meteor.isServer) {
            return DesignAnomalies.insert(
                {
                    designVersionId:                designVersionId,
                    featureReferenceId:             designAnomaly.featureReferenceId,
                    scenarioReferenceId:            designAnomaly.scenarioReferenceId,
                    designAnomalyName:              designAnomaly.designAnomalyName,
                    designAnomalyRawText:           designAnomaly.designAnomalyRawText,
                    designAnomalyLink:              designAnomaly.designAnomalyLink,
                    designAnomalyStatus:            designAnomaly.designAnomalyStatus,
                    assignedUserId:                 designAnomaly.assignedUserId,
                }
            );
        }
    }

    // SELECT ==========================================================================================================

    getDesignAnomalyById(designAnomalyId){
        return DesignAnomalies.findOne({_id: designAnomalyId});
    }

    getDesignAnomalyByName(designAnomalyName){
        return DesignAnomalies.findOne({designAnomalyName: designAnomalyName});
    }

    getDesignVersionDesignAnomalies(designVersionId){
        return DesignAnomalies.find({
            designVersionId:        designVersionId
        }).fetch();
    }

    getOpenDvDesignAnomalies(designVersionId){
        return DesignAnomalies.find({
            designVersionId:        designVersionId,
            designAnomalyStatus:    {$ne: DesignAnomalyStatus.ANOMALY_CLOSED}
        }).fetch();
    }

    getFeatureDesignAnomalies(designVersionId, featureReferenceId){
        return DesignAnomalies.find({
            designVersionId:        designVersionId,
            featureReferenceId:     featureReferenceId,
            scenarioReferenceId:    'NONE'
        }).fetch();
    }

    getScenarioDesignAnomalies(designVersionId, scenarioReferenceId){
        return DesignAnomalies.find({
            designVersionId:        designVersionId,
            scenarioReferenceId:    scenarioReferenceId
        }).fetch();
    }

    getActiveScenarioDesignAnomalies(designVersionId, scenarioReferenceId){
        return DesignAnomalies.find({
            designVersionId:        designVersionId,
            scenarioReferenceId:    scenarioReferenceId,
            $or:                    [{designAnomalyStatus: DesignAnomalyStatus.ANOMALY_OPEN}, {designAnomalyStatus: DesignAnomalyStatus.ANOMALY_ONGOING}]
        }).fetch();
    }

    getAllFeatureDesignAnomalies(designVersionId, featureReferenceId){
        return DesignAnomalies.find({
            designVersionId:        designVersionId,
            featureReferenceId:     featureReferenceId
        }).fetch();
    }

    getAllActiveFeatureDesignAnomalies(designVersionId, featureReferenceId){
        return DesignAnomalies.find({
            designVersionId:        designVersionId,
            featureReferenceId:     featureReferenceId,
            $or:                    [{designAnomalyStatus: DesignAnomalyStatus.ANOMALY_OPEN}, {designAnomalyStatus: DesignAnomalyStatus.ANOMALY_ONGOING}]
        }).fetch();
    }

    getAllActiveFeatureDesignAnomaliesInDv(designVersionId){
        return DesignAnomalies.find({
            designVersionId:        designVersionId,
            $or:                    [{designAnomalyStatus: DesignAnomalyStatus.ANOMALY_OPEN}, {designAnomalyStatus: DesignAnomalyStatus.ANOMALY_ONGOING}]
        }).fetch();
    }

    // UPDATE ==========================================================================================================


    updateDesignAnomalyDetails(designAnomalyId, newName, newLink, newText){

        return DesignAnomalies.update(
            {_id: designAnomalyId},
            {
                $set: {
                    designAnomalyName:      newName,
                    designAnomalyRawText:   newText,
                    designAnomalyLink:      newLink,
                    designAnomalyStatus:    DesignAnomalyStatus.ANOMALY_OPEN
                }
            }
        );
    }

    updateDesignAnomalyStatus(designAnomalyId, newStatus){
        return DesignAnomalies.update(
            {_id: designAnomalyId},
            {
                $set: {
                    designAnomalyStatus:    newStatus
                }
            }
        );
    }

    updateDesignAnomalyUser(designAnomalyId, newUserId){
        return DesignAnomalies.update(
            {_id: designAnomalyId},
            {
                $set: {
                    assignedUserId:         newUserId
                }
            }
        );
    }

    // REMOVE ==========================================================================================================

    removeDesignAnomaly(designAnomalyId){

        return DesignAnomalies.remove({_id: designAnomalyId});
    }

    removeFeatureDesignAnomalies(designVersionId, featureReferenceId){

        return DesignAnomalies.remove({designVersionId: designVersionId, featureReferenceId: featureReferenceId});
    }

    removeScenarioDesignAnomalies(designVersionId, scenarioReferenceId){

        return DesignAnomalies.remove({designVersionId: designVersionId, scenarioReferenceId: scenarioReferenceId});
    }
}

export const DesignAnomalyData = new DesignAnomalyDataClass();