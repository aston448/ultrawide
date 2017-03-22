
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import TestOutputLocation       from '../../components/configure/TestOutputLocation.jsx';
import TestOutputFilesContainer from '../../containers/configure/TestOutputFilesContainer.jsx';
import ItemContainer            from '../../components/common/ItemContainer.jsx';

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

export class TestOutputsScreen extends Component {
    constructor(props) {
        super(props);

    };

    addNewLocation(role, userContext) {
        ClientTestOutputLocationServices.addLocation(role, userContext);
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

    noLocations(){
        return(
            <div className="design-item-note">No Locations Set</div>
        )
    }

    render() {

        const {locationData, userRole, userContext, locationId} = this.props;

        let bodyDataFunction = null;

        if(locationData && locationData.length > 0) {
            bodyDataFunction = () => this.renderLocationsList(locationData);
        } else {
            bodyDataFunction = () => this.noLocations();
        }

        return (
            <Grid>
                <Row>
                    <Col md={6} className="close-col">
                        <ItemContainer
                            headerText={'Test Output Locations'}
                            bodyDataFunction={bodyDataFunction}
                            hasFooterAction={true}
                            footerAction={'Add Location'}
                            footerActionFunction={() => this.addNewLocation(userRole, userContext)}
                        />
                    </Col>
                    <Col md={6} className="col">
                        <TestOutputFilesContainer params={{
                            locationId: locationId
                        }}/>
                    </Col>
                </Row>
            </Grid>
        );


    };
}

TestOutputsScreen.propTypes = {
    locationData:       PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:       state.currentUserRole,
        userContext:    state.currentUserItemContext,
        locationId:     state.currentUserTestOutputLocationId
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default TestOutputsContainer = createContainer(({params}) => {

    const locationData =  ClientContainerServices.getTestOutputLocationData(params.userContext.userId);
    return {locationData: locationData};

}, connect(mapStateToProps)(TestOutputsScreen));