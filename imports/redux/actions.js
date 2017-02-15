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

// Passes on updates to displayed text for a component
export const UPDATE_DESIGN_COMPONENT_NAME = 'UPDATE_DESIGN_COMPONENT_NAME';
export const UPDATE_DESIGN_COMPONENT_RAW_NAME = 'UPDATE_DESIGN_COMPONENT_RAW_NAME';

// This flag is toggled each time an update to test / design progress data is requested
// Include it as a property in any components that should redraw
export const UPDATE_PROGRESS_DATA = 'UPDATE_PROGRESS_DATA';

// Flag to trigger redraw on update of view options
export const UPDATE_VIEW_OPTIONS_DATA = 'UPDATE_VIEW_OPTIONS_DATA';


// Messaging system
export const UPDATE_USER_MESSAGE = 'UPDATE_USER_MESSAGE';

// Sets the current user role - one user can change roles if allowed to
export function setCurrentRole(role) {
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
            case ViewType.HOME:
                message = 'Choose an action for your desired Role...';
                break;
            case ViewType.CONFIGURE:
                message = 'User Settings';
                break;
            case ViewType.TEST_OUTPUTS:
                message = 'Test Output Locations';
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
            case ViewType.DESIGN_NEW_EDIT:
                message = 'Editing Initial Design Version';
                break;
            case ViewType.DESIGN_PUBLISHED_VIEW:
                message = 'View Design Version';
                break;
            case ViewType.DESIGN_UPDATABLE_VIEW:
                message = 'View Design Version Progress';
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
                message = 'Editing Design Update';
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
export function changeApplicationMode(newMode) {
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

export function setCurrentUserViewOptions(viewOptions, saveToDb){

     return function (dispatch) {

        dispatch({type: SET_CURRENT_USER_VIEW_OPTIONS, newUserViewOptions: viewOptions});

        // And persist the settings - only want to do this if we are changing them...
        if(saveToDb) {
            Meteor.call('userContext.setCurrentUserViewOptions', viewOptions);
        }
    };
}

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

// The currently selected test output location
export function setCurrentUserTestOutputLocation(locationId){

    return function (dispatch) {

        dispatch({type: SET_CURRENT_USER_TEST_OUTPUT_LOCATION, newUserTestOutputLocationId: locationId});
    };
}

// The current set of Open items for the User in a Design
export function setCurrentUserOpenDesignItems(userId, existingItems, componentId, newState, saveToDb){

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
                if (newItems.includes(componentId)) {
                    newItems.pop(componentId);
                }
            }
        }

        dispatch({type: SET_CURRENT_USER_OPEN_DESIGN_ITEMS, newUserOpenDesignItems: newItems});

        // TODO Could persist this state to DB for each user if we want
    };

}

// The current set of Open items for the user in a Design Update
export function setCurrentUserOpenDesignUpdateItems(userId, existingItems, componentId, newState, saveToDb){

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
                if (newItems.includes(componentId)) {
                    newItems.pop(componentId);
                }
            }
        }

        dispatch({type: SET_CURRENT_USER_OPEN_DESIGN_UPDATE_ITEMS, newUserOpenDesignUpdateItems: newItems});

        // TODO Could persist this state to DB for each user if we want
    };

}

// The current set of Open items for the user in a Work Package
export function setCurrentUserOpenWorkPackageItems(userId, existingItems, componentId, newState, saveToDb){

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
                if (newItems.includes(componentId)) {
                    newItems.pop(componentId);
                }
            }
        }

        dispatch({type: SET_CURRENT_USER_OPEN_WORK_PACKAGE_ITEMS, newUserOpenWorkPackageItems: newItems});

        // TODO Could persist this state to DB for each user if we want
    };

}

// // Current Development Environment Context
// export function setCurrentUserDevContext(devContext, saveToDb) {
//     // Note that designUpdateIdsis an array
//     console.log("ACTIONS: Current user dev context update");
//
//     return function (dispatch) {
//
//         let newDevContext = {
//             designId:               designId,
//             designVersionId:        designVersionId,
//             designUpdateId:         designUpdateId,
//             workPackageId:          workPackageId,
//             featureFilesLocation:   featureFilesLocation,
//         };
//
//         dispatch({type: SET_CURRENT_USER_DEV_CONTEXT, newUserDevContext: devContext});
//
//         // And persist the settings - only want to do this if we are changing them...
//         //TODO proper user id
//         if(saveToDb) {
//             Meteor.call('userContext.setCurrentUserDevContext', userId, designId, designVersionId, workPackageId, featureFilesLocation);
//         }
//     };
// }


// Updates the current design component name if changed
export function updateDesignComponentName(designComponentName) {
    return function (dispatch) {
        //console.log("ACTIONS: New component name: " + designComponentName);
        dispatch({type: UPDATE_DESIGN_COMPONENT_NAME, newDesignComponentName: designComponentName});
    };
}

// Updates the current design component raw name data if changed
export function updateDesignComponentRawName(designComponentRawName) {
    return function (dispatch) {
        //console.log("ACTIONS: New component raw name: " + designComponentRawName);
        dispatch({type: UPDATE_DESIGN_COMPONENT_RAW_NAME, newDesignComponentRawName: designComponentRawName});
    };
}

// Updates the current design component name if changed
export function updateUserMessage(newMessage) {
    //console.log("ACTIONS: New message: " + newMessage);
    return function (dispatch) {
        dispatch({type: UPDATE_USER_MESSAGE, newUserMessage: newMessage});
    };
}

// Toggle between true and false to trigger re-renders of design when data is updated
export function updateProgressData(newValue) {
    //console.log("ACTIONS: Progress data update: " + newValue);
    return function (dispatch) {
        dispatch({type: UPDATE_PROGRESS_DATA, newDataValue: newValue});
    };
}

// Toggle between true and false to trigger re-renders of design when data is updated
export function updateViewOptionsData(newValue) {
    //console.log("ACTIONS: View options data update: " + newValue);
    return function (dispatch) {
        dispatch({type: UPDATE_VIEW_OPTIONS_DATA, newDataValue: newValue});
    };
}