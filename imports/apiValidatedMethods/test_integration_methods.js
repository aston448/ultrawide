
import { Validation } from '../constants/validation_errors.js'

import DesignValidationApi      from '../apiValidation/apiDesignValidation.js';
import  TestIntegrationServices            from '../servicers/dev/test_integration_services.js';

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
            TestIntegrationServices.populateWorkPackageMashData(userContext);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('testIntegration.populateWorkPackageMashData.fail', e)
        }
    }
});

export const updateTestData = new ValidatedMethod({

    name: 'testIntegration.updateTestData',

    validate: new SimpleSchema({
        userContext:    {type: Object, blackbox: true},
        userRole:       {type: String},
        viewOptions:    {type: Object, blackbox: true}
    }).validator(),

    run({userContext, userRole, viewOptions}){

        try {
            TestIntegrationServices.updateTestMashData(userContext, userRole, viewOptions);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('testIntegration.updateTestData.fail', e)
        }
    }
});

export const updateTestSummaryData = new ValidatedMethod({

    name: 'testIntegration.updateTestSummaryData',

    validate: new SimpleSchema({
        userContext:    {type: Object, blackbox: true},
        userRole:       {type: String}
    }).validator(),

    run({userContext, userRole}){

        try {
            TestIntegrationServices.updateTestSummaryData(userContext, userRole);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('testIntegration.updateTestSummaryData.fail', e)
        }
    }
});

export const exportIntegrationTests = new ValidatedMethod({

    name: 'testIntegration.exportIntegrationTests',

    validate: new SimpleSchema({
        userContext:    {type: Object, blackbox: true}
    }).validator(),

    run({userContext}){

        try {
            TestIntegrationServices.exportIntegrationTests(userContext);
        } catch (e) {
            console.log(e);
            throw new Meteor.Error('testIntegration.exportIntegrationTests.fail', e)
        }
    }
});
