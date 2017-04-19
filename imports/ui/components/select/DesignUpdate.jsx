// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import DesignItemHeader from './DesignItemHeader.jsx';

// Ultrawide Services
import ClientDesignUpdateServices from '../../../apiClient/apiClientDesignUpdate.js';
import {ItemType, DesignUpdateStatus, DesignUpdateMergeAction, RoleType} from '../../../constants/constants.js';
import TextLookups from '../../../common/lookups.js';

// Bootstrap
import {Button, ButtonGroup, FormGroup, Radio, Checkbox} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Update Component - Graphically represents one Design Update that belongs to one Design Version
//
// ---------------------------------------------------------------------------------------------------------------------

// Unit test export
export class DesignUpdate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adopted: false,
            mergeAction: props.designUpdate.updateMergeAction
        };
    }


    onEditDesignUpdate(userRole, userContext, viewOptions, du){

        ClientDesignUpdateServices.editDesignUpdate(
            userRole,
            userContext,
            viewOptions,
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

    onViewDesignUpdate(userRole, userContext, viewOptions, du){

        ClientDesignUpdateServices.viewDesignUpdate(
            userRole,
            userContext,
            viewOptions,
            du._id,
            this.props.testDataFlag,
            this.getTestIntegrationDataContext()
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

    getTestIntegrationDataContext(){

        return {
            designVersionDataLoaded:        this.props.dvDataLoaded,
            testIntegrationDataLoaded:      this.props.testDataLoaded,
            testSummaryDataLoaded:          this.props.summaryDataLoaded,
            mashDataStale:                  this.props.mashDataStale,
            testDataStale:                  this.props.testDataStale
        };
    }

    onMergeActionChange(userRole, du, newAction){

        this.setState({mergeAction: newAction});

        ClientDesignUpdateServices.updateMergeAction(userRole, du._id, newAction);

        this.setNewDesignUpdateActive(this.props.userContext, du);

    }

    render() {
        const {designUpdate, userRole, userContext, viewOptions} = this.props;

        // Active if this design update is the current context design update
        let active = designUpdate._id === userContext.designUpdateId;

        // Display as selected if this is the current DU in the user context
        let itemStyle = (active ? 'design-item di-active' : 'design-item');

        // Items -------------------------------------------------------------------------------------------------------

        const header =
            <DesignItemHeader
                currentItemType={ItemType.DESIGN_UPDATE}
                currentItemId={designUpdate._id}
                currentItemName={designUpdate.updateName}
                currentItemRef={designUpdate.updateReference}
                currentItemStatus={designUpdate.updateStatus}
                //onSelectItem={ () => this.setNewDesignUpdateActive(userContext, designUpdate) }
            />;

        const editButton = <Button id="butEdit" bsSize="xs" onClick={ () => this.onEditDesignUpdate(userRole, userContext, viewOptions, designUpdate)}>Edit</Button>;
        const deleteButton = <Button id="butDelete" bsSize="xs" onClick={ () => this.onDeleteDesignUpdate(userRole, userContext, designUpdate)}>Delete</Button>;
        const publishButton = <Button id="butPublish" bsSize="xs" onClick={ () => this.onPublishDesignUpdate(userRole, userContext, designUpdate)}>Publish</Button>;
        const withdrawButton = <Button id="butWithdraw" bsSize="xs" onClick={ () => this.onWithdrawDesignUpdate(userRole, userContext, designUpdate)}>Withdraw</Button>;
        const viewButton = <Button id="butView" bsSize="xs" onClick={ () => this.onViewDesignUpdate(userRole, userContext, viewOptions, designUpdate)}>View</Button>;
        //const refreshButton = <Button id="butRefresh" bsSize="xs" onClick={ () => this.onRefreshSummary(designUpdate)}>Refresh Summary</Button>;

        const mergeOptions =
            <div className="merge-options">
                <FormGroup id="mergeOptions">
                    <Radio inline id="optionMerge" checked={this.state.mergeAction === DesignUpdateMergeAction.MERGE_INCLUDE}
                           onChange={() => this.onMergeActionChange(userRole, designUpdate, DesignUpdateMergeAction.MERGE_INCLUDE)}>
                        {TextLookups.updateMergeActions(DesignUpdateMergeAction.MERGE_INCLUDE)}
                    </Radio>
                    <Radio inline id="optionRoll" checked={this.state.mergeAction === DesignUpdateMergeAction.MERGE_ROLL}
                           onChange={() => this.onMergeActionChange(userRole, designUpdate, DesignUpdateMergeAction.MERGE_ROLL)}>
                        {TextLookups.updateMergeActions(DesignUpdateMergeAction.MERGE_ROLL)}
                    </Radio>
                    <Radio inline id="optionIgnore" checked={this.state.mergeAction === DesignUpdateMergeAction.MERGE_IGNORE}
                           onChange={() => this.onMergeActionChange(userRole, designUpdate, DesignUpdateMergeAction.MERGE_IGNORE)}>
                        {TextLookups.updateMergeActions(DesignUpdateMergeAction.MERGE_IGNORE)}
                    </Radio>
                </FormGroup>
            </div>;

        // Layout ------------------------------------------------------------------------------------------------------

        let buttons = '';
        let options = '';
        let statusClass = 'design-item-status';

        switch(designUpdate.updateStatus){
            case DesignUpdateStatus.UPDATE_NEW:
                statusClass = 'design-item-status item-status-new';
                break;
            case DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT:
                statusClass = 'design-item-status item-status-draft';
                break;
            case DesignUpdateStatus.UPDATE_MERGED:
                statusClass = 'design-item-status item-status-complete';
                break;
            case DesignUpdateStatus.UPDATE_IGNORED:
                statusClass = 'design-item-status item-status-ignored';
                break;
        }

        const summary =
            <div id="designUpdateSummary" className={statusClass}>
                {designUpdate.updateReference + ' - ' + designUpdate.updateName}
            </div>;

        const status =
            <div id="designUpdateStatus" className={statusClass}>{designUpdate.updateStatus}</div>;

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

        if(active) {
            return (
                <div id="designUpdate" className={itemStyle}
                     onClick={ () => this.setNewDesignUpdateActive(userContext, designUpdate) }>
                    {status}
                    {header}
                    {options}
                    {buttons}
                </div>
            );
        } else {
            return (
                <div id="designUpdate" className={itemStyle}
                     onClick={ () => this.setNewDesignUpdateActive(userContext, designUpdate) }>
                    {summary}
                </div>
            );
        }
    }
}

DesignUpdate.propTypes = {
    designUpdate: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:                   state.currentUserRole,
        userContext:                state.currentUserItemContext,
        viewOptions:                state.currentUserViewOptions,
        testDataFlag:               state.testDataFlag,
        dvDataLoaded:               state.designVersionDataLoaded,
        testDataLoaded:             state.testIntegrationDataLoaded,
        summaryDataLoaded:          state.testSummaryDataLoaded,
        mashDataStale:              state.mashDataStale,
        testDataStale:              state.testDataStale
    }
}

// Default export including REDUX
export default connect(mapStateToProps)(DesignUpdate);