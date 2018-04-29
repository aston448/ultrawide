
import { Validation } from '../constants/validation_errors.js'

import { DesignValidationApi }      from '../apiValidation/apiDesignValidation.js';
import { DesignServices }           from '../servicers/design/design_services.js';

//======================================================================================================================
//
// Meteor Validated Methods for Design Items
//
//======================================================================================================================

export const addDesign = new ValidatedMethod({

    name: 'design.addDesign',

    validate: new SimpleSchema({
        userRole: {type: String}
    }).validator(),

    run({userRole}){

        const result = DesignValidationApi.validateAddDesign(userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('design.addDesign.failValidation', result)
        }

        try {
            DesignServices.addDesign(true);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});

export const updateDesignName = new ValidatedMethod({

    name: 'design.updateDesignName',

    validate: new SimpleSchema({
        userRole: {type: String},
        designId: {type: String},
        newName:  {type: String}
    }).validator(),

    run({userRole, designId, newName}){

        const result = DesignValidationApi.validateUpdateDesignName(userRole, newName, designId);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('design.updateDesignName.failValidation', result)
        }

        try {
            DesignServices.updateDesignName(designId, newName);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});

export const removeDesign = new ValidatedMethod({

    name: 'design.removeDesign',

    validate: new SimpleSchema({
        userRole: {type: String},
        designId: {type: String}
    }).validator(),

    run({userRole, designId}){

        const result = DesignValidationApi.validateRemoveDesign(userRole, designId);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('design.removeDesign.failValidation', result)
        }

        try {
            DesignServices.removeDesign(designId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }

});

export const updateDefaultAspectName = new ValidatedMethod({

    name: 'design.updateDefaultAspectName',

    validate: new SimpleSchema({
        userContext:        {type: Object, blackbox: true},
        userRole:           {type: String},
        defaultAspectId:    {type: String},
        newNamePlain:       {type: String},
        newNameRaw:         {type: Object, blackbox: true}
    }).validator(),

    run({userContext, userRole, defaultAspectId, newNamePlain, newNameRaw}){

        const result = DesignValidationApi.validateUpdateDefaultAspectName(userContext, userRole, defaultAspectId, newNamePlain);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('design.updateDefaultAspectName.failValidation', result)
        }

        try {
            DesignServices.updateDefaultFeatureAspectName(defaultAspectId, newNamePlain, newNameRaw);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const updateDefaultAspectIncluded = new ValidatedMethod({

    name: 'design.updateDefaultAspectIncluded',

    validate: new SimpleSchema({
        userRole:           {type: String},
        defaultAspectId:    {type: String},
        included:           {type: Boolean}
    }).validator(),

    run({userRole, defaultAspectId, included}){

        const result = DesignValidationApi.validateUpdateDefaultAspectIncluded(userRole);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('design.updateDefaultAspectIncluded.failValidation', result)
        }

        try {
            DesignServices.updateDefaultFeatureAspectIncluded(defaultAspectId, included);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});
