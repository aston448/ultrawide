// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import TestResultDetails    from './TestResultDetails.jsx';

// Ultrawide Services
import {log} from "../../../common/utils";
import {LogLevel} from "../../../constants/constants";
import { TextLookups }      from '../../../common/lookups.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';


// REDUX services

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Test Result - A single test result for a Scenario with multiple tests
//
// ---------------------------------------------------------------------------------------------------------------------

export default class TestExpectationResult extends Component {

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

        const { testResult, scenarioName } = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Scenario Test Result {} - {}', testResult.testType, testResult.testName);

        const testStyle = testResult.testOutcome;

        let testName = '';

        if(testResult.testName === 'No test found'){
            testName = testResult.testName;
        } else {
            if (testResult.testName === scenarioName) {
                if (testResult.groupName && testResult.groupName !== scenarioName) {
                    if(testResult.suiteName !== 'NONE') {
                        testName = testResult.suiteName + ' - ' + testResult.groupName;
                    } else {
                        testName = testResult.groupName;
                    }
                } else {
                    testName = testResult.suiteName;
                }
            } else {
                if (testResult.groupName && testResult.groupName !== scenarioName) {
                    if(testResult.suiteName !== 'NONE') {
                        testName = testResult.suiteName + ' - ' + testResult.groupName + ' - ' + testResult.testName;
                    } else {
                        if(testResult.groupName !== 'NONE'){
                            testName = testResult.groupName + ' - ' + testResult.testName;
                        } else {
                            testName = testResult.testName;
                        }

                    }
                } else {
                    if(testResult.suiteName !== 'NONE') {
                        testName = testResult.suiteName + ' - ' + testResult.testName;
                    } else {
                        testName = testResult.testName;
                    }

                }
            }
        }

        // Show the full result details if user has toggled them on by clicking
        if(this.state.showResultDetails) {
            return (
                <div onClick={() => this.toggleOverlay()}>
                    <Grid className="close-grid">
                        <Row>
                            <Col md={1} className="close-col">
                                <div className="test-type">
                                    {TextLookups.testType(testResult.testType)}
                                </div>
                            </Col>
                            <Col md={2} className="close-col">
                                <div className="test-perm">
                                    {testResult.permValue}
                                </div>
                            </Col>
                            <Col md={8} className="close-col">
                                <div className={"unit-test " + testStyle}>
                                    {testName}
                                </div>
                            </Col>
                            <Col md={1} className="close-col">
                                <div className={"unit-test-result " + testStyle}>
                                    {TextLookups.mashTestStatus(testResult.testOutcome)}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={3} className="close-col">
                            </Col>
                            <Col md={9} className="close-col">
                                <TestResultDetails
                                    testResult={testResult}
                                />
                            </Col>
                        </Row>
                    </Grid>
                </div>
            );
        } else {
            return (
                <div onClick={() => this.toggleOverlay()}>
                    <Grid className="close-grid">
                        <Row>
                            <Col md={1} className="close-col">
                                <div className="test-type">
                                    {TextLookups.testType(testResult.testType)}
                                </div>
                            </Col>
                            <Col md={2} className="close-col">
                                <div className="test-perm">
                                    {testResult.permValue}
                                </div>
                            </Col>
                            <Col md={8} className="close-col">
                                <div className={"unit-test " + testStyle}>
                                    {testName}
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
            );
        }
    }
}

TestExpectationResult.propTypes = {
    testResult: PropTypes.object.isRequired,
    scenarioName: PropTypes.string.isRequired
};
