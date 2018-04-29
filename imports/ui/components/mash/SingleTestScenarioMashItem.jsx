// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import TestResultDetails from './TestResultDetails.jsx';

// Ultrawide Services
import { TextLookups }  from '../../../common/lookups.js';
import {log} from "../../../common/utils";
import {TestType, DisplayContext, LogLevel}   from '../../../constants/constants.js'

import { ClientDataServices }      from '../../../apiClient/apiClientDataServices.js';

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

    shouldComponentUpdate(nextProps, nextState){

        let shouldUpdate = false;

        // Update if test data has changed
        if(
            nextProps.mashItem.accMashTestStatus !== this.props.mashItem.accMashTestStatus  ||
            nextProps.mashItem.intMashTestStatus !== this.props.mashItem.intMashTestStatus  ||
            nextProps.mashItem.unitMashTestStatus !== this.props.mashItem.unitMashTestStatus ||
            nextState.showResultDetails !== this.state.showResultDetails
        ){
            shouldUpdate = true;
        }

        //console.log('Single Test Scenario Mash Item Should Update: ' + shouldUpdate);

        return shouldUpdate;
    }

    toggleOverlay(){
        this.setState({showResultDetails: !this.state.showResultDetails});
    }

    getTestResultDetails(userId, designVersionId, scenarioRef, testType){

        return ClientDataServices.getMashScenarioTestResult(userId, designVersionId, scenarioRef, testType)
    }

    render(){
        const { mashItem, displayContext } = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Single Test Scenario Mash Item {}', mashItem.scenarioName);

        let testStyle = '';
        let testOutcome = '';
        let testType = '';
        let resultCount = 0;

        switch(displayContext){
            case DisplayContext.MASH_ACC_TESTS:
                testStyle = mashItem.accMashTestStatus;
                testOutcome = TextLookups.mashTestStatus(mashItem.accMashTestStatus);
                testType = TestType.ACCEPTANCE;
                resultCount = mashItem.accTestCount;
                break;

            case DisplayContext.MASH_INT_TESTS:
                testStyle = mashItem.intMashTestStatus;
                testOutcome = TextLookups.mashTestStatus(mashItem.intMashTestStatus);
                testType = TestType.INTEGRATION;
                resultCount = mashItem.intTestCount;
                break;

            case DisplayContext.MASH_UNIT_TESTS:
                testStyle = mashItem.unitMashTestStatus;
                testOutcome = TextLookups.mashTestStatus(mashItem.unitMashTestStatus);
                testType = TestType.UNIT;
                resultCount = mashItem.unitTestCount;
                break;
        }



        // Get the details so we can display them for the one test for the scenario
        const testResult = this.getTestResultDetails(mashItem.userId, mashItem.designVersionId, mashItem.designScenarioReferenceId, testType);

        //console.log('Test style for ' + mashItem.scenarioName + ' is ' + testStyle);

        if (this.state.showResultDetails) {
            return (
                <Grid className="mash-unit-scenario" onClick={() => this.toggleOverlay()}>
                    <Row className="mash-unit-scenario-header">
                        <Col md={11} className="close-col">
                            <InputGroup>
                                <InputGroup.Addon>
                                    <div className={'mash-unit-scenario-glyph ' + testStyle}><Glyphicon glyph='th'/>
                                    </div>
                                </InputGroup.Addon>
                                <div className={'mash-scenario ' + testStyle}>
                                    {mashItem.scenarioName}
                                </div>
                            </InputGroup>
                        </Col>
                        <Col md={1} className="close-col">
                            <div className={'mash-scenario-result ' + testStyle}>
                                {testOutcome}
                            </div>
                        </Col>
                    </Row>
                    <Row className="mash-unit-scenario-header">
                        <TestResultDetails
                            testResult={testResult}
                        />
                    </Row>
                </Grid>
            )

        } else {
            return (
                <Grid className="mash-unit-scenario" onClick={() => this.toggleOverlay()}>
                    <Row className="mash-unit-scenario-header">
                        <Col md={11} className="close-col">
                            <InputGroup>
                                <InputGroup.Addon>
                                    <div className={'mash-unit-scenario-glyph ' + testStyle}><Glyphicon glyph='th'/>
                                    </div>
                                </InputGroup.Addon>
                                <div className={'mash-scenario ' + testStyle}>
                                    {mashItem.scenarioName}
                                </div>
                            </InputGroup>
                        </Col>
                        <Col md={1} className="close-col">
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