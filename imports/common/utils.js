/**
 * Created by aston on 08/09/2016.
 */

import {ComponentType} from '../constants/constants.js';
import {DesignComponents} from '../collections/design/design_components.js';
import {DesignUpdateComponents} from '../collections/design_update/design_update_components.js';

import {ViewType, MessageType, DisplayContext, MashStatus, LogLevel} from '../constants/constants.js';

import store from '../redux/store'
import {updateUserMessage} from '../redux/actions'


export function getComponentClass(currentItem, view, context, isNarrative){

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
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
                // For design updates, out of scope things in the update are greyed out
                if(!currentItem.isInScope && context != DisplayContext.BASE_VIEW){
                    modifier = ' greyed-out';
                }
                if(currentItem.isRemoved){
                    deleted = ' removed-item';
                }
                break;
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                console.log("Get Style with WP Active scope " + currentItem.componentActive)
                // For work package stuff is greyed out unless active
                if(!currentItem.componentActive){
                    modifier = ' greyed-out';
                }
                break;
        }



        // Final format class:
        let format =  main + modifier + deleted;
        //console.log("Format for " + currentItem.componentName + " in context " + context + " is " + format);
        return format;

    } else {
        return '';
    }
}

export function validateDesignComponentName(component,  newName){

    // A design component with the same name as another component is not allowed.  This is because it describes a specific bit of functionality
    // and the same description implies ambiguity.  Also the name will act as a key to tests.

    // However the rule does not apply to Design Sections and Feature Aspects which may well want to have the same titles
    if(component.componentType === ComponentType.DESIGN_SECTION || component.componentType === ComponentType.FEATURE_ASPECT){
        return true;
    }

    // Problem if any components of the same name in this design version (apart from the current one)
    let existingComponents = DesignComponents.find({_id:{$ne: component._id}, designVersionId: component.designVersionId, componentName: newName});

    let message = '';

    if (existingComponents.count() > 0){
        console.log("Error: " + newName + " already exists");

        message = {messageType: MessageType.WARNING, messageText: 'Design component names must be unique in this design version'};

        // Post message to global state so it wil appear in header
        store.dispatch(updateUserMessage(message));
        return false;
    }

    message = {messageType: MessageType.SUCCESS, messageText: 'Name saved successfully'};

    // Post message to global state so it wil appear in header
    store.dispatch(updateUserMessage(message));
    return true;
}

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
        console.log("Error: " + newName + " already exists");

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
        console.log("Error: " + newName + " already exists in a parallel design update for a different item");

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
            // Design Sections can only be moved to other design sections
            return (targetType === ComponentType.DESIGN_SECTION);
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
            // Scenarios can be moved to Features or Feature Aspects
            switch(viewType){
                case ViewType.DESIGN_NEW_EDIT:
                    return (targetType === ComponentType.FEATURE || targetType === ComponentType.FEATURE_ASPECT);
                    break;
                case ViewType.DESIGN_UPDATE_EDIT:
                    // Target must be an in scope Feature / Feature Aspect
                    return (inScope && (targetType === ComponentType.FEATURE || targetType === ComponentType.FEATURE_ASPECT));
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

            if (target.componentType != ComponentType.SCENARIO_STEP) {
                log((msg) => console.log(msg), LogLevel.TRACE, "Target not a scenario step!");
                return false;
            }

            // Can move steps within the same scenario
            return ((item.scenarioReferenceId === target.scenarioReferenceId) && (target._id != item._id));
            break;

        default:
            // All other component types have the same structure
            log((msg) => console.log(msg), LogLevel.TRACE, "Target type: {}  Moving type: {} Target parent: {} Moving parent: {}",
                target.componentType,
                item.componentType,
                item.componentParentId,
                target.componentParentId
            );
            return (
                (item.componentType === target.componentType) &&
                (item.componentParentId === target.componentParentId) &&
                (item._id != target._id)
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
            console.log("MAP: old: " + mapItem.oldId + " New: " + mapItem.newId);
            newId = mapItem.newId;
        }
    });

    return newId;
}

export function log(callback, level, message, ...vars){

    // Change these to change the output
     const logLevel = LogLevel.TRACE;
    // const logLevel = LogLevel.DEBUG;
    // const logLevel = LogLevel.INFO;
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
            // Log if not NONE
            log = logLevel != LogLevel.NONE;
            break;
    }

    if(log) {
        let finalMessage = message;

        vars.forEach((item) => {
            finalMessage = finalMessage.replace('{}', item);
        });

        // Callback so the actual line number of the calling code is logged
        callback(level + finalMessage);
    }

}
