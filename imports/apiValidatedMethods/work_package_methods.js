
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
            throw new Meteor.Error('workPackage.addWorkPackage.fail', e)
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
            throw new Meteor.Error('workPackage.updateWorkPackageName.fail', e)
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
            throw new Meteor.Error('workPackage.publishWorkPackage.fail', e)
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
            throw new Meteor.Error('workPackage.withdrawWorkPackage.fail', e)
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
            throw new Meteor.Error('workPackage.removeWorkPackage.fail', e)
        }
    }
});