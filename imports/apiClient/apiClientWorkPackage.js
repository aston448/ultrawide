// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections
import {WorkPackages} from '../collections/work/work_packages.js';
import {DesignComponents} from '../collections/design/design_components.js';
import {DesignUpdateComponents} from '../collections/design_update/design_update_components.js'
import {WorkPackageComponents} from '../collections/work/work_package_components.js'


// Ultrawide Services
import {ViewType, ViewMode, DisplayContext, DesignUpdateStatus, WorkPackageStatus, WorkPackageType, ComponentType} from '../constants/constants.js';

import ClientContainerServices from '../apiClient/apiClientContainerServices.js';
import ClientMashDataServices from '../apiClient/apiClientMashData.js';

// REDUX services
import store from '../redux/store'
import {setCurrentUserItemContext, setCurrentUserOpenWorkPackageItems, setCurrentView, changeApplicationMode} from '../redux/actions';

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

    // Sets the currently selected work package as part of the global state
    setWorkPackage(userContext, newWorkPackageId){

        // Returns updated context so this can be passed on if needed

        if(newWorkPackageId != userContext.workPackageId) {

            const context = {
                userId:                 Meteor.userId(),
                designId:               userContext.designId,
                designVersionId:        userContext.designVersionId,
                designUpdateId:         userContext.designUpdateId,
                workPackageId:          newWorkPackageId,
                designComponentId:      'NONE',
                featureReferenceId:     'NONE',
                scenarioReferenceId:    'NONE',
                scenarioStepId:         'NONE',
                featureFilesLocation:   userContext.featureFilesLocation,
                designComponentType:    'NONE'
            };

            store.dispatch(setCurrentUserItemContext(context, true));

            return context;
        }

        // Not an error - just indicates no update needed
        return userContext;
    };

    // Gets the full details of a Design or Design Update item that relates to a Work Package item
    getDesignItem(componentId, wpType){

        switch(wpType){
            case WorkPackageType.WP_BASE:
                return DesignComponents.findOne({_id: componentId});
            case WorkPackageType.WP_UPDATE:
                return DesignUpdateComponents.findOne({_id: componentId});
            default:
                // Does not apply for non WP views as the current item IS the Design item.
                return null;
        }
    }

    // User clicks Add New Work Package in Work Packages list for a Design Version
    addNewWorkPackage(designVersionId, designUpdateId, designVersionStatus, workPackageType){

        // Validate - can only add WP to Draft Design Versions
        if(designVersionStatus === DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT) {
            Meteor.call('workPackage.addNewWorkPackage', designVersionId, designUpdateId, workPackageType);
            return true;
        } else {
            return false;
        }
    };

    // User saves an update to a Work Package name
    saveWorkPackageName(workPackageId, newName){
        Meteor.call('workPackage.updateWorkPackageName', workPackageId, newName);
        return true;
    }


    // User chose to edit a Work Package.
    editWorkPackage(userContext, workPackageToEditId, wpType){

        // Validation - any non-completed WPs can be edited
        const wp = WorkPackages.findOne({_id: workPackageToEditId});

        if(wp && (wp.workPackageStatus != WorkPackageStatus.WP_COMPLETE)){

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

        } else {
            // Edit not allowed
            //TODO Messaging
            return false;
        }
    };

    // User chose to view a WP
    viewWorkPackage(userContext, workPackageToViewId, wpType){

        // Validation - all WPs can be viewed
        const wp = WorkPackages.findOne({_id: workPackageToViewId});

        if(wp){

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

        } else {
            // No design update!
            //TODO Messaging
            return false;
        }
    };

    // User chose to publish a WP to make it available in draft form
    publishWorkPackage(workPackageToPublishId){

        // Validation - can only publish a new WP
        const wp = WorkPackages.findOne({_id: workPackageToPublishId});

        if(wp && (wp.workPackageStatus === WorkPackageStatus.WP_NEW)){

            // Ensure that the current WP is the WP we chose to publish
            // TODO

            // And update its status to published
            Meteor.call('workPackage.publishWorkPackage', workPackageToPublishId);

        } else {
            // Publish not allowed
            //TODO Messaging
            return false;
        }
    };

    developWorkPackage(userContext, wpToDevelopId){

        // Set the current context
        let updatedContext = this.setWorkPackage(userContext, wpToDevelopId);

        // Load dev data
        let loading = ClientContainerServices.getDevData();

        // Get the latest DEV data for the Mash
        ClientMashDataServices.createDevMashData(updatedContext);

        // Switch to Dev View
        store.dispatch(setCurrentView(ViewType.WORK_PACKAGE_WORK));
    }

    // User chose to delete a WP
    deleteWorkPackage(workPackageToDeleteId){

        // Validation - can only delete unpublished WPs
        const wp = WorkPackages.findOne({_id: workPackageToDeleteId});

        if(wp && (wp.workPackageStatus === WorkPackageStatus.WP_NEW)){

            // If the WP being deleted is the current one, set current WP to nothing
            // TODO

            // And now actually remove the WP
            Meteor.call('workPackage.removeWorkPackage', workPackageToDeleteId);

            return true;

        } else {
            // Delete not allowed
            //TODO Messaging
            return false;
        }
    };

    // User put an item in the scope view in or out of scope for a Work Package
    toggleInScope(view, context, wpComponent, newScope){

        // Validate - can only do this if editing a WP for the scope context
        if((view === ViewType.WORK_PACKAGE_BASE_EDIT || view === ViewType.WORK_PACKAGE_UPDATE_EDIT) && context === DisplayContext.WP_SCOPE){
            Meteor.call('workPackage.toggleScope', wpComponent, newScope);
            return true;
        } else {
            return false;
        }

    };

    // User opened or closed a WP component
    setOpenClosed(wpComponent, currentList, newState){

        if(wpComponent.componentType === ComponentType.FEATURE){
            // Open or close the whole feature
            const featureComponents = WorkPackageComponents.find(
                {
                    workPackageId: wpComponent.workPackageId,
                    componentFeatureReferenceId: wpComponent.componentFeatureReferenceId
                }
            );

            featureComponents.forEach((component) => {
                store.dispatch(setCurrentUserOpenWorkPackageItems(
                    Meteor.userId(),
                    currentList,
                    component._id,
                    newState
                ));
            });

        } else {

            if(newState) {
                // Just open or close the item
                store.dispatch(setCurrentUserOpenWorkPackageItems(
                    Meteor.userId(),
                    currentList,
                    wpComponent._id,
                    newState
                ));
            } else {
                // Close all items below
                this.closeChildren(wpComponent, currentList);
            }
        }

        return true;
    };

    // Recursive function to close all children down to the bottom of the tree
    closeChildren(wpComponent, currentList){

        let childComponents = DesignUpdateComponents.find(
            {
                workPackageId: wpComponent.workPackageId,
                componentParentReferenceId: wpComponent.componentReferenceId
            }
        );

        if(childComponents.count() > 0){
            childComponents.forEach((child) => {

                store.dispatch(setCurrentUserOpenWorkPackageItems(
                    Meteor.userId(),
                    currentList,
                    wpComponent._id,
                    false
                ));

                // Recursively call for these children
                this.closeChildren(child, currentList)


            });

            return true;

        } else {
            return false;
        }
    };

}

export default new ClientWorkPackageServices();
