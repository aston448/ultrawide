// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import UltrawideAction                  from "../../components/common/UltrawideAction.jsx";

// Ultrawide Services
import {ClientWorkItemServices}         from "../../../apiClient/apiClientWorkItem";
import {ClientWorkPackageServices}      from "../../../apiClient/apiClientWorkPackage";
import {WorkItemDetailUIModules}        from '../../../ui_modules/work_item_detail.js'

import {ViewType, ComponentType, ViewMode, DisplayContext, WorkPackageScopeType, LogLevel,
    UpdateMergeStatus, UpdateScopeType, RoleType, WorkItemType, WorkPackageStatus} from '../../../constants/constants.js';

import { UI }                               from "../../../constants/ui_context_ids";
import {getComponentClass, getContextID, replaceAll, log}         from '../../../common/utils.js';
import { TextLookups }                      from '../../../common/lookups.js'

// Bootstrap
import {FormControl, InputGroup, Badge} from 'react-bootstrap';
import {Glyphicon}  from 'react-bootstrap';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services

// React DnD - Component is draggable
import { DragSource } from 'react-dnd';

// Draft JS - Name is text editable
import {Editor, EditorState, SelectionState, ContentState, RichUtils, DefaultDraftBlockRenderMap, convertFromRaw, convertToRaw, getDefaultKeyBinding, KeyBindingUtil, CompositeDecorator} from 'draft-js';
import {ClientDesignUpdateServices} from "../../../apiClient/apiClientDesignUpdate";





// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Iteration Detail
//
// ---------------------------------------------------------------------------------------------------------------------

class WorkItemDetail extends Component{

    constructor(...args){
        super(...args);

        this.state = {
            editing: false,
            itemName: '',
            itemLink: ''
        };

    }

    componentDidMount(){
        if(this.props.workItemType === WorkItemType.BASE_WORK_PACKAGE || this.props.workItemType === WorkItemType.UPDATE_WORK_PACKAGE){
            this.setState({itemName: this.props.workItem.workPackageName, itemLink: this.props.workItem.workPackageLink});
        } else {
            this.setState({itemName: this.props.workItem.wiName, itemLink: this.props.workItem.wiLink});
        }
    }

    shouldComponentUpdate(nextProps, nextState){

        // Optimisation.  No need to re-render this component if no change to what is seen
        return true

    }

    handleNameChange(e){
        this.setState({itemName: e.target.value});
    }

    handleLinkChange(e){
        this.setState({itemLink: e.target.value});
    }

    handleKeyEvents(e){
        if(e.charCode === 13){
            // Enter Key
            this.saveWorkItem();
        }
    }

    editWorkItem(){
        this.setState({editing: true});
    }

    cancelEdit(){
        this.setState({editing: false});
    }

    removeWorkItem(workItem, userRole){
        switch(workItem.wiType){
            case WorkItemType.INCREMENT:
            case WorkItemType.ITERATION:
                ClientWorkItemServices.removeWorkItem(workItem._id, userRole);
                break;
        }
    }

    saveWorkItem(){

        if(this.props.workItemType === WorkItemType.BASE_WORK_PACKAGE || this.props.workItemType === WorkItemType.UPDATE_WORK_PACKAGE){
            ClientWorkPackageServices.updateWorkPackageName(this.props.userRole, this.props.workItem._id, this.state.itemName);
            ClientWorkPackageServices.updateWorkPackageLink(this.props.userRole, this.props.workItem._id, this.state.itemLink);
        } else {
            ClientWorkItemServices.saveWorkItemDetails(this.props.workItem, this.state.itemName, this.state.itemLink, this.props.userRole);
        }

        this.setState({editing: false});
    }

    selectWorkItem(){

        switch(this.props.workItemType){

            case WorkItemType.BASE_WORK_PACKAGE:
            case WorkItemType.UPDATE_WORK_PACKAGE:

                ClientWorkPackageServices.selectWorkPackage(
                    this.props.userRole,
                    this.props.userContext,
                    this.props.workItem
                );

                break;

            case WorkItemType.DESIGN_UPDATE:

                let duId = 'NONE';

                if(this.props.displayContext === DisplayContext.WORK_ITEM_DU_LIST){
                    // An actual DU
                    duId = this.props.workItem._id;
                } else {
                    // Work Item DU
                    duId = this.props.workItem.wiDuId;
                }

                ClientDesignUpdateServices.setDesignUpdate(
                    this.props.userContext,
                    duId
                );

                break;
        }
    }



    // Render the header of the design component - has tools in it depending on context
    render() {
        const {workItem, workItemType, userRole, userContext, displayContext, connectDragSource, connectDragPreview, isDragging} = this.props;

        let itemName = '';
        let badgeId = '';
        let badgeClass = '';
        let workItemClass = '';
        let selectedItem = false;
        let selectedItemClass = '';

        switch(workItemType){

            case WorkItemType.INCREMENT:

                itemName = workItem.wiName;
                badgeId = workItem.wiType;
                badgeClass = 'badge-increment';

                break;

            case WorkItemType.ITERATION:

                itemName = workItem.wiName;
                badgeId = workItem.wiType;
                badgeClass = 'badge-iteration';
                break;

            case WorkItemType.DESIGN_UPDATE:

                if(displayContext === DisplayContext.WORK_ITEM_DU_LIST){
                    itemName = workItem.updateName;
                } else {
                    itemName = workItem.wiName;
                }
                badgeId = 'DU';
                badgeClass = 'badge-du';
                break;

            case WorkItemType.BASE_WORK_PACKAGE:
            case WorkItemType.UPDATE_WORK_PACKAGE:

                itemName = workItem.workPackageName;
                badgeId = 'WP';
                if(workItem._id === userContext.workPackageId){
                    workItemClass = 'work-item-wp-selected';
                } else {
                    workItemClass = 'work-item-wp';
                }

                // Colour code the WP badge according to status
                switch(workItem.workPackageStatus){
                    case WorkPackageStatus.WP_NEW:
                        badgeClass = 'badge-work-package-new';
                        break;
                    case WorkPackageStatus.WP_AVAILABLE:
                        badgeClass = 'badge-work-package-available';
                        break;
                    case WorkPackageStatus.WP_ADOPTED:
                        badgeClass = 'badge-work-package-adopted';
                        break;
                }

                break;
        }

        log((msg) => console.log(msg), LogLevel.PERF, 'Render WorkItem Detail {}', itemName);

        const uiContextName = replaceAll(itemName, ' ', '_');


        let layout = <div></div>;
        let buttons = <div></div>;

        let editAction =
            <InputGroup.Addon>
                <UltrawideAction
                    actionType={UI.OPTION_EDIT}
                    uiContextName={uiContextName}
                    actionFunction={() => this.editWorkItem()}
                />
            </InputGroup.Addon>;

        let deleteAction =
            <InputGroup.Addon>
                <UltrawideAction
                    actionType={UI.OPTION_REMOVE}
                    uiContextName={uiContextName}
                    actionFunction={() => this.removeWorkItem(workItem, userRole)}
                    isDeleted={false}
                />
            </InputGroup.Addon>;

        let moveAction =
            <InputGroup.Addon>
                <UltrawideAction
                    actionType={UI.OPTION_MOVE}
                    uiContextName={uiContextName}
                />
            </InputGroup.Addon>;


        let draggableMoveAction = '';
        if (!(Meteor.isTest)) {
            draggableMoveAction =
                <InputGroup.Addon>
                    {connectDragSource(
                        <div>
                            <UltrawideAction
                                actionType={UI.OPTION_MOVE}
                                uiContextName={uiContextName}
                            />
                        </div>
                    )
                    }
                </InputGroup.Addon>
        }

        let saveAction =
            <InputGroup.Addon>
                <UltrawideAction
                    actionType={UI.OPTION_SAVE}
                    uiContextName={uiContextName}
                    actionFunction={() => this.saveWorkItem()}
                />
            </InputGroup.Addon>;

        let undoAction =
            <InputGroup.Addon id="actionUndo">
                <UltrawideAction
                    actionType={UI.OPTION_UNDO}
                    uiContextName={uiContextName}
                    actionFunction={() => this.cancelEdit()}
                />
            </InputGroup.Addon>;


        let badge =
            <InputGroup.Addon>
                <Badge className={badgeClass}>{badgeId}</Badge>
            </InputGroup.Addon>;

        let itemLink =
            <InputGroup.Addon>
                <div className="work-item-link"><a href={this.state.itemLink} target="_blank"><Glyphicon glyph='link'/></a></div>
            </InputGroup.Addon>;

        let itemText =
            <div className="work-item-name">{itemName}</div>;


        let updateWpStatus =
            <InputGroup.Addon>
                <div id="updateWpSummary" className={workItem.updateWpStatus}><Glyphicon glyph='tasks'/>
                </div>
            </InputGroup.Addon>;

        let updateTestStatus =
            <InputGroup.Addon>
                <div id="updateTestSummary" className={workItem.updateTestStatus}><Glyphicon
                glyph='th-large'/></div>
            </InputGroup.Addon>;

        // Get buttons for Work Packages based on their status
        if(workItemType === WorkItemType.BASE_WORK_PACKAGE || workItemType === WorkItemType.UPDATE_WORK_PACKAGE) {

            buttons = WorkItemDetailUIModules.getWorkPackageButtonsLayout(userRole, userContext, workItem, uiContextName);
        }

        let itemNotEditable =
            <div className={workItemClass}>
                <InputGroup>
                    {badge}
                    {itemLink}
                    {itemText}
                </InputGroup>
                {buttons}
            </div>;

        let duNotEditable =
            <div className={workItemClass}>
                <InputGroup>
                    {badge}
                    {itemLink}
                    {itemText}
                    {updateWpStatus}
                    {updateTestStatus}
                </InputGroup>
                {buttons}
            </div>;

        let wpNotEditingDraggable =
            connectDragPreview(
                <div className={workItemClass}>
                    <InputGroup>
                        {badge}
                        {itemLink}
                        {itemText}
                        {editAction}
                        {draggableMoveAction}
                    </InputGroup>
                    {buttons}
                </div>
            );

        let itemNotEditingDraggable =
            connectDragPreview(
                <div className={workItemClass}>
                    <InputGroup>
                        {badge}
                        {itemLink}
                        {itemText}
                        {editAction}
                        {deleteAction}
                        {draggableMoveAction}
                    </InputGroup>
                    {buttons}
                </div>
            );

        let itemEditing =
            <div className={workItemClass}>
                <InputGroup>
                    {badge}
                    {itemLink}
                    {itemText}
                    {saveAction}
                    {undoAction}
                </InputGroup>
                <div className="editableItem">
                    <FormControl
                        type="text"
                        value={this.state.itemName}
                        placeholder={this.state.itemName}
                        onChange={(event) => this.handleNameChange(event)}
                        onKeyPress={(event) => this.handleKeyEvents(event)}
                    />
                </div>
                <div className="editableItem">
                    <FormControl
                        type="text"
                        value={this.state.itemLink}
                        placeholder={this.state.itemLink}
                        onChange={(event) => this.handleLinkChange(event)}
                        onKeyPress={(event) => this.handleKeyEvents(event)}
                    />
                </div>
            </div>;

        switch(userRole){

            case RoleType.MANAGER:

                // Manager can edit and move work items

                switch(workItemType){
                    case WorkItemType.INCREMENT:
                    case WorkItemType.ITERATION:
                        if(this.state.editing){
                            layout = itemEditing;
                        } else {
                            layout = itemNotEditingDraggable;
                        }
                        break;
                    case WorkItemType.BASE_WORK_PACKAGE:
                    case WorkItemType.UPDATE_WORK_PACKAGE:
                        if(this.state.editing){
                            layout = itemEditing;
                        } else {
                            layout = wpNotEditingDraggable;
                        }
                        selectedItem = (workItem._id === userContext.workPackageId);
                        break;
                    case WorkItemType.DESIGN_UPDATE:

                        if(displayContext === DisplayContext.WORK_ITEM_EDIT_BASE || displayContext === DisplayContext.WORK_ITEM_EDIT_UPD){
                            layout = wpNotEditingDraggable;
                            selectedItem = (workItem.wiDuId === userContext.designUpdateId);
                        } else {
                            layout = duNotEditable;
                            selectedItem = (workItem._id === userContext.designUpdateId);
                        }

                        break;
                }

                break;

            default:

                // Everyone else can just look and use appropriate WP buttons

                layout = itemNotEditable;
        }

        if(selectedItem){
            selectedItemClass = 'summary-row-selected';
        }


        return(
            <div className={selectedItemClass} onClick={() => this.selectWorkItem()}>
                {layout}
            </div>
        );

    }
}

// Additional properties are added by React DnD collectSource
WorkItemDetail.propTypes = {
    workItem: PropTypes.object.isRequired,
    workItemType: PropTypes.string.isRequired,
    userRole: PropTypes.string.isRequired,
    userContext:  PropTypes.object.isRequired,
    displayContext: PropTypes.string.isRequired
};

// React DnD ===========================================================================================================

// Properties required to control the drag
const componentSource = {

    // Start of drag gets the item being dragged
    beginDrag(props) {

        switch(props.workItemType){

            case WorkItemType.BASE_WORK_PACKAGE:
            case WorkItemType.UPDATE_WORK_PACKAGE:

                ClientWorkPackageServices.selectWorkPackage(
                    props.userRole,
                    props.userContext,
                    props.workItem
                );

                break;

            case WorkItemType.DESIGN_UPDATE:

                let duId = 'NONE';

                if(props.displayContext === DisplayContext.WORK_ITEM_DU_LIST){
                    // An actual DU
                    duId = props.workItem._id;
                } else {
                    // Work Item DU
                    duId = props.workItem.wiDuId;
                }

                ClientDesignUpdateServices.setDesignUpdate(
                    props.userContext,
                    duId
                );

                break;
        }

        return {
            workItem: props.workItem,
        }
    },

    // End of drag sees if it is allowed to be dropped and if so calls functions to update the data accordingly
    endDrag(props, monitor, component){

        log((msg) => console.log(msg), LogLevel.DEBUG, "END DRAG!");
        //console.log('End Drag');

        if (!monitor.didDrop) {
            log((msg) => console.log(msg), LogLevel.DEBUG, "NO DROP");
            //console.log('No Drop');
            return;
        }

        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();

        if (dropResult) {

            switch(dropResult.dragType){
                case 'MOVE_LOCATION':

                    // Drop action when moving an item to a new parent location
                    log((msg) => console.log(msg), LogLevel.DEBUG, "DROP - MOVE");

                    ClientWorkItemServices.moveWorkItem(item.workItem, dropResult.targetItem, props.userRole);

                    break;

                case 'MOVE_REORDER':

                    // Drop action when moving an item in the list to reorder it
                    log((msg) => console.log(msg), LogLevel.DEBUG, "DROP - REORDER");

                    ClientWorkItemServices.reorderWorkItem(item.workItem, dropResult.targetItem, props.userRole);

                    break;

                case 'MOVE_WP_UNASSIGNED':
                    //console.log('Move Unassigned');
                    ClientWorkItemServices.moveWorkItem(item.workItem, null, props.userRole);
                    break;

                default:
                    log((msg) => console.log(msg), LogLevel.DEBUG, "NO DRAG TYPE");
            }
        } else {
            console.log('No result');
            log((msg) => console.log(msg), LogLevel.DEBUG, "NO DROP RESULT");
        }
    }
};


// React DnD function to get and monitor drags
function collectSource(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    }
}

// Before exporting, wrap this component to make it draggable
export default WorkItemDetail = DragSource(ComponentType.DRAGGABLE_ITEM, componentSource, collectSource)(WorkItemDetail);

// =====================================================================================================================



