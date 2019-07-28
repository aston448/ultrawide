
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import UltrawideAction                      from '../../components/common/UltrawideAction.jsx'

// Ultrawide Services
import {ClientScenarioTestExpectationServices} from "../../../apiClient/apiClientScenarioTestExpectation";

import {ItemType, LogLevel} from '../../../constants/constants.js';
import {log, getContextID} from "../../../common/utils";
import { TextLookups } from "../../../common/lookups";
import {UI} from "../../../constants/ui_context_ids";

// Bootstrap
import {InputGroup, FormControl} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';



// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Editable Test Expectation Value - User wants to test specific values for a Scenario - this is one and is editable
//
// ---------------------------------------------------------------------------------------------------------------------

export class EditableTestExpectationValue extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isEditing: false,
            fieldValue: this.props.expectation.valuePermutationValue
        };

    }

    handleFieldChange(event){
        this.setState({fieldValue: event.target.value});
    }

    handleKeyEvents(event, expectationId) {
        if(event.charCode === 13){
            // Enter Key
            this.saveValue(this.props.userRole, expectationId);
        }
    }

    editValue(){

        this.setState({isEditing: true});
    }

    undoValueChange(){

        this.setState({isEditing: false});
    }

    deleteValue(userRole, expectationId){

        // Remove from Scenario Expectations
        ClientScenarioTestExpectationServices.removeSpecificValueTestExpectation(userRole, expectationId, this.state.fieldValue);
    }

    saveValue(userRole, expectationId){

        // Update Scenario Expectations
        ClientScenarioTestExpectationServices.updateSpecificValueTestExpectation(userRole, expectationId, this.state.fieldValue);

        this.setState({isEditing: false});
    }


    render() {
        const {expectation, testStatus, userContext, userRole} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Scenario Test Expectations');

        let uiContextName='VALUE_VALUE';

        let body = <div></div>;

        let editAction =
            <InputGroup.Addon id={getContextID(UI.OPTION_EDIT, uiContextName)}>
                <UltrawideAction
                    actionType={UI.OPTION_EDIT}
                    uiContextName={uiContextName}
                    actionFunction={() => this.editValue()}
                />
            </InputGroup.Addon>;


        let deleteAction =
            <InputGroup.Addon id={getContextID(UI.OPTION_REMOVE, uiContextName)}>
                <UltrawideAction
                    actionType={UI.OPTION_REMOVE}
                    uiContextName={uiContextName}
                    actionFunction={() => this.deleteValue(userRole, expectation._id)}
                />
            </InputGroup.Addon>;


        let saveAction =
            <InputGroup.Addon id={getContextID(UI.OPTION_SAVE, uiContextName)}>
                <UltrawideAction
                    actionType={UI.OPTION_SAVE}
                    uiContextName={uiContextName}
                    actionFunction={() => this.saveValue(userRole, expectation._id)}
                />
            </InputGroup.Addon>;

        let undoAction =
            <InputGroup.Addon id={getContextID(UI.OPTION_UNDO, uiContextName)}>
                <UltrawideAction
                    actionType={UI.OPTION_UNDO}
                    uiContextName={uiContextName}
                    actionFunction={() => this.undoValueChange()}
                />
            </InputGroup.Addon>;


        if(this.state.isEditing){
            body =
                <div className='value-expectation-active'>
                    <InputGroup>
                        <div className="editableItem">
                            <FormControl
                                type="text"
                                value={this.state.fieldValue}
                                placeholder={expectation.valuePermutationValue}
                                onChange={(event) => this.handleFieldChange(event)}
                                onKeyPress={(event) => this.handleKeyEvents(event, expectation._id)}
                            />
                        </div>
                        <InputGroup.Addon>
                            <div className={'value-expectation-result ' + testStatus}>{TextLookups.mashTestStatus(testStatus)}</div>
                        </InputGroup.Addon>
                        {saveAction}
                        {undoAction}
                    </InputGroup>

                </div>;
        } else {
            body =
                <div className='value-expectation-active'>
                    <InputGroup>
                        <div>{expectation.valuePermutationValue}</div>
                        <InputGroup.Addon>
                            <div className={'value-expectation-result ' + testStatus}>{TextLookups.mashTestStatus(testStatus)}</div>
                        </InputGroup.Addon>
                        {editAction}
                        {deleteAction}
                    </InputGroup>

                </div>;

        }


        return(
            <div>
                {body}
            </div>
        );
    }
}

EditableTestExpectationValue.propTypes = {
    expectation:        PropTypes.object.isRequired,
    testStatus:         PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:               state.currentUserRole,
        userContext:            state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(EditableTestExpectationValue);
