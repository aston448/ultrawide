
import { Validation } from '../constants/validation_errors.js'

import TestOutputLocationValidationApi      from '../apiValidation/apiTestOutputLocationValidation.js';
import TestOutputLocationServices           from '../servicers/dev/test_output_location_services.js';

//======================================================================================================================
//
// Meteor Validated Methods for Design Items
//
//======================================================================================================================

export const addLocation = new ValidatedMethod({

    name: 'testOutputs.addLocation',

    validate: new SimpleSchema({
        userRole: {type: String}
    }).validator(),

    run({userRole}){

        const result = TestOutputLocationValidationApi.validateAddLocation(userRole);

        if (result != Validation.VALID) {
            throw new Meteor.Error('testOutputs.addLocation.failValidation', result)
        }

        try {
            TestOutputLocationServices.addLocation();
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('testOutputs.addLocation.fail', e)
        }
    }

});

export const saveLocation = new ValidatedMethod({

    name: 'testOutputs.saveLocation',

    validate: new SimpleSchema({
        userRole: {type: String},
        location: {type: Object, blackbox: true}
    }).validator(),

    run({userRole, location}){

        const result = TestOutputLocationValidationApi.validateSaveLocation(userRole, location);

        if (result != Validation.VALID) {
            throw new Meteor.Error('testOutputs.saveLocation.failValidation', result)
        }

        try {
            TestOutputLocationServices.saveLocation(location);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('testOutputs.saveLocation.fail', e)
        }
    }

});


export const removeLocation = new ValidatedMethod({

    name: 'testOutputs.removeLocation',

    validate: new SimpleSchema({
        userRole:   {type: String},
        locationId: {type: String}
    }).validator(),

    run({userRole, locationId}){

        const result = TestOutputLocationValidationApi.validateRemoveLocation(userRole);

        if (result != Validation.VALID) {
            throw new Meteor.Error('testOutputs.removeLocation.failValidation', result)
        }

        try {
            TestOutputLocationServices.removeLocation(locationId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('testOutputs.removeLocation.fail', e)
        }
    }

});

export const updateUserConfiguration = new ValidatedMethod({

    name: 'testOutputs.updateUserConfiguration',

    validate: new SimpleSchema({
        userId:     {type: String},
        userRole:   {type: String}

    }).validator(),

    run({userId, userRole}){

        try {
            TestOutputLocationServices.updateUserConfiguration(userId, userRole);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('testOutputs.updateUserConfiguration.fail', e)
        }
    }

});
