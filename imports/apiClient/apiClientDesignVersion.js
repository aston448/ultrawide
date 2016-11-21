
// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections
import {DesignVersions} from '../collections/design/design_versions.js';
import {DesignUpdates} from '../collections/design_update/design_updates.js';

// Ultrawide Services
import { ViewType, ViewMode, RoleType, DesignVersionStatus, MessageType } from '../constants/constants.js';
import { DesignVersionMessages } from '../constants/message_texts.js';

import ClientMashDataServices       from '../apiClient/apiClientMashData.js';
import ClientContainerServices      from '../apiClient/apiClientContainerServices.js';
import DesignVersionValidationApi   from '../apiValidation/apiDesignVersionValidation.js';
import ServerDesignVersionApi       from '../apiServer/apiDesignVersion.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentView, changeApplicationMode, updateUserMessage} from '../redux/actions';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Design Version Services - supports client calls for updates to Design Versions
//
// This class is the test entry point when not testing through the GUI.
// Most functions validate and return true / false according to business rules even if there is implicit validation in the GUI
// (E.g. buttons not being visible if action invalid)
//
// ---------------------------------------------------------------------------------------------------------------------


class ClientDesignVersionServices{

    // VALIDATED METHODS THAT CALL SERVER API ==========================================================================

    // User saves an update to a Design Version name -------------------------------------------------------------------
    updateDesignVersionName(userRole, designVersionId, newName){

        // Client validation
        let result = DesignVersionValidationApi.validateUpdateDesignVersionName(userRole, designVersionId, newName);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call - server actions
        ServerDesignVersionApi.updateDesignVersionName(userRole, designVersionId, newName, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Remove Design client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignVersionMessages.MSG_DESIGN_VERSION_NAME_UPDATED
                }));
            }
        });


        // Indicate that business validation passed
        return true;
    };

    // User saves an update to a Design Version version number ---------------------------------------------------------
    updateDesignVersionNumber(userRole, designVersionId, newNumber){

        // Client validation
        let result = DesignVersionValidationApi.validateUpdateDesignVersionNumber(userRole, designVersionId, newNumber);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call - server actions
        ServerDesignVersionApi.updateDesignVersionNumber(userRole, designVersionId, newNumber, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Remove Design client actions:

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignVersionMessages.MSG_DESIGN_VERSION_NUMBER_UPDATED
                }));
            }
        });


        // Indicate that business validation passed
        return true;
    };

    // User chose to publish a new design version as a draft adoptable version -----------------------------------------
    publishDesignVersion(userRole, userContext, designVersionToPublishId){

        // Client validation
        let result = DesignVersionValidationApi.validatePublishDesignVersion(userRole, designVersionToPublishId);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call - server actions
        ServerDesignVersionApi.publishDesignVersion(userRole, designVersionToPublishId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Remove Design client actions:

                // Ensure that the current version is the version we chose to publish
                this.setDesignVersion(userContext, designVersionToPublishId);

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignVersionMessages.MSG_DESIGN_VERSION_PUBLISHED
                }));
            }
        });

        // Indicate that business validation passed
        return true;
    };

    // User chose to un-publish a draft design version to make it editable again ---------------------------------------
    unpublishDesignVersion(userRole, userContext, designVersionToUnPublishId){

        // Client validation
        let result = DesignVersionValidationApi.validateUnpublishDesignVersion(userRole, designVersionToUnPublishId);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Real action call - server actions
        ServerDesignVersionApi.unpublishDesignVersion(userRole, designVersionToUnPublishId, (err, result) => {

            if (err) {
                // Unexpected error as all expected errors already handled - show alert.
                // Can't update screen here because of error
                alert('Unexpected error: ' + err.reason + '.  Contact support if persists!');
            } else {
                // Remove Design client actions:

                // Ensure that the current version is the version we chose to unpublish
                this.setDesignVersion(userContext, designVersionToUnPublishId);

                // Show action success on screen
                store.dispatch(updateUserMessage({
                    messageType: MessageType.INFO,
                    messageText: DesignVersionMessages.MSG_DESIGN_VERSION_PUBLISHED
                }));
            }
        });

        // Indicate that business validation passed
        return true;
    };

    // User chose to create a new draft design version with updates from the current version
    mergeUpdatesToNewDraftVersion(userContext, designVersionToUpdateId){

        // Validation - only draft versions can be updated to a new draft version
        // We allow a new version even if there are not actually any updates to add or roll forward

        const dv = DesignVersions.findOne({_id: designVersionToUpdateId});

        if(dv && (dv.designVersionStatus === DesignVersionStatus.VERSION_PUBLISHED_DRAFT)) {

            // Ensure that the current version is the version we chose to update
            this.setDesignVersion(userContext, designVersionToUpdateId);

            // Call the server code to do all the work
            Meteor.call('designVersion.mergeUpdatesToNewDraftVersion', designVersionToUpdateId);

            return true;
        } else {
            return false;
        }

    }

    // Developer user chose to adopt this design version as their working design
    adoptDesignVersion(){

    }

    // Developer user chose to adopt this design version plus selected updates as their working design
    adoptDesignVersionWithUpdates(){

    }


    // LOCAL CLIENT ACTIONS ============================================================================================


    // Sets the currently selected design version as part of the global state
    setDesignVersion(userContext, newDesignVersionId){

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
            moduleTestResultsLocation:      userContext.moduleTestResultsLocation
        };

        store.dispatch(setCurrentUserItemContext(context, true));

        return context;

    };

    // User chose to edit a design version.  ---------------------------------------------------------------------------
    editDesignVersion(userRole, viewOptions, userContext, designVersionToEditId, progressDataValue){

        // Validation
        let result = DesignVersionValidationApi.validateEditDesignVersion(userRole, designVersionToEditId);

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Now valid to edit so make updates:

        // Ensure that the current version is the version we chose to edit
        let updatedContext = this.setDesignVersion(userContext, designVersionToEditId);

        // Subscribe to Dev data
        if(Meteor.isClient) {
            let loading = ClientContainerServices.getDevData();
        }

        // Get the latest test results
        ClientMashDataServices.updateTestData(viewOptions, userContext);

        // Switch to the design editor view
        store.dispatch(setCurrentView(ViewType.DESIGN_NEW_EDIT));

        // Put the view in edit mode
        store.dispatch(changeApplicationMode(ViewMode.MODE_EDIT));

        return true;

    };


    // User chose to view a design version. ----------------------------------------------------------------------------
    viewDesignVersion(userRole, viewOptions, userContext, designVersion, progressDataValue){

        // Validation
        let result = DesignVersionValidationApi.validateViewDesignVersion();

        if(result != Validation.VALID){

            // Business validation failed - show error on screen
            store.dispatch(updateUserMessage({messageType: MessageType.ERROR, messageText: result}));
            return false;
        }

        // Ensure that the current version is the version we chose to view
        let updatedContext = this.setDesignVersion(userContext, designVersion._id);

        // Subscribe to Dev data
        if(Meteor.isClient) {
            let loading = ClientContainerServices.getDevData();
        }

        // Get the latest DEV data for the Mash
        ClientMashDataServices.createDevMashData(updatedContext);

        // Get the latest test results
        ClientMashDataServices.updateTestData(viewOptions, userContext);


        // Decide what the actual view should be.  A designer with a New or Draft DV
        // can have the option to switch into edit mode.  Anyone else is view only

        switch(userRole){
            case RoleType.DESIGNER:
                switch(designVersion.designVersionStatus){
                    case DesignVersionStatus.VERSION_NEW:
                    case DesignVersionStatus.VERSION_PUBLISHED_DRAFT:
                        // For new / draft design versions, viewing does not preclude switching to editing
                        store.dispatch(setCurrentView(ViewType.DESIGN_NEW_EDIT));
                        break;

                    case DesignVersionStatus.VERSION_PUBLISHED_FINAL:
                        // For final design versions view is all you can do
                        store.dispatch(setCurrentView(ViewType.DESIGN_PUBLISHED_VIEW));
                        break;
                }
                store.dispatch(changeApplicationMode(ViewMode.MODE_VIEW));
                break;
            default:
                store.dispatch(setCurrentView(ViewType.DESIGN_PUBLISHED_VIEW));
                store.dispatch(changeApplicationMode(ViewMode.MODE_VIEW));
        }



        return true;
    };

}

export default new ClientDesignVersionServices();