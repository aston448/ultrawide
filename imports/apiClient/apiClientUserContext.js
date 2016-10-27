// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections
import { UserCurrentEditContext } from '../collections/context/user_current_edit_context.js';
import { UserCurrentDevContext } from '../collections/context/user_current_dev_context.js';
import { UserCurrentDevUpdates } from '../collections/design_update/user_current_dev_updates.js';
import { UserRoles } from '../collections/users/user_roles.js';
import { DesignVersions } from '../collections/design/design_versions.js';
import { DesignUpdates } from '../collections/design_update/design_updates.js';
import { DesignComponents } from '../collections/design/design_components.js';
import { DesignUpdateComponents } from '../collections/design_update/design_update_components.js';
import { WorkPackageComponents } from '../collections/work/work_package_components.js';

// Ultrawide Services
import { RoleType, ViewType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType } from '../constants/constants.js';

// REDUX services
import store from '../redux/store'
import {setCurrentView, changeApplicationMode, setCurrentRole, setCurrentUserName, setCurrentUserItemContext, setCurrentUserDevContext, setCurrentUserOpenDesignItems, setCurrentUserOpenDesignUpdateItems, setCurrentUserOpenWorkPackageItems} from '../redux/actions'

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client User Context Services - Supports client calls for actions relating to User Context - current item, dev context
//
// This class is the test entry point when not testing through the GUI.
// Most functions validate and return true / false according to business rules even if there is implicit validation in the GUI
// (E.g. buttons not being visible if action invalid)
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientUserContextServices {


    setInitialSelectionSettings(role, userId){
        // TODO pass in proper user

        // What role has logged in?  Set global state.
        store.dispatch(setCurrentRole(role));


        // Set the user name
        const userData = UserRoles.findOne({userId: userId});

        if(userData){
            store.dispatch(setCurrentUserName(userData.displayName));
        }

        // Get the stored context for the user
        // Get last known state from the DB
        let userContext = null;
        let userDevContext = null;
        let userDevUpdates = null;
        let userDevUpdatesArr = [];

        switch(role){
            case RoleType.DESIGNER:
            case RoleType.MANAGER:
                userContext = UserCurrentEditContext.findOne({userId: userId});
                break;
            case RoleType.DEVELOPER:
                userContext = UserCurrentEditContext.findOne({userId: userId});
                break;
        }

        // Set default view settings for open items
        // TODO - could get persisted settings here

        // Set all Applications and Design Sections to be open for all Design Versions, Design Updates and Work Packages

        // All Design Versions
        const designVersionOpenComponents = DesignComponents.find(
            {
                componentType: {$in:[ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]},

            },
            {fields: {_id: 1}}
        );

        let dvArr = [];
        designVersionOpenComponents.forEach((component) => {
            dvArr.push(component._id);
        });

        store.dispatch(setCurrentUserOpenDesignItems(
            Meteor.userId(),
            dvArr,
            null,
            true
        ));


        // All Design Updates
        const designUpdateOpenComponents = DesignUpdateComponents.find(
            {
                componentType: {$in:[ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]}
            },
            {fields: {_id: 1}}
        );

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


        // All Work Packages
        const workPackageOpenComponents = WorkPackageComponents.find(
            {
                componentType: {$in:[ComponentType.APPLICATION, ComponentType.DESIGN_SECTION]}
            },
            {fields: {_id: 1}}
        );

        let wpArr = [];
        workPackageOpenComponents.forEach((component) => {
            wpArr.push(component._id);
        });

        store.dispatch(setCurrentUserOpenWorkPackageItems(
            Meteor.userId(),
            wpArr,
            null,
            true
        ));



        // Set the saved user data into REDUX
        const root = process.env.PWD;

        if(userContext){

            const context = {
                userId:                 userId,
                designId:               userContext.designId,
                designVersionId:        userContext.designVersionId,
                designUpdateId:         userContext.designUpdateId,
                workPackageId:          userContext.workPackageId,
                designComponentId:      userContext.designComponentId,
                featureReferenceId:     userContext.featureReferenceId,
                scenarioReferenceId:    userContext.scenarioReferenceId,
                scenarioStepId:         userContext.scenarioStepId,
                featureFilesLocation:   root + '/tests/features/',                //userContext.featureFilesLocation,
                designComponentType:    userContext.designComponentType
            };

            store.dispatch(setCurrentUserItemContext(context, false));  // Don't save - we are reading from DB here!

            return userContext;

        } else {
            // No context saved so default to nothing
            const emptyContext = {
                userId:                 userId,
                designId:               'NONE',
                designVersionId:        'NONE',
                designUpdateId:         'NONE',
                workPackageId:          'NONE',
                designComponentId:      'NONE',
                featureReferenceId:     'NONE',
                scenarioReferenceId:    'NONE',
                scenarioStepId:         'NONE',
                featureFilesLocation:   root + '/tests/features/',
                designComponentType:    'NONE'
            };

            store.dispatch(setCurrentUserItemContext(emptyContext, false)); // Don't save - we are reading from DB here!

            return emptyContext;
        }


    }

    setViewFromUserContext(role, userItemContext){

        // Decide where to go depending on the user context
        if(userItemContext){
            console.log("LOGIN CONTEXT: Design: " + userItemContext.designId);

            switch(role){
                case RoleType.DESIGNER:
                    // If no design, go to the Designs screen
                    if(userItemContext.designId != 'NONE') {
                        // If a designer, go to the design version that is in the context.  If its new, editing it.
                        // If published and an update is new / draft go to update
                        // If final go to view
                        if (userItemContext.designVersionId != 'NONE') {
                            // See what status the design version has
                            const designVersion = DesignVersions.findOne({_id: userItemContext.designVersionId});

                            // Just in case stored data is out of date for some reason, back to select if not found
                            if (designVersion) {
                                switch (designVersion.designVersionStatus) {
                                    case DesignVersionStatus.VERSION_NEW:
                                        // Straight to edit of new update
                                        store.dispatch(setCurrentView(ViewType.DESIGN_NEW_EDIT));
                                        store.dispatch(changeApplicationMode(ViewMode.MODE_EDIT));
                                        return;
                                    case DesignVersionStatus.VERSION_PUBLISHED_DRAFT:
                                        // If there is an update in the context go to that otherwise go to selection
                                        if (userItemContext.designUpdateId) {
                                            // See what the status of this update is - is it editable?
                                            const designUpdate = DesignUpdates.findOne({_id: userItemContext.designUpdateId});

                                            // Just in case stored data is out of date for some reason, back to select if not found
                                            if (designUpdate) {
                                                switch (designUpdate.updateStatus) {
                                                    case DesignUpdateStatus.UPDATE_NEW:
                                                        // Go to edit update in Edit Mode
                                                        store.dispatch(setCurrentView(ViewType.DESIGN_UPDATE_EDIT));
                                                        store.dispatch(changeApplicationMode(ViewMode.MODE_EDIT));
                                                        return;
                                                    case DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT:
                                                        // Go to edit update in View Mode.  If user wants to edit can toggle in to edit mode
                                                        store.dispatch(setCurrentView(ViewType.DESIGN_UPDATE_EDIT));
                                                        store.dispatch(changeApplicationMode(ViewMode.MODE_VIEW));
                                                        return;
                                                    default:
                                                        // Anything else, just view the update
                                                        store.dispatch(setCurrentView(ViewType.DESIGN_UPDATE_VIEW));
                                                        return;
                                                }
                                            } else {
                                                // No update selected
                                                store.dispatch(setCurrentView(ViewType.SELECT));
                                                return;
                                            }
                                        } else {
                                            store.dispatch(setCurrentView(ViewType.SELECT));
                                            return;

                                        }
                                    case DesignVersionStatus.VERSION_PUBLISHED_FINAL:
                                        // View that final design version
                                        store.dispatch(setCurrentView(ViewType.DESIGN_PUBLISHED_VIEW));
                                        return;
                                }
                            } else {
                                // No Design Version found
                                store.dispatch(setCurrentView(ViewType.SELECT));
                                return;
                            }
                        } else {
                            // No Design Version selected - go to select screen
                            store.dispatch(setCurrentView(ViewType.SELECT));
                            return;
                        }
                    } else {
                        // No Design  selected - go to Designs screen
                        store.dispatch(setCurrentView(ViewType.DESIGNS));
                        return;
                    }
                    break;
                case RoleType.DEVELOPER:
                    // If a developer go to the thing they are currently working on if it is set
                    // Otherwise go to designs
                    store.dispatch(setCurrentView(ViewType.DESIGNS));
                    return;
                case RoleType.MANAGER:
                    //TODO Decide what Manager should see
                    store.dispatch(setCurrentView(ViewType.DESIGNS));
                    return;
            }


        } else {
            console.log("NO LOGIN CONTEXT...");
            store.dispatch(setCurrentView(ViewType.SELECT));
        }

    }

}

export default new ClientUserContextServices();