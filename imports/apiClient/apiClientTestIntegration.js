// == IMPORTS ==========================================================================================================

// Ultrawide Collections
import { UserWorkPackageMashData } from '../collections/dev/user_work_package_mash_data.js';

// Ultrawide Services
import { ViewType, MessageType, TestRunner, LogLevel } from '../constants/constants.js';
import { Validation } from '../constants/validation_errors.js';
import { TestIntegrationMessages } from '../constants/message_texts.js'

import { log } from '../common/utils.js';

import ServerTestIntegrationApi      from '../apiServer/apiTestIntegration.js';
import TestIntegrationValidationApi  from '../apiValidation/apiTestIntegrationValidation.js';
import ClientUserContextServices from '../apiClient/apiClientUserContext.js';
import ClientContainerServices from '../apiClient/apiClientContainerServices.js';

// REDUX services
import store from '../redux/store'
import {updateUserMessage, setMashDataStaleTo, updateTestDataFlag, setCurrentView, setTestSummaryDataLoadedTo, setTestDataStaleTo} from '../redux/actions'

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
    loadUserDevData(userContext, userRole, viewOptions, nextView, testDataFlag, testIntegrationDataContext){

        log((msg) => console.log(msg), LogLevel.DEBUG, "LOAD USER DEV DATA for Screen {}. Subscribed: {}  Mash Stale: {}, TestStale: {} SummaryLoaded: {} TestDataFlag {}",
            nextView,
            testIntegrationDataContext.testIntegrationDataLoaded,
            testIntegrationDataContext.mashDataStale,
            testIntegrationDataContext.testDataStale,
            testIntegrationDataContext.testSummaryDataLoaded,
            testDataFlag
        );

        log((msg) => console.log(msg), LogLevel.DEBUG, "LOAD USER DEV DATA.  View Options: Des Sum: {}  Dev Sum: {}  Upd Sum: {} Acc: {}  Int: {} Unit: {}",
            viewOptions.designTestSummaryVisible,
            viewOptions.devTestSummaryVisible,
            viewOptions.updateTestSummaryVisible,
            viewOptions.devAccTestsVisible,
            viewOptions.devIntTestsVisible,
            viewOptions.devUnitTestsVisible
        );

        // Check if data needs subscribing to
        if(!testIntegrationDataContext.testIntegrationDataLoaded){

            if(this.testDataWanted(nextView, viewOptions)) {

                store.dispatch(updateUserMessage({
                    messageType: MessageType.WARNING,
                    messageText: 'Loading test data...  Please wait...'
                }));

                // Load the data and then carry on...
                ClientContainerServices.getTestIntegrationData(userContext.userId, () => this.loadDataCallback(userContext, userRole, viewOptions, nextView, testDataFlag, testIntegrationDataContext));
            }
        } else (
            // Carry on to next step
            this.loadDataCallback(userContext, userRole, viewOptions, nextView, testDataFlag, testIntegrationDataContext)
        );

        // Go to next view.  This will happen before the data is loaded but looks better that way
        store.dispatch(setCurrentView(nextView));


        // Return default outcome for test purposes
        return {success: true, message: ''};
    }

    loadDataCallback(userContext, userRole, viewOptions, nextView, testDataFlag, testIntegrationDataContext){

        // Does test summary need an update?
        let updateTestSummary = false;


        if(!testIntegrationDataContext.testSummaryDataLoaded){

            switch(nextView){
                case ViewType.DESIGN_NEW_EDIT:
                case ViewType.DESIGN_PUBLISHED_VIEW:
                case ViewType.DESIGN_UPDATABLE_VIEW:
                    if(viewOptions.designTestSummaryVisible){
                        updateTestSummary = true;
                    }
                    break;
                case ViewType.DESIGN_UPDATE_VIEW:
                    if(viewOptions.updateTestSummaryVisible){
                        updateTestSummary = true;
                    }
                    break;
                case ViewType.DEVELOP_BASE_WP:
                case ViewType.DEVELOP_UPDATE_WP:
                    if(viewOptions.devTestSummaryVisible){
                        updateTestSummary = true;
                    }
                    break;
            }
        }

        // Do test results need updating?
        let updateTestResults = false;

        if(testIntegrationDataContext.testDataStale){

            if(this.testDataWanted(nextView, viewOptions)) {

                updateTestResults = true;
            }
        }

        // Does mash need recalculation?  Only if we are in a Developer screen and mash data showing
        if(nextView === ViewType.DEVELOP_BASE_WP || nextView === ViewType.DEVELOP_UPDATE_WP) {

            if (testIntegrationDataContext.mashDataStale) {

                if(viewOptions.devUnitTestsVisible || viewOptions.devIntTestsVisible || viewOptions.devAccTestsVisible) {

                    testDataFlag = this.updateMashData(userContext, userRole, viewOptions, testDataFlag, updateTestResults, updateTestSummary);
                }
            }
        } else {

            // Just update the test results and summary as required
            if(updateTestResults){

                this.updateTestResults(userContext, viewOptions, testDataFlag, updateTestSummary);
            }

        }

        // Return default outcome for test purposes
        return {success: true, message: ''};

    }

    // Update the test summary data - when user opens the Test Summary -------------------------------------------------
    updateTestSummaryData(view, userContext, userRole, viewOptions, testDataFlag, testIntegrationDataContext){

        // Check if data needs subscribing to
        if(!testIntegrationDataContext.testIntegrationDataLoaded){

            // Load first and then continue
            ClientContainerServices.getTestIntegrationData(userContext.userId, () => this.updateTestSummaryCallback(view, userContext, userRole, viewOptions, testDataFlag, testIntegrationDataContext));
        } else {

            // Just continue
            this.updateTestSummaryCallback(view, userContext, viewOptions, testDataFlag);
        }

        // Return default outcome for test purposes
        return {success: true, message: ''};
    };

    updateTestSummaryCallback(view, userContext, viewOptions, testDataFlag){

        let summaryUpdated = false;

        // Get test results if no other views open to have got them already
        if(!(view === ViewType.DEVELOP_BASE_WP || view === ViewType.DEVELOP_UPDATE_WP)){
            // The test summary is the only test window so do update the results
            this.updateTestResults(userContext, viewOptions, testDataFlag, true);
            summaryUpdated = true;
        } else {
            // Otherwise check to see if other test windows already open in Dev WP
            if(this.testViewsOpen(viewOptions) === 0){
                this.updateTestResults(userContext, viewOptions, testDataFlag, true);
                summaryUpdated = true;
            }
        }

        // Update the summary if we did not do so after loading results
        if(!summaryUpdated) {
            this.updateTestSummary(userContext, testDataFlag);
        }

        // Return default outcome for test purposes
        return {success: true, message: ''};
    }

    // Update the WP test details - when user opens a Test View --------------------------------------------------------
    updateWorkPackageTestData(userContext, userRole, viewOptions, testDataFlag, testIntegrationDataContext){

        log((msg) => console.log(msg), LogLevel.TRACE, "UPDATE WP TEST DATA. Subscribed: {}  Mash Stale: {}, TestStale: {} SummaryLoaded: {}",
            testIntegrationDataContext.testIntegrationDataLoaded,
            testIntegrationDataContext.mashDataStale,
            testIntegrationDataContext.testDataStale,
            testIntegrationDataContext.testSummaryDataLoaded
        );

        // Check if data needs subscribing to
        if(!testIntegrationDataContext.testIntegrationDataLoaded){

            // Load data and then continue
            ClientContainerServices.getTestIntegrationData(userContext.userId, () => this.updateWorkPackageCallback(userContext, userRole, viewOptions, testDataFlag, testIntegrationDataContext));
        } else {

            // Continue
            this.updateWorkPackageCallback(userContext, userRole, viewOptions, testDataFlag, testIntegrationDataContext)
        }

        // Return default outcome for test purposes
        return {success: true, message: ''};
    };

    updateWorkPackageCallback(userContext, userRole, viewOptions, testDataFlag, testIntegrationDataContext){

        const firstTestView = (this.testViewsOpen(viewOptions) === 1);

        // Update the test data if this is the first window open or it is stale
        const updateTestResults = (firstTestView || testIntegrationDataContext.testDataStale);

        // Update the mash data if this is the first window open or it is stale
        if(firstTestView || testIntegrationDataContext.mashDataStale){

            this.updateMashData(userContext, userRole, viewOptions, testDataFlag, updateTestResults, false)
        }

        // Return default outcome for test purposes
        return {success: true, message: ''};
    }

    // User has requested a complete refresh of test data --------------------------------------------------------------
    refreshTestData(view, userContext, userRole, viewOptions, testDataFlag, testIntegrationDataContext){

        // This action invalidates the test results - user is saying there is new test data to gather
        // But it does not invalidate the design mash per se...

        store.dispatch(setTestDataStaleTo(true));
        testIntegrationDataContext.testDataStale = true;

        // This also means that test summary data needs reloading
        store.dispatch(setTestSummaryDataLoadedTo(false));
        testIntegrationDataContext.testSummaryDataLoaded = false;

        this.updateTestData(view, userContext, userRole, viewOptions, testDataFlag, testIntegrationDataContext);

        // Return default outcome for test purposes
        return {success: true, message: ''};

    };

    // User has requested a refresh of everything because another user might have changed stuff ------------------------
    refreshDesignMashData(view, userContext, userRole, viewOptions, testDataFlag, testIntegrationDataContext){

        // This action invalidates the test results - user is saying there is new test data to gather
        // It also invalidates the test mash - user is saying the Design has changed as well

        store.dispatch(setMashDataStaleTo(true));
        testIntegrationDataContext.mashDataStale = true;
        store.dispatch(setTestDataStaleTo(true));
        testIntegrationDataContext.testDataStale = true;

        // This also means that test summary data needs reloading
        store.dispatch(setTestSummaryDataLoadedTo(false));
        testIntegrationDataContext.testSummaryDataLoaded = false;

        this.updateTestData(view, userContext, userRole, viewOptions, testDataFlag, testIntegrationDataContext);

        // Return default outcome for test purposes
        return {success: true, message: ''};

    };


    // Helper Methods ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // Returns true if any test data wanted for the current view and view options
    testDataWanted(view, viewOptions){

        let testDataWanted = false;

        switch(view){
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:
                if(viewOptions.designTestSummaryVisible){
                    testDataWanted = true;
                }
                break;
            case ViewType.DESIGN_UPDATE_VIEW:
                if(viewOptions.updateTestSummaryVisible){
                    testDataWanted = true;
                }
                break;
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:
                if(
                    viewOptions.devUnitTestsVisible ||
                    viewOptions.devIntTestsVisible ||
                    viewOptions.devAccTestsVisible ||
                    viewOptions.devTestSummaryVisible
                ){
                    testDataWanted = true;
                }
                break;
        }

        return testDataWanted;
    }

    testViewsOpen(viewOptions){

        let testViewsCount = 0;

        if(viewOptions.devUnitTestsVisible){
            testViewsCount++;
        }

        if(viewOptions.devIntTestsVisible){
            testViewsCount++;
        }

        if(viewOptions.devAccTestsVisible){
            testViewsCount++
        }

        return testViewsCount;
    }

    // Update test data when user requests it
    updateTestData(view, userContext, userRole, viewOptions, testDataFlag, testIntegrationDataContext){

        let updateSummary = false;

        // Is this a Work Package view?
        if(view === ViewType.DEVELOP_UPDATE_WP || view === ViewType.DEVELOP_BASE_WP) {

            // If a test summary is showing, update that data too
            if(viewOptions.devTestSummaryVisible){
                updateSummary = true;
            }

            // Are we wanting to see detailed test results?
            if(viewOptions.devUnitTestsVisible || viewOptions.devIntTestsVisible || viewOptions.devAccTestsVisible) {

                // Load the WP Design Data if it needs it.  Then always update results an optionally the summary
                if (testIntegrationDataContext.mashDataStale) {

                    this.updateMashData(userContext, userRole, viewOptions, testDataFlag, true, updateSummary);

                } else {

                    // Have to update the test data anyway as user has requested it
                    this.updateTestResults(userContext, viewOptions, testDataFlag, updateSummary);
                }
            }

        } else {

            // Update the test summary if it is showing
            switch(view){
                case ViewType.DESIGN_NEW_EDIT:
                case ViewType.DESIGN_PUBLISHED_VIEW:
                case ViewType.DESIGN_UPDATABLE_VIEW:
                    if(viewOptions.designTestSummaryVisible){
                        updateSummary = true;
                    }
                    break;
                case ViewType.DESIGN_UPDATE_VIEW:
                    if(viewOptions.updateTestSummaryVisible){
                        updateSummary = true;
                    }
                    break;
            }

            // Have to update the test data as user has requested it - and update the summary afterwards if required
            this.updateTestResults(userContext, viewOptions, testDataFlag, updateSummary);
        }
    }

    // Update the design-test mash data to which test results are applied - and then apply the test results if required
    updateMashData(userContext, userRole, viewOptions, testDataFlag, updateTestResults, updateTestSummary){

        store.dispatch(updateUserMessage({
            messageType: MessageType.WARNING,
            messageText: 'Synchronising server test design data...'
        }));

        ServerTestIntegrationApi.populateWorkPackageMashData(userContext, (err, result) => {

            if(err){

                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                // Mash is populated to carry on with test data if needed

                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: 'Test mash loaded'
                }));

                if(updateTestResults){
                    // Carry on with results update
                    this.updateTestResults(userContext, viewOptions, testDataFlag, updateTestSummary)
                } else {
                    // Ensure data refreshes
                    store.dispatch(updateTestDataFlag(!testDataFlag));
                    testDataFlag = !testDataFlag;
                }

                // Mash data is now up to date
                store.dispatch(setMashDataStaleTo(false));

            }

        });

        return testDataFlag;

    };

    // Get latest test results required for current view options
    updateTestResults(userContext, viewOptions, testDataFlag, updateSummary){

        store.dispatch(updateUserMessage({
            messageType: MessageType.WARNING,
            messageText: 'Synchronising server test results data...'
        }));

        ServerTestIntegrationApi.updateTestData(userContext, viewOptions, (err, result) => {

            if(err){

                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: 'Test results loaded'
                }));

                // Test Data is no longer stale
                store.dispatch(setTestDataStaleTo(false));

                // If Test summary needs an update do that now we have updated the results
                if(updateSummary){
                    this.updateTestSummary(userContext, testDataFlag)
                } else {
                    // Ensure data refreshes
                    store.dispatch(updateTestDataFlag(!testDataFlag));
                }
            }
        });

    };

    // Update the test summary data
    updateTestSummary(userContext, testDataFlag){

        store.dispatch(updateUserMessage({
            messageType: MessageType.WARNING,
            messageText: 'Synchronising server test summary data...'
        }));

        ServerTestIntegrationApi.updateTestSummaryData(userContext, (err, result) => {

            if (err) {

                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {

                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: 'Test summary data loaded'
                }));

                // Ensure data refreshes
                console.log("Updating test data flag with current value " + testDataFlag);
                store.dispatch(updateTestDataFlag(!testDataFlag));

                // Mark data as loaded
                store.dispatch(setTestSummaryDataLoadedTo(true));
            }
        });

        // Have a go at an early update in case data is there on client
        store.dispatch(updateTestDataFlag(!testDataFlag));
        testDataFlag = !testDataFlag;

    };


    // LOCAL CLIENT ACTIONS ============================================================================================


}

export default new ClientTestIntegrationServices();

