// == IMPORTS ==========================================================================================================

// Ultrawide Services
import { RoleType, ViewType, DesignVersionStatus, DesignUpdateStatus, ComponentType, LogLevel, WorkPackageStatus, WorkPackageType, DisplayContext, HomePageTab } from '../constants/constants.js';
import { log }                          from '../common/utils.js';
import { TextLookups }                      from '../common/lookups.js'

import { ClientDesignVersionServices }      from '../apiClient/apiClientDesignVersion.js';
import { ClientDesignUpdateServices }       from '../apiClient/apiClientDesignUpdate.js';
import { ClientWorkPackageServices }        from '../apiClient/apiClientWorkPackage.js';
import { ClientAppHeaderServices }          from '../apiClient/apiClientAppHeader.js';

// Data Access
import { DesignData }                       from '../data/design/design_db.js';
import { DesignVersionData }                from '../data/design/design_version_db.js';
import { DesignUpdateData }                 from '../data/design_update/design_update_db.js';
import { WorkPackageData }                  from '../data/work/work_package_db.js';
import { DesignComponentData }              from '../data/design/design_component_db.js';
import { DesignUpdateComponentData }        from '../data/design_update/design_update_component_db.js';
import { UserViewOptionData }               from '../data/context/user_view_option_db.js';
import { UserContextData }                  from '../data/context/user_context_db.js';
import { UserRoleData }                     from '../data/users/user_role_db.js';

// REDUX services
import store from '../redux/store'
import {
    setCurrentView, setCurrentRole, setCurrentUserItemContext, setCurrentUserViewOptions,
    setCurrentUserOpenDesignItems, setCurrentUserOpenDesignUpdateItems,
    setCurrentUserOpenWorkPackageItems, updateOpenItemsFlag,
    setCurrentUserHomeTab
} from '../redux/actions'



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

class ClientUserContextServicesClass {

    getUserContext(userId){

        const userContext = UserContextData.getUserContext(userId);

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
                scenarioStepId:                 userContext.scenarioStepId
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
                scenarioStepId:                 'NONE'
            };

            store.dispatch(setCurrentUserItemContext(emptyContext, true));

        }

        return userContext;

    };

    getUserViewOptions(userId){

        const userViewOptions = UserViewOptionData.getUserViewOptions(userId);

        if(userViewOptions){

            const viewOptions = {
                designDetailsVisible:       userViewOptions.designDetailsVisible,
                designDomainDictVisible:    userViewOptions.designDomainDictVisible,
                testSummaryVisible:         userViewOptions.testSummaryVisible,
                updateProgressVisible:      userViewOptions.updateProgressVisible,
                updateSummaryVisible:       userViewOptions.updateSummaryVisible,
                devAccTestsVisible:         userViewOptions.devAccTestsVisible,
                devIntTestsVisible:         userViewOptions.devIntTestsVisible,
                devUnitTestsVisible:        userViewOptions.devUnitTestsVisible,
                devFeatureFilesVisible:     userViewOptions.devFeatureFilesVisible,
                designShowAllAsTabs:        userViewOptions.designShowAllAsTabs,
                updateShowAllAsTabs:        userViewOptions.updateShowAllAsTabs,
                workShowAllAsTabs:          userViewOptions.workShowAllAsTabs,
            };

            store.dispatch(setCurrentUserViewOptions(viewOptions, userId, false)); // Don't save - we are reading from DB here!

        } else {

            const defaultOptions = {
                designDetailsVisible:       true,
                designDomainDictVisible:    false,
                testSummaryVisible:         false,
                updateProgressVisible:      false,
                updateSummaryVisible:       true,
                devAccTestsVisible:         false,
                devIntTestsVisible:         false,
                devUnitTestsVisible:        false,
                devFeatureFilesVisible:     false,
                designShowAllAsTabs:        false,
                updateShowAllAsTabs:        false,
                workShowAllAsTabs:          false,
            };

            store.dispatch(setCurrentUserViewOptions(defaultOptions, userId, true));
        }

        return userViewOptions;
    }

    setUserRole(userId, roleType){

        //console.log('Setting user role to ' + roleType);

        store.dispatch(setCurrentRole(userId, roleType));

    }


    setOpenDesignVersionItems(userContext){

        // Set default view settings for open items
        let dvArr = [];

        try {

            // Set all Applications and Design Sections to be open for all Design Versions, Design Updates and Work Packages

            dvArr = ClientAppHeaderServices.getDesignVersionSections(userContext);

            // // Plus for the actual open item context, open the FEATURE that the item is in and select it as the current item
            // log((msg) => console.log(msg), LogLevel.TRACE, "USER CONTEXT: Component: {}, DV: {}, DU: {}, WP: {}",
            //     userContext.designComponentId, userContext.designVersionId, userContext.designUpdateId, userContext.workPackageId);
            //
            // if (userContext.designComponentId !== 'NONE') {
            //
            //     // There is a current component...
            //     if (userContext.designVersionId !== 'NONE') {
            //
            //         let dvComponent = DesignVersionComponents.findOne({
            //             _id: userContext.designComponentId
            //         });
            //
            //         if(dvComponent) {
            //
            //             switch(dvComponent.componentType){
            //
            //                 case ComponentType.APPLICATION:
            //                 case ComponentType.DESIGN_SECTION:
            //                     // Already open
            //                     break;
            //                 case ComponentType.FEATURE:
            //                     // Open it and all stuff below
            //                     dvArr = ClientDesignComponentServices.setOpenClosed(dvComponent, dvArr, true);
            //                     break;
            //                 default:
            //                     // Anything else is below a Feature so open the Feature and select that
            //                     const dvFeatureComponent = DesignVersionComponents.findOne({
            //                         designVersionId:        dvComponent.designVersionId,
            //                         componentReferenceId:   dvComponent.componentFeatureReferenceIdNew
            //                     });
            //
            //                     if(dvFeatureComponent){
            //                         // Reset user context
            //                         userContext.designComponentId = dvFeatureComponent._id;
            //                         userContext.designComponentType = ComponentType.FEATURE;
            //                         userContext.featureReferenceId = dvFeatureComponent.componentReferenceId;
            //                         userContext.featureAspectReferenceId = 'NONE';
            //                         userContext.scenarioReferenceId = 'NONE';
            //                         userContext.scenarioStepId = 'NONE';
            //
            //                         store.dispatch(setCurrentUserItemContext(userContext, true));
            //
            //                         // Open the feature
            //                         dvArr = ClientDesignComponentServices.setOpenClosed(dvFeatureComponent, dvArr, true);
            //                     }
            //             }
            //         }
            //     }
            // }
        }
        catch(e){
            log((msg) => console.log(msg), LogLevel.ERROR, "ERROR Loading open DV item settings: {}", e);
        }

        store.dispatch(setCurrentUserOpenDesignItems(
            dvArr,
            null,
            null
        ));

        store.dispatch((updateOpenItemsFlag(null)));

        // Return latest user context
        return store.getState().currentUserItemContext;
    }

    setOpenDesignUpdateItems(userContext){

        // Set default view settings for open items
        let duArr = [];

        try {

            // Open to feature level by default
            duArr = ClientAppHeaderServices.getDesignUpdateFeatures(userContext);

            // // Plus for the actual open item context, open the FEATURE that the item is in and select it as the current item
            // log((msg) => console.log(msg), LogLevel.TRACE, "USER CONTEXT: Component: {}, DV: {}, DU: {}, WP: {}",
            //     userContext.designComponentId, userContext.designVersionId, userContext.designUpdateId, userContext.workPackageId);
            //
            // if (userContext.designComponentId !== 'NONE') {
            //
            //     // There is a current component...
            //     if (userContext.designUpdateId !== 'NONE') {
            //
            //         // In a Design update so open to the DU component
            //
            //         let duComponent = DesignUpdateComponents.findOne({
            //             _id: userContext.designComponentId
            //         });
            //
            //         //console.log("Opening design update component " + duComponent.componentNameNew);
            //
            //         if(duComponent && duComponent.scopeType === UpdateScopeType.SCOPE_IN_SCOPE) {
            //
            //             switch(duComponent.componentType){
            //
            //                 case ComponentType.APPLICATION:
            //                 case ComponentType.DESIGN_SECTION:
            //                     // Already open
            //                     break;
            //                 case ComponentType.FEATURE:
            //                     // Open it and all stuff below
            //                     duArr = ClientDesignUpdateComponentServices.setOpenClosed(duComponent, duArr, true);
            //                     break;
            //                 default:
            //                     // Anything else is below a Feature so open the Feature and select that
            //                     const duFeatureComponent = DesignUpdateComponents.findOne({
            //                         designUpdateId:         duComponent.designUpdateId,
            //                         componentReferenceId:   duComponent.componentFeatureReferenceIdNew
            //                     });
            //
            //                     if(duFeatureComponent){
            //                         // Reset user context
            //                         userContext.designComponentId = duFeatureComponent._id;
            //                         userContext.designComponentType = ComponentType.FEATURE;
            //                         userContext.featureReferenceId = duFeatureComponent.componentReferenceId;
            //                         userContext.featureAspectReferenceId = 'NONE';
            //                         userContext.scenarioReferenceId = 'NONE';
            //                         userContext.scenarioStepId = 'NONE';
            //
            //                         store.dispatch(setCurrentUserItemContext(userContext, true));
            //
            //                         // Open the feature
            //                         duArr = ClientDesignUpdateComponentServices.setOpenClosed(duFeatureComponent, duArr, true);
            //                     }
            //             }
            //
            //         }
            //
            //     }
            // }
        }
        catch(e){
            log((msg) => console.log(msg), LogLevel.ERROR, "ERROR Loading open DU item settings: {}", e);
        }

        store.dispatch(setCurrentUserOpenDesignUpdateItems(
            duArr,
            null,
            null
        ));

        store.dispatch((updateOpenItemsFlag(null)));

        // Return latest user context
        return store.getState().currentUserItemContext;
    }

    setOpenWorkPackageItems(userContext){

        // Set default view settings for open WP items

        let wpArr = [];

        try {

            // Work Packages - open items down to Feature Level
            wpArr = ClientAppHeaderServices.getWorkPackageFeatures(userContext);

            // Plus for the actual open item context, open all the way down to that item
            log((msg) => console.log(msg), LogLevel.TRACE, "USER CONTEXT: Component: {}, DV: {}, DU: {}, WP: {}",
                userContext.designComponentId, userContext.designVersionId, userContext.designUpdateId, userContext.workPackageId);

        }
        catch(e){
            log((msg) => console.log(msg), LogLevel.ERROR, "ERROR Loading open item settings: {}", e);
        }

        store.dispatch(setCurrentUserOpenWorkPackageItems(
            wpArr,
            null,
            null
        ));

        store.dispatch((updateOpenItemsFlag(null)));

        // Return latest user context
        return store.getState().currentUserItemContext;
    }


    setViewFromUserContext(userContext, userRole, testIntegrationDataContext, testDataFlag){

        const userViewOptions = UserViewOptionData.getUserViewOptions(userContext.userId);

        // If no design / design version selected go to Designs tab in Home screen
        if(userContext.designId === 'NONE' || userContext.designVersionId === 'NONE'){
            store.dispatch(setCurrentUserHomeTab(HomePageTab.TAB_DESIGNS));
            store.dispatch(setCurrentView(ViewType.SELECT));
            return;
        }

        // Decide where to go depending on the user context
        switch(userRole){
            case RoleType.DESIGNER:

                // If a designer, go to the design version that is in the context.  If its new, editing it.
                // If published and an update is new / draft go to update
                // If final go to view

                // See what status the design version has
                const designVersion = DesignVersionData.getDesignVersionById(userContext.designVersionId);

                // Just in case stored data is out of date for some reason, back to Designs if not found
                if (designVersion) {
                    switch (designVersion.designVersionStatus) {
                        case DesignVersionStatus.VERSION_NEW:
                        case DesignVersionStatus.VERSION_DRAFT:

                            // Straight to edit of new update - set mash data stale so test data loaded if Test Summary is showing
                            if(userContext.designComponentId !== 'NONE'){
                                ClientDesignVersionServices.editDesignVersion(userRole, userContext, userContext.designVersionId);
                            } else {
                                store.dispatch(setCurrentView(ViewType.SELECT));
                            }
                            return;

                        case DesignVersionStatus.VERSION_UPDATABLE:

                            // If there is an update in the context go to that otherwise go to selection
                            if (userContext.designUpdateId !== 'NONE') {

                                // See what the status of this update is - is it editable?
                                const designUpdate = DesignUpdateData.getDesignUpdateById(userContext.designUpdateId);

                                // Just in case stored data is out of date for some reason, back to select if not found
                                if (designUpdate) {
                                    switch (designUpdate.updateStatus) {
                                        case DesignUpdateStatus.UPDATE_NEW:
                                        case DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT:

                                            // Go to edit update in Edit Mode
                                            if(userContext.designComponentId !== 'NONE') {
                                                ClientDesignUpdateServices.editDesignUpdate(userRole, userContext, userViewOptions, userContext.designUpdateId);
                                            } else {
                                                store.dispatch(setCurrentView(ViewType.SELECT));
                                            }
                                            return;

                                        default:
                                            // Anything else, just view the update - here there could be a test summary
                                            if(userContext.designComponentId !== 'NONE') {
                                                ClientDesignUpdateServices.viewDesignUpdate(userRole, userContext, userViewOptions, userContext.designUpdateId, testDataFlag, testIntegrationDataContext);
                                            } else {
                                                store.dispatch(setCurrentView(ViewType.SELECT));
                                            }
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
                        case DesignVersionStatus.VERSION_DRAFT_COMPLETE:
                        case DesignVersionStatus.VERSION_UPDATABLE_COMPLETE:

                            // View that final design version if user had selected something in it
                            if(userContext.designComponentId !== 'NONE') {
                                ClientDesignVersionServices.viewDesignVersion(userRole, userContext, userContext.designVersionId);
                            } else {
                                store.dispatch(setCurrentView(ViewType.SELECT));
                            }
                            return;
                    }
                } else {
                    // No Design Version found
                    store.dispatch(setCurrentUserHomeTab(HomePageTab.TAB_DESIGNS));
                    store.dispatch(setCurrentView(ViewType.SELECT));
                    return;
                }

                break;
            case RoleType.DEVELOPER:
                // If a developer go to the Work Package they are currently working on if it is set

                log((msg) => console.log(msg), LogLevel.TRACE, "Developer Context WP is {}", userContext.workPackageId);

                if(userContext.workPackageId !== 'NONE'){

                    const workPackage = WorkPackageData.getWorkPackageById(userContext.workPackageId);

                    // If bad data return to Designs
                    if(workPackage){
                        switch(workPackage.workPackageStatus){
                            case WorkPackageStatus.WP_ADOPTED:

                                // Development

                                // If a Design Component is selected then we are IN the work package...
                                if(userContext.designComponentId !== 'NONE') {
                                    ClientWorkPackageServices.developWorkPackage(userRole, userContext, userContext.workPackageId);
                                } else {
                                    // Just go to WP selection
                                    store.dispatch(setCurrentView(ViewType.SELECT));
                                }
                                return;

                            case WorkPackageStatus.WP_AVAILABLE:
                            case WorkPackageStatus.WP_NEW:

                                // Anything else, allow developer to select a WP
                                store.dispatch(setCurrentView(ViewType.SELECT));
                                return;
                        }
                    } else {
                        log((msg) => console.log(msg), LogLevel.TRACE, "WP Not Found!");
                        store.dispatch(setCurrentView(ViewType.SELECT));
                        return;
                    }
                } else {
                    store.dispatch(setCurrentView(ViewType.SELECT));
                    return;
                }
                return;
            case RoleType.MANAGER:
                // If a manager go to a WP if being edited
                if(userContext.workPackageId !== 'NONE'){

                    const workPackage = WorkPackageData.getWorkPackageById(userContext.workPackageId);

                    // If bad data return to Selection
                    if(workPackage){
                        switch(workPackage.workPackageStatus){

                            case WorkPackageStatus.WP_NEW:
                            case WorkPackageStatus.WP_AVAILABLE:
                            case WorkPackageStatus.WP_ADOPTED:

                                // New or Development so still editable
                                switch(workPackage.workPackageType){
                                    case WorkPackageType.WP_BASE:
                                        if(userContext.designComponentId !== 'NONE') {
                                            ClientWorkPackageServices.editWorkPackage(userRole, userContext, userContext.workPackageId, WorkPackageType.WP_BASE);
                                        } else {
                                            store.dispatch(setCurrentView(ViewType.SELECT));
                                        }
                                        return;

                                    case WorkPackageType.WP_UPDATE:
                                        if(userContext.designComponentId !== 'NONE') {
                                            ClientWorkPackageServices.editWorkPackage(userRole, userContext, userContext.workPackageId, WorkPackageType.WP_UPDATE);
                                        } else {
                                            store.dispatch(setCurrentView(ViewType.SELECT));
                                        }
                                        return;
                                }
                                break;
                        }
                    } else {
                        store.dispatch(setCurrentView(ViewType.SELECT));
                        return;
                    }
                } else {
                    store.dispatch(setCurrentView(ViewType.SELECT));
                    return;
                }
                return;
        }


    };


    // Get readable details of the current user context
    getContextNameData(userContext, displayContext){

        log((msg) => console.log(msg), LogLevel.TRACE, "Getting context name data...");

        let contextNameData = {
            design:             'NONE',
            designVersion:      'NONE',
            designUpdate:       'NONE',
            designUpdateRef:    'NONE',
            designUpdateAction: 'NONE',
            workPackage:        'NONE',
            application:        'NONE',
            designSection:      'NONE',
            feature:            'NONE',
            featureAspect:      'NONE',
            scenario:           'NONE'
        };

        if(userContext.designId !== 'NONE'){

            const design = DesignData.getDesignById(userContext.designId);

            if(design){
                contextNameData.design = design.designName;
            }
        }

        if(userContext.designVersionId !== 'NONE'){

            const designVersion = DesignVersionData.getDesignVersionById(userContext.designVersionId);

            if(designVersion) {
                contextNameData.designVersion = designVersion.designVersionName;
            }
        }

        if(userContext.designUpdateId !== 'NONE'){

            const designUpdate = DesignUpdateData.getDesignUpdateById(userContext.designUpdateId);

            if(designUpdate) {
                contextNameData.designUpdate = designUpdate.updateName;
                contextNameData.designUpdateRef = designUpdate.updateReference;
                contextNameData.designUpdateAction = TextLookups.updateMergeActions(designUpdate.updateMergeAction);
            }
        }

        if(userContext.workPackageId !== 'NONE'){

            const workPackage = WorkPackageData.getWorkPackageById(userContext.workPackageId);

            if(workPackage) {
                contextNameData.workPackage = workPackage.workPackageName;
            }
        }

        // After here is is possible that the data is not yet subscribed to so skip if not
        if(store.getState().designVersionDataLoaded) {

            if (userContext.designComponentId !== 'NONE') {

                let component = null;
                let componentName = '';

                if (userContext.designUpdateId === 'NONE' || displayContext === DisplayContext.UPDATE_SCOPE) {
                    component = DesignComponentData.getDesignComponentById(userContext.designComponentId);

                    if(component){
                        componentName = component.componentNameNew;
                    }
                } else {
                    component = DesignUpdateComponentData.getUpdateComponentById(userContext.designComponentId);

                    if(component){
                        componentName = component.componentNameNew;
                    }
                }

                if(component) {

                    switch (userContext.designComponentType) {
                        case ComponentType.APPLICATION:

                            contextNameData.application = componentName;
                            break;

                        case ComponentType.DESIGN_SECTION:

                            contextNameData.designSection = componentName;
                            contextNameData.application = this.getParent(ComponentType.APPLICATION, userContext, displayContext);
                            break;

                        case ComponentType.FEATURE:

                            contextNameData.feature = componentName;
                            contextNameData.application = this.getParent(ComponentType.APPLICATION, userContext, displayContext);
                            contextNameData.designSection = this.getParent(ComponentType.DESIGN_SECTION, userContext, displayContext);
                            break;

                        case ComponentType.FEATURE_ASPECT:

                            contextNameData.featureAspect = componentName;
                            contextNameData.application = this.getParent(ComponentType.APPLICATION, userContext, displayContext);
                            contextNameData.designSection = this.getParent(ComponentType.DESIGN_SECTION, userContext, displayContext);
                            contextNameData.feature = this.getParent(ComponentType.FEATURE, userContext, displayContext);
                            break;

                        case ComponentType.SCENARIO:

                            contextNameData.scenario = componentName;
                            contextNameData.application = this.getParent(ComponentType.APPLICATION, userContext, displayContext);
                            contextNameData.designSection = this.getParent(ComponentType.DESIGN_SECTION, userContext, displayContext);
                            contextNameData.feature = this.getParent(ComponentType.FEATURE, userContext, displayContext);
                            contextNameData.featureAspect = this.getParent(ComponentType.FEATURE_ASPECT, userContext, displayContext);
                            break;
                    }
                }
            }
        }

        log((msg) => console.log(msg), LogLevel.TRACE, "Returning {}", contextNameData);

        return contextNameData;
    };

    getParent(parentType, userContext, displayContext){

        if(userContext.designComponentId !== 'NONE') {

            let currentItemType = userContext.designComponentType;
            let currentItemId = userContext.designComponentId;

            log((msg) => console.log(msg), LogLevel.TRACE, "Looking for parent of type {} for component {} ", parentType, currentItemId);

            if (userContext.designUpdateId === 'NONE' || displayContext === DisplayContext.UPDATE_SCOPE) {

                let currentItem = DesignComponentData.getDesignComponentById(currentItemId);

                if(currentItem) {
                    let parentItem = DesignComponentData.getDesignComponentByRef(currentItem.designVersionId, currentItem.componentParentReferenceIdNew);

                    log((msg) => console.log(msg), LogLevel.TRACE, "Immediate parent is type {}", parentItem.componentType);

                    while (parentItem && (parentItem.componentType !== parentType) && (currentItem.componentParentReferenceIdNew !== 'NONE')) {
                        currentItem = parentItem;
                        parentItem = DesignComponentData.getDesignComponentByRef(currentItem.designVersionId, currentItem.componentParentReferenceIdNew);

                        if (parentItem) {
                            log((msg) => console.log(msg), LogLevel.TRACE, "Next parent is type {}", parentItem.componentType);
                        } else {
                            log((msg) => console.log(msg), LogLevel.TRACE, "No more parents");
                        }
                    }

                    if (!parentItem) {
                        return 'NONE';
                    }

                    return parentItem.componentNameNew;

                } else {

                    return 'NONE';
                }

            } else {
                let currentUpdateItem = DesignUpdateComponentData.getUpdateComponentById(currentItemId);

                if(currentUpdateItem) {
                    let parentUpdateItem = DesignUpdateComponentData.getUpdateComponentByRef(
                        currentUpdateItem.designVersionId,
                        currentUpdateItem.designUpdateId,
                        currentUpdateItem.componentParentReferenceIdNew
                    );

                    while ((parentUpdateItem.componentType !== parentType) && (currentUpdateItem.componentParentReferenceIdNew !== 'NONE')) {
                        currentUpdateItem = parentUpdateItem;
                        parentUpdateItem = DesignUpdateComponentData.getUpdateComponentByRef(
                            currentUpdateItem.designVersionId,
                            currentUpdateItem.designUpdateId,
                            currentUpdateItem.componentParentReferenceIdNew
                        );
                    }

                    return parentUpdateItem.componentNameNew;
                } else {

                    return 'NONE';
                }
            }
        } else {
            return 'NONE';
        }
    };

    resetContextsOnDesignRemoval(removedDesignId){

        // This prevents errors after re-login if a Design is removed that other people have accessed
        const affectedContexts = UserContextData.getAllUserContextsForDesign(removedDesignId);

        affectedContexts.forEach((context) => {

            UserContextData.clearUserContext(context.userId);

        });
    };

    resetContextsOnDesignComponentRemoval(removedDesignComponentId){

        // This prevents errors after re-login if a Design Component is removed that other people have accessed
        const affectedContexts = UserContextData.getAllUserContextsForComponent(removedDesignComponentId);

        affectedContexts.forEach((context) => {

            UserContextData.clearComponentContext(context.userId);

        });
    };
}

export const ClientUserContextServices = new ClientUserContextServicesClass();