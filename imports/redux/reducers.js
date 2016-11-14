/**
 * Created by aston on 14/08/2016.
 */

import * as Actions from './actions'
import {RoleType, ViewType, ViewMode, MessageType} from '../constants/constants.js'

// Creates the initial state container for your application - the same as getInitialState
const initialState = {
    currentUserRole: RoleType.NONE,
    currentUserName: '',
    currentAppView: ViewType.AUTHORISE,
    currentViewMode: ViewMode.MODE_VIEW,
    domainDictionaryVisible: false,
    currentUserViewOptions: null,
    currentUserItemContext: null,
    currentUserDevContext: null,
    currentUserOpenDesignItems: [],
    currentUserOpenDesignUpdateItems: [],
    currentUserOpenWorkPackageItems: [],
    currentDesignComponentName: 'No Component',
    currentDesignComponentRawName: null,
    currentUserMessage: {messageType: MessageType.INFO, messageText: 'No message' },
    currentProgressDataValue: false,
    currentViewOptionsDataValue: false

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
        case Actions.SET_CURRENT_USER_ITEM_CONTEXT:
            console.log("Updated User Item Context: " + action.newUserItemContext);
            return Object.assign({}, state, {
                currentUserItemContext: action.newUserItemContext
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
        case Actions.UPDATE_PROGRESS_DATA:
            return Object.assign({}, state, {
                currentProgressDataValue: action.newDataValue
            });
        case Actions.UPDATE_VIEW_OPTIONS_DATA:
            return Object.assign({}, state, {
                currentViewOptionsDataValue: action.newDataValue
            });

        default:
            return state
    }
}
