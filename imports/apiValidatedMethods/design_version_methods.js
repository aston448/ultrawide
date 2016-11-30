
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
            throw new Meteor.Error('designVersion.updateDesignVersionName.fail', e)
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
            throw new Meteor.Error('designVersion.updateDesignVersionNumber.fail', e)
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
            throw new Meteor.Error('designVersion.publishDesignVersion.fail', e)
        }
    }

});

export const unpublishDesignVersion = new ValidatedMethod({

    name: 'designVersion.unpublishDesignVersion',

    validate: new SimpleSchema({
        userRole:           {type: String},
        designVersionId:    {type: String}
    }).validator(),

    run({userRole, designVersionId}){

        const result = DesignVersionValidationApi.validateUnpublishDesignVersion(userRole, designVersionId);

        if (result != Validation.VALID) {
            throw new Meteor.Error('designVersion.unpublishDesignVersion.failValidation', result)
        }

        try {
            DesignVersionServices.unpublishDesignVersion(designVersionId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('designVersion.unpublishDesignVersion.fail', e)
        }
    }

});


