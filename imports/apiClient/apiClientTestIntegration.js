// == IMPORTS ==========================================================================================================

// Ultrawide Collections
import { UserWorkPackageMashData } from '../collections/dev/user_work_package_mash_data.js';
// Ultrawide Services
import { ViewType, MessageType, TestRunner } from '../constants/constants.js';
import { Validation } from '../constants/validation_errors.js';
import { TestIntegrationMessages } from '../constants/message_texts.js'

import ServerTestIntegrationApi      from '../apiServer/apiTestIntegration.js';
import TestIntegrationValidationApi  from '../apiValidation/apiTestIntegrationValidation.js';
import ClientUserContextServices from '../apiClient/apiClientUserContext.js';
import ClientContainerServices from '../apiClient/apiClientContainerServices.js';

// REDUX services
import store from '../redux/store'
import {updateUserMessage, setMashDataStaleTo, updateTestDataFlag, setCurrentView} from '../redux/actions'

// =====================================================================================================================
// Client API for Design Items
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================
class ClientTestIntegrationServices {


    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // Developer chooses to export an integration test file from a WP Feature
    exportIntegrationTestFile(userContext, userRole){

        // Client validation
        let result = TestIntegrationValidationApi.validateExportIntegrationTests(userRole, userContext);

        if(result != Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // TODO - Get Test Runner from user settings
        // Real action call - server actions
        ServerTestIntegrationApi.exportIntegrationTests(userContext, userRole, TestRunner.CHIMP_MOCHA, (err, result) => {

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


    // NON-VALIDATED METHODS THAT CALL SERVER API ======================================================================

    // API Methods +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // Set the design-test mash data as stale because the design has been altered --------------------------------------
    invalidateMashData(){

        store.dispatch(setMashDataStaleTo(true));
    };

    // User is entering a screen where dev data is needed --------------------------------------------------------------
    loadUserDevData(userContext, userRole, viewOptions, nextView, testDataFlag, mashDataStale){

        // Check if data needs loading
        ///const mashDataCount = UserWorkPackageMashData.find({userId: userContext.userId}).count();

        if(mashDataStale) {

            store.dispatch(updateUserMessage({messageType: MessageType.WARNING, messageText: 'Loading test data...  Please wait...'}));

            // Load user dev data (if needed) and when done update the design mash and switch view if wanted
            ClientContainerServices.getDevData(userContext.userId, this.refreshTestData, userContext, userRole, viewOptions, true, testDataFlag, nextView);
        } else {

            // Not loading data but we may want to change view
            if(nextView){
                store.dispatch(setCurrentView(nextView));
            }
        }

        // Return default outcome for test purposes
        return {success: true, message: ''};

    }

    // Update the test summary data - when user opens the Test Summary -------------------------------------------------
    updateTestSummaryData(userContext, userRole, viewOptions, testDataFlag){

        // It is possible that dev data has not yet been loaded yet
        const mashDataCount = UserWorkPackageMashData.find({userId: userContext.userId}).count();

        if(mashDataCount === 0) {

            store.dispatch(updateUserMessage({messageType: MessageType.WARNING, messageText: 'Loading test data...  Please wait...'}));

            // Load user dev data and when done update the design mash and switch view if wanted
            ClientContainerServices.getDevData(userContext.userId, this.refreshTestData, userContext, userRole, viewOptions, true, testDataFlag);

        } else {

            this.updateTestSummary(userContext, testDataFlag)
        }

        // Return default outcome for test purposes
        return {success: true, message: ''};

    };

    // Update the WP test details - when user opens a Test View --------------------------------------------------------
    updateWorkPackageTestData(userContext, userRole, viewOptions, mashDataStale, testDataFlag){

        // Load the WP Design Data if it needs it
        if (mashDataStale) {

            this.updateMashData(userContext, userRole, viewOptions, testDataFlag);

        } else {

            // Just load the test results
            this.updateTestResults(userContext, viewOptions, testDataFlag);
        }

        // Return default outcome for test purposes
        return {success: true, message: ''};
    };

    // User has requested a complete refresh of test data --------------------------------------------------------------
    refreshTestData(userContext, userRole, viewOptions, mashDataStale, testDataFlag, nextView){

        console.log("In refresh test data with WP " + userContext.workPackageId);

        // Is this a Work Package view?
        if(userContext.workPackageId != 'NONE') {

            // Are we wanting to see detailed test results?
            if(viewOptions.devUnitTestsVisible || viewOptions.devIntTestsVisible || viewOptions.devAccTestsVisible) {

                // Load the WP Design Data if it needs it
                if (mashDataStale) {

                    console.log("Updating mash data... ");
                    this.updateMashData(userContext, userRole, viewOptions, testDataFlag, nextView);

                } else {

                    console.log("Refreshing test data... ");
                    // Just load the test results
                    store.dispatch(updateUserMessage({messageType: MessageType.WARNING, messageText: 'Refreshing test data...  Please wait...'}));

                    // If developer also has test summary open load that too but don't trigger next view yet
                    if(viewOptions.devTestSummaryVisible){

                        this.updateTestSummary(userContext, testDataFlag);
                    }

                    this.updateTestResults(userContext, viewOptions, testDataFlag, nextView)
                }
            } else {

                // Are we wanting to see just the Test Summary
                if(viewOptions.devTestSummaryVisible){
                    console.log("Updating test summary... ");
                    this.updateTestSummary(userContext, testDataFlag, nextView);
                } else {
                    // Otherwise just update the view
                    if(nextView){
                        store.dispatch(setCurrentView(nextView));
                    }
                }
            }
        } else {

            // Must be a view where there only is a test summary
            if(viewOptions.designTestSummaryVisible || viewOptions.updateTestSummaryVisible || viewOptions.devTestSummaryVisible){

                this.updateTestSummary(userContext, testDataFlag, nextView);
            } else {
                // Otherwise just update the view
                if(nextView){
                    store.dispatch(setCurrentView(nextView));
                }
            }
        }

        // Return default outcome for test purposes
        return {success: true, message: ''};

    };

    // User has requested a refresh of everything because another user might have changed stuff ------------------------
    refreshDesignMashData(userContext, userRole, viewOptions, testDataFlag){

        this.refreshTestData(userContext, userRole, viewOptions, true, testDataFlag);

        // Return default outcome for test purposes
        return {success: true, message: ''};

    };


    // Helper Methods ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // Update the design-test mash data to which test results are applied - and then apply the test results
    updateMashData(userContext, userRole, viewOptions, testDataFlag, nextView){

        store.dispatch(updateUserMessage({messageType: MessageType.WARNING, messageText: 'Loading test data...  Please wait...'}));

        ServerTestIntegrationApi.populateWorkPackageMashData(userContext, (err, result) => {

            if(err){

                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Mash data is now up to date
                store.dispatch(setMashDataStaleTo(false));

                // And on success of that update the test data
                ServerTestIntegrationApi.updateTestData(userContext, viewOptions, (err, result) => {

                    if(err){

                        alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
                    } else {

                        store.dispatch(updateUserMessage({messageType: MessageType.INFO, messageText: 'Test data loaded'}));

                        // Ensure data refreshes
                        store.dispatch(updateTestDataFlag(!testDataFlag));

                        // If we have passed in a view to go to after loading the data...
                        if(nextView){
                            store.dispatch(setCurrentView(nextView));
                        }
                    }
                });
            }

        });


    };

    // Get latest test results required for current view options
    updateTestResults(userContext, viewOptions, testDataFlag, nextView){

        store.dispatch(updateUserMessage({messageType: MessageType.INFO, messageText: 'Loading test data...'}));

        ServerTestIntegrationApi.updateTestData(userContext, viewOptions, (err, result) => {

            if(err){

                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                store.dispatch(updateUserMessage({messageType: MessageType.INFO, messageText: 'Test data loaded'}));

                // Ensure data refreshes
                store.dispatch(updateTestDataFlag(!testDataFlag));

                // If we have passed in a view to go to after loading the data...
                if(nextView){
                    store.dispatch(setCurrentView(nextView));
                }
            }
        });
    };

    // Update the test summary data
    updateTestSummary(userContext, testDataFlag, nextView){

        store.dispatch(updateUserMessage({messageType: MessageType.INFO, messageText: 'Loading test summary data...'}));

        ServerTestIntegrationApi.updateTestSummaryData(userContext, (err, result) => {

            if(err){

                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                store.dispatch(updateUserMessage({messageType: MessageType.INFO, messageText: 'Test summary data loaded'}));

                // Ensure data refreshes
                store.dispatch(updateTestDataFlag(!testDataFlag));

                // If we have passed in a view to go to after loading the data...
                if(nextView){
                    store.dispatch(setCurrentView(nextView));
                }
            }
        });
    };


    // LOCAL CLIENT ACTIONS ============================================================================================


}

export default new ClientTestIntegrationServices();

