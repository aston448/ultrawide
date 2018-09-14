// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import TestTypeSummary          from "./TestTypeSummary";

// Ultrawide Services
import {LogLevel, UpdateMergeStatus, TestType}    from '../../../constants/constants.js';
import { TextLookups }                  from '../../../common/lookups.js';
import {log}                            from "../../../common/utils";

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services
import {connect} from "react-redux";


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Test Summary Container - Contains Test Results Summary for a Scenario
//
// ---------------------------------------------------------------------------------------------------------------------

class ScenarioTestSummary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accExpectation: this.testExpected(TestType.ACCEPTANCE, this.props.scenarioTestExpectations),
            intExpectation: this.testExpected(TestType.INTEGRATION, this.props.scenarioTestExpectations),
            unitExpectation: this.testExpected(TestType.UNIT, this.props.scenarioTestExpectations),
        };
    }

    testExpected(testType, expectationData){

        let expected = false;

        expectationData.forEach((expectation) => {

            if(expectation.testType === testType){
                expected = true;
            }
        });

        return expected;
    }

    shouldComponentUpdate(nextProps, nextState) {

        return true;
    }

    render() {

        const {testSummaryData, scenarioTestExpectations, scenario} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Test Summary {} ', scenario.componentNameNew);

        console.log('Test summary data is %o', testSummaryData);

        // Display test expectation options controls
        let accExpectationClass = this.state.accExpectation ? 'test-expected' : 'test-not-expected';
        let intExpectationClass = this.state.intExpectation ? 'test-expected' : 'test-not-expected';
        let unitExpectationClass = this.state.unitExpectation ? 'test-expected' : 'test-not-expected';

        if(scenarioTestExpectations.length > 0 && testSummaryData) {

            let accResultClass = 'test-summary-result result-expected';

            if (testSummaryData.accTestPassCount > 0 || testSummaryData.accTestFailCount > 0) {

                if (testSummaryData.accTestFailCount > 0) {
                    accResultClass = 'test-summary-result result-fail';
                    accExpectationClass = 'test-fail';
                } else {
                    if(testSummaryData.accTestPassCount === testSummaryData.accTestExpectedCount) {
                        accResultClass = 'test-summary-result result-pass';
                        accExpectationClass = 'test-pass';
                    } else {
                        accResultClass = 'test-summary-result result-pass';
                        accExpectationClass = 'test-partial';
                    }
                }
            }

            let intResultClass = 'test-summary-result result-expected';

            if (testSummaryData.intTestPassCount > 0 || testSummaryData.intTestFailCount > 0) {

                if (testSummaryData.intTestFailCount > 0) {
                    intResultClass = 'test-summary-result result-fail';
                    intExpectationClass = 'test-fail';
                } else {
                    if(testSummaryData.intTestPassCount === testSummaryData.intTestExpectedCount) {
                        intResultClass = 'test-summary-result result-pass';
                        intExpectationClass = 'test-pass';
                    } else {
                        intResultClass = 'test-summary-result result-pass';
                        intExpectationClass = 'test-partial';
                    }
                }
            }

            let unitResultClass = 'test-summary-result result-expected';

            if (testSummaryData.unitTestPassCount > 0 || testSummaryData.unitTestFailCount > 0) {

                if (testSummaryData.unitTestFailCount > 0) {
                    unitResultClass = 'test-summary-result result-fail';
                    unitExpectationClass = 'test-fail';
                } else {
                    if(testSummaryData.unitTestPassCount === testSummaryData.unitTestExpectedCount) {
                        unitResultClass = 'test-summary-result result-pass';
                        unitExpectationClass = 'test-pass';
                    } else {
                        unitResultClass = 'test-summary-result result-pass';
                        unitExpectationClass = 'test-partial';
                    }
                }
            }

            const testSummaryWithData =
                <Grid className="close-grid">
                    <Row>
                        <Col md={4} className="close-col">
                           <TestTypeSummary
                               testType={'Acc'}
                               statusClass={accResultClass}
                               expectationClass={accExpectationClass}
                               expectedTestCount={testSummaryData.accTestExpectedCount}
                               passingTestCount={testSummaryData.accTestPassCount}
                               failingTestCount={testSummaryData.accTestFailCount}
                               missingTestCount={testSummaryData.accTestMissingCount}
                           />
                        </Col>
                        <Col md={4} className="close-col">
                            <TestTypeSummary
                                testType={'Int'}
                                statusClass={intResultClass}
                                expectationClass={intExpectationClass}
                                expectedTestCount={testSummaryData.intTestExpectedCount}
                                passingTestCount={testSummaryData.intTestPassCount}
                                failingTestCount={testSummaryData.intTestFailCount}
                                missingTestCount={testSummaryData.intTestMissingCount}
                            />
                        </Col>
                        <Col md={4} className="close-col">
                            <TestTypeSummary
                                testType={'Unit'}
                                statusClass={unitResultClass}
                                expectationClass={unitExpectationClass}
                                expectedTestCount={testSummaryData.unitTestExpectedCount}
                                passingTestCount={testSummaryData.unitTestPassCount}
                                failingTestCount={testSummaryData.unitTestFailCount}
                                missingTestCount={testSummaryData.unitTestMissingCount}
                            />
                        </Col>
                    </Row>
                </Grid>;


            return (
                <div>
                    {testSummaryWithData}
                </div>
                );

        } else {

            // Removed components do not require any tests
            if(scenario.updateMergeStatus === UpdateMergeStatus.COMPONENT_REMOVED || scenario.isRemoved){

                return (
                    <div className="test-summary-removed-item">
                        No test data required
                    </div>
                );

            } else {

                // There is no test data for this component yet but still want to be able to see expectations
                const testSummaryWithNoData =
                    <Grid className="close-grid">
                        <Row>
                            <Col md={12} className="close-col">
                                <div className="test-summary-removed-item">No test requirements yet</div>
                            </Col>
                        </Row>
                    </Grid>;

                return (
                    <div>
                        {testSummaryWithNoData}
                    </div>
                );
            }
        }
    }
}

ScenarioTestSummary.propTypes = {
    testSummaryData: PropTypes.object,
    scenarioTestExpectations: PropTypes.array,
    scenario: PropTypes.object.isRequired

};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:        state.currentUserItemContext,
        userRole:           state.currentUserRole,
        view:               state.currentAppView
    }
}

export default connect(mapStateToProps)(ScenarioTestSummary);