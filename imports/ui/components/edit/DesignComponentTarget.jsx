// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignComponent      from './DesignComponent.jsx';

// Ultrawide Services
import {ComponentType, ViewMode, DisplayContext, UpdateScopeType, LogLevel} from '../../../constants/constants.js';
import {locationMoveDropAllowed, log, replaceAll} from '../../../common/utils.js';

import ClientDesignComponentServices from "../../../apiClient/apiClientDesignComponent";

// Bootstrap

// REDUX services

// React DnD
import { DropTarget } from 'react-dnd';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Component Target Component - Represents the part of a design component that another design component can be
// dropped on to when moving a component to a new parent
//
// ---------------------------------------------------------------------------------------------------------------------


export class DesignComponentTarget extends Component{

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

    getParentName(currentItem){

        if(currentItem && currentItem.componentParentReferenceIdNew !== 'NONE') {
            const parent = ClientDesignComponentServices.getCurrentItemParent(currentItem);
            if(parent){
                return parent.componentNameNew;
            } else {
                return 'NONE';
            }
        } else {
            return 'NONE';
        }

    }

    render(){

        const {currentItem, updateItem, wpItem, displayContext, connectDropTarget, isOverCurrent, canDrop, testSummary, testSummaryData, mode} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Design Component Target {}', currentItem.componentNameNew);

        const uiItemId = replaceAll(currentItem.componentNameNew, ' ', '_');
        const uiParentId = replaceAll(this.getParentName(currentItem), ' ', '_');
        let uiContextName = uiItemId;

        // To get a guaranteed unique context, design sections and feature aspects must say who their parent is
        switch(currentItem.componentType){

            case ComponentType.DESIGN_SECTION:
            case ComponentType.FEATURE_ASPECT:
                uiContextName = uiParentId + '_' + uiItemId;
                break;
        }

        let updateItemScope = UpdateScopeType.SCOPE_OUT_SCOPE;
        if(updateItem && updateItem.scopeType){
            updateItemScope = updateItem.scopeType;
        }

        //console.log("Rendering design component target: " + this.props.currentItem.componentType + " - " + currentItem.componentNameNew + " canDrop: " + canDrop + " display context " + displayContext + "mode " + mode);

        if(!(Meteor.isTest) && canDrop && (this.props.displayContext === DisplayContext.UPDATE_EDIT || this.props.displayContext === DisplayContext.BASE_EDIT) && this.props.mode === ViewMode.MODE_EDIT) {
            // Only can be droppable if in Edit mode and if the edit section of the view
            return connectDropTarget(
                <div id={'Target_' + uiContextName}>
                    <DesignComponent
                        currentItem={currentItem}
                        updateItem={updateItem}
                        updateItemScope={updateItemScope}
                        wpItem={wpItem}
                        uiItemId={uiItemId}
                        uiParentId={uiParentId}
                        isDragDropHovering={isOverCurrent && canDrop}
                        displayContext={displayContext}
                        testSummary={testSummary}
                        testSummaryData={testSummaryData}
                    />
                </div>
            )
        } else {
            return (
                <div id={'NoDropTarget_' + uiContextName}>
                    <DesignComponent
                        currentItem={currentItem}
                        updateItem={updateItem}
                        updateItemScope={updateItemScope}
                        wpItem={wpItem}
                        uiItemId={uiItemId}
                        uiParentId={uiParentId}
                        isDragDropHovering={false}
                        displayContext={displayContext}
                        testSummary={testSummary}
                        testSummaryData={testSummaryData}
                    />
                </div>
            )
        }
    }
}

DesignComponentTarget.propTypes = {
    currentItem: PropTypes.object.isRequired,
    updateItem: PropTypes.object,
    wpItem: PropTypes.object,
    displayContext: PropTypes.string.isRequired,
    view: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    testSummary: PropTypes.bool.isRequired,
    testSummaryData: PropTypes.object,
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
        // if(props.view === ViewType.DESIGN_UPDATE_EDIT){
        //     inScope = props.updateItem.scopeType === UpdateScopeType.SCOPE_IN_SCOPE;
        // }

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
export default DropTarget(ComponentType.DRAGGABLE_ITEM, componentTarget, collect)(DesignComponentTarget);
