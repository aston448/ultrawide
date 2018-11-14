import { WorkItemValidationApi }      from '../apiValidation/apiWorkItemValidation.js';
import { WorkItemServices }           from '../servicers/work/work_item_services.js';

import { Validation } from '../constants/validation_errors.js'


//======================================================================================================================
//
// Meteor Validated Methods for Work Items
//
//======================================================================================================================

export const addNewIncrement = new ValidatedMethod({

    name: 'workItems.addNewIncrement',

    validate: new SimpleSchema({
        designVersionId:        {type: String},
        userRole:               {type: String}
    }).validator(),

    run({designVersionId, userRole}){

        const result = WorkItemValidationApi.validateAddNewIteration(userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('workItems.addNewIncrement.failValidation', result)
        }

        try {
            WorkItemServices.addNewIncrement(designVersionId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const addNewIteration = new ValidatedMethod({

    name: 'workItems.addNewIteration',

    validate: new SimpleSchema({
        designVersionId:        {type: String},
        parentRefId:            {type: String},
        userRole:               {type: String}
    }).validator(),

    run({designVersionId, parentRefId, userRole}){

        const result = WorkItemValidationApi.validateAddNewIteration(userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('workItems.addNewIteration.failValidation', result)
        }

        try {
            WorkItemServices.addNewIteration(designVersionId, parentRefId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const removeWorkItem = new ValidatedMethod({

    name: 'workItems.removeWorkItem',

    validate: new SimpleSchema({
        workItemId:             {type: String},
        userRole:               {type: String}
    }).validator(),

    run({workItemId, userRole}){

        const result = WorkItemValidationApi.validateRemoveWorkItem(workItemId, userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('workItems.removeWorkItem.failValidation', result)
        }

        try {
            WorkItemServices.removeWorkItem(workItemId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const saveWorkItemDetails = new ValidatedMethod({

    name: 'workItems.saveWorkItemDetails',

    validate: new SimpleSchema({
        workItem:               {type: Object, blackbox: true},
        newName:                {type: String},
        newLink:                {type: String},
        userRole:               {type: String}
    }).validator(),

    run({workItem, newName, newLink, userRole}){

        const result = WorkItemValidationApi.validateSaveWorkItemDetails(workItem, newName, userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('workItems.saveWorkItemDetails.failValidation', result)
        }

        try {
            WorkItemServices.saveWorkItemDetails(workItem, newName, newLink);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const reorderWorkItem = new ValidatedMethod({

    name: 'workItems.reorderWorkItem',

    validate: new SimpleSchema({
        movingWorkItem:         {type: Object, blackbox: true},
        targetWorkItem:         {type: Object, blackbox: true},
        userRole:               {type: String}
    }).validator(),

    run({movingWorkItem, targetWorkItem, userRole}){

        const result = WorkItemValidationApi.validateReorderWorkItem(userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('workItems.reorderWorkItem.failValidation', result)
        }

        try {
            WorkItemServices.reorderWorkItem(movingWorkItem, targetWorkItem);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const moveWorkItem = new ValidatedMethod({

    name: 'workItems.moveWorkItem',

    validate: new SimpleSchema({
        movingWorkItem:         {type: Object, blackbox: true},
        targetParentItem:       {type: Object, blackbox: true, optional: true},
        userRole:               {type: String}
    }).validator(),

    run({movingWorkItem, targetParentItem, userRole}){

        const result = WorkItemValidationApi.validateMoveWorkItem(userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('workItems.moveWorkItem.failValidation', result)
        }

        try {
            WorkItemServices.moveWorkItem(movingWorkItem, targetParentItem);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});