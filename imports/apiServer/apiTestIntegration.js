
import {
    refreshTestData,
    refreshWorkProgressData,
    updateTestSummaryData,
    updateTestSummaryDataForFeature,
    exportIntegrationTests

} from '../apiValidatedMethods/test_integration_methods.js'

// =====================================================================================================================
// Server API for Test Integration
//
// Calls Meteor Validated Methods and returns asynchronous results to callback
// =====================================================================================================================
class ServerTestIntegrationApiClass {

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

    refreshWorkProgressData(userContext, callback){

        refreshWorkProgressData.call(
            {
                userContext: userContext
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

    updateTestSummaryDataForFeature(userContext, callback){

        updateTestSummaryDataForFeature.call(
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

export const ServerTestIntegrationApi = new ServerTestIntegrationApiClass();

