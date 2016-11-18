// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';

// Ultrawide Collections


// Ultrawide GUI Components
import DesignComponent from './DesignComponent.jsx';

// Ultrawide Services
import {ComponentType, ViewMode, ViewType, DisplayContext} from '../../../constants/constants.js';
import {locationMoveDropAllowed} from '../../../common/utils.js';

// Bootstrap


// REDUX services
import {connect} from 'react-redux';

// React DnD
import { DropTarget } from 'react-dnd';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Component Target Component - Represents the part of a design component that another design component can be
// dropped on to when moving a component to a new parent
//
// ---------------------------------------------------------------------------------------------------------------------


class DesignComponentTarget extends Component{

    constructor(...args){
        super(...args);
        this.state = {
            open: false
        };
    }

    render(){

        const {currentItem, designItem, displayContext, connectDropTarget, isOverCurrent, canDrop} = this.props;

        //console.log("Rendering design component target: " + currentItem.componentName);

        if(canDrop && (this.props.displayContext === DisplayContext.UPDATE_EDIT || this.props.displayContext === DisplayContext.BASE_EDIT) && this.props.mode === ViewMode.MODE_EDIT) {
            // Only can be droppable if in Edit mode and if the edit section of the view
            return connectDropTarget(
                <div>
                    <DesignComponent
                        currentItem={currentItem}
                        designItem={designItem}
                        isDragDropHovering={isOverCurrent && canDrop}
                        displayContext={displayContext}
                    />
                </div>
            )
        } else {
            return (
                <div>
                    <DesignComponent
                        currentItem={currentItem}
                        designItem={designItem}
                        isDragDropHovering={false}
                        displayContext={displayContext}
                    />
                </div>
            )
        }
    }
}

DesignComponentTarget.propTypes = {
    currentItem: PropTypes.object.isRequired,
    designItem: PropTypes.object.isRequired,
    displayContext: PropTypes.string.isRequired,
    view: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired
};

// React DnD ===========================================================================================================

const componentTarget = {

    canDrop(props, monitor){
        const item = monitor.getItem();

        // Prevent container items grabbing the drop...
        if(monitor.didDrop()){
            return false;
        }

        // Cannot drop on oneself
        if(item.component._id === props.currentItem._id){
            return false;
        }

        // Only updates have an in Scope property - for design edits assume all is in scope
        let inScope = true;
        if(props.view === ViewType.DESIGN_UPDATE_EDIT){
            inScope = props.currentItem.isInScope;
        }

        // Validate if a drop would be allowed...
        return (locationMoveDropAllowed(item.component.componentType, props.currentItem.componentType, props.view, inScope));

    },

    drop(props, monitor) {
        const item = monitor.getItem();

        // Prevent container items grabbing the drop...
        if(monitor.didDrop()){
            return;
        }

        //console.log("DROP! " + item.component.componentType + " on " + props.currentItem.componentType);

        // Return the dropped item so the update can be made....
        return {
            targetItem: props.currentItem,
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
DesignComponentTarget = DropTarget(ComponentType.DRAGGABLE_ITEM, componentTarget, collect)(DesignComponentTarget);

// =====================================================================================================================


// // Redux function which maps state from the store to specific props this component is interested in.
// function mapStateToProps(state) {
//     return {
//         mode: state.currentViewMode,
//         view: state.currentAppView
//     }
// }
//
//
// // Connect the Redux store to this component ensuring that its required state is mapped to props
// DesignComponentTarget = connect(mapStateToProps)(DesignComponentTarget);

export default DesignComponentTarget;