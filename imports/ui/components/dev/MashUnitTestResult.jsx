// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes, ReactDOM } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import TestResultOverlay from '../../components/dev/TestResultOverlay.jsx';

// Ultrawide Services
import {ViewType, ComponentType, ViewMode, ScenarioStepStatus, ScenarioStepType, StepContext, MashStatus, MashTestStatus} from '../../../constants/constants.js';
import TextLookups from '../../../common/lookups.js';
import ClientFeatureFileServices from  '../../../apiClient/apiClientFeatureFiles.js';
import ClientMashDataServices from  '../../../apiClient/apiClientMashData.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {InputGroup, Label} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';
import {Tooltip, Overlay, OverlayTrigger} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD - Component is draggable


// Draft JS


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Mash Unit Test Result Component - A single Mocha test result
//
// ---------------------------------------------------------------------------------------------------------------------

export class MashUnitTestResult extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showErrorDetails: false
        };

    }

    showOverlay(){
        this.setState({showErrorDetails: true});
    }

    hideOverlay(){
        this.setState({showErrorDetails: false});
    }

    toggleOverlay(){
        this.setState({showErrorDetails: !this.state.showErrorDetails});
    }

    render(){
        const { testResult, userContext } = this.props;

        const testStyle = testResult.testOutcome;

        // All this is is the Scenario Name plus a list of its scenarios
        return(
            <div onMouseEnter={() => this.showOverlay()} onMouseLeave={() => this.hideOverlay()}>
                <Grid className="close-grid">
                    <Row>
                        <Col md={3} className="close-col">
                            <div className="unit-test-group">
                                {testResult.testGroupName + ': '}
                            </div>
                        </Col>
                        <Col md={7} className="close-col">
                            <div className={"unit-test " + testStyle} >
                                {testResult.testName}
                            </div>
                        </Col>
                        <Col md={2} className="close-col">
                            <div className={"unit-test " + testStyle}>
                                {TextLookups.mashTestStatus(testResult.testOutcome)}
                            </div>
                        </Col>
                    </Row>
                </Grid>
                <Overlay
                    show={this.state.showErrorDetails}
                    onHide={() => this.setState({ showErrorDetails: false })}
                    placement="top"
                    container={this}
                    rootClose={true}
                    target={this}
                >
                    <TestResultOverlay
                        testResult={testResult}
                    />
                </Overlay>
            </div>
        )
    }

}

MashUnitTestResult.propTypes = {
    testResult: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(MashUnitTestResult);
