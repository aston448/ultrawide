
// == IMPORTS ==========================================================================================================

// Ultrawide Collections
import {DesignVersions} from '../collections/design/design_versions.js';
import {DesignUpdateComponents} from '../collections/design_update/design_update_components.js';

// Ultrawide Services
import { ViewType, ViewMode, RoleType, DesignVersionStatus, MessageType, LogLevel } from '../constants/constants.js';
import { Validation } from '../constants/validation_errors.js';
import { DesignVersionMessages } from '../constants/message_texts.js';
import { log } from '../common/utils.js';

import ClientTestIntegrationServices    from '../apiClient/apiClientTestIntegration.js';
import ClientContainerServices          from '../apiClient/apiClientContainerServices.js';
import DesignVersionValidationApi       from '../apiValidation/apiDesignVersionValidation.js';
import ServerDesignVersionApi           from '../apiServer/apiDesignVersion.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentView, setCurrentViewMode, updateUserMessage, updateTestDataFlag} from '../redux/actions';

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

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignVersionApi.updateDesignVersionName(userRole, designVersionId, newName, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
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

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignVersionApi.updateDesignVersionNumber(userRole, designVersionId, newNumber, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
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

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Ensure that the current version is the version we chose to publish
        this.setDesignVersion(userContext, designVersionToPublishId);

        // Real action call - server actions
        ServerDesignVersionApi.publishDesignVersion(userRole, designVersionToPublishId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
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

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Ensure that the current version is the version we chose to unpublish
        this.setDesignVersion(userContext, designVersionToUnPublishId);

        // Real action call - server actions
        ServerDesignVersionApi.withdrawDesignVersion(userRole, designVersionToUnPublishId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
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

    // User chose to update the working Updatable Design Version with the latest updates set to Merge
    updateWorkingDesignVersion(userRole, userContext, workingDesignVersionId){

        // Client validation
        let result = DesignVersionValidationApi.validateUpdateWorkingDesignVersion(userRole, workingDesignVersionId);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Ensure that the current version is the version we chose to update and that user context is updated
        this.setDesignVersion(userContext, workingDesignVersionId);

        // Real action call - server actions
        ServerDesignVersionApi.updateWorkingDesignVersion(userRole, workingDesignVersionId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignVersionMessages.MSG_DESIGN_VERSION_UPDATED
                }));
            }
        });

        // Indicate that business validation passed
        return {success: true, message: ''};
    }

    // User chose to create a new updatable Design Version from the current version and any updates selected
    createNextDesignVersion(userRole, userContext, baseDesignVersionId){

        // Client validation
        let result = DesignVersionValidationApi.validateCreateNextDesignVersion(userRole, baseDesignVersionId);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Real action call - server actions
        ServerDesignVersionApi.createNextDesignVersion(userRole, baseDesignVersionId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Client actions:

                // Ensure that the current version is the version we chose to update from
                this.setDesignVersion(userContext, baseDesignVersionId);

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

    // TODO
    // Developer user chose to adopt this design version as their working design
    adoptDesignVersion(){

    }

    // Developer user chose to adopt this design version plus selected updates as their working design
    adoptDesignVersionWithUpdates(){

    }


    // LOCAL CLIENT ACTIONS ============================================================================================

    // Sets the currently selected design version as part of the global state
    setDesignVersion(userContext, newDesignVersionId){

        // Also clears current DU / WP if any

        const context = {
            userId:                         userContext.userId,
            designId:                       userContext.designId,       // Must be the same design
            designVersionId:                newDesignVersionId,         // The new design version
            designUpdateId:                 'NONE',                     // Everything else reset for new Design
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

        // Subscribe to the appropriate data for the new DV
        if(Meteor.isClient) {
            console.log("Reset Design Version");
            ClientContainerServices.getDesignVersionData(newDesignVersionId);
        }

        return context;

    };

    // User chose to edit a design version.  ---------------------------------------------------------------------------
    editDesignVersion(userRole, viewOptions, userContext, designVersionToEditId, testDataFlag, mashDataStale){

        // Validation
        let result = DesignVersionValidationApi.validateEditDesignVersion(userRole, designVersionToEditId);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Now valid to edit so make updates:

        // Ensure that the current version is the version we chose to edit
        let updatedContext = this.setDesignVersion(userContext, designVersionToEditId);


        // Get dev data and the latest test results if summary showing - and switch to the edit view when loaded
        if(viewOptions.designTestSummaryVisible || viewOptions.devTestSummaryVisible || viewOptions.updateTestSummaryVisible) {

            ClientTestIntegrationServices.loadUserDevData(updatedContext, userRole, viewOptions, ViewType.DESIGN_NEW_EDIT, testDataFlag, mashDataStale);
        } else {

            // Just switch to the design editor view
            store.dispatch(setCurrentView(ViewType.DESIGN_NEW_EDIT));
        }

        // Put the view in edit mode
        store.dispatch(setCurrentViewMode(ViewMode.MODE_EDIT));

        return {success: true, message: ''};

    };


    // User chose to view a design version. ----------------------------------------------------------------------------
    viewDesignVersion(userRole, viewOptions, userContext, designVersion, testDataFlag, mashDataStale){

        // Validation
        let result = DesignVersionValidationApi.validateViewDesignVersion(userRole, designVersion._id);

        if(result != Validation.VALID){
            log((msg) => console.log(msg), LogLevel.WARNING, result);

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return {success: false, message: result};
        }

        // Ensure that the current version is the version we chose to view
        let updatedContext = this.setDesignVersion(userContext, designVersion._id);

        // Decide what the actual view should be.  A designer with a New or Draft DV
        // can have the option to switch into edit mode.  Anyone else is view only

        store.dispatch(setCurrentViewMode(ViewMode.MODE_VIEW));

        let view = ViewType.SELECT;

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

        // Get dev data and the latest test results if summary showing - and switch to the view when loaded
        if(viewOptions.designTestSummaryVisible) {

            ClientTestIntegrationServices.loadUserDevData(updatedContext, userRole, viewOptions, view, testDataFlag, mashDataStale);
        } else {

            // Just switch to the design editor view
            store.dispatch(setCurrentView(view));
        }

        return {success: true, message: ''};
    };

    // Get the Design Update item that relates to an Updatable Design Version
    getDesignUpdateItem(designComponent){

        console.log("Getting Update Item for: " + designComponent.componentName);

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
            console.log("Returning Update Item: " + updateComponents[0].componentNameNew);
            return updateComponents[0];

        } else {
            // No changes to this item
            console.log("Returning NULL");
            return null;
        }

    }

}

export default new ClientDesignVersionServices();