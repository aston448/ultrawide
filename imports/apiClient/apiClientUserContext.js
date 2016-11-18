// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';

// Ultrawide Collections
import { UserCurrentEditContext }   from '../collections/context/user_current_edit_context.js';
import { UserCurrentViewOptions }   from '../collections/context/user_current_view_options.js';
import { UserRoles }                from '../collections/users/user_roles.js';
import { Designs }                  from '../collections/design/designs.js';
import { DesignVersions }           from '../collections/design/design_versions.js';
import { DesignUpdates }            from '../collections/design_update/design_updates.js';
import { WorkPackages }             from '../collections/work/work_packages.js';
import { DesignComponents }         from '../collections/design/design_components.js';
import { DesignUpdateComponents }   from '../collections/design_update/design_update_components.js';
import { WorkPackageComponents }    from '../collections/work/work_package_components.js';

// Ultrawide Services
import { RoleType, ViewType, ViewMode, DesignVersionStatus, DesignUpdateStatus, ComponentType, LocationType, LogLevel } from '../constants/constants.js';
import { log } from '../common/utils.js';
import ClientContainerServices from '../apiClient/apiClientContainerServices.js';

// REDUX services
import store from '../redux/store'
import {setCurrentView, changeApplicationMode, setCurrentRole, setCurrentUserName, setCurrentUserItemContext, setCurrentUserViewOptions, setCurrentUserOpenDesignItems, setCurrentUserOpenDesignUpdateItems, setCurrentUserOpenWorkPackageItems} from '../redux/actions'

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


    getInitialSelectionSettings(userId){


        // Get the stored context for the user
        // Get last known state from the DB
        const userContext = UserCurrentEditContext.findOne({userId: userId});
        const userViewOptions = UserCurrentViewOptions.findOne({userId: userId});

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


        // Plus for the actual open item context, open all the way down to that item
        log((msg) => console.log(msg), LogLevel.TRACE, "USER CONTEXT: Component: {}, DV: {}, DU: {}, WP: {}",
            userContext.designComponentId, userContext.designVersionId, userContext.designUpdateId, userContext.workPackageId);

        if(userContext.designComponentId != 'NONE') {
            // There is a current component...
            if (userContext.workPackageId != 'NONE') {
                // User is in a WP so drill down to that item...

                let wpComponent = WorkPackageComponents.findOne({
                    componentId: userContext.designComponentId
                });

                if(wpComponent.componentParentReferenceId === 'NONE'){
                    // No Parent, just make sure component is open
                    if(!wpArr.includes(wpComponent._id)) {
                        wpArr.push(wpComponent._id);
                    }
                } else {
                    // Get the parent
                    let wpParent = WorkPackageComponents.findOne({
                        componentReferenceId: wpComponent.componentParentReferenceId
                    });

                    // Keep going up until the parent is already open or top of tree
                    while(!wpArr.includes(wpParent._id) && wpParent.componentParentReferenceId != 'NONE'){
                        wpComponent = wpParent;

                        if(!wpArr.includes(wpComponent._id)) {
                            wpArr.push(wpComponent._id);
                        }

                        wpParent = WorkPackageComponents.findOne({
                            componentReferenceId: wpComponent.componentParentReferenceId
                        });
                    }
                }

            } else {
                if (userContext.designUpdateId != 'NONE') {
                    // Not in a WP but in a Design update so open to the DU component

                    let duComponent = DesignUpdateComponents.findOne({
                        _id: userContext.designComponentId
                    });

                    if(duComponent.componentParentIdNew === 'NONE'){
                        // No Parent, just make sure component is open
                        if(!duArr.includes(duComponent._id)) {
                            duArr.push(duComponent._id);
                        }
                    } else {
                        // Get the parent
                        let duParent = DesignUpdateComponents.findOne({
                            _id: duComponent.componentParentIdNew
                        });

                        // Keep going up until the parent is already open or top of tree
                        while(!duArr.includes(duParent._id) && duParent.componentParentIdNew != 'NONE'){
                            duComponent = duParent;

                            if(!duArr.includes(duComponent._id)) {
                                duArr.push(duComponent._id);
                            }

                            duParent = DesignUpdateComponents.findOne({
                                _id: duComponent.componentParentIdNew
                            });
                        }
                    }

                } else {
                    if (userContext.designVersionId != 'NONE') {
                        // Just in a DV so open that component

                        let dvComponent = DesignComponents.findOne({
                            _id: userContext.designComponentId
                        });

                        if(dvComponent.componentParentId === 'NONE'){
                            // No Parent, just make sure component is open
                            if(!dvArr.includes(dvComponent._id)) {
                                dvArr.push(dvComponent._id);
                            }
                        } else {
                            // Get the parent
                            let dvParent = DesignComponents.findOne({
                                _id: dvComponent.componentParentId
                            });

                            // Keep going up until the parent is already open or top of tree
                            while(!dvArr.includes(dvParent._id) && dvParent.componentParentId != 'NONE'){
                                dvComponent = dvParent;

                                if(!dvArr.includes(dvComponent._id)) {
                                    log((msg) => console.log(msg), LogLevel.TRACE, "USER CONTEXT: Opening {}", dvComponent.componentName);
                                    dvArr.push(dvComponent._id);
                                }

                                dvParent = DesignComponents.findOne({
                                    _id: dvComponent.componentParentId
                                });
                            }
                        }
                    }
                }
            }
        }

        store.dispatch(setCurrentUserOpenDesignItems(
            Meteor.userId(),
            dvArr,
            null,
            true
        ));

        store.dispatch(setCurrentUserOpenDesignUpdateItems(
            Meteor.userId(),
            duArr,
            null,
            true
        ));

        store.dispatch(setCurrentUserOpenWorkPackageItems(
            Meteor.userId(),
            wpArr,
            null,
            true
        ));

        // Set the saved user data into REDUX

        if(userContext){

            const context = {
                userId:                         userId,
                designId:                       userContext.designId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                workPackageId:                  userContext.workPackageId,
                designComponentId:              userContext.designComponentId,
                designComponentType:            userContext.designComponentType,
                featureReferenceId:             userContext.featureReferenceId,
                featureAspectReferenceId:       userContext.featureAspectReferenceId,
                scenarioReferenceId:            userContext.scenarioReferenceId,
                scenarioStepId:                 userContext.scenarioStepId,
                featureFilesLocation:           userContext.featureFilesLocation,
                acceptanceTestResultsLocation:  userContext.acceptanceTestResultsLocation,
                integrationTestResultsLocation: userContext.integrationTestResultsLocation,
                moduleTestResultsLocation:      userContext.moduleTestResultsLocation
            };

            store.dispatch(setCurrentUserItemContext(context, false));  // Don't save - we are reading from DB here!


        } else {
            // No context saved so default to nothing
            const emptyContext = {
                userId:                         userId,
                designId:                       'NONE',
                designVersionId:                'NONE',
                designUpdateId:                 'NONE',
                workPackageId:                  'NONE',
                designComponentId:              'NONE',
                designComponentType:            'NONE',
                featureReferenceId:             'NONE',
                featureAspectReferenceId:       'NONE',
                scenarioReferenceId:            'NONE',
                scenarioStepId:                 'NONE',
                featureFilesLocation:           'NONE',
                acceptanceTestResultsLocation:  'NONE',
                integrationTestResultsLocation: 'NONE',
                moduleTestResultsLocation:      'NONE',
            };

            store.dispatch(setCurrentUserItemContext(emptyContext, true));

        }

        if(userViewOptions){

            const viewOptions = {
                userId:                     userId,
                designDetailsVisible:       userViewOptions.designDetailsVisible,
                designAccTestsVisible:      userViewOptions.designAccTestsVisible,
                designIntTestsVisible:      userViewOptions.designIntTestsVisible,
                designModTestsVisible:      userViewOptions.designModTestsVisible,
                designDomainDictVisible:    userViewOptions.designDomainDictVisible,
                // Design Update Screen - Scope and Design always visible
                updateDetailsVisible:       userViewOptions.updateDetailsVisible,
                updateAccTestsVisible:      userViewOptions.updateAccTestsVisible,
                updateIntTestsVisible:      userViewOptions.updateIntTestsVisible,
                updateModTestsVisible:      userViewOptions.updateModTestsVisible,
                updateDomainDictVisible:    userViewOptions.updateDomainDictVisible,
                // Work package editor - Scope and Design always visible
                wpDetailsVisible:           userViewOptions.wpDetailsVisible,
                wpDomainDictVisible:        userViewOptions.wpDomainDictVisible,
                // Developer Screen - Design always visible
                devDetailsVisible:          userViewOptions.devDetailsVisible,
                devAccTestsVisible:         userViewOptions.devAccTestsVisible,
                devIntTestsVisible:         userViewOptions.devIntTestsVisible,
                devModTestsVisible:         userViewOptions.devModTestsVisible,
                devFeatureFilesVisible:     userViewOptions.devFeatureFilesVisible,
                devDomainDictVisible:       userViewOptions.devDomainDictVisible
            };

            store.dispatch(setCurrentUserViewOptions(viewOptions, false)); // Don't save - we are reading from DB here!

        } else {

            const defaultOptions = {
                userId:                     userId,
                designDetailsVisible:       true,
                designAccTestsVisible:      false,
                designIntTestsVisible:      false,
                designModTestsVisible:      false,
                designDomainDictVisible:    true,
                // Design Update Screen - Scope and Design always visible
                updateDetailsVisible:       true,
                updateAccTestsVisible:      false,
                updateIntTestsVisible:      false,
                updateModTestsVisible:      false,
                updateDomainDictVisible:    false,
                // Work package editor - Scope and Design always visible
                wpDetailsVisible:           true,
                wpDomainDictVisible:        false,
                // Developer Screen - Design always visible
                devDetailsVisible:          false,
                devAccTestsVisible:         true,
                devIntTestsVisible:         false,
                devModTestsVisible:         false,
                devFeatureFilesVisible:     true,
                devDomainDictVisible:       false
            };

            store.dispatch(setCurrentUserViewOptions(defaultOptions, true));
        }


    }

    updateContextFilePath(type, userContext, newPath){

        // Set to original values
        let newFeatureFilesLocation = userContext.featureFilesLocation;
        let newAcceptanceTestResultsLocation = userContext.acceptanceTestResultsLocation;
        let newIntegrationTestResultsLocation = userContext.integrationTestResultsLocation;
        let newModuleTestResultsLocation = userContext.moduleTestResultsLocation;

        // Then update the one that changed
        switch(type){
            case LocationType.LOCATION_FEATURE_FILES:
                newFeatureFilesLocation = newPath;
                break;
            case LocationType.LOCATION_ACCEPTANCE_TEST_OUTPUT:
                newAcceptanceTestResultsLocation = newPath;
                break;
            case LocationType.LOCATION_INTEGRATION_TEST_OUTPUT:
                newIntegrationTestResultsLocation = newPath;
                break;
            case LocationType.LOCATION_MODULE_TEST_OUTPUT:
                newModuleTestResultsLocation = newPath;
                break;
        }

        // And dispatch a new context
        const context = {
            userId:                         userContext.userId,
            designId:                       userContext.designId,
            designVersionId:                userContext.designVersionId,
            designUpdateId:                 userContext.designUpdateId,
            workPackageId:                  userContext.workPackageId,
            designComponentId:              userContext.designComponentId,
            designComponentType:            userContext.designComponentType,
            featureReferenceId:             userContext.featureReferenceId,
            featureAspectReferenceId:       userContext.featureAspectReferenceId,
            scenarioReferenceId:            userContext.scenarioReferenceId,
            scenarioStepId:                 userContext.scenarioStepId,
            featureFilesLocation:           newFeatureFilesLocation,
            acceptanceTestResultsLocation:  newAcceptanceTestResultsLocation,
            integrationTestResultsLocation: newIntegrationTestResultsLocation,
            moduleTestResultsLocation:      newModuleTestResultsLocation
        };

        store.dispatch(setCurrentUserItemContext(context, true));

    }

    setViewFromUserContext(role, userItemContext){

        // First set the chosen user role
        store.dispatch(setCurrentRole(role));

        // Decide where to go depending on the user context
        if(userItemContext){
            //console.log("CONTEXT: Design: " + userItemContext.designId);

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

                                        // Subscribe to Dev data as we'll need it for progress indications
                                        let loading = ClientContainerServices.getDevData();

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
            //console.log("NO LOGIN CONTEXT...");
            store.dispatch(setCurrentView(ViewType.SELECT));
        }

    };

    // Get readable details of the current user context
    getContextNameData(userContext){

        log((msg) => console.log(msg), LogLevel.TRACE, "Getting context name data...");

        let contextNameData = {
            design:             'NONE',
            designVersion:      'NONE',
            designUpdate:       'NONE',
            workPackage:        'NONE',
            application:        'NONE',
            designSection:      'NONE',
            feature:            'NONE',
            featureAspect:      'NONE',
            scenario:           'NONE'
        };

        if(userContext.designId != 'NONE'){
            contextNameData.design = Designs.findOne({_id: userContext.designId}).designName;
        }

        if(userContext.designVersionId != 'NONE'){
            contextNameData.designVersion = DesignVersions.findOne({_id: userContext.designVersionId}).designVersionName;
        }

        if(userContext.designUpdateId != 'NONE'){
            contextNameData.designUpdate = DesignUpdates.findOne({_id: userContext.designUpdateId}).updateName;
        }

        if(userContext.workPackageId != 'NONE'){
            contextNameData.workPackage = WorkPackages.findOne({_id: userContext.workPackageId}).workPackageName;
        }

        if(userContext.designComponentId != 'NONE'){
            switch(userContext.designComponentType){
                case ComponentType.APPLICATION:
                    if(userContext.designUpdateId === 'NONE'){
                        contextNameData.application = DesignComponents.findOne({_id: userContext.designComponentId}).componentName;
                    } else {
                        contextNameData.application = DesignUpdateComponents.findOne({_id: userContext.designComponentId}).componentNameNew;
                    }
                    break;
                case ComponentType.DESIGN_SECTION:
                    if(userContext.designUpdateId === 'NONE'){
                        contextNameData.designSection = DesignComponents.findOne({_id: userContext.designComponentId}).componentName;
                    } else {
                        contextNameData.designSection = DesignUpdateComponents.findOne({_id: userContext.designComponentId}).componentNameNew;
                    }
                    contextNameData.application = this.getParent(ComponentType.APPLICATION, userContext);
                    break;
                case ComponentType.FEATURE:
                    if(userContext.designUpdateId === 'NONE'){
                        contextNameData.feature = DesignComponents.findOne({_id: userContext.designComponentId}).componentName;
                    } else {
                        contextNameData.feature = DesignUpdateComponents.findOne({_id: userContext.designComponentId}).componentNameNew;
                    }
                    contextNameData.application = this.getParent(ComponentType.APPLICATION, userContext);
                    contextNameData.designSection = this.getParent(ComponentType.DESIGN_SECTION, userContext);
                    break;
                case ComponentType.FEATURE_ASPECT:
                    if(userContext.designUpdateId === 'NONE'){
                        contextNameData.featureAspect = DesignComponents.findOne({_id: userContext.designComponentId}).componentName;
                    } else {
                        contextNameData.featureAspect = DesignUpdateComponents.findOne({_id: userContext.designComponentId}).componentNameNew;
                    }
                    contextNameData.application = this.getParent(ComponentType.APPLICATION, userContext);
                    contextNameData.designSection = this.getParent(ComponentType.DESIGN_SECTION, userContext);
                    contextNameData.feature = this.getParent(ComponentType.FEATURE, userContext);
                    break;
                case ComponentType.SCENARIO:
                    if(userContext.designUpdateId === 'NONE'){
                        contextNameData.scenario = DesignComponents.findOne({_id: userContext.designComponentId}).componentName;
                    } else {
                        contextNameData.scenario = DesignUpdateComponents.findOne({_id: userContext.designComponentId}).componentNameNew;
                    }
                    contextNameData.application = this.getParent(ComponentType.APPLICATION, userContext);
                    contextNameData.designSection = this.getParent(ComponentType.DESIGN_SECTION, userContext);
                    contextNameData.feature = this.getParent(ComponentType.FEATURE, userContext);
                    contextNameData.featureAspect = this.getParent(ComponentType.FEATURE_ASPECT, userContext);
                    break;
            }
        }

        log((msg) => console.log(msg), LogLevel.TRACE, "Returning {}", contextNameData);

        return contextNameData;

    };

    getParent(parentType, context){

        let currentItemType = context.designComponentType;
        let currentItemId= context.designComponentId;

        log((msg) => console.log(msg), LogLevel.TRACE, "Looking for parent of type {} for component {} ", parentType, currentItemId);

        if(context.designUpdateId === 'NONE'){

            let currentItem = DesignComponents.findOne({_id: currentItemId});
            let parentItem = DesignComponents.findOne({_id: currentItem.componentParentId});

            log((msg) => console.log(msg), LogLevel.TRACE, "Immediate parent is type {}", parentItem.componentType);

            while((parentItem.componentType != parentType) && (currentItem.componentParentId != 'NONE')){
                currentItem = parentItem;
                parentItem = DesignComponents.findOne({_id: currentItem.componentParentId});

                log((msg) => console.log(msg), LogLevel.TRACE, "Next parent is type {}", parentItem.componentType);
            }

            return parentItem.componentName;

        } else {
            let currentUpdateItem = DesignUpdateComponents.findOne({_id: currentItemId});
            let parentUpdateItem = DesignUpdateComponents.findOne({_id: currentUpdateItem.componentParentIdNew});

            while((parentUpdateItem.componentType != parentType) && (currentUpdateItem.componentParentIdNew != 'NONE')){
                currentUpdateItem = parentUpdateItem;
                parentUpdateItem = DesignUpdateComponents.findOne({_id: currentUpdateItem.componentParentIdNew});
            }

            return parentUpdateItem.componentName;
        }
    }

}

export default new ClientUserContextServices();