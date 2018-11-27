// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {ComponentType, ViewMode, DisplayContext, LogLevel} from '../../../constants/constants.js';
import {reorderWorkItemDropAllowed, log} from '../../../common/utils.js';

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


class WorkItemMoveTarget extends Component{

    constructor(...args){
        super(...args);
    }

    render(){

        const {workItem, connectDropTarget, isOver, isOverCurrent, canDrop} = this.props;

        // When over a droppable area render it as a gap
        let moveTarget = 'move-target';

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Iteration Move Target {}', workItem.iterationName);

        if(canDrop && isOverCurrent){
            moveTarget = 'move-target-active'
        }

        if(true) {
            // TODO Only can be droppable if...
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

WorkItemMoveTarget.propTypes = {
    workItem: PropTypes.object,
};

// React DnD ===========================================================================================================

const componentTarget = {

    canDrop(props, monitor){
        const item = monitor.getItem().workItem;
//        const itemContext = monitor.getItem().displayContext;
        const target = props.workItem;

        if(!target){
            return false;
        }

        // log((msg) => console.log(msg), LogLevel.TRACE, "MOVE TARGET CAN DROP? Item: {}, MashItem: {},  Context: {}, Target: {}, MashTarget: {}",
        //     item.componentType, item.mashComponentType, itemContext, target.componentType, target.mashComponentType);



        // Prevent container items grabbing the drop...
        if(monitor.didDrop()){
            return false;
        }

        // Cannot drop on oneself
        if(props.workItem) {
            if (item._id === target._id) {
                log((msg) => console.log(msg), LogLevel.TRACE, "Can't drop on self");
                return false;
            }
        }

        // Validate that drop target is in the same list as moving item
        let reorderAllowed = reorderWorkItemDropAllowed(item, target);
        log((msg) => console.log(msg), LogLevel.TRACE, "Reorder Drop: {}", reorderAllowed);
        return reorderAllowed;

    },

    drop(props, monitor) {
        const item = monitor.getItem();

        // Prevent container items grabbing the drop...
        if(monitor.didDrop()){
            return;
        }

        //log((msg) => console.log(msg), LogLevel.TRACE, "DROP on item {}", props.currentItem ? props.currentItem.componentType: 'Empty Space');

        return {
            targetItem: props.workItem,
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
export default WorkItemMoveTarget = DropTarget(ComponentType.DRAGGABLE_ITEM, componentTarget, collect)(WorkItemMoveTarget);

// =====================================================================================================================