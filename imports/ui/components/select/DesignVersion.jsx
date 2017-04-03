
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import DesignItemHeader from './DesignItemHeader.jsx';
import UpdateMergeItem from './UpdateMergeItem.jsx';

// Ultrawide Services
import ClientDesignVersionServices from '../../../apiClient/apiClientDesignVersion.js';
import {RoleType, DesignVersionStatus, ItemType, DesignUpdateMergeAction, ViewType, ViewMode, LogLevel} from '../../../constants/constants.js';
import { log } from '../../../common/utils.js';
import TextLookups from '../../../common/lookups.js';

// Bootstrap
import {Button, ButtonGroup, Modal} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Version Component - Graphically represents one Design Version that belongs to one Design
//
// ---------------------------------------------------------------------------------------------------------------------

export class DesignVersion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
        };
    }

    getTestIntegrationDataContext(){

        return {
            designVersionDataLoaded:        this.props.dvDataLoaded,
            testIntegrationDataLoaded:      this.props.testDataLoaded,
            testSummaryDataLoaded:          this.props.summaryDataLoaded,
            mashDataStale:                  this.props.mashDataStale,
            testDataStale:                  this.props.testDataStale
        };
    }

    onEditDesignVersion(userRole, viewOptions, userContext, dv, testDataFlag){

        ClientDesignVersionServices.editDesignVersion(
            userRole,
            viewOptions,
            userContext,
            dv._id,
            testDataFlag,
            this.getTestIntegrationDataContext()
        );
    }

    onViewDesignVersion(userRole, viewOptions, userContext, dv, testDataFlag){

        ClientDesignVersionServices.viewDesignVersion(
            userRole,
            viewOptions,
            userContext,
            dv._id,
            testDataFlag,
            this.getTestIntegrationDataContext()
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

        console.log('Creating next design version from dv ' + dv._id);

        ClientDesignVersionServices.createNextDesignVersion(
            userRole,
            userContext,
            dv._id
        );
    }


    setNewDesignVersionActive(userRole, userContext, dv){

        // Changing the design version updates the user context
        ClientDesignVersionServices.setDesignVersion(
            userContext,
            userRole,
            dv._id,
            false
        );

    }

    getUpdates(designVersionId, updateMergeStatus){

        const updatesToMerge = ClientDesignVersionServices.getDesignUpdatesForVersion(designVersionId, updateMergeStatus);

        return updatesToMerge.map((update) => {
            // All applications are shown even in update edit view even if not in scope so that new items can be added to them
            return (
               <UpdateMergeItem
                   key={update._id}
                   updateItem={update}
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
        const {designVersion, userRole, viewOptions, userContext, testDataFlag} = this.props;

        let itemStyle = (designVersion._id === userContext.designVersionId ? 'design-item di-active' : 'design-item');

        // Items -------------------------------------------------------------------------------------------------------
        let statusClass = 'design-item-status';

        switch(designVersion.designVersionStatus){
            case DesignVersionStatus.VERSION_NEW:
                statusClass = 'design-item-status item-status-new';
                break;
            case DesignVersionStatus.VERSION_DRAFT:
                statusClass = 'design-item-status item-status-draft';
                break;
            case DesignVersionStatus.VERSION_DRAFT_COMPLETE:
            case DesignVersionStatus.VERSION_UPDATABLE_COMPLETE:
                statusClass = 'design-item-status item-status-complete';
                break;
            case DesignVersionStatus.VERSION_UPDATABLE:
                statusClass = 'design-item-status item-status-updatable';
                break;
        }

        let status =
            <div id="designVersionStatus" className={statusClass}>{TextLookups.designVersionStatus(designVersion.designVersionStatus)}</div>;

        let buttons = '';

        const editButton =
            <Button id="butEdit" bsSize="xs" onClick={ () => this.onEditDesignVersion(userRole, viewOptions, userContext, designVersion, testDataFlag)}>Edit</Button>;

        const viewButton =
            <Button id="butView" bsSize="xs" onClick={ () => this.onViewDesignVersion(userRole, viewOptions, userContext, designVersion, testDataFlag)}>View</Button>;

        const publishButton =
            <Button id="butPublish" bsSize="xs" onClick={ () => this.onPublishDesignVersion(userRole, userContext, designVersion)}>Publish</Button>;

        const withdrawButton =
            <Button id="butWithdraw" bsSize="xs" onClick={ () => this.onWithdrawDesignVersion(userRole, userContext, designVersion)}>Withdraw</Button>;

        const createNextButton =
            <Button id="butCreateNext" bsSize="xs" onClick={ () => this.onShowModal(userRole, designVersion)}>Create Next</Button>;

        const modalOkButton =
            <Button onClick={() => this.onCreateNextDesignVersion(userRole, userContext, designVersion)}>OK</Button>;

        const modalCancelButton =
            <Button onClick={() => this.onCloseModal()}>Cancel</Button>;

        const header =
            <DesignItemHeader
                currentItemType={ItemType.DESIGN_VERSION}
                currentItemId={designVersion._id}
                currentItemName={designVersion.designVersionName}
                currentItemRef={designVersion.designVersionNumber}
                currentItemStatus={designVersion.designVersionStatus}
                //onSelectItem={ () => this.setNewDesignVersionActive(userRole, userContext, designVersion)}
            />;


        // Popup shown when user wants to create next Design Version
        let confirmNextModal = '';

        switch(designVersion.designVersionStatus){
            case DesignVersionStatus.VERSION_DRAFT:

                confirmNextModal =
                    <Modal show={this.state.showModal} onHide={() => this.onCloseModal()}>
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
                    <Modal show={this.state.showModal} onHide={() => this.onCloseModal()}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create Next Design Version</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p className="merge-alert">You are about to complete this Design Version and create a new one</p>
                            <p className="merge-normal">The new Design Version will include Design Updates as follows:</p>
                            <p className="merge-header">These updates will be merged into the new Design Version:</p>
                            <div>
                                {this.getUpdates(designVersion._id, DesignUpdateMergeAction.MERGE_INCLUDE)}
                            </div>
                            <p className="merge-header">These updates will be carried forward as Updates to the new Design Version:</p>
                            <div>
                                {this.getUpdates(designVersion._id, DesignUpdateMergeAction.MERGE_ROLL)}
                            </div>
                            <p className="merge-header">These updates will be ignored and lost forever:</p>
                            <div>
                                {this.getUpdates(designVersion._id, DesignUpdateMergeAction.MERGE_IGNORE)}
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
                    case  RoleType.DEVELOPER:
                        //TODO - Change all this
                        // Developers can view or adopt a draft design
                        buttons =
                            <div>
                                <ButtonGroup className="button-group-left">
                                    {viewButton}
                                </ButtonGroup>
                            </div>;
                            break;
                    case  RoleType.MANAGER:
                        // Managers can view a draft design
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
                        buttons =
                            <div>
                                <ButtonGroup className="button-group-left">
                                    {viewButton}
                                </ButtonGroup>
                            </div>;
                        break;
                    case RoleType.MANAGER:
                        buttons =
                            <ButtonGroup className="button-group-left">
                                {viewButton}
                            </ButtonGroup>;
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
            <div className={itemStyle} onClick={() => this.setNewDesignVersionActive(userRole, userContext, designVersion)}>
                {status}
                {header}
                {buttons}
                {confirmNextModal}
            </div>
        )
    }
}

DesignVersion.propTypes = {
    designVersion: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:                   state.currentUserRole,
        viewOptions:                state.currentUserViewOptions,
        userContext:                state.currentUserItemContext,
        testDataFlag:               state.testDataFlag,
        dvDataLoaded:               state.designVersionDataLoaded,
        testDataLoaded:             state.testIntegrationDataLoaded,
        summaryDataLoaded:          state.testSummaryDataLoaded,
        mashDataStale:              state.mashDataStale,
        testDataStale:              state.testDataStale
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(DesignVersion);

