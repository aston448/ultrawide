// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {log} from "../../../common/utils";
import {LogLevel} from "../../../constants/constants";
import { ClientUserManagementServices }     from '../../../apiClient/apiClientUserManagement.js';

// Bootstrap
import {Grid, Row, Col, Button} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Management Screen for external REST API
//
// ---------------------------------------------------------------------------------------------------------------------

export class ApiManagement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            key: ClientUserManagementServices.getUserApiKey()
        };
    }

    generateKey(){

        const newKey = ClientUserManagementServices.generateUserApiKey();

        // Display the key
        this.setState({key: newKey});
    }

    render(){

        log((msg) => console.log(msg), LogLevel.PERF, 'Render API Management');

        return (
            <div>
                <div className="design-item-note">Generate a new API access key here...</div>
                <Grid>
                    <Row>
                        <Col md={3}>
                            <div>Current Key:</div>
                        </Col>
                        <Col md={3}>
                            <div className="api-key">{this.state.key}</div>
                        </Col>
                        <Col md={3}>
                            <Button bsStyle="default" onClick={() => this.generateKey()}>Generate New Key</Button>
                        </Col>
                    </Row>
                </Grid>
                <div className="design-item-note">Keep this key safe and use it as parameter 'key' in the header of REST API calls</div>
            </div>
        );
    }
}

ApiManagement.propTypes = {

};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {

    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(ApiManagement);