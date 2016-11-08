// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import RoleSelect                           from  './RoleSelect.jsx';
import LocationInput                        from  './LocationInput.jsx';

// Ultrawide Services
import {RoleType, LocationType, ViewType} from '../../../constants/constants.js'

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// User Configuration Component - Allows change of role (if authorised) and set up of file locations
//
// ---------------------------------------------------------------------------------------------------------------------


// App Body component - represents all the design content
class UserConfiguration extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {user, userRole, userContext} = this.props;

        const designerActive = user.isDesigner;
        const developerActive = user.isDeveloper;
        const managerActive = user.isManager;

        return (
            <Grid>
                <Row>
                    <Col md={4}>
                        <RoleSelect
                            type={RoleType.DESIGNER}
                            active={designerActive}
                        />
                    </Col>
                    <Col md={4}>
                        <RoleSelect
                            type={RoleType.DEVELOPER}
                            active={developerActive}
                        />
                    </Col>
                    <Col md={4}>
                        <RoleSelect
                            type={RoleType.MANAGER}
                            active={managerActive}
                        />
                    </Col>
                </Row>
                {/*<Row>*/}
                    {/*<LocationInput*/}
                        {/*type={LocationType.LOCATION_FEATURE_FILES}*/}
                    {/*/>*/}
                {/*</Row>*/}
                {/*<Row>*/}
                    {/*<LocationInput*/}
                        {/*type={LocationType.LOCATION_FEATURE_TEST_OUTPUT}*/}
                    {/*/>*/}
                {/*</Row>*/}
                {/*<Row>*/}
                    {/*<LocationInput*/}
                        {/*type={LocationType.LOCATION_UNIT_TEST_OUTPUT}*/}
                    {/*/>*/}
                {/*</Row>*/}
            </Grid>

        );

    }
}

UserConfiguration.propTypes = {
    user:   PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:       state.currentUserRole,
        userContext:    state.currentUserItemContext,
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
UserConfiguration = connect(mapStateToProps)(UserConfiguration);

export default UserConfiguration;