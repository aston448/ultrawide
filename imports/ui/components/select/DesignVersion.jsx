
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import DesignItemHeader from './DesignItemHeader.jsx';

// Ultrawide Services
import ClientDesignVersionServices from '../../../apiClient/apiClientDesignVersion.js';
import {RoleType, DesignVersionStatus, ItemType, ViewType, ViewMode} from '../../../constants/constants.js';

// Bootstrap
import {Button, ButtonGroup} from 'react-bootstrap';

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
    }

    onEditDesignVersion(userRole, viewOptions, userContext, dv, testDataFlag){

        ClientDesignVersionServices.editDesignVersion(
            userRole,
            viewOptions,
            userContext,
            dv._id,
            testDataFlag,
            this.props.mashDataStale
        );
    }

    onViewDesignVersion(userRole, viewOptions, userContext, dv, testDataFlag){

        ClientDesignVersionServices.viewDesignVersion(
            userRole,
            viewOptions,
            userContext,
            dv,
            testDataFlag,
            this.props.mashDataStale
        );
    }

    onAdoptDesignVersion(userContext, dv){

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

    onUpdateWorkingDesignVersion(userRole, userContext, dv){

        ClientDesignVersionServices.updateWorkingDesignVersion(
            userRole,
            userContext,
            dv._id
        );
    }

    onCreateNextDesignVersion(userRole, userContext, dv){

        ClientDesignVersionServices.createNextDesignVersion(
            userRole,
            userContext,
            dv._id
        );
    }

    setNewDesignVersionActive(userContext, dv){

        // Changing the design version updates the user context
        ClientDesignVersionServices.setDesignVersion(
            userContext,
            dv._id
        );

    }

    render() {
        const {designVersion, userRole, viewOptions, userContext, testDataFlag} = this.props;

        let itemStyle = (designVersion._id === userContext.designVersionId ? 'design-item di-active' : 'design-item');

        // What choices are available depend on the current stste of the design version
        let buttons = '';


        // Designers can add / edit stuff
        switch (designVersion.designVersionStatus) {
            case DesignVersionStatus.VERSION_NEW:

                if(userRole === RoleType.DESIGNER){
                    // Designers can Edit View or Publish
                    buttons =
                        <ButtonGroup>
                            <Button id="butEdit" bsSize="xs" onClick={ () => this.onEditDesignVersion(userRole, viewOptions, userContext, designVersion, testDataFlag)}>Edit</Button>
                            <Button id="butView" bsSize="xs" onClick={ () => this.onViewDesignVersion(userRole, viewOptions, userContext, designVersion, testDataFlag)}>View</Button>
                            <Button id="butPublish" bsSize="xs" onClick={ () => this.onPublishDesignVersion(userRole, userContext, designVersion)}>Publish</Button>
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
                            <ButtonGroup>
                                <Button id="butView" bsSize="xs" onClick={ () => this.onViewDesignVersion(userRole, viewOptions, userContext, designVersion, testDataFlag)}>View</Button>
                                <Button id="butEdit" bsSize="xs" onClick={ () => this.onEditDesignVersion(userRole, viewOptions, userContext, designVersion, testDataFlag)}>Edit</Button>
                                <Button id="butWithdraw" bsSize="xs" onClick={ () => this.onWithdrawDesignVersion(userRole, userContext, designVersion)}>Withdraw</Button>
                                <Button id="butCreateNext" bsSize="xs" onClick={ () => this.onCreateNextDesignVersion(userRole, userContext, designVersion)}>Create Next Design Version</Button>
                            </ButtonGroup>;
                        break;
                    case  RoleType.DEVELOPER:
                        //TODO - Change all this
                        // Developers can view or adopt a draft design
                        buttons =
                            <div>
                                <ButtonGroup className="button-group-left">
                                    <Button id="butView" bsSize="xs" onClick={ () => this.onViewDesignVersion(userRole, viewOptions, userContext, designVersion, testDataFlag)}>View</Button>
                                </ButtonGroup>
                            </div>;
                            break;
                    case  RoleType.MANAGER:
                        // Managers can view a draft design
                        buttons =
                            <div>
                                <ButtonGroup className="button-group-left">
                                    <Button id="butView" bsSize="xs" onClick={ () => this.onViewDesignVersion(userRole, viewOptions, userContext, designVersion, testDataFlag)}>View</Button>
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
                                <ButtonGroup>
                                    <Button id="butView" bsSize="xs" onClick={ () => this.onViewDesignVersion(userRole, viewOptions, userContext, designVersion, testDataFlag)}>View</Button>
                                </ButtonGroup>
                                <ButtonGroup>
                                    <Button id="butUpdate" bsSize="xs" onClick={ () => this.onUpdateWorkingDesignVersion(userRole, userContext, designVersion)}>Update this Design Version</Button>
                                </ButtonGroup>
                                <ButtonGroup>
                                    <Button id="butCreateNext" bsSize="xs" onClick={ () => this.onCreateNextDesignVersion(userRole, userContext, designVersion)}>Create Next Design Version</Button>
                                </ButtonGroup>
                            </div>;
                        break;
                    case RoleType.DEVELOPER:
                        buttons =
                            <div>
                                <ButtonGroup>
                                    <Button id="butView" bsSize="xs" onClick={ () => this.onViewDesignVersion(userRole, viewOptions, userContext, designVersion, testDataFlag)}>View</Button>
                                </ButtonGroup>
                                <ButtonGroup>
                                    <Button id="butUpdate" bsSize="xs" onClick={ () => this.onUpdateWorkingDesignVersion(userRole, userContext, designVersion)}>Update this Design Version</Button>
                                </ButtonGroup>
                            </div>;
                        break;
                    case RoleType.MANAGER:
                        buttons =
                            <ButtonGroup>
                                <Button id="butView" bsSize="xs" onClick={ () => this.onViewDesignVersion(userRole, viewOptions, userContext, designVersion)}>View</Button>
                            </ButtonGroup>;
                        break;
                }
                break;
            case DesignVersionStatus.VERSION_DRAFT_COMPLETE:
            case DesignVersionStatus.VERSION_UPDATABLE_COMPLETE:
                // View only
                buttons =
                    <ButtonGroup>
                        <Button id="butView" bsSize="xs" onClick={ () => this.onViewDesignVersion(userRole, viewOptions, userContext, designVersion)}>View</Button>
                    </ButtonGroup>;
                break;

            default:
                console.log("Unknown Design Version Status: " + designVersion.designVersionStatus)

        }


        return (
            <div className={itemStyle}>
                <DesignItemHeader
                    currentItemType={ItemType.DESIGN_VERSION}
                    currentItemId={designVersion._id}
                    currentItemName={designVersion.designVersionName}
                    currentItemVersion={designVersion.designVersionNumber}
                    currentItemStatus={designVersion.designVersionStatus}
                    onSelectItem={ () => this.setNewDesignVersionActive(userContext, designVersion)}
                />
                {buttons}
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
        mashDataStale:              state.mashDataStale
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(DesignVersion);

