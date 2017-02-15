// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components

// Ultrawide Services
import {RoleType, LocationType, ViewType} from '../../../constants/constants.js'
import ClientTestOutputLocationServices from '../../../apiClient/apiClientTestOutputLocations.js';

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


export class UserTestLocationConfiguration extends Component {

    constructor(props) {
        super(props);

        this.state = {

            unitChecked:    this.props.userLocation.isUnitLocation,
            intChecked:     this.props.userLocation.isIntLocation,
            accChecked:     this.props.userLocation.isAccLocation
        };
    }

    onUnitChange(e, userRole, userLocation){

        this.setState({unitChecked: e.target.checked});

        // Save changes
        const userConfiguration = {
            _id:                    userLocation._id,
            locationId:             userLocation.locationId,
            locationName:           userLocation.locationName,
            locationType:           userLocation.locationType,
            userId:                 userLocation.userId,
            userRole:               userLocation.userRole,
            isUnitLocation:         e.target.checked,
            isIntLocation:          userLocation.isIntLocation,
            isAccLocation:          userLocation.isAccLocation
        };

        ClientTestOutputLocationServices.saveUserConfiguration(userRole, userConfiguration);
    }

    onIntChange(e, userRole, userLocation){

        this.setState({intChecked: e.target.checked});

        // Save changes
        const userConfiguration = {
            _id:                    userLocation._id,
            locationId:             userLocation.locationId,
            locationName:           userLocation.locationName,
            locationType:           userLocation.locationType,
            userId:                 userLocation.userId,
            userRole:               userLocation.userRole,
            isUnitLocation:         userLocation.isUnitLocation,
            isIntLocation:          e.target.checked,
            isAccLocation:          userLocation.isAccLocation
        };

        ClientTestOutputLocationServices.saveUserConfiguration(userRole, userConfiguration);
    }

    onAccChange(e, userRole, userLocation){

        this.setState({accChecked: e.target.checked});

        // Save changes
        const userConfiguration = {
            _id:                    userLocation._id,
            locationId:             userLocation.locationId,
            locationName:           userLocation.locationName,
            locationType:           userLocation.locationType,
            userId:                 userLocation.userId,
            userRole:               userLocation.userRole,
            isUnitLocation:         userLocation.isUnitLocation,
            isIntLocation:          userLocation.isIntLocation,
            isAccLocation:          e.target.checked
        };

        ClientTestOutputLocationServices.saveUserConfiguration(userRole, userConfiguration);

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
                            <Checkbox checked={this.state.unitChecked}
                                      onChange={(e) => this.onUnitChange(e, userRole, userLocation)}>
                                Unit Tests
                            </Checkbox>
                        </div>
                    </Col>
                    <Col md={2}>
                        <div>
                            <Checkbox checked={this.state.intChecked}
                                      onChange={(e) => this.onIntChange(e, userRole, userLocation)}>
                                Integration Tests
                            </Checkbox>
                        </div>
                    </Col>
                    <Col md={2}>
                        <div>
                            <Checkbox checked={this.state.accChecked}
                                      onChange={(e) => this.onAccChange(e, userRole, userLocation)}>
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
