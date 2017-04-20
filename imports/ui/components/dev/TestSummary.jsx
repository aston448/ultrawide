// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {}    from '../../../constants/constants.js';

import TextLookups                  from '../../../common/lookups.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';

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

    }

    shouldComponentUpdate(nextProps, nextState){
        return true;
    }


    render() {

        const {testSummaryData, userContext} = this.props;

        if(testSummaryData){

            let accResultClass = 'test-summary-result ' + testSummaryData.accTestStatus;
            let intResultClass = 'test-summary-result ' + testSummaryData.intTestStatus;

            let unitResultClass = 'test-summary-result mash-not-implemented';
            let unitTestResult = <span className={unitResultClass}>No Tests</span>;

            if(testSummaryData.unitTestPassCount > 0 || testSummaryData.unitTestFailCount > 0){

                if(testSummaryData.unitTestFailCount > 0){
                    unitResultClass = 'test-summary-result mash-fail';
                } else {
                    unitResultClass = 'test-summary-result mash-pass';
                }

                unitTestResult =
                    <span>
                        <span className={unitResultClass}>{'Pass: ' + testSummaryData.unitTestPassCount}</span>
                        <span className={unitResultClass}>{'Fail: ' + testSummaryData.unitTestFailCount}</span>
                    </span>;
            }



            return(
                <Grid className="close-grid">
                    <Row>
                        <Col md={4} className="close-col">
                            <span className="test-summary-text">Accept:</span>
                            <span className={accResultClass}>{TextLookups.mashTestStatus(testSummaryData.accTestStatus)}</span>
                        </Col>
                        <Col md={4} className="close-col">
                            <span className="test-summary-text">Integ:</span>
                            <span className={intResultClass}>{TextLookups.mashTestStatus(testSummaryData.intTestStatus)}</span>
                        </Col>
                        <Col md={4} className="close-col">
                            <span className="test-summary-text">Unit:</span>
                            {unitTestResult}
                        </Col>
                    </Row>
                </Grid>
            )
        } else {
            return(
                <Grid className="close-grid">
                    <Row>
                        <Col md={12} className="close-col">
                            <span className="test-summary-text feature-no-highlight">No test data</span>
                        </Col>
                    </Row>
                </Grid>
            )
        }

    }
}

TestSummary.propTypes = {
    testSummaryData: PropTypes.object
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:        state.currentUserItemContext
    }
}

export default TestSummary;
