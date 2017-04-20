// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import AppHeader from '../../components/app/AppHeader.jsx';
import AppBody from '../../components/app/AppBody.jsx';

// Ultrawide Services
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';

// Bootstrap
import {Grid} from 'react-bootstrap';
import {Row} from 'react-bootstrap';

// REDUX services

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Application Data Container -  Ensures data is subscribed to passed down to all application paths
//
// ---------------------------------------------------------------------------------------------------------------------


// App component - represents the whole app
class AppData extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        const {isLoading} = this.props;

        if(isLoading){
            return(
                <div>Loading data...</div>
            );
        } else {
            return (
                <Grid className="main-grid" fluid={true}>
                    <Row>
                        <AppHeader
                        />
                    </Row>
                    <Row>
                        <AppBody
                        />
                    </Row>
                </Grid>
            );
        }
    }
}

AppData.propTypes = {
    isLoading: PropTypes.bool.isRequired
};

export default AppDataContainer = createContainer(({params}) => {

    // Get the basic list of supported users and their settings ready for the login
    return ClientContainerServices.getApplicationData();

}, AppData);

