
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components

// Ultrawide Services
import { ClientTestOutputLocationServices }         from '../../../apiClient/apiClientTestOutputLocations.js';
import { TestLocationFileTypes, TestRunners, TestLocationFileStatus, LogLevel}    from '../../../constants/constants.js';
import { createSelectionList}                   from '../../../common/reactUtils.js';
import { TextLookups }                              from '../../../common/lookups.js';
import { getDateTimeString, log}                from '../../../common/utils.js';


// Bootstrap
import {Button} from 'react-bootstrap';
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

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Test Output File');

        let fileClass = (locationFile.fileStatus === TestLocationFileStatus.FILE_UPLOADED ? ' file-uploaded' : ' file-missing');

        const dateString = getDateTimeString(new Date(locationFile.lastUpdated));

        // Check for uploaded files being old
        if(locationFile.fileStatus === TestLocationFileStatus.FILE_UPLOADED){
            const now = new Date();

            const timeDiff = Math.abs(now.getTime() - new Date(locationFile.lastUpdated).getTime());
            const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if(diffDays > 1){
                fileClass = ' file-old';
            }
        }

        const viewInstance = (
            <div className={fileClass}>
                <Grid>
                    <Row>
                        <Col sm={4}>
                            {locationFile.fileAlias}
                        </Col>
                        <Col sm={3}>
                            {locationFile.fileName}
                        </Col>
                        <Col sm={2}>
                            {TextLookups.testFileType(locationFile.fileType)}
                        </Col>
                        <Col sm={2}>
                            {locationFile.testRunner}
                        </Col>
                    </Row>
                    <Row className="file-status">
                        <Col sm={2}>
                            STATUS:
                        </Col>
                        <Col sm={3}>
                            {TextLookups.fileStatus(locationFile.fileStatus)}
                        </Col>
                        <Col sm={7}>
                            {dateString}
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
                <div>
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

