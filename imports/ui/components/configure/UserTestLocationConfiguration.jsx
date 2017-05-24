// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import ClientTestOutputLocationServices     from '../../../apiClient/apiClientTestOutputLocations.js';

// Bootstrap
import {Grid, Row, Col, Checkbox} from 'react-bootstrap';

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

    onUnitChange(e, userLocationConfig){

        this.setState({unitChecked: e.target.checked});

        // Save changes
        const userConfiguration = {
            _id:                    userLocationConfig._id,
            locationId:             userLocationConfig.locationId,
            locationName:           userLocationConfig.locationName,
            userId:                 userLocationConfig.userId,
            isUnitLocation:         e.target.checked,
            isIntLocation:          userLocationConfig.isIntLocation,
            isAccLocation:          userLocationConfig.isAccLocation
        };

        ClientTestOutputLocationServices.saveUserConfiguration(userConfiguration);
    }

    onIntChange(e, userLocationConfig){

        this.setState({intChecked: e.target.checked});

        // Save changes
        const userConfiguration = {
            _id:                    userLocationConfig._id,
            locationId:             userLocationConfig.locationId,
            locationName:           userLocationConfig.locationName,
            userId:                 userLocationConfig.userId,
            isUnitLocation:         userLocationConfig.isUnitLocation,
            isIntLocation:          e.target.checked,
            isAccLocation:          userLocationConfig.isAccLocation
        };

        ClientTestOutputLocationServices.saveUserConfiguration(userConfiguration);
    }

    onAccChange(e, userLocationConfig){

        this.setState({accChecked: e.target.checked});

        // Save changes
        const userConfiguration = {
            _id:                    userLocationConfig._id,
            locationId:             userLocationConfig.locationId,
            locationName:           userLocationConfig.locationName,
            userId:                 userLocationConfig.userId,
            isUnitLocation:         userLocationConfig.isUnitLocation,
            isIntLocation:          userLocationConfig.isIntLocation,
            isAccLocation:          e.target.checked
        };

        ClientTestOutputLocationServices.saveUserConfiguration(userConfiguration);

    }


    render() {
        const {userLocation, userRole} = this.props;

        return (
            <Grid>
                <Row className="user-test-location">
                    <Col md={5}>
                        <div>{userLocation.locationName}</div>
                    </Col>
                    <Col md={2}>
                        <div>
                            <Checkbox checked={this.state.unitChecked}
                                      onChange={(e) => this.onUnitChange(e, userLocation)}>
                                Unit Tests
                            </Checkbox>
                        </div>
                    </Col>
                    <Col md={2}>
                        <div>
                            <Checkbox checked={this.state.intChecked}
                                      onChange={(e) => this.onIntChange(e, userLocation)}>
                                Integration Tests
                            </Checkbox>
                        </div>
                    </Col>
                    <Col md={2}>
                        <div>
                            <Checkbox checked={this.state.accChecked}
                                      onChange={(e) => this.onAccChange(e, userLocation)}>
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
