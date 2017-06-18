// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import TestResultDetails    from './TestResultDetails.jsx';

// Ultrawide Services
import {TestType}       from '../../../constants/constants.js';
import TextLookups      from '../../../common/lookups.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Mash Test Result Component - A single test result for a Scenario with multiple tests
//
// ---------------------------------------------------------------------------------------------------------------------

export default class ScenarioTestResult extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showResultDetails: false
        };
    }

    toggleOverlay(){
        this.setState({showResultDetails: !this.state.showResultDetails});
    }

    render(){
        const { testResult } = this.props;

        const testStyle = testResult.testOutcome;

        // Show the full result details if user has toggled them on by clicking
        if(this.state.showResultDetails) {
            return (
                <div onClick={() => this.toggleOverlay()}>
                    <Grid className="close-grid">
                        <Row>
                            <Col md={4} className="close-col">
                                <div className="unit-test-group">
                                    {testResult.suiteName + ': '}
                                </div>
                            </Col>
                            <Col md={7} className="close-col">
                                <div className={"unit-test " + testStyle}>
                                    {testResult.testName}
                                </div>
                            </Col>
                            <Col md={1} className="close-col">
                                <div className={"unit-test-result " + testStyle}>
                                    {TextLookups.mashTestStatus(testResult.testOutcome)}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <TestResultDetails
                                testResult={testResult}
                            />
                        </Row>
                    </Grid>
                </div>
            )
        } else {
            return (
                <div onClick={() => this.toggleOverlay()}>
                    <Grid className="close-grid">
                        <Row>
                            <Col md={4} className="close-col">
                                <div className="unit-test-group">
                                    {testResult.suiteName + ': '}
                                </div>
                            </Col>
                            <Col md={7} className="close-col">
                                <div className={"unit-test " + testStyle}>
                                    {testResult.testName}
                                </div>
                            </Col>
                            <Col md={1} className="close-col">
                                <div className={"unit-test-result " + testStyle}>
                                    {TextLookups.mashTestStatus(testResult.testOutcome)}
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </div>
            )
        }
    }
}

ScenarioTestResult.propTypes = {
    testResult: PropTypes.object.isRequired
};
