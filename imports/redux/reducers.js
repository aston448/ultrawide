/**
 * Created by aston on 14/08/2016.
 */

import * as Actions from './actions'
import {RoleType, ViewType, ViewMode, MessageType, UserSettingValue, HomePageTab} from '../constants/constants.js'
import {DisplayContext, UpdateScopeType, WorkPackageTab} from "../constants/constants";

// Creates the initial state container for your application - the same as getInitialState
const initialState = {
    currentUserRole:                    RoleType.NONE,
    currentUserName:                    '',
    currentUserId:                      'NONE',                  // Note this is only the currently selected user in the ADMIN screen
    currentAppView:                     ViewType.AUTHORISE,
    currentViewMode:                    ViewMode.MODE_VIEW,
    currentWindowSize:                  UserSettingValue.SCREEN_SIZE_LARGE,
    includeNarratives:                  UserSettingValue.SETTING_INCLUDE,
    docSectionTextOption:               UserSettingValue.SETTING_INCLUDE,
    docFeatureTextOption:               UserSettingValue.SETTING_INCLUDE,
    docNarrativeTextOption:             UserSettingValue.SETTING_INCLUDE,
    docScenarioTextOption:              UserSettingValue.SETTING_INCLUDE,
    domainTermsVisible:                 true,
    intTestOutputDir:                   '',
    domainDictionaryVisible:            false,
    currentUserViewOptions:             {
        designDetailsVisible:       false,
        designDomainDictVisible:    false,
        testSummaryVisible:         false,
        updateProgressVisible:      false,
        updateSummaryVisible:       false,
        devAccTestsVisible:         false,
        devIntTestsVisible:         false,
        devUnitTestsVisible:        false,
        devFeatureFilesVisible:     false,
        designShowAllAsTabs:        false,
        updateShowAllAsTabs:        false,
        workShowAllAsTabs:          false
    },
    currentUserItemContext:             null,
    currentUserHomeTab:                 HomePageTab.TAB_NOT_SET,
    currentUserSummaryItem:             DisplayContext.PROJECT_SUMMARY_ALL,
    currentUserTestOutputLocationId:    'NONE',
    currentUserDevContext:              null,
    currentUserOpenDesignItems:         [],
    currentUserOpenDesignUpdateItems:   [],
    currentUserOpenWorkPackageItems:    [],
    currentUpdateScopeItems:            {
        flag:   0,
        current: [
            {
                ref: 'NONE',
                scopeType:  UpdateScopeType.SCOPE_OUT_SCOPE
            }
        ]
    },
    currentUpdateScopeFlag:             0,
    currentWorkPackageScopeItems:       {
        flag:   0,
        current: [
            {
                ref: 'NONE',
                scopeType:  UpdateScopeType.SCOPE_OUT_SCOPE
            }
        ],
    },
    currentWorkPackageScopeFlag:        0,
    currentDesignComponentName:         'No Component',
    currentDesignComponentRawName:      null,
    currentUserMessage:                 {messageType: MessageType.INFO, messageText: 'Please log in...' },
    testDataFlag:                       0,
    designVersionDataLoaded:            false,      // True when data for the current DV is subscribed to
    workPackageDataLoaded:              false,      // True when data for current WP is subscribed to
    testIntegrationDataLoaded:          false,      // True when the test integration data for the current user is subscribed to
    testSummaryDataLoaded:              false,      // True when the Test Summmary data has been calculated
    testDataStale:                      true,       // True when new test data is available
    mashDataStale:                      true,       // True when design has changed or mash needs recalculating
    currentViewOptionsDataValue:        0,
    openItemsFlag:                      false,
    currentFeatureTestExpectations:{
        featureId:              'NONE',
        needsUpdate:            false,
        scenarioExpectations:   []

    }

};

// You can map all your actions here. The key thing is that they must not mutate the Stores state.
// They must return a new copy of the part of the state tree they are manipulating.

export function myApplication(state = initialState, action) {
    switch (action.type) {
        case Actions.SET_CURRENT_USER_ROLE:
            return Object.assign({}, state, {
                currentUserRole: action.newUserRole
            });
        case Actions.SET_CURRENT_USER_NAME:
            return Object.assign({}, state, {
                currentUserName: action.newUserName
            });
        case Actions.SET_CURRENT_USER_ID:
            return Object.assign({}, state, {
                currentUserId: action.newUserId
            });
        case Actions.SET_CURRENT_VIEW:
            return Object.assign({}, state, {
                currentAppView: action.newView
            });
        case Actions.SET_CURRENT_VIEW_MODE:
            return Object.assign({}, state, {
                currentViewMode: action.newMode
            });
        case Actions.TOGGLE_DOMAIN_DICTIONARY:
            return Object.assign({}, state, {
                domainDictionaryVisible: action.isVisible
            });
        case Actions.SET_CURRENT_USER_VIEW_OPTIONS:
            return Object.assign({}, state, {
                currentUserViewOptions: action.newUserViewOptions
            });
        case Actions.SET_WINDOW_SIZE:
            return Object.assign({}, state, {
                currentWindowSize: action.newSize
            });
        case Actions.SET_INCLUDE_NARRATIVES_OPTION:
            return Object.assign({}, state, {
                includeNarratives: action.newOption
            });
        case Actions.SET_INT_TEST_OUTPUT_DIR:
            return Object.assign({}, state, {
                intTestOutputDir: action.newDir
            });
        case Actions.SET_DOC_SECTION_TEXT_OPTION:
            return Object.assign({}, state, {
                docSectionTextOption: action.newOption
            });
        case Actions.SET_DOC_FEATURE_TEXT_OPTION:
            return Object.assign({}, state, {
                docFeatureTextOption: action.newOption
            });
        case Actions.SET_DOC_NARRATIVE_TEXT_OPTION:
            return Object.assign({}, state, {
                docNarrativeTextOption: action.newOption
            });
        case Actions.SET_DOC_SCENARIO_TEXT_OPTION:
            return Object.assign({}, state, {
                docScenarioTextOption: action.newOption
            });
        case Actions.SET_DOMAIN_TERMS_ON_OFF:
            return Object.assign({}, state, {
                domainTermsVisible: action.newSetting
            });
        case Actions.SET_CURRENT_USER_ITEM_CONTEXT:
            return Object.assign({}, state, {
                currentUserItemContext: action.newUserItemContext
            });
        case Actions.SET_CURRENT_USER_HOME_TAB:
            return Object.assign({}, state, {
                currentUserHomeTab: action.newTab
            });
        case Actions.SET_CURRENT_USER_SUMMARY_ITEM:
            return Object.assign({}, state, {
                currentUserSummaryItem: action.newItem
            });
        case Actions.SET_CURRENT_USER_TEST_OUTPUT_LOCATION:
            return Object.assign({}, state, {
                currentUserTestOutputLocationId: action.newUserTestOutputLocationId
            });
        case Actions.SET_CURRENT_USER_DEV_CONTEXT:
            return Object.assign({}, state, {
                currentUserDevContext: action.newUserDevContext
            });
        case Actions.SET_CURRENT_USER_OPEN_DESIGN_ITEMS:
            return Object.assign({}, state, {
                currentUserOpenDesignItems: action.newUserOpenDesignItems
            });
        case Actions.SET_CURRENT_USER_OPEN_DESIGN_UPDATE_ITEMS:
            return Object.assign({}, state, {
                currentUserOpenDesignUpdateItems: action.newUserOpenDesignUpdateItems
            });
        case Actions.SET_CURRENT_USER_OPEN_WORK_PACKAGE_ITEMS:
            return Object.assign({}, state, {
                currentUserOpenWorkPackageItems: action.newUserOpenWorkPackageItems
            });
        case Actions.SET_UPDATE_SCOPE_ITEMS:
            return Object.assign({}, state, {
                currentUpdateScopeItems: action.newUpdateScopeItems
            });
        case Actions.SET_UPDATE_SCOPE_FLAG:
            return Object.assign({}, state, {
                currentUpdateScopeFlag: action.newUpdateScopeFlag
            });
        case Actions.SET_WP_SCOPE_ITEMS:
            return Object.assign({}, state, {
                currentWorkPackageScopeItems: action.newWpScopeItems
            });
        case Actions.SET_WP_SCOPE_FLAG:
            return Object.assign({}, state, {
                currentWorkPackageScopeFlag: action.newWpScopeFlag
            });
        case Actions.UPDATE_DESIGN_COMPONENT_NAME:
            return Object.assign({}, state, {
                currentDesignComponentName: action.newDesignComponentName
            });
        case Actions.UPDATE_DESIGN_COMPONENT_RAW_NAME:
            return Object.assign({}, state, {
                currentDesignComponentRawName: action.newDesignComponentRawName
            });
        case Actions.UPDATE_USER_MESSAGE:
            return Object.assign({}, state, {
                currentUserMessage: action.newUserMessage
            });
        case Actions.UPDATE_TEST_DATA_FLAG:
            return Object.assign({}, state, {
                testDataFlag: action.newDataValue
            });
        case Actions.UPDATE_DESIGN_VERSION_DATA_LOADED_FLAG:
            return Object.assign({}, state, {
                designVersionDataLoaded: action.newDesignVersionDataLoadedValue
            });
        case Actions.UPDATE_WORK_PACKAGE_DATA_LOADED_FLAG:
            return Object.assign({}, state, {
                workPackageDataLoaded: action.newWorkPackageDataLoadedValue
            });
        case Actions.UPDATE_TEST_INTEGRATION_DATA_LOADED_FLAG:
            return Object.assign({}, state, {
                testIntegrationDataLoaded: action.newTestIntegrationDataLoadedValue
            });
        case Actions.UPDATE_TEST_SUMMARY_DATA_LOADED_FLAG:
            return Object.assign({}, state, {
                testSummaryDataLoaded: action.newTestSummaryDataLoadedValue
            });
        case Actions.UPDATE_TEST_DATA_STALE_FLAG:
            return Object.assign({}, state, {
                testDataStale: action.newTestStaleValue
            });
        case Actions.UPDATE_MASH_DATA_STALE_FLAG:
            return Object.assign({}, state, {
                mashDataStale: action.newMashStaleValue
            });
        case Actions.UPDATE_VIEW_OPTIONS_DATA:
            return Object.assign({}, state, {
                currentViewOptionsDataValue: action.newDataValue
            });
        case Actions.UPDATE_OPEN_ITEMS_FLAG:
            return Object.assign({}, state, {
                openItemsFlag: action.newFlagValue
            });

        default:
            return state
    }
}
