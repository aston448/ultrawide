
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components

// Ultrawide Services
import {ClientDesignPermutationServices} from "../../../apiClient/apiClientDesignPermutation";

import {UltrawideDirectory, LogLevel} from '../../../constants/constants.js';
import {log, getContextID} from "../../../common/utils";
import {UI} from "../../../constants/ui_context_ids";

// Bootstrap
import {Checkbox, Button, ButtonGroup, Modal} from 'react-bootstrap';
import {Form, FormGroup, FormControl, Grid, Row, Col, ControlLabel} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';
import {RoleType} from "../../../constants/constants";



// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Permutation Value Component - Graphically represents one Design Permutation Value
//
// ---------------------------------------------------------------------------------------------------------------------

export class DesignPermutationValue extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editing:                    false,
            nameValue:                  this.props.permutationValue.permutationValueName
        };

    }

    onSave(role, userContext){

        const permutationValue = {
            _id: this .props.permutationValue._id,
            designVersionId: userContext.designVersionId,
            permutationId: this.props.permutationValue.permutationId,
            permutationValueName: this.state.nameValue,
        };

        ClientDesignPermutationServices.savePermutationValue(role, permutationValue);

        this.setState({editing: false});
    }

    setCurrentPermutationValue(permutationValue){

        ClientDesignPermutationServices.selectPermutationValue(permutationValue._id)
    }

    onRemove(role, permutationValueId){

        ClientDesignPermutationServices.removePermutationValue(role, permutationValueId);
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
        const {permutationValue, userRole, userContext, currentPermutationValueId} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Permutation Value');

        const activeClass = ' location-active';

        let buttonGroup = <div></div>;

        if(userRole === RoleType.DESIGNER){
            buttonGroup =
                <ButtonGroup>
                    <Button id={getContextID(UI.BUTTON_EDIT, permutationValue.permutationValueName)} bsSize="xs" onClick={() => this.onEdit()}>Edit</Button>
                    <Button id={getContextID(UI.BUTTON_REMOVE, permutationValue.permutationValueName)} bsSize="xs" onClick={() => this.onRemove(userRole, permutationValue._id)}>Remove</Button>
                </ButtonGroup>
        }

        const viewInstance = (
            <Grid onClick={() => this.setCurrentPermutationValue(permutationValue)}>
                <Row>
                    <div className="output-location-buttons">
                        <Col md={10}>
                            {permutationValue.permutationValueName}
                        </Col>
                        <Col md={2}>
                            {buttonGroup}
                        </Col>
                    </div>
                </Row>
            </Grid>
        );

        const editInstance = (
            <Grid>
                <Row>
                    <Col md={10}>
                        <FormControl id={getContextID(UI.INPUT_PERMUTATION_NAME, permutationValue.permutationValueName)} type="text" placeholder={permutationValue.permutationValueName} value={this.state.nameValue} onChange={(e) => this.onNameChange(e)} />
                    </Col>
                    <Col md={2}>
                        <div className="output-location-buttons">
                            <Button id={getContextID(UI.BUTTON_SAVE, permutationValue.permutationValueName)} bsSize="xs" onClick={() => this.onSave(userRole, userContext)}>
                                Save
                            </Button>
                            <Button id={getContextID(UI.BUTTON_CANCEL, permutationValue.permutationValueName)} bsSize="xs" onClick={() => this.onCancel()}>
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

DesignPermutationValue.propTypes = {
    permutationValue:   PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:                   state.currentUserRole,
        userContext:                state.currentUserItemContext,
        currentPermutationValueId:  state.currentUserPermutationValueId
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(DesignPermutationValue);

