
import DesignUpdateValidationApi      from '../apiValidation/apiDesignUpdateValidation.js';
import DesignUpdateServices           from '../servicers/design_update/design_update_services.js';

import { Validation } from '../constants/validation_errors.js'

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

export const updateDesignUpdateVersion = new ValidatedMethod({

    name: 'designUpdate.updateDesignUpdateVersion',

    validate: new SimpleSchema({
        userRole:           {type: String},
        designUpdateId:     {type: String},
        newVersion:         {type: String}
    }).validator(),

    run({userRole, designUpdateId, newVersion}){

        const result = DesignUpdateValidationApi.validateUpdateDesignUpdateVersion(userRole, designUpdateId, newVersion);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designUpdate.updateDesignUpdateVersion.failValidation', result)
        }

        try {
            DesignUpdateServices.updateDesignUpdateVersion(designUpdateId, newVersion);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designUpdate.updateDesignUpdateVersion.fail', e)
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
