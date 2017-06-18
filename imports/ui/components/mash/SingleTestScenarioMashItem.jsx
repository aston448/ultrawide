// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import TestResultDetails from './TestResultDetails.jsx';

// Ultrawide Services
import TextLookups  from '../../../common/lookups.js';
import {TestType, DisplayContext}   from '../../../constants/constants.js'

import ClientContainerServices      from '../../../apiClient/apiClientContainerServices.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {InputGroup}     from 'react-bootstrap';
import {Glyphicon}      from 'react-bootstrap';

// REDUX services

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Integration Test Mash Scenario Component - One Scenario showing test results
//
// ---------------------------------------------------------------------------------------------------------------------

export default class SingleTestScenarioMashItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showResultDetails: false
        };

    }

    toggleOverlay(){
        this.setState({showResultDetails: !this.state.showResultDetails});
    }

    getTestResultDetails(userId, designVersionId, scenarioRef, testType){

        return ClientContainerServices.getMashScenarioTestResult(userId, designVersionId, scenarioRef, testType)
    }

    render(){
        const { mashItem, displayContext } = this.props;

        let testStyle = '';
        let testOutcome = '';
        let testType = '';

        switch(displayContext){
            case DisplayContext.MASH_ACC_TESTS:
                break;

            case DisplayContext.MASH_INT_TESTS:
                testStyle = mashItem.intMashTestStatus;
                testOutcome = TextLookups.mashTestStatus(mashItem.intMashTestStatus);
                testType = TestType.INTEGRATION;
                break;

            case DisplayContext.MASH_UNIT_TESTS:
                testStyle = mashItem.unitMashTestStatus;
                testOutcome = TextLookups.mashTestStatus(mashItem.unitMashTestStatus);
                testType = TestType.UNIT;
                break;
        }

        // Get the details so we can display them for the one test for the scenario
        const testResult = this.getTestResultDetails(mashItem.userId, mashItem.designVersionId, mashItem.designScenarioReferenceId, testType);

        if(this.state.showResultDetails) {
            return (
                <Grid className="mash-unit-scenario" onClick={() => this.toggleOverlay()}>
                    <Row>
                        <Col md={10} className="close-col">
                            <InputGroup>
                                <InputGroup.Addon>
                                    <div className={'mash-unit-scenario-glyph ' + testStyle}><Glyphicon glyph='th'/></div>
                                </InputGroup.Addon>
                                <div className={'mash-scenario ' + testStyle}>
                                    {mashItem.scenarioName}
                                </div>
                            </InputGroup>
                        </Col>
                        <Col md={2} className="close-col">
                            <div className={'mash-scenario-result ' + testStyle}>
                                {testOutcome}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <TestResultDetails
                            testResult={testResult}
                        />
                    </Row>
                </Grid>
            )

        } else {
            return (
                <Grid className="mash-unit-scenario" onClick={() => this.toggleOverlay()}>
                    <Row>
                        <Col md={10} className="close-col">
                            <InputGroup>
                                <InputGroup.Addon>
                                    <div className={'mash-unit-scenario-glyph ' + testStyle}><Glyphicon glyph='th'/></div>
                                </InputGroup.Addon>
                                <div className={'mash-scenario ' + testStyle}>
                                    {mashItem.scenarioName}
                                </div>
                            </InputGroup>
                        </Col>
                        <Col md={2} className="close-col">
                            <div className={'mash-scenario-result ' + testStyle}>
                                {testOutcome}
                            </div>
                        </Col>
                    </Row>
                </Grid>
            )
        }
    }

}

SingleTestScenarioMashItem.propTypes = {
    mashItem:       PropTypes.object.isRequired,
    displayContext: PropTypes.string.isRequired
};