
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import TestExpectationItem from "./TestExpectationItem";

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
// Scenario Test Expectations - Test Expectations screen for a Scenario
//
// ---------------------------------------------------------------------------------------------------------------------

export class ScenarioTestExpectations extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };

    }


    render() {
        const {userRole, userContext} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Scenario Test Expectations');

        const layout =
            <Grid>
                <Row>
                    <Col md={4}>
                        <TestExpectationItem
                            testType={TestType.ACCEPTANCE}
                            itemType={ItemType.TEST_TYPE}
                            itemId={'ACC'}
                            itemParentId={'NONE'}
                            itemText={'Acceptance'}
                            expandable={true}
                        />
                    </Col>
                    <Col md={4}>
                        <TestExpectationItem
                            testType={TestType.INTEGRATION}
                            itemType={ItemType.TEST_TYPE}
                            itemId={'INT'}
                            itemParentId={'NONE'}
                            itemText={'Integration'}
                            expandable={true}
                        />
                    </Col>
                    <Col md={4}>
                        <TestExpectationItem
                            testType={TestType.UNIT}
                            itemType={ItemType.TEST_TYPE}
                            itemId={'UNIT'}
                            itemParentId={'NONE'}
                            itemText={'Unit'}
                            expandable={true}
                        />
                    </Col>
                </Row>
            </Grid>;


        return(
            <div>
                {layout}
            </div>
        );
    }
}

ScenarioTestExpectations.propTypes = {
    scenario: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:               state.currentUserRole,
        userContext:            state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(ScenarioTestExpectations);

