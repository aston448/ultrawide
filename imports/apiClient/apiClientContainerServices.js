
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';

// Ultrawide Collections
import { AppGlobalData }                    from '../collections/app/app_global_data.js';
import { UserRoles }                        from '../collections/users/user_roles.js';
import { DesignBackups }                    from '../collections/backup/design_backups.js';
import { UserCurrentEditContext }           from '../collections/context/user_current_edit_context.js';
import { Designs }                          from '../collections/design/designs.js';
import { DesignVersions }                   from '../collections/design/design_versions.js';
import { DesignUpdates }                    from '../collections/design_update/design_updates.js';
import { WorkPackages }                     from '../collections/work/work_packages.js';
import { WorkPackageComponents }            from '../collections/work/work_package_components.js';
import { DesignVersionComponents }          from '../collections/design/design_version_components.js';
import { DesignUpdateComponents }           from '../collections/design_update/design_update_components.js';
import { FeatureBackgroundSteps }           from '../collections/design/feature_background_steps.js';
import { ScenarioSteps }                    from '../collections/design/scenario_steps.js';
import { DomainDictionary }                 from '../collections/design/domain_dictionary.js';
import { UserDevFeatures }                  from '../collections/dev/user_dev_features.js';
import { UserWorkPackageMashData }          from '../collections/dev/user_work_package_mash_data.js';
import { UserWorkPackageFeatureStepData }   from '../collections/dev/user_work_package_feature_step_data.js';
import { UserUnitTestMashData }             from '../collections/dev/user_unit_test_mash_data.js';
import { UserDevTestSummaryData }           from '../collections/summary/user_dev_test_summary_data.js';
import { UserDevDesignSummaryData }         from '../collections/summary/user_dev_design_summary_data.js';
import { UserAccTestResults }               from '../collections/dev/user_acc_test_results.js';
import { TestOutputLocations }              from '../collections/configure/test_output_locations.js';
import { TestOutputLocationFiles }          from '../collections/configure/test_output_location_files.js';
import { UserTestTypeLocations }            from '../collections/configure/user_test_type_locations.js';
import { UserDesignVersionMashScenarios }   from '../collections/mash/user_dv_mash_scenarios.js';
import { UserWorkProgressSummary }          from '../collections/summary/user_work_progress_summary.js';

// Ultrawide GUI Components


// Ultrawide Services
import { RoleType, ComponentType, ViewType, ViewMode, ViewOptionType, DisplayContext, DesignVersionStatus, DesignUpdateStatus,
    StepContext, WorkPackageType, WorkPackageStatus, UserDevFeatureStatus, MashStatus, LogLevel,
    TestLocationType, UltrawideAction, MessageType, MenuDropdown, MenuAction, DetailsViewType,
    UpdateMergeStatus, UpdateScopeType, WorkPackageScopeType, DesignUpdateMergeAction, WorkSummaryType } from '../constants/constants.js';

import ClientDesignServices             from './apiClientDesign.js';
import ClientTestOutputLocationServices from '../apiClient/apiClientTestOutputLocations.js';
import ClientUserContextServices        from '../apiClient/apiClientUserContext.js';

import { log } from '../common/utils.js';
import TextLookups from '../common/lookups.js';

// REDUX services
import store from '../redux/store'
import { setDesignVersionDataLoadedTo, setWorkPackageDataLoadedTo, setTestIntegrationDataLoadedTo, updateUserMessage } from '../redux/actions'


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Container Services - Functions to return the data required for various GUI components
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientContainerServices{

    getApplicationData(){

        if(Meteor.isClient) {

            // Subscribing to these here makes them available to the whole app...
            const agHandle = Meteor.subscribe('appGlobalData');
            const urHandle = Meteor.subscribe('userRoles');
            const dbHandle = Meteor.subscribe('designBackups');
            const usHandle = Meteor.subscribe('userSettings');
            const ucHandle = Meteor.subscribe('userCurrentEditContext');
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

    getUserData(userContext){

        if(Meteor.isClient) {

            const currentUser = UserRoles.findOne({userId: userContext.userId});

            return {
                user: currentUser
            }
        }

    };

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
                const mmHandle = Meteor.subscribe('userUnitTestMashData', userContext.userId);
                const arHandle = Meteor.subscribe('userAccTestResults', userContext.userId);
                const irHandle = Meteor.subscribe('userIntTestResults', userContext.userId);
                const mrHandle = Meteor.subscribe('userUnitTestResults', userContext.userId);
                const tsHandle = Meteor.subscribe('userDevTestSummaryData', userContext.userId);
                const dsHandle = Meteor.subscribe('userDevDesignSummaryData', userContext.userId);
                const dusHandle = Meteor.subscribe('userDesignUpdateSummary', userContext.userId);
                const psHandle = Meteor.subscribe('userWorkProgressSummary', userContext.userId);

                Tracker.autorun((loader) => {

                    let loading = (
                        !dusHandle.ready() ||
                        !dvcHandle.ready() || !ducHandle.ready() || !fbHandle.ready() ||
                        !ssHandle.ready() || !ddHandle.ready() || !dvmHandle.ready() || !mmHandle.ready() ||
                        !arHandle.ready() || !irHandle.ready() || !mrHandle.ready() || !tsHandle.ready() ||
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

    getWorkPackageData(userContext, callback){

        if(Meteor.isClient) {

            console.log("In getWorkPackageData with callback " + callback);

            if (store.getState().workPackageDataLoaded) {

                if (callback) {
                    callback()
                }
            } else {

                store.dispatch(updateUserMessage({
                    messageType: MessageType.WARNING,
                    messageText: 'FETCHING WORK PACKAGE DATA FROM SERVER...'
                }));

                log((msg) => console.log(msg), LogLevel.DEBUG, "Getting Work Package Data for DV {}, WP {}", userContext.designVersionId, userContext.workPackageId);

                let wcHandle = Meteor.subscribe('workPackageComponents', userContext.designVersionId, userContext.workPackageId);

                Tracker.autorun((loader) => {

                    let loading = !wcHandle.ready();

                    log((msg) => console.log(msg), LogLevel.DEBUG, "loading WP = {}", loading);

                    if (!loading) {
                        // Mark data as loaded
                        store.dispatch(setWorkPackageDataLoadedTo(true));

                        store.dispatch(updateUserMessage({
                            messageType: MessageType.INFO,
                            messageText: 'Work Package data loaded'
                        }));

                        // Set open items now that data is loaded
                        ClientUserContextServices.setOpenWorkPackageItems(userContext);

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
    //             const tsHandle = Meteor.subscribe('userDevTestSummaryData', userId);
    //             const dsHandle = Meteor.subscribe('userDevDesignSummaryData', userId);
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
        return UserRoles.find({
            isAdmin: false
        }).fetch();
    }

    // Design Backups
    getDesignBackups(){

        return DesignBackups.find({}).fetch();
    }

    // Global Data store
    getDataStore(){

        const appData = AppGlobalData.findOne({
            versionKey: 'CURRENT_VERSION'
        });

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
        return TestOutputLocations.find({
           $or:[{locationIsShared: true}, {locationUserId: userId}]
        }).fetch();

    }

    // Files for a Test Output Location
    getTestOutputLocationFiles(locationId){

        return TestOutputLocationFiles.find({locationId: locationId}).fetch();
    }

    // User configuration of Test Outputs
    getUserTestOutputLocationData(userContext, userRole){

        // Updates the user data with the latest locations
        ClientTestOutputLocationServices.updateUserConfiguration(userContext.userId);

        return UserTestTypeLocations.find({
            userId: userContext.userId
        }).fetch();
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
                    currentDesign = Designs.findOne({_id: userContext.designId});
                    break;
                case ViewType.SELECT:
                case ViewType.DESIGN_NEW_EDIT:
                case ViewType.DESIGN_PUBLISHED_VIEW:
                case ViewType.DESIGN_UPDATABLE_VIEW:
                    // Get the current design version which should be set for these views
                    currentDesign = Designs.findOne({_id: userContext.designId});
                    currentDesignVersion = DesignVersions.findOne({_id: userContext.designVersionId});
                    break;
                case ViewType.DESIGN_UPDATE_EDIT:
                case ViewType.DESIGN_UPDATE_VIEW:
                    // Get the current design version + update which should be set for these views
                    currentDesign = Designs.findOne({_id: userContext.designId});
                    currentDesignVersion = DesignVersions.findOne({_id: userContext.designVersionId});
                    currentDesignUpdate = DesignUpdates.findOne({_id: userContext.designUpdateId});
                    break;
                case ViewType.WORK_PACKAGE_BASE_EDIT:
                case ViewType.WORK_PACKAGE_BASE_VIEW:
                case ViewType.DEVELOP_BASE_WP:
                    currentDesign = Designs.findOne({_id: userContext.designId});
                    currentDesignVersion = DesignVersions.findOne({_id: userContext.designVersionId});
                    currentWorkPackage = WorkPackages.findOne({_id: userContext.workPackageId});
                    break;
                case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                case ViewType.DEVELOP_UPDATE_WP:
                    currentDesign = Designs.findOne({_id: userContext.designId});
                    currentDesignVersion = DesignVersions.findOne({_id: userContext.designVersionId});
                    currentDesignUpdate = DesignUpdates.findOne({_id: userContext.designUpdateId});
                    currentWorkPackage = WorkPackages.findOne({_id: userContext.workPackageId});
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
        const user = UserRoles.findOne({userId: userId});

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
                roleActions.push(UltrawideAction.ACTION_TEST_CONFIGURE);
                break;
            case RoleType.DEVELOPER:
                roleActions.push(UltrawideAction.ACTION_HOME);
                roleActions.push(UltrawideAction.ACTION_DESIGNS);
                roleActions.push(UltrawideAction.ACTION_LAST_DEVELOPER);
                roleActions.push(UltrawideAction.ACTION_TEST_CONFIGURE);
                break;
            case RoleType.MANAGER:
                roleActions.push(UltrawideAction.ACTION_HOME);
                roleActions.push(UltrawideAction.ACTION_DESIGNS);
                roleActions.push(UltrawideAction.ACTION_LAST_MANAGER);
                roleActions.push(UltrawideAction.ACTION_TEST_CONFIGURE);
        }

        return roleActions;
    }

    // Get a list of known Designs
    getUltrawideDesigns(){

        // Get all the designs available
        const currentDesigns = Designs.find({}, {sort: {designName: 1}});

        return {
            designs: currentDesigns.fetch(),
        };

    }

    // Get a list of known Design Versions for the current Design
    getDesignVersionsForCurrentDesign(currentDesignId){

        // No action if design not yet set
        if (currentDesignId != 'NONE') {
            // Get all the designs versions available
            const currentDesignVersions = DesignVersions.find(
                {designId: currentDesignId},
                {sort: {designVersionIndex: 1}}
            );

            return {
                designVersions: currentDesignVersions.fetch(),
            };

        } else {
            return {designVersions: []};
        }
    };

    // Get a list of Work Packages for a base Design Version
    getWorkPackagesForCurrentDesignVersion(currentDesignVersionId){

        // No action if design version not yet set
        if (currentDesignVersionId != 'NONE') {

            // Get New WPS
            const newWorkPackages = WorkPackages.find(
                {
                    designVersionId: currentDesignVersionId,
                    workPackageType: WorkPackageType.WP_BASE,
                    workPackageStatus: WorkPackageStatus.WP_NEW
                },
                {sort: {workPackageName: 1}}
            ).fetch();

            // Get Available WPS
            const availableWorkPackages = WorkPackages.find(
                {
                    designVersionId: currentDesignVersionId,
                    workPackageType: WorkPackageType.WP_BASE,
                    workPackageStatus: WorkPackageStatus.WP_AVAILABLE
                },
                {sort: {workPackageName: 1}}
            ).fetch();

            // Get Adopted WPS
            const adoptedWorkPackages = WorkPackages.find(
                {
                    designVersionId: currentDesignVersionId,
                    workPackageType: WorkPackageType.WP_BASE,
                    workPackageStatus: WorkPackageStatus.WP_ADOPTED
                },
                {sort: {workPackageName: 1}}
            ).fetch();

            // Get the status of the current design version
            const designVersionStatus = DesignVersions.findOne({_id: currentDesignVersionId}).designVersionStatus;

            //console.log("Base WPs found found: " + currentWorkPackages.count());

            return {
                wpType: WorkPackageType.WP_BASE,
                newWorkPackages: newWorkPackages,
                availableWorkPackages: availableWorkPackages,
                adoptedWorkPackages: adoptedWorkPackages,
                designVersionStatus: designVersionStatus
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

        if(currentDesignVersionId != 'NONE') {
            // Get the status of the current design version
            const designVersionStatus = DesignVersions.findOne({_id: currentDesignVersionId}).designVersionStatus;

            if (currentDesignUpdateId != 'NONE') {

                const designUpdate = DesignUpdates.findOne({_id: currentDesignUpdateId});

                if(designUpdate) {

                    // Get New WPS
                    const newWorkPackages = WorkPackages.find(
                        {
                            designVersionId: currentDesignVersionId,
                            designUpdateId: currentDesignUpdateId,
                            workPackageType: WorkPackageType.WP_UPDATE,
                            workPackageStatus: WorkPackageStatus.WP_NEW
                        },
                        {sort: {workPackageName: 1}}
                    ).fetch();

                    // Get Available WPS
                    const availableWorkPackages = WorkPackages.find(
                        {
                            designVersionId: currentDesignVersionId,
                            designUpdateId: currentDesignUpdateId,
                            workPackageType: WorkPackageType.WP_UPDATE,
                            workPackageStatus: WorkPackageStatus.WP_AVAILABLE
                        },
                        {sort: {workPackageName: 1}}
                    ).fetch();

                    // Get Adopted WPS
                    const adoptedWorkPackages = WorkPackages.find(
                        {
                            designVersionId: currentDesignVersionId,
                            designUpdateId: currentDesignUpdateId,
                            workPackageType: WorkPackageType.WP_UPDATE,
                            workPackageStatus: WorkPackageStatus.WP_ADOPTED
                        },
                        {sort: {workPackageName: 1}}
                    ).fetch();

                    return {
                        wpType: WorkPackageType.WP_UPDATE,
                        newWorkPackages: newWorkPackages,
                        availableWorkPackages: availableWorkPackages,
                        adoptedWorkPackages: adoptedWorkPackages,
                        designVersionStatus: designVersionStatus,
                        designUpdateStatus: designUpdate.updateStatus
                    };
                } else {

                    return {
                        wpType: WorkPackageType.WP_UPDATE,
                        newWorkPackages: [],
                        availableWorkPackages: [],
                        adoptedWorkPackages: [],
                        designVersionStatus: designVersionStatus,
                        designUpdateStatus: null
                    };
                }

            } else {
                return {
                    wpType: WorkPackageType.WP_UPDATE,
                    newWorkPackages: [],
                    availableWorkPackages: [],
                    adoptedWorkPackages: [],
                    designVersionStatus: designVersionStatus,
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
        if (currentDesignVersionId != 'NONE') {

            // Get all the design updates available for the selected version sorted by type and name

            const newUpdates = DesignUpdates.find(
                {
                    designVersionId: currentDesignVersionId,
                    updateStatus: DesignUpdateStatus.UPDATE_NEW
                },
                {sort: {updateReference:1, updateName: 1}}
            ).fetch();

            const draftUpdates = DesignUpdates.find(
                {
                    designVersionId: currentDesignVersionId,
                    updateStatus: DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT
                },
                {sort: {updateReference:1, updateName: 1}}
            ).fetch();

            const mergedUpdates = DesignUpdates.find(
                {
                    designVersionId: currentDesignVersionId,
                    updateStatus: DesignUpdateStatus.UPDATE_MERGED
                },
                {sort: {updateReference:1, updateName: 1}}
            ).fetch();

            const ignoredUpdates = DesignUpdates.find(
                {
                    designVersionId: currentDesignVersionId,
                    updateStatus: DesignUpdateStatus.UPDATE_IGNORED
                },
                {sort: {updateReference:1, updateName: 1}}
            ).fetch();

            // Get the status of the current design version
            const designVersionStatus = DesignVersions.findOne({_id: currentDesignVersionId}).designVersionStatus;

            //console.log("Design Updates found: " + currentDesignUpdates.count());

            return {
                newUpdates: newUpdates,
                draftUpdates: draftUpdates,
                mergedUpdates: mergedUpdates,
                ignoredUpdates: ignoredUpdates,
                designVersionStatus: designVersionStatus
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

        //console.log("Getting Application data for " + view + " and DV: " + userContext.designVersionId + " DU: " + userContext.designUpdateId + " WP: " + userContext.workPackageId);

        const designVersion = DesignVersions.findOne({_id: userContext.designVersionId});

        // Just get the original base items, not any new stuff
        const baseApplications = DesignVersionComponents.find(
            {
                designVersionId: userContext.designVersionId,
                componentType: ComponentType.APPLICATION,
                updateMergeStatus: {$ne: UpdateMergeStatus.COMPONENT_ADDED}
            },
            {sort: {componentIndexNew: 1}}
        );

        // All the existing and new stuff in the Design version - but for completed updatable versions leave out deleted
        let workingApplications  = null;

        if(designVersion.designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE_COMPLETE){
            workingApplications = DesignVersionComponents.find(
                {
                    designVersionId: userContext.designVersionId,
                    componentType: ComponentType.APPLICATION,
                    updateMergeStatus: {$ne: UpdateMergeStatus.COMPONENT_REMOVED}
                },
                {sort: {componentIndexNew: 1}}
            );

        } else {
            workingApplications = DesignVersionComponents.find(
                {
                    designVersionId: userContext.designVersionId,
                    componentType: ComponentType.APPLICATION
                },
                {sort: {componentIndexNew: 1}}
            );
        }

        let baseApplicationsArr = baseApplications.fetch();
        let workingApplicationsArr = workingApplications.fetch();

        log((msg) => console.log(msg), LogLevel.DEBUG, "Found {} base applications.", baseApplicationsArr.length);
        log((msg) => console.log(msg), LogLevel.DEBUG, "Found {} working applications.", workingApplicationsArr.length);

        // Get Update Apps if update Id provided
        let updateApplicationsArr = [];

        if(userContext.designUpdateId !== 'NONE'){

            const updateApplications = DesignUpdateComponents.find(
                {
                    designVersionId: userContext.designVersionId,
                    designUpdateId: userContext.designUpdateId,
                    componentType: ComponentType.APPLICATION
                },
                {sort: {componentIndexNew: 1}}
            );

            updateApplicationsArr = updateApplications.fetch();
        }

        // Get WP Data if WP Id provided
        let wpApplicationsArr = [];

        if(userContext.workPackageId !== 'NONE'){

            // Which applications are in the WP?
            const wpAppComponents = WorkPackageComponents.find(
                {
                    workPackageId: userContext.workPackageId,
                    componentType: ComponentType.APPLICATION,
                },
                {sort: {componentIndex: 1}}
            ).fetch();

            wpAppComponents.forEach((wpApp) => {

                switch(view){
                    case ViewType.WORK_PACKAGE_BASE_VIEW:
                    case ViewType.WORK_PACKAGE_BASE_EDIT:
                    case ViewType.DEVELOP_BASE_WP:

                        // The app data is the Design Version data
                        let appDvComponent = DesignVersionComponents.findOne({
                            designVersionId:        wpApp.designVersionId,
                            componentReferenceId:   wpApp.componentReferenceId
                        });
                        if(appDvComponent) {
                            wpApplicationsArr.push(appDvComponent);
                        }
                        break;

                    case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                    case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                    case ViewType.DEVELOP_UPDATE_WP:

                        // The app data is the Design Update data
                        let appDuComponent = DesignUpdateComponents.findOne({
                            designUpdateId:         userContext.designUpdateId,
                            componentReferenceId:   wpApp.componentReferenceId
                        });
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
            designSummaryData = UserDevDesignSummaryData.findOne({
                userId:             userContext.userId,
                designVersionId:    userContext.designVersionId,
                designUpdateId:     userContext.designUpdateId
            });
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

    // Get data for all nested design components inside the specified parent
    getComponentDataForParentComponent(componentType, view, designVersionId, designUpdateId, workPackageId, parentId, displayContext){
        let currentComponents = [];
        let wpComponents = [];

        //console.log("Looking for " + componentType + " data for view " + view + " and context " + displayContext);

        switch(view)
        {
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:

                // Don't include removed components in this view if a completed updatable version
                currentComponents = DesignVersionComponents.find(
                    {
                        designVersionId:        designVersionId,
                        componentType:          componentType,
                        componentParentIdNew:   parentId,
                        updateMergeStatus:      {$ne: UpdateMergeStatus.COMPONENT_REMOVED}
                    },
                    {sort:{componentIndexNew: 1}}
                ).fetch();

                return currentComponents;

                break;
            case ViewType.DESIGN_UPDATABLE_VIEW:

                switch(displayContext) {
                    case DisplayContext.MASH_UNIT_TESTS:
                    case DisplayContext.MASH_INT_TESTS:

                        // Don't include removed components in this view for test results
                        currentComponents = DesignVersionComponents.find(
                            {
                                designVersionId:        designVersionId,
                                componentType:          componentType,
                                componentParentIdNew:   parentId,
                                updateMergeStatus:      {$ne: UpdateMergeStatus.COMPONENT_REMOVED}
                            },
                            {sort:{componentIndexNew: 1}}
                        ).fetch();

                        break;

                    default:

                    // Do include removed components in the current updates view
                    currentComponents = DesignVersionComponents.find(
                        {
                            designVersionId: designVersionId,
                            componentType: componentType,
                            componentParentIdNew: parentId
                        },
                        {sort: {componentIndexNew: 1}}
                    ).fetch();

                }
                return  currentComponents;

                break;

            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
                // DESIGN UPDATE:  Need to provide data in the context of SCOPE, EDIT, VIEW and BASE Design Version

                //console.log("Looking for components for version in context: " + displayContext + " for DV " + designVersionId + " update " + designUpdateId + " with parent " + parentId);

                switch(displayContext){
                    case DisplayContext.UPDATE_EDIT:

                        // Display all DU components.  Only in-scope components exist.
                        currentComponents = DesignUpdateComponents.find(
                            {
                                designVersionId:        designVersionId,
                                designUpdateId:         designUpdateId,
                                componentType:          componentType,
                                componentParentIdNew:   parentId,
                            },
                            {sort:{componentIndexNew: 1}}
                        ).fetch();

                        break;

                    case DisplayContext.UPDATE_VIEW:

                        // Display all DU components.  Don't include peer scope.
                        currentComponents = DesignUpdateComponents.find(
                            {
                                designVersionId:        designVersionId,
                                designUpdateId:         designUpdateId,
                                componentType:          componentType,
                                componentParentIdNew:   parentId,
                                scopeType:              {$ne: UpdateScopeType.SCOPE_PEER_SCOPE}
                            },
                            {sort:{componentIndexNew: 1}}
                        ).fetch();

                        break;

                    case DisplayContext.UPDATE_SCOPE:

                        // Display all design components in the base design so scope can be chosen
                        currentComponents = DesignVersionComponents.find(
                            {
                                designVersionId:        designVersionId,
                                componentType:          componentType,
                                componentParentIdOld:   parentId,
                                updateMergeStatus:      {$ne: UpdateMergeStatus.COMPONENT_ADDED}
                            },
                            {sort:{componentIndexOld: 1}}
                        ).fetch();
                        break;

                    case DisplayContext.WORKING_VIEW:

                        // Display latest components in the working view
                        currentComponents = DesignVersionComponents.find(
                            {
                                designVersionId:        designVersionId,
                                componentType:          componentType,
                                componentParentIdNew:   parentId
                            },
                            {sort:{componentIndexNew: 1}}
                        ).fetch();

                        break;
                    //TODO - test data for Design Updates?
                }

                //console.log("Design update components found: " + currentComponents.length);

                return currentComponents;
                break;

            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.DEVELOP_BASE_WP:
                switch(displayContext) {
                    case DisplayContext.WP_SCOPE:

                        // Get all Design Components for the scope
                        currentComponents = DesignVersionComponents.find(
                            {
                                designVersionId: designVersionId,
                                componentParentIdNew: parentId,
                                componentType: componentType
                            },
                            {sort: {componentIndexNew: 1}}
                        ).fetch();
                        break;

                    case DisplayContext.WP_VIEW:
                    case DisplayContext.DEV_DESIGN:
                    case DisplayContext.MASH_UNIT_TESTS:
                    case DisplayContext.MASH_INT_TESTS:

                        // Get only the Design Components that are in the WP

                        // Get the parent component
                        const parent = DesignVersionComponents.findOne({_id: parentId});

                        // Get the possible WP components
                        if(parent) {
                            wpComponents = WorkPackageComponents.find(
                                {
                                    workPackageId: workPackageId,
                                    componentParentReferenceId: parent.componentReferenceId,
                                    componentType: componentType
                                },
                                {sort: {componentIndex: 1}}
                            ).fetch();

                            wpComponents.forEach((wpComponent) => {

                                let dvComponent = DesignVersionComponents.findOne({componentReferenceId: wpComponent.componentReferenceId});

                                if(dvComponent) {
                                    currentComponents.push(dvComponent);
                                }
                            });
                        }
                        break;
                }

                //console.log("Found " + currentComponents.length + " components of type " + componentType + " for display context " + displayContext);

                if(currentComponents.length > 0){
                    return currentComponents;
                } else {
                    return  [];
                }

                break;

            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
            case ViewType.DEVELOP_UPDATE_WP:

                switch(displayContext) {
                    case DisplayContext.WP_SCOPE:

                        // Get all Update Components for the scope.  Ignore Peer scope for Update WPs
                        currentComponents = DesignUpdateComponents.find(
                            {
                                designVersionId: designVersionId,
                                designUpdateId: designUpdateId,
                                componentParentIdNew: parentId,
                                componentType: componentType,
                                scopeType: {$in: [UpdateScopeType.SCOPE_IN_SCOPE, UpdateScopeType.SCOPE_PARENT_SCOPE]}
                            },
                            {sort: {componentIndexNew: 1}}
                        ).fetch();
                        break;

                    case DisplayContext.WP_VIEW:
                    case DisplayContext.DEV_DESIGN:
                    case DisplayContext.MASH_UNIT_TESTS:
                    case DisplayContext.MASH_INT_TESTS:

                        // Get only the Update Components that are in the WP

                        // TODO - parent id may be out of date when DU items are recreated...
                        // Get the parent component
                        const parent = DesignUpdateComponents.findOne({_id: parentId});

                        // Get the possible WP components
                        if (parent) {
                            wpComponents = WorkPackageComponents.find(
                                {
                                    workPackageId: workPackageId,
                                    componentParentReferenceId: parent.componentReferenceId,
                                    componentType: componentType
                                },
                                {sort: {componentIndex: 1}}
                            ).fetch();

                            wpComponents.forEach((wpComponent) => {

                                let duComponent = DesignUpdateComponents.findOne({componentReferenceId: wpComponent.componentReferenceId});

                                if(duComponent) {
                                    currentComponents.push(duComponent);
                                }
                            });
                        }

                        break;
                }

                if(currentComponents.length > 0){
                    return currentComponents;
                } else {
                    return [];
                }

                break;

        }
    }

    getBackgroundStepsInFeature(view, displayContext, stepContext, designId, designVersionId, updateId, featureReferenceId){
        let backgroundSteps = null;

        //log((msg) => console.log(msg), LogLevel.TRACE, "Looking for feature background steps in feature: {}", featureReferenceId);

        // Assume feature is in scope unless we find it isn't for an Update
        let featureInScope = true;

        switch(view){
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.DEVELOP_BASE_WP:

                backgroundSteps = FeatureBackgroundSteps.find(
                    {
                        designId: designId,
                        designVersionId: designVersionId,
                        designUpdateId: 'NONE',
                        featureReferenceId: featureReferenceId
                    },
                    {sort:{stepIndex: 1}}
                );

                log((msg) => console.log(msg), LogLevel.TRACE, "Feature Background Steps found: {}", backgroundSteps.count());

                return {
                    steps: backgroundSteps.fetch(),
                    displayContext: displayContext,
                    stepContext: stepContext,
                    parentReferenceId: featureReferenceId,
                    parentInScope: featureInScope
                };

            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
            case ViewType.DEVELOP_UPDATE_WP:

                switch(displayContext){
                    case DisplayContext.UPDATE_EDIT:
                    case DisplayContext.UPDATE_VIEW:
                    case DisplayContext.WP_VIEW:
                        // Update data wanted
                        backgroundSteps = FeatureBackgroundSteps.find(
                            {
                                designId: designId,
                                designVersionId: designVersionId,
                                designUpdateId: updateId,
                                featureReferenceId: featureReferenceId
                            },
                            {sort:{stepIndex: 1}}
                        );

                        log((msg) => console.log(msg), LogLevel.TRACE, "Update Feature Background Steps found: {}", backgroundSteps.count());

                        // For updates, check if feature is REALLY in scope
                        const feature = DesignUpdateComponents.findOne(
                            {
                                designId: designId,
                                designVersionId: designVersionId,
                                designUpdateId: updateId,
                                componentType: ComponentType.FEATURE,
                                componentReferenceId: featureReferenceId
                            }
                        );

                        if(feature){
                            featureInScope = (feature.scopeType === UpdateScopeType.SCOPE_IN_SCOPE);
                        }

                        break;

                    case DisplayContext.BASE_VIEW:
                        // Base design version data wanted
                        backgroundSteps = FeatureBackgroundSteps.find(
                            {
                                designId: designId,
                                designVersionId: designVersionId,
                                designUpdateId: 'NONE',
                                featureReferenceId: featureReferenceId
                            },
                            {sort:{stepIndex: 1}}
                        );

                        log((msg) => console.log(msg), LogLevel.TRACE, "Update Base Background Steps found: {}", backgroundSteps.count());

                        break;
                }

                return {
                    steps: backgroundSteps.fetch(),
                    displayContext: displayContext,
                    stepContext: stepContext,
                    parentReferenceId: featureReferenceId,
                    parentInScope: featureInScope
                };

            default:
                log((msg) => console.log(msg), LogLevel.ERROR, "INVALID VIEW TYPE!: {}", view);
        }

    }

    getScenarioStepsInScenario(view, displayContext, stepContext, designId, designVersionId, updateId, scenarioReferenceId){
        let scenarioSteps = null;

        // Assume all scenarios are in scope - will check update scenarios to see if they actually are
        let scenarioInScope = true;

        switch(view){
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.DEVELOP_BASE_WP:

                scenarioSteps = ScenarioSteps.find(
                    {
                        designId: designId,
                        designVersionId: designVersionId,
                        designUpdateId: 'NONE',
                        scenarioReferenceId: scenarioReferenceId,
                        isRemoved: false
                    },
                    {sort:{stepIndex: 1}}
                );

                return {
                    steps: scenarioSteps.fetch(),
                    displayContext: displayContext,
                    stepContext: stepContext,
                    parentReferenceId: scenarioReferenceId,
                    parentInScope: scenarioInScope
                };

            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
            case ViewType.DEVELOP_UPDATE_WP:

                switch(displayContext){
                    case DisplayContext.UPDATE_EDIT:
                    case DisplayContext.UPDATE_VIEW:
                        // Update data wanted
                        scenarioSteps = ScenarioSteps.find(
                            {
                                designId: designId,
                                designVersionId: designVersionId,
                                designUpdateId: updateId,
                                scenarioReferenceId: scenarioReferenceId
                            },
                            {sort:{stepIndex: 1}}
                        );

                        // For updates, check if scenario is REALLY in scope
                        const scenario = DesignUpdateComponents.findOne(
                            {
                                designId: designId,
                                designVersionId: designVersionId,
                                designUpdateId: updateId,
                                componentType: ComponentType.SCENARIO,
                                componentReferenceId: scenarioReferenceId
                            }
                        );

                        if(scenario){
                            scenarioInScope = (scenario.scopeType === UpdateScopeType.SCOPE_IN_SCOPE);
                        }

                        break;

                    case DisplayContext.BASE_VIEW:
                        // Base design version data wanted
                        scenarioSteps = ScenarioSteps.find(
                            {
                                designId: designId,
                                designVersionId: designVersionId,
                                designUpdateId: 'NONE',
                                scenarioReferenceId: scenarioReferenceId,
                                isRemoved: false
                            },
                            {sort:{stepIndex: 1}}
                        );

                        break;

                    default:
                        log((msg) => console.log(msg), LogLevel.ERROR, "INVALID DISPLAY CONTEXT TYPE!: {}", displayContext);
                }

                return {
                    steps: scenarioSteps.fetch(),
                    displayContext: displayContext,
                    stepContext: stepContext,
                    parentReferenceId: scenarioReferenceId,
                    parentInScope: scenarioInScope
                };

                break;
            default:
                log((msg) => console.log(msg), LogLevel.ERROR, "INVALID VIEW TYPE!: {}", view);
        }
    }

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

                    selectedDesignComponent = DesignVersionComponents.findOne({_id: userContext.designComponentId});

                    break;

                case ViewType.DESIGN_UPDATE_EDIT:
                case ViewType.DESIGN_UPDATE_VIEW:
                case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                case ViewType.DEVELOP_UPDATE_WP:

                    selectedDesignComponent = DesignUpdateComponents.findOne({_id: userContext.designComponentId});
                    if(!selectedDesignComponent){
                        // Must be selecting from the DU scope...
                        selectedDesignComponent = DesignVersionComponents.findOne({_id: userContext.designComponentId});
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

        const domainDictionaryItems = DomainDictionary.find(
            {
                designId: designId,
                designVersionId: designVersionId
            },
            {sort:{sortingName: 1}}     // The sorting name is the term name except when term is first created
        );

        //console.log ("Domain Dictionary terms found: " + domainDictionaryItems.count());

        return {
            dictionaryTerms: domainDictionaryItems.fetch()
        }
    };

    getScenarioMashData(userContext, featureAspectReferenceId, scenarioReferenceId = 'NONE'){

        // Return all scenario mash data for the current Feature Aspect or Scenario

        if(userContext.workPackageId === 'NONE') {

            // Get all scenarios

            if (scenarioReferenceId === 'NONE') {
                return UserDesignVersionMashScenarios.find(
                    {
                        userId: userContext.userId,
                        designVersionId: userContext.designVersionId,
                        designFeatureAspectReferenceId: featureAspectReferenceId
                    },
                    {sort: {mashItemIndex: 1}}
                ).fetch();
            } else {
                return UserDesignVersionMashScenarios.find(
                    {
                        userId: userContext.userId,
                        designVersionId: userContext.designVersionId,
                        designFeatureAspectReferenceId: featureAspectReferenceId,
                        designScenarioReferenceId: scenarioReferenceId
                    },
                    {sort: {mashItemIndex: 1}}
                ).fetch();
            }
        } else {

            // Return only scenarios in the WP
            let scenarios = [];

            // Get the possible WP components
            let wpComponents = [];

            if(scenarioReferenceId === 'NONE') {
                wpComponents = WorkPackageComponents.find(
                    {
                        workPackageId: userContext.workPackageId,
                        componentType: ComponentType.SCENARIO,
                        componentParentReferenceId: featureAspectReferenceId,
                        scopeType: WorkPackageScopeType.SCOPE_ACTIVE
                    },
                    {sort: {componentIndex: 1}}
                ).fetch();
            } else {
                wpComponents = WorkPackageComponents.find(
                    {
                        workPackageId: userContext.workPackageId,
                        componentType: ComponentType.SCENARIO,
                        componentReferenceId: scenarioReferenceId,
                        componentParentReferenceId: featureAspectReferenceId,
                        scopeType: WorkPackageScopeType.SCOPE_ACTIVE
                    },
                    {sort: {componentIndex: 1}}
                ).fetch();
            }

            wpComponents.forEach((wpComponent) => {

                let mashScenario = UserDesignVersionMashScenarios.findOne({
                    userId: userContext.userId,
                    designVersionId: userContext.designVersionId,
                    designScenarioReferenceId: wpComponent.componentReferenceId
                });

                scenarios.push(mashScenario);
            });

            return scenarios;
        }
    }

    // getDesignDevMashData(userContext, mashCurrentItem){
    //
    //     // Return all the data that is relevant to the currently selected Design Item or item in the Mash
    //
    //     let selectionComponentId = userContext.designComponentId;
    //     let selectionComponentType = userContext.designComponentType;
    //
    //     if(mashCurrentItem){
    //         // We don't want the main selection from the design - we want local mash data
    //         selectionComponentId = mashCurrentItem.designComponentId;
    //         selectionComponentType = mashCurrentItem.mashComponentType;
    //     }
    //
    //     log((msg) => console.log(msg), LogLevel.DEBUG, "Getting Integration Mash Data for component type {} with id {} ", selectionComponentType, selectionComponentId);
    //
    //     // Get user context current Design Component
    //     let selectedDesignComponent = null;
    //
    //     if(selectionComponentId === 'NONE'){
    //         return [];
    //
    //     } else {
    //         if (userContext.designUpdateId === 'NONE') {
    //             selectedDesignComponent = DesignVersionComponents.findOne({_id: selectionComponentId})
    //         } else {
    //             selectedDesignComponent = DesignUpdateComponents.findOne({_id: selectionComponentId})
    //         }
    //
    //         if(!selectedDesignComponent){
    //             return [];
    //         }
    //
    //         log((msg) => console.log(msg), LogLevel.TRACE, "User context is USER: {}, DV: {}, DU: {}, WP: {}",
    //         userContext.userId, userContext.designVersionId, userContext.designUpdateId, userContext.workPackageId);
    //
    //         switch (selectionComponentType) {
    //             case ComponentType.APPLICATION:
    //             case ComponentType.DESIGN_SECTION:
    //                 // Return any FEATURE that is a child of this item
    //                 let returnData = [];
    //
    //                 const intTestMash = UserWorkPackageMashData.find(
    //                     {
    //                         userId: userContext.userId,
    //                         designVersionId: userContext.designVersionId,
    //                         designUpdateId: userContext.designUpdateId,
    //                         workPackageId: userContext.workPackageId,
    //                         mashComponentType: ComponentType.FEATURE
    //                     },
    //                     {sort:{mashItemFeatureIndex: 1}}    // Features have their own sorting so as to get a global order
    //                 ).fetch();
    //
    //                 log((msg) => console.log(msg), LogLevel.TRACE, "Found {} Features in total", intTestMash.length);
    //
    //                 intTestMash.forEach((mashItem) => {
    //
    //                     let mashDesignComponent = null;
    //                     if (userContext.designUpdateId === 'NONE' || userContext.workPackageId === 'NONE') {
    //                         mashDesignComponent = DesignVersionComponents.findOne({_id: mashItem.designComponentId})
    //                     } else {
    //                         mashDesignComponent = DesignUpdateComponents.findOne({_id: mashItem.designComponentId})
    //                     }
    //
    //                     console.log("Design component for mash item " + mashItem.designComponentId + " is " + mashDesignComponent);
    //                     if (this.isDescendantOf(mashDesignComponent, selectedDesignComponent, userContext)) {
    //                         returnData.push(mashItem);
    //                     }
    //
    //                     log((msg) => console.log(msg), LogLevel.TRACE, "Found {} descendant Features", returnData.length);
    //
    //                 });
    //
    //                 return returnData;
    //
    //             case ComponentType.FEATURE:
    //                 // Return any FEATURE ASPECT related to this Feature
    //                 return UserWorkPackageMashData.find(
    //                     {
    //                         userId: userContext.userId,
    //                         designVersionId: userContext.designVersionId,
    //                         designUpdateId: userContext.designUpdateId,
    //                         workPackageId: userContext.workPackageId,
    //                         mashComponentType: ComponentType.FEATURE_ASPECT,
    //                         designFeatureReferenceId: selectedDesignComponent.componentReferenceId
    //                     },
    //                     {sort:{mashItemIndex: 1}}
    //                 ).fetch();
    //
    //             case ComponentType.FEATURE_ASPECT:
    //                 // Return any SCENARIO data related to this Feature Aspect
    //                 if(selectedDesignComponent) {
    //                     return UserWorkPackageMashData.find(
    //                         {
    //                             userId: userContext.userId,
    //                             designVersionId: userContext.designVersionId,
    //                             designUpdateId: userContext.designUpdateId,
    //                             workPackageId: userContext.workPackageId,
    //                             mashComponentType: ComponentType.SCENARIO,
    //                             designFeatureAspectReferenceId: selectedDesignComponent.componentReferenceId
    //                         },
    //                         {sort: {mashItemIndex: 1}}
    //                     ).fetch();
    //                 } else {
    //                     // Its just possible the Developer deleted this component
    //                     return[];
    //                 }
    //
    //             case ComponentType.SCENARIO:
    //                 // Return any data related to this Scenario (at most one test)
    //                 if(selectedDesignComponent) {
    //                     return UserWorkPackageMashData.find(
    //                         {
    //                             userId: userContext.userId,
    //                             designVersionId: userContext.designVersionId,
    //                             designUpdateId: userContext.designUpdateId,
    //                             workPackageId: userContext.workPackageId,
    //                             mashComponentType: ComponentType.SCENARIO,
    //                             designScenarioReferenceId: selectedDesignComponent.componentReferenceId
    //                         },
    //                         {sort:{mashItemIndex: 1}}
    //                     ).fetch();
    //                 } else {
    //                     // Its just possible the Developer deleted this component
    //                     return[];
    //                 }
    //
    //             default:
    //                 // No component or irrelevant component:
    //                 return [];
    //         }
    //     }
    //
    // }

    // getNonDesignAcceptanceScenarioData(userContext){
    //
    //     // For acceptance tests get any Scenarios found in the tests for a Design Feature that are not in the Design
    //     let selectedDesignComponent = null;
    //
    //     if (userContext.designUpdateId === 'NONE') {
    //         selectedDesignComponent = DesignVersionComponents.findOne({_id: userContext.designComponentId})
    //     } else {
    //         selectedDesignComponent = DesignUpdateComponents.findOne({_id: userContext.designComponentId})
    //     }
    //
    //     if(selectedDesignComponent){
    //
    //         log((msg) => console.log(msg), LogLevel.DEBUG, "Looking for feature with ref id {}", selectedDesignComponent.componentReferenceId);
    //
    //         const feature = UserWorkPackageMashData.findOne({
    //             userId: userContext.userId,
    //             designVersionId: userContext.designVersionId,
    //             designUpdateId: userContext.designUpdateId,
    //             workPackageId: userContext.workPackageId,
    //             designFeatureReferenceId: selectedDesignComponent.componentReferenceId,
    //             mashComponentType: ComponentType.FEATURE
    //         });
    //
    //         if(feature){
    //             let nonDesignedScenarios = UserWorkPackageMashData.find({
    //                 userId: userContext.userId,
    //                 designVersionId: userContext.designVersionId,
    //                 designUpdateId: userContext.designUpdateId,
    //                 workPackageId: userContext.workPackageId,
    //                 mashComponentType: ComponentType.SCENARIO,
    //                 accMashStatus: MashStatus.MASH_NOT_DESIGNED
    //             }).fetch();
    //
    //             log((msg) => console.log(msg), LogLevel.DEBUG, "Found {} non-designed Scenarios", nonDesignedScenarios.length);
    //
    //             return nonDesignedScenarios;
    //
    //         } else {
    //             return [];
    //         }
    //     } else {
    //         return [];
    //     }
    //
    //
    // }

    // checkForExistingFeatureFile(userContext){
    //
    //     let featureName = '';
    //
    //     if(userContext.designComponentType === ComponentType.FEATURE){
    //
    //         // The selected Feature must relate to a design or design update feature...
    //         if(userContext.designUpdateId === 'NONE'){
    //             featureName = DesignVersionComponents.findOne({componentReferenceId: userContext.featureReferenceId}).componentNameNew
    //         } else {
    //             featureName = DesignUpdateComponents.findOne({componentReferenceId: userContext.featureReferenceId}).componentNameNew
    //         }
    //     }
    //
    //     const featureFile = UserDevFeatures.findOne({featureName: featureName});
    //
    //     return featureFile;
    //
    // }

    // isDescendantOf(child, parent, userContext){
    //
    //     let parentRefId = 'NONE';
    //     let found = false;
    //
    //     if (userContext.designUpdateId === 'NONE') {
    //         // DESIGN VERSION SEARCH
    //
    //         // Check immediate parent
    //         parentRefId = child.componentParentReferenceIdNew;
    //
    //         log((msg) => console.log(msg), LogLevel.TRACE, "Checking if descendant: ParentId = {} Current Item Id = {}", parentRefId, parent.componentReferenceId);
    //
    //         // If the component is directly under the current component then wanted
    //         if(parentRefId === parent.componentReferenceId){
    //             return true;
    //         }
    //
    //         // Iterate up until we reach top of tree
    //         found = false;
    //
    //         while((parentRefId !== 'NONE') && !found){
    //             // Get next parent up
    //
    //             parentRefId = DesignVersionComponents.findOne({
    //                 designVersionId: userContext.designVersionId,
    //                 componentReferenceId: parentRefId
    //             }).componentParentReferenceIdNew;
    //
    //             log((msg) => console.log(msg), LogLevel.TRACE, "Checking if descendant (loop): ParentId = {} Current Item Id = {}", parentRefId, parent.componentReferenceId);
    //
    //             // Return true if match
    //             if(parentRefId === parent.componentReferenceId){
    //                 found =  true;
    //             }
    //         }
    //
    //         return found;
    //
    //     } else {
    //         // DESIGN UPDATE SEARCH
    //
    //         // Check immediate parent
    //         parentRefId = child.componentParentReferenceIdNew;
    //
    //         log((msg) => console.log(msg), LogLevel.TRACE, "Checking if descendant: ParentId = {} Current Item Id = {}", parentRefId, parent.componentReferenceId);
    //
    //         // If the component is directly under the current component then wanted
    //         if(parentRefId === parent.componentReferenceId){
    //             return true;
    //         }
    //
    //         // Iterate up until we reach top of tree
    //         found = false;
    //
    //         while((parentRefId !== 'NONE') && !found){
    //             // Get next parent up
    //
    //             parentRefId = DesignUpdateComponents.findOne({
    //                 designVersionId: userContext.designVersionId,
    //                 componentReferenceId: parentRefId
    //             }).componentParentReferenceIdNew;
    //
    //             log((msg) => console.log(msg), LogLevel.TRACE, "Checking if descendant (loop): ParentId = {} Current Item Id = {}", parentRefId, parent.componentReferenceId);
    //
    //             // Return true if match
    //             if(parentRefId === parent.componentReferenceId){
    //                 found =  true;
    //             }
    //         }
    //
    //         return found;
    //
    //     }
    //
    //     // Iterate up until we reach top of tree
    //     let parentId = '';
    //
    //     while(parentId !== 'NONE'){
    //         // Get next parent up
    //
    //         parentId = WorkPackageComponents.findOne({
    //             workPackageId: userContext.workPackageId,
    //             componentReferenceId: parentId
    //         }).componentParentReferenceIdNew;
    //
    //         log((msg) => console.log(msg), LogLevel.TRACE, "Checking if descendent (loop): ParentId = {} Current Item Id = {}", parentId, parent.componentReferenceId);
    //
    //         // Return true if match
    //         if(parentId === parent.componentReferenceId){return true;}
    //     }
    //
    //     // No parent found
    //     return false;
    //
    // };

    // getMashFeatureAspects(userContext, view){
    //
    //     log((msg) => console.log(msg), LogLevel.TRACE, "Getting mash feature aspects for component {} userId: {} DV: {} DU: {} WP: {} FRef: {}",
    //         userContext.designComponentType, userContext.userId, userContext.designVersionId,
    //         userContext.designUpdateId, userContext.workPackageId, userContext.featureReferenceId);
    //
    //
    //     if(userContext.designComponentType === ComponentType.FEATURE){
    //
    //         return UserWorkPackageMashData.find(
    //             {
    //                 userId:                         userContext.userId,
    //                 designVersionId:                userContext.designVersionId,
    //                 designUpdateId:                 userContext.designUpdateId,
    //                 workPackageId:                  userContext.workPackageId,
    //                 designFeatureReferenceId:       userContext.featureReferenceId,
    //                 mashComponentType:              ComponentType.FEATURE_ASPECT
    //             },
    //             {sort: {mashItemIndex: 1}}
    //         ).fetch();
    //
    //     } else {
    //         return [];
    //     }
    //
    // };

    // getMashFeatureAspectScenarios(aspect){
    //
    //     return UserWorkPackageMashData.find(
    //         {
    //             userId:                         aspect.userId,
    //             designVersionId:                aspect.designVersionId,
    //             designUpdateId:                 aspect.designUpdateId,
    //             workPackageId:                  aspect.workPackageId,
    //             designFeatureAspectReferenceId: aspect.designComponentReferenceId,
    //             mashComponentType:              ComponentType.SCENARIO
    //         },
    //         {sort: {mashItemIndex: 1}}
    //     ).fetch();
    //
    // };

    // Get all unit test results relating to a specific Design Scenario
    getMashScenarioUnitTestResults(userContext, scenario){

        //console.log("getting unit tests with user id: " + userContext.userId + " and scenario ref " + scenario.designScenarioReferenceId);

        return UserUnitTestMashData.find({
            userId:                         userContext.userId,
            designScenarioReferenceId:      scenario.designScenarioReferenceId,
        }).fetch();

    }

    getMashUnlinkedUnitTestResults(userContext){


        return UserUnitTestMashData.find({
            userId:                         userContext.userId,
            designScenarioReferenceId:      'NONE'
        }).fetch();
    }

    getMashScenarioSteps(userContext){
        // Returns steps for the current scenario that are:
        // 1. In Design Only
        // 2. Linked across Design - Dev
        // 3. In Dev Only (but with Scenario that is in Design)

        log((msg) => console.log(msg), LogLevel.DEBUG, "Getting mash Scenario Steps for Scenario {}", userContext.scenarioReferenceId);

        const designSteps = UserWorkPackageFeatureStepData.find(
            {
                userId:                         userContext.userId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                workPackageId:                  userContext.workPackageId,
                designScenarioReferenceId:      userContext.scenarioReferenceId,
                mashComponentType:              ComponentType.SCENARIO_STEP,
                accMashStatus:                  MashStatus.MASH_NOT_IMPLEMENTED
            },
            {sort: {mashItemIndex: 1}}
        ).fetch();

        const linkedSteps = UserWorkPackageFeatureStepData.find(
            {
                userId:                         userContext.userId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                workPackageId:                  userContext.workPackageId,
                designScenarioReferenceId:      userContext.scenarioReferenceId,
                mashComponentType:              ComponentType.SCENARIO_STEP,
                accMashStatus:                  MashStatus.MASH_LINKED
            },
            {sort: {mashItemIndex: 1}}
        ).fetch();

        const devSteps = UserWorkPackageFeatureStepData.find(
            {
                userId:                         userContext.userId,
                designVersionId:                userContext.designVersionId,
                designUpdateId:                 userContext.designUpdateId,
                workPackageId:                  userContext.workPackageId,
                designScenarioReferenceId:      userContext.scenarioReferenceId,
                mashComponentType:              ComponentType.SCENARIO_STEP,
                accMashStatus:                  MashStatus.MASH_NOT_DESIGNED
            },
            {sort: {mashItemIndex: 1}}
        ).fetch();

        return({
            designSteps: designSteps,
            linkedSteps: linkedSteps,
            devSteps: devSteps,
        });
    }

    getDevFilesData(userContext){

        // Get the data on feature files in the user's build area, split into:
        // - Relevant to current WP
        // - Relevant to wider design
        // - Unknown in Design

        const wpFiles = UserDevFeatures.find({
            userId: userContext.userId,
            featureStatus: UserDevFeatureStatus.FEATURE_IN_WP
        }).fetch();

        const designFiles = UserDevFeatures.find({
            userId: userContext.userId,
            featureStatus: UserDevFeatureStatus.FEATURE_IN_DESIGN
        }).fetch();

        const unknownFiles = UserDevFeatures.find({
            userId: userContext.userId,
            featureStatus: UserDevFeatureStatus.FEATURE_UNKNOWN
        }).fetch();

        return{
            wpFiles: wpFiles,
            designFiles: designFiles,
            unknownFiles: unknownFiles
        }

    };

    getTestSummaryData(scenario){

        const userContext = store.getState().currentUserItemContext;

        return UserDesignVersionMashScenarios.findOne({
            userId:                     userContext.userId,
            designVersionId:            scenario.designVersionId,
            designScenarioReferenceId:  scenario.componentReferenceId
        });

    }

    getTestSummaryFeatureData(feature){

        const userContext = store.getState().currentUserItemContext;

        return UserDevTestSummaryData.findOne({
            userId:                 userContext.userId,
            designVersionId:        feature.designVersionId,
            scenarioReferenceId:    'NONE',
            featureReferenceId:     feature.componentReferenceId
        });

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
                            viewTestSummary,
                            viewAllAsTabs
                        ];

                    case MenuDropdown.MENU_DROPDOWN_REFRESH:

                        return [
                            refreshTestData
                        ];
                }
                break;

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

        const userRoles = UserRoles.findOne({
            userId: userContext.userId
        });

        if(userContext.designVersionId === 'NONE'){
            return{
                dvAllItem:          dvAllItem,
                dvItem:             dvItem,
                dvWorkPackages:     dvWorkPackages,
                dvDesignUpdates:    dvDesignUpdates,
                userRoles:          userRoles
            }
        }

        const dv = DesignVersions.findOne({_id: userContext.designVersionId});

        switch(dv.designVersionStatus){
            case DesignVersionStatus.VERSION_NEW:
            case DesignVersionStatus.VERSION_DRAFT:
            case DesignVersionStatus.VERSION_DRAFT_COMPLETE:

                // Get item
                dvItem = UserWorkProgressSummary.findOne(
                    {
                        userId:                 userContext.userId,
                        designVersionId:        userContext.designVersionId,
                        workSummaryType:        WorkSummaryType.WORK_SUMMARY_BASE_DV
                    }
                );

                // Get WPs
                dvWorkPackages = UserWorkProgressSummary.find(
                    {
                        userId:                 userContext.userId,
                        designVersionId:        userContext.designVersionId,
                        workSummaryType:        WorkSummaryType.WORK_SUMMARY_BASE_WP
                    },
                    {sort: {name: 1}}
                ).fetch();

                break;

            default:

                // Get All scenarios item
                dvAllItem = UserWorkProgressSummary.findOne(
                    {
                        userId:                 userContext.userId,
                        designVersionId:        userContext.designVersionId,
                        workSummaryType:        WorkSummaryType.WORK_SUMMARY_UPDATE_DV_ALL
                    }
                );

                // Get update scenarios item
                dvItem = UserWorkProgressSummary.findOne(
                    {
                        userId:                 userContext.userId,
                        designVersionId:        userContext.designVersionId,
                        workSummaryType:        WorkSummaryType.WORK_SUMMARY_UPDATE_DV
                    }
                );

                // Get DUs
                dvDesignUpdates = UserWorkProgressSummary.find(
                    {
                        userId:                 userContext.userId,
                        designVersionId:        userContext.designVersionId,
                        workSummaryType:        WorkSummaryType.WORK_SUMMARY_UPDATE
                    },
                    {sort: {name: 1}}
                ).fetch()
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

        const userRoles = UserRoles.findOne({
            userId: userContext.userId
        });

        if(designUpdateId === 'NONE'){
            return{
                duWorkPackages:     duWorkPackages,
                userRoles:          userRoles
            }
        }

        duWorkPackages = UserWorkProgressSummary.find(
            {
                userId:             userContext.userId,
                designVersionId:    userContext.designVersionId,
                designUpdateId:     designUpdateId,
                workSummaryType:    WorkSummaryType.WORK_SUMMARY_UPDATE_WP
            },
            {sort: {name: 1}}
        ).fetch();

        return{
            duWorkPackages:     duWorkPackages,
            userRoles:          userRoles
        }

    }

}

export default new ClientContainerServices();