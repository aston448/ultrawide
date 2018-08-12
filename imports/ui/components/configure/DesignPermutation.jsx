
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components

// Ultrawide Services
import { ClientTestOutputLocationServices }         from '../../../apiClient/apiClientTestOutputLocations.js';

import {UltrawideDirectory, LogLevel} from '../../../constants/constants.js';
import {log, getContextID} from "../../../common/utils";
import {UI} from "../../../constants/ui_context_ids";

// Bootstrap
import {Checkbox, Button, ButtonGroup, Modal} from 'react-bootstrap';
import {Form, FormGroup, FormControl, Grid, Row, Col, ControlLabel} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';
import {ClientDesignPermutationServices} from "../../../apiClient/apiClientDesignPermutation";


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Permutation Component - Graphically represents one Design Permutation
//
// ---------------------------------------------------------------------------------------------------------------------

export class DesignPermutation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editing:                    false,
            nameValue:                  this.props.permutation.permutationName
        };

    }

    onSave(role, userContext){

        event.preventDefault();

        const permutation = {
            _id: this .props.permutation._id,
            permutationName: this.state.nameValue,
        };

        ClientDesignPermutationServices.saveDesignPermutation(role, permutation);

        this.setState({editing: false});
    }

    setCurrentPermutation(permutation){

        ClientDesignPermutationServices.selectDesignPermutation(permutation._id)
    }

    onRemove(role, permutation){

        //ClientTestOutputLocationServices.removeLocation(role, location._id);
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

    render() {
        const {permutation, userRole, userContext, currentPermutationId} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Design Permutation');

        const activeClass = (permutation._id === currentPermutationId ? ' location-active' : ' location-inactive');

        const viewInstance = (
            <Grid onClick={() => this.setCurrentPermutation(permutation)}>
                <Row>
                    <div className="output-location-buttons">
                        <Col md={10}>
                            {permutation.permutationName}
                        </Col>
                        <Col md={2}>
                            <ButtonGroup>
                                <Button id={getContextID(UI.BUTTON_EDIT, permutation.permutationName)} bsSize="xs" onClick={() => this.onEdit()}>Edit</Button>
                                <Button id={getContextID(UI.BUTTON_REMOVE, permutation.permutationName)} bsSize="xs" onClick={() => this.onRemove(userRole, permutation)}>Remove</Button>
                            </ButtonGroup>
                        </Col>
                    </div>
                </Row>
            </Grid>
        );

        const editInstance = (
            <Grid>
                <Row>
                    <Col md={10}>
                        <FormControl id={getContextID(UI.INPUT_PERMUTATION_NAME, permutation.permutationName)} type="text" placeholder={permutation.permutationName} value={this.state.nameValue} onChange={(e) => this.onNameChange(e)} />
                    </Col>
                    <Col md={2}>
                        <div className="output-location-buttons">
                            <Button id={getContextID(UI.BUTTON_SAVE, permutation.permutationName)} bsSize="xs" onClick={() => this.onSave(userRole, userContext)}>
                                Save
                            </Button>
                            <Button id={getContextID(UI.BUTTON_CANCEL, permutation.permutationName)} bsSize="xs" onClick={() => this.onCancel()}>
                                Cancel
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );

        if(this.state.editing) {
            return (
                <div className="test-output-location-edit">
                    {editInstance}
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

DesignPermutation.propTypes = {
    permutation:   PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:               state.currentUserRole,
        userContext:            state.currentUserItemContext,
        currentPermutationId:   state.currentUserDesignPermutationId
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(DesignPermutation);

