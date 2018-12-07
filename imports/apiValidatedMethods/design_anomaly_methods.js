
import { Validation } from '../constants/validation_errors.js'

import { DesignAnomalyValidationApi }      from '../apiValidation/apiDesignAnomalyValidation.js';
import { DesignAnomalyServices }           from '../servicers/design/design_anomaly_services.js';

//======================================================================================================================
//
// Meteor Validated Methods for Design Anomaly Items
//
//======================================================================================================================

export const addDesignAnomaly = new ValidatedMethod({

    name: 'designAnomaly.addDesignAnomaly',

    validate: new SimpleSchema({
        userRole:               {type: String},
        designVersionId:        {type: String},
        featureReferenceId:     {type: String},
        scenarioReferenceId:    {type: String}
    }).validator(),

    run({userRole, designVersionId, featureReferenceId, scenarioReferenceId}){

        const result = DesignAnomalyValidationApi.validateAddDesignAnomaly(userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designAnomaly.addDesignAnomaly.failValidation', result)
        }

        try {
            DesignAnomalyServices.addNewDesignAnomaly(designVersionId, featureReferenceId, scenarioReferenceId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});

export const updateDesignAnomaly = new ValidatedMethod({

    name: 'designAnomaly.updateDesignAnomaly',

    validate: new SimpleSchema({
        userRole:               {type: String},
        designAnomalyId:        {type: String},
        newDaName:              {type: String},
        newDaLink:              {type: String},
        newDaText:              {type: Object, blackbox: true}
    }).validator(),

    run({userRole, designAnomalyId, newDaName, newDaLink, newDaText}){

        const result = DesignAnomalyValidationApi.validateUpdateDesignAnomaly(userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designAnomaly.updateDesignAnomaly.failValidation', result)
        }

        try {
            DesignAnomalyServices.updateDesignAnomalyDetails(designAnomalyId, newDaName, newDaLink, newDaText);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});

export const updateDesignAnomalyStatus = new ValidatedMethod({

    name: 'designAnomaly.updateDesignAnomalyStatus',

    validate: new SimpleSchema({
        userRole:               {type: String},
        designAnomalyId:        {type: String},
        currentStatus:          {type: String},
        newStatus:              {type: String}
    }).validator(),

    run({userRole, designAnomalyId, currentStatus, newStatus}){

        const result = DesignAnomalyValidationApi.validateUpdateDesignAnomalyStatus(userRole, currentStatus, newStatus);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designAnomaly.updateDesignAnomalyStatus.failValidation', result)
        }

        try {
            DesignAnomalyServices.updateDesignAnomalyStatus(designAnomalyId, newStatus);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});

export const removeDesignAnomaly = new ValidatedMethod({

    name: 'designAnomaly.removeDesignAnomaly',

    validate: new SimpleSchema({
        userRole:               {type: String},
        designAnomalyId:        {type: String},
        designAnomalyStatus:    {type: String}
    }).validator(),

    run({userRole, designAnomalyId, designAnomalyStatus}){

        const result = DesignAnomalyValidationApi.validateRemoveDesignAnomaly(userRole, designAnomalyStatus);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designAnomaly.removeDesignAnomaly.failValidation', result)
        }

        try {
            DesignAnomalyServices.removeDesignAnomaly(designAnomalyId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});