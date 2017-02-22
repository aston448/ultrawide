
import { Validation } from '../constants/validation_errors.js'

import WorkPackageServices         from '../servicers/work/work_package_services.js';
import WorkPackageValidationApi    from '../apiValidation/apiWorkPackageValidation.js';

//======================================================================================================================
//
// Meteor Validated Methods for Work Package Items
//
//======================================================================================================================

export const addWorkPackage = new ValidatedMethod({

    name: 'workPackage.addWorkPackage',

    validate: new SimpleSchema({
        userRole:           {type: String},
        designVersionId:    {type: String},
        designUpdateId:     {type: String},
        workPackageType:    {type: String}
    }).validator(),

    run({userRole, designVersionId, designUpdateId, workPackageType}){

        // Server validation
        const result = WorkPackageValidationApi.validateAddWorkPackage(userRole, designVersionId, designUpdateId, workPackageType);

        if (result != Validation.VALID) {
            throw new Meteor.Error('workPackage.addWorkPackage.failValidation', result)
        }

        // Server action
        try {
            WorkPackageServices.addNewWorkPackage(designVersionId, designUpdateId, workPackageType, true);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
        }
    }
});

export const updateWorkPackageName = new ValidatedMethod({

    name: 'workPackage.updateWorkPackageName',

    validate: new SimpleSchema({
        userRole:           {type: String},
        workPackageId:      {type: String},
        newName:            {type: String}
    }).validator(),

    run({userRole, workPackageId, newName}){

        // Server validation
        const result = WorkPackageValidationApi.validateUpdateWorkPackageName(userRole, workPackageId, newName);

        if (result != Validation.VALID) {
            throw new Meteor.Error('workPackage.updateWorkPackageName.failValidation', result)
        }

        // Server action
        try {
            WorkPackageServices.updateWorkPackageName(workPackageId, newName);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
        }
    }
});

export const publishWorkPackage = new ValidatedMethod({

    name: 'workPackage.publishWorkPackage',

    validate: new SimpleSchema({
        userRole:           {type: String},
        workPackageId:      {type: String}
    }).validator(),

    run({userRole, workPackageId}){

        // Server validation
        const result = WorkPackageValidationApi.validatePublishWorkPackage(userRole, workPackageId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('workPackage.publishWorkPackage.failValidation', result)
        }

        // Server action
        try {
            WorkPackageServices.publishWorkPackage(workPackageId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
        }
    }
});

export const withdrawWorkPackage = new ValidatedMethod({

    name: 'workPackage.withdrawWorkPackage',

    validate: new SimpleSchema({
        userRole:           {type: String},
        workPackageId:      {type: String}
    }).validator(),

    run({userRole, workPackageId}){

        // Server validation
        const result = WorkPackageValidationApi.validateWithdrawWorkPackage(userRole, workPackageId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('workPackage.withdrawWorkPackage.failValidation', result)
        }

        // Server action
        try {
            WorkPackageServices.withdrawWorkPackage(workPackageId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
        }
    }
});

export const adoptWorkPackage = new ValidatedMethod({

    name: 'workPackage.adoptWorkPackage',

    validate: new SimpleSchema({
        userRole:           {type: String},
        workPackageId:      {type: String},
        userId:             {type: String}
    }).validator(),

    run({userRole, workPackageId, userId}){

        // Server validation
        const result = WorkPackageValidationApi.validateAdoptWorkPackage(userRole, workPackageId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('workPackage.adoptWorkPackage.failValidation', result)
        }

        // Server action
        try {
            WorkPackageServices.adoptWorkPackage(workPackageId, userId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
        }
    }
});

export const releaseWorkPackage = new ValidatedMethod({

    name: 'workPackage.releaseWorkPackage',

    validate: new SimpleSchema({
        userRole:           {type: String},
        workPackageId:      {type: String},
        userId:             {type: String}
    }).validator(),

    run({userRole, workPackageId, userId}){

        // Server validation
        const result = WorkPackageValidationApi.validateReleaseWorkPackage(userRole, userId, workPackageId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('workPackage.releaseWorkPackage.failValidation', result)
        }

        // Server action
        try {
            WorkPackageServices.releaseWorkPackage(workPackageId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
        }
    }
});

export const removeWorkPackage = new ValidatedMethod({

    name: 'workPackage.removeWorkPackage',

    validate: new SimpleSchema({
        userRole:           {type: String},
        workPackageId:      {type: String}
    }).validator(),

    run({userRole, workPackageId}){

        // Server validation
        const result = WorkPackageValidationApi.validateRemoveWorkPackage(userRole, workPackageId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('workPackage.removeWorkPackage.failValidation', result)
        }

        // Server action
        try {
            WorkPackageServices.removeWorkPackage(workPackageId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
        }
    }
});