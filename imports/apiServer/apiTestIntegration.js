
import { Meteor } from 'meteor/meteor';

import {
    populateWorkPackageMashData,
    updateTestData,
    updateTestSummaryData,
    exportIntegrationTests

} from '../apiValidatedMethods/test_integration_methods.js'

// =====================================================================================================================
// Server API for Test Integration
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================
class ServerTestIntegrationApi {

    populateWorkPackageMashData(userContext, callback){

        populateWorkPackageMashData.call(
            {
                userContext: userContext
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateTestData(userContext, userRole, viewOptions, callback){

        updateTestData.call(
            {
                userContext: userContext,
                userRole: userRole,
                viewOptions: viewOptions
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    updateTestSummaryData(userContext, userRole, callback){

        updateTestSummaryData.call(
            {
                userContext: userContext,
                userRole: userRole
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    exportIntegrationTests(userContext, callback){

        exportIntegrationTests.call(
            {
                userContext: userContext
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

}

export default new ServerTestIntegrationApi();


// Meteor methods
Meteor.methods({

    'mash.loadUserFeatureFileData'(userContext){
        TestIntegrationServices.loadUserFeatureFileData(userContext);
    },

    'mash.updateMovedDesignStep'(designMashItemId){
        TestIntegrationServices.updateMovedDesignStep(designMashItemId);
    },

    'mash.updateMovedDevStep'(devMashItemId, targetMashItemId, userContext){
        TestIntegrationServices.updateMovedDevStep(devMashItemId, targetMashItemId, userContext);
    },

    'mash.exportScenario'(scenarioReferenceId, userContext){
        TestIntegrationServices.exportScenario(scenarioReferenceId, userContext)
    },

    'mash.exportFeatureConfiguration'(userContext){
        TestIntegrationServices.exportFeatureConfiguration(userContext);
    },



});

