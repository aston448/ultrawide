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

class DesignUpdate extends Component {
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

    onRefreshSummary(du){

        ClientDesignUpdateServices.refreshSummary(du._id);
    }

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

        // Display as selected if this is the current DU in the user context
        let itemStyle = (designUpdate._id === userContext.designUpdateId ? 'design-item di-active' : 'design-item');

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
                        // Designers can edit, delete or publish a new update
                        buttons =
                            <ButtonGroup>
                                <Button bsSize="xs" onClick={ () => this.onEditDesignUpdate(userRole, userContext, viewOptions, designUpdate)}>Edit</Button>
                                <Button bsSize="xs" onClick={ () => this.onDeleteDesignUpdate(userRole, userContext, designUpdate)}>Delete</Button>
                                <Button bsSize="xs" onClick={ () => this.onPublishDesignUpdate(userRole, userContext, designUpdate)}>Publish</Button>
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
                                <Button bsSize="xs" onClick={ () => this.onViewDesignUpdate(userRole, userContext, viewOptions, designUpdate)}>View</Button>
                                <Button bsSize="xs" onClick={ () => this.onRefreshSummary(designUpdate)}>Refresh Summary</Button>
                            </ButtonGroup>
                        </div>;
                        break;
                    case RoleType.DESIGNER:
                    // Designers can view, edit or withdraw the update or specify how it is to be merged into the next Design Version
                    buttons =
                        <ButtonGroup>
                            <Button bsSize="xs" onClick={ () => this.onEditDesignUpdate(userRole, userContext, viewOptions, designUpdate)}>Edit</Button>
                            <Button bsSize="xs" onClick={ () => this.onViewDesignUpdate(userRole, userContext, viewOptions, designUpdate)}>View</Button>
                            <Button bsSize="xs" onClick={ () => this.onWithdrawDesignUpdate(userRole, userContext, designUpdate)}>Withdraw</Button>
                            <Button bsSize="xs" onClick={ () => this.onRefreshSummary(designUpdate)}>Refresh Summary</Button>
                        </ButtonGroup>;
                    options =
                        <FormGroup>
                            <Radio checked={this.state.mergeAction === DesignUpdateMergeAction.MERGE_INCLUDE}
                                   onChange={() => this.onMergeActionChange(userRole, designUpdate, DesignUpdateMergeAction.MERGE_INCLUDE)}>
                                {TextLookups.updateMergeActions(DesignUpdateMergeAction.MERGE_INCLUDE)}
                            </Radio>
                            <Radio checked={this.state.mergeAction === DesignUpdateMergeAction.MERGE_ROLL}
                                   onChange={() => this.onMergeActionChange(userRole, designUpdate, DesignUpdateMergeAction.MERGE_ROLL)}>
                                {TextLookups.updateMergeActions(DesignUpdateMergeAction.MERGE_ROLL)}
                            </Radio>
                            <Radio checked={this.state.mergeAction === DesignUpdateMergeAction.MERGE_IGNORE}
                                   onChange={() => this.onMergeActionChange(userRole, designUpdate, DesignUpdateMergeAction.MERGE_IGNORE)}>
                                {TextLookups.updateMergeActions(DesignUpdateMergeAction.MERGE_IGNORE)}
                            </Radio>
                        </FormGroup>;
                        break;
                    case RoleType.MANAGER:
                        // Managers can just view or refresh the summary
                        buttons =
                            <div>
                                <ButtonGroup className="button-group-left">
                                    <Button bsSize="xs" onClick={ () => this.onViewDesignUpdate(userRole, userContext, viewOptions, designUpdate)}>View</Button>
                                    <Button bsSize="xs" onClick={ () => this.onRefreshSummary(designUpdate)}>Refresh Summary</Button>
                                </ButtonGroup>
                            </div>;
                        break;
                }
                break;
            case DesignUpdateStatus.UPDATE_MERGED:
                // View only for everyone
                buttons =
                    <ButtonGroup>
                        <Button bsSize="xs" onClick={ () => this.onViewDesignUpdate(userRole, userContext, viewOptions, designUpdate)}>View</Button>
                    </ButtonGroup>;
                break;
        }

        return (
            <div className={itemStyle}>
                <DesignItemHeader
                    currentItemType={ItemType.DESIGN_UPDATE}
                    currentItemId={designUpdate._id}
                    currentItemName={designUpdate.updateName}
                    currentItemRef={designUpdate.updateReference}
                    currentItemStatus={designUpdate.updateStatus}
                    onSelectItem={ () => this.setNewDesignUpdateActive(userContext, designUpdate) }
                />
                {options}
                {buttons}
            </div>
        )
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

// Connect the Redux store to this component ensuring that its required state is mapped to props
DesignUpdate = connect(mapStateToProps)(DesignUpdate);

export default DesignUpdate;