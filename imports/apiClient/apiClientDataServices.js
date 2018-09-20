
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import { Meteor } from 'meteor/meteor';

// Ultrawide Services
import { RoleType, ComponentType, ViewType, ViewOptionType, DisplayContext, DesignVersionStatus, DesignUpdateStatus,
        WorkPackageType, WorkPackageStatus, LogLevel, HomePageTab, UpdateMergeStatus, UserSetting, UserSettingValue,
        WorkPackageTab, DesignUpdateTab, UltrawideAction, MessageType, MenuDropdown, MenuAction, DetailsViewType, WorkSummaryType
} from '../constants/constants.js';

import { log } from '../common/utils.js';
import { TextLookups } from '../common/lookups.js';

import { ClientTestOutputLocationServices } from '../apiClient/apiClientTestOutputLocations.js';
import { ClientUserContextServices }        from '../apiClient/apiClientUserContext.js';
import { ClientAppHeaderServices }          from '../apiClient/apiClientAppHeader.js';
import { ClientDesignVersionServices }      from '../apiClient/apiClientDesignVersion.js';
import { ClientUserSettingsServices }       from '../apiClient/apiClientUserSettings.js';
import { ClientDesignUpdateServices }       from '../apiClient/apiClientDesignUpdate.js';

// Data Access
import { AppGlobalData }                    from '../data/app/app_global_db.js';
import { UserRoleData }                     from '../data/users/user_role_db.js';
import { DesignData }                       from '../data/design/design_db.js';
import { DesignVersionData }                from '../data/design/design_version_db.js';
import { DesignUpdateData }                 from '../data/design_update/design_update_db.js';
import { WorkPackageData }                  from '../data/work/work_package_db.js';
import { WorkPackageComponentData }         from '../data/work/work_package_component_db.js';
import { DesignComponentData }              from '../data/design/design_component_db.js';
import { DesignUpdateComponentData }        from '../data/design_update/design_update_component_db.js';
import { UserTestTypeLocationData }         from '../data/configure/user_test_type_location_db.js';
import { TestOutputLocationData }           from '../data/configure/test_output_location_db.js';
import { DesignBackupData }                 from '../data/backups/design_backup_db.js';
import { UserDevDesignSummaryData }         from '../data/summary/user_dev_design_summary_db.js';
import { DomainDictionaryData }             from '../data/design/domain_dictionary_db.js';
import { UserDvMashScenarioData }           from '../data/mash/user_dv_mash_scenario_db.js';
import { UserMashScenarioTestData }         from '../data/mash/user_mash_scenario_test_db.js';
import { UserDvTestSummaryData }           from '../data/summary/user_dv_test_summary_db.js';
import { UserWorkProgressSummaryData }      from '../data/summary/user_work_progress_summary_db.js';
import { DefaultFeatureAspectData }         from '../data/design/default_feature_aspect_db.js';


// REDUX services
import store from '../redux/store'
import {
    setCurrentRole, setCurrentView, setCurrentWindowSize, setDesignVersionDataLoadedTo,
    setDocFeatureTextOption,
    setDocNarrativeTextOption, setDocScenarioTextOption,
    setDocSectionTextOption, setIncludeNarratives, setIntTestOutputDir,
    updateUserMessage
} from '../redux/actions'
import {DesignPermutationData} from "../data/design/design_permutation_db";
import {DesignPermutationValueData} from "../data/design/design_permutation_value_db";
import {ScenarioTestExpectationData} from "../data/design/scenario_test_expectations_db";
import {MashTestStatus, TestType} from "../constants/constants";
import {UserDvScenarioTestExpectationStatusData} from "../data/mash/user_dv_scenario_test_expectation_status_db";
import {UserDvTestSummary} from "../collections/summary/user_dv_test_summary";


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Container Services - Functions to return the data required for various GUI components
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientDataServicesClass{

    loadMainData(userContext){

        if(Meteor.isClient) {
            log((msg) => console.log(msg), LogLevel.TRACE, "Loading main data...");

            const componentsExist = DesignVersionData.checkForComponents();
            const mashExists = UserDvMashScenarioData.hasUserDvData(userContext);

            if (componentsExist) {
                log((msg) => console.log(msg), LogLevel.TRACE, "Data already loaded...");

                if (!mashExists) {
                    log((msg) => console.log(msg), LogLevel.TRACE, "Getting User Data...");
                    this.getUserData(userContext, this.onAllDataLoaded);
                } else {
                    this.onAllDataLoaded();
                }


            } else {

                // Need to load data
                if (userContext.designVersionId !== 'NONE') {
                    log((msg) => console.log(msg), LogLevel.TRACE, "Loading data for DV {}", userContext.designVersionId);

                    // Show wait screen
                    store.dispatch(setCurrentView(ViewType.WAIT));

                    // Also gets WP data if a WP is current
                    if (Meteor.isClient) {
                        this.getDesignVersionData(userContext, this.onAllDataLoaded);
                    }

                } else {

                    log((msg) => console.log(msg), LogLevel.TRACE, "No DV set");
                    // Will have to wait for a DV to be selected to get data
                    this.onAllDataLoaded(userContext);
                }
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

        // Include narratives setting.  Default to ON if not yet set
        const includeNarrativesSetting = ClientUserSettingsServices.getUserSetting(UserSetting.SETTING_INCLUDE_NARRATIVES);
        if(includeNarrativesSetting){
            store.dispatch(setIncludeNarratives(includeNarrativesSetting));
        } else {
            ClientUserSettingsServices.saveUserSetting(UserSetting.SETTING_INCLUDE_NARRATIVES, UserSettingValue.SETTING_INCLUDE);
            store.dispatch(setIncludeNarratives(UserSettingValue.SETTING_INCLUDE));
        }

        // Doc export settings - default if not yet set
        const docSectionTextSetting = ClientUserSettingsServices.getUserSetting(UserSetting.SETTING_DOC_TEXT_SECTION);
        if(docSectionTextSetting) {
            store.dispatch(setDocSectionTextOption(docSectionTextSetting));
        } else {
            ClientUserSettingsServices.saveUserSetting(UserSetting.SETTING_DOC_TEXT_SECTION, UserSettingValue.SETTING_INCLUDE);
            store.dispatch(setDocSectionTextOption(UserSettingValue.SETTING_INCLUDE));
        }

        const docFeatureTextSetting = ClientUserSettingsServices.getUserSetting(UserSetting.SETTING_DOC_TEXT_FEATURE);
        if(docFeatureTextSetting) {
            store.dispatch(setDocFeatureTextOption(docFeatureTextSetting));
        } else {
            ClientUserSettingsServices.saveUserSetting(UserSetting.SETTING_DOC_TEXT_FEATURE, UserSettingValue.SETTING_INCLUDE);
            store.dispatch(setDocFeatureTextOption(UserSettingValue.SETTING_INCLUDE));
        }

        const docNarrativeTextSetting = ClientUserSettingsServices.getUserSetting(UserSetting.SETTING_DOC_TEXT_NARRATIVE);
        if(docNarrativeTextSetting) {
            store.dispatch(setDocNarrativeTextOption(docNarrativeTextSetting));
        } else {
            ClientUserSettingsServices.saveUserSetting(UserSetting.SETTING_DOC_TEXT_NARRATIVE, UserSettingValue.SETTING_INCLUDE);
            store.dispatch(setDocNarrativeTextOption(UserSettingValue.SETTING_INCLUDE));
        }

        const docScenarioTextSetting = ClientUserSettingsServices.getUserSetting(UserSetting.SETTING_DOC_TEXT_SCENARIO);
        if(docScenarioTextSetting) {
            store.dispatch(setDocScenarioTextOption(docScenarioTextSetting));
        } else {
            ClientUserSettingsServices.saveUserSetting(UserSetting.SETTING_DOC_TEXT_SCENARIO, UserSettingValue.SETTING_INCLUDE);
            store.dispatch(setDocScenarioTextOption(UserSettingValue.SETTING_INCLUDE));
        }

        // Set User Role
        const user = UserRoleData.getRoleByUserId(userContext.userId);

        if(user.currentRole !== 'NONE'){
            store.dispatch(setCurrentRole(userContext.userId, user.currentRole))
        } else {
            // Pick a role
            if (user.isGuestViewer) {
                store.dispatch(setCurrentRole(userContext.userId, RoleType.GUEST_VIEWER))
            } else {
                if (user.isDesigner) {
                    store.dispatch(setCurrentRole(userContext.userId, RoleType.DESIGNER))
                } else {
                    if (user.isManager) {
                        store.dispatch(setCurrentRole(userContext.userId, RoleType.MANAGER))
                    } else {
                        if (user.isDeveloper) {
                            store.dispatch(setCurrentRole(userContext.userId, RoleType.DEVELOPER))
                        }
                    }
                }
            }
        }

        // Go to home screen
        if (userContext.designId !== 'NONE') {
            ClientAppHeaderServices.setViewSelection();
            ClientUserContextServices.setOpenDesignVersionItems(userContext);
        } else {
            ClientAppHeaderServices.setViewSelection();
        }
    }


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
            const dfaHandle = Meteor.subscribe('defaultFeatureAspects');
            const dvHandle = Meteor.subscribe('designVersions');
            const duHandle = Meteor.subscribe('designUpdates');
            const wpHandle = Meteor.subscribe('workPackages');

            const loading = (
                !agHandle.ready() || !urHandle.ready() || !dbHandle.ready() || !usHandle.ready() || !ucHandle.ready() || !uvHandle.ready() || !tlHandle.ready() || !tfHandle.ready() || !utHandle.ready() || !dHandle.ready() || !dvHandle.ready() || !duHandle.ready() || !wpHandle.ready()
            );

            return {isLoading: loading};
        }
    }

    getUserData(userContext, callback){

        if(Meteor.isClient){

             //log((msg) => console.log(msg), LogLevel.DEBUG, "Get User Data with callback {}", callback);

            store.dispatch(updateUserMessage({
                messageType: MessageType.WARNING,
                messageText: 'FETCHING USER DATA FROM SERVER...'
            }));

            // User specific data
            const dvmHandle = Meteor.subscribe('userDesignVersionMashScenarios', userContext.userId, userContext.designVersionId);
            const irHandle = Meteor.subscribe('userIntegrationTestResults', userContext.userId);
            const mrHandle = Meteor.subscribe('userUnitTestResults', userContext.userId);
            const stHandle = Meteor.subscribe('userMashScenarioTests', userContext.userId);
            const tsHandle = Meteor.subscribe('userDevTestSummary', userContext.userId);
            const dsHandle = Meteor.subscribe('userDevDesignSummary', userContext.userId);
            const dusHandle = Meteor.subscribe('userDesignUpdateSummary', userContext.userId);
            const psHandle = Meteor.subscribe('userWorkProgressSummary', userContext.userId);
            const dveHandle = Meteor.subscribe('userDvScenarioTestExpectationStatus', userContext.userId, userContext.designVersionId);
            const dstHandle = Meteor.subscribe('userDvScenarioTestSummary', userContext.userId, userContext.designVersionId);
            const dftHandle = Meteor.subscribe('userDvFeatureTestSummary', userContext.userId, userContext.designVersionId);
            const dvtHandle = Meteor.subscribe('userDvTestSummary', userContext.userId, userContext.designVersionId);

            Tracker.autorun((loader) => {

                let loading = (
                    !dusHandle.ready() || !dvmHandle.ready() ||
                    !irHandle.ready() || !mrHandle.ready() || !stHandle.ready() || !tsHandle.ready() ||
                    !dsHandle.ready() || !psHandle.ready() || !dveHandle.ready() ||
                    !dstHandle.ready() || ! dftHandle.ready() || ! dvtHandle.ready()
                );

                log((msg) => console.log(msg), LogLevel.DEBUG, "loading User Data = {}", loading);

                if (!loading) {

                    store.dispatch(updateUserMessage({
                        messageType: MessageType.INFO,
                        messageText: 'User data loaded'
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

    getDesignVersionData(userContext, callback){

        if(Meteor.isClient) {

            //console.log("Get Design Version Data with callback " + callback);
            //log((msg) => console.log(msg), LogLevel.DEBUG, "Get Design Version Data with callback {}", callback);


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

                // Design specifc data
                const dpHandle = Meteor.subscribe('designPermutations', userContext.designId);

                // Design Version specific data
                const dvcHandle = Meteor.subscribe('designVersionComponents', userContext.designVersionId);
                const ducHandle = Meteor.subscribe('designUpdateComponents', userContext.designVersionId);
                const wcHandle = Meteor.subscribe('workPackageComponents', userContext.designVersionId);
                const fbHandle = Meteor.subscribe('featureBackgroundSteps', userContext.designVersionId);
                const ssHandle = Meteor.subscribe('scenarioSteps', userContext.designVersionId);
                const ddHandle = Meteor.subscribe('domainDictionary', userContext.designVersionId);
                const dpvHandle = Meteor.subscribe('designPermutationValues', userContext.designVersionId);
                const steHandle = Meteor.subscribe('scenarioTestExpectations', userContext.designVersionId);

                // User specific data
                const dvmHandle = Meteor.subscribe('userDesignVersionMashScenarios', userContext.userId, userContext.designVersionId);
                const dveHandle = Meteor.subscribe('userDvScenarioTestExpectationStatus', userContext.userId, userContext.designVersionId);
                const irHandle = Meteor.subscribe('userIntegrationTestResults', userContext.userId);
                const mrHandle = Meteor.subscribe('userUnitTestResults', userContext.userId);
                const stHandle = Meteor.subscribe('userMashScenarioTests', userContext.userId);
                const tsHandle = Meteor.subscribe('userDevTestSummary', userContext.userId);
                const dsHandle = Meteor.subscribe('userDevDesignSummary', userContext.userId);
                const dusHandle = Meteor.subscribe('userDesignUpdateSummary', userContext.userId);
                const psHandle = Meteor.subscribe('userWorkProgressSummary', userContext.userId);
                const dstHandle = Meteor.subscribe('userDvScenarioTestSummary', userContext.userId, userContext.designVersionId);
                const dftHandle = Meteor.subscribe('userDvFeatureTestSummary', userContext.userId, userContext.designVersionId);
                const dvtHandle = Meteor.subscribe('userDvTestSummary', userContext.userId, userContext.designVersionId);

                Tracker.autorun((loader) => {

                    let loading = (
                        !dusHandle.ready() || !dpHandle.ready() || !dpvHandle.ready() || !dveHandle.ready() ||
                        !dvcHandle.ready() || !ducHandle.ready() || !fbHandle.ready() ||
                        !ssHandle.ready() || !ddHandle.ready() || !dvmHandle.ready() ||
                        !irHandle.ready() || !mrHandle.ready() || !stHandle.ready() || !tsHandle.ready() ||
                        !dsHandle.ready() || !wcHandle.ready() || !psHandle.ready() || !steHandle.ready() ||
                        !dstHandle.ready() || ! dftHandle.ready() || ! dvtHandle.ready()
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

    // Get permutations for current Design
    getDesignPermutationsData(designId){

        return DesignPermutationData.getPermutationsForDesign(designId);
    }

    getDesignPermutationsWithExpectationStatus(userContext, scenarioRefId, testType){

        const availablePermutations = DesignPermutationData.getPermutationsForDesign(userContext.designId);

        let returnData = [];

        let permutationStatus = MashTestStatus.MASH_NO_EXPECTATIONS;

        availablePermutations.forEach((permutation) => {

            const permutationValueExpectations = ScenarioTestExpectationData.getPermutationValuesForScenarioTestTypePerm(
                userContext.designVersionId,
                scenarioRefId,
                testType,
                permutation._id
            );

            if(permutationValueExpectations.length > 0){
                permutationStatus = MashTestStatus.MASH_HAS_EXPECTATIONS;
            }

            returnData.push(
                {
                    permutation: permutation,
                    permutationStatus: permutationStatus
                }
            )
        });

        return returnData;
    }

    // Get permutation values for current permutation
    getPermutationValuesData(permutationId, designVersionId){

        //console.log('Getting perm values for DV %s and Perm %s', designVersionId, permutationId);

        const permutations = DesignPermutationValueData.getDvPermutationValuesForPermutation(
            permutationId,
            designVersionId
        );

        const perm = DesignPermutationData.getDesignPermutationById(permutationId);

        let name = '';
        if(perm){
            name = perm.permutationName;
        }

        return{
            data: permutations,
            name: name
        }
    }

    // Get permutation values for current permutation with current test expectation status
    getPermutationValuesDataWithTestStatus(userContext, scenarioRefId, testType, permutationId){

        const permutationValues = DesignPermutationValueData.getDvPermutationValuesForPermutation(
            permutationId,
            userContext.designVersionId
        );

        let data = [];
        let dataItem = {};

        // Get current test status for each permutation
        permutationValues.forEach((permutationValue) =>{

            const permutationValueExpectation = ScenarioTestExpectationData.getScenarioTestExpectationForScenarioTestTypePermutationValue(
                userContext.designVersionId,
                scenarioRefId,
                testType,
                permutationId,
                permutationValue._id
            );

            if(permutationValueExpectation){

                // Test is expected for this value so see what its status is
                const testExpectationStatus = UserDvScenarioTestExpectationStatusData.getUserExpectationStatusData(
                    userContext.userId,
                    userContext.designVersionId,
                    permutationValueExpectation._id
                );

                if(testExpectationStatus){
                    dataItem = {
                        permutationValue:   permutationValue,
                        valueStatus:        testExpectationStatus.expectationStatus
                    }
                } else {
                    dataItem = {
                        permutationValue:   permutationValue,
                        valueStatus:        MashTestStatus.MASH_NOT_LINKED
                    }
                }
            } else {

                // No test expected so no status
                dataItem = {
                    permutationValue:   permutationValue,
                    valueStatus:        MashTestStatus.MASH_NOT_LINKED
                }
            }

            data.push(dataItem);
        });

        return data;
    }

    getTestTypeExpectationStatus(userContext, scenarioRefId){

        // Determine the current user status of the overall test type expectations
        let unitStatus = MashTestStatus.MASH_NOT_LINKED;
        let intStatus = MashTestStatus.MASH_NOT_LINKED;
        let accStatus = MashTestStatus.MASH_NOT_LINKED;

        const unitExpectation = ScenarioTestExpectationData.getScenarioTestTypeExpectation(userContext.designVersionId, scenarioRefId, TestType.UNIT);
        const intExpectation = ScenarioTestExpectationData.getScenarioTestTypeExpectation(userContext.designVersionId, scenarioRefId, TestType.INTEGRATION);
        const accExpectation = ScenarioTestExpectationData.getScenarioTestTypeExpectation(userContext.designVersionId, scenarioRefId, TestType.ACCEPTANCE);

        if(unitExpectation){
            const unitStatusData = UserDvScenarioTestExpectationStatusData.getUserExpectationStatusData(userContext.userId, userContext.designVersionId, unitExpectation._id);

            if(unitStatusData){
                unitStatus = unitStatusData.expectationStatus;
            }
        }

        if(intExpectation){
            const intStatusData = UserDvScenarioTestExpectationStatusData.getUserExpectationStatusData(userContext.userId, userContext.designVersionId, intExpectation._id);

            if(intStatusData){
                intStatus = intStatusData.expectationStatus;
            }
        }

        if(accExpectation){
            const accStatusData = UserDvScenarioTestExpectationStatusData.getUserExpectationStatusData(userContext.userId, userContext.designVersionId, accExpectation._id);

            if(accStatusData){
                accStatus = accStatusData.expectationStatus;
            }
        }


        return(
            {
                unitStatus: unitStatus,
                intStatus:  intStatus,
                accStatus:  accStatus
            }
        )
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
                // case ViewType.DESIGNS:
                //     currentDesign = DesignData.getDesignById(userContext.designId);
                //     break;

                case ViewType.SELECT:
                case ViewType.DESIGN_NEW:
                case ViewType.DESIGN_PUBLISHED:
                case ViewType.DESIGN_UPDATABLE:
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

            if(user.isGuestViewer){
                userRoles.push(RoleType.GUEST_VIEWER);
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
    getDesignVersionsForCurrentDesign(designId){

        // No action if design not yet set
        if (designId !== 'NONE') {

            // Get all the design versions available
            const currentDesignVersions = DesignData.getDesignVersionsOrderByVersion(designId);

             return {
                designVersions: currentDesignVersions
            };

        } else {
            console.log("Get Versions - no design");
            return {
                designVersions: []
            };
        }
    };

    getDesignVersionFeatureSummaries(userContext, homePageTab, displayContext = DisplayContext.NONE){

        let featureSummaries = [];
        let features = [];
        let scenarios = [];
        let featureSummary = {};

        if(homePageTab === HomePageTab.TAB_SUMMARY){

            // Main Summary Page.  List depends on display context.
            if (userContext.designVersionId === 'NONE') {

                return {
                    summaryData: featureSummaries,
                    designVersionName: 'NONE',
                    workPackageName: 'NONE',
                    homePageTab: HomePageTab.TAB_SUMMARY,
                    displayContext: displayContext
                };

            } else {

                switch(displayContext){

                    case DisplayContext.DV_BACKLOG_NO_EXP:

                        features = UserDvTestSummaryData.getFeaturesWithScenariosWithNoTestExpectations(userContext.userId, userContext.designVersionId);
                        break;

                    case DisplayContext.DV_BACKLOG_TEST_MISSING:

                        features = UserDvTestSummaryData.getFeaturesWithScenariosWithMissingTests(userContext.userId, userContext.designVersionId);
                        break;

                    case DisplayContext.DV_BACKLOG_TEST_FAIL:

                        features = UserDvTestSummaryData.getFeaturesWithScenariosWithFailingTests(userContext.userId, userContext.designVersionId);
                        break;

                    // case DisplayContext.PROJECT_SUMMARY_NONE:
                    //
                    //     features = UserDvTestSummaryData.getFeaturesWithMissingTestRequirements(userContext.userId, userContext.designVersionId);
                    //     break;
                    //
                    // case DisplayContext.PROJECT_SUMMARY_MISSING:
                    //
                    //     features = UserDvTestSummaryData.getFeaturesWithMissingRequiredTests(userContext.userId, userContext.designVersionId);
                    //     break;
                    //
                    // case DisplayContext.PROJECT_SUMMARY_FAIL:
                    //
                    //     features = UserDvTestSummaryData.getFeaturesWithFailingTests(userContext.userId, userContext.designVersionId);
                    //     break;
                    //
                    // case DisplayContext.PROJECT_SUMMARY_SOME:
                    //
                    //     features = UserDvTestSummaryData.getFeaturesWithSomePassingTests(userContext.userId, userContext.designVersionId);
                    //     break;
                    //
                    // case DisplayContext.PROJECT_SUMMARY_ALL:
                    //
                    //     features = UserDvTestSummaryData.getFeaturesWithAllTestsPassing(userContext.userId, userContext.designVersionId);
                    //     break;

                }

                features.forEach((featureTestSummary) => {

                    let feature = DesignComponentData.getDesignComponentByRef(userContext.designVersionId, featureTestSummary.featureReferenceId);

                    featureSummary = {
                        _id: feature._id,
                        featureName: feature.componentNameNew,
                        featureRef: feature.componentReferenceId,
                        hasTestData: true,
                        featureTestStatus: featureTestSummary.featureTestStatus,
                        featureScenarioCount: featureTestSummary.featureScenarioCount,
                        featureExpectedTestCount: featureTestSummary.featureExpectedTestCount,
                        featurePassingTestCount: featureTestSummary.featurePassingTestCount,
                        featureFailingTestCount: featureTestSummary.featureFailingTestCount,
                        featureMissingTestCount: featureTestSummary.featureMissingTestCount
                    };

                    featureSummaries.push(featureSummary);

                });

                const dv1 = DesignVersionData.getDesignVersionById(userContext.designVersionId);

                return {
                    summaryData: featureSummaries,
                    designVersionName: dv1.designVersionName,
                    workPackageName: 'NONE',
                    homePageTab: homePageTab,
                    displayContext: displayContext
                };

            }

        } else {

            if (userContext.designVersionId === 'NONE') {

                return {
                    summaryData: featureSummaries,
                    designVersionName: 'NONE',
                    workPackageName: 'NONE',
                    homePageTab: HomePageTab.TAB_DESIGNS,
                    displayContext: displayContext
                };

            } else {


                let wpFeatures = [];
                if (homePageTab === HomePageTab.TAB_DESIGNS) {

                    // Get all features in a Design Version
                    features = DesignVersionData.getNonRemovedFeatures(userContext.designId, userContext.designVersionId);

                } else {

                    // Getting features in a WP only
                    wpFeatures = WorkPackageData.getWorkPackageComponentsOfType(userContext.workPackageId, ComponentType.FEATURE);

                    wpFeatures.forEach((wpFeature) => {

                        let dvFeature = DesignComponentData.getDesignComponentByRef(userContext.designVersionId, wpFeature.componentReferenceId);

                        if (dvFeature && dvFeature.updateMergeStatus !== UpdateMergeStatus.COMPONENT_REMOVED) {
                            features.push(dvFeature);
                        }
                    });
                }


                const dv2 = DesignVersionData.getDesignVersionById(userContext.designVersionId);
                let wpName = '';

                if (homePageTab === HomePageTab.TAB_WORK && userContext.workPackageId !== 'NONE') {
                    const wp = WorkPackageData.getWorkPackageById(userContext.workPackageId);
                    if (wp) {
                        wpName = wp.workPackageName
                    }
                }

                features.forEach((feature) => {

                    const featureSummaryData = UserDvTestSummaryData.getFeatureSummary(userContext.userId, userContext.designVersionId, feature.componentReferenceId);

                    if (featureSummaryData) {

                        featureSummary = {
                            _id: feature._id,
                            featureName: feature.componentNameNew,
                            featureRef: feature.componentReferenceId,
                            hasTestData: true,
                            featureTestStatus: featureSummaryData.featureTestStatus,
                            featureScenarioCount: featureSummaryData.featureScenarioCount,
                            featureExpectedTestCount: featureSummaryData.featureExpectedTestCount,
                            featurePassingTestCount: featureSummaryData.featurePassingTestCount,
                            featureFailingTestCount: featureSummaryData.featureFailingTestCount,
                            featureMissingTestCount: featureSummaryData.featureMissingTestCount
                        };

                    } else {

                        featureSummary = {
                            _id: feature._id,
                            featureName: feature.componentNameNew,
                            featureRef: feature.componentReferenceId,
                            hasTestData: false,
                            featureTestStatus: 'NONE',
                            featureScenarioCount: 0,
                            featureExpectedTestCount: 0,
                            featurePassingTestCount: 0,
                            featureFailingTestCount: 0,
                            featureMissingTestCount: 0
                        };

                    }

                    featureSummaries.push(featureSummary);
                });

                if (dv2) {

                    return {
                        summaryData: featureSummaries,
                        designVersionName: dv2.designVersionName,
                        workPackageName: wpName,
                        homePageTab: homePageTab,
                        displayContext: displayContext
                    };
                } else {

                    return {
                        summaryData: featureSummaries,
                        designVersionName: 'NONE',
                        workPackageName: 'NONE',
                        homePageTab: HomePageTab.TAB_DESIGNS,
                        displayContext: displayContext
                    };
                }

            }
        }
    }

    // Get a list of Work Packages for a Design Version
    getWorkPackagesForCurrentDesignVersion(currentDesignVersionId, userRole, userContext, wpType){

        // No action if design version not yet set
        if (currentDesignVersionId !== 'NONE') {

            // Set the current tab depending on the current WP
            let defaultTab = WorkPackageTab.TAB_AVAILABLE;

            if(userContext.workPackageId !== 'NONE'){

                const wp = WorkPackageData.getWorkPackageById(userContext.workPackageId);

                switch(wp.workPackageStatus){

                    case WorkPackageStatus.WP_NEW:
                    case WorkPackageStatus.WP_AVAILABLE:

                        defaultTab = WorkPackageTab.TAB_AVAILABLE;
                        break;

                    case WorkPackageStatus.WP_ADOPTED:

                        defaultTab = WorkPackageTab.TAB_ADOPTED;
                        break;
                }
            }

            if(wpType === WorkPackageType.WP_BASE) {

                // Get New WPS
                const newWorkPackages = DesignVersionData.getIncompleteBaseWorkPackagesAtStatus(currentDesignVersionId, WorkPackageStatus.WP_NEW);

                // Get Available WPS
                const availableWorkPackages = DesignVersionData.getIncompleteBaseWorkPackagesAtStatus(currentDesignVersionId, WorkPackageStatus.WP_AVAILABLE);

                // Get Adopted WPS

                let adoptedWorkPackages = [];
                let completedWorkPackages = [];

                if(userRole === RoleType.DEVELOPER){

                    // Just get the WPS the developer has adopted
                    adoptedWorkPackages = DesignVersionData.getBaseUserAdoptedWorkPackages(currentDesignVersionId, userContext.userId);
                    completedWorkPackages = DesignVersionData.getAdoptingUserTestCompletedBaseWorkPackages(currentDesignVersionId, userContext.userId);

                } else {
                    adoptedWorkPackages = DesignVersionData.getIncompleteBaseWorkPackagesAtStatus(currentDesignVersionId, WorkPackageStatus.WP_ADOPTED);
                    completedWorkPackages = DesignVersionData.getTestCompletedBaseWorkPackages(currentDesignVersionId);
                }

                // Get the status of the current design version
                const designVersion = DesignVersionData.getDesignVersionById(currentDesignVersionId);

                //console.log("Base WPs found found: " + currentWorkPackages.count());

                // See if current is completed
                completedWorkPackages.forEach((wp) => {

                    if(wp._id === userContext.workPackageId){
                        defaultTab = WorkPackageTab.TAB_COMPLETE;
                    }
                });

               return {
                    wpType: WorkPackageType.WP_BASE,
                    newWorkPackages: newWorkPackages,
                    availableWorkPackages: availableWorkPackages,
                    adoptedWorkPackages: adoptedWorkPackages,
                    completedWorkPackages: completedWorkPackages,
                    designVersionStatus: designVersion.designVersionStatus,
                    defaultTab: defaultTab
                };

            } else {

                // Get New WPS
                const newWorkPackages = DesignVersionData.getIncompleteUpdateWorkPackagesAtStatus(currentDesignVersionId, WorkPackageStatus.WP_NEW);

                // Get Available WPS
                const availableWorkPackages = DesignVersionData.getIncompleteUpdateWorkPackagesAtStatus(currentDesignVersionId, WorkPackageStatus.WP_AVAILABLE);

                // Get Adopted WPS
                let adoptedWorkPackages = [];
                let completedWorkPackages = [];

                if(userRole === RoleType.DEVELOPER){

                    // Just get the WPS the developer has adopted
                    // console.log("Getting adopted WPs for user " + userId);
                    adoptedWorkPackages = DesignVersionData.getUpdateUserAdoptedWorkPackages(currentDesignVersionId, userContext.userId);
                    completedWorkPackages = DesignVersionData.getAdoptingUserTestCompletedUpdateWorkPackages(currentDesignVersionId, userContext.userId);

                } else {
                    adoptedWorkPackages = DesignVersionData.getIncompleteUpdateWorkPackagesAtStatus(currentDesignVersionId, WorkPackageStatus.WP_ADOPTED);
                    completedWorkPackages = DesignVersionData.getTestCompletedUpdateWorkPackages(currentDesignVersionId);
                }


                // Get the status of the current design version
                const designVersion = DesignVersionData.getDesignVersionById(currentDesignVersionId);

                // See if current is completed
                completedWorkPackages.forEach((wp) => {

                    if(wp._id === userContext.workPackageId){
                        defaultTab = WorkPackageTab.TAB_COMPLETE;
                    }
                });

               return {
                    wpType: WorkPackageType.WP_UPDATE,
                    newWorkPackages: newWorkPackages,
                    availableWorkPackages: availableWorkPackages,
                    adoptedWorkPackages: adoptedWorkPackages,
                    completedWorkPackages: completedWorkPackages,
                    designVersionStatus: designVersion.designVersionStatus,
                    defaultTab: defaultTab
                };

            }

        } else {
            return {
                newWorkPackages: [],
                availableWorkPackages: [],
                adoptedWorkPackages: [],
                completedWorkPackages: [],
                designVersionStatus: null,
                defaultTab: WorkPackageTab.TAB_AVAILABLE
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

            let defaultTab = DesignUpdateTab.TAB_NEW;

            // Get the selected DU if there is one
            let currentDu = null;
            let currentDuStatus = '';
            const currentDuId = store.getState().currentUserItemContext.designUpdateId;

            if(currentDuId !== 'NONE'){
                currentDu = DesignUpdateData.getDesignUpdateById(currentDuId);
                if(currentDu){
                    currentDuStatus = currentDu.updateStatus;
                }
            }

            // Get all the design updates available for the selected version sorted by type and name
            let incompleteUpdates = [];
            let assignedUpdates = [];

            // New updates must by definition be not in WPs and not completed
            const newUpdates = DesignVersionData.getIncompleteUpdatesAtStatus(currentDesignVersionId, DesignUpdateStatus.UPDATE_NEW);

            newUpdates.forEach((update) => {
                incompleteUpdates.push(update);
            });

            // Draft updates may be incomplete or assigned
            const draftUpdates = DesignVersionData.getIncompleteUpdatesAtStatus(currentDesignVersionId, DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT);

            draftUpdates.forEach((update) =>{

                const unassignedScenarios = DesignUpdateData.getScenariosNotInWorkPackages(update._id);
                const totalScenarios = DesignUpdateData.getInScopeScenarios(update._id);

                // Incomplete if any Scenarios not in WP OR if no Scenarios at all...
                if(unassignedScenarios.length > 0 || totalScenarios.length === 0){
                    incompleteUpdates.push(update);
                } else {
                    // Must be all assigned
                    assignedUpdates.push(update);

                    if(currentDu && update._id === currentDu._id){
                        defaultTab = DesignUpdateTab.TAB_ASSIGNED
                    }
                }
            });

            const mergedUpdates = DesignVersionData.getIncompleteUpdatesAtStatus(currentDesignVersionId, DesignUpdateStatus.UPDATE_MERGED);

            mergedUpdates.forEach((update) =>{

                const unassignedScenarios = DesignUpdateData.getScenariosNotInWorkPackages(update._id);

                if(unassignedScenarios.length > 0){
                    incompleteUpdates.push(update);
                } else {
                    // Must be all assigned
                    assignedUpdates.push(update);

                    if(currentDu && update._id === currentDu._id){
                        defaultTab = DesignUpdateTab.TAB_ASSIGNED
                    }
                }
            });

            const ignoredUpdates = DesignVersionData.getIncompleteUpdatesAtStatus(currentDesignVersionId, DesignUpdateStatus.UPDATE_IGNORED);

            ignoredUpdates.forEach((update) =>{

                const unassignedScenarios = DesignUpdateData.getScenariosNotInWorkPackages(update._id);

                if(unassignedScenarios.length > 0){
                    incompleteUpdates.push(update);
                } else {
                    // Must be all assigned
                    assignedUpdates.push(update);

                    if(currentDu && update._id === currentDu._id){
                        defaultTab = DesignUpdateTab.TAB_ASSIGNED
                    }
                }
            });

            // Complete updates are where all WPs are completed
            const completeUpdates = DesignVersionData.getWpTestCompleteUpdates(currentDesignVersionId);

            completeUpdates.forEach((update) => {

                if(currentDu && update._id === currentDu._id){
                    defaultTab = DesignUpdateTab.TAB_COMPLETE
                }
            });

            // Get the status of the current design version
            const designVersion = DesignVersionData.getDesignVersionById(currentDesignVersionId);

            let updateWorkPackages = [];
            if(store.getState().currentUserRole === RoleType.MANAGER && store.getState().currentUserItemContext.designUpdateId !== 'NONE'){
                // For a manager viewing updates select the WPs in the update
                updateWorkPackages = DesignUpdateData.getAllWorkPackages(store.getState().currentUserItemContext.designUpdateId);
            }

            console.log('Returning default tab for DUs: ' + defaultTab);

            return {
                incompleteUpdates: incompleteUpdates,
                assignedUpdates: assignedUpdates,
                completeUpdates: completeUpdates,
                updateWorkPackages: updateWorkPackages,
                designVersionStatus: designVersion.designVersionStatus,
                designUpdateStatus: currentDuStatus,
                defaultTab: defaultTab
            };

        } else {
            return {
                incompleteUpdates: [],
                assignedUpdates: [],
                completeUpdates: [],
                pdateWorkPackages: [],
                designVersionStatus: '',
                designUpdateStatus: '',
                defaultTab: DesignUpdateTab.TAB_NEW
            };
        }
    };

    // Get top level editor data (i.e Applications)
    getEditorApplicationData(userContext, view){

        //console.log("Getting Application data for " + view + " and DV: " + userContext.designVersionId + " DU: " + userContext.designUpdateId + " WP: " + userContext.workPackageId);

        const designVersion = DesignVersionData.getDesignVersionById(userContext.designVersionId);

        const baseApplicationsArr = DesignVersionData.getAllApplications(userContext.designVersionId);

        // All the existing and new stuff in the Design version - but for completed updatable versions leave out deleted
        let workingApplicationsArr = [];

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

                        //console.log("Getting Base Applications...");

                        // The app data is the Design Version data
                        let appDvComponent = DesignComponentData.getDesignComponentByRef(wpApp.designVersionId, wpApp.componentReferenceId);

                        if(appDvComponent) {
                            wpApplicationsArr.push(appDvComponent);
                        }
                        break;

                    case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                    case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                    case ViewType.DEVELOP_UPDATE_WP:

                        //console.log("Getting Update Applications...");

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


        return{
            baseApplications:       baseApplicationsArr,
            updateApplications:     updateApplicationsArr,
            wpApplications:         wpApplicationsArr,
            workingApplications:    workingApplicationsArr,
            designSummaryData:      designSummaryData
        };

        // switch(view){
        //     case ViewType.DESIGN_NEW:
        //     case ViewType.DESIGN_PUBLISHED:
        //     case ViewType.DESIGN_UPDATABLE:
        //         // Just need base design version applications
        //         return{
        //             baseApplications:       baseApplicationsArr,
        //             workingApplications:    workingApplicationsArr,
        //             designSummaryData:      designSummaryData
        //         };
        //     case ViewType.DESIGN_UPDATE_EDIT:
        //         // Need base and update apps
        //         return{
        //             baseApplications:       baseApplicationsArr,
        //             updateApplications:     updateApplicationsArr,
        //             workingApplications:    workingApplicationsArr
        //         };
        //     case ViewType.DESIGN_UPDATE_VIEW:
        //         // Need design update apps only
        //         return{
        //             baseApplications:       [],
        //             updateApplications:     updateApplicationsArr,
        //             workingApplications:    workingApplicationsArr
        //         };
        //
        //     case ViewType.WORK_PACKAGE_BASE_EDIT:
        //     case ViewType.WORK_PACKAGE_BASE_VIEW:
        //         return {
        //             scopeApplications:  baseApplicationsArr,
        //             wpApplications:     wpApplicationsArr,
        //         };
        //
        //     case ViewType.WORK_PACKAGE_UPDATE_EDIT:
        //     case ViewType.WORK_PACKAGE_UPDATE_VIEW:
        //         // Need base design version apps and WP in scope apps
        //         return{
        //             scopeApplications:  updateApplicationsArr,
        //             wpApplications:     wpApplicationsArr,
        //         };
        //     case ViewType.DEVELOP_BASE_WP:
        //     case ViewType.DEVELOP_UPDATE_WP:
        //         // Need just WP apps TODO: get feature files
        //         return {
        //             wpApplications: wpApplicationsArr,
        //             featureFiles: []
        //         };
        // }
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
                case ViewType.DESIGN_NEW:
                case ViewType.DESIGN_PUBLISHED:

                    // Don't include removed components in this view if a completed updatable version
                    currentComponents = DesignComponentData.getNonRemovedChildComponentsOfType(designVersionId, childComponentType, parentRefId);

                    return currentComponents;

                case ViewType.DESIGN_UPDATABLE:

                    switch (displayContext) {
                        case DisplayContext.MASH_ACC_TESTS:
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
                        case DisplayContext.MASH_ACC_TESTS:

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
                        case DisplayContext.MASH_ACC_TESTS:

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
    //         case ViewType.DESIGN_NEW:
    //         case ViewType.DESIGN_PUBLISHED:
    //         case ViewType.DESIGN_UPDATABLE:
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
    //         case ViewType.DESIGN_NEW:
    //         case ViewType.DESIGN_PUBLISHED:
    //         case ViewType.DESIGN_UPDATABLE:
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
                case ViewType.DESIGN_NEW:
                case ViewType.DESIGN_PUBLISHED:
                case ViewType.WORK_PACKAGE_BASE_EDIT:
                case ViewType.WORK_PACKAGE_BASE_VIEW:
                case ViewType.DEVELOP_BASE_WP:
                case ViewType.DESIGN_UPDATABLE:

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

    getScenarioTestSummaryData(userContext, scenarioRefId){

        let summaryData = UserDvTestSummaryData.getScenarioSummary(
            userContext.userId,
            userContext.designVersionId,
            scenarioRefId
        );

        //console.log('Summary data for user %s, dv %s, ref %s is %o', userContext.userId, userContext.designVersionId, scenarioRefId, summaryData);

        if(!summaryData){
            summaryData = {};
        }

        const scenarioTestExpectations = ScenarioTestExpectationData.getScenarioTestExpectationsForScenario(
            userContext.designVersionId,
            scenarioRefId
        );

        const scenario = DesignComponentData.getDesignComponentByRef(userContext.designVersionId, scenarioRefId);

        return{
            summaryData: summaryData,
            testExpectations: scenarioTestExpectations,
            scenario: scenario
        }

    }

    getFeatureTestSummaryData(userContext, featureRefId){

        const featureSummary = UserDvTestSummaryData.getFeatureSummary(
            userContext.userId,
            userContext.designVersionId,
            featureRefId
        );

        if(featureSummary){
            return featureSummary;
        } else {
            return {};
        }

    }

    getDesignVersionTestSummaryData(){

    }

    getScenarioMashData(userContext, featureAspectReferenceId, scenarioReferenceId = 'NONE'){

        // Return all scenario mash data for the current Feature Aspect or Scenario

        //console.log("looking for scenarios with FA: " + featureAspectReferenceId + " and SC: " + scenarioReferenceId);
        //log((msg) => console.log(msg), LogLevel.PERF, 'Getting Scenario Mash Data...');

        if(userContext.workPackageId === 'NONE') {

            // Get all scenarios

            if (scenarioReferenceId === 'NONE') {

                //log((msg) => console.log(msg), LogLevel.PERF, 'Returning FA Scenarios');
                return UserDvMashScenarioData.getFeatureAspectScenarios(userContext.userId, userContext.designVersionId, featureAspectReferenceId);

            } else {

                //log((msg) => console.log(msg), LogLevel.PERF, 'Returning Scenarios');
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

            //log((msg) => console.log(msg), LogLevel.PERF, 'Returning WP Scenarios');
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

        return UserDvMashScenarioData.getScenario(userContext, scenario.componentReferenceId);
    }

    getTestSummaryFeatureData(feature){

        const userContext = store.getState().currentUserItemContext;

        return UserDvTestSummaryData.getTestSummaryForFeature(userContext.userId, feature.designVersionId, feature.componentReferenceId);

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
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
                detailsOption = ViewOptionType.DESIGN_DETAILS;
                detailsValue = userViewOptions.designDetailsVisible;
                dictOption = ViewOptionType.DESIGN_DICT;
                dictValue = userViewOptions.designDomainDictVisible;
                testSummaryOption = ViewOptionType.DESIGN_TEST_SUMMARY;
                testSummaryValue = userViewOptions.testSummaryVisible;
                accTestOption = ViewOptionType.DEV_ACC_TESTS;
                accTestValue = userViewOptions.devAccTestsVisible;
                intTestOption = ViewOptionType.DEV_INT_TESTS;
                intTestValue = userViewOptions.devIntTestsVisible;
                unitTestOption = ViewOptionType.DEV_UNIT_TESTS;
                unitTestValue = userViewOptions.devUnitTestsVisible;
                allAsTabsOption = ViewOptionType.DESIGN_ALL_AS_TABS;
                allAsTabsValue = userViewOptions.designShowAllAsTabs;
                break;
            case ViewType.DESIGN_UPDATABLE:
                detailsOption = ViewOptionType.DESIGN_DETAILS;
                detailsValue = userViewOptions.designDetailsVisible;
                dictOption = ViewOptionType.DESIGN_DICT;
                dictValue = userViewOptions.designDomainDictVisible;
                testSummaryOption = ViewOptionType.DESIGN_TEST_SUMMARY;
                testSummaryValue = userViewOptions.testSummaryVisible;
                accTestOption = ViewOptionType.DEV_ACC_TESTS;
                accTestValue = userViewOptions.devAccTestsVisible;
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
                allAsTabsOption = ViewOptionType.WORK_ALL_AS_TABS;
                allAsTabsValue = userViewOptions.workShowAllAsTabs;
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
        // const gotoDesigns = {
        //     key: MenuAction.MENU_ACTION_GOTO_DESIGNS,
        //     itemName: TextLookups.menuItems(MenuAction.MENU_ACTION_GOTO_DESIGNS),
        //     action: MenuAction.MENU_ACTION_GOTO_DESIGNS,
        //     hasCheckbox: false,
        //     checkboxValue: false,
        //     viewOptionType: ViewOptionType.NONE
        // };

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

            case ViewType.SELECT:

                switch (menuType) {
                    case MenuDropdown.MENU_DROPDOWN_REFRESH:

                        switch(userRole){
                            case RoleType.GUEST_VIEWER:

                                return [
                                    refreshTestData
                                ];

                            default:

                                return [
                                    refreshProgressData,
                                    refreshTestData
                                ];
                        }
                }
                break;

            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DESIGN_UPDATABLE:
                switch (menuType) {

                    case MenuDropdown.MENU_DROPDOWN_VIEW:

                        switch(userRole){
                            case RoleType.GUEST_VIEWER:

                                return [
                                    viewDetails,
                                    viewDomainDict,
                                    viewTestSummary,
                                    viewAllAsTabs
                                ];

                            default:

                                return [
                                    viewDetails,
                                    viewDomainDict,
                                    viewAccTests,
                                    viewIntTests,
                                    viewUnitTests,
                                    viewTestSummary,
                                    viewAllAsTabs
                                ];
                        }

                    case MenuDropdown.MENU_DROPDOWN_REFRESH:

                        return [
                            refreshTestData
                        ];

                }
                break;

            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:

                switch (menuType) {

                    case MenuDropdown.MENU_DROPDOWN_VIEW:
                        return [
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

            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:

                switch (menuType) {

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

                    case MenuDropdown.MENU_DROPDOWN_VIEW:
                        return [
                            viewDetails,
                            viewDomainDict,
                            viewAccTests,
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

    getDefaultFeatureAspects(designId){

        return DefaultFeatureAspectData.getDefaultAspectsForDesign(designId);
    }

    getDvSummaryData(userContext){

        // DV Name
        let designVersionName = 'No Design Version Selected';
        let dvFeatureCount = 0;
        let dvScenarioCount = 0;
        let dvExpectedTestCount = 0;
        let dvPassingTestCount = 0;
        let dvNoTestExpectationsScenarioCount = 0;
        let dvMissingTestScenarioCount = 0;
        let dvFailingTestScenarioCount = 0;

        const designVersion = DesignVersionData.getDesignVersionById(userContext.designVersionId);

        if(designVersion) {

            designVersionName = designVersion.designVersionName;

            const dvSummary = UserDvTestSummaryData.getDesignVersionTestSummary(
                userContext.userId,
                userContext.designVersionId
            );

            if(dvSummary){
                dvFeatureCount = dvSummary.dvFeatureCount;
                dvScenarioCount = dvSummary.dvScenarioCount;
                dvExpectedTestCount = dvSummary.dvExpectedTestCount;
                dvPassingTestCount = dvSummary.dvPassingTestCount
            }

            dvNoTestExpectationsScenarioCount = UserDvTestSummaryData.getScenariosWithNoTestExpectations(userContext.userId, userContext.designVersionId).length;
            dvMissingTestScenarioCount = UserDvTestSummaryData.getScenariosWithMissingTests(userContext.userId, userContext.designVersionId).length;
            dvFailingTestScenarioCount = UserDvTestSummaryData.getScenariosWithFailingTests(userContext.userId, userContext.designVersionId).length;
        }

        return{
            designVersionName:          designVersionName,
            dvFeatureCount:             dvFeatureCount,
            dvScenarioCount:            dvScenarioCount,
            dvExpectedTestCount:        dvExpectedTestCount,
            dvPassingTestCount:         dvPassingTestCount,
            dvNoTestExpectationsCount:  dvNoTestExpectationsScenarioCount,
            dvMissingTestCount:         dvMissingTestScenarioCount,
            dvFailingTestCount:         dvFailingTestScenarioCount
        }
    }

    getProjectSummaryData(userContext){

        // Want to return:
        // Design Version Name
        // Total features in DV
        // Number of features with scenarios with no test requirements
        // Number of features with scenarios required tests missing
        // Number of features with failing tests
        // Number of features with some passing tests
        // Number of features with all required tests passing

        // DV Name
        let designVersionName = 'No Design Version Selected';
        const designVersion = DesignVersionData.getDesignVersionById(userContext.designVersionId);

        let totalFeatureCount = 0;
        let noRequirementsCount = 0;
        let missingRequirementsCount = 0;
        let failingCount = 0;
        let somePassingCount = 0;
        let allPassingCount = 0;
        let testsCount = 0;

        if(designVersion){

            designVersionName = designVersion.designVersionName;

            totalFeatureCount = DesignVersionData.getNonRemovedFeatureCount(userContext.designId, userContext.designVersionId);

            noRequirementsCount = UserDvTestSummaryData.getFeaturesWithMissingTestRequirements(userContext.userId, userContext.designVersionId).length;
            missingRequirementsCount = UserDvTestSummaryData.getFeaturesWithMissingRequiredTests(userContext.userId, userContext.designVersionId).length;
            failingCount = UserDvTestSummaryData.getFeaturesWithFailingTests(userContext.userId, userContext.designVersionId).length;
            somePassingCount = UserDvTestSummaryData.getFeaturesWithSomePassingTests(userContext.userId, userContext.designVersionId).length;
            allPassingCount = UserDvTestSummaryData.getFeaturesWithAllTestsPassing(userContext.userId, userContext.designVersionId).length;

            testsCount = failingCount + somePassingCount + allPassingCount;
        }

        return(
            {
                designVersionName: designVersionName,
                totalFeatureCount: totalFeatureCount,
                noTestRequirementsCount: noRequirementsCount,
                missingTestRequirementsCount: missingRequirementsCount,
                failingTestsCount: failingCount,
                someTestsCount: somePassingCount,
                allTestsCount: allPassingCount,
                testsCount: testsCount
            }
        )
    }

}

export const ClientDataServices = new ClientDataServicesClass();