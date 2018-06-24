// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {ViewType, LogLevel, UpdateMergeStatus}    from '../../../constants/constants.js';
import {log} from "../../../common/utils";

import { ClientDesignComponentServices }        from '../../../apiClient/apiClientDesignComponent.js';
import { ClientDesignUpdateComponentServices }  from '../../../apiClient/apiClientDesignUpdateComponent.js';

import { TextLookups }                  from '../../../common/lookups.js';

// Bootstrap
import {Grid, Row, Col, InputGroup, Tooltip, OverlayTrigger} from 'react-bootstrap';

import {connect} from "react-redux";
import {MashTestStatus, UpdateScopeType} from "../../../constants/constants";



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


    shouldComponentUpdate(nextProps, nextState) {

        let shouldUpdate = false;

        // Update if test expectation has changed.
        if(this.state.accExpectation !== nextState.accExpectation || this.state.intExpectation !== nextState.intExpectation || this.state.unitExpectation !== nextState.unitExpectation){
            shouldUpdate = true;
        }

        //console.log('Test Summary Should Update: ' + shouldUpdate);

        return shouldUpdate;
    }

    componentDidUpdate(){

        //console.log('TEST SUMMARY UPDATED with scenario ' + this.props.scenario);
        this.updateTestExpectations(this.props.scenario, this.props.userRole, this.props.userContext, this.props.displayContext, this.state.accExpectation, this.state.intExpectation, this.state.unitExpectation);
    }

    checkForViewOk(){

        switch(this.props.view){
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                return false;
            case ViewType.DESIGN_UPDATE_EDIT:
                // OK only for in scope scenarios in DU
                return (this.props.inScope);
            default:
                return true;
        }
    }

    toggleAccExpectation(){

        if (this.checkForViewOk()) {

            let newAccState = !this.state.accExpectation;

            this.setState({accExpectation: newAccState});

        }


    }

    toggleIntExpectation(){

        if(this.checkForViewOk()) {

            let newIntState = !this.state.intExpectation;

            this.setState({intExpectation: newIntState});

        }
    }

    toggleUnitExpectation(){

        if(this.checkForViewOk()) {

            let newUnitState = !this.state.unitExpectation;

            this.setState({unitExpectation: newUnitState});

        }
    }


    updateTestExpectations(scenario, userRole, userContext, displayContext, accState, intState, unitState){

        switch(this.props.view){

            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:

                if(scenario.scopeType === UpdateScopeType.SCOPE_IN_SCOPE) {
                    ClientDesignUpdateComponentServices.setScenarioTestExpectations(
                        scenario,
                        userRole,
                        userContext,
                        displayContext,
                        accState,
                        intState,
                        unitState
                    );
                }
                break;
            default:

                //console.log('Set expectations ' + userRole + ' and user context ' + userContext);

                ClientDesignComponentServices.setScenarioTestExpectations(
                    scenario,
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

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Test Summary {} ', scenario.componentNameNew);

        // Display test expectation options controls
        let testExpectationAcc = this.state.accExpectation ? 'test-expected' : 'test-not-expected';
        let testExpectationInt = this.state.intExpectation ? 'test-expected' : 'test-not-expected';
        let testExpectationUnit = this.state.unitExpectation ? 'test-expected' : 'test-not-expected';

        const tooltipDelay = 1000;

        const tooltipAcceptanceText = this.state.accExpectation ? 'Requires Acceptance test' : 'Click to require Acceptance test';
        const tooltipIntegrationText = this.state.intExpectation ? 'Requires Integration test' : 'Click to require Integration test';
        const tooltipUnitText = this.state.unitExpectation ? 'Requires Unit test' : 'Click to require Unit test';

        const accStatusText = this.state.accExpectation ? TextLookups.mashTestStatus(testSummaryData.accMashTestStatus) : 'Not required';
        const intStatusText = this.state.intExpectation ? TextLookups.mashTestStatus(testSummaryData.intMashTestStatus) : 'Not required';

        // Unit test shows number of tests if there are any
        let unitText = 'No tests';

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

            if(testSummaryData.unitPassCount > 0 || testSummaryData.unitFailCount > 0){
                unitText = 'Pass: ' + testSummaryData.unitPassCount + ' Fail: ' + testSummaryData.unitFailCount;
            }

            const unitStatusText = this.state.unitExpectation ? unitText : 'Not required';

            // Update the expectations to pass / fail if a test done
            if(this.state.accExpectation && testSummaryData.accMashTestStatus === MashTestStatus.MASH_PASS){
                testExpectationAcc = 'test-pass';
            }

            if(this.state.intExpectation && testSummaryData.intMashTestStatus === MashTestStatus.MASH_PASS){
                testExpectationInt = 'test-pass';
            }

            if(this.state.accExpectation && testSummaryData.accMashTestStatus === MashTestStatus.MASH_FAIL){
                testExpectationAcc = 'test-fail';
            }

            if(this.state.intExpectation && testSummaryData.intMashTestStatus === MashTestStatus.MASH_FAIL){
                testExpectationInt = 'test-fail';
            }

            if(this.state.unitExpectation) {
                if (testSummaryData.unitFailCount > 0) {
                    testExpectationUnit = 'test-fail';
                } else {
                    if (testSummaryData.unitPassCount > 0) {
                        testExpectationUnit = 'test-pass';
                    }
                }
            }

            // And the actual result text
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
                                    {accStatusText}
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
                                    {intStatusText}
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
                                    {unitStatusText}
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
                                                 onClick={() => this.toggleAccExpectation()}>
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
                                                 onClick={() => this.toggleIntExpectation()}>
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
                                                 onClick={() => this.toggleUnitExpectation()}>
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
    displayContext: PropTypes.string,
    inScope: PropTypes.bool
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
