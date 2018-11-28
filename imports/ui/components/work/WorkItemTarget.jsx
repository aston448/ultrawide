// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import WorkItem        from './WorkItem.jsx';

// Ultrawide Services
import {ComponentType, WorkItemType, WorkPackageType, ViewMode, DisplayContext, UpdateScopeType, LogLevel} from '../../../constants/constants.js';
import {workItemMoveDropAllowed, log, replaceAll} from '../../../common/utils.js';


// Bootstrap

// REDUX services

// React DnD
import { DropTarget } from 'react-dnd';
import {WorkItemData} from "../../../data/work/work_item_db";


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Iteration Target Component - Represents the part of an Iteration that another Iteration can be
// dropped on to when moving to a new parent
//
// ---------------------------------------------------------------------------------------------------------------------


export class WorkItemTarget extends Component{

    constructor(...args){
        super(...args);
        this.state = {
            open: false
        };
    }

    componentWillReceiveProps(newProps) {
        //console.log("TARGET " + this.props.currentItem.componentType + " - " + this.props.currentItem.componentNameNew + " receiving props Update Item was " + this.props.updateItem + " and now " + newProps.updateItem);
    }

    shouldComponentUpdate(){
        return true;
    }

    render(){

        const {workItem, workItemType, displayContext, connectDropTarget, isOverCurrent, canDrop} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Iteration Target {}', workItem.wiName);

        let uiItemId = '';

        if(workItemType === WorkItemType.BASE_WORK_PACKAGE){
            uiItemId = replaceAll(workItem.workPackageName, ' ', '_');
        } else {
            uiItemId = replaceAll(workItem.wiName, ' ', '_');
        }
        let uiContextName = uiItemId;

        //console.log("Rendering design component target: " + this.props.currentItem.componentType + " - " + currentItem.componentNameNew + " canDrop: " + canDrop + " display context " + displayContext + "mode " + mode);

        if(!(Meteor.isTest) && canDrop){

            return connectDropTarget(
                <div id={'Target_' + uiContextName}>
                    <WorkItem
                        workItem={workItem}
                        workItemType={workItemType}
                        displayContext={displayContext}
                    />
                </div>
            )
        } else {
            return (
                <div id={'NoDropTarget_' + uiContextName}>
                    <WorkItem
                        workItem={workItem}
                        workItemType={workItemType}
                        displayContext={displayContext}
                    />
                </div>
            )
        }
    }
}

WorkItemTarget.propTypes = {
    workItem: PropTypes.object.isRequired,
    workItemType: PropTypes.string.isRequired,
    displayContext: PropTypes.string.isRequired
};

// React DnD ===========================================================================================================

const componentTarget = {

    canDrop(props, monitor){
        const item = monitor.getItem().workItem;

        // Prevent container items grabbing the drop...
        if(monitor.didDrop()){
            return false;
        }

        // Validate if a drop would be allowed...

        // If the target is an iteration allow WPs to drop on it
        if(props.workItem.wiType === WorkItemType.ITERATION && item.workPackageType === WorkPackageType.WP_BASE){
            return true;
        } else {

            // Get parent of moving item
            const parentWorkItem = WorkItemData.getWorkItemParent(movingWorkItem);

            return (workItemMoveDropAllowed(item, props.workItem, parentWorkItem));
        }


    },

    drop(props, monitor) {
        const item = monitor.getItem().workItem;

        // Prevent container items grabbing the drop...
        if(monitor.didDrop()){
            return;
        }

        // Return the dropped item so the update can be made....
        return {
            targetItem: props.workItem,
            dragType: 'MOVE_LOCATION'
        };

    }
};


function collect(connect, monitor){

    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({shallow: true}),
        canDrop: monitor.canDrop()
    }
}

// Before exporting, wrap this component to make it a drop target
export default WorkItemTarget = DropTarget(ComponentType.DRAGGABLE_ITEM, componentTarget, collect)(WorkItemTarget);
