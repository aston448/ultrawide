// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {ComponentType, ViewMode, DisplayContext, LogLevel} from '../../../constants/constants.js';
import {reorderDropAllowed, mashMoveDropAllowed, log} from '../../../common/utils.js';

// Bootstrap

// REDUX services

// React DnD
import { DropTarget } from 'react-dnd';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Move Target Component - Represents a space in a list of design components to which another component in that list can be dragged
//
// ---------------------------------------------------------------------------------------------------------------------


class MoveTarget extends Component{

    constructor(...args){
        super(...args);
    }

    render(){

        const {currentItem, displayContext, mode, connectDropTarget, isOver, isOverCurrent, canDrop} = this.props;

        // When over a droppable area render it as a gap
        let moveTarget = 'move-target';

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Move Target {}', currentItem.componentNameNew);

        if(canDrop && isOverCurrent){
            moveTarget = 'move-target-active'
        }

        if((displayContext === DisplayContext.UPDATE_EDIT || displayContext === DisplayContext.BASE_EDIT || displayContext === DisplayContext.EDIT_STEP_LINKED) && mode === ViewMode.MODE_EDIT) {
            // Only can be droppable if in Edit mode and if the edit section of the view
            return connectDropTarget(
                <div className={moveTarget}></div>
            )
        } else {
            return (
                <div className={moveTarget}></div>
            )
        }
    }
}

MoveTarget.propTypes = {
    currentItem: PropTypes.object,
    displayContext: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired
};

// React DnD ===========================================================================================================

const componentTarget = {

    canDrop(props, monitor){
        const item = monitor.getItem().component;
        const itemContext = monitor.getItem().displayContext;
        const target = props.currentItem;

        if(!target){
            return false;
        }

        log((msg) => console.log(msg), LogLevel.TRACE, "MOVE TARGET CAN DROP? Item: {}, MashItem: {},  Context: {}, Target: {}, MashTarget: {}",
            item.componentType, item.mashComponentType, itemContext, target.componentType, target.mashComponentType);



        // Prevent container items grabbing the drop...
        if(monitor.didDrop()){
            return false;
        }

        switch(itemContext){
            case DisplayContext.EDIT_STEP_DEV:
            case DisplayContext.EDIT_STEP_DESIGN:
                // This is a scenario step being moved into the FINAL steps container from Dev or Design
                let mashMoveAllowed =  mashMoveDropAllowed(props.displayContext);
                log((msg) => console.log(msg), LogLevel.TRACE, "Mash Move Drop: {}", mashMoveAllowed);
                return mashMoveAllowed;
                break;

            default:
                // Anything else is a component being reordered...
                // Cannot drop on oneself
                if(props.currentItem) {
                    if (item._id === target._id) {
                        log((msg) => console.log(msg), LogLevel.TRACE, "Can't drop on self");
                        return false;
                    }
                }

                // Validate that drop target is of the same type as moving item and in the same list
                let reorderAllowed = reorderDropAllowed(item, target);
                log((msg) => console.log(msg), LogLevel.TRACE, "Reorder Drop: {}", reorderAllowed);
                return reorderAllowed;
        }
    },

    drop(props, monitor) {
        const item = monitor.getItem();

        // Prevent container items grabbing the drop...
        if(monitor.didDrop()){
            return;
        }

        log((msg) => console.log(msg), LogLevel.TRACE, "DROP on item {}", props.currentItem ? props.currentItem.componentType: 'Empty Space');

        return {
            targetItem: props.currentItem,
            displayContext: props.displayContext,
            dragType: 'MOVE_REORDER'
        };

    }
};


function collect(connect, monitor){

    //log((msg) => console.log(msg), LogLevel.TRACE, "MOVE TARGET COLLECT: Can Drop: {}, Over Current: {}", monitor.canDrop(), monitor.isOver({shallow: true}));

    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({shallow: true}),
        canDrop: monitor.canDrop()
    }
}

// Before exporting, wrap this component to make it a drop target
MoveTarget = DropTarget(ComponentType.DRAGGABLE_ITEM, componentTarget, collect)(MoveTarget);

// =====================================================================================================================

export default MoveTarget;