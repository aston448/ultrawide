// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {ViewType}    from '../../../constants/constants.js';
import ClientDesignComponentServices        from '../../../apiClient/apiClientDesignComponent.js';
import ClientDesignUpdateComponentServices  from '../../../apiClient/apiClientDesignUpdateComponent.js';
import TextLookups                  from '../../../common/lookups.js';

// Bootstrap
import {Grid, Row, Col, InputGroup, Tooltip, OverlayTrigger} from 'react-bootstrap';

import {connect} from "react-redux";

// REDUX services

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Test Summary Container - Contains Test Results Summary for a Scenario
//
// ---------------------------------------------------------------------------------------------------------------------

class TestSummary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accExpectation: props.scenario.requiresAcceptanceTest,
            intExpectation: props.scenario.requiresIntegrationTest,
            unitExpectation: props.scenario.requiresUnitTest
        };
    }

    shouldComponentUpdate(nextProps, nextState){
        return true;
    }

    checkForViewOk(){

        switch(this.props.view){
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                return false;
            default:
                return true;
        }
    }

    toggleAccExpectation(scenarioId, userRole){

        if(this.checkForViewOk()) {

            let newAccState = !this.state.accExpectation;
            let intState = this.state.intExpectation;
            let unitState = this.state.unitExpectation;

            this.setState({accExpectation: newAccState});

            this.updateTestExpectations(scenarioId, userRole, newAccState, intState, unitState);
        }

    }

    toggleIntExpectation(scenarioId, userRole){

        if(this.checkForViewOk()) {

            let accState = this.state.accExpectation;
            let newIntState = !this.state.intExpectation;
            let unitState = this.state.unitExpectation;

            this.setState({intExpectation: newIntState});

            this.updateTestExpectations(scenarioId, userRole, accState, newIntState, unitState);
        }
    }

    toggleUnitExpectation(scenarioId, userRole){

        if(this.checkForViewOk()) {

            let accState = this.state.accExpectation;
            let intState = this.state.intExpectation;
            let newUnitState = !this.state.unitExpectation;

            this.setState({unitExpectation: newUnitState});

            this.updateTestExpectations(scenarioId, userRole, accState, intState, newUnitState);
        }
    }


    updateTestExpectations(scenarioId, userRole, accState, intState, unitState){

        switch(this.props.view){

            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:

                ClientDesignUpdateComponentServices.setScenarioTestExpectations(
                    scenarioId,
                    userRole,
                    accState,
                    intState,
                    unitState
                );
                break;
            default:

                ClientDesignComponentServices.setScenarioTestExpectations(
                    scenarioId,
                    userRole,
                    accState,
                    intState,
                    unitState
                );
                break;
        }

    }

    render() {

        const {testSummaryData, scenario, userContext, userRole} = this.props;

        console.log('Render Test Summary with userRole ' + userRole);

        // Display test expectation options controls
        let testExpectationAcc = scenario.requiresAcceptanceTest ? 'acc-expected' : 'test-not-expected';
        let testExpectationInt = scenario.requiresIntegrationTest ? 'int-expected' : 'test-not-expected';
        let testExpectationUnit = scenario.requiresUnitTest ? 'unit-expected' : 'test-not-expected';

        const tooltipDelay = 1000;

        const tooltipAcceptance = (
            <Tooltip id="modal-tooltip">
                {'Requires Acceptance Test'}
            </Tooltip>
        );

        const tooltipIntegration = (
            <Tooltip id="modal-tooltip">
                {'Requires Integration Test'}
            </Tooltip>
        );

        const tooltipUnit = (
            <Tooltip id="modal-tooltip">
                {'Requires Unit Test'}
            </Tooltip>
        );

        const testExpectations =
            <InputGroup>
                <div></div>
                <InputGroup.Addon>
                    <OverlayTrigger delayShow={tooltipDelay} placement="top" overlay={tooltipAcceptance}>
                        <div className={testExpectationAcc} onClick={() => this.toggleAccExpectation(scenario._id, userRole)}>A</div>
                    </OverlayTrigger>
                </InputGroup.Addon>
                <InputGroup.Addon>
                    <OverlayTrigger delayShow={tooltipDelay} placement="top" overlay={tooltipIntegration}>
                        <div className={testExpectationInt} onClick={() => this.toggleIntExpectation(scenario._id, userRole)}>I</div>
                    </OverlayTrigger>
                </InputGroup.Addon>
                <InputGroup.Addon>
                    <OverlayTrigger delayShow={tooltipDelay} placement="top" overlay={tooltipUnit}>
                        <div className={testExpectationUnit} onClick={() => this.toggleUnitExpectation(scenario._id, userRole)}>U</div>
                    </OverlayTrigger>
                </InputGroup.Addon>
            </InputGroup>;

        if(testSummaryData){

            let accResultClass = 'test-summary-result ' + testSummaryData.accMashTestStatus;
            let intResultClass = 'test-summary-result ' + testSummaryData.intMashTestStatus;

            let unitResultClass = 'test-summary-result mash-not-implemented';
            let unitTestResult = <span className={unitResultClass}>No Tests</span>;

            if(testSummaryData.unitPassCount > 0 || testSummaryData.unitFailCount > 0){

                if(testSummaryData.unitFailCount > 0){
                    unitResultClass = 'test-summary-result mash-fail';
                } else {
                    unitResultClass = 'test-summary-result mash-pass';
                }

                unitTestResult =
                    <span>
                        <span className={unitResultClass}>{'Pass: ' + testSummaryData.unitPassCount}</span>
                        <span className={unitResultClass}>{'Fail: ' + testSummaryData.unitFailCount}</span>
                    </span>;
            }

            return(
                <Grid className="close-grid">
                    <Row>
                        <Col md={3} className="close-col">
                            <span className="test-summary-text">Acc:</span>
                            <span className={accResultClass}>{TextLookups.mashTestStatus(testSummaryData.accMashTestStatus)}</span>
                        </Col>
                        <Col md={3} className="close-col">
                            <span className="test-summary-text">Int:</span>
                            <span className={intResultClass}>{TextLookups.mashTestStatus(testSummaryData.intMashTestStatus)}</span>
                        </Col>
                        <Col md={4} className="close-col">
                            <span className="test-summary-text">Unit:</span>
                            {unitTestResult}
                        </Col>
                        <Col md={2}>
                            {testExpectations}
                        </Col>
                    </Row>
                </Grid>
            )
        } else {
            return(
                <Grid className="close-grid">
                    <Row>
                        <Col md={10} className="close-col">
                            <span className="test-summary-text feature-no-highlight">No test data</span>
                        </Col>
                        <Col md={2}>
                            {testExpectations}
                        </Col>
                    </Row>
                </Grid>
            )
        }

    }
}

TestSummary.propTypes = {
    testSummaryData: PropTypes.object,
    scenario: PropTypes.object
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:        state.currentUserItemContext,
        userRole:           state.currentUserRole,
        view:               state.currentAppView
    }
}

export default connect(mapStateToProps)(TestSummary);
