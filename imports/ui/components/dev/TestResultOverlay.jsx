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
// Test Result Overlay - what is sen when hovering over a test result
//
// ---------------------------------------------------------------------------------------------------------------------

export default class TestResultOverlay extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };

    }

    render(){
        const { testResult } = this.props;

        let resultDisplay = '';

        if(testResult.testOutcome === MashTestStatus.MASH_FAIL){

            resultDisplay =
                <div className="test-fail-overlay">
                    <div className="test-result-header">Error</div>
                    <div className="test-result-error">{testResult.testErrors}</div>
                    <div className="test-result-header">Stack</div>
                    <div className="test-result-stack">{testResult.testStack}</div>
                </div>
        } else {

            resultDisplay =
                <div className="test-pass-overlay">
                    <div className="test-result-pass">{testResult.testErrors}</div>
                </div>
        }

        return(
           resultDisplay
        )
    }

}

TestResultOverlay.propTypes = {
    testResult: PropTypes.object.isRequired
};
