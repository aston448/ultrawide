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

        switch(workItemType){
            case WorkItemType.BASE_WORK_PACKAGE:
            case WorkItemType.UPDATE_WORK_PACKAGE:

                uiItemId = replaceAll(workItem.workPackageName, ' ', '_');
                break;

            case WorkItemType.DESIGN_UPDATE:

                if(displayContext === DisplayContext.WORK_ITEM_DU_LIST){
                    uiItemId = replaceAll(workItem.updateName, ' ', '_');
                } else {
                    uiItemId = replaceAll(workItem.wiName, ' ', '_');
                }

                break;

            default:

                uiItemId = replaceAll(workItem.wiName, ' ', '_');
        }

        let uiContextName = uiItemId;

        let targetClass = 'work-item-target';

        if(canDrop && isOverCurrent){
            targetClass = 'work-item-target-droppable';
        }

        //console.log("Rendering design component target: " + this.props.currentItem.componentType + " - " + currentItem.componentNameNew + " canDrop: " + canDrop + " display context " + displayContext + "mode " + mode);

        if(!(Meteor.isTest) && canDrop){

            return connectDropTarget(
                <div id={'Target_' + uiContextName} className={targetClass}>
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
        const movingItem = monitor.getItem().workItem;
        const targetItem = props.workItem;
        const targetType = props.workItemType;
        let movingType = '';

        if(movingItem.workPackageType){
            movingType = movingItem.workPackageType;
        } else {
            movingType = movingItem.wiType
        }

        // Prevent container items grabbing the drop...
        if(monitor.didDrop()){
            return false;
        }

        let parentWorkItem = null;


        // Validate if a drop would be allowed...
        switch(movingType){

            case WorkPackageType.WP_BASE:
            case WorkPackageType.WP_UPDATE:
            case WorkItemType.DESIGN_UPDATE:

                // Can only drop WPs and DUs on iterations
                return (targetType === WorkItemType.ITERATION);

            default:

                // Get parent of moving item
                parentWorkItem = WorkItemData.getWorkItemParent(movingItem);
                //console.log('Attempting drop for Mv: %o, Tg: %o, Pa: %o', movingItem, targetItem, parentWorkItem);
                return (workItemMoveDropAllowed(movingItem, targetItem, parentWorkItem));

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
