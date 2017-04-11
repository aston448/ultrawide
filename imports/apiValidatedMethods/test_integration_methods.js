
import { Validation } from '../constants/validation_errors.js'

import TestIntegrationValidationApi         from '../apiValidation/apiTestIntegrationValidation.js';
import TestIntegrationServices              from '../servicers/dev/test_integration_services.js';

//======================================================================================================================
//
// Meteor Validated Methods for Design Items
//
//======================================================================================================================

export const populateWorkPackageMashData = new ValidatedMethod({

    name: 'testIntegration.populateWorkPackageMashData',

    validate: new SimpleSchema({
        userContext: {type: Object, blackbox: true}
    }).validator(),

    run({userContext}){

        try {
            TestIntegrationServices.populateDesignDevMashData(userContext);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
        }
    }
});

export const updateTestResults = new ValidatedMethod({

    name: 'testIntegration.updateTestResults',

    validate: new SimpleSchema({
        userContext:    {type: Object, blackbox: true},
        viewOptions:    {type: Object, blackbox: true, optional: true}
    }).validator(),

    run({userContext, viewOptions}){

        try {
            TestIntegrationServices.updateDesignDevMashResults(userContext, viewOptions);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
        }
    }
});

export const updateTestSummaryData = new ValidatedMethod({

    name: 'testIntegration.updateTestSummaryData',

    validate: new SimpleSchema({
        userContext:    {type: Object, blackbox: true}
    }).validator(),

    run({userContext}){

        try {
            TestIntegrationServices.updateTestSummaryData(userContext);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
        }
    }
});

export const exportIntegrationTests = new ValidatedMethod({

    name: 'testIntegration.exportIntegrationTests',

    validate: new SimpleSchema({
        userContext:    {type: Object, blackbox: true},
        userRole:       {type: String},
        testRunner:     {type: String}
    }).validator(),

    run({userContext, userRole, testRunner}){

        const result = TestIntegrationValidationApi.validateExportIntegrationTests(userRole, userContext);

        if (result != Validation.VALID) {
            throw new Meteor.Error('textEditor.exportIntegrationTests.failValidation', result)
        }

        try {
            TestIntegrationServices.exportIntegrationTestFile(userContext, testRunner);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error(e.error, e.message)
        }
    }
});
