// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import MashUnitTestContainer from '../../containers/dev/MashUnitTestContainer.jsx';

// Ultrawide Services
import {ViewType, ComponentType, ViewMode, ScenarioStepStatus, ScenarioStepType, StepContext, MashStatus, MashTestStatus} from '../../../constants/constants.js';
import TextLookups from '../../../common/lookups.js';
import ClientFeatureFileServices from  '../../../apiClient/apiClientFeatureFiles.js';
import ClientMashDataServices from  '../../../apiClient/apiClientMashData.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {InputGroup, Label} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

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

        };

    }

    render(){
        const { testResult, userContext } = this.props;

        const testStyle = testResult.testOutcome;

        //TODO - Change these to nice custom overlays
        const errorDetails = (
            <Tooltip id="errorDeets">{testResult.testErrors}</Tooltip>
        );

        const errorStack = (
            <Tooltip id="errorStack">{testResult.testStack}</Tooltip>
        );

        // All this is is the Scenario Name plus a list of its scenarios
        return(
            <Grid className="close-grid">
                <Row>
                    <Col md={3} className="close-col">
                        <div className="unit-test-group">
                            {testResult.testGroupName + ': '}
                        </div>
                    </Col>
                    <Col md={7} className="close-col">
                        <OverlayTrigger placement="left" overlay={errorDetails}>
                            <div className={"unit-test " + testStyle}>
                                {testResult.testName}
                            </div>
                        </OverlayTrigger>
                    </Col>
                    <Col md={2} className="close-col">
                        <OverlayTrigger placement="left" overlay={errorStack}>
                            <div className={"unit-test " + testStyle}>
                                {TextLookups.mashTestStatus(testResult.testOutcome)}
                            </div>
                        </OverlayTrigger>
                    </Col>
                </Row>
            </Grid>
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
