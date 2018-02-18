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
import {UpdateMergeStatus} from "../../../constants/constants";

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

    toggleAccExpectation(scenarioId, userRole, userContext, displayContext){

        if(this.checkForViewOk()) {

            let newAccState = !this.state.accExpectation;
            let intState = this.state.intExpectation;
            let unitState = this.state.unitExpectation;

            this.setState({accExpectation: newAccState});

            console.log('Toggle ACC with userRole ' + userRole + ' and user context ' + userContext);

            this.updateTestExpectations(scenarioId, userRole, userContext, displayContext, newAccState, intState, unitState);
        }

    }

    toggleIntExpectation(scenarioId, userRole, userContext, displayContext){

        if(this.checkForViewOk()) {

            let accState = this.state.accExpectation;
            let newIntState = !this.state.intExpectation;
            let unitState = this.state.unitExpectation;

            this.setState({intExpectation: newIntState});

            this.updateTestExpectations(scenarioId, userRole, userContext, displayContext, accState, newIntState, unitState);
        }
    }

    toggleUnitExpectation(scenarioId, userRole, userContext, displayContext){

        if(this.checkForViewOk()) {

            let accState = this.state.accExpectation;
            let intState = this.state.intExpectation;
            let newUnitState = !this.state.unitExpectation;

            this.setState({unitExpectation: newUnitState});

            this.updateTestExpectations(scenarioId, userRole, userContext, displayContext, accState, intState, newUnitState);
        }
    }


    updateTestExpectations(scenarioId, userRole, userContext, displayContext, accState, intState, unitState){

        switch(this.props.view){

            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:

                ClientDesignUpdateComponentServices.setScenarioTestExpectations(
                    scenarioId,
                    userRole,
                    userContext,
                    displayContext,
                    accState,
                    intState,
                    unitState
                );
                break;
            default:

                console.log('Set expectations ' + userRole + ' and user context ' + userContext);

                ClientDesignComponentServices.setScenarioTestExpectations(
                    scenarioId,
                    userRole,
                    userContext,
                    displayContext,
                    accState,
                    intState,
                    unitState
                );
                break;
        }

    }

    render() {

        const {testSummaryData, scenario, displayContext, userContext, userRole} = this.props;

        console.log('Render Test Summary with userRole ' + userRole + ' and user context ' + userContext);

        // Display test expectation options controls
        let testExpectationAcc = scenario.requiresAcceptanceTest ? 'acc-expected' : 'test-not-expected';
        let testExpectationInt = scenario.requiresIntegrationTest ? 'int-expected' : 'test-not-expected';
        let testExpectationUnit = scenario.requiresUnitTest ? 'unit-expected' : 'test-not-expected';

        const tooltipDelay = 1000;

        const tooltipAcceptanceText = scenario.requiresAcceptanceTest ? 'Requires Acceptance test' : 'Click to require Acceptance test';
        const tooltipIntegrationText = scenario.requiresIntegrationTest ? 'Requires Integration test' : 'Click to require Integration test';
        const tooltipUnitText = scenario.requiresUnitTest ? 'Requires Unit test' : 'Click to require Unit test';

        const tooltipAcceptance = (
            <Tooltip id="modal-tooltip">
                {tooltipAcceptanceText}
            </Tooltip>
        );

        const tooltipIntegration = (
            <Tooltip id="modal-tooltip">
                {tooltipIntegrationText}
            </Tooltip>
        );

        const tooltipUnit = (
            <Tooltip id="modal-tooltip">
                {tooltipUnitText}
            </Tooltip>
        );


        if(testSummaryData) {

            let accResultClass = 'test-summary-result ' + testSummaryData.accMashTestStatus;
            let intResultClass = 'test-summary-result ' + testSummaryData.intMashTestStatus;

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
                            <InputGroup className="scenario-test-summary">
                                <InputGroup.Addon className="scenario-test-requirement">
                                    <OverlayTrigger delayShow={tooltipDelay} placement="top"
                                                    overlay={tooltipAcceptance}>
                                        <div className={testExpectationAcc} onClick={() => this.toggleAccExpectation(scenario._id, userRole, userContext, displayContext)}>
                                            Acc
                                        </div>
                                    </OverlayTrigger>
                                </InputGroup.Addon>
                                <div className={accResultClass}>
                                    {TextLookups.mashTestStatus(testSummaryData.accMashTestStatus)}
                                </div>
                            </InputGroup>
                        </Col>
                        <Col md={4} className="close-col">
                            <InputGroup className="scenario-test-summary">
                                <InputGroup.Addon className="scenario-test-requirement">
                                    <OverlayTrigger delayShow={tooltipDelay} placement="top"
                                                    overlay={tooltipIntegration}>
                                        <div className={testExpectationInt} onClick={() => this.toggleIntExpectation(scenario._id, userRole, userContext, displayContext)}>
                                            Int
                                        </div>
                                    </OverlayTrigger>
                                </InputGroup.Addon>
                                <div className={intResultClass}>
                                    {TextLookups.mashTestStatus(testSummaryData.intMashTestStatus)}
                                </div>
                            </InputGroup>
                        </Col>
                        <Col md={4} className="close-col">
                            <InputGroup className="scenario-test-summary">
                                <InputGroup.Addon className="scenario-test-requirement">
                                    <OverlayTrigger delayShow={tooltipDelay} placement="top" overlay={tooltipUnit}>
                                        <div className={testExpectationUnit} onClick={() => this.toggleUnitExpectation(scenario._id, userRole, userContext, displayContext)}>
                                            Unit
                                        </div>
                                    </OverlayTrigger>
                                </InputGroup.Addon>
                                <div className={unitResultClass}>
                                    {'Pass: ' + testSummaryData.unitPassCount + ' Fail: ' + testSummaryData.unitFailCount}
                                </div>
                            </InputGroup>
                        </Col>
                    </Row>
                </Grid>;


            return (
                <div>
                    {testSummaryWithData}
                </div>
                );

        } else{

            // Removed components do not require any tests
            if(scenario.updateMergeStatus === UpdateMergeStatus.COMPONENT_REMOVED || scenario.isRemoved){

                return (
                    <div className="test-summary-removed-item">
                        No test data required
                    </div>
                );

            } else {
                // There is no test data for this component yet but still want to be able to set expectations
                const testSummaryWithNoData =
                    <Grid className="close-grid">
                        <Row>
                            <Col md={4} className="close-col">
                                <InputGroup className="scenario-test-summary">
                                    <InputGroup.Addon className="scenario-test-requirement">
                                        <OverlayTrigger delayShow={tooltipDelay} placement="top"
                                                        overlay={tooltipAcceptance}>
                                            <div className={testExpectationAcc}
                                                 onClick={() => this.toggleAccExpectation(scenario._id, userRole, userContext, displayContext)}>
                                                Acc
                                            </div>
                                        </OverlayTrigger>
                                    </InputGroup.Addon>
                                    <div className="test-summary-result mash-not-implemented">
                                        No test data
                                    </div>
                                </InputGroup>
                            </Col>
                            <Col md={4} className="close-col">
                                <InputGroup className="scenario-test-summary">
                                    <InputGroup.Addon className="scenario-test-requirement">
                                        <OverlayTrigger delayShow={tooltipDelay} placement="top"
                                                        overlay={tooltipIntegration}>
                                            <div className={testExpectationInt}
                                                 onClick={() => this.toggleIntExpectation(scenario._id, userRole, userContext, displayContext)}>
                                                Int
                                            </div>
                                        </OverlayTrigger>
                                    </InputGroup.Addon>
                                    <div className="test-summary-result mash-not-implemented">
                                        No test data
                                    </div>
                                </InputGroup>
                            </Col>
                            <Col md={4} className="close-col">
                                <InputGroup className="scenario-test-summary">
                                    <InputGroup.Addon className="scenario-test-requirement">
                                        <OverlayTrigger delayShow={tooltipDelay} placement="top" overlay={tooltipUnit}>
                                            <div className={testExpectationUnit}
                                                 onClick={() => this.toggleUnitExpectation(scenario._id, userRole, userContext, displayContext)}>
                                                Unit
                                            </div>
                                        </OverlayTrigger>
                                    </InputGroup.Addon>
                                    <div className="test-summary-result mash-not-implemented">
                                        No test data
                                    </div>
                                </InputGroup>
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

TestSummary.propTypes = {
    testSummaryData: PropTypes.object,
    scenario: PropTypes.object,
    displayContext: PropTypes.string
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
