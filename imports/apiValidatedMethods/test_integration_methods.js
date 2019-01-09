
import { Validation } from '../constants/validation_errors.js'

import { TestIntegrationValidationApi }         from '../apiValidation/apiTestIntegrationValidation.js';
import { TestIntegrationServices }              from '../servicers/dev/test_integration_services.js';
import { ProjectSummaryServices }               from "../servicers/summary/project_summary_services.js";

//======================================================================================================================
//
// Meteor Validated Methods for Design Items
//
//======================================================================================================================

export const refreshTestData = new ValidatedMethod({

    // The full refresh flag is here in case we want to implement more than one sort of test data refresh.

    name: 'testIntegration.refreshTestData',

    validate: new SimpleSchema({
        userContext: {type: Object, blackbox: true},
        fullRefresh: {type: Boolean}
    }).validator(),

    run({userContext, fullRefresh}){

        try {
            TestIntegrationServices.refreshTestData(userContext, fullRefresh);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const refreshWorkProgressData = new ValidatedMethod({

    // The full refresh flag is here in case we want to implement more than one sort of test data refresh.

    name: 'testIntegration.refreshWorkProgressData',

    validate: new SimpleSchema({
        userContext: {type: Object, blackbox: true}
    }).validator(),

    run({userContext}){

        try {
            ProjectSummaryServices.refreshUserProjectWorkSummary(userContext);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
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
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const updateTestSummaryDataForFeature = new ValidatedMethod({

    name: 'testIntegration.updateTestSummaryDataForFeature',

    validate: new SimpleSchema({
        userContext:    {type: Object, blackbox: true}
    }).validator(),

    run({userContext}){

        try {
            TestIntegrationServices.updateTestSummaryForFeature(userContext);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const exportIntegrationTests = new ValidatedMethod({

    name: 'testIntegration.exportIntegrationTests',

    validate: new SimpleSchema({
        userContext:    {type: Object, blackbox: true},
        outputDir:      {type: String},
        userRole:       {type: String},
        testRunner:     {type: String},
        testType:       {type: String}
    }).validator(),

    run({userContext, outputDir, userRole, testRunner, testType}){

        const result = TestIntegrationValidationApi.validateExportIntegrationTests(userRole, userContext);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('textEditor.exportIntegrationTests.failValidation', result)
        }

        try {
            TestIntegrationServices.exportIntegrationTestFile(userContext, outputDir, testRunner, testType);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});

export const exportUnitTests = new ValidatedMethod({

    name: 'testIntegration.exportUnitTests',

    validate: new SimpleSchema({
        userContext:    {type: Object, blackbox: true},
        outputDir:      {type: String},
        userRole:       {type: String},
        testRunner:     {type: String}
    }).validator(),

    run({userContext, outputDir, userRole, testRunner}){

        const result = TestIntegrationValidationApi.validateExportUnitTests(userRole, userContext);

        if (result !== Validation.VALID) {
            throw new Meteor.Error('textEditor.exportUnitTests.failValidation', result)
        }

        try {
            TestIntegrationServices.exportUnitTestFile(userContext, outputDir, testRunner);
        } catch (e) {
            console.log(e.stack);
            throw new Meteor.Error(e.code, e.stack)
        }
    }
});
