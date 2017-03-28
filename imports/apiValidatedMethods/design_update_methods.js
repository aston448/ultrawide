
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

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designUpdate.addDesignUpdate.failValidation', result)
        }

        try {
            DesignUpdateServices.addNewDesignUpdate(designVersionId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
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

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designUpdate.updateDesignUpdateName.failValidation', result)
        }

        try {
            DesignUpdateServices.updateDesignUpdateName(designUpdateId, newName);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
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

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designUpdate.updateDesignUpdateRef.failValidation', result)
        }

        try {
            DesignUpdateServices.updateDesignUpdateRef(designUpdateId, newRef);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
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

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designUpdate.publishDesignUpdate.failValidation', result)
        }

        try {
            DesignUpdateServices.publishUpdate(designUpdateId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
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

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designUpdate.withdrawDesignUpdate.failValidation', result)
        }

        try {
            DesignUpdateServices.withdrawUpdate(designUpdateId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
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

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designUpdate.removeDesignUpdate.failValidation', result)
        }

        try {
            DesignUpdateServices.removeUpdate(designUpdateId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
        }
    }

});

export const updateMergeAction = new ValidatedMethod({

    name: 'designUpdate.updateMergeAction',

    validate: new SimpleSchema({
        userRole:           {type: String},
        designUpdateId:     {type: String},
        newAction:          {type: String}
    }).validator(),

    run({userRole, designUpdateId, newAction}){

        const result = DesignUpdateValidationApi.validateUpdateMergeAction(userRole, designUpdateId);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designUpdate.updateMergeAction.failValidation', result)
        }

        try {
            DesignUpdateServices.updateMergeAction(designUpdateId, newAction);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
        }
    }

});
