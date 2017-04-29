
// == IMPORTS ==========================================================================================================

// Ultrawide Collections
import {DesignVersions}             from '../collections/design/design_versions.js';
import {DesignUpdates}              from '../collections/design_update/design_updates.js';
import {DesignVersionComponents}    from '../collections/design/design_version_components.js';
import {DesignUpdateComponents}     from '../collections/design_update/design_update_components.js';
import {UserRoles}                  from '../collections/users/user_roles.js';

// Ultrawide Services
import { ViewType, ViewMode, RoleType, ComponentType, DesignVersionStatus, DesignUpdateStatus, UpdateScopeType, MessageType, WorkSummaryType, LogLevel } from '../constants/constants.js';
import { Validation, UserRolesValidationErrors} from '../constants/validation_errors.js';
import { DesignVersionMessages } from '../constants/message_texts.js';
import { log } from '../common/utils.js';

import ClientTestIntegrationServices    from '../apiClient/apiClientTestIntegration.js';
import ClientContainerServices          from '../apiClient/apiClientContainerServices.js';
import DesignVersionValidationApi       from '../apiValidation/apiDesignVersionValidation.js';
import ServerDesignVersionApi           from '../apiServer/apiDesignVersion.js';
import ClientUserContextServices        from '../apiClient/apiClientUserContext.js';
import ClientDesignUpdateServices       from '../apiClient/apiClientDesignUpdate.js';
import ClientWorkPackageServices        from '../apiClient/apiClientWorkPackage.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentView, setCurrentRole, setCurrentViewMode, updateUserMessage, setDesignVersionDataLoadedTo, updateOpenItemsFlag, setMashDataStaleTo, setTestDataStaleTo} from '../redux/actions';

// =====================================================================================================================
// Client API for Design Version Items
//
// Calls validation for client and then, if required, server API to update server data
// =====================================================================================================================
class ClientDesignVersionServices{

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User saves an update to a Design Version name -------------------------------------------------------------------
    updateDesignVersionName(userRole, designVersionId, newName){

        // Client validation
        let result = DesignVersionValidationApi.validateUpdateDesignVersionName(userRole, designVersionId, newName);

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignVersionApi.updateDesignVersionName(userRole, designVersionId, newName, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 1: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignVersionMessages.MSG_DESIGN_VERSION_NAME_UPDATED
                }));
            }
        });


        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User saves an update to a Design Version version number ---------------------------------------------------------
    updateDesignVersionNumber(userRole, designVersionId, newNumber){

        // Client validation
        let result = DesignVersionValidationApi.validateUpdateDesignVersionNumber(userRole, designVersionId, newNumber);

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignVersionApi.updateDesignVersionNumber(userRole, designVersionId, newNumber, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 2: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignVersionMessages.MSG_DESIGN_VERSION_NUMBER_UPDATED
                }));
            }
        });


        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User chose to publish a new design version as a draft adoptable version -----------------------------------------
    publishDesignVersion(userRole, userContext, designVersionToPublishId){

        // Client validation
        let result = DesignVersionValidationApi.validatePublishDesignVersion(userRole, designVersionToPublishId);

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Ensure that the current version is the version we chose to publish
        this.setDesignVersion(userContext, userRole, designVersionToPublishId, false);

        // Real action call - server actions
        ServerDesignVersionApi.publishDesignVersion(userRole, designVersionToPublishId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 3: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignVersionMessages.MSG_DESIGN_VERSION_PUBLISHED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User chose to withdraw a draft design version to make it hidden again -------------------------------------------
    withdrawDesignVersion(userRole, userContext, designVersionToUnPublishId){

        // Client validation
        let result = DesignVersionValidationApi.validateWithdrawDesignVersion(userRole, designVersionToUnPublishId);

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Ensure that the current version is the version we chose to unpublish
        this.setDesignVersion(userContext, userRole, designVersionToUnPublishId, false);

        // Real action call - server actions
        ServerDesignVersionApi.withdrawDesignVersion(userRole, designVersionToUnPublishId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 4: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignVersionMessages.MSG_DESIGN_VERSION_PUBLISHED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    };

    // User chose to create a new updatable Design Version from the current version and any updates selected
    createNextDesignVersion(userRole, userContext, baseDesignVersionId){

        // Client validation
        let result = DesignVersionValidationApi.validateCreateNextDesignVersion(userRole, baseDesignVersionId);

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignVersionApi.createNextDesignVersion(userRole, baseDesignVersionId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 6: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Ensure that the current version is the version we chose to update from
                this.setDesignVersion(userContext, userRole, baseDesignVersionId, false);

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignVersionMessages.MSG_DESIGN_VERSION_CREATED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    }

    // Work Progress screen needs a refresh
    updateWorkProgress(userContext){

        log((msg) => console.log(msg), LogLevel.INFO, "UPDATE WORK PROGRESS...");

        ServerDesignVersionApi.updateWorkProgress(userContext, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error 7: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:
            }
        });
    }

    // Pre-validation to decide if we should even show the modal dialog
    validateCreateNextDesignVersion(userRole, baseDesignVersionId){

        let result = DesignVersionValidationApi.validateCreateNextDesignVersion(userRole, baseDesignVersionId);

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        return true;
    }


    // LOCAL CLIENT ACTIONS ============================================================================================

    // Sets the currently selected design version as part of the global state
    setDesignVersion(userContext, userRole, newDesignVersionId, forceReset){

        let newContext = userContext;

        log((msg) => console.log(msg), LogLevel.INFO, "SET DESIGN VERSION.  Current DV {}  New DV {} Force Context reset: ", userContext.designVersionId, newDesignVersionId, forceReset);

        // On change clears current DU / WP if any

        // Force reset is for when we want to forget about any Design Update / WP in the context

        // Only want to reset component though if changing DV
        let designComponentId = userContext.designComponentId;

        if(newDesignVersionId !== userContext.designVersionId || forceReset){
            designComponentId = 'NONE';
        }

        if(forceReset || (newDesignVersionId !== userContext.designVersionId)) {

            newContext = {
                userId: userContext.userId,
                designId: userContext.designId,       // Must be the same design
                designVersionId: newDesignVersionId,         // The new design version
                designUpdateId: 'NONE',                     // Everything else reset for new Design
                workPackageId: 'NONE',
                designComponentId: designComponentId,
                designComponentType: 'NONE',
                featureReferenceId: 'NONE',
                featureAspectReferenceId: 'NONE',
                scenarioReferenceId: 'NONE',
                scenarioStepId: 'NONE'
            };

            store.dispatch(setCurrentUserItemContext(newContext, true));

            // Subscribe to the appropriate data for the new DV if DV changing
            if(newDesignVersionId !== userContext.designVersionId) {
                store.dispatch(setDesignVersionDataLoadedTo(false));
                // store.dispatch(setMashDataStaleTo(true));
                // store.dispatch(setTestDataStaleTo(true));
                log((msg) => console.log(msg), LogLevel.INFO, "Loading new DV data...");
                ClientContainerServices.getDesignVersionData(newContext, this.postDataLoadActions);
            }

        }

        return newContext;

    };

    postDataLoadActions(){

        const userContext = store.getState().currentUserItemContext;

        // Open default items
        ClientUserContextServices.setOpenDesignVersionItems(userContext);

        // Force a re-render of each App to trigger opening
        const designVersionApplications = DesignVersionComponents.find({
            designVersionId: userContext.designVersionId,
            componentType: ComponentType.APPLICATION
        }).fetch();

        designVersionApplications.forEach((app) => {
            store.dispatch((updateOpenItemsFlag(app._id)));
        });

        // Recalculate the work summary
        ClientDesignVersionServices.updateWorkProgress(userContext);

        // Get latest status on DUs
        ClientDesignUpdateServices.updateDesignUpdateStatuses(userContext);
    }

    // User chose to edit a design version.  ---------------------------------------------------------------------------
    editDesignVersion(userRole, userContext, designVersionToEditId){

        // Validation
        let result = DesignVersionValidationApi.validateEditDesignVersion(userRole, designVersionToEditId);

        if(result !== Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Now valid to edit so make updates:

        // Ensure that the current version is the version we chose to edit.  Reset User Context
        let updatedContext = this.setDesignVersion(userContext, userRole, designVersionToEditId, true);

        store.dispatch(setCurrentView(ViewType.DESIGN_NEW_EDIT));

        // Put the view in edit mode
        store.dispatch(setCurrentViewMode(ViewMode.MODE_EDIT));

        return {success: true, message: ''};

    };


    // User chose to view a design version. ----------------------------------------------------------------------------
    viewDesignVersion(userRole, userContext, designVersionId){

        // Validation
        let result = DesignVersionValidationApi.validateViewDesignVersion(userRole, designVersionId);

        if(result !== Validation.VALID){
            log((msg) => console.log(msg), LogLevel.WARNING, result);

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Ensure that the current version is the version we chose to view
        let updatedContext = this.setDesignVersion(userContext, userRole, designVersionId, true);

        // Decide what the actual view should be.  A designer with a New or Draft DV
        // can have the option to switch into edit mode.  Anyone else is view only

        store.dispatch(setCurrentViewMode(ViewMode.MODE_VIEW));

        let view = ViewType.SELECT;

        const designVersion = DesignVersions.findOne({_id: designVersionId});

        switch(userRole){
            case RoleType.DESIGNER:
                switch(designVersion.designVersionStatus){
                    case DesignVersionStatus.VERSION_NEW:
                    case DesignVersionStatus.VERSION_DRAFT:
                        // For new / draft design versions, viewing does not preclude switching to editing
                        view = ViewType.DESIGN_NEW_EDIT;
                        break;
                    case DesignVersionStatus.VERSION_UPDATABLE:
                        view = ViewType.DESIGN_UPDATABLE_VIEW;
                        break;
                    case DesignVersionStatus.VERSION_DRAFT_COMPLETE:
                    case DesignVersionStatus.VERSION_UPDATABLE_COMPLETE:
                        // For final design versions view is all you can do
                        view = ViewType.DESIGN_PUBLISHED_VIEW;
                        break;
                }
                break;
            default:
                switch(designVersion.designVersionStatus){
                    case DesignVersionStatus.VERSION_UPDATABLE:
                        // Developers and Managers can see progress on an updatable Design Version
                        view = ViewType.DESIGN_UPDATABLE_VIEW;
                        break;
                    default:
                        // Anything else is View only
                        view = ViewType.DESIGN_PUBLISHED_VIEW;
                        break;
                }
                break;
        }

        store.dispatch(setCurrentView(view));

        ClientTestIntegrationServices.updateTestSummaryData(userContext, false);

        return {success: true, message: ''};
    };

    // Get Design Update item for a Design Update Scope - if there is one.  If not then the item is not in scope
    getDesignUpdateItemForUpdate(currentComponent, designUpdateId){

        const updateComponent = DesignUpdateComponents.findOne({
            designVersionId:        currentComponent.designVersionId,
            designUpdateId:         designUpdateId,
            componentReferenceId:   currentComponent.componentReferenceId,
        });

        //console.log("getting update component returning " + updateComponent);

        if(updateComponent){
            return updateComponent;
        } else {
            return null;
        }
    }

    // Get the Design Update item that relates to an Updatable Design Version
    getDesignUpdateItemForUpdatableVersion(designComponent){

        // There may be several Design Updates for the Design Version.
        // We will look for the one that has changed.  It should not be possible to change the same component in more than one update.
        // However the details text might also be changed so there could be more than one...

        // But in any case it does not matter as what we want is the OLD data that has been blatted over when we merged the updates.
        // Therefore we can pick any of the DU components and it wil have the base version in it.

        const updateComponents = DesignUpdateComponents.find({
            designVersionId:        designComponent.designVersionId,
            componentReferenceId:   designComponent.componentReferenceId,
            isNew:                  false,
            $or:[{isChanged: true}, {isTextChanged: true}],
        }).fetch();

        // This should only return one component unless there is the circumstance that the component was changed in one DU
        // and its text in another...

        if(updateComponents.length > 0){
            // Just return the first item found
            return updateComponents[0];

        } else {
            // No changes to this item
            return null;
        }

    }

    // Get a list of updates to INCLUDE / CARRY FORWARD / IGNORE for the next Design Version ---------------------------
    getDesignUpdatesForVersion(designVersionId, updateMergeAction){

        return DesignUpdates.find({
            designVersionId:    designVersionId,
            updateStatus:       DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT,
            updateMergeAction:  updateMergeAction
        }).fetch();
    }

    getDesignVersionStatus(designVersionId){

        const designVersion = DesignVersions.findOne({_id: designVersionId});

        if(designVersion){
            return designVersion.designVersionStatus;
        } else {
            return 'NONE';
        }
    }

    // User has clicked on the WP icon for a Scenario in the DV working view
    gotoWorkProgressSummaryItemAsRole(item, role){

        const userContext = store.getState().currentUserItemContext;



        // Validate that user has this role...
        const userRole = UserRoles.findOne({userId: userContext.userId});
        let newContext = {};

        if(role === RoleType.DESIGNER && userRole.isDesigner || role === RoleType.DEVELOPER && userRole.isDeveloper || role === RoleType.MANAGER && userRole.isManager){

            // OK to proceed - reset the user context back to the DV

            newContext = {
                userId:                         userContext.userId,
                designId:                       userContext.designId,
                designVersionId:                item.designVersionId,
                designUpdateId:                 'NONE',
                workPackageId:                  'NONE',
                designComponentId:              'NONE',
                designComponentType:            'NONE',
                featureReferenceId:             'NONE',
                featureAspectReferenceId:       'NONE',
                scenarioReferenceId:            'NONE',
                scenarioStepId:                 'NONE'
            };

            store.dispatch(setCurrentUserItemContext(newContext, true));

            // Set new role
            store.dispatch(setCurrentRole(userContext.userId, role));

            // Select the item wanted
            if(item.designUpdateId !== 'NONE'){
                console.log("Setting Design Update... " + item.designUpdateId);
                newContext = ClientDesignUpdateServices.setDesignUpdate(newContext, item.designUpdateId)
            }

            if(item.workPackageId !== 'NONE'){
                console.log("Setting Work package... " + item.workPackageId);
                ClientWorkPackageServices.setWorkPackage(newContext, item.workPackageId)
            }

            // Go to Selection screen
            store.dispatch(setCurrentView(ViewType.SELECT));

            return {success: true, message: ''};

        } else {
            // No action
            return {success: false, message: UserRolesValidationErrors.INVALID_ROLE_FOR_USER};
        }

    }
}

export default new ClientDesignVersionServices();