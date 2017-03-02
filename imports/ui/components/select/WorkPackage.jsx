// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import DesignItemHeader from './DesignItemHeader.jsx';

// Ultrawide Services
import ClientWorkPackageServices from '../../../apiClient/apiClientWorkPackage.js';
import {ItemType, WorkPackageStatus, WorkPackageType, RoleType} from '../../../constants/constants.js';

// Bootstrap
import {Button, ButtonGroup, FormGroup, Radio, Checkbox} from 'react-bootstrap';

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

    onDevelopWorkPackage(userRole, userContext, viewOptions, wp){

        ClientWorkPackageServices.developWorkPackage(
            userRole,
            userContext,
            viewOptions,
            wp._id,
            this.props.testDataFlag
        );
    };

    getAdopterName(userId){
        return ClientWorkPackageServices.getAdopterName(userId)
    }

    render() {
        const {workPackage, userRole, viewOptions, userContext} = this.props;

        // Display as selected if this is the current WP in the user context
        //console.log("Rendering WP " + workPackage._id + " Current WP is " + userContext.workPackageId);
        let itemStyle = (workPackage._id === userContext.workPackageId ? 'design-item di-active' : 'design-item');

        let buttons = '';
        let options = '';
        let adopter = <div></div>;

        switch(workPackage.workPackageStatus){
            case WorkPackageStatus.WP_NEW:
                if(userRole === RoleType.MANAGER){
                    // Managers can edit, delete or publish a new WP
                    buttons =
                        <ButtonGroup>
                            <Button id="butEdit" bsSize="xs" onClick={ () => this.onEditWorkPackage(userRole, userContext, workPackage)}>Edit</Button>
                            <Button id="butView" bsSize="xs" onClick={ () => this.onViewWorkPackage(userRole, userContext, workPackage)}>View</Button>
                            <Button id="butRemove" bsSize="xs" onClick={ () => this.onDeleteWorkPackage(userRole, userContext, workPackage)}>Remove</Button>
                            <Button id="butPublish" bsSize="xs" onClick={ () => this.onPublishWorkPackage(userRole, userContext, workPackage)}>Publish</Button>
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
                                <Button id="butView" bsSize="xs" onClick={ () => this.onViewWorkPackage(userRole, userContext, workPackage)}>View</Button>
                                <Button id="butAdopt" bsSize="xs" onClick={ () => this.onAdoptWorkPackage(userRole, userContext, workPackage)}>Adopt</Button>
                            </ButtonGroup>;

                        break;
                    case RoleType.MANAGER:

                        // Managers can view, edit or withdraw the WP
                        buttons =
                            <ButtonGroup>
                                <Button id="butEdit" bsSize="xs" onClick={ () => this.onEditWorkPackage(userRole, userContext, workPackage)}>Edit</Button>
                                <Button id="butView" bsSize="xs" onClick={ () => this.onViewWorkPackage(userRole, userContext, workPackage)}>View</Button>
                                <Button id="butWithdraw" bsSize="xs" onClick={ () => this.onWithdrawWorkPackage(userRole, userContext, workPackage)}>Withdraw</Button>
                            </ButtonGroup>;

                        break;
                    case RoleType.DESIGNER:
                        buttons =
                            <ButtonGroup className="button-group-left">
                                <Button id="butView" bsSize="xs" onClick={ () => this.onViewWorkPackage(userRole, userContext, workPackage)}>View</Button>
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
                                <Button id="butView" bsSize="xs" onClick={ () => this.onViewWorkPackage(userRole, userContext, workPackage)}>View</Button>
                                <Button id="butDevelop" bsSize="xs" onClick={ () => this.onDevelopWorkPackage(userRole, userContext, viewOptions, workPackage)}>Develop</Button>
                                <Button id="butRelease" bsSize="xs" onClick={ () => this.onReleaseWorkPackage(userRole, userContext, workPackage)}>Release</Button>
                            </ButtonGroup>;

                        break;
                    case RoleType.MANAGER:

                        // Managers can view or edit or release the WP
                        buttons =
                            <ButtonGroup>
                                <Button id="butEdit" bsSize="xs" onClick={ () => this.onEditWorkPackage(userRole, userContext, workPackage)}>Edit</Button>
                                <Button id="butView" bsSize="xs" onClick={ () => this.onViewWorkPackage(userRole, userContext, workPackage)}>View</Button>
                                <Button id="butRelease" bsSize="xs" onClick={ () => this.onReleaseWorkPackage(userRole, userContext, workPackage)}>Release</Button>
                            </ButtonGroup>;

                        break;
                    case RoleType.DESIGNER:
                        buttons =
                            <ButtonGroup className="button-group-left">
                                <Button id="butView" bsSize="xs" onClick={ () => this.onViewWorkPackage(userRole, userContext, workPackage)}>View</Button>
                            </ButtonGroup>;
                        break;
                }
                // Set up label to show who has adopted
                adopter = <div className="adopter">{'Adopted by ' + this.getAdopterName(workPackage.adoptingUserId)}</div>;

                break;
            case WorkPackageStatus.WP_COMPLETE:
                // View only for everyone
                buttons =
                    <ButtonGroup>
                        <Button id="butView" bsSize="xs" onClick={ () => this.onViewDesignUpdate(userRole, userContext, designUpdate)}>View</Button>
                    </ButtonGroup>;
                break;
        }

        return (
            <div className={itemStyle}>
                <DesignItemHeader
                    currentItemType={ItemType.WORK_PACKAGE}
                    currentItemId={workPackage._id}
                    currentItemName={workPackage.workPackageName}
                    currentItemRef=''
                    currentItemStatus={workPackage.workPackageStatus}
                    onSelectItem={ () => this.onSelectWorkPackage(userRole, userContext, workPackage) }
                />
                {adopter}
                {buttons}
            </div>
        );
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
        mashDataStale:          state.mashDataStale
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(WorkPackage);
