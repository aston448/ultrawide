// Required for createSelectionList
import React from 'react';

import {ComponentType, UpdateMergeStatus, UpdateScopeType, WorkPackageScopeType} from '../constants/constants.js';
import {DesignVersionComponents} from '../collections/design/design_version_components.js';
import {DesignUpdateComponents} from '../collections/design_update/design_update_components.js';

import {ViewType, MessageType, DisplayContext, MashStatus, LogLevel} from '../constants/constants.js';

import store from '../redux/store'
import {updateUserMessage} from '../redux/actions'


export function padDigits(number, digits) {
    return new Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}


export function getDateTimeString(dateTime){

    return dateTime.getFullYear() + '-' +
        padDigits((dateTime.getMonth() + 1), 2) + '-' +
        padDigits(dateTime.getDate(), 2) + ' ' +
        padDigits(dateTime.getHours(), 2)  + ':' +
        padDigits(dateTime.getMinutes(), 2)
}

export function getDateTimeStringWithSeconds(dateTime){

    return dateTime.getFullYear() + '-' +
        padDigits((dateTime.getMonth() + 1), 2) + '-' +
        padDigits(dateTime.getDate(), 2) + ' ' +
        padDigits(dateTime.getHours(), 2)  + ':' +
        padDigits(dateTime.getMinutes(), 2) + ':' +
        padDigits(dateTime.getSeconds(), 2);
}

export function createSelectionList(typesArray){

    // NOTE: This implicitly requires an import of React

    let items = [];

    typesArray.forEach((item) => {
        items.push(<option key={item} value={item}>{item}</option>);
    });

    return items;
}

export function getComponentClass(currentItem, updateItem, wpItem, view, context, isNarrative){

    let main = '';
    let modifier = '';
    let deleted = '';

    if(currentItem){
        // Get the main class based on the component type - same for all views
        switch (currentItem.componentType) {
            case ComponentType.APPLICATION:
                main = 'application';
                break;
            case ComponentType.DESIGN_SECTION:
                switch (currentItem.componentLevel){
                    case 1:
                        main = 'section1';
                        break;
                    case 2:
                        main = 'section2';
                        break;
                    case 3:
                        main = 'section3';
                        break;
                    default:
                        main =  'section4';
                }
                break;
            case ComponentType.FEATURE:
                if(isNarrative){
                    main = 'narrative'
                } else {
                    main = 'feature';
                }
                break;
            case ComponentType.FEATURE_ASPECT:
                main = 'feature-aspect';
                break;
            case ComponentType.SCENARIO:
                main = 'scenario';
                break;
            default:
                return '';
        }

        // Get modifiers
        switch(view){
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
                break;
            case ViewType.DESIGN_UPDATABLE:
                // If a removal has been updated in to the main version show it here
                if(currentItem.updateMergeStatus === UpdateMergeStatus.COMPONENT_REMOVED){
                    deleted = ' removed-item';
                }
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
                switch(context){
                    case DisplayContext.UPDATE_SCOPE:
                        // Scope pane items are greyed out until scoped
                        if(!updateItem){
                            modifier = ' greyed-out';

                            // If a removal has been updated in to the main version show it here
                            if(currentItem.updateMergeStatus === UpdateMergeStatus.COMPONENT_REMOVED){
                                deleted = ' removed-item';
                            }
                        } else {
                            if(updateItem.scopeType !== UpdateScopeType.SCOPE_IN_SCOPE){
                                modifier = ' greyed-out';
                            }
                            if(updateItem.isRemoved){
                                deleted = ' removed-item';
                            }
                        }
                        break;
                    case DisplayContext.UPDATE_EDIT:
                    case DisplayContext.UPDATE_VIEW:
                        if(updateItem) {
                            // For design updates, out of scope things in the update are greyed out
                            if (updateItem.scopeType !== UpdateScopeType.SCOPE_IN_SCOPE) {
                                if(updateItem.scopeType === UpdateScopeType.SCOPE_PEER_SCOPE){
                                    modifier = ' ghosted';
                                } else {
                                    modifier = ' greyed-out';
                                }
                            }
                            // And removed stuff is struck through
                            if (updateItem.isRemoved || updateItem.isRemovedElsewhere) {
                                deleted = ' removed-item';
                            }
                        }
                        break;
                }

                break;
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
                // For work package stuff is greyed out unless active
                if(wpItem){
                    if(wpItem.scopeType !== WorkPackageScopeType.SCOPE_ACTIVE){
                        modifier = ' greyed-out';
                    }
                } else {
                    modifier = ' greyed-out';
                }
                break;
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                // For work package stuff is greyed out unless active
                if(wpItem){
                    if(wpItem.scopeType !== WorkPackageScopeType.SCOPE_ACTIVE){
                        modifier = ' greyed-out';
                    }
                    if(updateItem){
                        if(updateItem.isRemoved){
                            deleted = ' removed-item';
                        }
                    }
                } else {
                    modifier = ' greyed-out';
                    if(updateItem){
                        if(updateItem.isRemoved){
                            deleted = ' removed-item';
                        }
                    }
                }

                break;

            case ViewType.DEVELOP_BASE_WP:
                if(wpItem){
                    if(wpItem.scopeType !== WorkPackageScopeType.SCOPE_ACTIVE){
                        modifier = ' greyed-out';
                    }
                }
                break;

            case ViewType.DEVELOP_UPDATE_WP:
                if(updateItem){
                    if(updateItem.scopeType !== UpdateScopeType.SCOPE_IN_SCOPE){
                        modifier = ' greyed-out';
                    }
                    if(updateItem.isRemoved){
                        deleted = ' removed-item';
                    }
                }
                break;
        }

        // Final format class:
        let format =  main + modifier + deleted;
        //console.log("Format for " + currentItem.componentNameNew + " in context " + context + " is " + format);
        return format;

    } else {
        return '';
    }
}

// export function validateDesignComponentName(component,  newName){
//
//     // A design component with the same name as another component is not allowed.  This is because it describes a specific bit of functionality
//     // and the same description implies ambiguity.  Also the name will act as a key to tests.
//
//     // However the rule does not apply to Design Sections and Feature Aspects which may well want to have the same titles
//     if(component.componentType === ComponentType.DESIGN_SECTION || component.componentType === ComponentType.FEATURE_ASPECT){
//         return true;
//     }
//
//     // Problem if any components of the same name in this design version (apart from the current one)
//     let existingComponents = DesignVersionComponents.find({_id:{$ne: component._id}, designVersionId: component.designVersionId, componentName: newName});
//
//     let message = '';
//
//     if (existingComponents.count() > 0){
//         console.log("Error: " + newName + " already exists");
//
//         message = {messageType: MessageType.WARNING, messageText: 'Design component names must be unique in this design version'};
//
//         // Post message to global state so it wil appear in header
//         store.dispatch(updateUserMessage(message));
//         return false;
//     }
//
//     message = {messageType: MessageType.SUCCESS, messageText: 'Name saved successfully'};
//
//     // Post message to global state so it wil appear in header
//     store.dispatch(updateUserMessage(message));
//     return true;
// }

export function validateDesignUpdateComponentName(component, newName){

    // A design component with the same name as another component is not allowed.  This is because it describes a specific bit of functionality
    // and the same description implies ambiguity.  Also the name will act as a key to tests.

    // However the rule does not apply to Design Sections and Feature Aspects which may well want to have the same titles
    if(component.componentType === ComponentType.DESIGN_SECTION || component.componentType === ComponentType.FEATURE_ASPECT){
        return true;
    }

    let message = '';

    // Problem if same name is used in the update...
    let existingComponents = DesignUpdateComponents.find({
        _id:{$ne: component._id},
        designVersionId: component.designVersionId,
        designUpdateId: component.designUpdateId,
        componentNewName: newName                   // Need to check the new name for each component - for unchanged items will be same as old name
    });

    if (existingComponents.count() > 0){
        //console.log("Error: " + newName + " already exists");

        message = {messageType: MessageType.WARNING, messageText: 'Design component names must be unique in this design update'};
        store.dispatch(updateUserMessage(message));
        return false;
    }

    // Problem if the same name is used for a *different* component in parallel updates
    // If its the same item in two updates it will have the same reference id...
    let referenceId = DesignUpdateComponents.findOne({_id:component._id}).componentReferenceId;
    let existingParallelComponents = DesignUpdateComponents.find({
        _id:{$ne: component._id},
        componentReferenceId:{$ne: referenceId},
        designVersionId: component.designVersionId,
        componentNewName: newName});

    if (existingParallelComponents.count() > 0){
        //console.log("Error: " + newName + " already exists in a parallel design update for a different item");

        message = {messageType: MessageType.WARNING, messageText: 'This component name already exists for a different component in another update to this design version'};
        store.dispatch(updateUserMessage(message));
        return false;
    }

    message = {messageType: MessageType.SUCCESS, messageText: 'Name saved successfully'};
    store.dispatch(updateUserMessage(message));
    return true;

}

export function locationMoveDropAllowed(itemType, targetType, viewType, inScope){
    // Is drop allowed for this item when moving a component to a new location?
    switch(itemType){
        case ComponentType.DESIGN_SECTION:
            // Design Sections can only be moved to other design sections or applications
            return (targetType === ComponentType.DESIGN_SECTION || targetType === ComponentType.APPLICATION);
            break;
        case ComponentType.FEATURE:
            // Features can only be moved to other design sections
            return (targetType === ComponentType.DESIGN_SECTION);
            break;
        case ComponentType.FEATURE_ASPECT:
            // Feature Aspects cannot be moved
            return false;
            break;
        case ComponentType.SCENARIO:
            // Scenarios can only be moved to Feature Aspects
            switch(viewType){
                case ViewType.DESIGN_NEW:
                    return (targetType === ComponentType.FEATURE_ASPECT);
                    break;
                case ViewType.DESIGN_UPDATE_EDIT:
                    // Target must be an in scope Feature Aspect
                    return (inScope && targetType === ComponentType.FEATURE_ASPECT);
                    break;
            }
            break;
        default:
            return false;
    }
}

export function reorderDropAllowed(item, target) {

    // A list reordering drop is allowed if moving to a target that is of the same component type and has the same parent
    switch (item.componentType) {
        case ComponentType.SCENARIO_STEP:
            // Make sure we are not dragging to some other random component
            log((msg) => console.log(msg), LogLevel.TRACE, "Drop allowed for Scenario Step.  Item ref: {} Target ref: {}", item.scenarioReferenceId, target.scenarioReferenceId);

            if (target.componentType !== ComponentType.SCENARIO_STEP) {
                log((msg) => console.log(msg), LogLevel.TRACE, "Target not a scenario step!");
                return false;
            }

            // Can move steps within the same scenario
            return ((item.scenarioReferenceId === target.scenarioReferenceId) && (target._id !== item._id));
            break;

        default:
            // All other component types have the same structure
            log((msg) => console.log(msg), LogLevel.TRACE, "Target type: {}  Moving type: {} Target parent: {} Moving parent: {}",
                target.componentType,
                item.componentType,
                item.componentParentReferenceIdNew,
                target.componentParentReferenceIdNew
            );
            return (
                (item.componentType === target.componentType) &&
                (item.designVersionId === target.designVersionId) &&
                (item.componentParentReferenceIdNew === target.componentParentReferenceIdNew) &&
                (item._id !== target._id)
            );
    }
}

export function mashMoveDropAllowed(displayContext){
    // Here we are dragging steps out of the Design or Dev lists to add to the final configuration.
    // It is possible that the target item is NULL if no steps exist already
    log((msg) => console.log(msg), LogLevel.TRACE, "Mash move allowed for Scenario Step.  Target context {}", displayContext);

    // Can only drop on the Linked Steps container drop items
    return (displayContext === DisplayContext.EDIT_STEP_LINKED)

}

// Used to map the new DB Ids created on an import of data to the old ids in the export data
export function getIdFromMap(map, oldId) {
    let newId = 'NONE';

    map.forEach((mapItem) => {
        //console.log("MAP: old: " + mapItem.oldId + " New: " + mapItem.newId);
        if (mapItem.oldId === oldId) {
            log((msg) => console.log(msg), LogLevel.TRACE, "MAP: old: {} new {}", mapItem.oldId, mapItem.newId);
            newId = mapItem.newId;
        }
    });

    return newId;
}

export function isAlphaNumeric(str) {
    let code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
            return false;
        }
    }
    return true;
}

export function log(callback, level, message, ...vars){

    // Change these to change the output
    // const logLevel = LogLevel.TRACE;
    // const logLevel = LogLevel.DEBUG;
    const logLevel = LogLevel.INFO;
    // const logLevel = LogLevel.NONE;


    let log = false;

    // What level is the incoming message?
    switch(level){
        case LogLevel.TRACE:
            // Only log when on TRACE
            log = logLevel === LogLevel.TRACE;
            break;
        case LogLevel.DEBUG:
            // Log if DEBUG or TRACE
            log = (logLevel === LogLevel.DEBUG || logLevel === LogLevel.TRACE);
            break;
        case LogLevel.INFO:
        case LogLevel.WARNING:
        case LogLevel.ERROR:
            // Log if not NONE
            log = logLevel !== LogLevel.NONE;
            break;
    }

    if(log) {
        let finalMessage = message;

        vars.forEach((item) => {
            finalMessage = finalMessage.replace('{}', item);
        });

        let date = new Date();

        // Callback so the actual line number of the calling code is logged
        callback(level + ' ' + padDigits(date.getMinutes(), 2) + ':' + padDigits(date.getSeconds(), 2) +'.' + padDigits(date.getMilliseconds(), 3) + ' ' + finalMessage);
    }

}
