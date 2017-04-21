
import { Validation } from '../constants/validation_errors.js'

import TestIntegrationValidationApi         from '../apiValidation/apiTestIntegrationValidation.js';
import TestIntegrationServices              from '../servicers/dev/test_integration_services.js';

//======================================================================================================================
//
// Meteor Validated Methods for Design Items
//
//======================================================================================================================

export const refreshTestData = new ValidatedMethod({

    name: 'testIntegration.refreshTestData',

    validate: new SimpleSchema({
        userContext: {type: Object, blackbox: true}
    }).validator(),

    run({userContext}){

        try {
            TestIntegrationServices.refreshTestData(userContext);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.error, e.stack)
        }
    }
});


export const updateTestSummaryData = new ValidatedMethod({

    name: 'testIntegration.updateTestSummaryData',

    validate: new SimpleSchema({
        userContext:    {type: Object, blackbox: true},
        updateTestData: {type: Boolean}
    }).validator(),

    run({userContext, updateTestData}){

        try {
            TestIntegrationServices.updateTestSummaryData(userContext, updateTestData);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.error, e.stack)
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
            console.log(e.stack);
            throw new Meteor.Error(e.error, e.stack)
        }
    }
});
