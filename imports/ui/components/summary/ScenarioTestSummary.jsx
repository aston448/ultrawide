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
        let testExpectationAcc = this.state.accExpectation ? 'test-expected' : 'test-not-expected';
        let testExpectationInt = this.state.intExpectation ? 'test-expected' : 'test-not-expected';
        let testExpectationUnit = this.state.unitExpectation ? 'test-expected' : 'test-not-expected';

        // const tooltipDelay = 1000;
        //
        // const tooltipAcceptanceText = this.state.accExpectation ? 'Requires Acceptance test' : 'No Acceptance test required';
        // const tooltipIntegrationText = this.state.intExpectation ? 'Requires Integration test' : 'No Integration test required';
        // const tooltipUnitText = this.state.unitExpectation ? 'Requires Unit test' : 'No Unit test required';

        // const accStatusText = this.state.accExpectation ? TextLookups.mashTestStatus(testSummaryData.accMashTestStatus) : 'Not required';
        // const intStatusText = this.state.intExpectation ? TextLookups.mashTestStatus(testSummaryData.intMashTestStatus) : 'Not required';
        //
        // // Unit test shows number of tests if there are any
        // let unitText = 'No tests';
        //
        // const tooltipAcceptance = (
        //     <Tooltip id="modal-tooltip">
        //         {tooltipAcceptanceText}
        //     </Tooltip>
        // );
        //
        // const tooltipIntegration = (
        //     <Tooltip id="modal-tooltip">
        //         {tooltipIntegrationText}
        //     </Tooltip>
        // );
        //
        // const tooltipUnit = (
        //     <Tooltip id="modal-tooltip">
        //         {tooltipUnitText}
        //     </Tooltip>
        // );
        //

        if(scenarioTestExpectations.length > 0 && testSummaryData) {

            let accResultClass = 'test-summary-result mash-not-implemented';

            if (testSummaryData.accTestPassCount > 0 || testSummaryData.accTestFailCount > 0) {

                if (testSummaryData.accTestFailCount > 0) {
                    accResultClass = 'test-summary-result mash-fail';
                } else {
                    accResultClass = 'test-summary-result mash-pass';
                }
            }

            let intResultClass = 'test-summary-result mash-not-implemented';

            if (testSummaryData.intTestPassCount > 0 || testSummaryData.intTestFailCount > 0) {

                if (testSummaryData.intTestFailCount > 0) {
                    intResultClass = 'test-summary-result mash-fail';
                } else {
                    intResultClass = 'test-summary-result mash-pass';
                }
            }

            let unitResultClass = 'test-summary-result mash-not-implemented';

            if (testSummaryData.unitPassCount > 0 || testSummaryData.unitFailCount > 0) {

                if (testSummaryData.unitFailCount > 0) {
                    unitResultClass = 'test-summary-result mash-fail';
                } else {
                    unitResultClass = 'test-summary-result mash-pass';
                }
            }

            const testSummaryWithData =
                <Grid className="close-grid">
                    <Row>
                        <Col md={4} className="close-col">
                           <TestTypeSummary
                               testType={'Acc'}
                               statusClass={accResultClass}
                               expectationClass={testExpectationAcc}
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
                                expectationClass={testExpectationInt}
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
                                expectationClass={testExpectationUnit}
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
                                <div>No test data yet...</div>
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
