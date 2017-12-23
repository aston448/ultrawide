
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components

// Ultrawide Services
import ClientTestOutputLocationServices         from '../../../apiClient/apiClientTestOutputLocations.js';

import {UltrawideDirectory, TestLocationTypes, TestLocationAccessTypes} from '../../../constants/constants.js';
import { createSelectionList }                  from '../../../common/reactUtils.js';

// Bootstrap
import {Checkbox, Button, ButtonGroup, Modal} from 'react-bootstrap';
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
            isSharedValue:          this.props.location.locationIsShared,
            pathValue:              this.props.location.locationPath,
            showModal:              false
        };

    }

    onSave(role, userContext){

        event.preventDefault();

        // The user id is set if creating a non-shared resource
        let locationUserId = '';

        // If sharing it no longer owned by user.  If making private make sure user is set
        if(this.state.isSharedValue){
            locationUserId = 'NONE';
        } else {
            locationUserId = userContext.userId;
        }

        // Make sure all paths are saved with a final /
        let pathValue = this.state.pathValue;

        if(!pathValue.endsWith('/')){
            pathValue = pathValue + '/';
        }

        const testOutputDir = UltrawideDirectory.TEST_OUTPUT_DIR;

        const location = {
            _id:                    this.props.location._id,
            locationName:           this.state.nameValue,
            locationIsShared:       this.state.isSharedValue,
            locationUserId:         locationUserId,
            locationPath:           pathValue,
            locationFullPath:       this.props.dataStore + testOutputDir + pathValue
        };

        ClientTestOutputLocationServices.saveLocation(role, location);

        this.setState({editing: false});
    }

    setCurrentLocation(location){

        ClientTestOutputLocationServices.selectLocation(location._id)
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

    onIsSharedChange(e){
        this.setState({isSharedValue: e.target.checked})
    }

    onPathChange(e){
        this.setState({pathValue: e.target.value})
    }

    onUpload(event){
        ClientTestOutputLocationServices.uploadTestFile(event.target.files[0], this.props.location.locationName);
    }

    onShowModal(){
        this.setState({showModal: true});
    }

    onCloseModal() {
        this.setState({ showModal: false });
    }

    render() {
        const {location, dataStore, userRole, userContext, currentLocationId} = this.props;

        const activeClass = (location._id === currentLocationId ? ' location-active' : ' location-inactive');

        const sharedText = this.state.isSharedValue ? 'Shared' : 'Not Shared';

        const modalOkButton =
            <Button onClick={() => this.onRemove(userRole, location)}>OK</Button>;

        const modalCancelButton =
            <Button onClick={() => this.onCloseModal()}>Cancel</Button>;

        const confirmDeleteModal =
            <Modal show={this.state.showModal} onHide={() => this.onCloseModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Test Location</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="merge-alert">{'You are about to remove the location "' + location.locationName + '"'}</p>
                    <p className="merge-normal">This will delete all the location file definitions you have defined for this location</p>
                    <p className="merge-normal">Note that if there are actual files at this location on the server they will not be deleted</p>
                    <p className="merge-alert">This action cannot be undone.  Are you sure you want to proceed?</p>
                </Modal.Body>
                <Modal.Footer>
                    {modalOkButton}
                    {modalCancelButton}
                </Modal.Footer>
            </Modal>;

        const viewInstance = (
            <div onClick={() => this.setCurrentLocation(location)}>
                <Grid>
                    <Row>
                        <Col sm={4}>
                            {location.locationName}
                        </Col>
                        <Col sm={6}>
                            {location.locationFullPath}
                        </Col>
                        <Col sm={2}>
                            {sharedText}
                        </Col>
                    </Row>
                </Grid>
                <div className="output-location-buttons">
                    <div className="file-picker">
                        <div className="design-item-note">Upload test result files to this location... </div>
                        <input className="design-item-note" id="files" type="file" onChange={(e) => this.onUpload(e)}/>
                    </div>
                    <ButtonGroup>
                        <Button id="butEdit" bsSize="xs" onClick={() => this.onEdit()}>Edit</Button>
                        <Button id="butRemove" bsSize="xs" onClick={() => this.onShowModal()}>Remove</Button>
                    </ButtonGroup>
                </div>
                {confirmDeleteModal}
            </div>
        );

        const formInstance = (
            <Form horizontal>
                <FormGroup controlId="formLocationName">
                    <Col componentClass={ControlLabel} sm={2}>
                        Location Is Shared
                    </Col>
                    <Col sm={10}>
                        <Checkbox checked={this.state.isSharedValue}
                                  onChange={(e) => this.onIsSharedChange(e)}>
                        </Checkbox>
                    </Col>
                </FormGroup>

                <FormGroup controlId="formLocationName">
                    <Col componentClass={ControlLabel} sm={2}>
                        Location Name
                    </Col>
                    <Col sm={10}>
                        <FormControl type="text" placeholder={location.locationName} value={this.state.nameValue} onChange={(e) => this.onNameChange(e)} />
                    </Col>
                </FormGroup>

                <FormGroup controlId="formLocationPath">
                    <Col componentClass={ControlLabel} sm={2}>
                        Location Path
                    </Col>
                    <Col componentClass={ControlLabel} sm={6}>
                        {dataStore + UltrawideDirectory.TEST_OUTPUT_DIR}
                    </Col>
                    <Col sm={4}>
                        <FormControl type="text" placeholder={location.locationPath} value={this.state.pathValue} onChange={(e) => this.onPathChange(e)}/>
                    </Col>
                </FormGroup>

                <Button bsSize="xs" onClick={() => this.onSave(userRole, userContext)}>
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
                <div className={'test-output-location' + activeClass}>
                    {viewInstance}
                </div>
            )
        }

    }
}

TestOutputLocation.propTypes = {
    location:   PropTypes.object.isRequired,
    dataStore:  PropTypes.string.isRequired
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
export default connect(mapStateToProps)(TestOutputLocation);

