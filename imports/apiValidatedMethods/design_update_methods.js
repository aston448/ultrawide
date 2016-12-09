
import { Validation } from '../constants/validation_errors.js'

import DesignUpdateValidationApi      from '../apiValidation/apiDesignUpdateValidation.js';
import DesignUpdateServices           from '../servicers/design_update/design_update_services.js';

//======================================================================================================================
//
// Meteor Validated Methods for Design Update Items
//
//======================================================================================================================

export const addDesignUpdate = new ValidatedMethod({

    name: 'designUpdate.addDesignUpdate',

    validate: new SimpleSchema({
        userRole:           {type: String},
        designVersionId:    {type: String}
    }).validator(),

    run({userRole, designVersionId}){

        const result = DesignUpdateValidationApi.validateAddDesignUpdate(userRole, designVersionId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designUpdate.addDesignUpdate.failValidation', result)
        }

        try {
            DesignUpdateServices.addNewDesignUpdate(designVersionId, true);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designUpdate.addDesignUpdate.fail', e)
        }
    }

});

export const updateDesignUpdateName = new ValidatedMethod({

    name: 'designUpdate.updateDesignUpdateName',

    validate: new SimpleSchema({
        userRole:           {type: String},
        designUpdateId:     {type: String},
        newName:            {type: String}
    }).validator(),

    run({userRole, designUpdateId, newName}){

        const result = DesignUpdateValidationApi.validateUpdateDesignUpdateName(userRole, designUpdateId, newName);

        console.log(result);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designUpdate.updateDesignUpdateName.failValidation', result)
        }

        try {
            DesignUpdateServices.updateDesignUpdateName(designUpdateId, newName);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designUpdate.updateDesignUpdateName.fail', e)
        }
    }

});

export const updateDesignUpdateRef = new ValidatedMethod({

    name: 'designUpdate.updateDesignUpdateRef',

    validate: new SimpleSchema({
        userRole:           {type: String},
        designUpdateId:     {type: String},
        newRef:         {type: String}
    }).validator(),

    run({userRole, designUpdateId, newRef}){

        const result = DesignUpdateValidationApi.validateUpdateDesignUpdateReference(userRole, designUpdateId, newRef);

        console.log(result);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designUpdate.updateDesignUpdateRef.failValidation', result)
        }

        try {
            DesignUpdateServices.updateDesignUpdateRef(designUpdateId, newRef);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designUpdate.updateDesignUpdateRef.fail', e)
        }
    }

});

export const publishDesignUpdate = new ValidatedMethod({

    name: 'designUpdate.publishDesignUpdate',

    validate: new SimpleSchema({
        userRole:           {type: String},
        designUpdateId:     {type: String}
    }).validator(),

    run({userRole, designUpdateId}){

        const result = DesignUpdateValidationApi.validatePublishDesignUpdate(userRole, designUpdateId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designUpdate.publishDesignUpdate.failValidation', result)
        }

        try {
            DesignUpdateServices.publishUpdate(designUpdateId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designUpdate.publishDesignUpdate.fail', e)
        }
    }

});

export const withdrawDesignUpdate = new ValidatedMethod({

    name: 'designUpdate.withdrawDesignUpdate',

    validate: new SimpleSchema({
        userRole:           {type: String},
        designUpdateId:     {type: String}
    }).validator(),

    run({userRole, designUpdateId}){

        const result = DesignUpdateValidationApi.validateWithdrawDesignUpdate(userRole, designUpdateId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designUpdate.withdrawDesignUpdate.failValidation', result)
        }

        try {
            DesignUpdateServices.withdrawUpdate(designUpdateId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designUpdate.withdrawDesignUpdate.fail', e)
        }
    }

});

export const removeDesignUpdate = new ValidatedMethod({

    name: 'designUpdate.removeDesignUpdate',

    validate: new SimpleSchema({
        userRole:           {type: String},
        designUpdateId:     {type: String}
    }).validator(),

    run({userRole, designUpdateId}){

        const result = DesignUpdateValidationApi.validateRemoveDesignUpdate(userRole, designUpdateId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designUpdate.removeDesignUpdate.failValidation', result)
        }

        try {
            DesignUpdateServices.removeUpdate(designUpdateId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designUpdate.removeDesignUpdate.fail', e)
        }
    }

});
