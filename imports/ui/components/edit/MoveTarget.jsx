// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';

// Ultrawide Collections


// Ultrawide GUI Components


// Ultrawide Services
import {ComponentType, ViewMode, DisplayContext, LogLevel} from '../../../constants/constants.js';
import {reorderDropAllowed, log} from '../../../common/utils.js';

// Bootstrap


// REDUX services
import {connect} from 'react-redux';

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

        const {currentItem, displayContext, mode, connectDropTarget, isOverCurrent, canDrop} = this.props;

        // When over a droppable area render it as a gap
        let moveTarget = 'move-target';
        if(canDrop && isOverCurrent){
            moveTarget = 'move-target-active'
        }

        if((displayContext === DisplayContext.UPDATE_EDIT || displayContext === DisplayContext.BASE_EDIT) && mode === ViewMode.MODE_EDIT) {
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
    currentItem: PropTypes.object.isRequired,
    displayContext: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired
};

// React DnD ===========================================================================================================

const componentTarget = {

    canDrop(props, monitor){
        const item = monitor.getItem();

        log((msg) => console.log(msg), LogLevel.TRACE, "Move Target Can Drop: Moving id is {}, target id is {}", item.component._id, props.currentItem._id);

        // Prevent container items grabbing the drop...
        if(monitor.didDrop()){
            return false;
        }

        // Cannot drop on oneself
        if(item.component._id === props.currentItem._id){
            return false;
        }

        // Validate that drop target is of the same type as moving item and in the same list
        return (reorderDropAllowed(item.component, props.currentItem));

    },

    drop(props, monitor) {
        const item = monitor.getItem();

        // Prevent container items grabbing the drop...
        if(monitor.didDrop()){
            return;
        }

        console.log("DROP! " + item.component.componentType + " on " + props.currentItem.componentType);

        return {
            targetItem: props.currentItem,
            dragType: 'MOVE_REORDER'
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
MoveTarget = DropTarget(ComponentType.DRAGGABLE_ITEM, componentTarget, collect)(MoveTarget);

// =====================================================================================================================


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        mode: state.currentViewMode
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
MoveTarget = connect(mapStateToProps)(MoveTarget);

export default MoveTarget;