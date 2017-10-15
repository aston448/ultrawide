
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';

// Ultrawide Services
import { RoleType, ComponentType, ViewType, ViewOptionType, DisplayContext, DesignVersionStatus, DesignUpdateStatus,
     WorkPackageType, WorkPackageStatus, LogLevel,
     UltrawideAction, MessageType, MenuDropdown, MenuAction, DetailsViewType, WorkSummaryType } from '../constants/constants.js';

import ClientTestOutputLocationServices from '../apiClient/apiClientTestOutputLocations.js';

import { log } from '../common/utils.js';
import TextLookups from '../common/lookups.js';

// Data Access
import AppGlobalData                    from '../data/app/app_global_db.js';
import UserRoleData                     from '../data/users/user_role_db.js';
import DesignData                       from '../data/design/design_db.js';
import DesignVersionData                from '../data/design/design_version_db.js';
import DesignUpdateData                 from '../data/design_update/design_update_db.js';
import WorkPackageData                  from '../data/work/work_package_db.js';
import WorkPackageComponentData         from '../data/work/work_package_component_db.js';
import DesignComponentData              from '../data/design/design_component_db.js';
import DesignUpdateComponentData        from '../data/design_update/design_update_component_db.js';
import UserTestTypeLocationData         from '../data/configure/user_test_type_location_db.js';
import TestOutputLocationData           from '../data/configure/test_output_location_db.js';
import DesignBackupData                 from '../data/backups/design_backup_db.js';
import UserDevDesignSummaryData         from '../data/summary/user_dev_design_summary_db.js';
import DomainDictionaryData             from '../data/design/domain_dictionary_db.js';
import UserDvMashScenarioData           from '../data/mash/user_dv_mash_scenario_db.js';
import UserMashScenarioTestData         from '../data/mash/user_mash_scenario_test_db.js';
import UserDevTestSummaryData           from '../data/summary/user_dev_test_summary_db.js';
import UserWorkProgressSummaryData      from '../data/summary/user_work_progress_summary_db.js';

// REDUX services
import store from '../redux/store'
import { setDesignVersionDataLoadedTo, updateUserMessage } from '../redux/actions'


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Container Services - Functions to return the data required for various GUI components
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientDataServices{

    getApplicationData(){

        if(Meteor.isClient) {

            // Subscribing to these here makes them available to the whole app...
            const agHandle = Meteor.subscribe('appGlobal');
            const urHandle = Meteor.subscribe('userRoles');
            const dbHandle = Meteor.subscribe('designBackups');
            const usHandle = Meteor.subscribe('userSettings');
            const ucHandle = Meteor.subscribe('userContext');
            const uvHandle = Meteor.subscribe('userCurrentViewOptions');
            const tlHandle = Meteor.subscribe('testOutputLocations');
            const tfHandle = Meteor.subscribe('testOutputLocationFiles');
            const utHandle = Meteor.subscribe('userTestTypeLocations');
            const dHandle = Meteor.subscribe('designs');
            const dvHandle = Meteor.subscribe('designVersions');
            const duHandle = Meteor.subscribe('designUpdates');
            const wpHandle = Meteor.subscribe('workPackages');

            const loading = (
                !agHandle.ready() || !urHandle.ready() || !dbHandle.ready() || !usHandle.ready() || !ucHandle.ready() || !uvHandle.ready() || !tlHandle.ready() || !tfHandle.ready() || !utHandle.ready() || !dHandle.ready() || !dvHandle.ready() || !duHandle.ready() || !wpHandle.ready()
            );

            return {isLoading: loading};
        }
    }

    getDesignVersionData(userContext, callback){

        if(Meteor.isClient) {

            if(store.getState().designVersionDataLoaded){

                // Data is loaded already so callback if wanted
                if(callback){
                    callback();
                }

            } else {

                store.dispatch(updateUserMessage({
                    messageType: MessageType.WARNING,
                    messageText: 'FETCHING DESIGN VERSION DATA FROM SERVER...'
                }));

                log((msg) => console.log(msg), LogLevel.DEBUG, "Getting Design Version Data for DV {}", userContext.designVersionId);

                // Design Version specific data
                const dvcHandle = Meteor.subscribe('designVersionComponents', userContext.designVersionId);
                const ducHandle = Meteor.subscribe('designUpdateComponents', userContext.designVersionId);
                const wcHandle = Meteor.subscribe('workPackageComponents', userContext.designVersionId);
                const fbHandle = Meteor.subscribe('featureBackgroundSteps', userContext.designVersionId);
                const ssHandle = Meteor.subscribe('scenarioSteps', userContext.designVersionId);
                const ddHandle = Meteor.subscribe('domainDictionary', userContext.designVersionId);

                // User specific data
                const dvmHandle = Meteor.subscribe('userDesignVersionMashScenarios', userContext.userId);
                const irHandle = Meteor.subscribe('userIntegrationTestResults', userContext.userId);
                const mrHandle = Meteor.subscribe('userUnitTestResults', userContext.userId);
                const stHandle = Meteor.subscribe('userMashScenarioTests', userContext.userId);
                const tsHandle = Meteor.subscribe('userDevTestSummary', userContext.userId);
                const dsHandle = Meteor.subscribe('userDevDesignSummary', userContext.userId);
                const dusHandle = Meteor.subscribe('userDesignUpdateSummary', userContext.userId);
                const psHandle = Meteor.subscribe('userWorkProgressSummary', userContext.userId);

                Tracker.autorun((loader) => {

                    let loading = (
                        !dusHandle.ready() ||
                        !dvcHandle.ready() || !ducHandle.ready() || !fbHandle.ready() ||
                        !ssHandle.ready() || !ddHandle.ready() || !dvmHandle.ready() ||
                        !irHandle.ready() || !mrHandle.ready() || !stHandle.ready() || !tsHandle.ready() ||
                        !dsHandle.ready() || !wcHandle.ready() || !psHandle.ready()
                    );

                    log((msg) => console.log(msg), LogLevel.DEBUG, "loading DV = {}", loading);

                    if (!loading) {
                        // Mark data as loaded
                        store.dispatch(setDesignVersionDataLoadedTo(true));

                        store.dispatch(updateUserMessage({
                            messageType: MessageType.INFO,
                            messageText: 'Design Version data loaded'
                        }));

                        // If an action wanted after loading call it...
                        if (callback) {
                            callback();
                        }

                        // Stop this checking once we are done or there will be random chaos
                        loader.stop();
                    }

                });
            }
        }
    }

    // getWorkPackageData(userContext, callback){
    //
    //     if(Meteor.isClient) {
    //
    //         console.log("In getWorkPackageData with callback " + callback);
    //
    //         if (store.getState().workPackageDataLoaded) {
    //
    //             if (callback) {
    //                 callback()
    //             }
    //         } else {
    //
    //             store.dispatch(updateUserMessage({
    //                 messageType: MessageType.WARNING,
    //                 messageText: 'FETCHING WORK PACKAGE DATA FROM SERVER...'
    //             }));
    //
    //             log((msg) => console.log(msg), LogLevel.DEBUG, "Getting Work Package Data for DV {}, WP {}", userContext.designVersionId, userContext.workPackageId);
    //
    //             let wcHandle = Meteor.subscribe('workPackageComponents', userContext.designVersionId, userContext.workPackageId);
    //
    //             Tracker.autorun((loader) => {
    //
    //                 let loading = !wcHandle.ready();
    //
    //                 log((msg) => console.log(msg), LogLevel.DEBUG, "loading WP = {}", loading);
    //
    //                 if (!loading) {
    //                     // Mark data as loaded
    //                     store.dispatch(setWorkPackageDataLoadedTo(true));
    //
    //                     store.dispatch(updateUserMessage({
    //                         messageType: MessageType.INFO,
    //                         messageText: 'Work Package data loaded'
    //                     }));
    //
    //                     // Set open items now that data is loaded
    //                     ClientUserContextServices.setOpenWorkPackageItems(userContext);
    //
    //                     // If an action wanted after loading call it...
    //                     if (callback) {
    //                         callback();
    //                     }
    //
    //                     // Stop this checking once we are done or there will be random chaos
    //                     loader.stop();
    //                 }
    //             });
    //         }
    //     }
    // }

    // getTestIntegrationData(userId, callback){
    //
    //     if(Meteor.isClient) {
    //
    //         // See if we have already got the data subscribed...
    //         if (!(store.getState().testIntegrationDataLoaded)) {
    //
    //             store.dispatch(updateUserMessage({
    //                 messageType: MessageType.WARNING,
    //                 messageText: 'Fetching your test data from server...  Please wait...'
    //             }));
    //
    //             // Subscribe to dev data
    //             const dfHandle = Meteor.subscribe('userDevFeatures', userId);
    //             const dbHandle = Meteor.subscribe('userDevFeatureBackgroundSteps', userId);
    //             const fsHandle = Meteor.subscribe('userDevFeatureScenarios', userId);
    //             const ssHandle = Meteor.subscribe('userDevFeatureScenarioSteps', userId);
    //             const wmHandle = Meteor.subscribe('userWorkPackageMashData', userId);
    //             const wsHandle = Meteor.subscribe('userWorkPackageFeatureStepData', userId);
    //             const mmHandle = Meteor.subscribe('userUnitTestMashData', userId);
    //             const arHandle = Meteor.subscribe('userAccTestResults', userId);
    //             const irHandle = Meteor.subscribe('userIntTestResults', userId);
    //             const mrHandle = Meteor.subscribe('userUnitTestResults', userId);
    //             const tsHandle = Meteor.subscribe('userDevTestSummary', userId);
    //             const dsHandle = Meteor.subscribe('userDevDesignSummary', userId);
    //
    //             Tracker.autorun((loader) => {
    //
    //                 let loading = (
    //                     !dfHandle.ready() || !dbHandle.ready() || !fsHandle.ready() || !ssHandle.ready() || !wmHandle.ready() || !wsHandle.ready() || !mmHandle.ready() || !arHandle.ready() || !irHandle.ready() || !mrHandle.ready() || !tsHandle.ready() || !dsHandle.ready()
    //                 );
    //
    //                 log((msg) => console.log(msg), LogLevel.DEBUG, "loading dev data = {}", loading);
    //
    //                 if (!loading) {
    //
    //                     store.dispatch(setTestIntegrationDataLoadedTo(true));
    //
    //                     store.dispatch(updateUserMessage({
    //                         messageType: MessageType.INFO,
    //                         messageText: 'Test Data loaded'
    //                     }));
    //
    //                     if(callback){
    //                         callback();
    //                     }
    //
    //                     // Stop this checking once we are done or there will be random chaos
    //                     loader.stop();
    //                 }
    //
    //             });
    //         } else {
    //             if(callback){
    //                 callback();
    //             }
    //         }
    //     }
    // }

    // Ultrawide Users
    getUltrawideUsers(){

        // Return everything except the admin user
        return UserRoleData.getNonAdminUsers();
    }

    // Design Backups
    getDesignBackups(){

        return DesignBackupData.getAllBackups();
    }

    // Global Data store
    getDataStore(){

        const appData = AppGlobalData.getDataByVersionKey('CURRENT_VERSION');

        if(!appData){
            throw new Meteor.Error('DATA_STORE_ERROR', 'Ultrawide global data is not defined');
        }

        if(appData.dataStore.length === 0){
            throw new Meteor.Error('DATA_STORE_ERROR', 'Ultrawide data store is not defined');
        }

        // Make sure a proper path
        if(appData.dataStore.endsWith('/')){
            return appData.dataStore;
        } else {
            return appData.dataStore + '/';
        }
    }

    // Test Output Locations
    getTestOutputLocationData(userId){

        // You can see either shared locations or private ones made by you
        return TestOutputLocationData.getAllUserLocations(userId);
    }

    // Files for a Test Output Location
    getTestOutputLocationFiles(locationId){

        return TestOutputLocationData.getAllLocationFiles(locationId);
    }

    // User configuration of Test Outputs
    getUserTestOutputLocationData(userContext, userRole){

        // Updates the user data with the latest locations
        ClientTestOutputLocationServices.updateUserConfiguration(userContext.userId);

        return UserTestTypeLocationData.getUserTestTypeLocations(userContext.userId);
    }



    getApplicationHeaderData(userContext, view){

        //console.log("Getting header data for view: " + view + " and context design " + userContext.designId + " and design version " + userContext.designVersionId);

        // The data required depends on the view
        if(userContext && view) {
            let currentDesign = null;
            let currentDesignVersion = null;
            let currentDesignUpdate = null;
            let currentWorkPackage = null;

            switch (view) {
                case ViewType.DESIGNS:
                    currentDesign = DesignData.getDesignById(userContext.designId);
                    break;

                case ViewType.SELECT:
                case ViewType.DESIGN_NEW_EDIT:
                case ViewType.DESIGN_PUBLISHED_VIEW:
                case ViewType.DESIGN_UPDATABLE_VIEW:
                    // Get the current design version which should be set for these views
                    currentDesign = DesignData.getDesignById(userContext.designId);
                    currentDesignVersion = DesignVersionData.getDesignVersionById(userContext.designVersionId);
                    break;

                case ViewType.DESIGN_UPDATE_EDIT:
                case ViewType.DESIGN_UPDATE_VIEW:
                    // Get the current design version + update which should be set for these views
                    currentDesign = DesignData.getDesignById(userContext.designId);
                    currentDesignVersion = DesignVersionData.getDesignVersionById(userContext.designVersionId);
                    currentDesignUpdate = DesignUpdateData.getDesignUpdateById(userContext.designUpdateId);
                    break;

                case ViewType.WORK_PACKAGE_BASE_EDIT:
                case ViewType.WORK_PACKAGE_BASE_VIEW:
                case ViewType.DEVELOP_BASE_WP:
                    currentDesign = DesignData.getDesignById(userContext.designId);
                    currentDesignVersion = DesignVersionData.getDesignVersionById(userContext.designVersionId);
                    currentWorkPackage = WorkPackageData.getWorkPackageById(userContext.workPackageId);
                    break;

                case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                case ViewType.DEVELOP_UPDATE_WP:
                    currentDesign = DesignData.getDesignById(userContext.designId);
                    currentDesignVersion = DesignVersionData.getDesignVersionById(userContext.designVersionId);
                    currentDesignUpdate = DesignUpdateData.getDesignUpdateById(userContext.designUpdateId);
                    currentWorkPackage = WorkPackageData.getWorkPackageById(userContext.workPackageId);
                    break;

                default:
                    // No data required
            }

            return {
                view: view,
                currentDesign: currentDesign,
                currentDesignVersion: currentDesignVersion,
                currentDesignUpdate: currentDesignUpdate,
                currentWorkPackage: currentWorkPackage
            };

        } else {
            return {
                view: null,
                currentDesign: null,
                currentDesignVersion: null,
                currentDesignUpdate: null,
                currentWorkPackage: null
            };
        }
    }

    getUserRoles(userId){

        let userRoles = [];
        const user = UserRoleData.getRoleByUserId(userId);

        if(user){
            if(user.isDesigner){
                userRoles.push(RoleType.DESIGNER);
            }

            if(user.isDeveloper){
                userRoles.push(RoleType.DEVELOPER);
            }

            if(user.isManager){
                userRoles.push(RoleType.MANAGER);
            }
        }

        return userRoles;
    }

    getRoleActions(roleType){

        let roleActions = [];

        switch(roleType){
            case RoleType.DESIGNER:
                roleActions.push(UltrawideAction.ACTION_HOME);
                roleActions.push(UltrawideAction.ACTION_DESIGNS);
                roleActions.push(UltrawideAction.ACTION_LAST_DESIGNER);
                roleActions.push(UltrawideAction.ACTION_CONFIGURE);
                break;
            case RoleType.DEVELOPER:
                roleActions.push(UltrawideAction.ACTION_HOME);
                roleActions.push(UltrawideAction.ACTION_DESIGNS);
                roleActions.push(UltrawideAction.ACTION_LAST_DEVELOPER);
                roleActions.push(UltrawideAction.ACTION_CONFIGURE);
                break;
            case RoleType.MANAGER:
                roleActions.push(UltrawideAction.ACTION_HOME);
                roleActions.push(UltrawideAction.ACTION_DESIGNS);
                roleActions.push(UltrawideAction.ACTION_LAST_MANAGER);
                roleActions.push(UltrawideAction.ACTION_CONFIGURE);
        }

        return roleActions;
    }

    // Get a list of known Designs
    getUltrawideDesigns(){

        // Get all the designs available
        return {
            designs: DesignData.getAllDesigns()
        }
    }

    // Get a list of known Design Versions for the current Design
    getDesignVersionsForCurrentDesign(currentDesignId){

        // No action if design not yet set
        if (currentDesignId !== 'NONE') {

            // Get all the design versions available
            const currentDesignVersions = DesignData.getDesignVersionsOrderByVersion(currentDesignId);

            return {
                designVersions: currentDesignVersions,
            };

        } else {
            return {designVersions: []};
        }
    };

    // Get a list of Work Packages for a base Design Version
    getWorkPackagesForCurrentDesignVersion(currentDesignVersionId){

        // No action if design version not yet set
        if (currentDesignVersionId !== 'NONE') {

            // Get New WPS
            const newWorkPackages = DesignVersionData.getBaseWorkPackagesAtStatus(currentDesignVersionId, WorkPackageStatus.WP_NEW);

            // Get Available WPS
            const availableWorkPackages = DesignVersionData.getBaseWorkPackagesAtStatus(currentDesignVersionId, WorkPackageStatus.WP_AVAILABLE);

            // Get Adopted WPS
            const adoptedWorkPackages = DesignVersionData.getBaseWorkPackagesAtStatus(currentDesignVersionId, WorkPackageStatus.WP_ADOPTED);

            // Get the status of the current design version
            const designVersion = DesignVersionData.getDesignVersionById(currentDesignVersionId);

            //console.log("Base WPs found found: " + currentWorkPackages.count());

            return {
                wpType: WorkPackageType.WP_BASE,
                newWorkPackages: newWorkPackages,
                availableWorkPackages: availableWorkPackages,
                adoptedWorkPackages: adoptedWorkPackages,
                designVersionStatus: designVersion.designVersionStatus
            };

        } else {
            return {
                wpType: WorkPackageType.WP_BASE,
                newWorkPackages: [],
                availableWorkPackages: [],
                adoptedWorkPackages: [],
                designVersionStatus: null
            };
        }
    };

    // Get a list of Work Packages for a Design Update
    getWorkPackagesForCurrentDesignUpdate(currentDesignVersionId, currentDesignUpdateId){

        //console.log("Looking for Update WPs for DV: " + currentDesignVersionId + " and DU: " + currentDesignUpdateId);

        if(currentDesignVersionId !=='NONE') {

            // Get the status of the current design version
            const designVersion = DesignVersionData.getDesignVersionById(currentDesignVersionId);

            if (currentDesignUpdateId !== 'NONE') {

                const designUpdate = DesignUpdateData.getDesignUpdateById(currentDesignUpdateId);

                if(designUpdate) {

                    // Get New WPS
                    const newWorkPackages = DesignUpdateData.getUpdateWorkPackagesAtStatus(currentDesignVersionId, currentDesignUpdateId, WorkPackageStatus.WP_NEW);

                    // Get Available WPS
                    const availableWorkPackages = DesignUpdateData.getUpdateWorkPackagesAtStatus(currentDesignVersionId, currentDesignUpdateId, WorkPackageStatus.WP_AVAILABLE);

                    // Get Adopted WPS
                    const adoptedWorkPackages = DesignUpdateData.getUpdateWorkPackagesAtStatus(currentDesignVersionId, currentDesignUpdateId, WorkPackageStatus.WP_ADOPTED);

                    return {
                        wpType: WorkPackageType.WP_UPDATE,
                        newWorkPackages: newWorkPackages,
                        availableWorkPackages: availableWorkPackages,
                        adoptedWorkPackages: adoptedWorkPackages,
                        designVersionStatus: designVersion.designVersionStatus,
                        designUpdateStatus: designUpdate.updateStatus
                    };
                } else {

                    return {
                        wpType: WorkPackageType.WP_UPDATE,
                        newWorkPackages: [],
                        availableWorkPackages: [],
                        adoptedWorkPackages: [],
                        designVersionStatus: designVersion.designVersionStatus,
                        designUpdateStatus: null
                    };
                }

            } else {
                return {
                    wpType: WorkPackageType.WP_UPDATE,
                    newWorkPackages: [],
                    availableWorkPackages: [],
                    adoptedWorkPackages: [],
                    designVersionStatus: designVersion.designVersionStatus,
                    designUpdateStatus: null
                };
            }

        } else {

            return {
                wpType: WorkPackageType.WP_UPDATE,
                newWorkPackages: [],
                availableWorkPackages: [],
                adoptedWorkPackages: [],
                designVersionStatus: null,
                designUpdateStatus: null
            };
        }
    };

    // Get a list of known Design Updates for the current Design Version
    getDesignUpdatesForCurrentDesignVersion(currentDesignVersionId){

        // No action if design version not yet set
        if (currentDesignVersionId !== 'NONE') {

            // Get all the design updates available for the selected version sorted by type and name

            const newUpdates = DesignVersionData.getUpdatesAtStatus(currentDesignVersionId, DesignUpdateStatus.UPDATE_NEW);

            const draftUpdates = DesignVersionData.getUpdatesAtStatus(currentDesignVersionId, DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT);

            const mergedUpdates = DesignVersionData.getUpdatesAtStatus(currentDesignVersionId, DesignUpdateStatus.UPDATE_MERGED);

            const ignoredUpdates = DesignVersionData.getUpdatesAtStatus(currentDesignVersionId, DesignUpdateStatus.UPDATE_IGNORED);

            // Get the status of the current design version
            const designVersion = DesignVersionData.getDesignVersionById(currentDesignVersionId);

            return {
                newUpdates: newUpdates,
                draftUpdates: draftUpdates,
                mergedUpdates: mergedUpdates,
                ignoredUpdates: ignoredUpdates,
                designVersionStatus: designVersion.designVersionStatus
            };

        } else {
            return {
                newUpdates: [],
                draftUpdates: [],
                mergedUpdates: [],
                ignoredUpdates: [],
                designVersionStatus: ''
            };
        }
    };

    // Get top level editor data (i.e Applications)
    getEditorApplicationData(userContext, view){

        console.log("Getting Application data for " + view + " and DV: " + userContext.designVersionId + " DU: " + userContext.designUpdateId + " WP: " + userContext.workPackageId);

        const designVersion = DesignVersionData.getDesignVersionById(userContext.designVersionId);

        // Just get the original base items, not any new stuff
        const baseApplicationsArr = DesignVersionData.getExistingApplications(userContext.designVersionId);

        // All the existing and new stuff in the Design version - but for completed updatable versions leave out deleted
        let workingApplicationsArr  = null;

        if(designVersion.designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE_COMPLETE){

            workingApplicationsArr = DesignVersionData.getWorkingApplications(userContext.designVersionId);

        } else {

            workingApplicationsArr = DesignVersionData.getAllApplications(userContext.designVersionId);

        }

        log((msg) => console.log(msg), LogLevel.DEBUG, "Found {} base applications.", baseApplicationsArr.length);
        log((msg) => console.log(msg), LogLevel.DEBUG, "Found {} working applications.", workingApplicationsArr.length);

        // Get Update Apps if update Id provided
        let updateApplicationsArr = [];

        if(userContext.designUpdateId !== 'NONE'){

            updateApplicationsArr = DesignUpdateData.getUpdateComponentsOfType(userContext.designUpdateId, ComponentType.APPLICATION);
        }

        // Get WP Data if WP Id provided
        let wpApplicationsArr = [];

        if(userContext.workPackageId !== 'NONE'){

            // Which applications are in the WP?
            const wpAppComponents = WorkPackageData.getWorkPackageComponentsOfType(userContext.workPackageId, ComponentType.APPLICATION);

            wpAppComponents.forEach((wpApp) => {

                switch(view){
                    case ViewType.WORK_PACKAGE_BASE_VIEW:
                    case ViewType.WORK_PACKAGE_BASE_EDIT:
                    case ViewType.DEVELOP_BASE_WP:

                        // The app data is the Design Version data
                        let appDvComponent = DesignComponentData.getDesignComponentByRef(wpApp.designVersionId, wpApp.componentReferenceId);

                        if(appDvComponent) {
                            wpApplicationsArr.push(appDvComponent);
                        }
                        break;

                    case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                    case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                    case ViewType.DEVELOP_UPDATE_WP:

                        // The app data is the Design Update data
                        let appDuComponent = DesignUpdateComponentData.getUpdateComponentByRef(userContext.designVersionId, userContext.designUpdateId, wpApp.componentReferenceId);

                        if(appDuComponent) {
                            wpApplicationsArr.push(appDuComponent);
                        }
                        break;
                }
            });

            //console.log("Found " + wpApplicationsArr.length + " WP applications.");

        }

        // Get the design summary data
        let designSummaryData = null;

        if(userContext) {

            designSummaryData = UserDevDesignSummaryData.getUserDesignSummary(userContext);
        }

        switch(view){
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:
                // Just need base design version applications
                return{
                    baseApplications:       baseApplicationsArr,
                    workingApplications:    workingApplicationsArr,
                    designSummaryData:      designSummaryData
                };
            case ViewType.DESIGN_UPDATE_EDIT:
                // Need base and update apps
                return{
                    baseApplications:       baseApplicationsArr,
                    updateApplications:     updateApplicationsArr,
                    workingApplications:    workingApplicationsArr
                };
            case ViewType.DESIGN_UPDATE_VIEW:
                // Need design update apps only
                return{
                    baseApplications:       [],
                    updateApplications:     updateApplicationsArr,
                    workingApplications:    workingApplicationsArr
                };

            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
                return {
                    scopeApplications:  baseApplicationsArr,
                    wpApplications:     wpApplicationsArr,
                };

            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                // Need base design version apps and WP in scope apps
                return{
                    scopeApplications:  updateApplicationsArr,
                    wpApplications:     wpApplicationsArr,
                };
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:
                // Need just WP apps TODO: get feature files
                return {
                    wpApplications: wpApplicationsArr,
                    featureFiles: []
                };
        }
    }

    getComponent(componentId, userContext){

        if(userContext.designUpdateId === 'NONE'){
            return DesignComponentData.getDesignComponentById(componentId);
        } else {
            return DesignUpdateComponentData.getUpdateComponentById(componentId);
        }
    }

    // Get data for all nested design components inside the specified parent
    getComponentDataForParentComponent(childComponentType, view, designVersionId, designUpdateId, workPackageId, parentRefId, displayContext){
        let currentComponents = [];
        let wpComponents = [];

        //console.log("Looking for " + childComponentType + " data for view " + view + " and context " + displayContext + " with parent ref " + parentRefId);

        //const parentComponent = null;

        if(childComponentType === 'NONE'){
            return [];
        } else {

            switch (view) {
                case ViewType.DESIGN_NEW_EDIT:
                case ViewType.DESIGN_PUBLISHED_VIEW:

                    // Don't include removed components in this view if a completed updatable version
                    currentComponents = DesignComponentData.getNonRemovedChildComponentsOfType(designVersionId, childComponentType, parentRefId);

                    return currentComponents;

                case ViewType.DESIGN_UPDATABLE_VIEW:

                    switch (displayContext) {
                        case DisplayContext.MASH_UNIT_TESTS:
                        case DisplayContext.MASH_INT_TESTS:

                            // Don't include removed components in this view for test results
                            currentComponents = DesignComponentData.getNonRemovedChildComponentsOfType(designVersionId, childComponentType, parentRefId);
                            break;

                        default:

                            // Do include removed components in the current updates view
                            currentComponents = DesignComponentData.getChildComponentsOfType(designVersionId, childComponentType, parentRefId);
                    }
                    return currentComponents;

                case ViewType.DESIGN_UPDATE_EDIT:
                case ViewType.DESIGN_UPDATE_VIEW:
                    // DESIGN UPDATE:  Need to provide data in the context of SCOPE, EDIT, VIEW and BASE Design Version

                    //console.log("Looking for components for version in context: " + displayContext + " for DV " + designVersionId + " update " + designUpdateId + " with parent " + parentRefId);

                    switch (displayContext) {
                        case DisplayContext.UPDATE_EDIT:

                            // Display all DU components.  Only in-scope components exist.
                            currentComponents = DesignUpdateComponentData.getChildComponentsOfType(designUpdateId, childComponentType, parentRefId);
                            break;

                        case DisplayContext.UPDATE_VIEW:

                            // Display all DU components.  Don't include peer scope.
                            currentComponents = DesignUpdateComponentData.getNonPeerScopeChildComponentsOfType(designUpdateId, childComponentType, parentRefId);
                            break;

                        case DisplayContext.UPDATE_SCOPE:

                            // Display all design components in the base design so scope can be chosen
                            currentComponents = DesignComponentData.getExistingChildComponentsOfType(designVersionId, childComponentType, parentRefId);
                            break;

                        case DisplayContext.WORKING_VIEW:

                            // Display latest components in the working view
                            currentComponents = DesignComponentData.getChildComponentsOfType(designVersionId, childComponentType, parentRefId);
                            break;

                        //TODO - test data for Design Updates?
                    }

                    //console.log("Design update components found: " + currentComponents.length);

                    return currentComponents;

                case ViewType.WORK_PACKAGE_BASE_EDIT:
                case ViewType.WORK_PACKAGE_BASE_VIEW:
                case ViewType.DEVELOP_BASE_WP:
                    switch (displayContext) {
                        case DisplayContext.WP_SCOPE:

                            // Get all Design Components for the scope
                            currentComponents = DesignComponentData.getChildComponentsOfType(designVersionId, childComponentType, parentRefId);
                            break;

                        case DisplayContext.WP_VIEW:
                        case DisplayContext.DEV_DESIGN:
                        case DisplayContext.MASH_UNIT_TESTS:
                        case DisplayContext.MASH_INT_TESTS:

                            // Get only the Design Components that are in the WP

                            // Get the parent component
                            const parent = DesignComponentData.getDesignComponentByRef(designVersionId, parentRefId);

                            // Get the possible WP components
                            if (parent) {
                                wpComponents = WorkPackageComponentData.getChildComponentsOfType(workPackageId, childComponentType, parent.componentReferenceId);

                                wpComponents.forEach((wpComponent) => {

                                    let dvComponent = DesignComponentData.getDesignComponentByRef(designVersionId, wpComponent.componentReferenceId);

                                    if (dvComponent) {
                                        currentComponents.push(dvComponent);
                                    }
                                });
                            }
                            break;
                    }

                    //console.log("Found " + currentComponents.length + " components of type " + componentType + " for display context " + displayContext);

                    if (currentComponents.length > 0) {
                        return currentComponents;
                    } else {
                        return [];
                    }

                    break;

                case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                case ViewType.DEVELOP_UPDATE_WP:

                    switch (displayContext) {
                        case DisplayContext.WP_SCOPE:

                            // Get all Update Components for the scope.  Ignore Peer scope for Update WPs
                            currentComponents = DesignUpdateComponentData.getScopedChildComponentsOfType(designUpdateId, childComponentType, parentRefId);
                            break;

                        case DisplayContext.WP_VIEW:
                        case DisplayContext.DEV_DESIGN:
                        case DisplayContext.MASH_UNIT_TESTS:
                        case DisplayContext.MASH_INT_TESTS:

                            // Get only the Update Components that are in the WP

                            // TODO - parent id may be out of date when DU items are recreated...
                            // Get the parent component
                            const parent = DesignUpdateComponentData.getUpdateComponentByRef(designVersionId, designUpdateId, parentRefId);

                            // Get the possible WP components
                            if (parent) {
                                wpComponents = WorkPackageComponentData.getChildComponentsOfType(workPackageId, childComponentType, parent.componentReferenceId);

                                wpComponents.forEach((wpComponent) => {

                                    let duComponent = DesignUpdateComponentData.getUpdateComponentByRef(designVersionId, designUpdateId, wpComponent.componentReferenceId);

                                    if (duComponent) {
                                        currentComponents.push(duComponent);
                                    }
                                });
                            }

                            break;
                    }

                    if (currentComponents.length > 0) {
                        return currentComponents;
                    } else {
                        return [];
                    }

                    break;

            }
        }
    }

    // getBackgroundStepsInFeature(view, displayContext, stepContext, designId, designVersionId, updateId, featureReferenceId){
    //     let backgroundSteps = null;
    //
    //     //log((msg) => console.log(msg), LogLevel.TRACE, "Looking for feature background steps in feature: {}", featureReferenceId);
    //
    //     // Assume feature is in scope unless we find it isn't for an Update
    //     let featureInScope = true;
    //
    //     switch(view){
    //         case ViewType.DESIGN_NEW_EDIT:
    //         case ViewType.DESIGN_PUBLISHED_VIEW:
    //         case ViewType.DESIGN_UPDATABLE_VIEW:
    //         case ViewType.WORK_PACKAGE_BASE_EDIT:
    //         case ViewType.WORK_PACKAGE_BASE_VIEW:
    //         case ViewType.DEVELOP_BASE_WP:
    //
    //             backgroundSteps = FeatureBackgroundSteps.find(
    //                 {
    //                     designId: designId,
    //                     designVersionId: designVersionId,
    //                     designUpdateId: 'NONE',
    //                     featureReferenceId: featureReferenceId
    //                 },
    //                 {sort:{stepIndex: 1}}
    //             );
    //
    //             log((msg) => console.log(msg), LogLevel.TRACE, "Feature Background Steps found: {}", backgroundSteps.count());
    //
    //             return {
    //                 steps: backgroundSteps.fetch(),
    //                 displayContext: displayContext,
    //                 stepContext: stepContext,
    //                 parentReferenceId: featureReferenceId,
    //                 parentInScope: featureInScope
    //             };
    //
    //         case ViewType.DESIGN_UPDATE_EDIT:
    //         case ViewType.DESIGN_UPDATE_VIEW:
    //         case ViewType.WORK_PACKAGE_UPDATE_EDIT:
    //         case ViewType.WORK_PACKAGE_UPDATE_VIEW:
    //         case ViewType.DEVELOP_UPDATE_WP:
    //
    //             switch(displayContext){
    //                 case DisplayContext.UPDATE_EDIT:
    //                 case DisplayContext.UPDATE_VIEW:
    //                 case DisplayContext.WP_VIEW:
    //                     // Update data wanted
    //                     backgroundSteps = FeatureBackgroundSteps.find(
    //                         {
    //                             designId: designId,
    //                             designVersionId: designVersionId,
    //                             designUpdateId: updateId,
    //                             featureReferenceId: featureReferenceId
    //                         },
    //                         {sort:{stepIndex: 1}}
    //                     );
    //
    //                     log((msg) => console.log(msg), LogLevel.TRACE, "Update Feature Background Steps found: {}", backgroundSteps.count());
    //
    //                     // For updates, check if feature is REALLY in scope
    //                     const feature = DesignUpdateComponents.findOne(
    //                         {
    //                             designId: designId,
    //                             designVersionId: designVersionId,
    //                             designUpdateId: updateId,
    //                             componentType: ComponentType.FEATURE,
    //                             componentReferenceId: featureReferenceId
    //                         }
    //                     );
    //
    //                     if(feature){
    //                         featureInScope = (feature.scopeType === UpdateScopeType.SCOPE_IN_SCOPE);
    //                     }
    //
    //                     break;
    //
    //                 case DisplayContext.BASE_VIEW:
    //                     // Base design version data wanted
    //                     backgroundSteps = FeatureBackgroundSteps.find(
    //                         {
    //                             designId: designId,
    //                             designVersionId: designVersionId,
    //                             designUpdateId: 'NONE',
    //                             featureReferenceId: featureReferenceId
    //                         },
    //                         {sort:{stepIndex: 1}}
    //                     );
    //
    //                     log((msg) => console.log(msg), LogLevel.TRACE, "Update Base Background Steps found: {}", backgroundSteps.count());
    //
    //                     break;
    //             }
    //
    //             return {
    //                 steps: backgroundSteps.fetch(),
    //                 displayContext: displayContext,
    //                 stepContext: stepContext,
    //                 parentReferenceId: featureReferenceId,
    //                 parentInScope: featureInScope
    //             };
    //
    //         default:
    //             log((msg) => console.log(msg), LogLevel.ERROR, "INVALID VIEW TYPE!: {}", view);
    //     }
    //
    // }

    // getScenarioStepsInScenario(view, displayContext, stepContext, designId, designVersionId, updateId, scenarioReferenceId){
    //     let scenarioSteps = null;
    //
    //     // Assume all scenarios are in scope - will check update scenarios to see if they actually are
    //     let scenarioInScope = true;
    //
    //     switch(view){
    //         case ViewType.DESIGN_NEW_EDIT:
    //         case ViewType.DESIGN_PUBLISHED_VIEW:
    //         case ViewType.DESIGN_UPDATABLE_VIEW:
    //         case ViewType.WORK_PACKAGE_BASE_EDIT:
    //         case ViewType.WORK_PACKAGE_BASE_VIEW:
    //         case ViewType.DEVELOP_BASE_WP:
    //
    //             scenarioSteps = ScenarioSteps.find(
    //                 {
    //                     designId: designId,
    //                     designVersionId: designVersionId,
    //                     designUpdateId: 'NONE',
    //                     scenarioReferenceId: scenarioReferenceId,
    //                     isRemoved: false
    //                 },
    //                 {sort:{stepIndex: 1}}
    //             );
    //
    //             return {
    //                 steps: scenarioSteps.fetch(),
    //                 displayContext: displayContext,
    //                 stepContext: stepContext,
    //                 parentReferenceId: scenarioReferenceId,
    //                 parentInScope: scenarioInScope
    //             };
    //
    //         case ViewType.DESIGN_UPDATE_EDIT:
    //         case ViewType.DESIGN_UPDATE_VIEW:
    //         case ViewType.WORK_PACKAGE_UPDATE_EDIT:
    //         case ViewType.WORK_PACKAGE_UPDATE_VIEW:
    //         case ViewType.DEVELOP_UPDATE_WP:
    //
    //             switch(displayContext){
    //                 case DisplayContext.UPDATE_EDIT:
    //                 case DisplayContext.UPDATE_VIEW:
    //                     // Update data wanted
    //                     scenarioSteps = ScenarioSteps.find(
    //                         {
    //                             designId: designId,
    //                             designVersionId: designVersionId,
    //                             designUpdateId: updateId,
    //                             scenarioReferenceId: scenarioReferenceId
    //                         },
    //                         {sort:{stepIndex: 1}}
    //                     );
    //
    //                     // For updates, check if scenario is REALLY in scope
    //                     const scenario = DesignUpdateComponents.findOne(
    //                         {
    //                             designId: designId,
    //                             designVersionId: designVersionId,
    //                             designUpdateId: updateId,
    //                             componentType: ComponentType.SCENARIO,
    //                             componentReferenceId: scenarioReferenceId
    //                         }
    //                     );
    //
    //                     if(scenario){
    //                         scenarioInScope = (scenario.scopeType === UpdateScopeType.SCOPE_IN_SCOPE);
    //                     }
    //
    //                     break;
    //
    //                 case DisplayContext.BASE_VIEW:
    //                     // Base design version data wanted
    //                     scenarioSteps = ScenarioSteps.find(
    //                         {
    //                             designId: designId,
    //                             designVersionId: designVersionId,
    //                             designUpdateId: 'NONE',
    //                             scenarioReferenceId: scenarioReferenceId,
    //                             isRemoved: false
    //                         },
    //                         {sort:{stepIndex: 1}}
    //                     );
    //
    //                     break;
    //
    //                 default:
    //                     log((msg) => console.log(msg), LogLevel.ERROR, "INVALID DISPLAY CONTEXT TYPE!: {}", displayContext);
    //             }
    //
    //             return {
    //                 steps: scenarioSteps.fetch(),
    //                 displayContext: displayContext,
    //                 stepContext: stepContext,
    //                 parentReferenceId: scenarioReferenceId,
    //                 parentInScope: scenarioInScope
    //             };
    //
    //             break;
    //         default:
    //             log((msg) => console.log(msg), LogLevel.ERROR, "INVALID VIEW TYPE!: {}", view);
    //     }
    // }

    getTextDataForDesignComponent(userContext, view, displayContext){

        let newDisplayContext = displayContext;

        let selectedDesignComponent = null;
        //let relatedUpdateComponent = null;

        if(userContext && userContext.designComponentId !== 'NONE') {

            switch(view){
                case ViewType.DESIGN_NEW_EDIT:
                case ViewType.DESIGN_PUBLISHED_VIEW:
                case ViewType.WORK_PACKAGE_BASE_EDIT:
                case ViewType.WORK_PACKAGE_BASE_VIEW:
                case ViewType.DEVELOP_BASE_WP:
                case ViewType.DESIGN_UPDATABLE_VIEW:

                    selectedDesignComponent = DesignComponentData.getDesignComponentById(userContext.designComponentId);

                    break;

                case ViewType.DESIGN_UPDATE_EDIT:
                case ViewType.DESIGN_UPDATE_VIEW:
                case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                case ViewType.DEVELOP_UPDATE_WP:

                    selectedDesignComponent = DesignUpdateComponentData.getUpdateComponentById(userContext.designComponentId);

                    if(!selectedDesignComponent){
                        // Must be selecting from the DU scope...
                        selectedDesignComponent = DesignComponentData.getDesignComponentById(userContext.designComponentId);
                        newDisplayContext = DisplayContext.UPDATE_SCOPE;
                    }

                    break;

                default:
                    log((msg) => console.log(msg), LogLevel.ERROR, "INVALID VIEW TYPE!: {}", view);
            }

            return {
                currentDesignComponent: selectedDesignComponent,
                //currentUpdateComponent: relatedUpdateComponent,
                displayContext: newDisplayContext
            }
        } else {
            return {
                currentDesignComponent: null,
                //currentUpdateComponent: null,
                displayContext: displayContext,
            }
        }
    };

    getDomainDictionaryTerms(designId, designVersionId){

        // Just want all terms relevant to this design / design version
        //console.log ("Looking for Domain Dictionary terms for Design: " + designId + " and Design Version: " + designVersionId);

        const domainDictionaryItems = DomainDictionaryData.getAllTerms(designId, designVersionId);

        //console.log ("Domain Dictionary terms found: " + domainDictionaryItems.count());

        return {
            dictionaryTerms: domainDictionaryItems
        }
    };

    getScenarioMashData(userContext, featureAspectReferenceId, scenarioReferenceId = 'NONE'){

        // Return all scenario mash data for the current Feature Aspect or Scenario

        //console.log("looking for scenarios with FA: " + featureAspectReferenceId + " and SC: " + scenarioReferenceId);

        if(userContext.workPackageId === 'NONE') {

            // Get all scenarios

            if (scenarioReferenceId === 'NONE') {

                return UserDvMashScenarioData.getFeatureAspectScenarios(userContext.userId, userContext.designVersionId, featureAspectReferenceId);

            } else {

                return UserDvMashScenarioData.getScenarios(userContext.userId, userContext.designVersionId, featureAspectReferenceId, scenarioReferenceId);

            }
        } else {

            // Return only scenarios in the WP
            let scenarios = [];

            // Get the possible WP components
            let wpComponents = [];

            if(scenarioReferenceId === 'NONE') {

                wpComponents = WorkPackageComponentData.getActiveFeatureAspectScenarios(userContext.workPackageId, featureAspectReferenceId);

            } else {

                wpComponents = WorkPackageComponentData.getActiveFeatureAspectScenario(userContext.workPackageId, featureAspectReferenceId, scenarioReferenceId);

            }

            wpComponents.forEach((wpComponent) => {

                let mashScenario = UserDvMashScenarioData.getScenario(userContext, wpComponent.componentReferenceId);

                scenarios.push(mashScenario);
            });

            return scenarios;
        }
    }

    getMashScenarioTestResults(userContext, mashScenario, testType){

        return UserMashScenarioTestData.getScenarioTestsByType(userContext.userId, userContext.designVersionId, mashScenario.designScenarioReferenceId, testType);
    }

    // To be used when there is one test only of the given type for a Scenario
    getMashScenarioTestResult(userId, designVersionId, scenarioRef, testType){

        return UserMashScenarioTestData.getScenarioTestByType(userId, designVersionId, scenarioRef, testType);
    }


    // getMashScenarioSteps(userContext){
    //     // Returns steps for the current scenario that are:
    //     // 1. In Design Only
    //     // 2. Linked across Design - Dev
    //     // 3. In Dev Only (but with Scenario that is in Design)
    //
    //     log((msg) => console.log(msg), LogLevel.DEBUG, "Getting mash Scenario Steps for Scenario {}", userContext.scenarioReferenceId);
    //
    //     const designSteps = UserWorkPackageFeatureStepData.find(
    //         {
    //             userId:                         userContext.userId,
    //             designVersionId:                userContext.designVersionId,
    //             designUpdateId:                 userContext.designUpdateId,
    //             workPackageId:                  userContext.workPackageId,
    //             designScenarioReferenceId:      userContext.scenarioReferenceId,
    //             mashComponentType:              ComponentType.SCENARIO_STEP,
    //             accMashStatus:                  MashStatus.MASH_NOT_IMPLEMENTED
    //         },
    //         {sort: {mashItemIndex: 1}}
    //     ).fetch();
    //
    //     const linkedSteps = UserWorkPackageFeatureStepData.find(
    //         {
    //             userId:                         userContext.userId,
    //             designVersionId:                userContext.designVersionId,
    //             designUpdateId:                 userContext.designUpdateId,
    //             workPackageId:                  userContext.workPackageId,
    //             designScenarioReferenceId:      userContext.scenarioReferenceId,
    //             mashComponentType:              ComponentType.SCENARIO_STEP,
    //             accMashStatus:                  MashStatus.MASH_LINKED
    //         },
    //         {sort: {mashItemIndex: 1}}
    //     ).fetch();
    //
    //     const devSteps = UserWorkPackageFeatureStepData.find(
    //         {
    //             userId:                         userContext.userId,
    //             designVersionId:                userContext.designVersionId,
    //             designUpdateId:                 userContext.designUpdateId,
    //             workPackageId:                  userContext.workPackageId,
    //             designScenarioReferenceId:      userContext.scenarioReferenceId,
    //             mashComponentType:              ComponentType.SCENARIO_STEP,
    //             accMashStatus:                  MashStatus.MASH_NOT_DESIGNED
    //         },
    //         {sort: {mashItemIndex: 1}}
    //     ).fetch();
    //
    //     return({
    //         designSteps: designSteps,
    //         linkedSteps: linkedSteps,
    //         devSteps: devSteps,
    //     });
    // }

    // getDevFilesData(userContext){
    //
    //     // Get the data on feature files in the user's build area, split into:
    //     // - Relevant to current WP
    //     // - Relevant to wider design
    //     // - Unknown in Design
    //
    //     const wpFiles = UserDevFeatures.find({
    //         userId: userContext.userId,
    //         featureStatus: UserDevFeatureStatus.FEATURE_IN_WP
    //     }).fetch();
    //
    //     const designFiles = UserDevFeatures.find({
    //         userId: userContext.userId,
    //         featureStatus: UserDevFeatureStatus.FEATURE_IN_DESIGN
    //     }).fetch();
    //
    //     const unknownFiles = UserDevFeatures.find({
    //         userId: userContext.userId,
    //         featureStatus: UserDevFeatureStatus.FEATURE_UNKNOWN
    //     }).fetch();
    //
    //     return{
    //         wpFiles: wpFiles,
    //         designFiles: designFiles,
    //         unknownFiles: unknownFiles
    //     }
    //
    // };

    getTestSummaryData(scenario){

        const userContext = store.getState().currentUserItemContext;

        return UserDevTestSummaryData.getTestSummaryForScenario(userContext.userId, userContext.designVersionId, scenario.componentReferenceId, scenario.featureReferenceId);

        // NOTE: previously this was called - seems wrong but may have worked and may have set up incorrect expectations...

        // return UserDesignVersionMashScenarios.findOne({
        //     userId:                     userContext.userId,
        //     designVersionId:            scenario.designVersionId,
        //     designScenarioReferenceId:  scenario.componentReferenceId
        // });

    }

    getTestSummaryFeatureData(feature){

        const userContext = store.getState().currentUserItemContext;

        return UserDevTestSummaryData.getTestSummaryForFeature(userContext.userId, feature.designVersionId, feature.componentReferenceId);

    }

    // Call this common function whenever the current user options for the view and their values are needed
    getCurrentViewOptions(view, userViewOptions){

        let detailsOption= '';
        let detailsValue = false;
        let dictOption = '';
        let dictValue = false;
        let progressOption = '';
        let progressValue = false;
        let updSummaryOption = '';
        let updSummaryValue = false;
        let testSummaryOption = '';
        let testSummaryValue = false;
        let accTestOption = '';
        let accTestValue = false;
        let accFilesOption = '';
        let accFilesValue = false;
        let intTestOption = '';
        let intTestValue = false;
        let unitTestOption = '';
        let unitTestValue = false;
        let allAsTabsOption = '';
        let allAsTabsValue = false;


        // Get the correct user view options for the view context
        switch(view){
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
                detailsOption = ViewOptionType.DESIGN_DETAILS;
                detailsValue = userViewOptions.designDetailsVisible;
                dictOption = ViewOptionType.DESIGN_DICT;
                dictValue = userViewOptions.designDomainDictVisible;
                testSummaryOption = ViewOptionType.DESIGN_TEST_SUMMARY;
                testSummaryValue = userViewOptions.testSummaryVisible;
                intTestOption = ViewOptionType.DEV_INT_TESTS;
                intTestValue = userViewOptions.devIntTestsVisible;
                unitTestOption = ViewOptionType.DEV_UNIT_TESTS;
                unitTestValue = userViewOptions.devUnitTestsVisible;
                allAsTabsOption = ViewOptionType.DESIGN_ALL_AS_TABS;
                allAsTabsValue = userViewOptions.designShowAllAsTabs;
                break;
            case ViewType.DESIGN_UPDATABLE_VIEW:
                detailsOption = ViewOptionType.DESIGN_DETAILS;
                detailsValue = userViewOptions.designDetailsVisible;
                dictOption = ViewOptionType.DESIGN_DICT;
                dictValue = userViewOptions.designDomainDictVisible;
                testSummaryOption = ViewOptionType.DESIGN_TEST_SUMMARY;
                testSummaryValue = userViewOptions.testSummaryVisible;
                intTestOption = ViewOptionType.DEV_INT_TESTS;
                intTestValue = userViewOptions.devIntTestsVisible;
                unitTestOption = ViewOptionType.DEV_UNIT_TESTS;
                unitTestValue = userViewOptions.devUnitTestsVisible;
                allAsTabsOption = ViewOptionType.DESIGN_ALL_AS_TABS;
                allAsTabsValue = userViewOptions.designShowAllAsTabs;
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
                detailsOption = ViewOptionType.UPDATE_DETAILS;
                detailsValue = userViewOptions.designDetailsVisible;
                progressOption = ViewOptionType.UPDATE_PROGRESS;
                progressValue = userViewOptions.updateProgressVisible;
                updSummaryOption = ViewOptionType.UPDATE_SUMMARY;
                updSummaryValue = userViewOptions.updateSummaryVisible;
                dictOption = ViewOptionType.UPDATE_DICT;
                dictValue = userViewOptions.designDomainDictVisible;
                testSummaryOption = ViewOptionType.UPDATE_TEST_SUMMARY;
                testSummaryValue = userViewOptions.testSummaryVisible;
                allAsTabsOption = ViewOptionType.UPDATE_ALL_AS_TABS;
                allAsTabsValue = userViewOptions.updateShowAllAsTabs;
                break;
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                detailsOption = ViewOptionType.WP_DETAILS;
                detailsValue = userViewOptions.designDetailsVisible;
                dictOption = ViewOptionType.WP_DICT;
                dictValue = userViewOptions.designDomainDictVisible;
                testSummaryOption = ViewOptionType.DESIGN_TEST_SUMMARY;
                testSummaryValue = userViewOptions.testSummaryVisible;
                allAsTabsOption = ViewOptionType.WORK_ALL_AS_TABS;
                allAsTabsValue = userViewOptions.workShowAllAsTabs;
                break;
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                dictOption = ViewOptionType.WP_DICT;
                dictValue = userViewOptions.designDomainDictVisible;
                testSummaryOption = ViewOptionType.DEV_TEST_SUMMARY;
                testSummaryValue = userViewOptions.testSummaryVisible;
                break;
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:
                detailsOption = ViewOptionType.DEV_DETAILS;
                detailsValue = userViewOptions.designDetailsVisible;
                accTestOption = ViewOptionType.DEV_ACC_TESTS;
                accTestValue = userViewOptions.devAccTestsVisible;
                accFilesOption = ViewOptionType.DEV_FILES;
                accFilesValue = userViewOptions.devFeatureFilesVisible;
                intTestOption = ViewOptionType.DEV_INT_TESTS;
                intTestValue = userViewOptions.devIntTestsVisible;
                unitTestOption = ViewOptionType.DEV_UNIT_TESTS;
                unitTestValue = userViewOptions.devUnitTestsVisible;
                dictOption = ViewOptionType.DEV_DICT;
                dictValue = userViewOptions.designDomainDictVisible;
                testSummaryOption = ViewOptionType.DEV_TEST_SUMMARY;
                testSummaryValue = userViewOptions.testSummaryVisible;
                allAsTabsOption = ViewOptionType.WORK_ALL_AS_TABS;
                allAsTabsValue = userViewOptions.workShowAllAsTabs;
                break;
        }

        return{
            details:        {option: detailsOption, value: detailsValue},
            progress:       {option: progressOption, value: progressValue},
            updateSummary:  {option: updSummaryOption, value: updSummaryValue},
            testSummary:    {option: testSummaryOption, value: testSummaryValue},
            dictionary:     {option: dictOption, value: dictValue},
            accTests:       {option: accTestOption, value: accTestValue},
            accFiles:       {option: accFilesOption, value: accFilesValue},
            intTests:       {option: intTestOption, value: intTestValue},
            unitTests:      {option: unitTestOption, value: unitTestValue},
            allAsTabs:      {option: allAsTabsOption, value: allAsTabsValue}
        }

    }

    getCurrentOptionForDetailsView(view, userViewOptions, detailsView){

        const currentOptions = this.getCurrentViewOptions(view, userViewOptions);

        switch(detailsView){
            case DetailsViewType.VIEW_DOM_DICT:
                return currentOptions.dictionary;

            case DetailsViewType.VIEW_DETAILS_NEW:
                return currentOptions.details;

            case DetailsViewType.VIEW_UPD_SUMM:
                return currentOptions.updateSummary;

            case DetailsViewType.VIEW_INT_TESTS:
               return currentOptions.intTests;

            case DetailsViewType.VIEW_UNIT_TESTS:
               return currentOptions.unitTests;

            case DetailsViewType.VIEW_ACC_TESTS:
                return currentOptions.accTests;

            case DetailsViewType.VIEW_ACC_FILES:
                return currentOptions.accFiles;

            case DetailsViewType.VIEW_ALL_AS_TABS:
                return currentOptions.allAsTabs;

            case DetailsViewType.VIEW_VERSION_PROGRESS:
                return currentOptions.progress;
        }
    }
    getDropdownMenuItems(menuType, view, mode, userRole, userViewOptions){


        log((msg) => console.log(msg), LogLevel.TRACE, "Getting menu items for menu {} in view {}", menuType, view);

        const currentOptions = this.getCurrentViewOptions(view, userViewOptions);

        // Dropdown Items - Go To
        const gotoDesigns = {
            key: MenuAction.MENU_ACTION_GOTO_DESIGNS,
            itemName: TextLookups.menuItems(MenuAction.MENU_ACTION_GOTO_DESIGNS),
            action: MenuAction.MENU_ACTION_GOTO_DESIGNS,
            hasCheckbox: false,
            checkboxValue: false,
            viewOptionType: ViewOptionType.NONE
        };

        const gotoConfig = {
            key: MenuAction.MENU_ACTION_GOTO_CONFIG,
            itemName: TextLookups.menuItems(MenuAction.MENU_ACTION_GOTO_CONFIG),
            action: MenuAction.MENU_ACTION_GOTO_CONFIG,
            hasCheckbox: false,
            checkboxValue: false,
            viewOptionType: ViewOptionType.NONE
        };

        const gotoSelection = {
            key: MenuAction.MENU_ACTION_GOTO_SELECTION,
            itemName: TextLookups.menuItems(MenuAction.MENU_ACTION_GOTO_SELECTION),
            action: MenuAction.MENU_ACTION_GOTO_SELECTION,
            hasCheckbox: false,
            checkboxValue: false,
            viewOptionType: ViewOptionType.NONE
        };

        // Dropdown Items - View
        const viewDetails = {
            key: MenuAction.MENU_ACTION_VIEW_DETAILS,
            itemName: TextLookups.menuItems(MenuAction.MENU_ACTION_VIEW_DETAILS),
            action: MenuAction.MENU_ACTION_VIEW_DETAILS,
            hasCheckbox: true,
            checkboxValue: currentOptions.details.value,
            viewOptionType: currentOptions.details.option
        };

        const viewProgress = {
            key: MenuAction.MENU_ACTION_VIEW_PROGRESS,
            itemName: TextLookups.menuItems(MenuAction.MENU_ACTION_VIEW_PROGRESS),
            action: MenuAction.MENU_ACTION_VIEW_PROGRESS,
            hasCheckbox: true,
            checkboxValue: currentOptions.progress.value,
            viewOptionType: currentOptions.progress.option
        };

        const viewUpdateSummary = {
            key: MenuAction.MENU_ACTION_VIEW_UPD_SUMM,
            itemName: TextLookups.menuItems(MenuAction.MENU_ACTION_VIEW_UPD_SUMM),
            action: MenuAction.MENU_ACTION_VIEW_UPD_SUMM,
            hasCheckbox: true,
            checkboxValue: currentOptions.updateSummary.value,
            viewOptionType: currentOptions.updateSummary.option
        };

        const viewTestSummary = {
            key: MenuAction.MENU_ACTION_VIEW_TEST_SUMM,
            itemName: TextLookups.menuItems(MenuAction.MENU_ACTION_VIEW_TEST_SUMM),
            action: MenuAction.MENU_ACTION_VIEW_TEST_SUMM,
            hasCheckbox: true,
            checkboxValue: currentOptions.testSummary.value,
            viewOptionType: currentOptions.testSummary.option
        };

        const viewAccTests = {
            key: MenuAction.MENU_ACTION_VIEW_ACC_TESTS,
            itemName: TextLookups.menuItems(MenuAction.MENU_ACTION_VIEW_ACC_TESTS),
            action: MenuAction.MENU_ACTION_VIEW_ACC_TESTS,
            hasCheckbox: true,
            checkboxValue: currentOptions.accTests.value,
            viewOptionType: currentOptions.accTests.option
        };

        const viewIntTests = {
            key: MenuAction.MENU_ACTION_VIEW_INT_TESTS,
            itemName: TextLookups.menuItems(MenuAction.MENU_ACTION_VIEW_INT_TESTS),
            action: MenuAction.MENU_ACTION_VIEW_INT_TESTS,
            hasCheckbox: true,
            checkboxValue: currentOptions.intTests.value,
            viewOptionType: currentOptions.intTests.option
        };

        const viewUnitTests = {
            key: MenuAction.MENU_ACTION_VIEW_UNIT_TESTS,
            itemName: TextLookups.menuItems(MenuAction.MENU_ACTION_VIEW_UNIT_TESTS),
            action: MenuAction.MENU_ACTION_VIEW_UNIT_TESTS,
            hasCheckbox: true,
            checkboxValue: currentOptions.unitTests.value,
            viewOptionType: currentOptions.unitTests.option
        };

        const viewAccFiles = {
            key: MenuAction.MENU_ACTION_VIEW_ACC_FILES,
            itemName: TextLookups.menuItems(MenuAction.MENU_ACTION_VIEW_ACC_FILES),
            action: MenuAction.MENU_ACTION_VIEW_ACC_FILES,
            hasCheckbox: true,
            checkboxValue: currentOptions.accFiles.value,
            viewOptionType: currentOptions.accFiles.option
        };

        const viewDomainDict = {
            key: MenuAction.MENU_ACTION_VIEW_DICT,
            itemName: TextLookups.menuItems(MenuAction.MENU_ACTION_VIEW_DICT),
            action: MenuAction.MENU_ACTION_VIEW_DICT,
            hasCheckbox: true,
            checkboxValue: currentOptions.dictionary.value,
            viewOptionType: currentOptions.dictionary.option
        };

        const viewAllAsTabs = {
            key: MenuAction.MENU_ACTION_VIEW_ALL_TABS,
            itemName: TextLookups.menuItems(MenuAction.MENU_ACTION_VIEW_ALL_TABS),
            action: MenuAction.MENU_ACTION_VIEW_ALL_TABS,
            hasCheckbox: true,
            checkboxValue: currentOptions.allAsTabs.value,
            viewOptionType: currentOptions.allAsTabs.option
        };

        // Dropdown Items - Refresh
        const refreshTestData = {
            key: MenuAction.MENU_ACTION_REFRESH_TESTS,
            itemName: TextLookups.menuItems(MenuAction.MENU_ACTION_REFRESH_TESTS),
            action: MenuAction.MENU_ACTION_REFRESH_TESTS,
            hasCheckbox: false,
            checkboxValue: false,
            viewOptionType: ViewOptionType.NONE
        };

        const refreshProgressData = {
            key: MenuAction.MENU_ACTION_REFRESH_PROGRESS,
            itemName: TextLookups.menuItems(MenuAction.MENU_ACTION_REFRESH_PROGRESS),
            action: MenuAction.MENU_ACTION_REFRESH_PROGRESS,
            hasCheckbox: false,
            checkboxValue: false,
            viewOptionType: ViewOptionType.NONE
        };

        // TODO - Currently unused.  Possible option for different level of data refresh
        const refreshAllData = {
            key: MenuAction.MENU_ACTION_REFRESH_DATA,
            itemName: TextLookups.menuItems(MenuAction.MENU_ACTION_REFRESH_DATA),
            action: MenuAction.MENU_ACTION_REFRESH_DATA,
            hasCheckbox: false,
            checkboxValue: false,
            viewOptionType: ViewOptionType.NONE
        };

        switch(view) {

            case ViewType.ADMIN:

                switch (menuType) {
                    case MenuDropdown.MENU_DROPDOWN_GOTO:
                        return [gotoDesigns];

                }
                break;

            case ViewType.CONFIGURE:

                switch (menuType) {
                    case MenuDropdown.MENU_DROPDOWN_GOTO:
                        return [gotoSelection, gotoDesigns];
                }
                break;

            case ViewType.SELECT:

                switch (menuType) {
                    case MenuDropdown.MENU_DROPDOWN_GOTO:
                        return [gotoConfig, gotoDesigns];
                        break;
                    case MenuDropdown.MENU_DROPDOWN_REFRESH:
                        return [
                            refreshProgressData,
                            refreshTestData
                        ];

                }
                break;

            case ViewType.DESIGNS:

                switch (menuType) {
                    case MenuDropdown.MENU_DROPDOWN_GOTO:
                        return [gotoSelection, gotoConfig];
                }
                break;

            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:
                switch (menuType) {
                    case MenuDropdown.MENU_DROPDOWN_GOTO:
                        return  [
                                gotoSelection,
                                gotoConfig,
                                gotoDesigns
                            ];

                    case MenuDropdown.MENU_DROPDOWN_VIEW:

                        return [
                            viewDetails,
                            viewDomainDict,
                            viewIntTests,
                            viewUnitTests,
                            viewTestSummary,
                            viewAllAsTabs
                        ];

                    case MenuDropdown.MENU_DROPDOWN_REFRESH:

                        return [
                            refreshTestData
                        ];

                }
                break;

            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:

                switch (menuType) {
                    case MenuDropdown.MENU_DROPDOWN_GOTO:
                        return  [
                            gotoSelection,
                            gotoConfig,
                            gotoDesigns
                        ];

                    case MenuDropdown.MENU_DROPDOWN_VIEW:
                        return [
                            viewDomainDict,
                            viewTestSummary
                        ];

                    case MenuDropdown.MENU_DROPDOWN_REFRESH:
                        return [
                            refreshTestData
                        ];
                }
                break;

            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:

                switch (menuType) {
                    case MenuDropdown.MENU_DROPDOWN_GOTO:
                        return [
                            gotoSelection,
                            gotoConfig,
                            gotoDesigns
                        ];

                    case MenuDropdown.MENU_DROPDOWN_VIEW:

                        return [
                            viewDetails,
                            viewProgress,
                            viewUpdateSummary,
                            viewDomainDict,
                            viewTestSummary,
                            viewAllAsTabs
                        ];

                    case MenuDropdown.MENU_DROPDOWN_REFRESH:

                        return [
                            refreshTestData
                        ];

                }
                break;

            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:

                switch (menuType) {
                    case MenuDropdown.MENU_DROPDOWN_GOTO:
                        return [
                            gotoSelection,
                            gotoConfig,
                            gotoDesigns
                        ];

                    case MenuDropdown.MENU_DROPDOWN_VIEW:
                        return [
                            viewDetails,
                            viewDomainDict,
                            viewTestSummary,
                            viewAllAsTabs
                        ];

                    case MenuDropdown.MENU_DROPDOWN_REFRESH:

                        return [
                            refreshTestData
                        ];
                }
                break;

            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:

                switch (menuType) {
                    case MenuDropdown.MENU_DROPDOWN_GOTO:
                        return [
                            gotoSelection,
                            gotoConfig,
                            gotoDesigns
                        ];

                    case MenuDropdown.MENU_DROPDOWN_VIEW:
                        return [
                            viewDetails,
                            viewDomainDict,
                            viewAccTests,
                            viewAccFiles,
                            viewIntTests,
                            viewUnitTests,
                            viewTestSummary,
                            viewAllAsTabs
                        ];

                    case MenuDropdown.MENU_DROPDOWN_REFRESH:
                        return [
                            refreshTestData
                        ];
                }
                break;

            default:
                return  [];
        }

    }

    getWorkProgressDvItems(userContext){

        let dvWorkPackages = [];
        let dvDesignUpdates = [];
        let dvAllItem = null;
        let dvItem = null;

        log((msg) => console.log(msg), LogLevel.DEBUG, "Getting Progress Data for DV {}", userContext.designVersionId);

        const userRoles = UserRoleData.getRoleByUserId(userContext.userId);

        if(userContext.designVersionId === 'NONE'){
            return{
                dvAllItem:          dvAllItem,
                dvItem:             dvItem,
                dvWorkPackages:     dvWorkPackages,
                dvDesignUpdates:    dvDesignUpdates,
                userRoles:          userRoles
            }
        }

        const dv = DesignVersionData.getDesignVersionById(userContext.designVersionId);

        switch(dv.designVersionStatus){
            case DesignVersionStatus.VERSION_NEW:
            case DesignVersionStatus.VERSION_DRAFT:
            case DesignVersionStatus.VERSION_DRAFT_COMPLETE:

                // Get summary for base Design Version
                dvItem = UserWorkProgressSummaryData.getHeaderSummaryItem(
                    userContext.userId,
                    userContext.designVersionId,
                    WorkSummaryType.WORK_SUMMARY_BASE_DV
                );

                // Get Base WP summaries
                dvWorkPackages = UserWorkProgressSummaryData.getSummaryListItems(
                    userContext.userId,
                    userContext.designVersionId,
                    WorkSummaryType.WORK_SUMMARY_BASE_WP
                );
                break;

            default:

                // Get All scenarios item
                dvAllItem = UserWorkProgressSummaryData.getHeaderSummaryItem(
                    userContext.userId,
                    userContext.designVersionId,
                    WorkSummaryType.WORK_SUMMARY_UPDATE_DV_ALL
                );

                // Get update scenarios item
                dvItem = UserWorkProgressSummaryData.getHeaderSummaryItem(
                    userContext.userId,
                    userContext.designVersionId,
                    WorkSummaryType.WORK_SUMMARY_UPDATE_DV
                );

                // Get DU summaries
                dvDesignUpdates = UserWorkProgressSummaryData.getSummaryListItems(
                    userContext.userId,
                    userContext.designVersionId,
                    WorkSummaryType.WORK_SUMMARY_UPDATE
                );
        }

        log((msg) => console.log(msg), LogLevel.DEBUG, "Returning WPs {}  DUs: {}", dvWorkPackages.length, dvDesignUpdates.length);

        return{
            dvAllItem:          dvAllItem,
            dvItem:             dvItem,
            dvWorkPackages:     dvWorkPackages,
            dvDesignUpdates:    dvDesignUpdates,
            userRoles:          userRoles
        }
    }

    getWorkProgressDuWorkPackages(userContext, designUpdateId){

        let duWorkPackages = [];

        const userRoles = UserRoleData.getRoleByUserId(userContext.userId);

        if(designUpdateId === 'NONE'){
            return{
                duWorkPackages:     duWorkPackages,
                userRoles:          userRoles
            }
        }

        duWorkPackages = UserWorkProgressSummaryData.getUpdateSummaryListItems(
            userContext.userId,
            userContext.designVersionId,
            designUpdateId,
            WorkSummaryType.WORK_SUMMARY_UPDATE_WP
        );

        return{
            duWorkPackages:     duWorkPackages,
            userRoles:          userRoles
        }

    }


    getMatchingScenarios(searchString, userContext){

        // Find Scenarios containing the search string
        let searchRegex = new RegExp(searchString);
        let results = [];

        const matchingScenarios = DesignComponentData.getRegexMatchingScenarios(userContext.designVersionId, searchRegex);

        // Don't start displaying until there is a reasonable filter
        if(matchingScenarios.length > 50){
            return [
                {
                    id:             'NONE',
                    scenarioName:   'More than 50 matching scenarios',
                    featureName:    ''
                }
            ];
        } else {

            matchingScenarios.forEach((scenario) => {
                // Get feature name
                let feature = DesignComponentData.getDesignComponentByRef(userContext.designVersionId, scenario.componentFeatureReferenceIdNew);

                let featureName = 'Unknown';

                if (feature) {
                    featureName = feature.componentNameNew
                }

                let result = {
                    id:             scenario._id,
                    scenarioName:   scenario.componentNameNew,
                    featureName:    featureName
                };

                results.push(result);
            });

            return results;
        }
    }

}

export default new ClientDataServices();