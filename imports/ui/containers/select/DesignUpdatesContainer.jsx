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

    renderDesignUpdatesList(){
        return this.props.designUpdates.map((designUpdate) => {
            return (
                <DesignUpdate
                    key={designUpdate._id}
                    designUpdate={designUpdate}
                />
            );
        });
    }

    addDesignUpdate(userRole, designVersionId){
        // Adds a new update and populates a set of design update components for editing
        ClientDesignUpdateServices.addNewDesignUpdate(userRole, designVersionId)
    }

    onDevelopDesignUpdates(){

    }

    render() {

        const {designUpdates, designVersionStatus, userRole, userContext} = this.props;

        let panelContent = <div></div>;
        // let developerButtons = <div></div>;

        // if(designUpdates.length > 0){
        //     developerButtons =
        //         <ButtonGroup>
        //             <Button bsSize="xs" onClick={ () => this.onDevelopDesignUpdates()}>Develop Selected Updates</Button>
        //         </ButtonGroup>
        // }

        // When a design version is selected...
        if(userContext.designVersionId){
            switch(designVersionStatus){
                case DesignVersionStatus.VERSION_NEW:
                    // No design updates available and none can be added...
                    if(userRole === RoleType.DEVELOPER){
                        panelContent =
                            <div className="design-item-note">No Updates Yet</div>;
                    } else {
                        panelContent =
                            <div className="design-item-note">Updates may only be added to a Draft design version...</div>;
                    }
                    break;
                case DesignVersionStatus.VERSION_PUBLISHED_DRAFT:
                    if(userRole != RoleType.DESIGNER){
                        // Developers and Managers can't add design updates
                        panelContent =
                            <div>
                                {this.renderDesignUpdatesList()}
                                {/*<div className="design-item-button">*/}
                                    {/*{developerButtons}*/}
                                {/*</div>*/}
                            </div>;
                    } else {
                        // Design updates may be added
                        panelContent =
                            <div>
                                {this.renderDesignUpdatesList()}
                                <div className="design-item-add">
                                    <DesignComponentAdd
                                        addText="Add Design Update"
                                        onClick={ () => this.addDesignUpdate(userRole, userContext.designVersionId)}
                                    />
                                </div>
                            </div>;
                    }
                    break;
                case DesignVersionStatus.VERSION_PUBLISHED_COMPLETE:
                    // Design updates may be viewed only
                    panelContent =
                        <div>
                            {this.renderDesignUpdatesList()}
                        </div>;
                    break;
            }
        }

        if(userRole === RoleType.MANAGER){
            // Additional Work Package Column
            return (
                <Grid>
                    <Row>
                        <Col md={3} className="col">
                            <Panel header="Design Updates">
                                {panelContent}
                            </Panel>
                        </Col>
                        <Col md={4} className="col">
                            <WorkPackagesContainer params={{
                                wpType: WorkPackageType.WP_UPDATE,
                                designVersionId: userContext.designVersionId,
                                designUpdateId: userContext.designUpdateId
                            }}/>
                        </Col>
                        <Col md={5} className="col">
                            <UpdateSummaryContainer params = {{
                                designUpdateId: userContext.designUpdateId
                            }}/>
                        </Col>
                    </Row>
                </Grid>
            );
        } else {
            return (
                <Grid>
                    <Row>
                        <Col md={4} className="col">
                            <Panel header="Design Updates">
                                {panelContent}
                            </Panel>
                        </Col>
                        <Col md={8} className="col">
                            <UpdateSummaryContainer params = {{
                                designUpdateId: userContext.designUpdateId
                            }}/>
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