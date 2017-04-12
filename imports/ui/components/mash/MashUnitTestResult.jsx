// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes, ReactDOM } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import TestResultOverlay from '../dev/TestResultOverlay.jsx';

// Ultrawide Services
import {TestType} from '../../../constants/constants.js';
import TextLookups from '../../../common/lookups.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services

// React DnD - Component is draggable

// Draft JS

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Mash Unit Test Result Component - A single Mocha test result
//
// ---------------------------------------------------------------------------------------------------------------------

export default class MashUnitTestResult extends Component {

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
                        <Row className="unit-test-result">
                            <Col md={4} className="close-col">
                                <div className="unit-test-group">
                                    {testResult.testGroupName + ': '}
                                </div>
                            </Col>
                            <Col md={7} className="close-col">
                                <div className={"unit-test " + testStyle}>
                                    {testResult.testName}
                                </div>
                            </Col>
                            <Col md={1} className="close-col">
                                <div className={"unit-test " + testStyle}>
                                    {TextLookups.mashTestStatus(testResult.testOutcome)}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <TestResultOverlay
                                testType={TestType.UNIT}
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
                        <Row className="unit-test-result">
                            <Col md={4} className="close-col">
                                <div className="unit-test-group">
                                    {testResult.testGroupName + ': '}
                                </div>
                            </Col>
                            <Col md={7} className="close-col">
                                <div className={"unit-test " + testStyle}>
                                    {testResult.testName}
                                </div>
                            </Col>
                            <Col md={1} className="close-col">
                                <div className={"unit-test " + testStyle}>
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

MashUnitTestResult.propTypes = {
    testResult: PropTypes.object.isRequired
};
