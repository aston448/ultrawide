/**
 * Created by aston on 14/08/2016.
 */
import { ViewType, MessageType } from '../constants/constants.js';

// Determines what the logged in user can see / do
export const SET_CURRENT_USER_ROLE = 'SET_CURRENT_USER_ROLE';
export const SET_CURRENT_USER_NAME = 'SET_CURRENT_USER_NAME';

// Indicates what the current user has chosen to see
export const SET_CURRENT_VIEW = 'SET_CURRENT_VIEW';
export const SET_CURRENT_VIEW_MODE = 'SET_CURRENT_VIEW_MODE';
export const TOGGLE_DOMAIN_DICTIONARY = 'TOGGLE_DOMAIN_DICTIONARY';

export const SET_CURRENT_USER_VIEW_OPTIONS = 'SET_CURRENT_USER_VIEW_OPTIONS';
export const SET_WINDOW_SIZE = 'SET_WINDOW_SIZE';
export const SET_INT_TEST_OUTPUT_DIR = 'SET_INT_TEST_OUTPUT_DIR';
export const SET_DOC_SECTION_TEXT_OPTION = 'SET_DOC_SECTION_TEXT_OPTION';
export const SET_DOC_FEATURE_TEXT_OPTION = 'SET_DOC_FEATURE_TEXT_OPTION';
export const SET_DOC_NARRATIVE_TEXT_OPTION = 'SET_DOC_NARRATIVE_TEXT_OPTION';
export const SET_DOC_SCENARIO_TEXT_OPTION = 'SET_DOC_SCENARIO_TEXT_OPTION';
export const SET_DOMAIN_TERMS_ON_OFF = 'SET_DOMAIN_TERMS_ON_OFF';

// the currently selected user in the User Management screen - NOT the currently logged in user
export const SET_CURRENT_USER_ID = 'SET_CURRENT_USER_ID';

// Indicates the current data item context for a user - i.e. what they are looking at
export const SET_CURRENT_USER_ITEM_CONTEXT = 'SET_CURRENT_USER_ITEM_CONTEXT';
export const SET_CURRENT_USER_TEST_OUTPUT_LOCATION = 'SET_CURRENT_USER_TEST_OUTPUT_LOCATION';

// Indicates the current development context for a developer - i.e. what they are working on
export const SET_CURRENT_USER_DEV_CONTEXT = 'SET_CURRENT_USER_DEV_CONTEXT';

// These items track which items are open in the display for each user.
// Therefore one user opening an item does not open it for anyone else!
export const SET_CURRENT_USER_OPEN_DESIGN_ITEMS = 'SET_CURRENT_USER_OPEN_DESIGN_ITEMS';
export const SET_CURRENT_USER_OPEN_DESIGN_UPDATE_ITEMS = 'SET_CURRENT_USER_OPEN_DESIGN_UPDATE_ITEMS';
export const SET_CURRENT_USER_OPEN_WORK_PACKAGE_ITEMS = 'SET_CURRENT_USER_OPEN_WORK_PACKAGE_ITEMS';

export const SET_UPDATE_SCOPE_ITEMS = 'SET_UPDATE_SCOPE_ITEMS';
export const SET_UPDATE_SCOPE_FLAG = 'SET_UPDATE_SCOPE_FLAG';

export const SET_WP_SCOPE_ITEMS = 'SET_WP_SCOPE_ITEMS';
export const SET_WP_SCOPE_FLAG = 'SET_WP_SCOPE_FLAG';

// Passes on updates to displayed text for a component
export const UPDATE_DESIGN_COMPONENT_NAME = 'UPDATE_DESIGN_COMPONENT_NAME';
export const UPDATE_DESIGN_COMPONENT_RAW_NAME = 'UPDATE_DESIGN_COMPONENT_RAW_NAME';

// This flag is toggled each time an update to test / design progress data is requested
// Include it as a property in any components that should redraw
export const UPDATE_TEST_DATA_FLAG = 'UPDATE_TEST_DATA_FLAG';

// Indication of whether DV data is loaded
export const UPDATE_DESIGN_VERSION_DATA_LOADED_FLAG = 'UPDATE_DESIGN_VERSION_DATA_LOADED_FLAG';

// Indication of whether WP data is loaded
export const UPDATE_WORK_PACKAGE_DATA_LOADED_FLAG = 'UPDATE_WORK_PACKAGE_DATA_LOADED_FLAG';

// Indication of whether Test Integration data is loaded
export const UPDATE_TEST_INTEGRATION_DATA_LOADED_FLAG = 'UPDATE_TEST_INTEGRATION_DATA_LOADED_FLAG';

// Indication of whether Test Summary data is loaded
export const UPDATE_TEST_SUMMARY_DATA_LOADED_FLAG = 'UPDATE_TEST_SUMMARY_DATA_LOADED_FLAG';

// Flags to indicate when Design-Dev Mash data is stale
export const UPDATE_MASH_DATA_STALE_FLAG = 'UPDATE_MASH_DATA_STALE_FLAG';
export const UPDATE_TEST_DATA_STALE_FLAG = 'UPDATE_TEST_DATA_STALE_FLAG';

export const UPDATE_OPEN_ITEMS_FLAG = "UPDATE_OPEN_ITEMS_FLAG";

// Flag to trigger redraw on update of view options
export const UPDATE_VIEW_OPTIONS_DATA = 'UPDATE_VIEW_OPTIONS_DATA';

// Messaging system
export const UPDATE_USER_MESSAGE = 'UPDATE_USER_MESSAGE';

// Sets the current user role - one user can change roles if allowed to
export function setCurrentRole(userId, role) {
    return function (dispatch) {
        //console.log("ACTIONS: Role to " + role);
        dispatch({type: SET_CURRENT_USER_ROLE, newUserRole: role});
    };
}

// Sets the current user name
export function setCurrentUserName(name) {
    return function (dispatch) {
        //console.log("ACTIONS: User name to " + name);
        dispatch({type: SET_CURRENT_USER_NAME, newUserName: name});
    };
}

// Sets the current user view
export function setCurrentView(view) {
    return function (dispatch) {
        //console.log("ACTIONS: View to " + view);
        dispatch({type: SET_CURRENT_VIEW, newView: view});

        // When the view changes set a default info message
        let message = '';
        switch(view){
            case ViewType.AUTHORISE:
                message = 'Please log in...';
                break;
            case ViewType.ROLES:
                message = 'Choose an action for your desired Role...';
                break;
            case ViewType.CONFIGURE:
                message = 'User Settings';
                break;
            case ViewType.DESIGNS:
                message = 'Available Designs';
                break;
            case ViewType.ADMIN:
                message = 'Ultrawide Admin';
                break;
            case ViewType.SELECT:
                message = 'Select the item you want to work on...';
                break;
            case ViewType.DESIGN_NEW:
                message = 'Initial Design Version';
                break;
            case ViewType.DESIGN_PUBLISHED:
                message = 'View Design Version';
                break;
            case ViewType.DESIGN_UPDATABLE:
                message = 'View Design Version Progress';
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
                message = 'Design Update Editor';
                break;
            case ViewType.DESIGN_UPDATE_VIEW:
                message = 'View Design Update';
                break;
            case ViewType.DEVELOP_BASE_WP:
                message = 'Develop Base Design Work Package';
                break;
            case ViewType.DEVELOP_UPDATE_WP:
                message = 'Develop Design Update Work Package';
                break;
            case ViewType.WORK_PACKAGE_BASE_EDIT:
                message = 'Edit Initial Design Work Package';
                break;
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
                message = 'Edit Design Update Work Package';
                break;
            case ViewType.WORK_PACKAGE_BASE_VIEW:
                message = 'View Initial Design Work Package';
                break;
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                message = 'View Design Update Work Package';
                break;
            case ViewType.WAIT:
                message = 'Data loading.  Please wait...';
                break;
            default:
                message = 'Unsupported View';
        }

        dispatch({type: UPDATE_USER_MESSAGE, newUserMessage: {messageType: MessageType.INFO, messageText: message}})
    };
}

// Toggles between EDIT and VIEW mode
export function setCurrentViewMode(newMode) {
    return function (dispatch) {
        dispatch({type: SET_CURRENT_VIEW_MODE, newMode: newMode});
    };
}

// Toggles Domain Dictionary view on or off
export function toggleDomainDictionary(isVisible) {
    return function (dispatch) {
        dispatch({type: TOGGLE_DOMAIN_DICTIONARY, isVisible: isVisible});
    };
}

// USER SETTINGS -------------------------------------------------------------------------------------------------------
export function setCurrentUserViewOptions(viewOptions, userId, saveToDb){

     return function (dispatch) {

        dispatch({type: SET_CURRENT_USER_VIEW_OPTIONS, newUserViewOptions: viewOptions});

        // And persist the settings - only want to do this if we are changing them...
        if(saveToDb) {
            Meteor.call('userContext.setCurrentUserViewOptions', viewOptions, userId);
        }
    };
}

export function setCurrentWindowSize(newSize) {

    //console.log("ACTIONS: Window size set to " + newSize);

    return function (dispatch) {
        dispatch({type: SET_WINDOW_SIZE, newSize: newSize});
    };
}

export function setIntTestOutputDir(newDir) {

    return function (dispatch) {
        dispatch({type: SET_INT_TEST_OUTPUT_DIR, newDir: newDir});
    };
}

export function setDocSectionTextOption(newOption) {

    return function (dispatch) {
        dispatch({type: SET_DOC_SECTION_TEXT_OPTION, newOption: newOption});
    };
}

export function setDocFeatureTextOption(newOption) {

    return function (dispatch) {
        dispatch({type: SET_DOC_FEATURE_TEXT_OPTION, newOption: newOption});
    };
}

export function setDocNarrativeTextOption(newOption) {

    return function (dispatch) {
        dispatch({type: SET_DOC_NARRATIVE_TEXT_OPTION, newOption: newOption});
    };
}

export function setDocScenarioTextOption(newOption) {

    return function (dispatch) {
        dispatch({type: SET_DOC_SCENARIO_TEXT_OPTION, newOption: newOption});
    };
}

export function setDomainTermsOnOff(currentSetting) {

    const newSetting = !currentSetting;

    return function (dispatch) {
        dispatch({type: SET_DOMAIN_TERMS_ON_OFF, newSetting: newSetting});
    };
}

// ---------------------------------------------------------------------------------------------------------------------

// What any user is looking at or designer is working on or a developer is developing

export function setCurrentUserItemContext(contextItem, saveToDb){

    //console.log("ACTIONS: Current user context update: DE: " + contextItem.designId + " DV: " + contextItem.designVersionId + " DU: " + contextItem.designUpdateId + " WP: " + contextItem.workPackageId + " DC: " + contextItem.designComponentId);

    return function (dispatch) {


        dispatch({type: SET_CURRENT_USER_ITEM_CONTEXT, newUserItemContext: contextItem});

        // And persist the settings - only want to do this if we are changing them...
        if(saveToDb) {
            Meteor.call('userContext.setCurrentUserContext', contextItem);
        }
    };
}
// The currently selected user in User Management
export function setCurrentUserId(userId){

    return function (dispatch) {

        dispatch({type: SET_CURRENT_USER_ID, newUserId: userId});
    };
}

// The currently selected test output location
export function setCurrentUserTestOutputLocation(locationId){

    return function (dispatch) {

        dispatch({type: SET_CURRENT_USER_TEST_OUTPUT_LOCATION, newUserTestOutputLocationId: locationId});
    };
}

// The current set of Open items for the User in a Design
export function setCurrentUserOpenDesignItems(existingItems, componentId, newState){

    return function (dispatch) {

        let newItems = existingItems;

        // Only adding or subtracting if a specific component id provided.  Otherwise assume a bulk set of data in existing items
        if(componentId) {
            if (newState) {
                // Trying to set the component as OPEN so add component to list if not there
                if (!newItems.includes(componentId)) {
                    newItems.push(componentId)
                }
            } else {
                // Trying to set the component as CLOSED so remove from list if present
                const itemIndex = newItems.indexOf(componentId);

                if (itemIndex >= 0) {
                    newItems.splice(itemIndex, 1);
                }
            }
        }

        // console.log('Open DV Items');
        // newItems.forEach((item) => {
        //     console.log("    " + item)
        // });

        dispatch({type: SET_CURRENT_USER_OPEN_DESIGN_ITEMS, newUserOpenDesignItems: newItems});
    };

}

// The current set of Open items for the user in a Design Update
export function setCurrentUserOpenDesignUpdateItems(openItems, componentId, newState){

    return function (dispatch) {

        let newItems = openItems;

        //console.log("REDUX: Setting Open Update Items");

        // Only adding or subtracting if a specific component id provided.  Otherwise assume a bulk set of data in existing items
        if (componentId) {
            if (newState) {
                // Trying to set the component as OPEN so add component to list if not there
                if (!newItems.includes(componentId)) {
                    //console.log("REDUX: Adding item " + componentId);
                    newItems.push(componentId)
                }
            } else {
                // Trying to set the component as CLOSED so remove from list if present
                const itemIndex = newItems.indexOf(componentId);

                //console.log("REDUX: Removing item " + componentId);
                if (itemIndex >= 0) {
                    newItems.splice(itemIndex, 1);
                }
            }
        }

        // console.log("DU Open Items");
        // newItems.forEach((item) => {
        //     console.log("    " + item)
        // });

        dispatch({type: SET_CURRENT_USER_OPEN_DESIGN_UPDATE_ITEMS, newUserOpenDesignUpdateItems: newItems});
    }

}

// The current set of Open items for the user in a Work Package
export function setCurrentUserOpenWorkPackageItems(openItems, componentId, newState){

    return function (dispatch) {

        let newItems = openItems;

        // Only adding or subtracting if a specific component id provided.  Otherwise assume a bulk set of data in existing items
        if(componentId) {
            if (newState) {
                // Trying to set the component as OPEN so add component to list if not there
                if (!newItems.includes(componentId)) {
                    newItems.push(componentId)
                }
            } else {
                // Trying to set the component as CLOSED so remove from list if present
                const itemIndex = newItems.indexOf(componentId);

                if (itemIndex >= 0) {
                    newItems.splice(itemIndex, 1);
                }
            }
        }

        // console.log("WP Open Items");
        // newItems.forEach((item) => {
        //     console.log("    " + item)
        // });

        dispatch({type: SET_CURRENT_USER_OPEN_WORK_PACKAGE_ITEMS, newUserOpenWorkPackageItems: newItems});
    };

}

// Updates the current DU scope data
export function setUpdateScopeItems(updateScopeItems) {
    return function (dispatch) {

        dispatch({type: SET_UPDATE_SCOPE_ITEMS, newUpdateScopeItems: updateScopeItems});
    };
}

export function setUpdateScopeFlag(updateScopeFlag) {
    return function (dispatch) {

        let newFlag = updateScopeFlag + 1;
        if(newFlag > 100){
            newFlag = 0;
        }

        dispatch({type: SET_UPDATE_SCOPE_FLAG, newUpdateScopeFlag: newFlag});
    };
}

// Updates the current WP scope data
export function setWorkPackageScopeItems(wpScopeItems) {
    return function (dispatch) {

        dispatch({type: SET_WP_SCOPE_ITEMS, newWpScopeItems: wpScopeItems});
    };
}

export function setWorkPackageScopeFlag(wpScopeFlag) {
    return function (dispatch) {

        let newFlag = wpScopeFlag + 1;
        if(newFlag > 100){
            newFlag = 0;
        }

        dispatch({type: SET_WP_SCOPE_FLAG, newWpScopeFlag: newFlag});
    };
}

// Updates the current design component name if changed
export function updateDesignComponentName(designComponentName) {
    return function (dispatch) {

        dispatch({type: UPDATE_DESIGN_COMPONENT_NAME, newDesignComponentName: designComponentName});
    };
}

// Updates the current design component raw name data if changed
export function updateDesignComponentRawName(designComponentRawName) {
    return function (dispatch) {

        dispatch({type: UPDATE_DESIGN_COMPONENT_RAW_NAME, newDesignComponentRawName: designComponentRawName});
    };
}

// Updates the current design component name if changed
export function updateUserMessage(newMessage) {

    return function (dispatch) {
        dispatch({type: UPDATE_USER_MESSAGE, newUserMessage: newMessage});
    };
}

// Toggle between true and false to trigger re-renders of design when data is updated
export function updateTestDataFlag() {

    let newFlag = store.getState().testDataFlag + 1;

    if(newFlag > 100){
        newFlag = 0;
    }

    return function (dispatch) {
        dispatch({type: UPDATE_TEST_DATA_FLAG, newDataValue: newFlag});
    };
}

// Shows when design version data has been loaded
export function setDesignVersionDataLoadedTo(newValue) {

    return function (dispatch) {
        dispatch({type: UPDATE_DESIGN_VERSION_DATA_LOADED_FLAG, newDesignVersionDataLoadedValue: newValue});
    };
}

// Shows when work package data has been loaded
export function setWorkPackageDataLoadedTo(newValue) {

    return function (dispatch) {
        dispatch({type: UPDATE_WORK_PACKAGE_DATA_LOADED_FLAG, newWorkPackageDataLoadedValue: newValue});
    };
}

// Shows when test integration data has been loaded
export function setTestIntegrationDataLoadedTo(newValue) {

    return function (dispatch) {
        dispatch({type: UPDATE_TEST_INTEGRATION_DATA_LOADED_FLAG, newTestIntegrationDataLoadedValue: newValue});
    };
}

// Shows when test summary data has been calculated
export function setTestSummaryDataLoadedTo(newValue) {

    return function (dispatch) {
        dispatch({type: UPDATE_TEST_SUMMARY_DATA_LOADED_FLAG, newTestSummaryDataLoadedValue: newValue});
    };
}

// Shows when user has indicated that new test data is availale
export function setTestDataStaleTo(newValue) {

    return function (dispatch) {
        dispatch({type: UPDATE_TEST_DATA_STALE_FLAG, newTestStaleValue: newValue});
    };
}

// Shows when design has been updated so mash data is out of date
export function setMashDataStaleTo(newValue) {

    return function (dispatch) {
        dispatch({type: UPDATE_MASH_DATA_STALE_FLAG, newMashStaleValue: newValue});
    };
}

// User View Options
export function updateViewOptionsData() {

    let newValue = store.getState().currentViewOptionsDataValue + 1;
    if(newValue > 100){
        newValue = 0;
    }

    return function (dispatch) {
        dispatch({type: UPDATE_VIEW_OPTIONS_DATA, newDataValue: newValue});
    };
}

export function updateOpenItemsFlag(itemId) {

    let newFlag = store.getState().openItemsFlag.flag + 1;
    if(newFlag > 100){
        newFlag = 0;
    }

    return function (dispatch) {
        dispatch({type: UPDATE_OPEN_ITEMS_FLAG, newFlagValue: {item: itemId, flag: newFlag}});
    };
}