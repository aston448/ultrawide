// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import UltrawideItemEditableField   from "../common/UltrawideItemEditableField";

// Ultrawide Services
import {log, getContextID} from "../../../common/utils";
import { UI } from '../../../constants/ui_context_ids';
import {ItemType, DesignUpdateStatus, DesignUpdateMergeAction, RoleType, FieldType, LogLevel} from '../../../constants/constants.js';
import { TextLookups } from '../../../common/lookups.js';

import { ClientDesignUpdateServices }   from '../../../apiClient/apiClientDesignUpdate.js';

// Bootstrap
import {Button, ButtonGroup, FormGroup, Radio} from 'react-bootstrap';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Update Component - Graphically represents one Design Update that belongs to one Design Version
//
// ---------------------------------------------------------------------------------------------------------------------

// Unit test export
export default class DesignUpdate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adopted: false,
            mergeAction: props.designUpdate.updateMergeAction
        };
    }


    onEditDesignUpdate(userRole, userContext, du){

        ClientDesignUpdateServices.editDesignUpdate(
            userRole,
            userContext,
            du._id
        );
    };

    onDeleteDesignUpdate(userRole, userContext, du){

        ClientDesignUpdateServices.deleteDesignUpdate(
            userRole,
            userContext,
            du._id
        );
    };

    onPublishDesignUpdate(userRole, userContext, du){

        ClientDesignUpdateServices.publishDesignUpdate(
            userRole,
            userContext,
            du._id
        );
    };

    onWithdrawDesignUpdate(userRole, userContext, du){

        ClientDesignUpdateServices.withdrawDesignUpdate(
            userRole,
            userContext,
            du._id
        );
    };

    onViewDesignUpdate(userRole, userContext, du){

        ClientDesignUpdateServices.viewDesignUpdate(
            userRole,
            userContext,
            du._id,
        );
    }

    // onRefreshSummary(du){
    //
    //     ClientDesignUpdateServices.refreshSummary(du._id);
    // }

    setNewDesignUpdateActive(context, du){

        ClientDesignUpdateServices.setDesignUpdate(
            context,
            du._id
        );
    };


    onMergeActionChange(userRole, du, newAction){

        this.setState({mergeAction: newAction});

        ClientDesignUpdateServices.updateMergeAction(userRole, du._id, newAction);

        this.setNewDesignUpdateActive(this.props.userContext, du);

    }

    render() {
        const {designUpdate, statusClass, userRole, userContext, uiName} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Design Update');

        // Items -------------------------------------------------------------------------------------------------------

        const name =
            <UltrawideItemEditableField
                fieldType={FieldType.NAME}
                currentItemType={ItemType.DESIGN_UPDATE}
                currentItemId={designUpdate._id}
                currentItemStatus={designUpdate.updateStatus}
                currentFieldValue={designUpdate.updateName}
                statusClass={statusClass}
                userRole={userRole}
                uiName={uiName}
            />;

        const body =
            <UltrawideItemEditableField
                fieldType={FieldType.REFERENCE}
                currentItemType={ItemType.DESIGN_UPDATE}
                currentItemId={designUpdate._id}
                currentItemStatus={designUpdate.updateStatus}
                currentFieldValue={designUpdate.updateReference}
                statusClass={statusClass}
                userRole={userRole}
                uiName={uiName}
            />;

        const editButton = <Button id={getContextID(UI.BUTTON_EDIT, uiName)} bsSize="xs" onClick={ () => this.onEditDesignUpdate(userRole, userContext, designUpdate)}>Edit</Button>;
        const deleteButton = <Button id={getContextID(UI.BUTTON_REMOVE, uiName)} bsSize="xs" onClick={ () => this.onDeleteDesignUpdate(userRole, userContext, designUpdate)}>Delete</Button>;
        const publishButton = <Button id={getContextID(UI.BUTTON_PUBLISH, uiName)} bsSize="xs" onClick={ () => this.onPublishDesignUpdate(userRole, userContext, designUpdate)}>Publish</Button>;
        const withdrawButton = <Button id={getContextID(UI.BUTTON_WITHDRAW, uiName)} bsSize="xs" onClick={ () => this.onWithdrawDesignUpdate(userRole, userContext, designUpdate)}>Withdraw</Button>;
        const viewButton = <Button id={getContextID(UI.BUTTON_VIEW, uiName)} bsSize="xs" onClick={ () => this.onViewDesignUpdate(userRole, userContext, designUpdate)}>View</Button>;

        const mergeOptions =
            <div className={'merge-options'}>
                <FormGroup id={getContextID(UI.ITEM_MERGE_OPTIONS, uiName)}>
                    <Radio inline id={getContextID(UI.MERGE_OPTION_INCLUDE, uiName)} checked={this.state.mergeAction === DesignUpdateMergeAction.MERGE_INCLUDE}
                           onChange={() => this.onMergeActionChange(userRole, designUpdate, DesignUpdateMergeAction.MERGE_INCLUDE)}>
                        {TextLookups.updateMergeActions(DesignUpdateMergeAction.MERGE_INCLUDE)}
                    </Radio>
                    <Radio inline id={getContextID(UI.MERGE_OPTION_ROLL, uiName)} checked={this.state.mergeAction === DesignUpdateMergeAction.MERGE_ROLL}
                           onChange={() => this.onMergeActionChange(userRole, designUpdate, DesignUpdateMergeAction.MERGE_ROLL)}>
                        {TextLookups.updateMergeActions(DesignUpdateMergeAction.MERGE_ROLL)}
                    </Radio>
                    <Radio inline id={getContextID(UI.MERGE_OPTION_IGNORE, uiName)} checked={this.state.mergeAction === DesignUpdateMergeAction.MERGE_IGNORE}
                           onChange={() => this.onMergeActionChange(userRole, designUpdate, DesignUpdateMergeAction.MERGE_IGNORE)}>
                        {TextLookups.updateMergeActions(DesignUpdateMergeAction.MERGE_IGNORE)}
                    </Radio>
                </FormGroup>
            </div>;

        // Layout ------------------------------------------------------------------------------------------------------

        let buttons = '';
        let options = '';

        switch(designUpdate.updateStatus){
            case DesignUpdateStatus.UPDATE_NEW:
                switch(userRole){
                    case RoleType.DEVELOPER:
                    case RoleType.MANAGER:
                    // Developers and Managers can't do anything with design updates until published
                        buttons = <div></div>;
                        break;
                    case RoleType.DESIGNER:
                        // Designers can view, edit, delete or publish a new update
                        buttons =
                            <ButtonGroup className="button-group-left">
                                {viewButton}
                                {editButton}
                                {deleteButton}
                                {publishButton}
                            </ButtonGroup>;
                        break;
                }
                break;
            case DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT:
                switch(userRole){
                    case RoleType.DEVELOPER:

                        // Developers can view or select an update to include in the adopted design
                        buttons =
                            <div>
                                <ButtonGroup className="button-group-left">
                                    {viewButton}
                                </ButtonGroup>
                            </div>;
                        break;

                    case RoleType.DESIGNER:

                        // Designers can view, edit or withdraw the update or specify how it is to be merged into the next Design Version
                        buttons =
                            <ButtonGroup className="button-group-left">
                                {viewButton}
                                {editButton}
                                {withdrawButton}
                            </ButtonGroup>;

                        options = mergeOptions;
                        break;

                    case RoleType.MANAGER:

                        // Managers can just view or refresh the summary
                        buttons =
                            <div>
                                <ButtonGroup className="button-group-left">
                                    {viewButton}
                                </ButtonGroup>
                            </div>;
                        break;
                }
                break;
            case DesignUpdateStatus.UPDATE_MERGED:
            case DesignUpdateStatus.UPDATE_IGNORED:
                // View only for everyone
                buttons =
                    <ButtonGroup className="button-group-left">
                        {viewButton}
                    </ButtonGroup>;
                break;
        }

        return (
            <div id={getContextID(UI.ITEM_DESIGN_UPDATE, uiName)}>
                {name}
                {body}
                <div className={statusClass}>
                    {options}
                    {buttons}
                </div>
            </div>
        );

    }
}

DesignUpdate.propTypes = {
    designUpdate: PropTypes.object.isRequired,
    statusClass: PropTypes.string.isRequired,
    userContext: PropTypes.object.isRequired,
    userRole: PropTypes.string.isRequired,
    uiName: PropTypes.string.isRequired
};
