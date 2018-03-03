// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components

// Ultrawide Services
import {MashTestStatus, LogLevel} from '../../../constants/constants.js';
import {log} from "../../../common/utils";

// Bootstrap

// REDUX services

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Test Result Overlay - what is sen when hovering over a test result
//
// ---------------------------------------------------------------------------------------------------------------------

export default class TestResultDetails extends Component {

    constructor(props) {
        super(props);

        this.state = {

        };

    }

    render(){
        const { testResult } = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Test Result Details {}', testResult.testName);

        let resultDisplay = '';

        if(testResult){

            switch(testResult.testOutcome){
                case  MashTestStatus.MASH_FAIL:

                    resultDisplay =
                        <div className="test-fail-overlay">
                            <div className="test-result-header">Error</div>
                            <div className="test-result-error">{testResult.testError}</div>
                            <div className="test-result-error">{testResult.testErrorReason}</div>
                            <div className="test-result-header">Stack</div>
                            <div className="test-result-stack">{testResult.testStack}</div>
                        </div>;
                    break;

                case MashTestStatus.MASH_PASS:

                    resultDisplay =
                        <div className="test-pass-overlay">
                            <div className="test-result-pass">{'Passed in ' + testResult.testDuration + 'ms'}</div>
                        </div>;
                    break;

                case MashTestStatus.MASH_PENDING:

                    resultDisplay =
                        <div className="test-none-overlay">
                            <div className="test-result-none">Test is pending.  Not yet implemented</div>
                        </div>;
                    break;

                default:

                    resultDisplay =
                        <div className="test-none-overlay">
                            <div className="test-result-none">No test completed yet.</div>
                        </div>;
                    break;
            }
        } else {

            resultDisplay =
                <div className="test-none-overlay">
                    <div className="test-result-none">No test found.  Check that Scenario names match exactly if you think there is a test</div>
                </div>;
        }

        return(
           resultDisplay
        )
    }

}

TestResultDetails.propTypes = {
    testResult: PropTypes.object
};
