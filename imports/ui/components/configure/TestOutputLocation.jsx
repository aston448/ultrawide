
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components


// Ultrawide Services
import ClientTestOutputLocationServices from '../../../apiClient/apiClientTestOutputLocations.js';
import {RoleType, DesignVersionStatus, ItemType, ViewType, ViewMode} from '../../../constants/constants.js';

// Bootstrap
import {Button, ButtonGroup} from 'react-bootstrap';
import {Form, FormGroup, FormControl, Grid, Row, Col, ControlLabel} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Test Output Location Component - Graphically represents one Test Output Location
//
// ---------------------------------------------------------------------------------------------------------------------

export class TestOutputLocation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editing:   false,
            nameValue:  this.props.location.locationName,
            typeValue:  this.props.location.locationType,
            pathVale:   this.props.location.locationPath,

            highlighted: false,
        };

    }

    onSave(){

        this.setState({editing: false});
    }

    onRemove(){

    }

    onEdit(){
        this.setState({editing: true});
    }

    onCancel(){
        this.setState({editing: false});
    }

    render() {
        const {location} = this.props;

        const viewInstance = (
            <div>
                <Grid>
                    <Row>
                        <Col sm={2}>
                            Location Name
                        </Col>
                        <Col sm={10}>
                            {location.locationName}
                        </Col>
                    </Row>
                </Grid>
                <Button id="butEdit" bsSize="xs" onClick={() => this.onEdit()}>Edit</Button>
                <Button id="butRemove" bsSize="xs" onClick={() => this.onRemove()}>Remove</Button>
            </div>
        );

        const formInstance = (
            <Form horizontal onSubmit={() => this.onSave()}>
                <FormGroup controlId="formLocationName">
                    <Col componentClass={ControlLabel} sm={2}>
                        Location Name
                    </Col>
                    <Col sm={10}>
                        <FormControl type="text" placeholder={location.locationName} />
                    </Col>
                </FormGroup>

                <FormGroup controlId="formTypeSelect">
                    <Col componentClass={ControlLabel} sm={2}>
                        Type
                    </Col>
                    <Col sm={10}>
                    <FormControl componentClass="select" placeholder={location.locationType}>
                        <option value="server">SERVER</option>
                        <option value="local">LOCAL</option>
                    </FormControl>
                    </Col>
                </FormGroup>

                <FormGroup controlId="formLocationPath">
                    <Col componentClass={ControlLabel} sm={2}>
                        Location Path
                    </Col>
                    <Col sm={10}>
                        <FormControl type="text" placeholder={location.locationPath} />
                    </Col>
                </FormGroup>

                <FormGroup controlId="formLocationServerName">
                    <Col componentClass={ControlLabel} sm={2}>
                        Location Server
                    </Col>
                    <Col sm={10}>
                        <FormControl type="text" placeholder={location.locationServerName} />
                    </Col>
                </FormGroup>

                <FormGroup controlId="formServerLogin">
                    <Col componentClass={ControlLabel} sm={2}>
                        Server Login
                    </Col>
                    <Col sm={10}>
                        <FormControl type="text" placeholder={location.serverLogin} />
                    </Col>
                </FormGroup>

                <FormGroup controlId="formServerPassword">
                    <Col componentClass={ControlLabel} sm={2}>
                        Password
                    </Col>
                    <Col sm={10}>
                        <FormControl type="password" placeholder="Password" />
                    </Col>
                </FormGroup>

                <Button type="submit">
                    Save
                </Button>
                <Button onClick={() => this.onCancel()}>
                    Cancel
                </Button>

            </Form>


        );

        if(this.state.editing) {
            return (
                <div className="test-output-location-edit">
                    {formInstance}
                </div>
            )
        } else {
            return (
                <div className="test-output-location">
                    {viewInstance}
                </div>
            )
        }

    }
}

TestOutputLocation.propTypes = {
    location: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:                   state.currentUserRole,
        userContext:                state.currentUserItemContext,
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(TestOutputLocation);

