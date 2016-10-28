// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections
import {DesignUpdates} from '../collections/design_update/design_updates.js';
import {DesignUpdateComponents} from '../collections/design_update/design_update_components.js';

// Ultrawide Services
import {ViewType, ViewMode, ComponentType, DesignVersionStatus, DesignUpdateStatus, DesignUpdateMergeAction} from '../constants/constants.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentUserDevContext, setCurrentView, changeApplicationMode, setCurrentUserOpenDesignUpdateItems} from '../redux/actions';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Design Update Services - supports client calls for updates to Design Updates
//
// This class is the test entry point when not testing through the GUI.
// Most functions validate and return true / false according to business rules even if there is implicit validation in the GUI
// (E.g. buttons not being visible if action invalid)
//
// ---------------------------------------------------------------------------------------------------------------------


class ClientDesignUpdateServices {

    // Sets the currently selected design update as part of the global state
    setDesignUpdate(userContext, newDesignUpdateId){

        if(newDesignUpdateId != userContext.designUpdateId) {

            const context = {
                userId:                     Meteor.userId(),
                designId:                   userContext.designId,           // Must be the same design
                designVersionId:            userContext.designVersionId,    // Must be same design version
                designUpdateId:             newDesignUpdateId,              // Update selected
                workPackageId:              'NONE',
                designComponentId:          'NONE',
                designComponentType:        'NONE',
                featureReferenceId:         'NONE',
                featureAspectReferenceId:   'NONE',
                scenarioReferenceId:        'NONE',
                scenarioStepId:             'NONE'
            };

            store.dispatch(setCurrentUserItemContext(context, true));

            return true;
        }

        // Not an error - just indicates no update needed
        return false;
    };

    // User clicks Add New Update in Design Updates list for a Design Version
    addNewDesignUpdate(designVersionId, designVersionStatus){

        // Validate - can only add design update to New or Draft Design Versions
        if(designVersionStatus === DesignVersionStatus.VERSION_NEW || designVersionStatus === DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT) {
            Meteor.call('designUpdate.addNewUpdate', designVersionId, true);  // Always populate a new update
            return true;
        } else {
            return false;
        }
    };

    // User saves an update to a Design Update name
    saveDesignUpdateName(designUpdateId, newName){
        Meteor.call('designUpdate.updateDesignUpdateName', designUpdateId, newName);
        return true;
    }

    // User saves an update to a Design Update version
    saveDesignUpdateVersion(designUpdateId, newVersion){
        Meteor.call('designUpdate.updateDesignUpdateVersion', designUpdateId, newVersion);
        return true;
    }

    // User chose to edit a design update.
    editDesignUpdate(userContext, designUpdateToEditId){

        // Validation - only new and draft design updates can be edited
        const du = DesignUpdates.findOne({_id: designUpdateToEditId});

        if(du && (du.updateStatus != DesignUpdateStatus.UPDATE_MERGED)){

            // Open the update scope down to the Feature level
            const designUpdateOpenComponents = DesignUpdateComponents.find(
                {
                    designUpdateId: designUpdateToEditId,
                    componentType: {$in:[ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]}
                },
                {fields: {_id: 1}}
            );

            console.log("Setting open DU Items: " + designUpdateOpenComponents.count());

            let duArr = [];
            designUpdateOpenComponents.forEach((component) => {
                duArr.push(component._id);
            });

            store.dispatch(setCurrentUserOpenDesignUpdateItems(
                Meteor.userId(),
                duArr,
                null,
                true
            ));

            // Ensure that the current update is the update we chose to edit
            this.setDesignUpdate(userContext, designUpdateToEditId);

            // Edit mode
            store.dispatch(changeApplicationMode(ViewMode.MODE_EDIT));

            // Switch to update edit view
            store.dispatch(setCurrentView(ViewType.DESIGN_UPDATE_EDIT));

            return true;

        } else {
            // Edit not allowed
            //TODO Messaging
            return false;
        }
    };

    // User chose to publish a design update to make it available in draft form
    publishDesignUpdate(userContext, designUpdateToPublishId){

        // Validation - can only publish a new design update
        const du = DesignUpdates.findOne({_id: designUpdateToPublishId});

        if(du && (du.updateStatus === DesignUpdateStatus.UPDATE_NEW)){

            // Ensure that the current update is the update we chose to publish
            this.setDesignUpdate(userContext, designUpdateToPublishId);

            // And update its status to published
            Meteor.call('designUpdate.publishUpdate', designUpdateToPublishId);

        } else {
            // Publish not allowed
            //TODO Messaging
            return false;
        }
    };

    // User chose to view a Design Update
    viewDesignUpdate(userContext, designUpdateToViewId){

        // Validation - all Design Updates can be viewed
        const du = DesignUpdates.findOne({_id: designUpdateToViewId});

        if(du){

            // Ensure that the current update is the update we chose to view
            this.setDesignUpdate(userContext, designUpdateToViewId);

            // View mode
            store.dispatch(changeApplicationMode(ViewMode.MODE_VIEW));

            // Switch to update view-only
            store.dispatch(setCurrentView(ViewType.DESIGN_UPDATE_VIEW));

            return true;

        } else {
            // No design update!
            //TODO Messaging
            return false;
        }
    };

    // User chose to delete a design update
    deleteDesignUpdate(userContext, designUpdateToDeleteId){

        // Validation - can only delete unpublished updates TODO: possibly non-adopted as well?
        const du = DesignUpdates.findOne({_id: designUpdateToDeleteId});

        if(du && (du.updateStatus === DesignUpdateStatus.UPDATE_NEW)){

            // If the DU being deleted is the current one, set current DU to nothing
            if (userContext.designUpdateId === designUpdateToDeleteId) {

                const context = {
                    userId:                     Meteor.userId(),
                    designId:                   userContext.designId,
                    designVersionId:            userContext.designVersionId,
                    designUpdateId:             'NONE',
                    workPackageId:              'NONE',
                    designComponentId:          'NONE',
                    designComponentType:        'NONE',
                    featureReferenceId:         'NONE',
                    featureAspectReferenceId:   'NONE',
                    scenarioReferenceId:        'NONE',
                    scenarioStepId:             'NONE'
                };

                store.dispatch(setCurrentUserItemContext(context, true));
            }

            // And now actually remove the DU
            Meteor.call('designUpdate.removeUpdate', designUpdateToDeleteId);

            return true;

        } else {
            // Delete not allowed
            //TODO Messaging
            return false;
        }
    };

}

export default new ClientDesignUpdateServices();