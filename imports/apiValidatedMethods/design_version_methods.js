
import { Validation } from '../constants/validation_errors.js'

import { DesignVersionValidationApi }   from '../apiValidation/apiDesignVersionValidation.js';
import { DesignVersionServices }        from '../servicers/design/design_version_services.js';

//======================================================================================================================
//
// Meteor Validated Methods for Design Version Items
//
//======================================================================================================================

export const updateDesignVersionName = new ValidatedMethod({

    name: 'designVersion.updateDesignVersionName',

    validate: new SimpleSchema({
        userRole:           {type: String},
        designVersionId:    {type: String},
        newName:            {type: String}
    }).validator(),

    run({userRole, designVersionId, newName}){

        const result = DesignVersionValidationApi.validateUpdateDesignVersionName(userRole, designVersionId, newName);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designVersion.updateDesignVersionName.failValidation', result)
        }

        try {
            DesignVersionServices.updateDesignVersionName(designVersionId, newName);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});

export const updateDesignVersionNumber = new ValidatedMethod({

    name: 'designVersion.updateDesignVersionNumber',

    validate: new SimpleSchema({
        userRole:           {type: String},
        designVersionId:    {type: String},
        newNumber:          {type: String}
    }).validator(),

    run({userRole, designVersionId, newNumber}){

        const result = DesignVersionValidationApi.validateUpdateDesignVersionNumber(userRole, designVersionId, newNumber);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designVersion.updateDesignVersionNumber.failValidation', result)
        }

        try {
            DesignVersionServices.updateDesignVersionNumber(designVersionId, newNumber);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});


export const publishDesignVersion = new ValidatedMethod({

    name: 'designVersion.publishDesignVersion',

    validate: new SimpleSchema({
        userRole:           {type: String},
        designVersionId:    {type: String}
    }).validator(),

    run({userRole, designVersionId}){

        const result = DesignVersionValidationApi.validatePublishDesignVersion(userRole, designVersionId);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designVersion.publishDesignVersion.failValidation', result)
        }

        try {
            DesignVersionServices.publishDesignVersion(designVersionId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});

export const withdrawDesignVersion = new ValidatedMethod({

    name: 'designVersion.withdrawDesignVersion',

    validate: new SimpleSchema({
        userRole:           {type: String},
        designVersionId:    {type: String}
    }).validator(),

    run({userRole, designVersionId}){

        const result = DesignVersionValidationApi.validateWithdrawDesignVersion(userRole, designVersionId);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designVersion.withdrawDesignVersion.failValidation', result)
        }

        try {
            DesignVersionServices.withdrawDesignVersion(designVersionId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});

export const createNextDesignVersion = new ValidatedMethod({

    name: 'designVersion.createNextDesignVersion',

    validate: new SimpleSchema({
        userRole:           {type: String},
        designVersionId:    {type: String}
    }).validator(),

    run({userRole, designVersionId}){

        const result = DesignVersionValidationApi.validateCreateNextDesignVersion(userRole, designVersionId);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('designVersion.createNextDesignVersion.failValidation', result)
        }

        try {
            DesignVersionServices.createNextDesignVersion(designVersionId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});

export const updateWorkProgress = new ValidatedMethod({

    name: 'designVersion.updateWorkProgress',

    validate: new SimpleSchema({
        userContext:        {type: Object, blackbox: true},
    }).validator(),

    run({userContext}){

        try {
            DesignVersionServices.updateWorkProgress(userContext);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});


