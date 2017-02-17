
import { Validation } from '../constants/validation_errors.js'

import TestOutputLocationValidationApi      from '../apiValidation/apiTestOutputLocationValidation.js';
import TestOutputLocationServices           from '../servicers/configure/test_output_location_services.js';

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

export const addLocationFile = new ValidatedMethod({

    name: 'testOutputs.addLocationFile',

    validate: new SimpleSchema({
        userRole:   {type: String},
        locationId: {type: String}
    }).validator(),

    run({userRole, locationId}){

        const result = TestOutputLocationValidationApi.validateAddLocationFile(userRole);

        if (result != Validation.VALID) {
            throw new Meteor.Error('testOutputs.addLocationFile.failValidation', result)
        }

        try {
            TestOutputLocationServices.addLocationFile(locationId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('testOutputs.addLocationFile.fail', e)
        }
    }

});

export const saveLocationFile = new ValidatedMethod({

    name: 'testOutputs.saveLocationFile',

    validate: new SimpleSchema({
        userRole:       {type: String},
        locationFile:   {type: Object, blackbox: true}
    }).validator(),

    run({userRole, locationFile}){

        const result = TestOutputLocationValidationApi.validateSaveLocationFile(userRole, locationFile);

        if (result != Validation.VALID) {
            throw new Meteor.Error('testOutputs.saveLocationFile.failValidation', result)
        }

        try {
            TestOutputLocationServices.saveLocationFile(locationFile);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('testOutputs.saveLocationFile.fail', e)
        }
    }

});


export const removeLocationFile = new ValidatedMethod({

    name: 'testOutputs.removeLocationFile',

    validate: new SimpleSchema({
        userRole:       {type: String},
        locationFileId: {type: String}
    }).validator(),

    run({userRole, locationFileId}){

        const result = TestOutputLocationValidationApi.validateRemoveLocationFile(userRole);

        if (result != Validation.VALID) {
            throw new Meteor.Error('testOutputs.removeLocationFile.failValidation', result)
        }

        try {
            TestOutputLocationServices.removeLocationFile(locationFileId);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
        }
    }

});

export const saveUserConfiguration = new ValidatedMethod({

    name: 'testOutputs.saveUserConfiguration',

    validate: new SimpleSchema({
        userRole:           {type: String},
        userConfiguration:  {type: Object, blackbox: true}
    }).validator(),

    run({userRole, userConfiguration}){

        const result = TestOutputLocationValidationApi.validateSaveUserConfiguration();

        if (result != Validation.VALID) {
            throw new Meteor.Error('testOutputs.saveUserConfiguration.failValidation', result)
        }

        try {
            TestOutputLocationServices.saveUserConfiguration(userConfiguration);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
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
            throw new Meteor.Error(e.error, e.message)
        }
    }

});
