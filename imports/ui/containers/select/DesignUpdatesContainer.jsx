// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import DesignUpdate from '../../components/select/DesignUpdate.jsx';
import DesignComponentAdd from '../../components/common/DesignComponentAdd.jsx';
import UpdateSummaryContainer from './UpdateSummaryContainer.jsx';
import WorkPackagesContainer from './WorkPackagesContainer.jsx';

// Ultrawide Services
import {DesignVersionStatus, RoleType, WorkPackageType} from '../../../constants/constants.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';
import ClientDesignUpdateServices from '../../../apiClient/apiClientDesignUpdate.js';

// Bootstrap
import {Grid, Row, Col, Button, ButtonGroup} from 'react-bootstrap';
import {Panel} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Update Data Container - gets data for Design Updates in a Design Version
//
// ---------------------------------------------------------------------------------------------------------------------


// Work selection screen
class DesignUpdatesList extends Component {
    constructor(props) {
        super(props);

    }

    renderDesignUpdatesList(designUpdates){

        console.log("rendering design updates list with " + designUpdates);

        if(designUpdates.length > 0) {
            return designUpdates.map((designUpdate) => {
                return (
                    <DesignUpdate
                        key={designUpdate._id}
                        designUpdate={designUpdate}
                    />
                );
            });
        } else {
            return(
                <div className="design-item-note">No Design Updates</div>
            )
        }
    }

    addDesignUpdate(userRole, designVersionId){
        // Adds a new update and populates a set of design update components for editing
        ClientDesignUpdateServices.addNewDesignUpdate(userRole, designVersionId)
    }

    onDevelopDesignUpdates(){

    }

    render() {

        const {designUpdates, designVersionStatus, userRole, userContext} = this.props;

        let updatesPanelContent = <div className="design-item-note">Select a Design Version</div>;

        // The content depends on what sort of Design Version has been selected
        if(designVersionStatus) {
            switch (designVersionStatus) {
                case DesignVersionStatus.VERSION_NEW:
                case DesignVersionStatus.VERSION_DRAFT:
                case DesignVersionStatus.VERSION_DRAFT_COMPLETE:

                    // No Updates.  Just show the Work Packages
                    return (
                        <Grid>
                            <Row>
                                <Col md={6} className="scroll-col">
                                    <WorkPackagesContainer params={{
                                        wpType: WorkPackageType.WP_BASE,
                                        designVersionId: userContext.designVersionId,
                                        designUpdateId: userContext.designUpdateId
                                    }}/>
                                </Col>
                            </Row>
                        </Grid>
                    );
                    break;
                case DesignVersionStatus.VERSION_UPDATABLE:
                case DesignVersionStatus.VERSION_UPDATABLE_COMPLETE:

                    // These versions can have or have had Design Updates
                    if (userRole != RoleType.DESIGNER) {
                        // Developers and Managers can't add design updates
                        updatesPanelContent =
                            <div>
                                {this.renderDesignUpdatesList(designUpdates)}
                            </div>;
                    } else {
                        // Design updates may be added
                        updatesPanelContent =
                            <div>
                                {this.renderDesignUpdatesList(designUpdates)}
                                <div className="design-item-add">
                                    <DesignComponentAdd
                                        addText="Add Design Update"
                                        onClick={ () => this.addDesignUpdate(userRole, userContext.designVersionId)}
                                    />
                                </div>
                            </div>;
                    }

                    return (
                        <Grid>
                            <Row>
                                <Col md={3} className="scroll-col">
                                    <Panel header="Design Updates">
                                        {updatesPanelContent}
                                    </Panel>
                                </Col>
                                <Col md={3} className="scroll-col">
                                    <WorkPackagesContainer params={{
                                        wpType: WorkPackageType.WP_UPDATE,
                                        designVersionId: userContext.designVersionId,
                                        designUpdateId: userContext.designUpdateId
                                    }}/>
                                </Col>
                                <Col md={6} className="scroll-col">
                                    <UpdateSummaryContainer params={{
                                        designUpdateId: userContext.designUpdateId
                                    }}/>
                                </Col>
                            </Row>
                        </Grid>
                    );
                    break;
                default:
                    console.log("UNKNOWN Design Version Status: " + designVersionStatus)
            }
        } else {
            // No version selected as yet
            return (
                <Grid>
                    <Row>
                        <Col md={6} className="col">
                            <Panel header="Design Version Data">
                                {updatesPanelContent}
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
            );
        }

    }
}

DesignUpdatesList.propTypes = {
    designUpdates: PropTypes.array.isRequired,
    designVersionStatus: PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole: state.currentUserRole,
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DesignUpdatesList = connect(mapStateToProps)(DesignUpdatesList);


export default DesignUpdatesContainer = createContainer(({params}) => {

    return ClientContainerServices.getDesignUpdatesForCurrentDesignVersion(params.currentDesignVersionId);

}, DesignUpdatesList);