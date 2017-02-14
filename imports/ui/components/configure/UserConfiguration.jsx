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
import {Grid, Row, Col, FormControl} from 'react-bootstrap';

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
export class UserConfiguration extends Component {

    constructor(props) {
        super(props);

        this.state = {
            unitTestLocation:           this.props.unitLocation,
            integrationTestLocation:    this.props.integrationLocation,
            acceptanceTestLocation:     this.props.acceptanceLocation
        };
    }


    createSelectItems(userLocations) {
        console.log('Locations count is ' + userLocations.length);
        let items = [];
        userLocations.forEach((location) => {
            console.log('Adding ' + location.locationName);
            items.push(<option key={location._id} value={location.locationName}>{location.locationName}</option>);
        });
        return items;
    }


    render() {
        const {userLocations, userRole} = this.props;

        return (
            <Grid>
                <Row>
                   <Col md={6}>
                       <div>Test output locations</div>
                   </Col>
                </Row>

                <Row>
                    <Col md={2}>
                        <div>Unit Test Output:</div>
                    </Col>
                    <Col md={4}>
                        <FormControl componentClass="select">
                            {this.createSelectItems(userLocations)}
                        </FormControl>
                    </Col>
                </Row>
                <Row>
                    <Col md={2}>
                        <div>Integration Test Output:</div>
                    </Col>
                    <Col md={4}>
                        <FormControl componentClass="select">
                            {this.createSelectItems(userLocations)}
                        </FormControl>
                    </Col>
                </Row>
                <Row>
                    <Col md={2}>
                        <div>Acceptance Test Output:</div>
                    </Col>
                    <Col md={4}>
                        <FormControl componentClass="select">
                            {this.createSelectItems(userLocations)}
                        </FormControl>
                    </Col>
                </Row>
            </Grid>
        );

    }
}

UserConfiguration.propTypes = {
    userLocations:   PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole: state.currentUserRole
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(UserConfiguration);
