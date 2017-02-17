
import { Validation } from '../constants/validation_errors.js'

import DesignVersionValidationApi   from '../apiValidation/apiDesignVersionValidation.js';
import DesignVersionServices        from '../servicers/design/design_version_services.js';

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

        if (result != Validation.VALID) {
            throw new Meteor.Error('designVersion.updateDesignVersionName.failValidation', result)
        }

        try {
            DesignVersionServices.updateDesignVersionName(designVersionId, newName);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
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

        if (result != Validation.VALID) {
            throw new Meteor.Error('designVersion.updateDesignVersionNumber.failValidation', result)
        }

        try {
            DesignVersionServices.updateDesignVersionNumber(designVersionId, newNumber);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
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

        if (result != Validation.VALID) {
            throw new Meteor.Error('designVersion.publishDesignVersion.failValidation', result)
        }

        try {
            DesignVersionServices.publishDesignVersion(designVersionId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
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

        if (result != Validation.VALID) {
            throw new Meteor.Error('designVersion.withdrawDesignVersion.failValidation', result)
        }

        try {
            DesignVersionServices.withdrawDesignVersion(designVersionId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
        }
    }

});

export const updateWorkingDesignVersion = new ValidatedMethod({

    name: 'designVersion.updateWorkingDesignVersion',

    validate: new SimpleSchema({
        userRole:           {type: String},
        designVersionId:    {type: String}
    }).validator(),

    run({userRole, designVersionId}){

        const result = DesignVersionValidationApi.validateUpdateWorkingDesignVersion(userRole, designVersionId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designVersion.updateWorkingDesignVersion.failValidation', result)
        }

        try {
            DesignVersionServices.updateWorkingDesignVersion(designVersionId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
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

        if (result != Validation.VALID) {
            throw new Meteor.Error('designVersion.createNextDesignVersion.failValidation', result)
        }

        try {
            DesignVersionServices.createNextDesignVersion(designVersionId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
        }
    }

});


