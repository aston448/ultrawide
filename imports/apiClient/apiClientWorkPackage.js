// == IMPORTS ==========================================================================================================

// Ultrawide Collections
import { WorkPackages } from '../collections/work/work_packages.js';
import { WorkPackageComponents } from '../collections/work/work_package_components.js';

// Ultrawide Services
import { RoleType, ViewType, ViewMode, ComponentType, WorkPackageType, WorkPackageStatus, MessageType} from '../constants/constants.js';
import { Validation } from '../constants/validation_errors.js';
import { WorkPackageMessages } from '../constants/message_texts.js';

import WorkPackageValidationApi from '../apiValidation/apiWorkPackageValidation.js';
import ServerWorkPackageApi     from '../apiServer/apiWorkPackage.js';
import ClientContainerServices  from './apiClientContainerServices.js';
import ClientTestIntegrationServices   from './apiClientTestIntegration';

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentView, changeApplicationMode, updateUserMessage, setCurrentUserOpenWorkPackageItems} from '../redux/actions';

// =====================================================================================================================
// Client API for Work Package Items
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================

class ClientWorkPackageServices {

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // Manager adds a new Work Package to a Design Version or Design Update --------------------------------------------
    addNewWorkPackage(userRole, userContext, workPackageType, openWpItems){

        // Client validation
        let result = WorkPackageValidationApi.validateAddWorkPackage(userRole, userContext.designVersionId, userContext.designUpdateId, workPackageType);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerWorkPackageApi.addWorkPackage(userRole, userContext.designVersionId, userContext.designUpdateId, workPackageType, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Set Applications in the WP as Open - actually setting all New WP App Components to open - but they should be
                let wps = WorkPackages.find({workPackageStatus: WorkPackageStatus.WP_NEW}).fetch();

                wps.forEach((wp) => {
                    let wpApps = WorkPackageComponents.find({workPackageId: wp._id, componentType: ComponentType.APPLICATION}).fetch();

                    wpApps.forEach((wpApp) => {
                        if(!openWpItems.includes(wpApp._id)){
                            openWpItems.push(wpApp._id);
                        }
                    });
                });

                store.dispatch(setCurrentUserOpenWorkPackageItems(
                    userContext.userId,
                    openWpItems,
                    null,
                    true
                ));

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: WorkPackageMessages.MSG_WORK_PACKAGE_ADDED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // Manager sets or updates Work Package name -----------------------------------------------------------------------
    updateWorkPackageName(userRole, workPackageId, newName){

        // Client validation
        let result = WorkPackageValidationApi.validateUpdateWorkPackageName(userRole, workPackageId, newName);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
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
        return {success: true, message: ''};
    }

    // Manager chose to publish a WP to make it available in draft form ------------------------------------------------
    publishWorkPackage(userRole, userContext, workPackageToPublishId){

        // Client validation
        let result = WorkPackageValidationApi.validatePublishWorkPackage(userRole, workPackageToPublishId);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
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
        return {success: true, message: ''};
    };

    // Manager chose to unpublish a WP to withdraw it ------------------------------------------------------------------
    withdrawWorkPackage(userRole, userContext, workPackageToWithdrawId){

        // Client validation
        let result = WorkPackageValidationApi.validateWithdrawWorkPackage(userRole, workPackageToWithdrawId);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerWorkPackageApi.withdrawWorkPackage(userRole, workPackageToWithdrawId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Ensure that the published WP is set in the current user context
                this.setWorkPackage(userContext, workPackageToWithdrawId);

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: WorkPackageMessages.MSG_WORK_PACKAGE_WITHDRAWN
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // Manager chose to delete a WP ------------------------------------------------------------------------------------
    removeWorkPackage(userRole, userContext, workPackageToDeleteId){

        // Client validation
        let result = WorkPackageValidationApi.validateRemoveWorkPackage(userRole, workPackageToDeleteId);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
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
                    unitTestResultsLocation:      userContext.unitTestResultsLocation
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
        return {success: true, message: ''};
    };

    // LOCAL CLIENT ACTIONS ============================================================================================

    // User clicks on a WP to select it
    selectWorkPackage(userRole, userContext, workPackage){

        let newContext = userContext;

        if((workPackage.workPackageStatus === WorkPackageStatus.WP_NEW) && (userRole != RoleType.MANAGER)){
            // Not selectable
        } else {
            newContext = this.setWorkPackage(userContext, workPackage._id);
        }

        return newContext;
    }

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
                unitTestResultsLocation:      userContext.unitTestResultsLocation
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
            return {success: false, message: result};
        }

        // Ensure that the current WP is the WP we chose to edit
        this.setWorkPackage(userContext, workPackageToEditId);

        // Actually in View mode as you can't change the Design
        store.dispatch(changeApplicationMode(ViewMode.MODE_VIEW));

        // Switch to appropriate WP edit view
        switch(wpType){
            case WorkPackageType.WP_BASE:
                store.dispatch(setCurrentView(ViewType.WORK_PACKAGE_BASE_EDIT));
                break;
            case WorkPackageType.WP_UPDATE:
                store.dispatch(setCurrentView(ViewType.WORK_PACKAGE_UPDATE_EDIT));
                break;
        }

        return {success: true, message: ''};

    };

    // User chose to view a Work Package -------------------------------------------------------------------------------
    viewWorkPackage(userRole, userContext, workPackageToViewId, wpType){

        // Client validation
        let result = WorkPackageValidationApi.validateViewWorkPackage(userRole, workPackageToViewId);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Ensure that the current update is the update we chose to view
        this.setWorkPackage(userContext, workPackageToViewId);

        // Make sure in View only mode so no Design Editing
        store.dispatch(changeApplicationMode(ViewMode.MODE_VIEW));

        // Switch to appropriate WP view
        switch(wpType){
            case WorkPackageType.WP_BASE:
                store.dispatch(setCurrentView(ViewType.WORK_PACKAGE_BASE_VIEW));
                break;
            case WorkPackageType.WP_UPDATE:
                store.dispatch(setCurrentView(ViewType.WORK_PACKAGE_UPDATE_VIEW));
                break;
        }

        return {success: true, message: ''};

    };

    // Developer chose to work on a work package
    developWorkPackage(userRole, userContext, viewOptions, wpToDevelopId, progressData){

        // Client validation
        let result = WorkPackageValidationApi.validateDevelopWorkPackage(userRole, wpToDevelopId);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Set the current context
        let updatedContext = this.setWorkPackage(userContext, wpToDevelopId);

        // Get new View...
        let view = ViewType.SELECT;
        if(userContext.designUpdateId === 'NONE') {
            view = ViewType.DEVELOP_BASE_WP;
        } else {
            view = ViewType.DEVELOP_UPDATE_WP;
        }

        // Load dev data - will update test data once loaded and switch the view
        ClientTestIntegrationServices.loadUserDevData(updatedContext, userRole, viewOptions, view, progressData);

        return {success: true, message: ''};

    }
}

export default new ClientWorkPackageServices();
