
// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections
import {DesignVersions} from '../collections/design/design_versions.js';
import {DesignUpdates} from '../collections/design_update/design_updates.js';

// Ultrawide Services
import {ViewType, ViewMode, DesignVersionStatus} from '../constants/constants.js';
import ClientMashDataServices   from '../apiClient/apiClientMashData.js';
import ClientContainerServices  from '../apiClient/apiClientContainerServices.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentView, changeApplicationMode} from '../redux/actions';

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

    // User saves an update to a Design Version name
    saveDesignVersionName(designVersionId, newName){

        Meteor.call('designVersion.updateDesignVersionName', designVersionId, newName);
        return true;
    };

    // User saves an update to a Design Version version number
    saveDesignVersionNumber(designVersionId, newNumber){

        Meteor.call('designVersion.updateDesignVersionNumber', designVersionId, newNumber);
        return true;
    };

    // User chose to edit a design version.  Must be a new design to be editable
    editDesignVersion(viewOptions, userContext, designVersionToEditId, currentProgressDataValue){

        // Validation - only new or draft published design versions can be edited
        const dv = DesignVersions.findOne({_id: designVersionToEditId});

        if(dv && (dv.designVersionStatus === DesignVersionStatus.VERSION_NEW || dv.designVersionStatus === DesignVersionStatus.VERSION_PUBLISHED_DRAFT)) {

            // Ensure that the current version is the version we chose to edit
            let updatedContext = this.setDesignVersion(userContext, designVersionToEditId);

            // Subscribe to Dev data
            let loading = ClientContainerServices.getDevData();

            // Get the latest test results
            ClientMashDataServices.updateTestData(viewOptions, userContext);

            // Switch to the design editor view
            store.dispatch(setCurrentView(ViewType.DESIGN_NEW_EDIT));

            // Put the view in edit mode
            store.dispatch(changeApplicationMode(ViewMode.MODE_EDIT));

            return true;

        } else {
            // Edit not allowed
            //TODO Messaging
            return false;
        }

    };

    // User chose to view a design version.  Any DV can be viewed.
    viewDesignVersion(viewOptions, userContext, designVersionToViewId, dvStatus){

        // Ensure that the current version is the version we chose to view
        let updatedContext = this.setDesignVersion(userContext, designVersionToViewId);

        // Subscribe to Dev data
        let loading = ClientContainerServices.getDevData();

        // Get the latest DEV data for the Mash
        ClientMashDataServices.createDevMashData(updatedContext);

        // Get the latest test results
        ClientMashDataServices.updateTestData(viewOptions, userContext);

        switch(dvStatus){
            case DesignVersionStatus.VERSION_NEW:
                // For new design versions, viewing does not preclude switching to editing
                store.dispatch(setCurrentView(ViewType.DESIGN_NEW_EDIT));
                break;
            case DesignVersionStatus.VERSION_PUBLISHED_DRAFT:
            case DesignVersionStatus.VERSION_PUBLISHED_FINAL:
                // For any other design versions view is all you can do
                store.dispatch(setCurrentView(ViewType.DESIGN_PUBLISHED_VIEW));
                break;
        }

        // Put the view in view mode
        store.dispatch(changeApplicationMode(ViewMode.MODE_VIEW));

        return true;
    };

    // User chose to publish a new design version as a draft adoptable version
    publishDesignVersion(userContext, designVersionToPublishId){

        // Validation - only new design versions can be published
        const dv = DesignVersions.findOne({_id: designVersionToPublishId});

        if(dv && (dv.designVersionStatus === DesignVersionStatus.VERSION_NEW)) {

            // Ensure that the current version is the version we chose to publish
            this.setDesignVersion(userContext, designVersionToPublishId);

            // Update the DV to draft published status
            Meteor.call('designVersion.publishDesignVersion', designVersionToPublishId);

            return true;
        } else {
            //TODO Messaging
            return false;
        }
    };

    // User chose to un-publish a draft design version to make it editable again
    unpublishDesignVersion(userContext, designVersionToUnPublishId){

        // Validation - only draft design versions can be unpublished and then only if they have no updates and are not adopted
        const dv = DesignVersions.findOne({_id: designVersionToUnPublishId});
        const du = DesignUpdates.find({designVersionId: designVersionToUnPublishId});

        //TODO Add User Adoption validation

        if(dv && (dv.designVersionStatus === DesignVersionStatus.VERSION_PUBLISHED_DRAFT) && du.count() === 0) {

            // Ensure that the current version is the version we chose to un-publish
            this.setDesignVersion(userContext, designVersionToUnPublishId);

            // Return to editable status
            Meteor.call('designVersion.unpublishDesignVersion', designVersionToUnPublishId);

            return true;
        } else {
            //TODO Messaging
            return false;
        }
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


}

export default new ClientDesignVersionServices();