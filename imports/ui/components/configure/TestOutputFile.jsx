
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components


// Ultrawide Services
import ClientTestOutputLocationServices from '../../../apiClient/apiClientTestOutputLocations.js';
import {TestLocationFileType, TestLocationFileTypes, TestRunner, TestRunners} from '../../../constants/constants.js';
import { createSelectionList } from '../../../common/utils.js'

// Bootstrap
import {Button, ButtonGroup} from 'react-bootstrap';
import {Form, FormGroup, FormControl, Grid, Row, Col, ControlLabel} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Test Output File Component - Graphically represents one File for a Test Output Location
//
// ---------------------------------------------------------------------------------------------------------------------

export class TestOutputFile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editing:                false,
            aliasValue:             this.props.locationFile.fileAlias,
            typeValue:              this.props.locationFile.fileType,
            runnerValue:            this.props.locationFile.testRunner,
            nameValue:              this.props.locationFile.fileName,
        };

    }

    onSave(role){

        event.preventDefault();

          const locationFile = {
            _id:                    this.props.locationFile._id,
            locationId:             this.props.currentLocationId,
            fileAlias:              this.state.aliasValue,
            fileDescription:        null,
            fileType:               this.state.typeValue,
            testRunner:             this.state.runnerValue,
            fileName:               this.state.nameValue,
            allFilesOfType:         'NONE'
        };

        ClientTestOutputLocationServices.saveLocationFile(role, locationFile);

        this.setState({editing: false});
    }


    onRemove(role, locationFile){

        ClientTestOutputLocationServices.removeLocationFile(role, locationFile._id);
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

    onRunnerChange(e){
        this.setState({runnerValue: e.target.value})
    }

    onAliasChange(e){
        this.setState({aliasValue: e.target.value})
    }

    render() {
        const {locationFile, userRole, currentLocationId} = this.props;

        const activeClass = (location.Id === currentLocationId ? ' location-active' : ' location-inactive');

        const viewInstance = (
            <div>
                <Grid>
                    <Row>
                        <Col sm={4}>
                            {locationFile.fileAlias}
                        </Col>
                        <Col sm={4}>
                            {locationFile.fileName}
                        </Col>
                        <Col sm={2}>
                            {locationFile.fileType}
                        </Col>
                        <Col sm={2}>
                            {locationFile.testRunner}
                        </Col>
                    </Row>
                </Grid>
                <div className="output-location-buttons">
                    <Button id="butEdit" bsSize="xs" onClick={() => this.onEdit()}>Edit</Button>
                    <Button id="butRemove" bsSize="xs" onClick={() => this.onRemove(userRole, locationFile)}>Remove</Button>
                </div>
            </div>
        );

        const formInstance = (
            <Form horizontal>
                <FormGroup controlId="formFileAlias">
                    <Col componentClass={ControlLabel} sm={2}>
                        File Alias
                    </Col>
                    <Col sm={10}>
                        <FormControl type="text" placeholder={locationFile.fileAlias} value={this.state.aliasValue} onChange={(e) => this.onAliasChange(e)} />
                    </Col>
                </FormGroup>

                <FormGroup controlId="formFileName">
                    <Col componentClass={ControlLabel} sm={2}>
                        File Name
                    </Col>
                    <Col sm={10}>
                        <FormControl type="text" placeholder={locationFile.fileName} value={this.state.nameValue} onChange={(e) => this.onNameChange(e)}/>
                    </Col>
                </FormGroup>

                <FormGroup controlId="formTypeSelect">
                    <Col componentClass={ControlLabel} sm={2}>
                        Type
                    </Col>
                    <Col sm={10}>
                        <FormControl componentClass="select" placeholder={locationFile.fileType} value={this.state.typeValue} onChange={(e) => this.onTypeChange(e)}>
                            {createSelectionList(TestLocationFileTypes)}
                        </FormControl>
                    </Col>
                </FormGroup>

                <FormGroup controlId="formTypeSelect">
                    <Col componentClass={ControlLabel} sm={2}>
                        Test Runner
                    </Col>
                    <Col sm={10}>
                        <FormControl componentClass="select" placeholder={locationFile.testRunner} value={this.state.runnerValue} onChange={(e) => this.onRunnerChange(e)}>
                            {createSelectionList(TestRunners)}
                        </FormControl>
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
                <div className="test-output-file">
                    {viewInstance}
                </div>
            )
        }

    }
}

TestOutputFile.propTypes = {
    locationFile: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:           state.currentUserRole,
        userContext:        state.currentUserItemContext,
        currentLocationId:  state.currentUserTestOutputLocationId
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(TestOutputFile);
