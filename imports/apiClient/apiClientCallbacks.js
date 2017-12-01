// == IMPORTS ==========================================================================================================

// Ultrawide Services
import { RoleType, UserSetting, UserSettingValue } from '../constants/constants.js';
import { log }                          from '../common/utils.js';

import ClientDesignVersionServices      from '../apiClient/apiClientDesignVersion.js';
import ClientDesignUpdateServices       from '../apiClient/apiClientDesignUpdate.js';
import ClientAppHeaderServices          from '../apiClient/apiClientAppHeader.js';
import ClientUserSettingsServices       from '../apiClient/apiClientUserSettings.js';
import ClientUserContextServices        from '../apiClient/apiClientUserContext.js';

// Data Access
import UserRoleData                     from '../data/users/user_role_db.js';

// REDUX services
import store from '../redux/store'
import {
    setCurrentRole, setCurrentWindowSize,
    setIntTestOutputDir,
    setDocSectionTextOption, setDocFeatureTextOption,
    setDocNarrativeTextOption, setDocScenarioTextOption, setIncludeNarratives, setCurrentUserHomeTab
} from '../redux/actions'

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Client Callbacks
//
// A separate class to avoid the problem that a callback cannot user 'this' so all functions called need to be in a different class
//
// ---------------------------------------------------------------------------------------------------------------------

class ClientCallbacks {

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
        // TODO - Implement default role
        const user = UserRoleData.getRoleByUserId(userContext.userId);

        if(user.isDesigner){
            store.dispatch(setCurrentRole(userContext.userId, RoleType.DESIGNER))
        } else{
            if(user.isManager){
                store.dispatch(setCurrentRole(userContext.userId, RoleType.MANAGER))
            } else {
                if(user.isDeveloper){
                    store.dispatch(setCurrentRole(userContext.userId, RoleType.DEVELOPER))
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
}

export default new ClientCallbacks();