
import {
    refreshTestData,
    exportIntegrationTests,
    exportUnitTests

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

    exportIntegrationTests(userContext, outputDir, userRole, testRunner, testType, callback){

        exportIntegrationTests.call(
            {
                userContext:    userContext,
                outputDir:      outputDir,
                userRole:       userRole,
                testRunner:     testRunner,
                testType:       testType
            },
            (err, result) => {
                callback(err, result);
            }
        );
    };

    exportUnitTests(userContext, outputDir, userRole, testRunner, callback){

        exportUnitTests.call(
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

