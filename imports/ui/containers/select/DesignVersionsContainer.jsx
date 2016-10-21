// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import DesignVersion from '../../components/select/DesignVersion.jsx';
import DesignUpdatesContainer from './DesignUpdatesContainer.jsx';
import WorkPackagesContainer from './WorkPackagesContainer.jsx';

// Ultrawide Services
import {RoleType, WorkPackageType} from '../../../constants/constants.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {Panel} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Version Data Container - selects the Design Versions in the current Design
//
// ---------------------------------------------------------------------------------------------------------------------


class DesignVersionsList extends Component {
    constructor(props) {
        super(props);

    }

    renderDesignVersionsList(designVersions){
        if (designVersions) {
            return designVersions.map((designVersion) => {
                return (
                    <DesignVersion
                        key={designVersion._id}
                        designVersion={designVersion}
                    />
                );
            });
        }

    }

    render() {

        // There is no Add Design Version.  One is created by default for a new Design and when Updates are merged into a new Design Version.

        const {designVersions, userRole, currentUserItemContext} = this.props;

        switch(userRole){
            case RoleType.DESIGNER:

                // Designers see the Designs and the Updates and can change them
                return (
                    <Grid>
                        <Row>
                            <Col md={3} className="col">
                                <Panel header="Design Versions">
                                    {this.renderDesignVersionsList(designVersions)}
                                </Panel>
                            </Col>
                            <Col md={9} className="col">
                                <DesignUpdatesContainer params={{
                                    currentDesignVersionId: currentUserItemContext.designVersionId
                                }}/>
                            </Col>
                        </Row>
                    </Grid>
                );

                break;
            case RoleType.DEVELOPER:
            case RoleType.MANAGER:
                // Developers and Managers see Work Packages too
                return (
                    <Grid>
                        <Row>
                            <Col md={2} className="col">
                                <Panel header="Design Versions">
                                    {this.renderDesignVersionsList(designVersions)}
                                </Panel>
                            </Col>
                            <Col md={3} className="col">
                                <WorkPackagesContainer params={{
                                    wpType: WorkPackageType.WP_BASE,
                                    designVersionId: currentUserItemContext.designVersionId,
                                    designUpdateId: 'NONE'
                                }}/>
                            </Col>
                            <Col md={7} className="col">
                                <DesignUpdatesContainer params={{
                                    currentDesignVersionId: currentUserItemContext.designVersionId
                                }}/>
                            </Col>
                        </Row>
                    </Grid>
                );

        }

    }
}

DesignVersionsList.propTypes = {
    designVersions: PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole: state.currentUserRole,
        currentUserItemContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DesignVersionsList = connect(mapStateToProps)(DesignVersionsList);


export default DesignVersionsContainer = createContainer(({params}) => {

    return ClientContainerServices.getDesignVersionsForCurrentDesign(params.currentDesignId);

}, DesignVersionsList);