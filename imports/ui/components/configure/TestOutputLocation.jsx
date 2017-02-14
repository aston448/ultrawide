
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
            editing:                false,
            nameValue:              this.props.location.locationName,
            typeValue:              this.props.location.locationType,
            pathValue:              this.props.location.locationPath,
            serverNameValue:        this.props.location.locationServerName,
            serverLoginValue:       this.props.location.serverLogin,
            serverPasswordValue:    this.props.location.serverPassword,
            highlighted:            false,
        };

    }

    onSave(role){

        event.preventDefault();

        console.log("Updating location with name " + this.state.nameValue);

        const location = {
            _id:                    this.props.location._id,
            locationName:           this.state.nameValue,
            locationRawText:        null,
            locationType:           this.state.typeValue,
            locationUserId:         'NONE',
            locationServerName:     this.state.serverNameValue,
            serverLogin:            this.state.serverLoginValue,
            serverPassword:         this.state.serverPasswordValue,
            locationPath:           this.state.pathValue
        };

        ClientTestOutputLocationServices.saveLocation(role, location);

        this.setState({editing: false});
    }

    onRemove(role, location){

        ClientTestOutputLocationServices.removeLocation(role, location._id);
    }

    onEdit(){
        this.setState({editing: true});
    }

    onCancel(){
        this.setState({editing: false});
    }

    onNameChange(e){
        this.setState({nameValue: e.target.value})
    }

    onTypeChange(e){
        this.setState({typeValue: e.target.value})
    }

    onPathChange(e){
        this.setState({pathValue: e.target.value})
    }

    render() {
        const {location, userRole} = this.props;

        const viewInstance = (
            <div>
                <Grid>
                    <Row>
                        <Col sm={2}>
                            {location.locationType}
                        </Col>
                        <Col sm={4}>
                            {location.locationName}
                        </Col>
                        <Col sm={6}>
                            {location.locationPath}
                        </Col>
                    </Row>
                </Grid>
                <div className="output-location-buttons">
                    <Button id="butEdit" bsSize="xs" onClick={() => this.onEdit()}>Edit</Button>
                    <Button id="butRemove" bsSize="xs" onClick={() => this.onRemove(userRole, location)}>Remove</Button>
                </div>
            </div>
        );

        const formInstance = (
            <Form horizontal>
                <FormGroup controlId="formLocationName">
                    <Col componentClass={ControlLabel} sm={2}>
                        Location Name
                    </Col>
                    <Col sm={10}>
                        <FormControl type="text" placeholder={location.locationName} value={this.state.nameValue} onChange={(e) => this.onNameChange(e)} />
                    </Col>
                </FormGroup>

                <FormGroup controlId="formTypeSelect">
                    <Col componentClass={ControlLabel} sm={2}>
                        Type
                    </Col>
                    <Col sm={10}>
                    <FormControl componentClass="select" placeholder={location.locationType} value={this.state.typeValue} onChange={(e) => this.onTypeChange(e)}>
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
                        <FormControl type="text" placeholder={location.locationPath} value={this.state.pathValue} onChange={(e) => this.onPathChange(e)}/>
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

                <Button bsSize="xs" onClick={() => this.onSave(userRole)}>
                    Save
                </Button>
                <Button bsSize="xs" onClick={() => this.onCancel()}>
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

