// == IMPORTS ==========================================================================================================

// Ultrawide Services
import { RoleType, ViewType, ViewMode, ComponentType, WorkPackageType, WorkPackageStatus, MessageType} from '../constants/constants.js';
import { Validation } from '../constants/validation_errors.js';
import { WorkPackageMessages } from '../constants/message_texts.js';

import { WorkPackageValidationApi }         from '../apiValidation/apiWorkPackageValidation.js';
import { ServerWorkPackageApi }             from '../apiServer/apiWorkPackage.js';
import { ClientTestIntegrationServices }    from './apiClientTestIntegration';
import { ClientUserContextServices }        from '../apiClient/apiClientUserContext.js';
import { ClientDesignVersionServices }      from '../apiClient/apiClientDesignVersion.js';
import { ClientDesignUpdateSummary }        from '../apiClient/apiClientDesignUpdateSummary.js';

// Data Access
import { UserRoleData }                     from '../data/users/user_role_db.js';
import { WorkPackageData }                  from '../data/work/work_package_db.js';
import { DesignComponentData }              from '../data/design/design_component_db.js';
import { DesignUpdateComponentData }        from '../data/design_update/design_update_component_db.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentView, setCurrentViewMode, updateUserMessage, setCurrentUserOpenWorkPackageItems, setWorkPackageScopeItems } from '../redux/actions';

// =====================================================================================================================
// Client API for Work Package Items
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================

class ClientWorkPackageServicesClass {

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // Manager adds a new Work Package to a Design Version or Design Update --------------------------------------------
    addNewWorkPackage(userRole, userContext, workPackageType, openWpItems){

        // Client validation
        let result = WorkPackageValidationApi.validateAddWorkPackage(userRole, userContext.designVersionId, userContext.designUpdateId, workPackageType);

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerWorkPackageApi.addWorkPackage(userRole, userContext.designVersionId, userContext.designUpdateId, workPackageType, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 1: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Set Applications in the WP as Open - actually setting all New WP App Components to open - but they should be
                let wps = WorkPackageData.getAllNewWorkPackagesForContext(userContext);

                wps.forEach((wp) => {
                    let wpApps = WorkPackageData.getWorkPackageComponentsOfType(wp._id, ComponentType.APPLICATION);

                    wpApps.forEach((wpApp) => {
                        if(!openWpItems.includes(wpApp._id)){
                            openWpItems.push(wpApp._id);
                        }
                    });
                });

                store.dispatch(setCurrentUserOpenWorkPackageItems(
                    openWpItems,
                    null,
                    null
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

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerWorkPackageApi.updateWorkPackageName(userRole, workPackageId, newName, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 2: ' + err.reason + '.  Contact support if persists!');
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

    updateWorkPackageLink(workPackageId, newLink){

        // Give user a way to clear the link
        if (newLink === ''){
            newLink = 'NONE';
        }

        // Client validation
        let result = WorkPackageValidationApi.validateUpdateWorkPackageLink(workPackageId, newLink);

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerWorkPackageApi.updateWorkPackageLink(workPackageId, newLink, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 2: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: WorkPackageMessages.MSG_WORK_PACKAGE_LINK_UPDATED
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

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerWorkPackageApi.publishWorkPackage(userRole, workPackageToPublishId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 3: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Ensure that the published WP is set in the current user context
                this.setWorkPackage(userContext, workPackageToPublishId);

                // Should now appear in Work Progress
                ClientDesignVersionServices.updateWorkProgress(userContext);

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

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerWorkPackageApi.withdrawWorkPackage(userRole, workPackageToWithdrawId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 4: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Ensure that the published WP is set in the current user context
                this.setWorkPackage(userContext, workPackageToWithdrawId);

                // Should now not appear in Work Progress
                ClientDesignVersionServices.updateWorkProgress(userContext);

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

    // Developer adopts an available WP --------------------------------------------------------------------------------
    adoptWorkPackage(userRole, userContext, workPackageId){

        // Client validation
        let result = WorkPackageValidationApi.validateAdoptWorkPackage(userRole, workPackageId);

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerWorkPackageApi.adoptWorkPackage(userRole, workPackageId, userContext.userId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 5: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Ensure that the adopted WP is set in the current user context
                this.setWorkPackage(userContext, workPackageId);

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: WorkPackageMessages.MSG_WORK_PACKAGE_ADOPTED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // Developer or Manager releases an adopted WP ---------------------------------------------------------------------
    releaseWorkPackage(userRole, userContext, workPackageId){

        // Client validation
        let result = WorkPackageValidationApi.validateReleaseWorkPackage(userRole, userContext.userId, workPackageId);

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerWorkPackageApi.releaseWorkPackage(userRole, workPackageId, userContext.userId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 6: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: WorkPackageMessages.MSG_WORK_PACKAGE_RELEASED
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

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerWorkPackageApi.removeWorkPackage(userRole, workPackageToDeleteId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 7: ' + err.reason + '.  Contact support if persists!');
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
                    scenarioStepId:                 'NONE'
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

        if((workPackage.workPackageStatus === WorkPackageStatus.WP_NEW) && (userRole !== RoleType.MANAGER)){
            // Not selectable
        } else {
            newContext = this.setWorkPackage(userContext, workPackage._id);
        }

        return newContext;
    }

    // Sets the currently selected work package as part of the global state
    setWorkPackage(userContext, newWorkPackageId){

        // Returns updated context so this can be passed on if needed

        // Set the DU in context if it is not currently set.  This ensures that
        // if an update DU is selected, the user context is always correct.

        const wp = WorkPackageData.getWorkPackageById(newWorkPackageId);

        let newDu = userContext.designUpdateId;
        let updateDu = false;

        if((userContext.designUpdateId !== wp.designUpdateId) && (wp.designUpdateId !== 'NONE')){
            newDu = wp.designUpdateId;
            updateDu = true;
        }

        if(newWorkPackageId !== userContext.workPackageId || updateDu) {


            const newContext = {
                userId:                         userContext.userId,
                designId:                       userContext.designId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 newDu,
                workPackageId:                  newWorkPackageId,
                designComponentId:              'NONE',
                designComponentType:            'NONE',
                featureReferenceId:             'NONE',
                featureAspectReferenceId:       'NONE',
                scenarioReferenceId:            'NONE',
                scenarioStepId:                 'NONE'
            };

            // Subscribe to the appropriate data for the new WP if WP changing
            //store.dispatch(setWorkPackageDataLoadedTo(false));
            //ClientDataServices.getWorkPackageData(newContext);

            store.dispatch(setCurrentUserItemContext(newContext, true));

            ClientUserContextServices.setOpenWorkPackageItems(newContext);

            // Load or refresh DU Summary data - if necessary because selecting WP has changed DU
            ClientDesignUpdateSummary.getDesignUpdateSummary(false);

            // Update the test summary data to reflect the WP.  No need to recalc data
            //ClientTestIntegrationServices.updateTestSummaryData(newContext);

            return newContext;
        }

        // Not an error - just indicates no update needed
        return userContext;
    };



    afterWpDataLoaded(newContext){

    }
    // Manager chose to edit a Work Package ----------------------------------------------------------------------------
    editWorkPackage(userRole, userContext, workPackageToEditId, wpType){

        // Client validation
        let result = WorkPackageValidationApi.validateEditWorkPackage(userRole, workPackageToEditId);

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Ensure that the current WP is the WP we chose to edit
        this.setWorkPackage(userContext, workPackageToEditId);

        // Actually in View mode as you can't change the Design
        store.dispatch(setCurrentViewMode(ViewMode.MODE_VIEW));

        // Switch to appropriate WP edit view
        switch(wpType){
            case WorkPackageType.WP_BASE:
                store.dispatch(setCurrentView(ViewType.WORK_PACKAGE_BASE_EDIT));
                break;
            case WorkPackageType.WP_UPDATE:
                store.dispatch(setCurrentView(ViewType.WORK_PACKAGE_UPDATE_EDIT));
                break;
        }

        // // Set up the scope items as the current in scope items
        // const workPackage = WorkPackageData.getWorkPackageById(workPackageToEditId);
        // const wpItems = WorkPackageData.getAllWorkPackageComponents(workPackageToEditId);
        //
        // let wpItemsArr = [];
        // let designItem = null;
        //
        // wpItems.forEach((item) => {
        //     if(wpType === WorkPackageType.WP_BASE) {
        //
        //         designItem = DesignComponentData.getDesignComponentByRef(workPackage.designVersionId, item.componentReferenceId);
        //
        //     } else {
        //
        //         designItem = DesignUpdateComponentData.getUpdateComponentByRef(workPackage.designVersionId, workPackage.designUpdateId, item.componentReferenceId);
        //
        //     }
        //     if(designItem) {
        //
        //         const currentItem = {
        //             ref: designItem.componentReferenceId,
        //             scopeType: designItem.scopeType
        //         };
        //
        //         wpItemsArr.push(currentItem);
        //     }
        // });
        //
        // store.dispatch(setWorkPackageScopeItems(
        //     {
        //         flag:               1,
        //         currentParents:     [],
        //         currentChildren:    [],
        //         changingItemId:     'NONE',
        //         current:            []
        //     }
        // ));

        return {success: true, message: ''};

    };

    // User chose to view a Work Package -------------------------------------------------------------------------------
    viewWorkPackage(userRole, userContext, workPackageToViewId, wpType){

        // Client validation
        let result = WorkPackageValidationApi.validateViewWorkPackage(userRole, workPackageToViewId);

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Ensure that the current update is the update we chose to view
        this.setWorkPackage(userContext, workPackageToViewId);

        // Make sure in View only mode so no Design Editing
        store.dispatch(setCurrentViewMode(ViewMode.MODE_VIEW));

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

    // Developer chose to work on a work package -----------------------------------------------------------------------
    developWorkPackage(userRole, userContext, wpToDevelopId){

        // Client validation
        let result = WorkPackageValidationApi.validateDevelopWorkPackage(userRole, userContext.userId, wpToDevelopId);

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Set the current context
        this.setWorkPackage(userContext, wpToDevelopId);

        // Get new View...
        let view = ViewType.SELECT;
        if(userContext.designUpdateId === 'NONE') {
            view = ViewType.DEVELOP_BASE_WP;
        } else {
            view = ViewType.DEVELOP_UPDATE_WP;
        }

        store.dispatch(setCurrentView(view));

        return {success: true, message: ''};

    };

    // Return the adopter for a WP -------------------------------------------------------------------------------------
    getAdopterName(userId){

        const user = UserRoleData.getRoleByUserId(userId);

        if(user){
            return user.displayName;
        } else {
            return 'Unknown User'
        }
    }

    getWorkPackageStatus(wpId){

        const wp = WorkPackageData.getWorkPackageById(wpId);

        if(wp){
            return {
                status: wp.workPackageStatus,
                adopter: this.getAdopterName(wp.adoptingUserId)
            };
        } else {
            return 'NONE';
        }
    }

}

export const ClientWorkPackageServices = new ClientWorkPackageServicesClass();
