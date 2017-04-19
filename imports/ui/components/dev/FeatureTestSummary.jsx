// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';


// Ultrawide Collections


// Ultrawide GUI Components


// Ultrawide Services
import {FeatureTestSummaryStatus, ViewType}    from '../../../constants/constants.js';
import {log} from '../../../common/utils.js';

// Bootstrap
import {Glyphicon} from 'react-bootstrap';
import {Grid, Row, Col} from 'react-bootstrap';

// REDUX services

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Feature Test Summary Container - Contains Test Results Summary for a Feature
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

        const {testSummaryData, view, userContext} = this.props;

        if(testSummaryData){

            let resultClassPass = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
            let resultClassFail = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
            let resultClassNotTested = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
            let resultFeatureSummary = '';

            // Get data for view
            let passCount = 0;
            let failCount = 0;
            let noTestCount = 0;

            switch(view){
                case ViewType.DESIGN_PUBLISHED_VIEW:
                case ViewType.DESIGN_UPDATABLE_VIEW:
                case ViewType.DESIGN_UPDATE_EDIT:
                    // Whole DV
                    passCount = testSummaryData.featureTestPassCount;
                    failCount = testSummaryData.featureTestFailCount;
                    noTestCount = testSummaryData.featureNoTestCount;
                    break;
                case ViewType.DESIGN_UPDATE_VIEW:
                    // DU Only
                    passCount = testSummaryData.duFeatureTestPassCount;
                    failCount = testSummaryData.duFeatureTestFailCount;
                    noTestCount = testSummaryData.duFeatureNoTestCount;
                    break;
                case ViewType.WORK_PACKAGE_BASE_VIEW:
                case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                case ViewType.DEVELOP_BASE_WP:
                case ViewType.DEVELOP_UPDATE_WP:
                    // WP Only
                    passCount = testSummaryData.wpFeatureTestPassCount;
                    failCount = testSummaryData.wpFeatureTestFailCount;
                    noTestCount = testSummaryData.wpFeatureNoTestCount;
                    break;

            }

            // If no Scenarios at all indicate design deficit
            if(noTestCount === 0 && failCount === 0 && passCount === 0){
                resultFeatureSummary = 'feature-summary-no-scenarios';
            } else {
                // If any fails it's a FAIL
                if (failCount > 0) {
                    resultClassPass = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_NO_HIGHLIGHT;
                    resultClassFail = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGHLIGHT_FAIL;
                    resultFeatureSummary = 'feature-summary-bad';
                } else {
                    // Highlight passes if any and no fails
                    if (passCount > 0) {
                        resultClassPass = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGHLIGHT_PASS;
                    } else {
                        // No passes or failures so highlight number of tests
                        resultClassNotTested = 'test-summary-result ' + FeatureTestSummaryStatus.FEATURE_HIGHLIGHT_NO_TEST;
                    }
                    if (noTestCount > 0) {
                        if (testSummaryData.featureTestPassCount > 0) {
                            resultFeatureSummary = 'feature-summary-mmm';
                        } else {
                            resultFeatureSummary = 'feature-summary-meh';
                        }
                    } else {
                        // All passes and no pending tests
                        resultFeatureSummary = 'feature-summary-good';
                    }
                }
            }

            return(
                <Grid className="close-grid">
                    <Row>
                        <Col md={4} className="close-col">
                            <span className={resultClassPass}>Passing Tests:</span>
                            <span className={resultClassPass}>{passCount}</span>
                        </Col>
                        <Col md={4} className="close-col">
                            <span className={resultClassFail}>Failing Tests:</span>
                            <span className={resultClassFail}>{failCount}</span>
                        </Col>
                        <Col md={3} className="close-col">
                            <span className={resultClassNotTested}>Not Tested:</span>
                            <span className={resultClassNotTested}>{noTestCount}</span>
                        </Col>
                        <Col md={1} className="close-col">
                            <div className={resultFeatureSummary}><Glyphicon glyph="th"/></div>
                        </Col>
                    </Row>
                </Grid>
            )
        } else {
            return(
                <Grid className="close-grid">
                    <Row>
                        <Col md={12} className="close-col">
                            <span className="test-summary-text feature-no-highlight">No data yet</span>
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
        userContext:        state.currentUserItemContext,
        view:               state.currentAppView
    }
}

export default TestSummary;
