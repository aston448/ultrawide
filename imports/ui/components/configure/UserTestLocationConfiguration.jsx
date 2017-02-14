// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import RoleSelect                           from  './UserRole.jsx';
import LocationInput                        from  './LocationInput.jsx';

// Ultrawide Services
import {RoleType, LocationType, ViewType} from '../../../constants/constants.js'

// Bootstrap
import {Grid, Row, Col, FormControl, Checkbox} from 'react-bootstrap';

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
export class UserTestLocationConfiguration extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };
    }



    render() {
        const {userLocation, userRole} = this.props;

        return (
            <Grid>
                <Row className="user-test-location">
                    <Col md={2}>
                       <div>{userLocation.locationType}</div>
                    </Col>
                    <Col md={3}>
                        <div>{userLocation.locationName}</div>
                    </Col>
                    <Col md={2}>
                        <div>
                            <Checkbox>
                                Unit Tests
                            </Checkbox>
                        </div>
                    </Col>
                    <Col md={2}>
                        <div>
                            <Checkbox>
                                Integration Tests
                            </Checkbox>
                        </div>
                    </Col>
                    <Col md={2}>
                        <div>
                            <Checkbox>
                                Acceptance Tests
                            </Checkbox>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );

    }
}

UserTestLocationConfiguration.propTypes = {
    userLocation:   PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole: state.currentUserRole
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(UserTestLocationConfiguration);
