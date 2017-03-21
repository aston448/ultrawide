// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import MashUnitTestContainer from '../../containers/dev/MashUnitTestContainer.jsx';

// Ultrawide Services
import {MashTestStatus, TestType} from '../../../constants/constants.js';

// Bootstrap

// REDUX services

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
        const { testType, testResult } = this.props;

        let resultDisplay = '';

        let testOutcome = '';
        let testError = '';
        let testStack = '';
        let testDuration = '';

        switch(testType){
            case TestType.UNIT:
                testOutcome = testResult.testOutcome;
                testError = testResult.testErrors;
                testStack = testResult.testStack;
                testDuration = testResult.testDuration;
                break;
            case TestType.INTEGRATION:
                testOutcome = testResult.intMashTestStatus;
                testError = testResult.intErrorMessage;
                testStack = testResult.intStackTrace;
                testDuration = testResult.intDuration;
                break;
            case TestType.ACCEPTANCE:
                testOutcome = testResult.accMashTestStatus;
                testError = testResult.accErrorMessage;
                testStack = 'NONE';
                testDuration = testResult.accDuration;
                break;
        }

        switch(testOutcome){
            case  MashTestStatus.MASH_FAIL:

                resultDisplay =
                    <div className="test-fail-overlay">
                        <div className="test-result-header">Error</div>
                        <div className="test-result-error">{testError}</div>
                        <div className="test-result-header">Stack</div>
                        <div className="test-result-stack">{testStack}</div>
                    </div>;
                break;

            case MashTestStatus.MASH_PASS:

                resultDisplay =
                    <div className="test-pass-overlay">
                        <div className="test-result-pass">{'Passed in ' + testDuration + 'ms'}</div>
                    </div>;
                break;

            default:

                resultDisplay =
                    <div className="test-none-overlay">
                        <div className="test-result-none">No test completed yet.  Check that Scenario names match exactly</div>
                    </div>;
                break;
        }

        return(
           resultDisplay
        )
    }

}

TestResultOverlay.propTypes = {
    testType: PropTypes.string.isRequired,
    testResult: PropTypes.object.isRequired
};
