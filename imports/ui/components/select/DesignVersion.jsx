
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import UltrawideItemEditableField   from "../common/UltrawideItemEditableField";
import UpdateMergeItem              from './UpdateMergeItem.jsx';

// Ultrawide Services
import { ClientDesignVersionServices }  from '../../../apiClient/apiClientDesignVersion.js';

import {RoleType, DesignVersionStatus, ItemType, FieldType, DesignUpdateMergeAction, LogLevel} from '../../../constants/constants.js';
import { UI } from '../../../constants/ui_context_ids';
import { getContextID, log } from '../../../common/utils.js';


// Bootstrap
import {Button, ButtonGroup, Modal} from 'react-bootstrap';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Version Component - Graphically represents one Design Version that belongs to one Design
//
// ---------------------------------------------------------------------------------------------------------------------

export default class DesignVersion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
        };
    }


    onEditDesignVersion(userRole, userContext, dv){

        ClientDesignVersionServices.editDesignVersion(
            userRole,
            userContext,
            dv._id,
        );
    }

    onViewDesignVersion(userRole, userContext, dv){

        ClientDesignVersionServices.viewDesignVersion(
            userRole,
            userContext,
            dv._id
        );
    }

    onPublishDesignVersion(userRole, userContext, dv){

        ClientDesignVersionServices.publishDesignVersion(
            userRole,
            userContext,
            dv._id
        );
    }

    onWithdrawDesignVersion(userRole, userContext, dv){

        ClientDesignVersionServices.withdrawDesignVersion(
            userRole,
            userContext,
            dv._id
        );
    }

    onCreateNextDesignVersion(userRole, userContext, dv){

        this.setState({ showModal: false });

        //console.log('Creating next design version from dv ' + dv._id);

        ClientDesignVersionServices.createNextDesignVersion(
            userRole,
            userContext,
            dv._id
        );
    }




    getUpdates(designVersionId, updateMergeStatus, uiName){

        const updatesToMerge = ClientDesignVersionServices.getDesignUpdatesForVersion(designVersionId, updateMergeStatus);

        return updatesToMerge.map((update) => {
            // All applications are shown even in update edit view even if not in scope so that new items can be added to them
            return (
               <UpdateMergeItem
                   key={update._id}
                   updateItem={update}
                   uiName={uiName}
               />
            );
        });
    }

    onShowModal(userRole, dv){

        // Only show the dialog if its going to be valid to proceed anyway...
        const valid = ClientDesignVersionServices.validateCreateNextDesignVersion(userRole, dv._id);

        if (valid) {
            this.setState({showModal: true});
        }
    }

    onCloseModal() {
        this.setState({ showModal: false });
    }


    render() {

        const {designVersion, statusClass, userRole, userContext, uiName} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Design Version');

        // Items -------------------------------------------------------------------------------------------------------


        const name =
            <UltrawideItemEditableField
                fieldType={FieldType.NAME}
                currentItemType={ItemType.DESIGN_VERSION}
                currentItemId={designVersion._id}
                currentItemStatus={designVersion.designVersionStatus}
                currentFieldValue={designVersion.designVersionName}
                statusClass={statusClass}
                userRole={userRole}
                uiName={uiName}
            />;

        const version =
            <UltrawideItemEditableField
                fieldType={FieldType.VERSION}
                currentItemType={ItemType.DESIGN_VERSION}
                currentItemId={designVersion._id}
                currentItemStatus={designVersion.designVersionStatus}
                currentFieldValue={designVersion.designVersionNumber}
                statusClass={statusClass}
                userRole={userRole}
                uiName={uiName}
            />;

        let buttons = '';

        const editButton =
            <Button id={getContextID(UI.BUTTON_EDIT, uiName)} bsSize="xs" onClick={ () => this.onEditDesignVersion(userRole, userContext, designVersion)}>Edit</Button>;

        const viewButton =
            <Button id={getContextID(UI.BUTTON_VIEW, uiName)} bsSize="xs" onClick={ () => this.onViewDesignVersion(userRole, userContext, designVersion)}>View</Button>;

        const publishButton =
            <Button id={getContextID(UI.BUTTON_PUBLISH, uiName)} bsSize="xs" onClick={ () => this.onPublishDesignVersion(userRole, userContext, designVersion)}>Publish</Button>;

        const withdrawButton =
            <Button id={getContextID(UI.BUTTON_WITHDRAW, uiName)} bsSize="xs" onClick={ () => this.onWithdrawDesignVersion(userRole, userContext, designVersion)}>Withdraw</Button>;

        const createNextButton =
            <Button id={getContextID(UI.BUTTON_CREATE_NEXT, uiName)} bsSize="xs" onClick={ () => this.onShowModal(userRole, designVersion)}>Create Next</Button>;

        const modalOkButton =
            <Button id={getContextID(UI.MODAL_OK, uiName)} onClick={() => this.onCreateNextDesignVersion(userRole, userContext, designVersion)}>OK</Button>;

        const modalCancelButton =
            <Button id={getContextID(UI.MODAL_CANCEL, uiName)} onClick={() => this.onCloseModal()}>Cancel</Button>;


        // Popup shown when user wants to create next Design Version
        let confirmNextModal = '';

        switch(designVersion.designVersionStatus){
            case DesignVersionStatus.VERSION_DRAFT:

                confirmNextModal =
                    <Modal id={getContextID(UI.MODAL_NEXT_VERSION, uiName)} show={this.state.showModal} onHide={() => this.onCloseModal()}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create Next Design Version</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p className="merge-alert">You are about to complete the Initial Design Version</p>
                            <p className="merge-normal">You are leaving Freedom City.</p>
                            <p className="merge-normal">You are now entering formal Design Control.  From now on all changes to the Design must be in the form of Design Updates</p>
                            <p className="merge-alert">This action cannot be undone.  Are you sure you want to proceed?</p>
                        </Modal.Body>
                        <Modal.Footer>
                            {modalOkButton}
                            {modalCancelButton}
                        </Modal.Footer>
                    </Modal>;

                break;
            case DesignVersionStatus.VERSION_UPDATABLE:

                confirmNextModal =
                    <Modal id={getContextID(UI.MODAL_NEXT_VERSION, uiName)} show={this.state.showModal} onHide={() => this.onCloseModal()}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create Next Design Version</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p className="merge-alert">You are about to complete this Design Version and create a new one</p>
                            <p className="merge-normal">The new Design Version will include Design Updates as follows:</p>
                            <p className="merge-header">These updates will be merged into the new Design Version:</p>
                            <div id={getContextID(UI.MODAL_DV_UPDATES_MERGE, uiName)}>
                                {this.getUpdates(designVersion._id, DesignUpdateMergeAction.MERGE_INCLUDE, uiName)}
                            </div>
                            <p className="merge-header">These updates will be carried forward as Updates to the new Design Version:</p>
                            <div id={getContextID(UI.MODAL_DV_UPDATES_ROLL, uiName)}>
                                {this.getUpdates(designVersion._id, DesignUpdateMergeAction.MERGE_ROLL, uiName)}
                            </div>
                            <p className="merge-header">These updates will be ignored and lost forever:</p>
                            <div id={getContextID(UI.MODAL_DV_UPDATES_IGNORE, uiName)}>
                                {this.getUpdates(designVersion._id, DesignUpdateMergeAction.MERGE_IGNORE, uiName)}
                            </div>
                            <p className="merge-alert">This action cannot be undone.  Are you sure you want to proceed?</p>
                        </Modal.Body>
                        <Modal.Footer>
                            {modalOkButton}
                            {modalCancelButton}
                        </Modal.Footer>
                    </Modal>;

                break;
        }


        // Layout ------------------------------------------------------------------------------------------------------

        switch (designVersion.designVersionStatus) {
            case DesignVersionStatus.VERSION_NEW:

                if(userRole === RoleType.DESIGNER){
                    // Designers can Edit View or Publish
                    buttons =
                        <ButtonGroup className="button-group-left">
                            {viewButton}
                            {editButton}
                            {publishButton}
                        </ButtonGroup>;

                } else {
                    // Developers and Managers cannot access new design versions
                    buttons = <div></div>;
                }
                break;
            case DesignVersionStatus.VERSION_DRAFT:

                switch(userRole){
                    case RoleType.DESIGNER:

                        // Designers can view it, withdraw it if not adopted or create the next version from updates...
                        buttons =
                            <ButtonGroup className="button-group-left">
                                {viewButton}
                                {editButton}
                                {withdrawButton}
                                {createNextButton}
                            </ButtonGroup>;
                        break;
                    case RoleType.DEVELOPER:
                    case RoleType.MANAGER:
                    case RoleType.GUEST_VIEWER:

                        buttons =
                            <div>
                                <ButtonGroup className="button-group-left">
                                    {viewButton}
                                </ButtonGroup>
                            </div>;
                            break;

                }
                break;

            case DesignVersionStatus.VERSION_UPDATABLE:

                // Designers can view edit and create a new version
                // Others can view
                switch(userRole) {
                    case RoleType.DESIGNER:
                        buttons =
                            <div>
                                <ButtonGroup className="button-group-left">
                                    {viewButton}
                                </ButtonGroup>
                                <ButtonGroup className="button-group-left">
                                    {createNextButton}
                                </ButtonGroup>
                            </div>;
                        break;

                    case RoleType.DEVELOPER:
                    case RoleType.MANAGER:
                    case RoleType.GUEST_VIEWER:

                        buttons =
                            <div>
                                <ButtonGroup className="button-group-left">
                                    {viewButton}
                                </ButtonGroup>
                            </div>;
                        break;
                }
                break;
            case DesignVersionStatus.VERSION_DRAFT_COMPLETE:
            case DesignVersionStatus.VERSION_UPDATABLE_COMPLETE:
                // View only
                buttons =
                    <ButtonGroup className="button-group-left">
                        {viewButton}
                    </ButtonGroup>;
                break;

            default:
                log((msg) => console.log(msg), LogLevel.ERROR, "Unknown Design Version Status: {}", designVersion.designVersionStatus);

        }


        return (
            <div id={getContextID(UI.ITEM_DESIGN_VERSION, uiName)}>
                {name}
                {version}
                <div className={statusClass}>
                    {buttons}
                </div>
                {confirmNextModal}
            </div>
        );

    }
}

DesignVersion.propTypes = {
    designVersion: PropTypes.object.isRequired,
    statusClass: PropTypes.string.isRequired,
    userContext: PropTypes.object.isRequired,
    userRole: PropTypes.string.isRequired,
    uiName: PropTypes.string.isRequired
};


