
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignComponentAdd       from '../../components/common/DesignComponentAdd.jsx';
import TestOutputLocation       from '../../components/configure/TestOutputLocation.jsx';
import TestOutputFilesContainer from '../../containers/configure/TestOutputFilesContainer.jsx';


// Ultrawide Services
import {ViewType}                           from '../../../constants/constants.js'
import ClientContainerServices              from '../../../apiClient/apiClientContainerServices.js';
import ClientTestOutputLocationServices     from '../../../apiClient/apiClientTestOutputLocations.js'

// Bootstrap
import {Panel} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Configure Container.  Change user roles and set file paths
//
// ---------------------------------------------------------------------------------------------------------------------

class TestOutputsScreen extends Component {
    constructor(props) {
        super(props);

    };

    addNewLocation(role) {
        ClientTestOutputLocationServices.addLocation(role);
    };

    renderLocationsList(locations){
        return locations.map((location) => {
            return (
                <TestOutputLocation
                    key={location._id}
                    location={location}
                />
            );
        });
    };

    render() {

        const {locationData, userRole, locationId} = this.props;

        const addLocation =
            <div className="design-item-add">
                <DesignComponentAdd
                    addText="Add Location"
                    onClick={ () => this.addNewLocation(userRole)}
                />
            </div>;


        if(locationData && locationData.length > 0) {
            return (
                <Grid>
                    <Row>
                        <Col md={6} className="col">
                            <Panel header="Test Output Locations">
                                {this.renderLocationsList(locationData)}
                                {addLocation}
                            </Panel>
                        </Col>
                        <Col md={6} className="col">
                            <TestOutputFilesContainer params={{
                                locationId: locationId
                            }}/>
                        </Col>
                    </Row>
                </Grid>
            );
        } else {
            return(
                <Grid>
                    <Row>
                        <Col md={6} className="col">
                            <Panel header="Test Output Locations">
                                {addLocation}
                            </Panel>
                        </Col>
                        <Col md={6} className="col">
                            <TestOutputFilesContainer params={{
                                locationId: locationId
                            }}/>
                        </Col>
                    </Row>
                </Grid>
            )
        }

    };
}

TestOutputsScreen.propTypes = {
    locationData:       PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:       state.currentUserRole,
        locationId:     state.currentUserTestOutputLocationId
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
TestOutputsScreen = connect(mapStateToProps)(TestOutputsScreen);



export default TestOutputsContainer = createContainer(({params}) => {

    const locationData =  ClientContainerServices.getTestOutputLocationData();
    return {locationData: locationData};

}, TestOutputsScreen);