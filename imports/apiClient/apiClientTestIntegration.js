// == IMPORTS ==========================================================================================================

// Ultrawide Services
import { ViewType, MessageType, TestRunner, RoleType, ComponentType, LogLevel } from '../constants/constants.js';
import { Validation } from '../constants/validation_errors.js';
import { TestIntegrationMessages } from '../constants/message_texts.js'

import { log } from '../common/utils.js';

import { ServerTestIntegrationApi }         from '../apiServer/apiTestIntegration.js';
import { TestIntegrationValidationApi }     from '../apiValidation/apiTestIntegrationValidation.js';
import { ClientWorkItemServices }           from '../apiClient/apiClientWorkItem.js';
import { ClientDesignUpdateServices }       from '../apiClient/apiClientDesignUpdate.js';

// Data Access
import { DesignComponentData }              from '../data/design/design_component_db.js';
import { DesignUpdateComponentData }        from '../data/design_update/design_update_component_db.js';

// REDUX services
import store from '../redux/store'
import {updateUserMessage, updateTestDataFlag, setCurrentView} from '../redux/actions'

// =====================================================================================================================
// Client API for Design Items
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================
class ClientTestIntegrationServicesClass {


    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // Developer chooses to export an integration or acceptance test file from a WP Feature
    exportIntegrationTestFile(userContext, userRole, testType){

        const outputDir = store.getState().intTestOutputDir;

        // Client validation
        let result = TestIntegrationValidationApi.validateExportIntegrationTests(userRole, userContext);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // TODO - Get Test Runner from user settings
        // Real action call - server actions
        ServerTestIntegrationApi.exportIntegrationTests(userContext, outputDir, userRole, TestRunner.CHIMP_MOCHA, testType, (err, result) => {

            if (err) {
                if(err.error === "FILE_EXISTS"){
                    alert(err.reason);
                } else {
                    // Unexpected error as all expected errors already handled - show alert.
                    // Can't update screen here because of error
                    alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
                }

            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: TestIntegrationMessages.MSG_INT_TEST_EXPORTED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // Developer chooses to export a unit test file from a WP Feature
    exportUnitTestFile(userContext, userRole){

        const outputDir = store.getState().intTestOutputDir;

        // Client validation
        let result = TestIntegrationValidationApi.validateExportUnitTests(userRole, userContext);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // TODO - Get Test Runner from user settings
        // Real action call - server actions
        ServerTestIntegrationApi.exportUnitTests(userContext, outputDir, userRole, TestRunner.METEOR_MOCHA, (err, result) => {

            if (err) {
                if(err.error === "FILE_EXISTS"){
                    alert(err.reason);
                } else {
                    // Unexpected error as all expected errors already handled - show alert.
                    // Can't update screen here because of error
                    alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
                }

            } else {

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: TestIntegrationMessages.MSG_UNIT_TEST_EXPORTED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // NON-VALIDATED METHODS THAT CALL SERVER API ======================================================================

    // API Methods +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


    // Test Summary data needs refreshing - flag says if we need to recalculate all results or not
    updateTestSummaryData(userContext){

        log((msg) => console.log(msg), LogLevel.DEBUG, "REFRESH TEST SUMMARY DATA...");

        store.dispatch(updateUserMessage({
            messageType: MessageType.WARNING,
            messageText: 'Updating test summary data'
        }));

        ServerTestIntegrationApi.updateTestSummaryData(userContext, (err, result) => {

            if(err){

                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                store.dispatch(updateTestDataFlag());

                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: 'Summary updated'
                }));
            }
        });

    }

    // Test Summary data needs refreshing for one feature - probably because of changing test expectations
    updateTestSummaryDataForFeature(userContext){

        log((msg) => console.log(msg), LogLevel.DEBUG, "REFRESH TEST SUMMARY DATA FOR FEATURE");

        store.dispatch(updateUserMessage({
            messageType: MessageType.INFO,
            messageText: 'Updating test summary data for feature...'
        }));

        ServerTestIntegrationApi.updateTestSummaryDataForFeature(userContext, (err, result) => {

            if(err){

                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                store.dispatch(updateTestDataFlag());

                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: 'Summary updated'
                }));
            }
        });

    }

    // User has requested update of WP / DU progress data
    refreshWorkProgressData(userContext){

        log((msg) => console.log(msg), LogLevel.DEBUG, "REFRESH WORK DATA...");

        const currentView = store.getState().currentAppView;

        log((msg) => console.log(msg), LogLevel.DEBUG, "Current view is {}", currentView);

        store.dispatch(setCurrentView(ViewType.WAIT));

        store.dispatch(updateUserMessage({
            messageType: MessageType.INFO,
            messageText: 'Refreshing Work Progress and Backlogs...'
        }));

        ServerTestIntegrationApi.refreshWorkProgressData(userContext, (err, result) => {

            if(err){

                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Mash is populated to carry on with test data if needed

                store.dispatch(updateTestDataFlag());

                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: 'Work Progress updated'
                }));

                log((msg) => console.log(msg), LogLevel.DEBUG, "REFRESH WORK DATA.  View to {}", currentView);

                store.dispatch(setCurrentView(currentView));
            }
        });

        return {success: true, message: ''};
    }

    // User has requested a complete refresh of test data --------------------------------------------------------------
    refreshTestData(userContext, fullRefresh){

        log((msg) => console.log(msg), LogLevel.PERF, "REFRESH TEST DATA...");

        const currentView = store.getState().currentAppView;

        log((msg) => console.log(msg), LogLevel.PERF, "Current view is {}", currentView);

        store.dispatch(setCurrentView(ViewType.WAIT));

        store.dispatch(updateUserMessage({
            messageType: MessageType.WARNING,
            messageText: 'Loading test definitions and results...'
        }));

        ServerTestIntegrationApi.refreshTestData(userContext, fullRefresh, (err, result) => {

            if(err){

                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Mash is populated to carry on with test data if needed

                store.dispatch(updateTestDataFlag());

                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: 'Test data and results loaded'
                }));

                store.dispatch(setCurrentView(currentView));
            }
        });

        return {success: true, message: ''};
    }

    // Get latest test results required for current view options
    // updateTestResults(userContext, viewOptions){
    //
    //     store.dispatch(updateUserMessage({
    //         messageType: MessageType.WARNING,
    //         messageText: 'Synchronising server test results data...'
    //     }));
    //
    //     ServerTestIntegrationApi.updateTestResults(userContext, viewOptions, (err, result) => {
    //
    //         if(err){
    //
    //             alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
    //         } else {
    //
    //             store.dispatch(updateUserMessage({
    //                 messageType: MessageType.INFO,
    //                 messageText: 'Test results loaded'
    //             }));
    //
    //             store.dispatch(updateTestDataFlag())
    //         }
    //     });
    // };


    // LOCAL CLIENT ACTIONS ============================================================================================

    getDesignItem(userContext, designItemId){

        if(userContext.designUpdateId === 'NONE'){
            return DesignComponentData.getDesignComponentById(designItemId);
        } else {
            return DesignUpdateComponentData.getUpdateComponentById(designItemId);
        }
    }

    hasScenarios(featureAspect, userContext){

        let scenarioCount = 0;

        if(userContext.designUpdateId === 'NONE') {

            scenarioCount = DesignComponentData.getChildComponentsOfType(
                featureAspect.designVersionId,
                ComponentType.SCENARIO,
                featureAspect.componentReferenceId
            ).length;

        } else {

            scenarioCount = DesignUpdateComponentData.getChildComponentsOfType(
                featureAspect.designUpdateId,
                ComponentType.SCENARIO,
                featureAspect.componentReferenceId
            ).length;

        }

        return(scenarioCount > 0);
    }
}

export const ClientTestIntegrationServices = new ClientTestIntegrationServicesClass();

