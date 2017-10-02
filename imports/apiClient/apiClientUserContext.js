// == IMPORTS ==========================================================================================================

// Meteor / React Services

// Ultrawide Collections
import { UserContext }   from '../collections/context/user_context.js';
import { UserCurrentViewOptions }   from '../collections/context/user_current_view_options.js';
import { Designs }                  from '../collections/design/designs.js';
import { DesignVersions }           from '../collections/design/design_versions.js';
import { DesignUpdates }            from '../collections/design_update/design_updates.js';
import { WorkPackages }             from '../collections/work/work_packages.js';
import { DesignVersionComponents }  from '../collections/design/design_version_components.js';
import { DesignUpdateComponents }   from '../collections/design_update/design_update_components.js';
import { WorkPackageComponents }    from '../collections/work/work_package_components.js';

// Ultrawide Services
import { RoleType, ViewType, DesignVersionStatus, DesignUpdateStatus, ComponentType, LogLevel, WorkPackageStatus, WorkPackageType, UserSetting, UserSettingValue, DisplayContext, UpdateScopeType } from '../constants/constants.js';
import { log } from '../common/utils.js';
import TextLookups from '../common/lookups.js'

import ClientContainerServices              from '../apiClient/apiClientContainerServices.js';
import ClientDesignVersionServices          from '../apiClient/apiClientDesignVersion.js';
import ClientDesignComponentServices        from '../apiClient/apiClientDesignComponent.js';
import ClientDesignUpdateServices           from '../apiClient/apiClientDesignUpdate.js';
import ClientDesignUpdateComponentServices  from '../apiClient/apiClientDesignUpdateComponent.js';
import ClientWorkPackageServices            from '../apiClient/apiClientWorkPackage.js';
import ClientWorkPackageComponentServices   from '../apiClient/apiClientWorkPackageComponent.js';
import ClientAppHeaderServices              from '../apiClient/apiClientAppHeader.js';
import ClientTestIntegrationServices        from '../apiClient/apiClientTestIntegration.js';
import ClientUserSettingsServices           from '../apiClient/apiClientUserSettings.js';

// REDUX services
import store from '../redux/store'
import {setCurrentView, setCurrentRole, setCurrentUserItemContext, setCurrentUserViewOptions, setCurrentWindowSize, setIntTestOutputDir, setCurrentUserOpenDesignItems, setCurrentUserOpenDesignUpdateItems, setCurrentUserOpenWorkPackageItems, updateOpenItemsFlag} from '../redux/actions'

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

    getUserContext(userId){

        const userContext = UserContext.findOne({userId: userId});


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

        const userViewOptions = UserCurrentViewOptions.findOne({userId: userId});

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
        store.dispatch(setCurrentRole(userId, roleType));
    }

    loadMainData(userContext){
        log((msg) => console.log(msg), LogLevel.TRACE, "Loading main data...");

        const dvCount = DesignVersionComponents.find({}).count();

        if(dvCount > 0){
            log((msg) => console.log(msg), LogLevel.TRACE, "Data already loaded...");

            this.onAllDataLoaded();
        } else {

            // Need to load data
            if(userContext.designVersionId !== 'NONE'){
                log((msg) => console.log(msg), LogLevel.TRACE, "Loading data for DV {}", userContext.designVersionId);

                // Show wait screen
                store.dispatch(setCurrentView(ViewType.WAIT));

                // Also gets WP data if a WP is current
                ClientContainerServices.getDesignVersionData(userContext, this.onAllDataLoaded);

            } else {

                log((msg) => console.log(msg), LogLevel.TRACE, "No DV set");
                // Will have to wait for a DV to be selected to get data
                this.onAllDataLoaded(userContext);
            }
        }

    }


    onAllDataLoaded(){

        //console.log("called onAllDataLoaded");
        const userContext = store.getState().currentUserItemContext;

        // Refresh the test mash for the design version.  Also loads test results
        //ClientTestIntegrationServices.refreshTestData(userContext);

        // Display correct work progress
        ClientDesignVersionServices.updateWorkProgress(userContext);

        // Get latest status on DUs
        ClientDesignUpdateServices.updateDesignUpdateStatuses(userContext);

        // Restore User Settings
        const screenSize = ClientUserSettingsServices.getUserSetting(UserSetting.SETTING_SCREEN_SIZE);
        store.dispatch(setCurrentWindowSize(screenSize));

        const intTestOutputDir = ClientUserSettingsServices.getUserSetting(UserSetting.SETTING_INT_OUTPUT_LOCATION);
        store.dispatch(setIntTestOutputDir(intTestOutputDir));

        // Go to Home screen
        store.dispatch(setCurrentView(ViewType.ROLES));
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

            // if (userContext.designComponentId !== 'NONE') {
            //     // There is a current component...
            //     if (userContext.workPackageId !== 'NONE') {
            //         // User is in a WP so drill down to that item...
            //
            //         let wpComponent = null;
            //         let wpType = '';
            //
            //         if(userContext.designUpdateId === 'NONE'){
            //             wpComponent = DesignVersionComponents.findOne({_id: userContext.designComponentId});
            //             wpType = WorkPackageType.WP_BASE;
            //         } else {
            //             wpComponent = DesignUpdateComponents.findOne({_id: userContext.designComponentId});
            //             wpType = WorkPackageType.WP_UPDATE;
            //         }
            //
            //         if(wpComponent) {
            //
            //             switch(wpComponent.componentType){
            //
            //                 case ComponentType.APPLICATION:
            //                 case ComponentType.DESIGN_SECTION:
            //                     // Already open
            //                     break;
            //                 case ComponentType.FEATURE:
            //                     // Open it and all stuff below
            //                     wpArr = ClientWorkPackageComponentServices.setOpenClosed(wpType, wpComponent, wpArr, true);
            //                     break;
            //                 default:
            //                     // Anything else is below a Feature so open the Feature and select that
            //                     let wpFeatureComponent = null;
            //
            //                     if(userContext.designUpdateId === 'NONE'){
            //                         wpFeatureComponent = DesignVersionComponents.findOne({
            //                             designVersionId: userContext.designVersionId,
            //                             componentType: ComponentType.FEATURE,
            //                             componentReferenceId: wpComponent.componentFeatureReferenceIdNew
            //                         });
            //                     } else {
            //                         wpFeatureComponent = DesignUpdateComponents.findOne({
            //                             designVersionId: userContext.designVersionId,
            //                             componentType: ComponentType.FEATURE,
            //                             componentReferenceId: wpComponent.componentFeatureReferenceIdNew
            //                         });
            //                     }
            //
            //                     if(wpFeatureComponent){
            //                         // Reset user context.  Feature id is the DESIGN component ID, not the WP component ID
            //                         userContext.designComponentId = wpFeatureComponent.componentId;
            //                         userContext.designComponentType = ComponentType.FEATURE;
            //                         userContext.featureReferenceId = wpFeatureComponent.componentReferenceId;
            //                         userContext.featureAspectReferenceId = 'NONE';
            //                         userContext.scenarioReferenceId = 'NONE';
            //                         userContext.scenarioStepId = 'NONE';
            //
            //                         store.dispatch(setCurrentUserItemContext(userContext, true));
            //
            //                         // Open the feature
            //                         wpArr = ClientWorkPackageComponentServices.setOpenClosed(wpType, wpFeatureComponent, wpArr, true);
            //                     }
            //             }
            //         }
            //     }
            // }
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

        const userViewOptions = UserCurrentViewOptions.findOne({userId: userContext.userId});

        // If no design / design version selected go to Designs screen
        if(userContext.designId === 'NONE' || userContext.designVersionId === 'NONE'){
            store.dispatch(setCurrentView(ViewType.DESIGNS));
            return;
        }

        // Decide where to go depending on the user context
        switch(userRole){
            case RoleType.DESIGNER:

                // If a designer, go to the design version that is in the context.  If its new, editing it.
                // If published and an update is new / draft go to update
                // If final go to view

                // See what status the design version has
                const designVersion = DesignVersions.findOne({_id: userContext.designVersionId});

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
                                const designUpdate = DesignUpdates.findOne({_id: userContext.designUpdateId});

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
                    store.dispatch(setCurrentView(ViewType.DESIGNS));
                    return;
                }

                break;
            case RoleType.DEVELOPER:
                // If a developer go to the Work Package they are currently working on if it is set

                log((msg) => console.log(msg), LogLevel.TRACE, "Developer Context WP is {}", userContext.workPackageId);

                if(userContext.workPackageId !== 'NONE'){

                    const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

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
                            case WorkPackageStatus.WP_COMPLETE:
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

                    const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

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
                            case WorkPackageStatus.WP_COMPLETE:

                                // View Only
                                switch(workPackage.workPackageType){
                                    case WorkPackageType.WP_BASE:
                                        if(userContext.designComponentId !== 'NONE') {
                                            ClientWorkPackageServices.viewWorkPackage(userRole, userContext, userContext.workPackageId, WorkPackageType.WP_BASE);
                                        } else {
                                            store.dispatch(setCurrentView(ViewType.SELECT));
                                        }
                                        return;

                                    case WorkPackageType.WP_UPDATE:
                                        if(userContext.designComponentId !== 'NONE') {
                                            ClientWorkPackageServices.viewWorkPackage(userRole, userContext, userContext.workPackageId, WorkPackageType.WP_UPDATE);
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
            designUpdateAction: 'NONE',
            workPackage:        'NONE',
            application:        'NONE',
            designSection:      'NONE',
            feature:            'NONE',
            featureAspect:      'NONE',
            scenario:           'NONE'
        };

        if(userContext.designId !== 'NONE'){

            const design = Designs.findOne({_id: userContext.designId});

            if(design){
                contextNameData.design = design.designName;
            }
        }

        if(userContext.designVersionId !== 'NONE'){

            const designVersion = DesignVersions.findOne({_id: userContext.designVersionId});

            if(designVersion) {
                contextNameData.designVersion = designVersion.designVersionName;
            }
        }

        if(userContext.designUpdateId !== 'NONE'){

            const designUpdate = DesignUpdates.findOne({_id: userContext.designUpdateId});

            if(designUpdate) {
                contextNameData.designUpdate = designUpdate.updateName;
                contextNameData.designUpdateAction = TextLookups.updateMergeActions(designUpdate.updateMergeAction);
            }
        }

        if(userContext.workPackageId !== 'NONE'){

            const workPackage = WorkPackages.findOne({_id: userContext.workPackageId});

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
                    component = DesignVersionComponents.findOne({_id: userContext.designComponentId});
                    if(component){
                        componentName = component.componentNameNew;
                    }
                } else {
                    component = DesignUpdateComponents.findOne({_id: userContext.designComponentId});
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

                let currentItem = DesignVersionComponents.findOne({_id: currentItemId});

                if(currentItem) {
                    let parentItem = DesignVersionComponents.findOne({_id: currentItem.componentParentIdNew});


                    log((msg) => console.log(msg), LogLevel.TRACE, "Immediate parent is type {}", parentItem.componentType);

                    while (parentItem && (parentItem.componentType !== parentType) && (currentItem.componentParentIdNew !== 'NONE')) {
                        currentItem = parentItem;
                        parentItem = DesignVersionComponents.findOne({_id: currentItem.componentParentIdNew});

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
                let currentUpdateItem = DesignUpdateComponents.findOne({_id: currentItemId});
                if(currentUpdateItem) {
                    let parentUpdateItem = DesignUpdateComponents.findOne({_id: currentUpdateItem.componentParentIdNew});

                    while ((parentUpdateItem.componentType !== parentType) && (currentUpdateItem.componentParentIdNew !== 'NONE')) {
                        currentUpdateItem = parentUpdateItem;
                        parentUpdateItem = DesignUpdateComponents.findOne({_id: currentUpdateItem.componentParentIdNew});
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

        const affectedUsers = UserContext.find({designId: removedDesignId}).fetch();

        affectedUsers.forEach((user) => {

            UserContext.update(
                {_id: user._id},
                {
                    $set:{
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
                    }
                }
            );
        })
    };

    resetContextsOnDesignComponentRemoval(removedDesignComponentId){

        // This prevents errors after re-login if a Design Component is removed that other people have accessed

        const affectedUsers = UserContext.find({designComponentId: removedDesignComponentId}).fetch();

        affectedUsers.forEach((user) => {

            UserContext.update(
                {_id: user._id},
                {
                    $set:{
                        designComponentId:              'NONE',
                        designComponentType:            'NONE',
                        featureReferenceId:             'NONE',
                        featureAspectReferenceId:       'NONE',
                        scenarioReferenceId:            'NONE',
                        scenarioStepId:                 'NONE',
                    }
                }
            );
        })
    };
}

export default new ClientUserContextServices();