
import { Meteor } from 'meteor/meteor';

import {
    refreshTestData,
    updateTestSummaryData,
    exportIntegrationTests

} from '../apiValidatedMethods/test_integration_methods.js'

// =====================================================================================================================
// Server API for Test Integration
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================
class ServerTestIntegrationApi {

    refreshTestData(userContext, fullRefresh, callback){

        refreshTestData.call(
            {
                userContext: userContext,
                fullRefresh: fullRefresh
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };


    updateTestSummaryData(userContext, callback){

        updateTestSummaryData.call(
            {
                userContext:    userContext
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    exportIntegrationTests(userContext, outputDir, userRole, testRunner, callback){

        exportIntegrationTests.call(
            {
                userContext:    userContext,
                outputDir:      outputDir,
                userRole:       userRole,
                testRunner:     testRunner
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

