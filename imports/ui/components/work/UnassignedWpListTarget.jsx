// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import UnassignedWpListContainer            from '../../containers/work/UnassignedWpListContainer.jsx';

// Ultrawide Services
import {ComponentType, WorkItemType, WorkPackageType, ViewMode, DisplayContext, UpdateScopeType, LogLevel} from '../../../constants/constants.js';
import {workPackageUnassignedDropAllowed, log, replaceAll} from '../../../common/utils.js';


// Bootstrap

// REDUX services

// React DnD
import { DropTarget } from 'react-dnd';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Target to allow WPs in iterations to be dropped back onto the Unassigned List
// dropped on to when moving to a new parent
//
// ---------------------------------------------------------------------------------------------------------------------


export class UnassignedWpListTarget extends Component{

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

        const {userContext, connectDropTarget, isOverCurrent, canDrop} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Unassigned WP List Target');


        if(!(Meteor.isTest) && canDrop){
            return (
                connectDropTarget(
                    <div>
                        <UnassignedWpListContainer params={{
                            userContext: userContext,
                            displayContext: DisplayContext.WORK_ITEM_EDIT
                        }}/>
                    </div>
                )
            );
        } else {
            return (
                <div>
                    <UnassignedWpListContainer params={{
                        userContext: userContext,
                        displayContext: DisplayContext.WORK_ITEM_EDIT
                    }}/>
                </div>
            );
        }
    }
}

UnassignedWpListTarget.propTypes = {
    userContext: PropTypes.object.isRequired,

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

        // Allow a drop if item is a WP
        return (workPackageUnassignedDropAllowed(item));

    },

    drop(props, monitor) {
        const item = monitor.getItem().workItem;

        // Prevent container items grabbing the drop...
        if(monitor.didDrop()){
            return;
        }

        // Return the dropped item so the update can be made....
        return {
            movingItem: item,
            dragType: 'MOVE_WP_UNASSIGNED'
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
export default UnassignedWpListTarget = DropTarget(ComponentType.DRAGGABLE_ITEM, componentTarget, collect)(UnassignedWpListTarget);
