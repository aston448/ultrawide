// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections

// Ultrawide Services
import {ViewType, ViewMode, WorkPackageType, MessageType} from '../constants/constants.js';
import { Validation } from '../constants/validation_errors.js';
import { WorkPackageMessages } from '../constants/message_texts.js';

import WorkPackageValidationApi from '../apiValidation/apiWorkPackageValidation.js';
import ServerWorkPackageApi     from '../apiServer/apiWorkPackage.js';
import ClientContainerServices  from './apiClientContainerServices.js';
import ClientMashDataServices   from './apiClientMashData.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentView, changeApplicationMode, updateUserMessage} from '../redux/actions';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Work Package Services - supports client calls for Work Package related activities
//
// This class is the test entry point when not testing through the GUI.
// Most functions validate and return true / false according to business rules even if there is implicit validation in the GUI
// (E.g. buttons not being visible if action invalid)
//
// ---------------------------------------------------------------------------------------------------------------------


class ClientWorkPackageServices {

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // Manager adds a new Work Package to a Design Version or Design Update --------------------------------------------
    addNewWorkPackage(userRole, designVersionId, designUpdateId, workPackageType){

        // Client validation
        let result = WorkPackageValidationApi.validateAddWorkPackage(userRole, designVersionId, designUpdateId, workPackageType);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call - server actions
        ServerWorkPackageApi.addWorkPackage(userRole, designVersionId, designUpdateId, workPackageType, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: WorkPackageMessages.MSG_WORK_PACKAGE_ADDED
                }));
            }
        });

        // Indicate that business validation passed
        return true;
    };

    // Manager sets or updates Work Package name -----------------------------------------------------------------------
    updateWorkPackageName(userRole, workPackageId, newName){

        // Client validation
        let result = WorkPackageValidationApi.validateUpdateWorkPackageName(userRole, workPackageId, newName);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call - server actions
        ServerWorkPackageApi.updateWorkPackageName(userRole, workPackageId, newName, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: WorkPackageMessages.MSG_WORK_PACKAGE_NAME_UPDATED
                }));
            }
        });

        // Indicate that business validation passed
        return true;
    }

    // Manager chose to publish a WP to make it available in draft form ------------------------------------------------
    publishWorkPackage(userRole, userContext, workPackageToPublishId){

        // Client validation
        let result = WorkPackageValidationApi.validatePublishWorkPackage(userRole, workPackageToPublishId);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call - server actions
        ServerWorkPackageApi.publishWorkPackage(userRole, workPackageToPublishId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Ensure that the published WP is set in the current user context
                this.setWorkPackage(userContext, workPackageToPublishId);

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: WorkPackageMessages.MSG_WORK_PACKAGE_PUBLISHED
                }));
            }
        });

        // Indicate that business validation passed
        return true;
    };

    // Manager chose to delete a WP ------------------------------------------------------------------------------------
    removeWorkPackage(userRole, userContext, workPackageToDeleteId){

        // Client validation
        let result = WorkPackageValidationApi.validateRemoveWorkPackage(userRole, workPackageToDeleteId);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call - server actions
        ServerWorkPackageApi.removeWorkPackage(userRole, workPackageToDeleteId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Clear WP from user context
                const context = {
                    userId:                         userContext.userId,
                    designId:                       userContext.designId,
                    designVersionId:                userContext.designVersionId,
                    designUpdateId:                 userContext.designUpdateId,
                    workPackageId:                  'NONE',
                    designComponentId:              'NONE',
                    designComponentType:            'NONE',
                    featureReferenceId:             'NONE',
                    featureAspectReferenceId:       'NONE',
                    scenarioReferenceId:            'NONE',
                    scenarioStepId:                 'NONE',
                    featureFilesLocation:           userContext.featureFilesLocation,
                    acceptanceTestResultsLocation:  userContext.acceptanceTestResultsLocation,
                    integrationTestResultsLocation: userContext.integrationTestResultsLocation,
                    moduleTestResultsLocation:      userContext.moduleTestResultsLocation
                };

                store.dispatch(setCurrentUserItemContext(context, true));

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: WorkPackageMessages.MSG_WORK_PACKAGE_REMOVED
                }));
            }
        });

        // Indicate that business validation passed
        return true;
    };

    // LOCAL CLIENT ACTIONS ============================================================================================

    // Sets the currently selected work package as part of the global state
    setWorkPackage(userContext, newWorkPackageId){

        // Returns updated context so this can be passed on if needed

        if(newWorkPackageId != userContext.workPackageId) {

            const context = {
                userId:                         userContext.userId,
                designId:                       userContext.designId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                workPackageId:                  newWorkPackageId,
                designComponentId:              'NONE',
                designComponentType:            'NONE',
                featureReferenceId:             'NONE',
                featureAspectReferenceId:       'NONE',
                scenarioReferenceId:            'NONE',
                scenarioStepId:                 'NONE',
                featureFilesLocation:           userContext.featureFilesLocation,
                acceptanceTestResultsLocation:  userContext.acceptanceTestResultsLocation,
                integrationTestResultsLocation: userContext.integrationTestResultsLocation,
                moduleTestResultsLocation:      userContext.moduleTestResultsLocation
            };

            store.dispatch(setCurrentUserItemContext(context, true));

            return context;
        }

        // Not an error - just indicates no update needed
        return userContext;
    };

    // Manager chose to edit a Work Package ----------------------------------------------------------------------------
    editWorkPackage(userRole, userContext, workPackageToEditId, wpType){

        // Client validation
        let result = WorkPackageValidationApi.validateEditWorkPackage(userRole, workPackageToEditId);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Ensure that the current WP is the WP we chose to edit
        this.setWorkPackage(userContext, workPackageToEditId);

        // Edit mode
        store.dispatch(changeApplicationMode(ViewMode.MODE_EDIT));

        // Switch to appropriate WP edit view
        switch(wpType){
            case WorkPackageType.WP_BASE:
                store.dispatch(setCurrentView(ViewType.WORK_PACKAGE_BASE_EDIT));
                break;
            case WorkPackageType.WP_UPDATE:
                store.dispatch(setCurrentView(ViewType.WORK_PACKAGE_UPDATE_EDIT));
                break;
        }

        return true;

    };

    // User chose to view a Work Package -------------------------------------------------------------------------------
    viewWorkPackage(userRole, userContext, workPackageToViewId, wpType){

        // Client validation
        let result = WorkPackageValidationApi.validateViewWorkPackage(userRole, workPackageToEditId);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Ensure that the current update is the update we chose to view
        this.setWorkPackage(userContext, workPackageToViewId);

        // Switch to appropriate WP view
        switch(wpType){
            case WorkPackageType.WP_BASE:
                store.dispatch(setCurrentView(ViewType.WORK_PACKAGE_BASE_VIEW));
                break;
            case WorkPackageType.WP_UPDATE:
                store.dispatch(setCurrentView(ViewType.WORK_PACKAGE_UPDATE_VIEW));
                break;
        }

        return true;

    };

    // Developer chose to work on a work package
    developWorkPackage(userRole, userContext, viewOptions, wpToDevelopId){

        // Client validation
        let result = WorkPackageValidationApi.validateDevelopWorkPackage(userRole, wpToDevelopId);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Set the current context
        let updatedContext = this.setWorkPackage(userContext, wpToDevelopId);

        // Load dev data
        let loading = ClientContainerServices.getDevData();

        // Get the latest DEV data for the Mash
        ClientMashDataServices.createDevMashData(updatedContext);

        // Get the latest test results
        ClientMashDataServices.updateTestData(viewOptions, updatedContext);

        // Switch to Dev View
        if(userContext.designUpdateId === 'NONE') {
            store.dispatch(setCurrentView(ViewType.DEVELOP_BASE_WP));
        } else {
            store.dispatch(setCurrentView(ViewType.DEVELOP_UPDATE_WP));
        }
    }
}

export default new ClientWorkPackageServices();
