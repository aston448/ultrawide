// == IMPORTS ==========================================================================================================

// Ultrawide Collections
import {DesignUpdates}              from '../collections/design_update/design_updates.js';
import {DesignUpdateComponents}     from '../collections/design_update/design_update_components.js';
import {DesignVersionComponents}    from '../collections/design/design_version_components.js';
import {WorkPackageComponents}      from '../collections/work/work_package_components.js';
import {UserDesignVersionMashScenarios} from '../collections/mash/user_dv_mash_scenarios.js';

// Ultrawide Services
import { ViewType, ViewMode, RoleType, ComponentType, MessageType, DesignUpdateWpStatus, DesignUpdateTestStatus, MashTestStatus } from '../constants/constants.js';
import { Validation } from '../constants/validation_errors.js';
import { DesignUpdateMessages } from '../constants/message_texts.js';

import DesignUpdateValidationApi        from '../apiValidation/apiDesignUpdateValidation.js';
import ServerDesignUpdateApi            from '../apiServer/apiDesignUpdate.js';
import ClientDesignUpdateSummary        from '../apiClient/apiClientDesignUpdateSummary.js';
import ClientTestIntegrationServices    from '../apiClient/apiClientTestIntegration.js';
import ClientUserContextServices        from '../apiClient/apiClientUserContext.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentView, setCurrentViewMode, setCurrentUserOpenDesignUpdateItems, updateUserMessage, setCurrentUserViewOptions, setUpdateScopeItems} from '../redux/actions';

// =====================================================================================================================
// Client API for Design Update Items
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================
class ClientDesignUpdateServices {

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User clicks Add New Update in Design Updates list for a Design Version ------------------------------------------
    addNewDesignUpdate(userRole, designVersionId){

        // Client validation
        let result = DesignUpdateValidationApi.validateAddDesignUpdate(userRole, designVersionId);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignUpdateApi.addDesignUpdate(userRole, designVersionId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 1: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignUpdateMessages.MSG_DESIGN_UPDATE_ADDED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User saves an update to a Design Update name --------------------------------------------------------------------
    updateDesignUpdateName(userRole, designUpdateId, newName){

        // Client validation
        let result = DesignUpdateValidationApi.validateUpdateDesignUpdateName(userRole, designUpdateId, newName);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignUpdateApi.updateDesignUpdateName(userRole, designUpdateId, newName, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 2: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignUpdateMessages.MSG_DESIGN_UPDATE_NAME_UPDATED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User saves an update to a Design Update version -----------------------------------------------------------------
    updateDesignUpdateReference(userRole, designUpdateId, newRef){

        // Client validation
        let result = DesignUpdateValidationApi.validateUpdateDesignUpdateReference(userRole, designUpdateId, newRef);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignUpdateApi.updateDesignUpdateRef(userRole, designUpdateId, newRef, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 3: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignUpdateMessages.MSG_DESIGN_UPDATE_VERSION_UPDATED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User chose to publish a design update to make it available in draft form ----------------------------------------
    publishDesignUpdate(userRole, userContext, designUpdateToPublishId){

        // Client validation
        let result = DesignUpdateValidationApi.validatePublishDesignUpdate(userRole, designUpdateToPublishId);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignUpdateApi.publishDesignUpdate(userRole, designUpdateToPublishId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 4: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:
                // Ensure that the current update is the update we chose to publish
                this.setDesignUpdate(userContext, designUpdateToPublishId);

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignUpdateMessages.MSG_DESIGN_UPDATE_PUBLISHED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User chose to withdraw a published design update  ---------------------------------------------------------------
    withdrawDesignUpdate(userRole, userContext, designUpdateToWithdrawId){

        // Client validation
        let result = DesignUpdateValidationApi.validateWithdrawDesignUpdate(userRole, designUpdateToWithdrawId);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignUpdateApi.withdrawDesignUpdate(userRole, designUpdateToWithdrawId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 5: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:
                // Ensure that the current update is the update we chose to withdraw
                this.setDesignUpdate(userContext, designUpdateToWithdrawId);

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignUpdateMessages.MSG_DESIGN_UPDATE_WITHDRAWN
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User chose to delete a design update ----------------------------------------------------------------------------
    deleteDesignUpdate(userRole, userContext, designUpdateToDeleteId){

        // Client validation
        let result = DesignUpdateValidationApi.validateRemoveDesignUpdate(userRole, designUpdateToDeleteId);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignUpdateApi.removeDesignUpdate(userRole, designUpdateToDeleteId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 6: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:
                // Clear DU from user context
                const context = {
                    userId:                         userContext.userId,
                    designId:                       userContext.designId,
                    designVersionId:                userContext.designVersionId,
                    designUpdateId:                 'NONE',
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
                    messageText: DesignUpdateMessages.MSG_DESIGN_UPDATE_REMOVED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User changed the merge action on the Design Update
    updateMergeAction(userRole, designUpdateId, newAction){

        // Client validation
        let result = DesignUpdateValidationApi.validateUpdateMergeAction(userRole, designUpdateId);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignUpdateApi.updateMergeAction(userRole, designUpdateId, newAction, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 7: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignUpdateMessages.MSG_DESIGN_UPDATE_MERGE_ACTION_SET
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};

    }

    // LOCAL CLIENT ACTIONS ============================================================================================

    // Sets the currently selected design update as part of the global state -------------------------------------------
    setDesignUpdate(userContext, newDesignUpdateId){

        let newContext = userContext;

        //if(newDesignUpdateId !== userContext.designUpdateId) {

            // Also clears current WP selection when DU selected if not changing
            newContext = {
                userId: userContext.userId,
                designId: userContext.designId,           // Must be the same design
                designVersionId: userContext.designVersionId,    // Must be same design version
                designUpdateId: newDesignUpdateId,              // Update selected
                workPackageId: 'NONE',
                designComponentId: 'NONE',
                designComponentType: 'NONE',
                featureReferenceId: 'NONE',
                featureAspectReferenceId: 'NONE',
                scenarioReferenceId: 'NONE',
                scenarioStepId: 'NONE'
            };

            store.dispatch(setCurrentUserItemContext(newContext, true));

        //}

        // Open default items
        newContext = ClientUserContextServices.setOpenDesignUpdateItems(newContext);

        // Load or refresh DU Summary data
        //console.log('Calling update DU summary...');
        ClientDesignUpdateSummary.getDesignUpdateSummary(userContext);

        if(newDesignUpdateId !== userContext.designUpdateId) {

            // Update test summary if changing DU
            ClientTestIntegrationServices.updateTestSummaryData(newContext, false);
        }

        return newContext;

    };

    // User chose to edit a design update ------------------------------------------------------------------------------
    editDesignUpdate(userRole, userContext, viewOptions, designUpdateToEditId){

        // Client validation
        let result = DesignUpdateValidationApi.validateEditDesignUpdate(userRole, designUpdateToEditId);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Ensure that the current update is the update we chose to edit
        const newContext = this.setDesignUpdate(userContext, designUpdateToEditId);

        // Edit mode
        store.dispatch(setCurrentViewMode(ViewMode.MODE_EDIT));

        // Switch to update edit view
        store.dispatch(setCurrentView(ViewType.DESIGN_UPDATE_EDIT));


        // Set up the scope items as the current in scope items
        const updateItems = DesignUpdateComponents.find({designUpdateId: designUpdateToEditId}).fetch();

        let updateItemsArr = [];
        let designItem = null;

        updateItems.forEach((item) => {
            designItem = DesignVersionComponents.findOne({
                designVersionId:        item.designVersionId,
                componentReferenceId:   item.componentReferenceId
            });

            // The design item won't exist if a new item in a non-merged update
            if(designItem) {
                updateItemsArr.push(designItem._id);
            }
        });

        store.dispatch(setUpdateScopeItems(
            {
                current:    updateItemsArr,
                added:      [],
                removed:    []
            }
        ));

        return {success: true, message: ''};

    };

    // User chose to view a Design Update ------------------------------------------------------------------------------
    viewDesignUpdate(userRole, userContext, viewOptions, designUpdateToViewId, testDataFlag, testIntegrationDataContext){

        // Client validation
        let result = DesignUpdateValidationApi.validateViewDesignUpdate(userRole, designUpdateToViewId);

        if(result !== Validation.VALID){
            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Ensure that the current update is the update we chose to view
        const newContext = this.setDesignUpdate(userContext, designUpdateToViewId);

        // View mode
        store.dispatch(setCurrentViewMode(ViewMode.MODE_VIEW));

        // Just switch to the design editor view
        store.dispatch(setCurrentView(ViewType.DESIGN_UPDATE_VIEW));

        return {success: true, message: ''};

    };

    // // User chose to refresh the Update Summary ------------------------------------------------------------------------
    // refreshSummary(designUpdateId){
    //
    //     ClientDesignUpdateSummary.getDesignUpdateSummary(designUpdateId);
    // }

    // Called when Design Update list is displayed ---------------------------------------------------------------------
    updateDesignUpdateStatuses(userContext){

        const designUpdates = DesignUpdates.find({designVersionId: userContext.designVersionId});

        designUpdates.forEach((du) => {

            let duScenarios = DesignUpdateComponents.find({designUpdateId: du._id, componentType: ComponentType.SCENARIO});
            let allInWp = true;
            let someInWp = false;
            let noneInWp = true;
            let noFails = true;
            let noPasses = false;
            let allPassing = true;
            let somePassing = false;

            duScenarios.forEach((duScenario) => {

                let wpScenario = WorkPackageComponents.findOne({
                    designVersionId:            userContext.designVersionId,
                    componentReferenceId:       duScenario.componentReferenceId
                });

                let scenarioTestResult = UserDesignVersionMashScenarios.findOne({
                    userId:                     userContext.userId,
                    designVersionId:            userContext.designVersionId,
                    designScenarioReferenceId:  duScenario.componentReferenceId
                });

                if(wpScenario){
                    someInWp = true;
                    noneInWp = false;
                } else {
                    allInWp = false;
                }

                if(scenarioTestResult){
                    if(scenarioTestResult.accMashTestStatus === MashTestStatus.MASH_FAIL || scenarioTestResult.intMashTestStatus === MashTestStatus.MASH_FAIL || scenarioTestResult.unitMashTestStatus === MashTestStatus.MASH_FAIL){
                        noFails = false;
                    } else {
                        if(scenarioTestResult.accMashTestStatus === MashTestStatus.MASH_PASS || scenarioTestResult.intMashTestStatus === MashTestStatus.MASH_PASS || scenarioTestResult.unitMashTestStatus === MashTestStatus.MASH_PASS){
                            noPasses = false;
                        }
                    }
                } else {
                    allPassing = false;
                }
            });

            let duWpStatus = DesignUpdateWpStatus.DU_NO_WP_SCENARIOS;

            if(allInWp){
                duWpStatus = DesignUpdateWpStatus.DU_ALL_WP_SCENARIOS;
            } else {
                if(someInWp) {
                    duWpStatus = DesignUpdateWpStatus.DU_SOME_WP_SCENARIOS;
                }
            }

            let duTestStatus = DesignUpdateTestStatus.DU_SOME_SCENARIOS_PASSING;

            if(!noFails){
                duTestStatus = DesignUpdateTestStatus.DU_SCENARIOS_FAILING;
            } else {
                if(allPassing){
                    duTestStatus = DesignUpdateTestStatus.DU_ALL_SCENARIOS_PASSING;
                } else {
                    if(noPasses){
                        duTestStatus = DesignUpdateTestStatus.DU_NO_SCENARIOS_PASSING;
                    }
                }
            }

            DesignUpdates.update(
                {
                    _id: du._id
                },
                {
                    $set: {
                        updateWpStatus:     duWpStatus,
                        updateTestStatus:   duTestStatus
                    }
                }
            );
        });
    }
}

export default new ClientDesignUpdateServices();