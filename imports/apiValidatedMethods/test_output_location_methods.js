
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
