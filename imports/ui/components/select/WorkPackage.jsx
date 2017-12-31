// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import DesignItemHeader             from './DesignItemHeader.jsx';

// Ultrawide Services
import ClientWorkPackageServices    from '../../../apiClient/apiClientWorkPackage.js';

import {ItemType, WorkPackageStatus, WorkPackageTestStatus, RoleType} from '../../../constants/constants.js';

// Bootstrap
import {Button, ButtonGroup} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Work Package Component - Graphically represents one Work Package that belongs to one Design Version or Design Update
//
// ---------------------------------------------------------------------------------------------------------------------

export class WorkPackage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adopted: false,
        };
    }

    componentDidMount(){
        //this.setState({adopted: this.getUpdateAdoptionStatus(this.props.currentUserDevContext, this.props.designUpdate)});
    }

    onEditWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.editWorkPackage(
            userRole,
            userContext,
            wp._id,
            wp.workPackageType
        );
    };

    onViewWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.viewWorkPackage(
            userRole,
            userContext,
            wp._id,
            wp.workPackageType
        );
    }

    onDeleteWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.removeWorkPackage(
            userRole,
            userContext,
            wp._id
        );
    };

    onPublishWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.publishWorkPackage(
            userRole,
            userContext,
            wp._id
        );
    };

    onWithdrawWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.withdrawWorkPackage(
            userRole,
            userContext,
            wp._id
        );
    };

    onAdoptWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.adoptWorkPackage(
            userRole,
            userContext,
            wp._id
        );
    };

    onReleaseWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.releaseWorkPackage(
            userRole,
            userContext,
            wp._id
        );
    };

    onSelectWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.selectWorkPackage(
            userRole,
            userContext,
            wp
        );
    };

    onDevelopWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.developWorkPackage(
            userRole,
            userContext,
            wp._id
        );
    };

    getAdopterName(userId){
        return ClientWorkPackageServices.getAdopterName(userId)
    }

    render() {

        const {workPackage, userRole, viewOptions, userContext} = this.props;

        // Items -------------------------------------------------------------------------------------------------------

        // Active if this work package is the current context work package
        let active = workPackage._id === userContext.workPackageId;
        let activeUpdate = (workPackage.designUpdateId !== 'NONE' && workPackage.designUpdateId === userContext.designUpdateId)

        let itemStyle = (active ? 'design-item di-active' : 'design-item');

        if(activeUpdate){
            itemStyle += ' di-highlight';
        }

        let buttons = '';
        let options = '';
        let adopter = '';

        let statusClass = 'design-item-status';

        switch(workPackage.workPackageStatus){
            case WorkPackageStatus.WP_NEW:
                statusClass = 'design-item-status item-status-new';
                break;
            case WorkPackageStatus.WP_AVAILABLE:
                statusClass = 'design-item-status item-status-available';
                break;
            case WorkPackageStatus.WP_ADOPTED:
                statusClass = 'design-item-status item-status-adopted';
                // Set up label to show who has adopted
                adopter = ' by ' + this.getAdopterName(workPackage.adoptingUserId);
                break;
        }

        // Highlight tests complete WPs
        if(workPackage.workPackageTestStatus === WorkPackageTestStatus.WP_TESTS_COMPLETE){
            statusClass = 'design-item-status item-status-complete';
        }

        const summary =
            <div id="workPackageSummary" className={statusClass}>
                {workPackage.workPackageName}
            </div>;

        const status =
            <div className={statusClass}>{workPackage.workPackageStatus + adopter}</div>;

        const header =
            <DesignItemHeader
                currentItemType={ItemType.WORK_PACKAGE}
                currentItemId={workPackage._id}
                currentItemName={workPackage.workPackageName}
                currentItemRef=''
                currentItemLink={workPackage.workPackageLink}
                currentItemStatus={workPackage.workPackageStatus}
                //onSelectItem={ () => this.onSelectWorkPackage(userRole, userContext, workPackage) }
            />;

        const buttonEdit =
            <Button id="butEdit" bsSize="xs" onClick={ () => this.onEditWorkPackage(userRole, userContext, workPackage)}>Edit</Button>;

        const buttonView =
            <Button id="butView" bsSize="xs" onClick={ () => this.onViewWorkPackage(userRole, userContext, workPackage)}>View</Button>;

        const buttonRemove =
            <Button id="butRemove" bsSize="xs" onClick={ () => this.onDeleteWorkPackage(userRole, userContext, workPackage)}>Remove</Button>;

        const buttonPublish =
            <Button id="butPublish" bsSize="xs" onClick={ () => this.onPublishWorkPackage(userRole, userContext, workPackage)}>Publish</Button>;

        const buttonWithdraw =
            <Button id="butWithdraw" bsSize="xs" onClick={ () => this.onWithdrawWorkPackage(userRole, userContext, workPackage)}>Withdraw</Button>;

        const buttonAdopt =
            <Button id="butAdopt" bsSize="xs" onClick={ () => this.onAdoptWorkPackage(userRole, userContext, workPackage)}>Adopt</Button>;

        const buttonRelease =
            <Button id="butRelease" bsSize="xs" onClick={ () => this.onReleaseWorkPackage(userRole, userContext, workPackage)}>Release</Button>;

        const buttonDevelop =
            <Button id="butDevelop" bsSize="xs" onClick={ () => this.onDevelopWorkPackage(userRole, userContext, workPackage)}>Develop</Button>;


        // Layout ------------------------------------------------------------------------------------------------------

        switch(workPackage.workPackageStatus){
            case WorkPackageStatus.WP_NEW:
                if(userRole === RoleType.MANAGER){
                    // Managers can edit, delete or publish a new WP
                    buttons =
                        <ButtonGroup className="button-group-left">
                            {buttonEdit}
                            {buttonView}
                            {buttonRemove}
                            {buttonPublish}
                        </ButtonGroup>;
                } else {
                    // Developers and Designers can't do anything with WPs until published
                    buttons = <div></div>;
                }
                break;
            case WorkPackageStatus.WP_AVAILABLE:
                switch(userRole) {
                    case RoleType.DEVELOPER:

                        // Developers can view or adopt a WP
                        buttons =
                            <ButtonGroup className="button-group-left">
                                {buttonView}
                                {buttonAdopt}
                            </ButtonGroup>;

                        break;
                    case RoleType.MANAGER:

                        // Managers can view, edit or withdraw the WP
                        buttons =
                            <ButtonGroup className="button-group-left">
                                {buttonEdit}
                                {buttonView}
                                {buttonWithdraw}
                            </ButtonGroup>;

                        break;
                    case RoleType.DESIGNER:
                        buttons =
                            <ButtonGroup className="button-group-left">
                                {buttonView}
                            </ButtonGroup>;
                        break;
                }
                break;
            case WorkPackageStatus.WP_ADOPTED:
                switch(userRole) {
                    case RoleType.DEVELOPER:

                        // Developers can view or develop / release  a WP if adopted by them
                        buttons =
                            <ButtonGroup className="button-group-left">
                                {buttonView}
                                {buttonDevelop}
                                {buttonRelease}
                            </ButtonGroup>;

                        break;
                    case RoleType.MANAGER:

                        // Managers can view or edit or release the WP
                        buttons =
                            <ButtonGroup className="button-group-left">
                                {buttonEdit}
                                {buttonView}
                                {buttonRelease}
                            </ButtonGroup>;

                        break;
                    case RoleType.DESIGNER:
                        buttons =
                            <ButtonGroup className="button-group-left">
                                {buttonView}
                            </ButtonGroup>;
                        break;
                }

                break;
        }

        if(active) {
            return (
                <div id="workPackageItem" className={itemStyle}
                     onClick={() => this.onSelectWorkPackage(userRole, userContext, workPackage)}>
                    {status}
                    {header}
                    {buttons}
                </div>
            );
        } else {
            return (
                <div id="workPackageItem" className={itemStyle}
                     onClick={() => this.onSelectWorkPackage(userRole, userContext, workPackage)}>
                    {summary}
                </div>
            );
        }
    }
}

WorkPackage.propTypes = {
    workPackage: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:               state.currentUserRole,
        viewOptions:            state.currentUserViewOptions,
        userContext:            state.currentUserItemContext,
        testDataFlag:           state.testDataFlag,
        dvDataLoaded:           state.designVersionDataLoaded,
        testDataLoaded:         state.testIntegrationDataLoaded,
        summaryDataLoaded:      state.testSummaryDataLoaded,
        mashDataStale:          state.mashDataStale,
        testDataStale:          state.testDataStale
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(WorkPackage);
