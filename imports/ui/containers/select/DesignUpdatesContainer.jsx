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
import {DesignVersionStatus, RoleType, WorkPackageType, LogLevel} from '../../../constants/constants.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';
import ClientDesignUpdateServices from '../../../apiClient/apiClientDesignUpdate.js';
import { log } from '../../../common/utils.js';

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


// Unit test export
export class DesignUpdatesList extends Component {
    constructor(props) {
        super(props);

    }

    renderDesignUpdatesList(designUpdates){

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

    onAddDesignUpdate(userRole, designVersionId){
        // Adds a new update and populates a set of design update components for editing
        ClientDesignUpdateServices.addNewDesignUpdate(userRole, designVersionId)
    }

    render() {

        const {designUpdates, designVersionStatus, userRole, userContext} = this.props;

        // Elements ----------------------------------------------------------------------------------------------------

        let updatesPanelContent = <div className="design-item-note">Select a Design Version</div>;

        // Add Design Update
        const addUpdate =
            <div id="addUpdate" className="design-item-add">
                <DesignComponentAdd
                    addText="Add Design Update"
                    onClick={ () => this.onAddDesignUpdate(userRole, userContext.designVersionId)}
                />
            </div>;

        // Initial Design Work Packages List
        const baseWorkPackages =
            <div id="baseWps">
                <WorkPackagesContainer params={{
                    wpType: WorkPackageType.WP_BASE,
                    designVersionId: userContext.designVersionId,
                    designUpdateId: userContext.designUpdateId
                }}/>
            </div>;

        // Design Update Work Packages List
        const updateWorkPackages =
            <div id="updateWps">
                <WorkPackagesContainer params={{
                    wpType: WorkPackageType.WP_UPDATE,
                    designVersionId: userContext.designVersionId,
                    designUpdateId: userContext.designUpdateId
                }}/>
            </div>;

        // Design Update Summary
        const updateSummary =
              <div id="updateSummary">
                  <UpdateSummaryContainer params={{
                      designUpdateId: userContext.designUpdateId
                  }}/>
              </div>;


        // Layout ------------------------------------------------------------------------------------------------------

        // Default layout if no data
        let layout =
            <Grid>
                <Row>
                    <Col md={6} className="col">
                        <Panel header="Design Version Data">
                            {updatesPanelContent}
                        </Panel>
                    </Col>
                </Row>
            </Grid>;

        // The content depends on what sort of Design Version has been selected
        if(designVersionStatus) {

            switch (designVersionStatus) {
                case DesignVersionStatus.VERSION_NEW:
                case DesignVersionStatus.VERSION_DRAFT:
                case DesignVersionStatus.VERSION_DRAFT_COMPLETE:

                    // No Updates.  Just show the Work Packages
                    layout =
                        <Grid>
                            <Row>
                                <Col md={6} className="scroll-col">
                                    {baseWorkPackages}
                                </Col>
                            </Row>
                        </Grid>;
                    break;

                case DesignVersionStatus.VERSION_UPDATABLE:

                    // These versions can have or have had Design Updates
                    if (userRole != RoleType.DESIGNER) {

                        // Developers and Managers can't add design updates
                        updatesPanelContent =
                            <Panel header="Design Updates">
                                {this.renderDesignUpdatesList(designUpdates)}
                            </Panel>;
                    } else {
                        // Design updates may be added
                        updatesPanelContent =
                            <Panel header="Design Updates">
                                {this.renderDesignUpdatesList(designUpdates)}
                                {addUpdate}
                            </Panel>;
                    }

                    layout =
                        <Grid>
                            <Row>
                                <Col md={3} className="scroll-col">
                                    {updatesPanelContent}
                                </Col>
                                <Col md={3} className="scroll-col">
                                    {updateWorkPackages}
                                </Col>
                                <Col md={6}>
                                    {updateSummary}
                                </Col>
                            </Row>
                        </Grid>;

                    break;

                case DesignVersionStatus.VERSION_UPDATABLE_COMPLETE:

                    // Nobody can add updates - just show what there are
                    updatesPanelContent =
                        <Panel header="Design Updates">
                            {this.renderDesignUpdatesList(designUpdates)}
                        </Panel>;

                    layout =
                        <Grid>
                            <Row>
                                <Col md={3} className="scroll-col">
                                    {updatesPanelContent}
                                </Col>
                                <Col md={3} className="scroll-col">
                                    {updateWorkPackages}
                                </Col>
                                <Col md={6}>
                                    {updateSummary}
                                </Col>
                            </Row>
                        </Grid>;

                    break;
                default:
                    log((msg) => console.log(msg), LogLevel.ERROR, "Unknown Design Version Status: {}", designVersionStatus);
            }
        }

        return (
            layout
        );
    }
}

DesignUpdatesList.propTypes = {
    designUpdates: PropTypes.array.isRequired,
    designVersionStatus: PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:       state.currentUserRole,
        userContext:    state.currentUserItemContext
    }
}

// Default export including REDUX
export default DesignUpdatesContainer = createContainer(({params}) => {

    return ClientContainerServices.getDesignUpdatesForCurrentDesignVersion(params.currentDesignVersionId);

}, connect(mapStateToProps)(DesignUpdatesList));