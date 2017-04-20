// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import TestResultOverlay from '../dev/TestResultOverlay.jsx';

// Ultrawide Services
import TextLookups  from '../../../common/lookups.js';
import {TestType}   from '../../../constants/constants.js'

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

export default class IntegrationTestScenarioMashItem extends Component {

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
        const { mashItem } = this.props;

        const testStyle = mashItem.intMashTestStatus;
        const testResult = TextLookups.mashTestStatus(mashItem.intMashTestStatus);

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
                                {testResult}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <TestResultOverlay
                            testType={TestType.INTEGRATION}
                            testResult={mashItem}
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
                                {testResult}
                            </div>
                        </Col>
                    </Row>
                </Grid>
            )
        }
    }

}

IntegrationTestScenarioMashItem.propTypes = {
    mashItem: PropTypes.object.isRequired,
};