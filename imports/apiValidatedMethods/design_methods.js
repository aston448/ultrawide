
import { Validation } from '../constants/validation_errors.js'

import DesignValidationApi      from '../apiValidation/apiDesignValidation.js';
import DesignServices           from '../servicers/design/design_services.js';

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

        if (result != Validation.VALID) {
            throw new Meteor.Error('design.addDesign.failValidation', result)
        }

        try {
            DesignServices.addDesign(true);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.error, e.stack)
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

        if (result != Validation.VALID) {
            throw new Meteor.Error('design.updateDesignName.failValidation', result)
        }

        try {
            DesignServices.updateDesignName(designId, newName);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.error, e.stack)
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

        if (result != Validation.VALID) {
            throw new Meteor.Error('design.removeDesign.failValidation', result)
        }

        try {
            DesignServices.removeDesign(designId);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.error, e.stack)
        }
    }

});
