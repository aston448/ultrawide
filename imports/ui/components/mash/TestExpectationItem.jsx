
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
import {ItemType, TestType} from "../../../constants/constants";


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Test Expectation Item - Graphically represents a selectable / expandable item in the test expectation screen
//
// ---------------------------------------------------------------------------------------------------------------------

export class TestExpectationItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected:   false
        };

    }

    addExpectation(itemType, itemId){

        this.setState({selected: true});
    }

    removeExpectation(itemType, itemId){

        this.setState({selected: false});
    }

    render() {
        const {testType, itemType, itemId, itemText, expandable, userContext} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Scenario Test Expectations');

        let body = <div></div>;

        switch(itemType){
            case ItemType.TEST_TYPE:
                if(this.state.selected){
                    body =
                        <div className='test-expectation-active'>
                            <div onClick={() => this.removeExpectation(itemType, itemId)}>{itemText}</div>
                            {/*<DesignPermutationsList*/}
                                {/*designId={userContext.designId}*/}
                            {/*/>*/}
                        </div>;
                } else {
                    body =
                        <div className='test-expectation'>
                            <div onClick={() => this.addExpectation(itemType, itemId)}>{itemText}</div>
                        </div>
                }
                break;
            case ItemType.DESIGN_PERMUTATION:
                if(this.state.selected){
                    body =
                        <div className='test-expectation-active'>
                            <div onClick={() => this.removeExpectation(itemType, itemId)}>{itemText}</div>
                            {/*<DesignPermutationValuesList*/}
                                {/*designVersionId={userContext.designVersionId}*/}
                                {/*permutationId={itemId}*/}
                            {/*/>*/}
                        </div>;
                } else {
                    body =
                        <div className='test-expectation'>
                            <div onClick={() => this.addExpectation(itemType, itemId)}>{itemText}</div>
                        </div>
                }
                break;
            case ItemType.PERMUTATION_VALUE:
                if(this.state.selected){
                    body =
                        <div className='test-expectation-active'>
                            <div onClick={() => this.removeExpectation(itemType, itemId)}>{itemText}</div>
                        </div>;
                } else {
                    body =
                        <div className='test-expectation'>
                            <div onClick={() => this.addExpectation(itemType, itemId)}>{itemText}</div>
                        </div>
                }
                break;
        }

        return(
            <div>
                {body}
            </div>
        );
    }
}

TestExpectationItem.propTypes = {
    testType:   PropTypes.string.isRequired,
    itemType:   PropTypes.string.isRequired,
    itemId:     PropTypes.string.isRequired,
    itemText:   PropTypes.string.isRequired,
    expandable: PropTypes.bool.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:               state.currentUserRole,
        userContext:            state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(TestExpectationItem);

